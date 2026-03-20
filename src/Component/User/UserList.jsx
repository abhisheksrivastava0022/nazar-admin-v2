import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { FiberManualRecord } from "@mui/icons-material";

import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import { Link, Navigate, useParams } from "react-router-dom";
import ApiUser from "../../API/ApiUser";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import ApiClient from "../../API/ApiClient";
import { Status } from "../Constant/User";

const UserList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const { deleteRequest } = ApiClient();
  const { id = null } = useParams();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [prepareDelete, setPrepareDelete] = useState(null);

  const [formData, setformData] = useState({
    name: "",
    country_id: null,
    phone: "",
    email: "",
    website: "",
    ott_form_id: id,
  });

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setOpenDeleteConfirm(false);
  };

  const handleDeleteOpen = (id) => {
    setPrepareDelete(id);
    setOpenDeleteConfirm(true);
  };

  const submitDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await deleteRequest(`api/user/${prepareDelete}`);

      if (!response.status) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      } else {
        loadpredata();
        setAlertMessage("Data has been deleted successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error: ", error);
      // alert('Error submitting form. Please try again later.');
      setAlertMessage("Error submitting form. Please try again later.");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false); // Set loading to false when the API call finishes
    }
    setOpenDeleteConfirm(false);
  };

  const { loadUserList } = ApiUser();
  // Fetch data from the API
  const loadpredata = async () => {
    const user_list = await loadUserList();
    let userData = [];
    if (user_list?.data) {
      userData = user_list?.data;
    }
    setData(userData);
  };

  useEffect(() => {
    loadpredata();
    return;
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card elevation={3}>
          <CardHeader
            sx={{
              backgroundColor: "innherit",
              px: 3,
              py: 2,
              borderBottom: "1px solid #e0e0e0",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
            titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            subheaderTypographyProps={{
              sx: { color: "text.secondary", mt: 0.5 },
            }}
            title="Users"
            subheader="Manage your user's access and roles"
            action={
              <Link to="/user/create" style={{ textDecoration: "none" }}>
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
                  Create
                </Button>
              </Link>
            }
          />

          <CardContent>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "innherit" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Edit</TableCell>
                    {/* <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell> */}
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Delete</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No users found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ backgroundColor: "innherit" }}
                      >
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              component={Link}
                              to={`/user/${row.id}`}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        {/* <TableCell>{row.id}</TableCell> */}
                        <TableCell>{row.username}</TableCell>
                        <TableCell>
                          {row.first_name} {row.last_name}
                        </TableCell>

                        <TableCell>{row.email}</TableCell>
                        {/* <TableCell>{Status[row.status]}</TableCell> */}
                        <TableCell align="center">
                          {/* <CheckCircleIcon */}
                          <FiberManualRecord
                            sx={{
                              fontSize: 25,
                              color:
                                row.status == 1 ? "success.main" : "error.main",
                              verticalAlign: "middle",
                            }}
                            titleAccess={
                              row.status == 1 ? "Active" : "Inactive"
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteOpen(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <DeleteDialog
                            value={row.id}
                            open={openDeleteConfirm}
                            handleClose={handleDeleteClose}
                            handleDelete={submitDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRows}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                mt: 2,
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.875rem",
                  },
              }}
            />
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

export default UserList;
