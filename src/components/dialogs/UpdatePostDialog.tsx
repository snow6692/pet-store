import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode } from "react";
import PostForm from "../forms/PostForm";
import { Post } from "@prisma/client";
function UpdatePostDialog({
  children,
  post,
}: {
  children: ReactNode;
  post: Post;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="min-w-dvw">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your Post here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <PostForm post={post} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePostDialog;
