"use client";
import { Spinner } from "@/app/components";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteIssue = async () => {
    try {
      setIsDeleting(true);
      await axios.delete("/api/issues/" + issueId);
      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      toast.error("This issue could not be deleted");
    }
  };

  return (
    <>
      <Button color="red" disabled={isDeleting} onClick={deleteIssue}>
        Delete Issue
        {isDeleting && <Spinner />}
      </Button>
    </>
  );
};

export default DeleteIssueButton;
