import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  Pagination,
  Chip,
  debounce,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ApiClient from "../../API/ApiClient";

// Import components
import RequestFilter from "./Approved-Request/RequestFilter";
import RequestTable from "./Approved-Request/RequestTable";
import ActionDialog from "./Approved-Request/ActionDialog";
import DetailsDialog from "./Approved-Request/DetailsDialog";

const VerifiedRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRequestApi, postRequestApi } = ApiClient();
  const BASE_URL_API = `${import.meta.env.VITE_BASE_URL}/evidence`;

  // Helper function to get query params
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      page: parseInt(params.get("page")) || 1,
      limit: parseInt(params.get("limit")) || 10,
      search: params.get("search") || "",
      status: params.get("status") || "all",
      producer_id: params.get("producer_id") || null,
    };
  };

  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(getQueryParams().page);
  const [rowsPerPage, setRowsPerPage] = useState(getQueryParams().limit);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(getQueryParams().search);
  const [statusFilter, setStatusFilter] = useState(getQueryParams().status);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [producerSearchQuery, setProducerSearchQuery] = useState("");
  const [producerOptions, setProducerOptions] = useState([]);
  const [loadingProducers, setLoadingProducers] = useState(false);

  // Action dialog states
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // OTP states
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(""); // Separate OTP error state

  // View details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);

  // Update URL with current filters
  const updateUrlParams = (params) => {
    const urlParams = new URLSearchParams();

    // Add all non-default values to URL
    if (params.page && params.page !== 1) {
      urlParams.set("page", params.page);
    }
    if (params.limit && params.limit !== 10) {
      urlParams.set("limit", params.limit);
    }
    if (params.search && params.search.trim() !== "") {
      urlParams.set("search", params.search);
    }
    if (params.status && params.status !== "all") {
      urlParams.set("status", params.status);
    }
    if (params.producer_id) {
      urlParams.set("producer_id", params.producer_id);
    }

    const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname;
    navigate(newUrl, { replace: true });
  };

  // Load producer details from ID (for URL param)
  const loadProducerFromId = async (producerId) => {
    if (!producerId) return null;

    try {
      const response = await getRequestApi(`api/producer/${producerId}`);
      if (response.status && response.data) {
        return response.data;
      }
    } catch (err) {
      console.error("Error loading producer:", err);
    }
    return null;
  };

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

      const response = await getRequestApi("api/producer/verified-request", params);

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

  // Load producer from URL on initial load
  useEffect(() => {
    const loadInitialProducer = async () => {
      const queryParams = getQueryParams();
      if (queryParams.producer_id) {
        const producer = await loadProducerFromId(queryParams.producer_id);
        if (producer) {
          setSelectedProducer(producer);
        }
      }
    };
    loadInitialProducer();
  }, []);

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [currentPage, rowsPerPage, statusFilter, selectedProducer]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams({
      page: currentPage,
      limit: rowsPerPage,
      search: searchQuery,
      status: statusFilter,
      producer_id: selectedProducer?.id,
    });
  }, [currentPage, rowsPerPage, searchQuery, statusFilter, selectedProducer]);

  // Function to send OTP
  const handleSendOtp = async () => {
    if (!selectedRequest) return;

    setOtpLoading(true);
    setOtpError(""); // Clear any previous OTP errors

    try {
      const response = await postRequestApi(`api/producer/${selectedRequest.id}/send-otp`, {});

      if (response.status) {
        setOtpSent(true);
        setSuccess("OTP sent successfully to the producer!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setOtpError(response.message || "Failed to send OTP");
        setError(response.message || "Failed to send OTP");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred while sending OTP";
      setOtpError(errorMessage);
      setError(errorMessage);
      console.error("Error sending OTP:", err);
      setTimeout(() => setError(""), 3000);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle action confirm (approve/reject with OTP)
  const handleActionConfirm = async () => {
    if (!selectedRequest || !actionType) return;

    // Validate OTP
    if (!otpSent || !otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      setError("Please enter a valid 6-digit OTP");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setActionLoading(true);
    setOtpError(""); // Clear previous OTP errors

    try {
      const endpoint =
        actionType === "approve"
          ? `api/producer/verified/${selectedRequest.id}/approve`
          : `api/producer/verified/${selectedRequest.id}/reject`;

      // Prepare payload with OTP and comment
      const payload = {
        comment: comment || "",
        otp: otp
      };

      const response = await postRequestApi(endpoint, payload);

      if (response.status) {
        setSuccess(
          `Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`
        );
        loadData(); // Refresh data
        handleActionClose(); // Close dialog
        setTimeout(() => setSuccess(""), 3000);
      } else {
        // Handle OTP mismatch specifically
        setOtpError(response.message);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      // Handle API error response
      let errorMessage = `An error occurred while ${actionType === "approve" ? "approving" : "rejecting"} the request`;

      // Check if error response contains OTP mismatch message
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        if (errorMessage.toLowerCase().includes("otp")) {
          setOtpError(errorMessage);
        }
      } else if (err.message) {
        errorMessage = err.message;
        if (errorMessage.toLowerCase().includes("otp")) {
          setOtpError(errorMessage);
        }
      }

      setError(errorMessage);
      console.error("Error processing request:", err);
      setTimeout(() => setError(""), 5000); // Show error for longer duration
    } finally {
      setActionLoading(false);
    }
  };

  // Handle action close - reset all states
  const handleActionClose = () => {
    setActionDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setComment("");
    setOtp(""); // Reset OTP
    setOtpSent(false); // Reset OTP sent status
    setOtpLoading(false); // Reset OTP loading
    setOtpError(""); // Reset OTP error
  };

  // Handlers for filters
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadData();
    setSuccess("Requests refreshed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleProducerChange = (event, newValue) => {
    setSelectedProducer(newValue);
    setCurrentPage(1);
  };

  const handleProducerSearchChange = (newValue) => {
    setProducerSearchQuery(newValue);
  };

  const handleClearProducer = () => {
    setSelectedProducer(null);
    setProducerSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewDetails = (request) => {
    setViewRequest(request);
    setDetailsDialogOpen(true);
  };

  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComment("");
    setOtp(""); // Reset OTP when opening dialog
    setOtpSent(false); // Reset OTP sent status
    setOtpError(""); // Reset OTP error
    setActionDialogOpen(true);
  };

  // Helper functions
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

  // Calculate statistics
  const stats = {
    totalRecords,
    pending: data.filter((item) => item.status === 1).length,
    approved: data.filter((item) => item.status === 2).length,
    rejected: data.filter((item) => item.status === 3).length,
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
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Complaint Management System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Review and manage incoming requests
            </Typography>
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

      {/* Filters */}
      <RequestFilter
        selectedProducer={selectedProducer}
        onProducerChange={handleProducerChange}
        producerSearchQuery={producerSearchQuery}
        onProducerSearchChange={handleProducerSearchChange}
        producerOptions={producerOptions}
        loadingProducers={loadingProducers}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRefresh={handleRefresh}
        onClearProducer={handleClearProducer}
      />

      {/* Requests Table */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <RequestTable
            data={data}
            loading={loading}
            BASE_URL_API={BASE_URL_API}
            onViewDetails={handleViewDetails}
            onApprove={(request) => handleActionClick(request, "approve")}
            onReject={(request) => handleActionClick(request, "reject")}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
          />
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

      {/* Action Dialog */}
      <ActionDialog
        open={actionDialogOpen}
        onClose={handleActionClose}
        onConfirm={handleActionConfirm}
        selectedRequest={selectedRequest}
        actionType={actionType}
        comment={comment}
        onCommentChange={(e) => setComment(e.target.value)}
        actionLoading={actionLoading}
        otpLoading={otpLoading}
        onSendOtp={handleSendOtp}
        otpSent={otpSent}
        otp={otp}
        onOtpChange={(e) => setOtp(e.target.value)}
        otpError={otpError}
      />

      {/* Details Dialog */}
      <DetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        request={viewRequest}
        BASE_URL_API={BASE_URL_API}
        formatDate={formatDate}
        getStatusChip={getStatusChip}
      />
    </Container>
  );
};

export default VerifiedRequest;