import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import ApiClient from "../API/ApiClient";

const Login = () => {
  const { postRequestApi, userCheckApi } = ApiClient();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  useEffect(() => {
    userCheckApi("api/user", {});
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      // .min(6, "Password must be at least 6 characters")
      // .max(15, "Password must be at most 15 characters")
      // .matches(
      //   /^[a-zA-Z0-9@!#\$%\^\&*\)\(+=._-]+$/,
      //   "Password can contain only letters, numbers, and special characters"
      // )
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await postRequestApi("api/auth/login", values);

      if (response.status === true) {
        localStorage.setItem("website_id", 1);
        setAlertMessage("Login successfully");
        setAlertSeverity("success");
        setAlertOpen(true);
        navigate("/");
      } else {
        setAlertMessage(response.message || "Login failed");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="login_bg">
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ padding: 4, mt: 10, borderRadius: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={3}
              textAlign="center"
            >
              Login to Your Account
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Box>
              )}
            </Formik>
          </Paper>
        </Container>
      </div>

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

export default Login;
