import React from "react";
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
} from "@mui/material";

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
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                elevation: 3,
                sx: {
                    borderRadius: 2,
                    minWidth: 500,
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
                            sx={{ mt: 2 }}
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
                    onClick={onConfirm}
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