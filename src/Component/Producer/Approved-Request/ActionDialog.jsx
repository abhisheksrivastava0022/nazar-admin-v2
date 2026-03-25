import React, { useState, useEffect, useRef } from "react";
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
    otpLoading,
    onSendOtp,
    otpSent,
    otp,
    onOtpChange,
    otpError, // New prop for OTP error

}) => {
    // Create an array of refs for OTP inputs
    const otpInputs = useRef([]);

    // Local OTP state as array of 6 digits
    const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

    // Combine OTP array into a single string for parent component
    useEffect(() => {
        const combinedOtp = otpArray.join("");
        if (onOtpChange) {
            onOtpChange({ target: { value: combinedOtp } });
        }
    }, [otpArray, onOtpChange]);

    // Reset OTP array when dialog opens
    useEffect(() => {
        if (open) {
            setOtpArray(["", "", "", "", "", ""]);
            // Focus on first input
            setTimeout(() => {
                if (otpInputs.current[0]) {
                    otpInputs.current[0].focus();
                }
            }, 100);
        }
    }, [open]);

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, "");

        // Update the OTP array
        const newOtpArray = [...otpArray];
        newOtpArray[index] = numericValue.slice(0, 1);
        setOtpArray(newOtpArray);

        // Auto-focus next input if current field is filled
        if (numericValue && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    // Handle key press for backspace navigation
    const handleKeyPress = (index, e) => {
        if (e.key === "Backspace" && !otpArray[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    // Handle paste event for OTP
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
        const pastedNumbers = pastedData.replace(/[^0-9]/g, "").split("");

        const newOtpArray = [...otpArray];
        for (let i = 0; i < Math.min(pastedNumbers.length, 6); i++) {
            newOtpArray[i] = pastedNumbers[i];
        }
        setOtpArray(newOtpArray);

        // Focus on the next empty field or last field
        const lastFilledIndex = Math.min(pastedNumbers.length - 1, 5);
        if (lastFilledIndex < 5 && pastedNumbers.length < 6) {
            otpInputs.current[lastFilledIndex + 1].focus();
        } else {
            otpInputs.current[5].focus();
        }
    };

    const handleSendOtp = () => {
        if (onSendOtp) {
            onSendOtp();
        }
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
                        {otpError && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                                onClose={() => {
                                    if (onOtpChange) {
                                        onOtpChange({ target: { value: "" } });
                                    }
                                }}
                            >
                                {otpError}
                            </Alert>
                        )}
                        {/* OTP Section with 6 Textboxes */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                OTP Verification
                            </Typography>

                            {/* Send OTP Button */}
                            <Box sx={{ mb: 3 }}>
                                <Button
                                    onClick={handleSendOtp}
                                    variant="contained"
                                    color="primary"
                                    disabled={otpLoading || otpSent}
                                    sx={{
                                        minWidth: "150px",
                                        borderRadius: 2
                                    }}
                                >
                                    {otpLoading ? (
                                        <CircularProgress size={24} />
                                    ) : otpSent ? (
                                        "OTP Sent ✓"
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                                {otpSent && (
                                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block" }}>
                                        OTP has been sent to the producer's registered email/phone
                                    </Typography>
                                )}
                            </Box>

                            {/* 6 OTP Textboxes */}
                            {otpSent && (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Enter the 6-digit verification code
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            justifyContent: "center",
                                            mb: 2,
                                            flexWrap: "wrap"
                                        }}
                                        onPaste={handlePaste}
                                    >
                                        {otpArray.map((digit, index) => (
                                            <TextField
                                                key={index}
                                                inputRef={(el) => (otpInputs.current[index] = el)}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyPress(index, e)}
                                                variant="outlined"
                                                inputProps={{
                                                    maxLength: 1,
                                                    style: {
                                                        textAlign: "center",
                                                        fontSize: "24px",
                                                        padding: "12px 0",
                                                        width: "60px",
                                                    },
                                                    pattern: "[0-9]*",
                                                    inputMode: "numeric",
                                                }}
                                                sx={{
                                                    width: "60px",
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                    },
                                                }}
                                                disabled={actionLoading}
                                                autoFocus={index === 0 && otpSent}
                                            />
                                        ))}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
                                        Didn't receive OTP? You can request a new one
                                    </Typography>
                                </>
                            )}
                        </Box>

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
                    disabled={actionLoading || !otpSent || otpArray.join("").length !== 6}
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