import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Alert,
  Button,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

import ApiUser from "../../API/ApiUser";
import { Link } from "react-router-dom";
import { Status } from "../Constant/User";
import Chip from "@mui/material/Chip";

import OutlinedInput from "@mui/material/OutlinedInput";
import ApiClient from "../../API/ApiClient";

const UserUpdate = () => {
  const { getRequestApi } = ApiClient();

  const [theaters, setTheaters] = useState([]);

  const loadFilterDetails = async () => {
    try {
      const [theaterRes] = await Promise.all([
        getRequestApi("api/post/theatersearch"),
      ]);

      if (theaterRes.status) {
        const transformedTheaters = theaterRes.data.map((theater) => ({
          id: theater.id,
          name: theater.title,
        }));
        setTheaters(transformedTheaters);
      }
    } catch (err) {
      console.error("Error loading filter details:", err);
    }
  };

  const { id = null } = useParams();
  const { userDetails, userUpdate } = ApiUser();
  const [formData, setformData] = useState({
    title: "",
    content: "",
    status: "",
    permission: [],
    role: [],
    theater_ids: [], // Changed from theater_id to theater_ids (array)
  });
  const [personName, setPersonName] = useState([]);
  const [accessName, setAccessName] = useState([]);
  const [roles, setRoles] = useState([]);
  const [accessModels, setAccessModels] = useState([]);

  useEffect(() => {
    loadFilterDetails();
    const fetchUserDetails = async () => {
      try {
        const response = await userDetails(id);
        if (response.status) {
          const userData = response.data;
          setformData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            status: userData.status,
            role: userData.role || [],
            permission: userData.permission || [],
            theater_ids: userData.theater_ids || [], // Initialize with array
          });
          setPersonName(userData.role || []);
          setAccessName(userData.permission || []);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const [userData, setUserData] = useState({});

  const loadpreData = async () => {
    const data = await userDetails(id);
    setformData((prev) => ({
      ...prev,
      ...data.data,
      theater_ids: data.data.theater_ids || [], // Ensure theater_ids is an array
    }));
    setUserData(data.data);
  };

  useEffect(() => {
    loadpreData();
  }, []);

  const fetchRoles = async () => {
    try {
      let data = await getRequestApi(`api/auth/role`);

      if (data?.status) {
        setRoles(data.data);
      }

      data = await getRequestApi(`api/auth/permission`);

      if (data?.status) {
        setAccessModels(data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const navigate = useNavigate();

  const [errorsForm, setErrorsForm] = useState({});

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const datatosend = {
        ...formData,
        role: personName,
        permission: accessName,
        theater_ids: formData.theater_ids, // Send as array
      };
      const response = await userUpdate(id, datatosend);
      const message = response.message;
      if (response.status === true) {
        setAlertSeverity("success");
        setAlertMessage(message);
        setAlertOpen(true);
        setErrorsForm({});
        navigate("/user/");
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

  const handleChangeStatus = (e) => {
    const { value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };

  const handleChangeUserType = (event) => {
    const { value } = event.target;
    setPersonName(value);
    setformData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };

  const handleChangeAccessType = (event) => {
    const { value } = event.target;
    setAccessName(value);
    setformData((prevData) => ({
      ...prevData,
      permission: value,
    }));
  };

  // New handler for theater selection
  const handleTheaterChange = (event) => {
    const {
      target: { value },
    } = event;
    setformData((prevData) => ({
      ...prevData,
      theater_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  return (
    <>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Card elevation={3}>
          <CardHeader
            title="User Details"
            subheader={
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {userData.first_name} {userData.last_name}
              </Typography>
            }
            sx={{
              backgroundColor: "innherit",
              borderBottom: "1px solid #e0e0e0",
              px: 3,
              py: 2,
            }}
            titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            action={
              <Link
                to={`/change-password/${id}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2.5,
                    py: 1,
                  }}
                >
                  Change Password
                </Button>
              </Link>
            }
          />

          <CardContent sx={{ px: 3, py: 4 }}>
            <form onSubmit={submitForm}>
              <div className="row">
                {/* First Name */}
                <div className="col-md-6 mb-3">
                  <TextField
                    label="First Name"
                    fullWidth
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errorsForm.first_name}
                    helperText={errorsForm.first_name}
                    placeholder="Enter your first name"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <TextField
                    label="Last Name"
                    fullWidth
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={!!errorsForm.last_name}
                    helperText={errorsForm.last_name}
                    placeholder="Enter your last name"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Username */}
                <div className="col-md-6 mb-3">
                  <TextField
                    label="Username"
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errorsForm.username}
                    helperText={errorsForm.username}
                    placeholder="Enter your username"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errorsForm.email}
                    helperText={errorsForm.email}
                    placeholder="Enter your email"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* User Type */}
                <div className="col-md-6 mb-3">
                  <FormControl fullWidth>
                    <InputLabel>User Type</InputLabel>
                    <Select
                      multiple
                      value={personName}
                      onChange={handleChangeUserType}
                      input={<OutlinedInput label="User Type" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const role = roles.find((r) => r.name === value);
                            return (
                              <Chip
                                key={value}
                                label={role?.description || value}
                                title={role?.description}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.name} value={role.name}>
                          {role.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Theater Assign - Now Multiple Selection */}
                <div className="col-md-6 mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Theater Assign</InputLabel>
                    <Select
                      multiple
                      name="theater_ids"
                      value={formData.theater_ids || []}
                      onChange={handleTheaterChange}
                      input={<OutlinedInput label="Theater Assign" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const theater = theaters.find(
                              (t) => t.id === value,
                            );
                            return (
                              <Chip
                                key={value}
                                label={theater?.name || value}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {theaters.map((theater) => (
                        <MenuItem key={theater.id} value={theater.id}>
                          {theater.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChangeStatus}
                      label="Status"
                    >
                      {Object.entries(Status).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Access Model */}
                <div className="col-md-12 mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Access Model</InputLabel>
                    <Select
                      multiple
                      value={accessName}
                      onChange={handleChangeAccessType}
                      input={<OutlinedInput label="Access Model" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const access = accessModels.find(
                              (a) => a.name === value,
                            );
                            return (
                              <Chip
                                key={value}
                                label={access?.description || value}
                                title={access?.description}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {accessModels.map((access) => (
                        <MenuItem key={access.name} value={access.name}>
                          {access.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Submit Button */}
                <div className="col-md-12 mt-3">
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        px: 5,
                        py: 1.5,
                        fontSize: "16px",
                        textTransform: "none",
                        fontWeight: 500,
                        borderRadius: 2,
                        boxShadow: "none",
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
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

export default UserUpdate;
