import { cachedUser } from "@/lib/cache/user.cache";
import Link from "next/link";
import Image from "next/image";
import { getUserPosts } from "@/actions/post.action";
import { getUserById } from "@/actions/user.action";
import PostList from "@/components/PostList";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Skeleton Component
const ProfileSkeleton = () => (
  <div
    className="max-w-4xl mx-auto p-6"
    role="status"
    aria-label="Loading profile"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full skeleton-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-40 rounded skeleton-pulse" />
        <div className="h-4 w-60 rounded skeleton-pulse" />
        <div className="h-4 w-48 rounded skeleton-pulse" />
      </div>
    </div>
    <div className="h-6 w-32 rounded skeleton-pulse mb-4" />
    <div className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="p-6 rounded-xl border border-blue-300/50 bg-gray-700/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full skeleton-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded skeleton-pulse" />
              <div className="h-3 w-36 rounded skeleton-pulse" />
            </div>
          </div>
          <div className="h-5 w-3/4 rounded skeleton-pulse mb-2" />
          <div className="h-4 w-full rounded skeleton-pulse mb-2" />
          <div className="h-4 w-1/2 rounded skeleton-pulse" />
        </div>
      ))}
    </div>
  </div>
);

async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch the profile user by ID
  const id = (await params).id;
  const profileUser = await getUserById(id);

  if (!profileUser) {
    notFound();
  }

  const currentUser = await cachedUser();

  // Fetch profile user's posts
  const { posts } = await getUserPosts({ userId: profileUser.id, limit: 10 });

  // Check if the current user is the profile owner
  const isOwner = currentUser?.id === profileUser.id;

  return (
    <div
      className="
        max-w-4xl mx-auto p-6  backdrop-blur-md rounded-2xl
        border border-blue-400/20 shadow-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)]
        transition-shadow duration-300
      "
    >
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={profileUser.image || "/default-avatar.png"}
          alt={profileUser.name || "User"}
          width={80}
          height={80}
          className="
            rounded-full border-2 border-gradient-to-r from-blue-400 to-purple-400
            object-cover shadow-sm hover:scale-105 transition-transform duration-300
          "
        />
        <div>
          <h1 className="text-2xl font-bold  font-['Inter']">
            {profileUser.name || "Anonymous"}
          </h1>
          {isOwner && (
            <div className="mt-2 space-y-1">
              <p className="text-gray-400 font-['Inter']">
                {profileUser.email}
              </p>
              {profileUser.phone && (
                <p className="text-gray-400 font-['Inter']">
                  Phone: {profileUser.phone}
                </p>
              )}
              {profileUser.address && (
                <p className="text-gray-400 font-['Inter']">
                  Address: {profileUser.address}, {profileUser.city},{" "}
                  {profileUser.state} {profileUser.postalCode},{" "}
                  {profileUser.country}
                </p>
              )}
              <Link
                href="/profile/update"
                className="
                  inline-block mt-2 px-4 py-2 rounded-md text-white
                  bg-gradient-to-r from-blue-400 to-purple-400
                  hover:from-blue-500 hover:to-purple-500 font-['Inter']
                  transition-all duration-300 hover:px-5
                "
                aria-label="Update your profile"
              >
                Update your profile
              </Link>
            </div>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-100 font-['Inter'] mb-4">
        {isOwner ? "Your Posts" : `${profileUser.name || "User"}'s Posts`}
      </h2>
      {posts.length > 0 ? (
        <Suspense fallback={<ProfileSkeleton />}>
          <PostList initialPosts={posts} />
        </Suspense>
      ) : (
        <p className="text-gray-400 font-['Inter']">
          {isOwner
            ? "You haven't posted anything yet."
            : "This user hasn't posted anything yet."}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
