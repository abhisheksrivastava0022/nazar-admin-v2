import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Autocomplete,
  debounce,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import ApiClient from "../../API/ApiClient";

const RequestListing = () => {
  const navigate = useNavigate();
  const { getRequestApi, postRequestApi } = ApiClient();
  const BASE_URL_API = `${import.meta.env.VITE_BASE_URL}/evidence`;

  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [producerSearchQuery, setProducerSearchQuery] = useState("");
  const [producerOptions, setProducerOptions] = useState([]);
  const [loadingProducers, setLoadingProducers] = useState(false);
  const [iframeErrors, setIframeErrors] = useState({});

  // Action dialog states
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // View details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);

  // Load requests data
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
        producer_id: selectedProducer?.id,
      };

      const response = await getRequestApi("api/producer/request", params);

      if (response.status) {
        setData(response.data || []);
        setTotalRecords(response.pagination?.totalRecords || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || "Failed to load requests");
      }
    } catch (err) {
      setError("An error occurred while fetching requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search producers for typeahead
  const searchProducers = async (query) => {
    if (!query || query.length < 2) {
      setProducerOptions([]);
      return;
    }

    setLoadingProducers(true);
    try {
      const response = await getRequestApi(`api/producer/search`, { q: query });
      if (response.status) {
        setProducerOptions(response.data || []);
      }
    } catch (err) {
      console.error("Error searching producers:", err);
    } finally {
      setLoadingProducers(false);
    }
  };

  // Debounced producer search
  const debouncedSearch = debounce(searchProducers, 500);

  useEffect(() => {
    if (producerSearchQuery) {
      debouncedSearch(producerSearchQuery);
    }
  }, [producerSearchQuery]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [currentPage, rowsPerPage, statusFilter, selectedProducer]);

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    loadData();
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadData();
    setSuccess("Requests refreshed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // Handle producer selection
  const handleProducerChange = (event, newValue) => {
    setSelectedProducer(newValue);
    setCurrentPage(1);
  };

  // Clear producer filter
  const handleClearProducer = () => {
    setSelectedProducer(null);
    setProducerSearchQuery("");
    setCurrentPage(1);
  };

  // Handle iframe error
  const handleIframeError = (id) => {
    setIframeErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Handle view details
  const handleViewDetails = (request) => {
    setViewRequest(request);
    setDetailsDialogOpen(true);
  };

  // Handle approval/rejection
  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComment("");
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedRequest || !actionType) return;

    setActionLoading(true);
    try {
      const endpoint =
        actionType === "approve"
          ? `api/producer/${selectedRequest.id}/approve`
          : `api/producer/${selectedRequest.id}/reject`;

      const response = await postRequestApi(endpoint, { comment });

      if (response.status) {
        setSuccess(
          `Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`,
        );
        loadData(); // Refresh the list
        handleActionClose();
      } else {
        setError(response.message || `Failed to ${actionType} request`);
      }
    } catch (err) {
      setError(
        `An error occurred while ${actionType === "approve" ? "approving" : "rejecting"} the request`,
      );
      console.error("Error processing request:", err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleActionClose = () => {
    setActionDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setComment("");
  };

  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 1:
        return (
          <Chip
            label="Pending"
            color="warning"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case 2:
        return (
          <Chip
            label="Approved"
            color="success"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case 3:
        return (
          <Chip
            label="Rejected"
            color="error"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate text
  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                color: "primary.main",
                backgroundColor: "primary.lighter",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Request Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Review and manage incoming requests
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
            elevation={2}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess("")}
            elevation={2}
          >
            {success}
          </Alert>
        )}
      </Box>

      {/* Action Bar */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Producer Search Typeahead */}
          <Grid size={{ md: 4 }}>
            <Autocomplete
              value={selectedProducer}
              onChange={handleProducerChange}
              onInputChange={(event, newInputValue) => {
                setProducerSearchQuery(newInputValue);
              }}
              options={producerOptions}
              getOptionLabel={(option) =>
                option.producer_name ||
                `${option.first_name || ""} ${option.last_name || ""}`.trim()
              }
              loading={loadingProducers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Producer"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingProducers ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2">
                      {option.producer_name ||
                        `${option.first_name} ${option.last_name}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email} {option.mobile && `• ${option.mobile}`}
                    </Typography>
                  </Box>
                </li>
              )}
              noOptionsText="No producers found"
            />
          </Grid>

          {/* Search Bar */}
          <Grid size={{ md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by URL or description..."
              value={searchQuery}
              onChange={handleSearch}
              onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearchSubmit}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid size={{ md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="1">Pending</MenuItem>
                <MenuItem value="2">Approved</MenuItem>
                <MenuItem value="3">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Rows Per Page */}
          <Grid size={{ md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Rows</InputLabel>
              <Select
                value={rowsPerPage}
                label="Rows"
                onChange={handleRowsPerPageChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={5}>5 per page</MenuItem>
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={25}>25 per page</MenuItem>
                <MenuItem value={50}>50 per page</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Refresh Button */}
          <Grid size={{ md: 4 }} sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  backgroundColor: "primary.lighter",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            {selectedProducer && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleClearProducer}
                sx={{ borderRadius: 2 }}
              >
                Clear Filter
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      {!loading && data.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ md: 3 }}>
            <Paper
              sx={{ p: 3, textAlign: "center", bgcolor: "primary.lighter" }}
            >
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {totalRecords}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ md: 3 }}>
            <Paper
              sx={{ p: 3, textAlign: "center", bgcolor: "warning.lighter" }}
            >
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {data.filter((item) => item.status === 1).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ md: 3 }}>
            <Paper
              sx={{ p: 3, textAlign: "center", bgcolor: "success.lighter" }}
            >
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {data.filter((item) => item.status === 2).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ md: 3 }}>
            <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.lighter" }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {data.filter((item) => item.status === 3).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Requests Table */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No requests found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery || statusFilter !== "all" || selectedProducer
                  ? "Try adjusting your filters"
                  : "No requests have been submitted yet"}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.50" }}>
                    <TableCell>Mode</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Evidence</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((request, index) => (
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
                          {request.mode}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          #{request.id}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {request.mode == "single" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinkIcon fontSize="small" color="action" />
                            <Tooltip title={request.url}>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 150,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {request.url}
                              </Typography>
                            </Tooltip>
                            <IconButton
                              size="small"
                              href={request.url}
                              target="_blank"
                              sx={{ ml: 1 }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <></>
                        )}
                        {request.mode == "bulk" ? request.urls : <></>}
                      </TableCell>

                      <TableCell>
                        <Tooltip title={request.description}>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {truncateText(request.description, 80)}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell>{getStatusChip(request.status)}</TableCell>

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
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          {/* View Details Button */}
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleViewDetails(request)}
                              sx={{
                                bgcolor: "info.lighter",
                                "&:hover": { bgcolor: "info.light" },
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Approve Button - Show only for pending */}
                          {request.status === 1 && (
                            <Tooltip title="Approve Request">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleActionClick(request, "approve")
                                }
                                sx={{
                                  bgcolor: "success.lighter",
                                  "&:hover": { bgcolor: "success.light" },
                                }}
                              >
                                <ApproveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Reject Button - Show only for pending */}
                          {request.status === 1 && (
                            <Tooltip title="Reject Request">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleActionClick(request, "reject")
                                }
                                sx={{
                                  bgcolor: "error.lighter",
                                  "&:hover": { bgcolor: "error.light" },
                                }}
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Status indicator for non-pending */}
                          {request.status !== 1 && (
                            <Chip
                              size="small"
                              label={
                                request.status === 2 ? "Approved" : "Rejected"
                              }
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
          )}
        </CardContent>

        {/* Pagination */}
        {data.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, totalRecords)} of{" "}
              {totalRecords} requests
            </Typography>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Action Dialog (Approve/Reject) */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleActionClose}
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
                onChange={(e) => setComment(e.target.value)}
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
            onClick={handleActionClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
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

      {/* View Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" fontWeight="bold">
            Request Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {viewRequest && (
            <Grid container spacing={3}>
              {/* URL Preview */}
              <Grid size={{ md: 12 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  URL Preview
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "grey.50",
                  }}
                >
                  {!iframeErrors[`details-${viewRequest.id}`] ? (
                    <iframe
                      src={viewRequest.url}
                      title={`Preview of ${viewRequest.url}`}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      onError={() =>
                        handleIframeError(`details-${viewRequest.id}`)
                      }
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        textAlign: "center",
                      }}
                    >
                      <WarningIcon
                        color="warning"
                        sx={{ fontSize: 48, mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Preview Unavailable
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        This website cannot be displayed due to security
                        restrictions.
                      </Typography>
                      <Button
                        variant="contained"
                        href={viewRequest.url}
                        target="_blank"
                        startIcon={<OpenInNewIcon />}
                      >
                        Open in New Tab
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Status */}
              <Grid size={{ md: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  {getStatusChip(viewRequest.status)}
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* URL */}
              <Grid size={{ md: 12 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  URL
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinkIcon color="action" />
                  <Typography variant="body1">{viewRequest.url}</Typography>
                  <IconButton
                    size="small"
                    href={viewRequest.url}
                    target="_blank"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>

              {/* Description */}
              <Grid size={{ md: 12 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Description
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body1">
                    {viewRequest.description}
                  </Typography>
                </Paper>
              </Grid>

              {/* Evidence */}
              <Grid size={{ md: 12 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Evidence
                </Typography>
                {viewRequest.evidence ? (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    href={`${BASE_URL_API}/${viewRequest.evidence}`}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    Download Evidence File
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No evidence uploaded
                  </Typography>
                )}
              </Grid>

              {/* Metadata */}
              <Grid size={{ md: 12 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Request ID
                    </Typography>
                    <Typography variant="body1">#{viewRequest.id}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Producer ID
                    </Typography>
                    <Typography variant="body1">
                      #{viewRequest.producer_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(viewRequest.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(viewRequest.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestListing;
