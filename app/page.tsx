import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import IssueSummaryChart from "./components/IssueSummaryChart";
import PriorityDistributionChart from "./components/PriorityDistributionChart";
import LatestIssues from "./LatestIssues";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
  // Aggregate issues grouped by status
  const statusGroups = await prisma.issue.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const statusMap = {
    OPEN: 0,
    IN_PROGRESS: 0,
    CLOSED: 0,
  };

  statusGroups.forEach((group) => {
    statusMap[group.status] = group._count.id;
  });

  // Aggregate issues grouped by priority
  const priorityGroups = await prisma.issue.groupBy({
    by: ["priority"],
    _count: { id: true },
  });

  const priorityMap = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  priorityGroups.forEach((group) => {
    priorityMap[group.priority] = group._count.id;
  });

  return (
    <Flex direction="column" gap="5">
      {/* Top summary statistic cards */}
      <IssueSummary
        open={statusMap.OPEN}
        inProgress={statusMap.IN_PROGRESS}
        closed={statusMap.CLOSED}
      />

      {/* Two telemetry charts side-by-side on desktop, stacking on mobile */}
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <IssueSummaryChart
          open={statusMap.OPEN}
          inProgress={statusMap.IN_PROGRESS}
          closed={statusMap.CLOSED}
        />
        <PriorityDistributionChart
          low={priorityMap.LOW}
          medium={priorityMap.MEDIUM}
          high={priorityMap.HIGH}
          critical={priorityMap.CRITICAL}
        />
      </Grid>

      {/* Latest issues stream */}
      <LatestIssues />
    </Flex>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fixora - Telemetry Dashboard",
  description: "View telemetry metrics, priority breakdown, and recent issues",
};
