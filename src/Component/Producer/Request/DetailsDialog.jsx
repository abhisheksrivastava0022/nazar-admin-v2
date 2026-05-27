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
  Paper,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";

import {
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import ApiClient from "../../../API/ApiClient";

const DetailsDialog = ({
  open,
  onClose,
  request,
  BASE_URL_API,
  formatDate,
  statusConfig,
}) => {
  if (!request) return null;

  const downloadUrls = (urlsData, title = "urls") => {
    try {
      const urls = JSON.parse(urlsData);

      const csvContent =
        "data:text/csv;charset=utf-8," + ["URL", ...urls].join("\n");

      const encodedUri = encodeURI(csvContent);

      const link = document.createElement("a");

      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title}.csv`);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV download error:", error);
    }
  };

  const SectionTitle = ({ children }) => (
    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{
        mb: 1.5,
        color: "#111827",
      }}
    >
      {children}
    </Typography>
  );

  const CardBox = ({ children }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #edf2f7",
        backgroundColor: "#fff",
        transition: "0.2s",

        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        },
      }}
    >
      {children}
    </Paper>
  );

  const Label = ({ children }) => (
    <Typography
      variant="caption"
      sx={{
        color: "#6b7280",
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </Typography>
  );

  const Value = ({ children }) => (
    <Typography
      variant="body1"
      sx={{
        mt: 0.5,
        fontWeight: 500,
        color: "#111827",
        wordBreak: "break-word",
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          background: "linear-gradient(to bottom, #ffffff, #fafafa)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #eee",
          background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                letterSpacing: 0.3,
              }}
            >
              Request Details
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              NZ-{request.id}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",

              "&:hover": {
                bgcolor: "#f3f4f6",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          backgroundColor: "#f8fafc",
        }}
      >
        <Grid container spacing={2.5}>
          {/* Basic Information */}
          <Grid size={{ md: 12 }}>
            <SectionTitle>Basic Information</SectionTitle>

            <CardBox>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Case Number</Label>
                  <Value>#{request.id}</Value>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Status</Label>

                  <Box mt={1}>
                    <Chip
                      label={statusConfig[request.status]?.label || "Unknown"}
                      size="small"
                      variant="filled"
                      sx={{
                        backgroundColor:
                          statusConfig[request.status]?.bg || "#E0E0E0",

                        color: statusConfig[request.status]?.text || "#000",

                        fontWeight: 600,
                        borderRadius: "8px",
                        minWidth: "120px",
                        height: 30,

                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {request?.producer_movie?.cbfc_certificate_number && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Label>Certificate Number</Label>

                    <Value>
                      {request?.producer_movie?.cbfc_certificate_number ||
                        "N/A"}
                    </Value>
                  </Grid>
                )}

                {request?.producer_movie?.application_cert_id && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Label>Application Number</Label>

                    <Value>
                      {request?.producer_movie?.application_cert_id || "N/A"}
                    </Value>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Label>Title</Label>

                  <Value>{request.title || "N/A"}</Value>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Label>Description</Label>

                  <Value>
                    {request.description || "No description provided"}
                  </Value>
                </Grid>
              </Grid>
            </CardBox>
          </Grid>

          {/* Producer Information */}
          <Grid size={{ md: 12 }}>
            <SectionTitle>Producer Information</SectionTitle>

            <CardBox>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Name</Label>

                  <Value>
                    {request.producer?.first_name} {request.producer?.last_name}
                  </Value>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Email</Label>

                  <Value>{request.producer?.email || "N/A"}</Value>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Phone</Label>

                  <Value>{request.producer?.phone || "N/A"}</Value>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Mode</Label>

                  <Value>{request.mode || "N/A"}</Value>
                </Grid>
              </Grid>
            </CardBox>
          </Grid>

          {/* URLs */}
          <Grid size={{ md: 12 }}>
            <SectionTitle>URLs</SectionTitle>

            <CardBox>
              <Grid container spacing={2}>
                {request.urls ? (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadUrls(request.urls, request.title)}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#dbe3ea",

                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8fbff",
                        },
                      }}
                    >
                      Download URLs
                    </Button>
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      No URLs available
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardBox>
          </Grid>

          {/* Attachments */}
          <Grid size={{ md: 12 }}>
            <SectionTitle>Attachments</SectionTitle>

            <CardBox>
              <Grid container spacing={2}>
                {request.cbfc_certificate && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.cbfc_certificate}`}
                      target="_blank"
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#dbe3ea",

                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8fbff",
                        },
                      }}
                    >
                      Download CBFC Certificate
                    </Button>
                  </Grid>
                )}

                {request.court_order && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.court_order}`}
                      target="_blank"
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#dbe3ea",

                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8fbff",
                        },
                      }}
                    >
                      Download Court Order
                    </Button>
                  </Grid>
                )}

                {request.evidence && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.evidence}`}
                      target="_blank"
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#dbe3ea",

                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8fbff",
                        },
                      }}
                    >
                      Download Evidence
                    </Button>
                  </Grid>
                )}

                {request.csv_file && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={`${BASE_URL_API}/${request.csv_file}`}
                      target="_blank"
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#dbe3ea",

                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8fbff",
                        },
                      }}
                    >
                      Download CSV File
                    </Button>
                  </Grid>
                )}

                {!request.cbfc_certificate && !request.evidence && (
                  <Grid size={{ xs: 12 }}>
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
            </CardBox>
          </Grid>

          {/* Timeline */}
          <Grid size={{ md: 12 }}>
            <SectionTitle>Timeline</SectionTitle>

            <CardBox>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Created</Label>

                  <Value>{formatDate(request.createdAt)}</Value>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Last Updated</Label>

                  <Value>{formatDate(request.updatedAt)}</Value>
                </Grid>
              </Grid>
            </CardBox>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #eee",
          backgroundColor: "#fff",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            boxShadow: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
