"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, Text, Flex } from "@radix-ui/themes";
import { Issue, Status } from "@prisma/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import IssuePriorityBadge from "@/app/components/IssuePriorityBadge";
import Link from "next/link";

interface Props {
  issues: Issue[];
}

type ColumnMap = Record<Status, Issue[]>;

const statuses: Status[] = ["OPEN", "IN_PROGRESS", "CLOSED"];

export default function KanbanBoard({ issues }: Props) {
  const [columns, setColumns] = useState<ColumnMap>(() => ({
    OPEN: issues.filter((i) => i.status === "OPEN"),
    IN_PROGRESS: issues.filter((i) => i.status === "IN_PROGRESS"),
    CLOSED: issues.filter((i) => i.status === "CLOSED"),
  }));

  // Sync columns when server data changes
  useEffect(() => {
    setColumns({
      OPEN: issues.filter((i) => i.status === "OPEN"),
      IN_PROGRESS: issues.filter((i) => i.status === "IN_PROGRESS"),
      CLOSED: issues.filter((i) => i.status === "CLOSED"),
    });
  }, [issues]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStatus = source.droppableId as Status;
    const destStatus = destination.droppableId as Status;

    const previousColumns = { ...columns };

    const sourceColumn = [...columns[sourceStatus]];
    const destColumn =
      sourceStatus === destStatus ? sourceColumn : [...columns[destStatus]];

    const [movedIssue] = sourceColumn.splice(source.index, 1);
    if (!movedIssue) return;

    const updatedIssue: Issue = { ...movedIssue, status: destStatus };
    destColumn.splice(destination.index, 0, updatedIssue);

    // Optimistic UI Update
    setColumns({
      ...columns,
      [sourceStatus]: sourceColumn,
      [destStatus]: destColumn,
    });

    // Background Database Sync
    try {
      await axios.patch(`/api/issues/${draggableId}`, { status: destStatus });
    } catch (error) {
      toast.error("Failed to update status. Reverting...");
      // Revert to previous state on failure
      setColumns(previousColumns);
    }
  };

  return (
    <>
      <Toaster />
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex gap="5" className="overflow-x-auto pb-4">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[310px] p-4 rounded-xl border border-white/5 transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-zinc-900/60"
                      : "bg-zinc-950/40"
                  }`}
                >
                  <Flex justify="between" align="center" mb="4">
                    <Text
                      weight="bold"
                      size="2"
                      className="text-zinc-400 uppercase tracking-wider text-xs"
                    >
                      {status.replace("_", " ")}
                    </Text>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5">
                      {columns[status]?.length || 0}
                    </span>
                  </Flex>

                  <Flex direction="column" gap="3">
                    {columns[status]?.map((issue, index) => (
                      <Draggable
                        key={issue.id.toString()}
                        draggableId={issue.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "opacity-90 scale-[1.02]" : ""
                            } transition-transform`}
                          >
                            <Card className="p-3 bg-zinc-900/70 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-lg cursor-grab active:cursor-grabbing transition-colors">
                              <Flex direction="column" gap="2">
                                <Link
                                  href={`/issues/${issue.id}`}
                                  className="font-medium text-white hover:text-zinc-200 hover:underline text-sm leading-snug"
                                >
                                  {issue.title}
                                </Link>
                                <Flex gap="2" align="center" wrap="wrap">
                                  <IssueStatusBadge status={issue.status} />
                                  <IssuePriorityBadge
                                    priority={issue.priority}
                                  />
                                  {issue.dueDate && (
                                    <Text size="1" className="text-zinc-500">
                                      Due:{" "}
                                      {new Date(
                                        issue.dueDate
                                      ).toLocaleDateString()}
                                    </Text>
                                  )}
                                </Flex>
                              </Flex>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Flex>
                </div>
              )}
            </Droppable>
          ))}
        </Flex>
      </DragDropContext>
    </>
  );
}
