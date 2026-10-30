"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { issueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import {
  Button,
  Callout,
  Grid,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        ...data,
        dueDate: data.dueDate ? data.dueDate : null,
      };
      if (issue) await axios.patch("/api/issues/" + issue.id, payload);
      else await axios.post("/api/issues", payload);
      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Grid columns={{ initial: "1", sm: "2" }} gap="3">
          <div>
            <Text as="label" size="2" weight="bold" className="block mb-1">
              Priority
            </Text>
            <Controller
              name="priority"
              control={control}
              defaultValue={issue?.priority || "MEDIUM"}
              render={({ field }) => (
                <Select.Root
                  value={field.value || "MEDIUM"}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger placeholder="Select priority..." />
                  <Select.Content>
                    <Select.Item value="LOW">Low</Select.Item>
                    <Select.Item value="MEDIUM">Medium</Select.Item>
                    <Select.Item value="HIGH">High</Select.Item>
                    <Select.Item value="CRITICAL">Critical</Select.Item>
                  </Select.Content>
                </Select.Root>
              )}
            />
            <ErrorMessage>{errors.priority?.message}</ErrorMessage>
          </div>

          <div>
            <Text as="label" size="2" weight="bold" className="block mb-1">
              Due Date
            </Text>
            <TextField.Root>
              <TextField.Input
                type="date"
                defaultValue={
                  issue?.dueDate
                    ? new Date(issue.dueDate).toISOString().split("T")[0]
                    : ""
                }
                {...register("dueDate")}
              />
            </TextField.Root>
            <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>
          </div>
        </Grid>

        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue "}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
