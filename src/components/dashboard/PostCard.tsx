// src/components/dashboard/PostCard.tsx
import { Heart, MessageCircle, Share2 } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PostCard = ({ post }: { post: any }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h4 className="font-medium mb-2">Recent Posts</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
        {post.images.map((img: string, i: number) => (
          <img key={i} src={img} alt="" className="rounded-lg object-cover w-full" />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex gap-4">
          <button className="flex items-center gap-1">
            <Heart size={16} /> 320K
          </button>
          <button className="flex items-center gap-1">
            <MessageCircle size={16} /> 120
          </button>
          <button className="flex items-center gap-1">
            <Share2 size={16} /> 240
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
