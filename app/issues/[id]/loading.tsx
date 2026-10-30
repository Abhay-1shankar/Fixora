import { Skeleton } from "@/app/components";
import { Box, Card, Flex } from "@radix-ui/themes";

const LoadingIssueDetailPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton width="16rem" height="2rem" />
      <Flex gap="3" my="3">
        <Skeleton width="4.5rem" height="1.2rem" />
        <Skeleton width="4.5rem" height="1.2rem" />
        <Skeleton width="8rem" height="1.2rem" />
      </Flex>
      <Card className="p-6 bg-zinc-950/40 border border-white/5 rounded-xl" mt="4">
        <Skeleton count={3} />
      </Card>
    </Box>
  );
};

export default LoadingIssueDetailPage;
