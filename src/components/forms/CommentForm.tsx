/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // components/forms/CommentForm.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { commentZod } from "@/validations/comment.zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { createComment } from "@/actions/comment.action";
// import toast from "react-hot-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

// export default function CommentForm({
//   postId,
//   parentId,
//   onSuccess,
// }: {
//   postId: string;
//   parentId?: string;
//   onSuccess?: () => void;
// }) {
//   const queryClient = useQueryClient();
//   const { data: currentUser } = useCurrentUser();

//   const form = useForm<commentZod>({
//     resolver: zodResolver(commentZod),
//     defaultValues: { content: "" },
//   });

//   const mutation = useMutation({
//     mutationFn: (data: commentZod) => createComment({ data, postId, parentId }),
//     onMutate: async (data) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: ["posts"] });

//       // Snapshot the previous posts
//       const previousPosts = queryClient.getQueryData(["posts"]);

//       // Optimistically update the cache
//       queryClient.setQueryData(["posts"], (old: any) => {
//         if (!old) return old;

//         const newComment = {
//           id: `temp-${Date.now()}`, // Temporary ID
//           content: data.content,
//           userId: currentUser?.id || "",
//           postId,
//           parentId: parentId || null,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           user: {
//             id: currentUser?.id || "",
//             name: currentUser?.name || "Unknown",
//             image: currentUser?.image || null,
//           },
//         };

//         return {
//           ...old,
//           pages: old.pages.map((page: any) => ({
//             ...page,
//             posts: page.posts.map((post: any) =>
//               post.id === postId
//                 ? {
//                     ...post,
//                     comments: parentId
//                       ? post.comments.map((comment: any) =>
//                           comment.id === parentId
//                             ? {
//                                 ...comment,
//                                 replies: [
//                                   ...(comment.replies || []),
//                                   newComment,
//                                 ],
//                               }
//                             : comment
//                         )
//                       : [...post.comments, newComment],
//                   }
//                 : post
//             ),
//           })),
//         };
//       });

//       // Return context for rollback
//       return { previousPosts };
//     },
//     onError: (error, variables, context) => {
//       // Rollback on error
//       queryClient.setQueryData(["posts"], context?.previousPosts);
//       toast.error("Failed to post comment");
//       console.error("Error posting comment:", error);
//     },
//     onSuccess: () => {
//       // Invalidate to refetch
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       queryClient.invalidateQueries({ queryKey: ["comments"] });
//       toast.success("Comment posted successfully");
//       form.reset();
//       onSuccess?.();
//     },
//   });

//   const onSubmit = (data: commentZod) => {
//     mutation.mutate(data);
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Textarea
//                   placeholder={
//                     parentId ? "Write a reply..." : "Write a comment..."
//                   }
//                   rows={2}
//                   className="resize-none"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button
//           type="submit"
//           disabled={form.formState.isSubmitting || mutation.isPending}
//         >
//           {mutation.isPending ? "Posting..." : parentId ? "Reply" : "Comment"}
//         </Button>
//       </form>
//     </Form>
//   );
// }

// components/forms/CommentForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentZod } from "@/validations/comment.zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "@/actions/comment.action";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function CommentForm({
  postId,
  parentId,
  onSuccess,
  defaultContent,
  onSubmit: customOnSubmit,
}: {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  defaultContent?: string;
  onSubmit?: (data: commentZod) => void;
}) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const form = useForm<commentZod>({
    resolver: zodResolver(commentZod),
    defaultValues: { content: defaultContent || "" },
  });

  const mutation = useMutation({
    mutationFn: (data: commentZod) => createComment({ data, postId, parentId }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        const newComment = {
          id: `temp-${Date.now()}`,
          content: data.content,
          userId: currentUser?.id || "",
          postId,
          parentId: parentId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: currentUser?.id || "",
            name: currentUser?.name || "Unknown",
            image: currentUser?.image || null,
          },
        };
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    comments: parentId
                      ? post.comments.map((comment: any) =>
                          comment.id === parentId
                            ? {
                                ...comment,
                                replies: [
                                  ...(comment.replies || []),
                                  newComment,
                                ],
                              }
                            : comment
                        )
                      : [...post.comments, newComment],
                  }
                : post
            ),
          })),
        };
      });
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Failed to post comment");
      console.error("Error posting comment:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment posted successfully");
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data: commentZod) => {
    if (customOnSubmit) {
      customOnSubmit(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={
                    parentId ? "Write a reply..." : "Write a comment..."
                  }
                  rows={2}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || mutation.isPending}
        >
          {mutation.isPending || form.formState.isSubmitting
            ? "Posting..."
            : customOnSubmit
            ? "Update"
            : parentId
            ? "Reply"
            : "Comment"}
        </Button>
      </form>
    </Form>
  );
}
