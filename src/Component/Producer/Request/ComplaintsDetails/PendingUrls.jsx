import { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Link,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Button,
} from "@mui/material";
import ApiClient from "../../../../API/ApiClient";

const PendingUrls = ({ data, intermediaryData, fetchData }) => {
  const { postRequestApi } = ApiClient();
  const [formData, setFormData] = useState({});

  const pendingUrlObj = data?.formated_pending_url_obj || {};

  // Currently selected table/intermediary
  const [selectedTable, setSelectedTable] = useState(null);

  // Selected URL IDs
  const [selectedUrls, setSelectedUrls] = useState([]);

  /**
   * Select / Unselect individual URL
   */
  const handleUrlSelection = (tableId, urlId) => {
    // If another table is already selected, don't allow selection
    if (selectedTable !== null && selectedTable !== tableId) {
      return;
    }

    setSelectedTable(tableId);

    setSelectedUrls((prev) => {
      const alreadySelected = prev.includes(urlId);

      const updated = alreadySelected
        ? prev.filter((id) => id !== urlId)
        : [...prev, urlId];

      // If nothing is selected anymore,
      // allow selection from another table
      if (updated.length === 0) {
        setSelectedTable(null);
      }

      return updated;
    });
  };

  /**
   * Select / Unselect all URLs
   * Only affects the current table
   */
  const handleSelectAll = (tableId, urls) => {
    // Another table is already selected
    if (selectedTable !== null && selectedTable !== tableId) {
      return;
    }

    const urlIds = urls.map((item) => item.id);

    const allSelected = urlIds.every((id) => selectedUrls.includes(id));

    if (allSelected) {
      // Deselect all from current table
      setSelectedUrls((prev) => prev.filter((id) => !urlIds.includes(id)));

      setSelectedTable(null);
    } else {
      // Select all current table URLs
      setSelectedTable(tableId);

      setSelectedUrls((prev) => [
        ...prev.filter((id) => !urlIds.includes(id)),
        ...urlIds,
      ]);
    }
  };

  /**
   * Send selected URLs
   */
  const handelSendToSehaog = async (tableId) => {
    const selectedItems =
      pendingUrlObj[tableId]?.filter((item) =>
        selectedUrls.includes(item.id),
      ) || [];

    const selectedUrlIds = selectedItems.map((item) => item.id);

    const payload = {
      urls: selectedUrlIds,
    };

    try {
      const response = await postRequestApi(
        "api/producer/send-to-sehyog",
        payload,
      );

      if (response.status) {
        alert("URLs sent to Sehaog successfully!");
        fetchData();
      } else {
        alert("Failed to send URLs. Please try again.");
      }
    } catch (error) {
      console.error("Error sending URLs:", error);
      alert("Something went wrong while sending URLs.");
    }
  };

  const handelIntermediaryFirst = async (tableId) => {
    const selectedItems =
      pendingUrlObj[tableId]?.filter((item) =>
        selectedUrls.includes(item.id),
      ) || [];

    const selectedUrlIds = selectedItems.map((item) => item.id);

    console.log("Selected URLs:", selectedItems);
    console.log("Selected URL IDs:", selectedUrlIds);
    console.log("Form Data:", formData);

    const payload = {
      urls: selectedUrlIds,
      ...formData,
    };

    try {
      const response = await postRequestApi(
        "api/producer/select-intermediary",
        payload,
      );

      if (response.status) {
        alert("Intermediary changed successfully!");
        fetchData();
      } else {
        alert("Failed to change intermediary. Please try again.");
      }
    } catch (error) {
      console.error("Error changing intermediary:", error);
      alert("Something went wrong while changing intermediary.");
    }

    // API call here
  };

  const handleChnageIntermediary = async (urlId, intermediaryId) => {
    // console.log("Selected URL:", urlId);
    // console.log("Selected Intermediary:", intermediaryId);

    if (
      !window.confirm(
        "Are you sure you want to change the intermediary for this URL?",
      )
    ) {
      return;
    }

    const payload = {
      urls: urlId, // current URL only
      intermediary_id: intermediaryId,
    };

    try {
      const response = await postRequestApi(
        "api/producer/change-intermediary",
        payload,
      );

      if (response.status) {
        alert("Intermediary changed successfully!");

        fetchData();
      } else {
        alert("Failed to change intermediary. Please try again.");
      }
    } catch (error) {
      console.error("Error changing intermediary:", error);
      alert("Something went wrong while changing intermediary.");
    }
  };

  const handleChange = (event) => {
    const selectedIntermediaryId = event.target.value;

    setFormData((prev) => ({
      ...prev,
      intermediary_id: selectedIntermediaryId,
    }));
  };

  const tables = Object.entries(pendingUrlObj).filter(
    ([, urls]) => Array.isArray(urls) && urls.length > 0,
  );

  // No URLs found
  if (tables.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Pending Complaint URLs
        </Typography>

        <Typography variant="body2" color="text.secondary">
          There are currently no URLs requiring further clarification.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {Object.entries(pendingUrlObj).map(([intermediaryId, urls]) => {
        if (!urls?.length) return null;

        const intermediaryName = urls[0]?.intermediary?.name || "Not Assigned";

        const tableSelected = selectedTable === intermediaryId;

        const anotherTableSelected =
          selectedTable !== null && selectedTable !== intermediaryId;

        const urlIds = urls.map((item) => item.id);

        const selectedCount = urlIds.filter((id) =>
          selectedUrls.includes(id),
        ).length;

        const allSelected = urls.length > 0 && selectedCount === urls.length;

        return (
          <Box key={intermediaryId} sx={{ mb: 4 }}>
            {/* Table Header */}
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
                {intermediaryName}
              </Typography>

              {/* Send Button */}
              {intermediaryName === "Not Assigned" ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !tableSelected ||
                      selectedCount === 0 ||
                      !formData?.intermediary_id
                    }
                    onClick={() => handelIntermediaryFirst(intermediaryId)}
                  >
                    Select Intermediary First
                    {selectedCount > 0 ? ` (${selectedCount})` : ""}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!tableSelected || selectedCount === 0}
                    onClick={() => handelSendToSehaog(intermediaryId)}
                  >
                    Send To Sehaog
                    {selectedCount > 0 ? ` (${selectedCount})` : ""}
                  </Button>
                </>
              )}
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "grey.50",
                    }}
                  >
                    {/* Select All */}
                    <TableCell width="80px">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={
                          selectedCount > 0 && selectedCount < urls.length
                        }
                        disabled={anotherTableSelected}
                        onChange={() => handleSelectAll(intermediaryId, urls)}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>

                    <TableCell sx={{ fontWeight: 600 }} width="30%">
                      {intermediaryName === "Not Assigned" ? (
                        <>
                          <FormControl fullWidth size="small">
                            <InputLabel>Select Intermediary</InputLabel>

                            <Select
                              label="Select Intermediary"
                              value={formData?.intermediary_id || ""}
                              disabled={anotherTableSelected}
                              onChange={handleChange}
                            >
                              <MenuItem value="" disabled>
                                <em>Select Intermediary</em>
                              </MenuItem>

                              {intermediaryData?.map((intermediary) => (
                                <MenuItem
                                  key={intermediary.id}
                                  value={intermediary.id}
                                >
                                  {intermediary.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      ) : (
                        <>INTERMEDIARY</>
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {urls.map((item) => {
                    const isSelected = selectedUrls.includes(item.id);

                    return (
                      <TableRow key={item.id} hover selected={isSelected}>
                        {/* Checkbox */}
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            disabled={anotherTableSelected}
                            onChange={() =>
                              handleUrlSelection(intermediaryId, item.id)
                            }
                          />
                        </TableCell>

                        {/* URL */}
                        <TableCell>
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            {item.url}
                          </Link>
                        </TableCell>

                        {/* Intermediary */}
                        <TableCell>
                          {intermediaryName === "Not Assigned" ? (
                            <></>
                          ) : (
                            <>
                              <FormControl fullWidth size="small">
                                <InputLabel>Select Intermediary</InputLabel>

                                <Select
                                  label="Select Intermediary"
                                  value={item?.intermediary?.id || ""}
                                  disabled={anotherTableSelected}
                                  onChange={(event) =>
                                    handleChnageIntermediary(
                                      item.id,
                                      event.target.value,
                                    )
                                  }
                                >
                                  <MenuItem value="">
                                    <em>Select Intermediary</em>
                                  </MenuItem>

                                  {intermediaryData?.map((intermediary) => (
                                    <MenuItem
                                      key={intermediary.id}
                                      value={intermediary.id}
                                    >
                                      {intermediary.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default PendingUrls;
