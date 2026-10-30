import { Card, Flex, Grid } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

export default function DashboardLoading() {
  return (
    <Flex direction="column" gap="5">
      {/* Summary cards skeleton */}
      <Flex gap="4" className="w-full" wrap="wrap">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="flex-1 min-w-[140px] p-5 bg-zinc-950/50 border border-white/5 rounded-xl"
          >
            <Flex direction="column" gap="2">
              <Skeleton width="5rem" height="0.8rem" />
              <Skeleton width="3rem" height="1.8rem" />
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Charts skeleton */}
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
          <Skeleton width="10rem" height="1.2rem" className="mb-2" />
          <Skeleton width="7rem" height="0.8rem" className="mb-4" />
          <Skeleton height="260px" />
        </Card>
        <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
          <Skeleton width="10rem" height="1.2rem" className="mb-2" />
          <Skeleton width="7rem" height="0.8rem" className="mb-4" />
          <Skeleton height="260px" />
        </Card>
      </Grid>

      {/* Latest issues skeleton */}
      <Card className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
        <Skeleton width="8rem" height="1.2rem" className="mb-4" />
        <Flex direction="column" gap="3">
          {[1, 2, 3, 4, 5].map((item) => (
            <Flex key={item} justify="between" align="center" className="py-2 border-b border-white/5">
              <Flex direction="column" gap="2">
                <Skeleton width="12rem" height="1rem" />
                <Flex gap="2">
                  <Skeleton width="4rem" height="1rem" />
                  <Skeleton width="4rem" height="1rem" />
                </Flex>
              </Flex>
              <Skeleton width="2rem" height="2rem" borderRadius="9999px" />
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
}
