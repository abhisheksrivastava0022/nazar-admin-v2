import React from "react";
import {
  Paper,
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const RequestFilter = ({
  // Producer search props
  selectedProducer,
  onProducerChange,
  onProducerSearchChange,
  producerOptions,
  loadingProducers,
  // producerSearchQuery,

  // Search props
  // searchQuery,
  // onSearchChange,
  // onSearchSubmit,

  // Status filter props
  // statusFilter,
  // onStatusFilterChange,

  // Pagination props
  // rowsPerPage,
  // onRowsPerPageChange,

  // Refresh props
  // onRefresh,
  // onClearProducer,

  // statusConfig,
}) => {
  return (
    <div className="pb-3">
      <Grid container spacing={2} alignItems="center">
        {/* Producer Search Typeahead */}
        <Grid size={{ md: 12 }}>
          <Autocomplete
            value={selectedProducer}
            onChange={onProducerChange}
            onInputChange={(event, newInputValue) => {
              onProducerSearchChange(newInputValue);
            }}
            options={producerOptions}
            getOptionLabel={(option) =>
              option.producer_name ||
              `${option.first_name || ""} ${option.last_name || ""}`.trim()
            }
            loading={loadingProducers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Producer"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingProducers && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body2">
                    {option.producer_name ||
                      `${option.first_name} ${option.last_name}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email} {option.mobile && `• ${option.mobile}`}
                  </Typography>
                </Box>
              </li>
            )}
            noOptionsText="No producers found"
          />
        </Grid>

        {/* Search Bar */}
        {/* <Grid size={{ md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search by title..."
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={(e) => e.key === "Enter" && onSearchSubmit()}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onSearchSubmit}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />
        </Grid> */}

        {/* Status Filter */}
        {/* <Grid size={{ md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={onStatusFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              {Object.entries(statusConfig).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}

        {/* Rows Per Page */}
        {/* <Grid size={{ md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Rows</InputLabel>
            <Select
              value={rowsPerPage}
              label="Rows"
              onChange={onRowsPerPageChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

        {/* Refresh Button */}
        {/* <Grid size={{ md: 2 }} sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={onRefresh}
              sx={{
                backgroundColor: "primary.lighter",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {selectedProducer && (
            <Button
              size="small"
              variant="outlined"
              onClick={onClearProducer}
              sx={{ borderRadius: 2 }}
            >
              Clear Filter
            </Button>
          )}
        </Grid> */}
      </Grid>
    </div>
  );
};

export default RequestFilter;
