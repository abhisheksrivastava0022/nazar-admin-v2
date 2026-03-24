import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Tooltip,
    IconButton,
    Chip,
    Stack,
    Box,
    CircularProgress,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Download as DownloadIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
} from "@mui/icons-material";

const RequestTable = ({
    data,
    loading,
    BASE_URL_API,
    onViewDetails,  // Make sure this prop name matches
    onApprove,
    onReject,
    formatDate,
    getStatusChip,
}) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (data.length === 0) {
        return (
            <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No requests found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters
                </Typography>
            </Box>
        );
    }

    // Debug: Log when component renders
    console.log("RequestTable rendered, onViewDetails:", typeof onViewDetails);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.50" }}>
                        <TableCell>CASE NO</TableCell>
                        <TableCell>TITLE</TableCell>
                        <TableCell>NAME</TableCell>
                        <TableCell>MODE</TableCell>
                        <TableCell>CURRENT STATUS</TableCell>
                        <TableCell>CBFC CERTIFICATE</TableCell>
                        <TableCell>EVIDENCE</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((request) => (
                        <TableRow
                            key={request.id}
                            hover
                            sx={{
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    #{request.id}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    {request.title || "N/A"}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    {request.producer?.first_name} {request.producer?.last_name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    {request.mode || "N/A"}
                                </Typography>
                            </TableCell>
                            <TableCell>{getStatusChip(request.status)}</TableCell>

                            {/* CBFC Certificate Column */}
                            <TableCell>
                                {request.cbfc_certificate ? (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        href={`${BASE_URL_API}/${request.cbfc_certificate}`}
                                        target="_blank"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Download
                                    </Button>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No certificate
                                    </Typography>
                                )}
                            </TableCell>

                            {/* Evidence Column */}
                            <TableCell>
                                {request.evidence ? (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        href={`${BASE_URL_API}/${request.evidence}`}
                                        target="_blank"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Download
                                    </Button>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No evidence
                                    </Typography>
                                )}
                            </TableCell>

                            <TableCell>
                                <Tooltip title={formatDate(request.createdAt)}>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Tooltip>
                            </TableCell>

                            <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    {/* View Details Button - Make sure onClick is properly bound */}
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => {
                                                console.log("View button clicked for request:", request.id);
                                                onViewDetails(request);
                                            }}
                                            sx={{
                                                bgcolor: "info.lighter",
                                                "&:hover": { bgcolor: "info.light" },
                                            }}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    {request.status === 1 && (
                                        <>
                                            <Tooltip title="Approve Request">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => onApprove(request)}
                                                    sx={{
                                                        bgcolor: "success.lighter",
                                                        "&:hover": { bgcolor: "success.light" },
                                                    }}
                                                >
                                                    <ApproveIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Reject Request">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onReject(request)}
                                                    sx={{
                                                        bgcolor: "error.lighter",
                                                        "&:hover": { bgcolor: "error.light" },
                                                    }}
                                                >
                                                    <RejectIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}

                                    {request.status !== 1 && (
                                        <Chip
                                            size="small"
                                            label={request.status === 2 ? "Approved" : "Rejected"}
                                            color={request.status === 2 ? "success" : "error"}
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RequestTable;