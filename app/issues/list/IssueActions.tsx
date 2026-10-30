"use client";

import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import IssueStatusFilter from "./IssueStatusFilter";

export default function IssueActions() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "table";

  const createViewUrl = (view: "table" | "board") => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "table") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    const query = params.toString();
    return "/issues/list" + (query ? `?${query}` : "");
  };

  return (
    <Flex justify="between" align="center">
      <Flex gap="3">
        <IssueStatusFilter />
      </Flex>

      <Flex gap="3" align="center">
        {/* View Toggles */}
        <Flex className="bg-zinc-900/60 p-1 rounded-lg border border-white/5" gap="1">
          <Button
            variant={currentView !== "board" ? "solid" : "ghost"}
            color={currentView !== "board" ? "gray" : "gray"}
            className={
              currentView !== "board"
                ? "!bg-zinc-800 !text-white text-xs"
                : "!text-zinc-400 hover:!text-zinc-200 text-xs"
            }
            asChild
          >
            <Link href={createViewUrl("table")}>
              <ListBulletIcon /> Table
            </Link>
          </Button>
          <Button
            variant={currentView === "board" ? "solid" : "ghost"}
            color={currentView === "board" ? "gray" : "gray"}
            className={
              currentView === "board"
                ? "!bg-zinc-800 !text-white text-xs"
                : "!text-zinc-400 hover:!text-zinc-200 text-xs"
            }
            asChild
          >
            <Link href={createViewUrl("board")}>
              <DashboardIcon /> Board
            </Link>
          </Button>
        </Flex>

        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </Flex>
    </Flex>
  );
}