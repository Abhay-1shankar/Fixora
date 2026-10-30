import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { IssueQuery, columnNames } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import KanbanBoardSkeleton from "../_components/KanbanBoardSkeleton";

const KanbanBoard = nextDynamic(
  () => import("../_components/KanbanBoard"),
  {
    ssr: false,
    loading: () => <KanbanBoardSkeleton />,
  }
);

interface Props {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status =
    searchParams.status && statuses.includes(searchParams.status)
      ? searchParams.status
      : undefined;

  const orderBy =
    searchParams.orderBy && columnNames.includes(searchParams.orderBy)
      ? { [searchParams.orderBy]: "asc" }
      : undefined;

  const page = parseInt(searchParams.page || "1") || 1;
  const pageSize = 10;
  const isBoardView = searchParams.view === "board";

  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
    orderBy,
    // Disable pagination on the board view so all matching tickets load in the columns
    skip: isBoardView ? undefined : (page - 1) * pageSize,
    take: isBoardView ? undefined : pageSize,
  });

  const issueCount = await prisma.issue.count({ where: { status } });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      {isBoardView ? (
        <KanbanBoard issues={issues} />
      ) : (
        <>
          <IssueTable searchParams={searchParams} issues={issues} />
          <Pagination
            pageSize={pageSize}
            currentPage={page}
            itemCount={issueCount}
          />
        </>
      )}
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue List - Issue List",
  description: "View all project issues",
};

export default IssuesPage;