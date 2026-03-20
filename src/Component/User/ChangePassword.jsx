import {
  Box,
  Button,
  Grid,
  TextField,
  Alert,
  Snackbar,
  Card,
  CardHeader,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../API/ApiClient";
import { useSelector } from "react-redux";
import ApiUser from "../../API/ApiUser";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword = () => {
  const { userDetails } = ApiUser();
  const { postRequestApi } = ApiClient();
  const { id = null } = useParams();
  const [formData, setformData] = useState({
    password: "",
    confirm_password: "",
  });
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.user);
  const [errorsForm, setErrorsForm] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Enter your password";
    if (!formData.confirm_password)
      newErrors.confirm_password = "Enter your confirm password";
    setErrorsForm(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changePasswordForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    let user_id = id;
    if (!id) {
      user_id = user.id;
    }
    try {
      const datatosend = { ...formData };
      const response = await postRequestApi(
        `api/user/${user_id}/change-password/`,
        datatosend,
      );
      const message = response.message;
      if (response.status === true) {
        setformData({
          password: "",
          confirm_password: "",
        });
        setAlertSeverity("success");
        setAlertMessage(message);
        setAlertOpen(true);
        // navigate('/user/' + response.data);
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

  const loadpreData = async () => {
    const data = await userDetails(id);
    setUserData(data.data);
  };
  useEffect(() => {
    loadpreData();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <form onSubmit={changePasswordForm}>
          <Card elevation={3}>
            <CardHeader
              title="Change Password"
              subheader={
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  You want to change password for{" "}
                  <span style={{ color: "#1976d2", fontWeight: 600 }}>
                    {userData.username}
                  </span>
                </Typography>
              }
              sx={{
                backgroundColor: "innherit",
                borderBottom: "1px solid #e0e0e0",
                px: 3,
                py: 2,
              }}
              titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            />

            <CardContent sx={{ px: 3, py: 4 }}>
              <Grid container spacing={3}>
                {/* Password */}
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errorsForm.password}
                    helperText={errorsForm.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Confirm Password */}
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    error={!!errorsForm.confirm_password}
                    helperText={errorsForm.confirm_password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Button type="submit" variant="contained">
                  Save Password
                </Button>
              </Grid>
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

export default ChangePassword;
