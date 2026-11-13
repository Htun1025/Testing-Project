"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Dashboard");

  return (
    <Card className="dashboard-chart-card" elevation={0}>
      <CardContent>
        <Stack direction="row" className="dashboard-chart-header">
          <Box>
            <Typography className="chart-title">{t("userGrowth")}</Typography>

            <Typography className="chart-subtitle">
              {t("growthSubtitle")}
            </Typography>
          </Box>

          <Box className="dashboard-chart-total">
            <Typography className="dashboard-total-value">
              {totalNewUsers}
            </Typography>

            <Typography className="chart-subtitle">
              {t("totalUsers")}
            </Typography>
          </Box>
        </Stack>

        <Box className="line-chart-wrapper">
          <LineChart
            dataset={growthData}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "userId",
                label: t("userId"),
              },
            ]}
            series={[
              {
                dataKey: "users",
                label: t("totalUsers"),
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
