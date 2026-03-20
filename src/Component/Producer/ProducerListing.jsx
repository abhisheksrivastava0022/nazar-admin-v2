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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ApiClient from "../../API/ApiClient";

const ProducerListing = () => {
  const navigate = useNavigate();
  const { getRequestApi, postRequestApi } = ApiClient();

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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load producers data
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
      };

      const response = await getRequestApi("api/producer", params);

      if (response.status) {
        setData(response.data || []);
        setTotalRecords(response.pagination?.totalRecords || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || "Failed to load producers");
      }
    } catch (err) {
      setError("An error occurred while fetching producers");
      console.error("Error fetching producers:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, [currentPage, rowsPerPage]);

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timer
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadData();
    }, 500);

    setSearchTimer(timer);
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
    setSuccess("Producers refreshed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle edit
  const handleEdit = (producer) => {
    navigate(`/producer/update/${producer.id}`);
  };

  // Handle delete
  const handleDeleteClick = (producer) => {
    setSelectedProducer(producer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProducer) return;

    setDeleteLoading(true);
    try {
      const response = await postRequestApi(
        `api/producer/${selectedProducer.id}/delete`,
      );

      if (response.status) {
        setSuccess("Producer deleted successfully!");
        loadData(); // Refresh the list
      } else {
        setError(response.message || "Failed to delete producer");
      }
    } catch (err) {
      setError("An error occurred while deleting the producer");
      console.error("Error deleting producer:", err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedProducer(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedProducer(null);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "success";
      case 2:
        return "error";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      default:
        return "Unknown";
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
    });
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <Container maxWidth="xl" style={{ background: "white" }}>
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
                Producers Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage all producers in the system
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
          {/* Search Bar */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search producers by name, email, or mobile..."
              value={searchQuery}
              onChange={handleSearch}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Rows Per Page Selector */}
          <Grid item xs={12} md={4}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                label="Rows per page"
                onChange={handleRowsPerPageChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid
            item
            xs={12}
            md={2}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
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

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/producer/create")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
              }}
            >
              Create Producer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}

      {/* Producers Table */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <PersonIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No producers found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first producer to get started"}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/producer/create")}
                  sx={{ mt: 2 }}
                >
                  Create Producer
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.50" }}>
                    <TableCell width="5%">#</TableCell>
                    <TableCell width="25%">Producer</TableCell>
                    <TableCell width="25%">Contact Information</TableCell>
                    <TableCell width="15%">Status</TableCell>
                    <TableCell width="15%">Created Date</TableCell>
                    <TableCell width="15%">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((producer, index) => (
                    <TableRow
                      key={producer.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              color: "primary.main",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(
                              producer.first_name,
                              producer.last_name,
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {producer.first_name} {producer.last_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: #{producer.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {producer.email || "N/A"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {producer.mobile || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={getStatusText(producer.status)}
                          color={getStatusColor(producer.status)}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            minWidth: 80,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(producer.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(producer.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit Producer">
                            <IconButton
                              onClick={() => handleEdit(producer)}
                              color="primary"
                              size="small"
                              sx={{
                                backgroundColor: "primary.lighter",
                                "&:hover": {
                                  backgroundColor: "primary.light",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Producer">
                            <IconButton
                              onClick={() => handleDeleteClick(producer)}
                              color="error"
                              size="small"
                              sx={{
                                backgroundColor: "error.lighter",
                                "&:hover": {
                                  backgroundColor: "error.light",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
              {totalRecords} producers
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" fontWeight="bold">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedProducer && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete producer "
              {selectedProducer.first_name} {selectedProducer.last_name}"?
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All data associated with this producer
            will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProducerListing;
