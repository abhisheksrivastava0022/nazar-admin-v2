import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../../API/ApiClient";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PendingUrls from "./ComplaintsDetails/PendingUrls";
import ProcessedComplaint from "./ComplaintsDetails/ProcessedComplaint";
import MoreClarificationsRequired from "./ComplaintsDetails/MoreClarificationsRequired";
import TakedownComplaint from "./ComplaintsDetails/TakedownComplaint";
import Rejected from "./ComplaintsDetails/Rejected";
import TotalComplants from "./ComplaintsDetails/TotalComplants";

const RequestComplaintDetails = () => {
  const { id } = useParams();
  const { getRequestApi } = ApiClient();
  const [data, setData] = useState(null);
  const [intermediaryData, setIntermediaryData] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  const loadData = async () => {
    // Fetch data based on the id parameter
    try {
      const response = await getRequestApi(
        `api/producer/complaintDetails/${id}`,
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const loadIntermediaryData = async () => {
    // Fetch intermediary data if needed
    try {
      const response = await getRequestApi(`api/intermediary`);
      setIntermediaryData(response.data);
    } catch (error) {
      console.error("Error fetching intermediary data:", error);
    }
  };

  React.useEffect(() => {
    loadData();
    loadIntermediaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleIntermediaryChange = (event) => {
    const selectedIntermediaryId = event.target.value;
    console.log("Selected Intermediary ID:", selectedIntermediaryId);
    setData((prevData) => ({
      ...prevData,
      intermediary_id: selectedIntermediaryId,
    }));
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Complaint Details for : {data?.producer_movie?.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Review and manage complaints
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="complaint status tabs"
              sx={{
                minHeight: 48,

                "& .MuiTab-root": {
                  minHeight: 48,
                  minWidth: "auto",
                  px: 2,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                },

                "& .MuiTabs-scrollButtons": {
                  width: 36,
                },
              }}
            >
              <Tab
                label={`Total Complaints (${data?.total_complaint_urls ?? 0})`}
              />

              <Tab
                label={`Pending URLs (${data?.pending_complaint_urls ?? 0})`}
              />

              <Tab
                label={`In Progress URLs (${
                  data?.processed_complaint_urls ?? 0
                })`}
              />

              <Tab
                label={`More Clarifications Required (${
                  data?.moreclarification_complaint_urls ?? 0
                })`}
              />

              <Tab
                label={`Takedown Complaint (${
                  data?.takedown_complaint_urls ?? 0
                })`}
              />

              <Tab
                label={`Rejected URLs (${data?.rejected_complaint_urls ?? 0})`}
              />
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>
            {tabValue === 0 ? (
              <>
                <TotalComplants
                  data={data}
                  intermediaryData={intermediaryData}
                  handleIntermediaryChange={handleIntermediaryChange}
                  fetchData={loadData}
                />
              </>
            ) : null}
            {tabValue === 1 ? (
              <Typography>
                <PendingUrls
                  data={data}
                  intermediaryData={intermediaryData}
                  handleIntermediaryChange={handleIntermediaryChange}
                  fetchData={loadData}
                />
              </Typography>
            ) : null}
            {tabValue === 2 ? (
              <>
                <ProcessedComplaint
                  data={data}
                  intermediaryData={intermediaryData}
                />
              </>
            ) : null}
            {tabValue === 3 ? (
              <>
                <MoreClarificationsRequired
                  data={data}
                  intermediaryData={intermediaryData}
                />
              </>
            ) : null}
            {tabValue === 4 ? (
              <>
                <TakedownComplaint
                  data={data}
                  intermediaryData={intermediaryData}
                />
              </>
            ) : null}
            {tabValue === 5 ? (
              <>
                <Rejected data={data} intermediaryData={intermediaryData} />
              </>
            ) : null}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RequestComplaintDetails;
