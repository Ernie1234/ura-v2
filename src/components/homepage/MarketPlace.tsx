import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Bookmark, MapPin, ChartNoAxesCombined, Star } from 'lucide-react';

// Small utility types
type Stat = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type Post = {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    handle?: string;
  };
  timeAgo: string;
  title?: string;
  description?: string;
  images: string[]; // up to 3
  likes: number;
  comments: number;
  saves: number;
  category?: string;
};

// ---------- Stats Row ----------
export const StatsRow: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-lg border border-[#F1D7CC] p-6 shadow-sm flex flex-col justify-center items-center gap-2 text-center"
        >
          {s.icon && <div className="text-[#D9730D] mb-2">{s.icon}</div>}
          <div className="text-2xl font-semibold text-[#D9730D]">{s.value}</div>
          <div className="text-sm text-gray-600">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

// ---------- Category Tabs ----------
export const CategoryTabs: React.FC<{
  categories: string[];
  active?: string;
  onSelect?: (cat: string) => void;
}> = ({ categories, active, onSelect }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 items-center overflow-x-auto py-2">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              onClick={() => onSelect?.(c)}
              className={`min-w-[140px] px-4 py-2 rounded-lg border ${
                isActive ? 'bg-[#FDEEE4] border-[#F2B9A3]' : 'bg-white border-[#F4C9B4]'
              } text-sm font-medium shadow-sm`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div>
        <Button variant="outline" size="sm">
          More Filters
        </Button>
      </div>
    </div>
  );
};

// ---------- Post Card ----------
export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Card className="w-full rounded-xl shadow-md">
      <CardHeader className="flex items-start gap-4 p-6">
        <Avatar>
          {post.author.avatar ? (
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
          ) : (
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div>
              <Link
                to={`/profile/${post.author.handle ?? post.author.name}`}
                className="font-semibold hover:underline"
              >
                {post.author.name}
              </Link>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {post.author.isVerified && <Badge variant="outline">Verified</Badge>}
                <span>{post.timeAgo}</span>
              </div>
            </div>

            <div className="text-sm text-gray-400">{post.category}</div>
          </div>

          {post.description && <p className="mt-3 text-sm text-gray-700">{post.description}</p>}
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {Array.from({ length: 3 }).map((_, i) => {
            const src = post.images[i];
            return (
              <div
                key={i}
                className={`h-48 sm:h-40 rounded overflow-hidden border ${i === 0 ? 'sm:col-span-1' : ''}`}
              >
                {src ? (
                  <img
                    src={src}
                    alt={`${post.title ?? 'item'} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    No image
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm hover:text-red-500 transition">
            <Heart className="w-5 h-5" />
            <span>{post.likes}</span>
          </button>

          <button className="flex items-center gap-2 text-sm hover:text-green-600 transition">
            <Share2 className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm hover:text-gray-900 transition">
            <Bookmark className="w-5 h-5" />
            <span>{post.saves}</span>
          </button>

          <Button size="sm">View Shop</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// ---------- Feed (composed) ----------
const sampleStats: Stat[] = [
  { label: 'Businesses', value: '50K', icon: <ChartNoAxesCombined className="w-6 h-6" /> },
  { label: 'Transactions', value: '10K', icon: <Star className="w-6 h-6" /> },
  { label: 'State', value: '36', icon: <MapPin className="w-6 h-6" /> },
];

const sampleCategories = [
  'Fashion & Beauty',
  'Food & Drinks',
  'Home and Garden',
  'Health & Wellness',
];

const samplePosts: Post[] = [
  {
    id: 'p1',
    author: { name: 'Jane Doe', handle: 'jane', isVerified: true },
    timeAgo: '2h ago',
    description: 'This is how we make our newest line. Visit our shop for curated pieces.',
    images: ['/images/sample1.jpg', '/images/sample2.jpg', '/images/sample3.jpg'],
    likes: 120,
    comments: 19,
    saves: 8,
    category: 'Fashion & Beauty',
  },
  {
    id: 'p2',
    author: { name: "Ken's Fashion Hub", handle: 'kens', isVerified: false },
    timeAgo: '1d ago',
    description: 'Fresh knitwear just landed! Exclusive hoodies and joggers.',
    images: ['/images/sample4.jpg', '/images/sample5.jpg', '/images/sample6.jpg'],
    likes: 48,
    comments: 5,
    saves: 4,
    category: 'Fashion & Beauty',
  },
];

const MarketplaceFeed: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <StatsRow stats={sampleStats} />
      </div>

      <div className="mb-6 flex items-center gap-4">
        <h4 className="text-sm font-medium">Popular Category</h4>
      </div>

      <div className="mb-8">
        <CategoryTabs categories={sampleCategories} active={sampleCategories[0]} />
      </div>

      <div className="space-y-8">
        {samplePosts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default MarketplaceFeed;
