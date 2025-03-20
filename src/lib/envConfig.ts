export const config = {
  google: {
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  },
  uploadthing: process.env.UPLOADTHING_TOKEN!,
  stripe: {
    public: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
    secret: process.env.STRIPE_SECRET_KEY!,
  },
};
