"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import { LineChart } from "@mui/x-charts/LineChart";
import "@/app/globals.css";

type GrowthData = {
  userId: string;
  users: number;
};

type UserGrowthChartProps = {
  growthData: GrowthData[];
  totalNewUsers: number;
};

export default function UserGrowthChart({
  growthData,
  totalNewUsers,
}: UserGrowthChartProps) {
  return (
    <Card className="dashboard-chart-card" elevation={0}>
      <CardContent>
        <Stack direction="row" className="dashboard-chart-header">
          <Box>
            <Typography className="chart-title">User Growth</Typography>

            <Typography className="chart-subtitle">
              Total users by User ID
            </Typography>
          </Box>

          <Box className="dashboard-chart-total">
            <Typography className="dashboard-total-value">
              {totalNewUsers}
            </Typography>

            <Typography className="chart-subtitle">Total Users</Typography>
          </Box>
        </Stack>

        <Box className="line-chart-wrapper">
          <LineChart
            dataset={growthData}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "userId",
                label: "User ID",
              },
            ]}
            series={[
              {
                dataKey: "users",
                label: "Total Users",
                color: "#16a34a",
                curve: "linear",
                area: true,
              },
            ]}
            yAxis={[
              {
                min: 0,
                tickMinStep: 1,
              },
            ]}
            height={260}
            grid={{ horizontal: true }}
            margin={{
              left: 45,
              right: 20,
              top: 25,
              bottom: 40,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
