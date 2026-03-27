import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ApiClient from "../../API/ApiClient";

const ProducerCreateUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const isEditMode = Boolean(id);

  const { postRequestApi, getRequestApi } = ApiClient();

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address: "",
    production_house: "",
    status: 1,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  // Load producer data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadProducerData();
    }
  }, [id]);

  const loadProducerData = async () => {
    setLoading(true);
    try {
      const response = await getRequestApi(`api/producer/${id}`);

      if (response.status) {
        const producer = response.data;
        setFormData({
          first_name: producer.first_name || "",
          last_name: producer.last_name || "",
          email: producer.email || "",
          mobile: producer.mobile || "",
          status: producer.status || 1,
        });
      } else {
        setError(response.message || "Failed to load producer data");
      }
    } catch (err) {
      setError("An error occurred while loading producer data");
      console.error("Error loading producer:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle status switch change
  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked ? 1 : 2,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters";
    } else if (formData.first_name.length > 50) {
      newErrors.first_name = "First name must be less than 50 characters";
    }

    // Last name validation
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters";
    } else if (formData.last_name.length > 50) {
      newErrors.last_name = "Last name must be less than 50 characters";
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Mobile validation
    if (!formData.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the validation errors");
      return;
    }

    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (isEditMode) {
        // Update existing producer
        response = await postRequestApi(`api/producer/${id}/update`, formData);
      } else {
        // Create new producer
        response = await postRequestApi("api/producer", formData);
      }

      if (response.status) {
        setSuccess(
          isEditMode
            ? "Producer updated successfully!"
            : "Producer created successfully!",
        );

        // Redirect after short delay
        setTimeout(() => {
          navigate("/producer");
        }, 1500);
      } else {
        setError(
          response.message ||
          (isEditMode
            ? "Failed to update producer"
            : "Failed to create producer"),
        );
      }
    } catch (err) {
      setError("An error occurred while saving the producer");
      console.error("Error saving producer:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/producer");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1, background: "white" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton
            onClick={handleCancel}
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
              {isEditMode ? "Edit Producer" : "Create New Producer"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isEditMode
                ? "Update producer information"
                : "Add a new producer to the system"}
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
          <Alert severity="success" sx={{ mb: 3 }} elevation={2}>
            {success}
          </Alert>
        )}
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Basic Information"
                subheader="Enter the producer's personal details"
                sx={{
                  backgroundColor: "primary.lighter",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                titleTypographyProps={{
                  variant: "h6",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              />

              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* First Name */}
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  {/* Mobile */}
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      // required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ md: 6 }}>
                    <TextField
                      fullWidth
                      label="Production House"
                      name="production_house"
                      value={formData.production_house}
                      onChange={handleInputChange}
                      error={!!errors.production_house}
                      helperText={errors.production_house}
                      // required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Side Panel */}
          <Grid size={{ md: 12 }}>
            {/* Status Card */}
            <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
              <CardHeader
                title="Status"
                subheader="Set producer status"
                sx={{
                  backgroundColor: "primary.lighter",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                titleTypographyProps={{
                  variant: "h6",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              />

              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 1}
                      onChange={handleStatusChange}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        {formData.status === 1 ? "Active" : "Inactive"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.status === 1
                          ? "Producer is active and visible"
                          : "Producer is inactive and hidden"}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    ml: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                />
              </CardContent>
            </Card>

            {/* Summary Card (only in edit mode) */}
            {isEditMode && (
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Summary"
                  subheader="Producer information"
                  sx={{
                    backgroundColor: "primary.lighter",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                  titleTypographyProps={{
                    variant: "h6",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                />

                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Producer ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      #{id}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Form Actions */}
          <Grid size={{ md: 12 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  submitLoading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={submitLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  fontWeight: "bold",
                }}
              >
                {submitLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Producer"
                    : "Create Producer"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ProducerCreateUpdate;
