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
  Box,
  Chip,
} from "@mui/material";

const MoreClarificationsRequired = ({ data }) => {
  const clarificationUrlObj = data?.moreclarification_complaint_urls_obj || {};

  const tables = Object.entries(clarificationUrlObj).filter(
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
          No More Clarifications Required URLs
        </Typography>

        <Typography variant="body2" color="text.secondary">
          There are currently no URLs requiring further clarification.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tables.map(([intermediaryId, urls]) => {
        const intermediaryName = urls[0]?.intermediary?.name || "Not Assigned";

        return (
          <Box key={intermediaryId} sx={{ mb: 5 }}>
            {/* Header */}
            <Box
              sx={{
                mb: 2,
                px: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {intermediaryName}
                </Typography>

                <Chip
                  label={`${urls.length} URL${urls.length !== 1 ? "s" : ""}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "grey.50",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        width: "100%",
                      }}
                    >
                      URL
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {urls.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell
                        sx={{
                          py: 1.5,
                        }}
                      >
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            wordBreak: "break-all",
                          }}
                        >
                          {item.url}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default MoreClarificationsRequired;
