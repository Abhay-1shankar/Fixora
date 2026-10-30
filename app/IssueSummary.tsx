import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const containers: {
    label: string;
    value: number;
    status: Status;
    colorClass: string;
  }[] = [
    {
      label: "Open Issues",
      value: open,
      status: "OPEN",
      colorClass: "text-red-400",
    },
    {
      label: "In Progress",
      value: inProgress,
      status: "IN_PROGRESS",
      colorClass: "text-violet-400",
    },
    {
      label: "Closed Issues",
      value: closed,
      status: "CLOSED",
      colorClass: "text-emerald-400",
    },
  ];

  return (
    <Flex gap="4" className="w-full" wrap="wrap">
      {containers.map((container) => (
        <Card
          key={container.label}
          className="flex-1 min-w-[140px] p-5 bg-zinc-950/50 border border-white/5 rounded-xl transition-colors hover:border-white/10"
        >
          <Flex direction="column" gap="1">
            <Link
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
              href={`/issues/list?status=${container.status}`}
            >
              {container.label}
            </Link>
            <Text size="6" weight="bold" className={`${container.colorClass} tracking-tight`}>
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
