import { Flex } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

export default function KanbanBoardSkeleton() {
  const columns = ["Open", "In Progress", "Closed"];

  return (
    <Flex gap="5" className="overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column}
          className="flex-1 min-w-[310px] p-4 rounded-xl border border-white/5 bg-zinc-950/40"
        >
          <div className="mb-4 flex justify-between items-center">
            <Skeleton width="5rem" height="1rem" />
            <Skeleton width="1.5rem" height="1rem" borderRadius="9999px" />
          </div>
          <Flex direction="column" gap="3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-3 bg-zinc-900/70 border border-white/5 rounded-lg"
              >
                <Flex direction="column" gap="2">
                  <Skeleton width="85%" height="1.1rem" />
                  <Flex gap="2">
                    <Skeleton width="4rem" height="1rem" />
                    <Skeleton width="4rem" height="1rem" />
                  </Flex>
                </Flex>
              </div>
            ))}
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
