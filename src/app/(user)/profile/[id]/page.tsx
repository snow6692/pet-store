// app/profile/[id]/page.tsx
import { cachedUser } from "@/lib/cache/user.cache";
import Link from "next/link";
import Image from "next/image";
import { getUserPosts } from "@/actions/post.action";
import { getUserById } from "@/actions/user.action";
import PostList from "@/components/PostList";
// import { notFound } from "next/navigation";

async function ProfilePage({ params }: { params: { id: string } }) {
  // Fetch the profile user by ID
  const profileUser = await getUserById(params.id);

  if (!profileUser) {
    // notFound(); // Return 404 if user not found
    return <p>User not found</p>;
  }

  // Fetch current authenticated user
  const currentUser = await cachedUser();

  // Fetch profile user's posts
  const { posts } = await getUserPosts({ userId: profileUser.id, limit: 10 });

  // Check if the current user is the profile owner
  const isOwner = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={profileUser.image || "/default-avatar.png"}
          alt={profileUser.name || "User"}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {profileUser.name || "Anonymous"}
          </h1>
          {isOwner && (
            <>
              <p className="text-gray-600">{profileUser.email}</p>
              {profileUser.phone && (
                <p className="text-gray-600">Phone: {profileUser.phone}</p>
              )}
              {profileUser.address && (
                <p className="text-gray-600">
                  Address: {profileUser.address}, {profileUser.city},{" "}
                  {profileUser.state} {profileUser.postalCode},{" "}
                  {profileUser.country}
                </p>
              )}
              <Link
                href="/profile/update"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Update your profile
              </Link>
            </>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">
        {isOwner ? "Your Posts" : `${profileUser.name || "User"}'s Posts`}
      </h2>
      {posts.length > 0 ? (
        <PostList initialPosts={posts} />
      ) : (
        <p className="text-gray-600">
          {isOwner
            ? "You haven't posted anything yet."
            : "This user hasn't posted anything yet."}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
