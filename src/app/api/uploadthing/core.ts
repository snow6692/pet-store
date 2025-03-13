import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

const getUser = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id };
};

export const ourFileRouter = {
  singleImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(" Image uploaded successfully :", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),

  multiImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image uploaded successfully:", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
