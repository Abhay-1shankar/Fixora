"use client";

import { Card, Text, Flex } from "@radix-ui/themes";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

const priorityColors = {
  LOW: "#0090ff",
  MEDIUM: "#ffb224",
  HIGH: "#f76808",
  CRITICAL: "#e5484d",
};

const PriorityDistributionChart = ({ low, medium, high, critical }: Props) => {
  const data = [
    { name: "Low", value: low, color: priorityColors.LOW },
    { name: "Medium", value: medium, color: priorityColors.MEDIUM },
    { name: "High", value: high, color: priorityColors.HIGH },
    { name: "Critical", value: critical, color: priorityColors.CRITICAL },
  ].filter((item) => item.value > 0);

  const total = low + medium + high + critical;

  return (
    <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
      <Flex direction="column" gap="1" mb="2">
        <Text weight="bold" size="3" className="text-white">
          Priority Distribution
        </Text>
        <Text size="1" className="text-zinc-500">
          Backlog weight across {total} {total === 1 ? "issue" : "issues"}
        </Text>
      </Flex>

      {total === 0 ? (
        <Flex align="center" justify="center" className="min-h-[260px]">
          <Text size="2" className="text-zinc-500">
            No issues to display
          </Text>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                borderRadius: "8px",
                color: "#f4f4f5",
                fontSize: "0.85rem",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              formatter={(value: number, name: string) => [
                `${value} (${((value / total) * 100).toFixed(0)}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px", color: "#a1a1aa" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default PriorityDistributionChart;
