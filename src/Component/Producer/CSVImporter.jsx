import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Alert,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const CSVImporter = ({ open, onClose, onSuccess, ApiUploadFile }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    validateAndSetFile(file);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  // Validate and set file
  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setCsvError("Please upload a valid CSV file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCsvError("File size should be less than 5MB");
      return;
    }

    setCsvFile(file);
    setCsvError("");
  };

  // Handle CSV import using ApiUploadFile
  const handleImportCSV = async () => {
    if (!csvFile) return;

    setImportLoading(true);
    setCsvError("");

    try {
      const response = await ApiUploadFile("api/producer/import-csv", csvFile);

      if (response.status) {
        if (onSuccess) {
          onSuccess(response);
        }
        handleClose();
      } else {
        setCsvError(response.message || "Failed to import CSV");
      }
    } catch (err) {
      setCsvError("An error occurred while importing CSV");
      console.error("Error importing CSV:", err);
    } finally {
      setImportLoading(false);
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const headers = [
      "ack_no",
      "application_date",
      "filmname",
      "language",
      "runningtime",
      "filmlengthmeter",
      "certified_duration",
      "certified_length",
      "format",
      "longshort",
      "certificate_date",
      "certificate_no",
      "producer",
      "productionhouse",
      "mobileno",
      "email",
      "paddress1",
      "paddress2",
      "paddress3",
      "ppincode",
      "country",
      "state",
      "cityname",
    ];

    const sampleRow = [
      "ACK001",
      "2024-01-15",
      "Sample Film",
      "Hindi",
      "120",
      "3000",
      "02:00:00",
      "3000",
      "Digital",
      "Feature",
      "2024-02-01",
      "CERT123",
      "John Producer",
      "Production House Name",
      "9876543210",
      "producer@example.com",
      "123 Street",
      "Area Name",
      "Landmark",
      "400001",
      "India",
      "Maharashtra",
      "Mumbai",
    ];

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "producer_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Close and reset
  const handleClose = () => {
    setCsvFile(null);
    setCsvError("");
    setDragActive(false);
    onClose();
  };

  // Remove selected file
  const removeFile = () => {
    setCsvFile(null);
    setCsvError("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Import Producers from CSV
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Template Download */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Don't have a template?
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadTemplate}
              size="small"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Download CSV Template
            </Button>
          </Box>

          {/* Drag and Drop Area */}
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragActive
                ? "primary.main"
                : csvError
                  ? "error.main"
                  : "divider",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              backgroundColor: dragActive ? "action.hover" : "background.paper",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => document.getElementById("csv-file-input").click()}
          >
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <UploadIcon
              sx={{
                fontSize: 48,
                color: dragActive ? "primary.main" : "action.active",
                mb: 2,
              }}
            />

            <Typography variant="body1" gutterBottom>
              Drag & drop your CSV file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Supported format: .csv (Max 5MB)
            </Typography>
          </Box>

          {/* Selected File */}
          {csvFile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "#e8f5e9",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "#4caf50",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">
                  <strong>{csvFile.name}</strong> (
                  {(csvFile.size / 1024).toFixed(2)} KB)
                </Typography>
              </Box>
              <IconButton size="small" onClick={removeFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Error Display */}
          {csvError && (
            <Alert severity="error" onClose={() => setCsvError("")}>
              {csvError}
            </Alert>
          )}

          {/* Instructions */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              CSV Format Requirements:
            </Typography>
            <Typography variant="caption" component="div" sx={{ ml: 2 }}>
              • Required columns (23 columns):
              <br />
              &nbsp;&nbsp;ack_no, application_date, filmname, language,
              runningtime, filmlengthmeter,
              <br />
              &nbsp;&nbsp;certified_duration, certified_length, format,
              longshort, certificate_date,
              <br />
              &nbsp;&nbsp;certificate_no, producer, productionhouse, mobileno,
              email, paddress1,
              <br />
              &nbsp;&nbsp;paddress2, paddress3, ppincode, country, state,
              cityname
              <br />• Maximum file size: <strong>5MB</strong>
              <br />• Supported format: <strong>.csv only</strong>
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
          disabled={importLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleImportCSV}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          disabled={!csvFile || importLoading}
          startIcon={importLoading && <CircularProgress size={20} />}
        >
          {importLoading ? "Importing..." : "Import CSV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVImporter;
