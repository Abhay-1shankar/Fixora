import { Avatar, Card, Flex, Table, Text } from "@radix-ui/themes";
import { IssuePriorityBadge, IssueStatusBadge } from "./components";
import Link from "next/link";
import prisma from "@/prisma/client";

const LatestIssues = async () => {
  const issues = await prisma?.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
      <Text weight="bold" size="3" mb="4" className="block text-white">
        Latest Issues
      </Text>
      <Table.Root variant="ghost">
        <Table.Body>
          {issues?.map((issue) => (
            <Table.Row
              key={issue.id}
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <Table.Cell className="py-3">
                <Flex justify="between" align="center">
                  <Flex direction="column" align="start" gap="2">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="font-medium text-white hover:text-zinc-200 hover:underline transition-colors"
                    >
                      {issue.title}
                    </Link>
                    <Flex gap="2" align="center" wrap="wrap">
                      <IssueStatusBadge status={issue.status} />
                      <IssuePriorityBadge priority={issue.priority} />
                      {issue.dueDate && (
                        <Text size="1" className="text-zinc-500">
                          Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                  {issue.assignedToUserId && (
                    <Avatar
                      src={issue.assignedToUser?.image || undefined}
                      fallback="?"
                      size="2"
                      radius="full"
                      className="ring-1 ring-white/10"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
