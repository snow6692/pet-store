export const config = {
  google: {
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  },
  uploadthing: process.env.UPLOADTHING_TOKEN!,
};
