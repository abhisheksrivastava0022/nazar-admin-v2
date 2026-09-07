import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionMenu from "../../Utils/ActionMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RequestTable = ({
  data,
  loading,
  BASE_URL_API,
  onViewDetails,
  onVerified,
  formatDate,
  statusConfig,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No requests found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters
        </Typography>
      </Box>
    );
  }

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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.50" }}>
            <TableCell>CASE ID</TableCell>
            <TableCell>TITLE</TableCell>
            <TableCell>TOTAL COMPLAINTS</TableCell>
            <TableCell>PROCESS COMPLAINTS</TableCell>
            <TableCell>TOTAL URLS</TableCell>
            {/* <TableCell>PROCESS URLS</TableCell> */}
            <TableCell>TAKEDOWN URLS</TableCell>
            <TableCell>CLARIFICATION URLS</TableCell>
            {/* <TableCell>REJECTED URLS</TableCell> */}
            {/* <TableCell>URL's</TableCell> */}
            {/* <TableCell>EVIDENCE</TableCell> */}
            {/* <TableCell>Report Date</TableCell> */}
            {/* <TableCell align="center">View</TableCell> */}
            {/* <TableCell align="center">Status</TableCell> */}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((request) => (
            <TableRow
              key={request.id}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  #{request.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {request.title || "N/A"}
                </Typography>
              </TableCell>

              {/* <TableCell>
                {request.urls ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadUrls(request.urls, request.title)}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    Download
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Urls
                  </Typography>
                )}
              </TableCell> */}

              {/* Evidence Column */}
              {/* <TableCell>
                {request.evidence ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    href={`${BASE_URL_API}/${request.evidence}`}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    Download
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No evidence
                  </Typography>
                )}
              </TableCell> */}

              <TableCell>
                {request.total_complaint ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.total_complaint}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Complaints
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                {request.proccess_complaint ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.proccess_complaint}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No process Complaints
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                {request.total_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.total_url}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No URLs
                  </Typography>
                )}
              </TableCell>

              {/* <TableCell>
                {request.proccessed_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.proccessed_url}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No process URLs
                  </Typography>
                )}
              </TableCell> */}

              <TableCell>
                {request.takedown_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.takedown_url}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No takedown URLs
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                {request.clarification_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.clarification_url}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No clarification URLs
                  </Typography>
                )}
              </TableCell>

              {/* <TableCell>
                {request.rejected_url ? (
                  <Button
                    size="small"
                    variant="outlined"
                    // startIcon={<DownloadIcon />}
                    target="_blank"
                    sx={{ borderRadius: 2 }}
                  >
                    {request.rejected_url}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No rejected URLs
                  </Typography>
                )}
              </TableCell> */}

              {/* <TableCell>
                <Tooltip title={formatDate(request.createdAt)}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </Typography>
                </Tooltip>
              </TableCell> */}

              <TableCell align="center">
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => onViewDetails(request)}
                    sx={{
                      bgcolor: "info.lighter",
                      "&:hover": { bgcolor: "info.light" },
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>

              {/* <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  {request.status && (
                    <ActionMenu
                      items={Object.values(statusConfig)
                        .filter((status) => {
                          const allowedStatuses = {
                            1: [
                              // "pending",
                              // "verified",
                              // "approved",
                              "rejected",
                              // "declined",
                              // "compliance",
                              "send_to_sehyog",
                              "clarification_required",
                              // "information_received",
                              // "resolved",
                            ],

                            2: [],

                            3: [],

                            4: [],

                            5: [],

                            6: [],

                            7: [
                              "resolved",
                              "rejected",
                              "clarification_required",
                            ],

                            8: [],

                            9: [
                              "clarification_required",
                              "rejected",
                              "resolved",
                              "send_to_sehyog",
                            ],

                            10: [],
                          };

                          return allowedStatuses[request.status]?.includes(
                            status.slug,
                          );
                        })
                        .map((status) => ({
                          label: status.label,

                          onClick: () => onVerified(request, status.slug),
                        }))}
                    />
                  )}
                </Stack>
              </TableCell> */}

              {/* <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  {request.status ? (
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

                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Stack>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
