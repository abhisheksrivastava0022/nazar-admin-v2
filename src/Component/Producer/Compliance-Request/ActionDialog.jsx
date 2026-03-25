import React, { useState } from "react";
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
} from "@mui/material";
import ApiClient from "../../../API/ApiClient";

// Intermediaries data
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
}) => {
  const { getRequestApi } = ApiClient();
  const [intermediaries, setIntermediaries] = useState([]);
  const [selectedIntermediary, setSelectedIntermediary] = useState("");
  const [selectedRule, setSelectedRule] = useState("");

  const loadData = async () => {
    const response = await getRequestApi("api/intermediary");
    if (response.status) {
      setIntermediaries(response.data);
    }
  };

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedIntermediary("");
      setSelectedRule("");
      loadData();
    }
  }, [open]);

  const handleConfirm = () => {
    // Prepare additional data to send with confirmation
    const additionalData = {
      intermediary_id: selectedIntermediary,
      rule_id: selectedRule,
    };

    // Pass the additional data to onConfirm
    onConfirm(additionalData);
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
            actionType === "verified" ? "success.lighter" : "error.lighter",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color={actionType === "verified" ? "info.main" : "error.main"}
        >
          {actionType === "verified" ? "Compliance Request" : "Reject Request"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedRequest && (
          <>
            <Alert
              severity={actionType === "verified" ? "info" : "error"}
              sx={{ mb: 3 }}
            >
              Is Compliance Completed?
            </Alert>

            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Request Details:
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>URL:</strong>
                <ol>
                  {urlsArray.map((url, index) => (
                    <li key={index}>{url}</li>
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
              label={
                actionType === "verified"
                  ? "Add any Compliance comments..."
                  : "Please provide a reason for rejection..."
              }
              multiline
              rows={3}
              value={comment}
              onChange={onCommentChange}
              placeholder={
                actionType === "verified"
                  ? "Add any Compliance comments..."
                  : "Please provide a reason for rejection..."
              }
              variant="outlined"
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
          color={actionType === "verified" ? "info" : "error"}
          sx={{ borderRadius: 2 }}
          disabled={actionLoading}
          startIcon={actionLoading && <CircularProgress size={20} />}
        >
          {actionLoading
            ? "Processing..."
            : actionType === "verified"
              ? "Compliance"
              : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
