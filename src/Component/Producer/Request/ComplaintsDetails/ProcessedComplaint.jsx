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

const ProcessedComplaint = ({ data }) => {
  const pendingUrlObj = data?.processed_complaint_urls_obj || {};

  return (
    <Box>
      {Object.entries(pendingUrlObj).map(([intermediaryId, urls]) => {
        if (!urls?.length) return null;

        const intermediaryName = urls[0]?.intermediary?.name || "Not Assigned";

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
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "grey.50",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {urls.map((item) => {
                    return (
                      <TableRow key={item.id} hover>
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

export default ProcessedComplaint;
