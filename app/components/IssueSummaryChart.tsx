"use client";

import { Card, Text, Flex } from "@radix-ui/themes";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const statusColors = {
  OPEN: "#e5484d",
  IN_PROGRESS: "#8e4ec6",
  CLOSED: "#30a46c",
};

const IssueSummaryChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: "Open", value: open, color: statusColors.OPEN },
    { label: "In Progress", value: inProgress, color: statusColors.IN_PROGRESS },
    { label: "Closed", value: closed, color: statusColors.CLOSED },
  ];

  const total = open + inProgress + closed;

  return (
    <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
      <Flex direction="column" gap="1" mb="5">
        <Text weight="bold" size="3" className="text-white">
          Issue Volume by Status
        </Text>
        <Text size="1" className="text-zinc-500">
          Total {total} tracked {total === 1 ? "issue" : "issues"}
        </Text>
      </Flex>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <XAxis
            dataKey="label"
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a" }}
          />
          <YAxis
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a" }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            contentStyle={{
              backgroundColor: "#09090b",
              borderColor: "#27272a",
              borderRadius: "8px",
              color: "#f4f4f5",
              fontSize: "0.85rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
            formatter={(value: number) => [`${value} issues`, "Count"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueSummaryChart;
