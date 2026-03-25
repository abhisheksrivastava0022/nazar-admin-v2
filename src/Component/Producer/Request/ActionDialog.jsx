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

// Rules data
const rules = [
  { id: 1, name: "Rule 1: Prohibition of obscene content" },
  { id: 2, name: "Rule 2: Protection of minors" },
  { id: 3, name: "Rule 3: Copyright infringement" },
  { id: 4, name: "Rule 4: Defamation and hate speech" },
  { id: 5, name: "Rule 5: Privacy violation" },
  { id: 6, name: "Rule 6: Misinformation and fake news" },
  { id: 7, name: "Rule 7: Intellectual property rights" },
  { id: 8, name: "Rule 8: National security concerns" },
  { id: 9, name: "Rule 9: Impersonation and fraud" },
  { id: 10, name: "Rule 10: Spam and malicious content" },
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
  const [selectedIntermediary, setSelectedIntermediary] = useState("");
  const [selectedRule, setSelectedRule] = useState("");
  const [noticeSent, setNoticeSent] = useState(false);
  const [actionTaken, setActionTaken] = useState("");

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedIntermediary("");
      setSelectedRule("");
      setNoticeSent(false);
      setActionTaken("");
    }
  }, [open]);

  const handleConfirm = () => {
    // Prepare additional data to send with confirmation
    const additionalData = {
      intermediary_id: selectedIntermediary,
      rule_id: selectedRule,
      notice_sent: noticeSent,
      action_taken: actionTaken,
    };

    // Pass the additional data to onConfirm
    onConfirm(additionalData);
  };

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
            actionType === "approve" ? "success.lighter" : "error.lighter",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color={actionType === "approve" ? "success.main" : "error.main"}
        >
          {actionType === "approve" ? "Approve Request" : "Reject Request"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {selectedRequest && (
          <>
            <Alert
              severity={actionType === "approve" ? "success" : "error"}
              sx={{ mb: 3 }}
            >
              {actionType === "approve"
                ? "Are you sure you want to approve this request?"
                : "Are you sure you want to reject this request?"}
            </Alert>

            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Request Details:
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>URL:</strong> {selectedRequest.url}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Description:</strong> {selectedRequest.description}
              </Typography>
            </Box>

            {/* Intermediary Selection - Single */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Intermediary Involved</InputLabel>
              <Select
                value={selectedIntermediary}
                onChange={(e) => setSelectedIntermediary(e.target.value)}
                label="Intermediary Involved"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {intermediaries.map((intermediary) => (
                  <MenuItem key={intermediary.id} value={intermediary.id}>
                    {intermediary.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rule Selection - Single */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Rule Violated</InputLabel>
              <Select
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                label="Rule Violated"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {rules.map((rule) => (
                  <MenuItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notice Sent Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={noticeSent}
                  onChange={(e) => setNoticeSent(e.target.checked)}
                  color="primary"
                />
              }
              label="Notice sent to intermediary"
              sx={{ mb: 2, display: "block" }}
            />

            {/* Action Taken Field */}
            <TextField
              fullWidth
              label="Action Taken"
              multiline
              rows={2}
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="Describe the action taken against the content..."
              variant="outlined"
              sx={{ mb: 3 }}
            />

            {/* Comment Field */}
            <TextField
              fullWidth
              label="Add Comment (Optional)"
              multiline
              rows={3}
              value={comment}
              onChange={onCommentChange}
              placeholder={
                actionType === "approve"
                  ? "Add any approval comments..."
                  : "Please provide a reason for rejection..."
              }
              variant="outlined"
            />
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
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
          color={actionType === "approve" ? "success" : "error"}
          sx={{ borderRadius: 2 }}
          disabled={actionLoading}
          startIcon={actionLoading && <CircularProgress size={20} />}
        >
          {actionLoading
            ? "Processing..."
            : actionType === "approve"
              ? "Approve"
              : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
