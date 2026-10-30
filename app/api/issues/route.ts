import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "@/app/validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/AuthOptions";

export async function GET(request: NextRequest) {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json(issues);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
      priority: body.priority || "MEDIUM",
      dueDate:
        body.dueDate && typeof body.dueDate === "string" && body.dueDate.trim() !== ""
          ? new Date(body.dueDate)
          : null,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}