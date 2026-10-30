"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Issue } from "@prisma/client";
import {
  DashboardIcon,
  ListBulletIcon,
  ViewGridIcon,
  PlusCircledIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import IssueStatusBadge from "./IssueStatusBadge";
import IssuePriorityBadge from "./IssuePriorityBadge";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Listen for Cmd+K (Mac) / Ctrl+K (Windows)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-menu", handleCustomOpen);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-menu", handleCustomOpen);
    };
  }, []);

  // Fetch issues when the dialog is opened
  const { data: issues } = useQuery<Issue[]>({
    queryKey: ["command-menu-issues"],
    queryFn: async () => {
      const { data } = await axios.get<Issue[]>("/api/issues");
      return data;
    },
    enabled: open,
    staleTime: 60 * 1000,
  });

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="w-full bg-[#09090b] border border-white/10 text-zinc-100 shadow-2xl rounded-xl overflow-hidden"
    >
      <div className="flex items-center px-4 border-b border-white/5">
        <MagnifyingGlassIcon className="w-5 h-5 text-zinc-400 mr-2 shrink-0" />
        <Command.Input
          placeholder="Type a command or search issues..."
          className="w-full h-12 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
        />
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-900 border border-white/10 rounded">
          ESC
        </kbd>
      </div>

      <Command.List className="max-h-[340px] overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-zinc-500">
          No results found.
        </Command.Empty>

        {/* Group 1: Navigation */}
        <Command.Group
          heading="Navigation"
          className="text-xs font-semibold text-zinc-500 px-2 py-1.5 uppercase tracking-wider"
        >
          <Command.Item
            value="Dashboard Home"
            onSelect={() => runCommand(() => router.push("/"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer transition-colors aria-selected:bg-white/[0.06] aria-selected:text-white"
          >
            <DashboardIcon className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">Dashboard</span>
          </Command.Item>

          <Command.Item
            value="Issue List Issues Table"
            onSelect={() => runCommand(() => router.push("/issues/list"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer transition-colors aria-selected:bg-white/[0.06] aria-selected:text-white"
          >
            <ListBulletIcon className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">Issue List</span>
          </Command.Item>

          <Command.Item
            value="Kanban Board View"
            onSelect={() =>
              runCommand(() => router.push("/issues/list?view=board"))
            }
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer transition-colors aria-selected:bg-white/[0.06] aria-selected:text-white"
          >
            <ViewGridIcon className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">Kanban Board</span>
          </Command.Item>
        </Command.Group>

        <Command.Separator className="h-px my-1 bg-white/5" />

        {/* Group 2: Actions */}
        <Command.Group
          heading="Actions"
          className="text-xs font-semibold text-zinc-500 px-2 py-1.5 uppercase tracking-wider"
        >
          <Command.Item
            value="Create New Issue Add Ticket"
            onSelect={() => runCommand(() => router.push("/issues/new"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer transition-colors aria-selected:bg-white/[0.06] aria-selected:text-white"
          >
            <PlusCircledIcon className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Create New Issue</span>
          </Command.Item>
        </Command.Group>

        {/* Group 3: Search Issues */}
        {issues && issues.length > 0 && (
          <>
            <Command.Separator className="h-px my-1 bg-white/5" />
            <Command.Group
              heading="Search Issues"
              className="text-xs font-semibold text-zinc-500 px-2 py-1.5 uppercase tracking-wider"
            >
              {issues.map((issue) => (
                <Command.Item
                  key={issue.id}
                  value={`issue-${issue.id} ${issue.title} ${issue.status} ${issue.priority}`}
                  onSelect={() =>
                    runCommand(() => router.push(`/issues/${issue.id}`))
                  }
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer transition-colors aria-selected:bg-white/[0.06] aria-selected:text-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileTextIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate font-medium text-white">{issue.title}</span>
                    <span className="text-xs text-zinc-500 shrink-0 font-mono">
                      #{issue.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <IssueStatusBadge status={issue.status} />
                    <IssuePriorityBadge priority={issue.priority} />
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </>
        )}
      </Command.List>

      <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-xs text-zinc-500 bg-zinc-950/80">
        <div className="flex items-center gap-2">
          <span>Navigate</span>
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-400">
            ↑
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-400">
            ↓
          </kbd>
        </div>
        <div className="flex items-center gap-2">
          <span>Select</span>
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-400">
            ↵
          </kbd>
        </div>
      </div>
    </Command.Dialog>
  );
}
