import { IssuePriorityBadge, IssueStatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading className="text-white text-2xl font-bold tracking-tight mb-2">
        {issue.title}
      </Heading>
      <Flex gap="3" my="3" align="center" wrap="wrap">
        <IssueStatusBadge status={issue.status} />
        <IssuePriorityBadge priority={issue.priority} />
        <Text size="2" className="text-zinc-500 font-mono text-xs">
          Created: {issue.createdAt.toDateString()}
        </Text>
        {issue.dueDate && (
          <Text size="2" className="text-zinc-500 font-mono text-xs">
            Due: {new Date(issue.dueDate).toDateString()}
          </Text>
        )}
      </Flex>
      <Card className="p-6 bg-zinc-950/40 border border-white/5 rounded-xl prose prose-invert max-w-full" mt="4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
