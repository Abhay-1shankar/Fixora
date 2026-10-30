import { Priority } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const priorityMap: Record<
  Priority,
  { label: string; color: "blue" | "amber" | "orange" | "red" }
> = {
  LOW: { label: "Low", color: "blue" },
  MEDIUM: { label: "Medium", color: "amber" },
  HIGH: { label: "High", color: "orange" },
  CRITICAL: { label: "Critical", color: "red" },
};

const IssuePriorityBadge = ({ priority }: { priority: Priority }) => {
  const config = priorityMap[priority] || { label: priority, color: "blue" };
  return <Badge color={config.color}>{config.label}</Badge>;
};

export default IssuePriorityBadge;
