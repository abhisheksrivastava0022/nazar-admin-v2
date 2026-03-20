import React, { useState } from "react";
import {
  Grid,
  TextField,
  Alert,
  Button,
  Snackbar,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import ApiUser from "../../API/ApiUser";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
  const navigate = useNavigate();

  const { userCreate, loadUserList } = ApiUser();
  const [formData, setformData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorsForm, setErrorsForm] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "Enter your first name";
    if (!formData.last_name) newErrors.last_name = "Enter your last name";
    if (!formData.username) newErrors.username = "Enter your username";
    if (!formData.email) newErrors.email = "Enter your email";
    if (!formData.password) newErrors.password = "Enter your password";
    setErrorsForm(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const datatosend = { ...formData };
      const response = await userCreate(datatosend);
      const message = response.message;
      if (response.status === true) {
        setformData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
        });
        setAlertSeverity("success");
        setAlertMessage(message);
        setAlertOpen(true);
        navigate("/user/" + response.data);
      } else {
        if (response.errors) {
          const newErrors = {};
          for (const errorObj of response.errors) {
            newErrors[errorObj.path] = errorObj.message;
          }
          setErrorsForm(newErrors);
        }
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error: ", error);
      setAlertMessage("Error submitting form. Please try again later.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorsForm((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Inside your component
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <form onSubmit={submitForm}>
          <Card elevation={3}>
            <CardHeader
              title="Create User"
              subheader="Add new user roles and permission"
              sx={{
                backgroundColor: "innherit",
                borderBottom: "1px solid #e0e0e0",
                px: 3,
                py: 2,
              }}
              titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
              subheaderTypographyProps={{ sx: { color: "text.secondary" } }}
            />

            <CardContent sx={{ px: 3, py: 4 }}>
              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errorsForm.first_name}
                    helperText={errorsForm.first_name}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={!!errorsForm.last_name}
                    helperText={errorsForm.last_name}
                  />
                </Grid>

                {/* Username */}
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errorsForm.username}
                    helperText={errorsForm.username}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errorsForm.email}
                    helperText={errorsForm.email}
                  />
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errorsForm.password}
                    helperText={errorsForm.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box sx={{ mt: 5, textAlign: "right" }}>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserCreate;
