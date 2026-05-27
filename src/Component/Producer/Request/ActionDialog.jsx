import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput,
} from "@mui/material";
import ApiClient from "../../../API/ApiClient";

const intermediaries = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Google" },
  { id: 3, name: "YouTube" },
  { id: 4, name: "Telegram" },
  { id: 5, name: "Twitter/X" },
  { id: 6, name: "Instagram" },
  { id: 7, name: "WhatsApp" },
  { id: 8, name: "LinkedIn" },
];

const ActionDialog = ({
  open,
  onClose,
  onConfirm,
  selectedRequest,
  actionType,
  comment,
  onCommentChange,
  actionLoading,
  statusConfig,
}) => {
  const { getRequestApi } = ApiClient();
  const [intermediaries, setIntermediaries] = useState([]);
  const [selectedIntermediaries, setSelectedIntermediaries] = useState([]);
  const [selectedRule, setSelectedRule] = useState("");

  const loadData = async () => {
    const response = await getRequestApi("api/intermediary");
    if (response.status) {
      setIntermediaries(response.data);
      let selectedIntermediary = [];
      for (const data of response.data) {
        if (data.selectondefault) {
          selectedIntermediary.push(data.id);
        }
      }
      setSelectedIntermediaries(selectedIntermediary);
    }
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedIntermediaries([]);
      setSelectedRule("");
      loadData();
    }
  }, [open]);

  const handleConfirm = () => {
    // Prepare additional data to send with confirmation
    const additionalData = {
      intermediary_ids: selectedIntermediaries, // Changed from intermediary_id to intermediary_ids
      rule_id: selectedRule,
    };

    // Pass the additional data to onConfirm
    onConfirm(additionalData);
  };

  const handleIntermediaryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedIntermediaries(
      // On autofill we get a stringified value
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const urlsArray =
    typeof selectedRequest?.urls === "string"
      ? JSON.parse(selectedRequest.urls)
      : selectedRequest?.urls || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",

          bgcolor:
            Object.values(statusConfig).find((item) => item.slug === actionType)
              ?.bg || "#F9FAFB",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color={
            Object.values(statusConfig).find((item) => item.slug === actionType)
              ?.text || "#111827"
          }
        >
          {`${
            Object.values(statusConfig).find((item) => item.slug === actionType)
              ?.label || "Update"
          } Request`}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedRequest && (
          <>
            {/* <Alert
              severity={actionType === "send" ? "info" : "error"}
              sx={{ mb: 3 }}
            >
              {actionType === "send"
                ? "Are you sure you want to Send this request?"
                : "Are you sure you want to reject this request?"}
            </Alert> */}

            <Alert
              severity={
                actionType === "rejected"
                  ? "error"
                  : actionType === "clarification_required"
                    ? "warning"
                    : "info"
              }
              sx={{
                mb: 3,
                borderRadius: 2,
                alignItems: "center",

                bgcolor:
                  Object.values(statusConfig).find(
                    (item) => item.slug === actionType,
                  )?.bg || "#F9FAFB",

                color:
                  Object.values(statusConfig).find(
                    (item) => item.slug === actionType,
                  )?.text || "#111827",

                "& .MuiAlert-icon": {
                  color:
                    Object.values(statusConfig).find(
                      (item) => item.slug === actionType,
                    )?.text || "#111827",
                },
              }}
            >
              {`Are you sure you want to mark this request as "${
                Object.values(statusConfig).find(
                  (item) => item.slug === actionType,
                )?.label || "Updated"
              }"?`}
            </Alert>

            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Request Details:
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>URLs:</strong>
                <ol style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                  {urlsArray.map((url, index) => (
                    <li key={index}>
                      <Typography variant="body2">{url}</Typography>
                    </li>
                  ))}
                </ol>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Description:</strong> {selectedRequest.description}
              </Typography>
            </Box>

            {/* Comment Field */}
            <TextField
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={onCommentChange}
              variant="outlined"
              label={`Add comments for ${
                Object.values(statusConfig).find(
                  (item) => item.slug === actionType,
                )?.label || "this action"
              }`}
              placeholder={`Enter comments related to "${
                Object.values(statusConfig).find(
                  (item) => item.slug === actionType,
                )?.label || "this action"
              }"...`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fff",
                },
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
          disabled={actionLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={actionLoading}
          startIcon={
            actionLoading ? (
              <CircularProgress
                size={18}
                sx={{
                  color: "inherit",
                }}
              />
            ) : null
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,

            backgroundColor:
              Object.values(statusConfig).find(
                (item) => item.slug === actionType,
              )?.text || "#1976d2",

            color: "#fff",

            "&:hover": {
              opacity: 0.9,
              backgroundColor:
                Object.values(statusConfig).find(
                  (item) => item.slug === actionType,
                )?.text || "#1565c0",
            },

            "&:disabled": {
              opacity: 0.7,
              color: "#fff",
            },
          }}
        >
          {actionLoading
            ? "Processing..."
            : `Mark as ${
                Object.values(statusConfig).find(
                  (item) => item.slug === actionType,
                )?.label || "Update"
              }`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
