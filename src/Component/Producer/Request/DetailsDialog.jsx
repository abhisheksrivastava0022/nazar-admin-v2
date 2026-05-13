import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, // Make sure Chip is imported
} from "@mui/material";
import {
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
  Close as CloseIcon, // Add this import
} from "@mui/icons-material";
import ApiClient from "../../../API/ApiClient";

const DetailsDialog = ({
  open,
  onClose,
  request,
  BASE_URL_API,
  formatDate,
  statusConfig,
  // getStatusChip,
}) => {
  if (!request) return null;
  const { getRequestApi } = ApiClient();
  useEffect(() => {
    if (request.id) {
      loadStatusHistory();
      loadcompliance();
    }
  }, [request.id]);
  const [history, setHistory] = useState([]);
  const loadStatusHistory = async () => {
    const response = await getRequestApi(`api/producer/history/${request.id}`);
    if (response.status) {
      setHistory(response.data);
    }
  };
  const [compliance, setCompliance] = useState([]);
  const loadcompliance = async () => {
    const response = await getRequestApi(
      `api/producer/compliance/${request.id}`,
    );
    if (response.status) {
      setCompliance(response.data);
    }
  };

  const downloadUrls = (urlsData, title = "urls") => {
    try {
      // string ko array me convert karo
      const urls = JSON.parse(urlsData);

      // CSV content
      const csvContent =
        "data:text/csv;charset=utf-8," + ["URL", ...urls].join("\n");

      // Blob create
      const encodedUri = encodeURI(csvContent);

      // Download link create
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title}.csv`);

      document.body.appendChild(link);

      // Download trigger
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV download error:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Request Details NZ-{request.id}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Case Number
                  </Typography>
                  <Typography variant="body1">#{request.id}</Typography>
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={statusConfig[request.status]?.label || "Unknown"}
                      color={statusConfig[request.status]?.color || "default"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                    {/* {getStatusChip(request.status)} */}
                  </Box>
                </Grid>
                {request?.producer_movie.cbfc_certificate_number ? (
                  <>
                    <Grid size={{ md: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Certificate Number
                      </Typography>
                      <Typography variant="body1">
                        {request?.producer_movie.cbfc_certificate_number ||
                          "N/A"}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {request?.producer_movie.application_cert_id ? (
                  <>
                    <Grid size={{ md: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Application Number
                      </Typography>
                      <Typography variant="body1">
                        {request?.producer_movie.application_cert_id || "N/A"}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}

                <Grid size={{ md: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="body1">
                    {request.title || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ md: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {request.description || "No description provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Producer Information */}
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Producer Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {request.producer?.first_name} {request.producer?.last_name}
                  </Typography>
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {request.producer?.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {request.producer?.phone || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mode
                  </Typography>
                  <Typography variant="body1">
                    {request.mode || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Downloard */}
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Url's
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {request.urls ? (
                  <Grid size={{ md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      // href={`${BASE_URL_API}/${request.cbfc_certificate}`}
                      onClick={() => downloadUrls(request.urls, request.title)}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download Url's
                    </Button>
                  </Grid>
                ) : (
                  <>
                    <Grid size={{ md: 12 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        No url's available
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Attachments */}
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Attachments
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {request.cbfc_certificate && (
                  <Grid size={{ md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.cbfc_certificate}`}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download CBFC Certificate
                    </Button>
                  </Grid>
                )}
                {request.court_order && (
                  <Grid size={{ md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.court_order}`}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download Court Order
                    </Button>
                  </Grid>
                )}
                {request.evidence && (
                  <Grid size={{ md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.evidence}`}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download Evidence
                    </Button>
                  </Grid>
                )}
                {request.csv_file && (
                  <Grid size={{ md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.csv_file}`}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download CSV File
                    </Button>
                  </Grid>
                )}
                {!request.cbfc_certificate && !request.evidence && (
                  <Grid size={{ md: 12 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      No attachments available
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Timeline */}
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Timeline
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(request.createdAt)}
                  </Typography>
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(request.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Admin Comments */}
          {/* <Typography variant="h6" sx={{ mb: 2 }}>
            Complaint Status History
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Comment</b>
                  </TableCell>
                  <TableCell>
                    <b>Created At</b>
                  </TableCell>
                  <TableCell>
                    <b>Action Taken by</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>

                    <TableCell>
                      <Chip
                        label={statusConfig[item.status]?.label || "Unknown"}
                        color={statusConfig[item.status]?.color || "default"}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell>{item.comment || "-"}</TableCell>

                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.user.first_name} {item.user.last_name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}

          {/* <Typography variant="h6" sx={{ mb: 2 }}>
            Complaince Response
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>email</b>
                  </TableCell>
                  <TableCell>
                    <b>Comment</b>
                  </TableCell>
                  <TableCell>
                    <b>Created At</b>
                  </TableCell>

                </TableRow>
              </TableHead>

              <TableBody>
                {compliance.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>


                    <TableCell>{item.email || "-"}</TableCell>
                    <TableCell>{item.comment || "-"}</TableCell>

                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
