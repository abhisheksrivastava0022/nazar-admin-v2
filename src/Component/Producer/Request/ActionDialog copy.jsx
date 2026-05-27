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
            // actionType === "verified" ? "success.lighter" : "error.lighter",
            actionType === "send" ? "success.lighter" : "error.lighter",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          // color={actionType === "verified" ? "info.main" : "error.main"}
          color={actionType === "send" ? "info.main" : "error.main"}
        >
          {actionType}
          {actionType === "send" ? "Send Request" : "Reject Request"}
          {/* {actionType === "verified" ? "Verify Request" : "Reject Request"} */}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedRequest && (
          <>
            <Alert
              // severity={actionType === "verified" ? "info" : "error"}
              severity={actionType === "send" ? "info" : "error"}
              sx={{ mb: 3 }}
            >
              {/* {actionType === "verified" */}
              {actionType === "send"
                ? "Are you sure you want to Send this request?"
                : "Are you sure you want to reject this request?"}
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

            {/* {actionType === "verified" && (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="intermediaries-select-label">
                    Intermediaries Involved
                  </InputLabel>
                  <Select
                    labelId="intermediaries-select-label"
                    id="intermediaries-select"
                    multiple
                    value={selectedIntermediaries}
                    onChange={handleIntermediaryChange}
                    input={<OutlinedInput label="Intermediaries Involved" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const intermediary = intermediaries.find(
                            (i) => i.id === value,
                          );
                          return (
                            <Chip
                              key={value}
                              label={intermediary?.name || value}
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {intermediaries.map((intermediary) => (
                      <MenuItem key={intermediary.id} value={intermediary.id}>
                        <Checkbox
                          checked={
                            selectedIntermediaries.indexOf(intermediary.id) > -1
                          }
                        />
                        <Typography variant="body2">
                          {intermediary.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    You can select multiple intermediaries
                  </Typography>
                </FormControl>

                {selectedIntermediaries.length > 0 && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Selected {selectedIntermediaries.length} intermediary
                    {selectedIntermediaries.length !== 1 ? "ies" : ""}
                  </Alert>
                )}
              </>
            )} */}

            {/* Comment Field */}
            <TextField
              fullWidth
              label={
                // actionType === "verified"
                actionType === "send"
                  ? "Add any verification comments..."
                  : "Please provide a reason for rejection..."
              }
              multiline
              rows={3}
              value={comment}
              onChange={onCommentChange}
              placeholder={
                // actionType === "verified"
                actionType === "send"
                  ? "Add any verification comments..."
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
          // color={actionType === "verified" ? "info" : "error"}
          color={actionType === "send" ? "info" : "error"}
          sx={{ borderRadius: 2 }}
          disabled={actionLoading}
          startIcon={actionLoading && <CircularProgress size={20} />}
        >
          {actionLoading
            ? "Processing..."
            : actionType === "send"
              ? "Send"
              : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
