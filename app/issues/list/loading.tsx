import { Skeleton } from "@/app/components";
import { Flex, Table } from "@radix-ui/themes";
import IssueActions from "./IssueActions";

const LoadingIssuesPage = () => {
  const issues = [1, 2, 3, 4, 5];

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-950/40">
        <Table.Root variant="ghost">
          <Table.Header className="border-b border-white/5 bg-zinc-900/30">
            <Table.Row>
              <Table.ColumnHeaderCell className="text-zinc-500 text-xs py-3">Issue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-zinc-500 text-xs py-3">
                Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-zinc-500 text-xs py-3">
                Priority
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-zinc-500 text-xs py-3">
                Due Date
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-zinc-500 text-xs py-3">
                Created
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {issues.map((issue) => (
              <Table.Row key={issue} className="border-b border-white/5">
                <Table.Cell className="py-3">
                  <Skeleton width="12rem" height="1.1rem" />
                  <div className="block md:hidden mt-2">
                    <Skeleton width="6rem" height="1rem" />
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell py-3">
                  <Skeleton width="4rem" height="1.2rem" />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell py-3">
                  <Skeleton width="4rem" height="1.2rem" />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell py-3">
                  <Skeleton width="5rem" height="1.1rem" />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell py-3">
                  <Skeleton width="6rem" height="1.1rem" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </Flex>
  );
};

export default LoadingIssuesPage;
