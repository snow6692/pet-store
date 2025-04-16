"use client";

import { useRouter } from "next/navigation";
// import { deletePost } from "@/actions/post.actions";
import toast from "react-hot-toast";
import { deletePost } from "@/actions/post.action";
import UpdatePostDialog from "./dialogs/UpdatePostDialog";
import { PenBox } from "lucide-react";
import { Post } from "@prisma/client";

type Props = {
  postId: string;
  post: Post;
};

export default function PostDropdownMenu({ postId, post }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  return (
    <div>
      {/* // <ConfirmDeleteDialog
    //   onDelete={handleDelete} // Pass handleDelete directly
    //   id={postId}
    //   name="Post"
    // >
    //   Delete 
    // </ConfirmDeleteDialog> */}
      <UpdatePostDialog post={post}>
        <PenBox className=" cursor-pointer " />
      </UpdatePostDialog>
    </div>
  );
}
