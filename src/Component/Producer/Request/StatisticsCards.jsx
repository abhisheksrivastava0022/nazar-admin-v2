import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const StatisticsCards = ({ totalRecords, pending, approved, rejected }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "primary.lighter" }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {totalRecords}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total Requests
                    </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "warning.lighter" }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Pending
                    </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "success.lighter" }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                        {approved}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Approved
                    </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.lighter" }}>
                    <Typography variant="h4" color="error.main" fontWeight="bold">
                        {rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rejected
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default StatisticsCards;