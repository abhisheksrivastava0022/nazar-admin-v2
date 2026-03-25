import React from "react";
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
  Chip, // Make sure Chip is imported
} from "@mui/material";
import {
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
  Close as CloseIcon, // Add this import
} from "@mui/icons-material";

const DetailsDialog = ({
  open,
  onClose,
  request,
  BASE_URL_API,
  formatDate,
  getStatusChip,
}) => {
  if (!request) return null;

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
            Request Details #{request.id}
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
                  <Box mt={0.5}>{getStatusChip(request.status)}</Box>
                </Grid>
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
          {request.admin_comment && (
            <Grid size={{ md: 12 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Admin Comments
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">{request.admin_comment}</Typography>
              </Paper>
            </Grid>
          )}
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
