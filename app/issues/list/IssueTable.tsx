import { IssuePriorityBadge, IssueStatusBadge } from "@/app/components";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export interface IssueQuery {
  status?: Status;
  orderBy?: keyof Issue;
  page?: string;
  view?: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
    <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-950/40">
      <Table.Root variant="ghost">
        <Table.Header className="border-b border-white/5 bg-zinc-900/30">
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={`${column.className || ""} py-3 text-xs uppercase tracking-wider text-zinc-500 font-semibold`}
              >
                <NextLink
                  href={{
                    query: { ...searchParams, orderBy: column.value },
                  }}
                  className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
                >
                  {column.label}
                  {column.value === searchParams.orderBy && (
                    <ArrowUpIcon className="inline w-3 h-3 text-blue-400" />
                  )}
                </NextLink>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row
              key={issue.id}
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <Table.Cell className="py-3">
                <Link
                  href={`/issues/${issue.id}`}
                  className="font-medium text-white hover:text-zinc-200 hover:underline transition-colors text-sm"
                >
                  {issue.title}
                </Link>
                <div className="block md:hidden space-x-1.5 mt-1.5">
                  <IssueStatusBadge status={issue.status} />
                  <IssuePriorityBadge priority={issue.priority} />
                  {issue.dueDate && (
                    <span className="text-xs text-zinc-500 ml-1">
                      Due {new Date(issue.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell py-3">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell py-3">
                <IssuePriorityBadge priority={issue.priority} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell py-3 text-sm text-zinc-400">
                {issue.dueDate
                  ? new Date(issue.dueDate).toLocaleDateString()
                  : "-"}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell py-3 text-sm text-zinc-500 font-mono text-xs">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Priority", value: "priority", className: "hidden md:table-cell" },
  { label: "Due Date", value: "dueDate", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;
