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
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ApiClient from "../../API/ApiClient";

const IntermediaryListing = () => {
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
  const [selectedIntermediary, setSelectedIntermediary] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load intermediaries data
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
      };

      const response = await getRequestApi("api/intermediary", params);

      if (response.status) {
        setData(response.data || []);
        setTotalRecords(response.pagination?.totalRecords || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || "Failed to load intermediaries");
      }
    } catch (err) {
      setError("An error occurred while fetching intermediaries");
      console.error("Error fetching intermediaries:", err);
    } finally {
      setLoading(false);
    }
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
    setSuccess("Intermediaries refreshed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle edit
  const handleEdit = (intermediary) => {
    navigate(`/intermediary/update/${intermediary.id}`);
  };

  // Handle delete
  const handleDeleteClick = (intermediary) => {
    setSelectedIntermediary(intermediary);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIntermediary) return;

    setDeleteLoading(true);
    try {
      const response = await postRequestApi(
        `api/intermediary/${selectedIntermediary.id}/delete`,
      );

      if (response.status) {
        setSuccess("Intermediary deleted successfully!");
        loadData(); // Refresh the list
      } else {
        setError(response.message || "Failed to delete intermediary");
      }
    } catch (err) {
      setError("An error occurred while deleting the intermediary");
      console.error("Error deleting intermediary:", err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedIntermediary(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedIntermediary(null);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  // Get contact person name (assuming contact_person is an ID reference)
  // You may need to fetch contact person details from another API or have it populated in the response
  const getContactPersonName = (intermediary) => {
    if (!intermediary.contact_person) return "N/A";
    // If contact_person is populated with user object
    if (typeof intermediary.contact_person === 'object') {
      return `${intermediary.contact_person.first_name || ''} ${intermediary.contact_person.last_name || ''}`.trim() || "N/A";
    }
    // If it's just an ID
    return `ID: ${intermediary.contact_person}`;
  };

  // Format email (since email is stored as JSON)
  const getEmailList = (emailJson) => {
    return []

  };

  // Get primary email (first email in the list)
  const getPrimaryEmail = (emailJson) => {
    const emails = getEmailList(emailJson);
    return emails.length > 0 ? emails[0] : "N/A";
  };

  return (
    <Container maxWidth="xl"
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
                Intermediaries Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage all intermediaries in the system
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
              placeholder="Search intermediaries by name, email, or phone..."
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
              onClick={() => navigate("/intermediary/create")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
              }}
            >
              Create Intermediary
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Intermediaries Table */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <BusinessIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No intermediaries found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first intermediary to get started"}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/intermediary/create")}
                  sx={{ mt: 2 }}
                >
                  Create Intermediary
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.50" }}>
                    <TableCell width="5%">#</TableCell>
                    <TableCell width="25%">Intermediary</TableCell>
                    <TableCell width="30%">Contact Information</TableCell>
                    <TableCell width="15%">Contact Person</TableCell>
                    <TableCell width="15%">Created Date</TableCell>
                    <TableCell width="10%">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((intermediary, index) => (
                    <TableRow
                      key={intermediary.id}
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
                              bgcolor: "secondary.light",
                              color: "secondary.main",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(intermediary.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {intermediary.name || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: #{intermediary.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={1}>
                          {/* Email Section */}
                          <Box
                            sx={{

                            }}
                          >
                            {/* <EmailIcon fontSize="small" color="action" /> */}
                            <Box>
                              {getEmailList(intermediary.email).length > 0 ? (
                                getEmailList(intermediary.email).map((email, idx) => (
                                  <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{ mb: idx < getEmailList(intermediary.email).length - 1 ? 0.5 : 0 }}
                                  >
                                    {email}
                                  </Typography>
                                ))
                              ) : (
                                <></>
                              )}
                            </Box>
                          </Box>

                          {/* Phone Section */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {intermediary.phone || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {intermediary.contact_person}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(intermediary.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {intermediary.createdAt && new Date(intermediary.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit Intermediary">
                            <IconButton
                              onClick={() => handleEdit(intermediary)}
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

                          <Tooltip title="Delete Intermediary">
                            <IconButton
                              onClick={() => handleDeleteClick(intermediary)}
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
              {totalRecords} intermediaries
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
          {selectedIntermediary && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete intermediary "
              {selectedIntermediary.name}"?
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All data associated with this intermediary
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

export default IntermediaryListing;