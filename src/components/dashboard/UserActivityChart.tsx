"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslations } from "next-intl";
import "@/app/globals.css";

const activityData = [
  { day: "Mon", active: 12, inactive: 4 },
  { day: "Tue", active: 18, inactive: 5 },
  { day: "Wed", active: 15, inactive: 6 },
  { day: "Thu", active: 24, inactive: 7 },
  { day: "Fri", active: 28, inactive: 5 },
  { day: "Sat", active: 32, inactive: 8 },
  { day: "Sun", active: 38, inactive: 6 },
];

export default function UserActivityChart() {
  const t = useTranslations("Dashboard");

  const translatedData = activityData.map((item) => ({
    ...item,
    day: t(`days.${item.day}`),
  }));

  return (
    <Card className="dashboard-chart-card" elevation={0}>
      <CardContent>
        <Typography className="chart-title">{t("userActivity")}</Typography>

        <Typography className="chart-subtitle">
          {t("activitySubtitle")}
        </Typography>

        <Box className="line-chart-wrapper">
          <LineChart
            dataset={translatedData}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "day",
              },
            ]}
            series={[
              {
                dataKey: "active",
                label: t("activeUsers"),
                color: "#7251b3",
                curve: "linear",
              },
              {
                dataKey: "inactive",
                label: t("inactiveUsers"),
                color: "#f59e0b",
                curve: "linear",
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
              bottom: 30,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
