// src/components/dashboard/PostFeed.tsx

import PostCard from "./PostCard";


const PostFeed = () => {
  const posts = [
    { id: 1, images: ["/images/dress1.jpg", "/images/dress2.jpg", "/images/dress3.jpg"] },
    { id: 2, images: ["/images/dress1.jpg", "/images/dress2.jpg"] },
  ];

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
