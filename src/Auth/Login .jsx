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
      <div className="login-bg">
        <div className="container mt-2 mb-5">
          <header class="d-flex py-3 mb-4 ">
            <div class="logo-header">
              <a href="/" class=" mb-3 mb-md-0  ">
                {" "}
                <img
                  src="images/nazar-white.png"
                  alt="NAZAR"
                  class="img-fluid"
                />{" "}
              </a>
              <a
                href="https://mib.gov.in/"
                class=" mb-3 mb-md-0  "
                target="_blank"
              >
                {" "}
                <img
                  src="images/mib-logo.svg"
                  alt="MIB"
                  class="img-fluid"
                />{" "}
              </a>
              <a
                href="https://www.nfdcindia.com/"
                class="mb-3 mb-md-0 "
                target="_blank"
              >
                {" "}
                <img
                  src="images/logo1.png"
                  alt="NFDC"
                  class="second-logo"
                />{" "}
              </a>
            </div>
          </header>
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="content-div-text">
                <h1 style={{ fontSize: "55px" }}> NAZAR</h1>
                <span className="yellow-text" style={{ fontSize: "18px" }}>
                  <b>
                    National Anti-Piracy & Zero-Tolerance Action on Rights
                    Infringement
                  </b>
                </span>

                <p class="mt-3 ">
                  NAZAR is a national platform dedicated to combating digital
                  piracy by enabling structured reporting and swift removal of
                  unauthorized film and digital content links.
                </p>
              </div>
            </div>

            <div class="col-md-6">
              <div className="otp-card ">
                <div className="card-body p-4 p-md-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h2 style={{ fontSize: "25px" }} className="otp-title mb-2">
                      Login to Register Complaint
                    </h2>
                  </div>
                  <div className="mb-4">
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
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleSubmit}
                        >
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
                            sx={{
                              input: { color: "white" }, // typed text
                              label: { color: "white" }, // label
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "white", // border
                                },
                                "&:hover fieldset": {
                                  borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                            }}
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
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              input: { color: "white" }, // typed text
                              label: { color: "white" }, // label
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "white", // border
                                },
                                "&:hover fieldset": {
                                  borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
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

                  {/* Divider */}
                  <div className="alternative-login">
                    <div className="text-center mt-3">
                      <p className="text-muted small">
                        <i className="bi bi-shield-check me-1"></i>
                        Your information is secured
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
