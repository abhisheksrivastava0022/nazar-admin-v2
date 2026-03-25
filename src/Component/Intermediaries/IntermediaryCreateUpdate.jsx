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
    Divider,
    Card,
    CardContent,
    CardHeader,
    InputAdornment,
    Chip,
    Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import ApiClient from "../../API/ApiClient";

const IntermediaryCreateUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL if editing
    const isEditMode = Boolean(id);

    const { postRequestApi, getRequestApi } = ApiClient();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: [], // Array of emails
        contact_person: "",
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Email management state
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Validation errors
    const [errors, setErrors] = useState({});

    // Load intermediary data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            loadIntermediaryData();
        }
    }, [id]);

    const loadIntermediaryData = async () => {
        setLoading(true);
        try {
            const response = await getRequestApi(`api/intermediary/${id}`);

            if (response.status) {
                const intermediary = response.data;

                // Parse email if it's stored as JSON string
                let emails = [];
                if (intermediary.email) {
                    try {
                        if (Array.isArray(intermediary.email)) {
                            emails = intermediary.email;
                        } else if (typeof intermediary.email === 'string') {
                            emails = JSON.parse(intermediary.email);
                        } else {
                            emails = [intermediary.email];
                        }
                    } catch (e) {
                        emails = [intermediary.email];
                    }
                }

                setFormData({
                    name: intermediary.name || "",
                    phone: intermediary.phone || "",
                    email: emails,
                    contact_person: intermediary.contact_person || "",
                });
            } else {
                setError(response.message || "Failed to load intermediary data");
            }
        } catch (err) {
            setError("An error occurred while loading intermediary data");
            console.error("Error loading intermediary:", err);
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

    // Email management functions
    const handleAddEmail = () => {
        // Validate email
        if (!newEmail.trim()) {
            setEmailError("Email is required");
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(newEmail)) {
            setEmailError("Invalid email address");
            return;
        }

        // Check for duplicate
        if (formData.email.includes(newEmail.trim())) {
            setEmailError("Email already exists");
            return;
        }

        // Add email to array
        setFormData((prev) => ({
            ...prev,
            email: [...prev.email, newEmail.trim()],
        }));

        // Clear input
        setNewEmail("");
        setEmailError("");

        // Clear email error in form errors
        if (errors.email) {
            setErrors((prev) => ({
                ...prev,
                email: "",
            }));
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setFormData((prev) => ({
            ...prev,
            email: prev.email.filter((email) => email !== emailToRemove),
        }));
    };

    const handleEmailKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name?.trim()) {
            newErrors.name = "Intermediary name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (formData.name.length > 100) {
            newErrors.name = "Name must be less than 100 characters";
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        }

        // Email validation - at least one email required
        if (formData.email.length === 0) {
            newErrors.email = "At least one email is required";
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

        // Prepare data for submission (convert email array to JSON string if needed)
        const submitData = {
            ...formData,
            email: formData.email, // Convert array to JSON string for storage
        };

        try {
            let response;

            if (isEditMode) {
                // Update existing intermediary
                response = await postRequestApi(`api/intermediary/${id}/update`, submitData);
            } else {
                // Create new intermediary
                response = await postRequestApi("api/intermediary", submitData);
            }

            if (response.status) {
                setSuccess(
                    isEditMode
                        ? "Intermediary updated successfully!"
                        : "Intermediary created successfully!",
                );

                // Redirect after short delay
                setTimeout(() => {
                    navigate("/intermediary");
                }, 1500);
            } else {
                setError(
                    response.message ||
                    (isEditMode
                        ? "Failed to update intermediary"
                        : "Failed to create intermediary"),
                );
            }
        } catch (err) {
            setError("An error occurred while saving the intermediary");
            console.error("Error saving intermediary:", err);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate("/intermediary");
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
                            {isEditMode ? "Edit Intermediary" : "Create New Intermediary"}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {isEditMode
                                ? "Update intermediary information"
                                : "Add a new intermediary to the system"}
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
                                subheader="Enter the intermediary's details"
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
                                    {/* Intermediary Name */}
                                    <Grid size={{ md: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Intermediary Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            required
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

                                    {/* Phone */}
                                    <Grid size={{ md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
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

                                    {/* Contact Person - Simple Textbox */}
                                    <Grid size={{ md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Contact Person"
                                            name="contact_person"
                                            value={formData.contact_person}
                                            onChange={handleInputChange}
                                            placeholder="Enter contact person name"
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

                                    {/* Email Section */}
                                    <Grid size={{ md: 12 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Email Addresses
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Add one or more email addresses for this intermediary
                                            </Typography>
                                        </Box>

                                        {/* Email List */}
                                        {formData.email.length > 0 && (
                                            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                                                {formData.email.map((email, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={email}
                                                        onDelete={() => handleRemoveEmail(email)}
                                                        color="primary"
                                                        variant="outlined"
                                                        deleteIcon={<DeleteIcon />}
                                                        sx={{ borderRadius: 2 }}
                                                    />
                                                ))}
                                            </Stack>
                                        )}

                                        {/* Add Email Input */}
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter email address"
                                                value={newEmail}
                                                onChange={(e) => {
                                                    setNewEmail(e.target.value);
                                                    setEmailError("");
                                                }}
                                                onKeyPress={handleEmailKeyPress}
                                                error={!!emailError}
                                                helperText={emailError}
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
                                            <Button
                                                variant="outlined"
                                                onClick={handleAddEmail}
                                                startIcon={<AddIcon />}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    minWidth: "100px",
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Box>

                                        {errors.email && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                                                {errors.email}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
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
                                        ? "Update Intermediary"
                                        : "Create Intermediary"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default IntermediaryCreateUpdate;