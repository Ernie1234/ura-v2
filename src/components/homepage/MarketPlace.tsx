import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Bookmark, MapPin, ChartNoAxesCombined, Star } from 'lucide-react';
// import { useAuthContext } from '@/context/auth-provider';
import useAuthGuard from "@/hooks/use-auth-guard";

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
    username?: string;
  };
  timeAgo: string;
  title?: string;
  description?: string;
  images: string[];
  likes: number;
  comments: number;
  saves: number;
  category?: string;
  location?: string;
  rating?: number;
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
              className={`min-w-[140px] px-4 py-2 rounded-lg border ${isActive ? 'bg-[#FDEEE4] border-[#F2B9A3]' : 'bg-white border-[#F4C9B4]'
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
  // const { isAuthenticated } = useAuthContext();
  const { requireAuth, popup } = useAuthGuard(false);
  // placeholder
  // const popup = null;
  // const requireAuth = (callback: () => void) => {
  //   console.log("require auth placeholder");
  //   callback?.();
  // };

  const handleBookmark = () => {
    requireAuth(() => {
      console.log("Bookmark action executed");
    });
  };

  const handleLike = () => {
    requireAuth(() => {
      console.log("Like action executed");
    });
  };

  const handleShare = () => {
    requireAuth(() => {
      console.log("Share action executed");
    });
  };

  return (
    <>
      {popup}
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
                  to={`/profile/${post.author.username ?? post.author.name}`}
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
              <Heart 
                onClick={handleLike}
                className="w-5 h-5" />
              <span>{post.likes}</span>
            </button>

            <button className="flex items-center gap-2 text-sm hover:text-green-600 transition">
              <Share2 
              onClick={handleShare}
              className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm hover:text-gray-900 transition">
              <Bookmark 
              onClick={handleBookmark}
              className="w-5 h-5" />
              <span>{post.saves}</span>
            </button>

            <Button size="sm">View Shop</Button>
          </div>
        </CardFooter>
      </Card>
    </>
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
    id: "p1",
    author: {
      name: "Jane Cloe",
      username: "@janebespoke_",
      isVerified: true,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    timeAgo: "2h ago",
    title: "Tailored Fashion",
    description:
      "This is how we make our money, the moment you send your measurement, you pick a professional tailor…",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
    ],
    likes: 320000,
    comments: 120,
    saves: 240,
    category: "Fashion & Beauty",
    location: "Plot 55, Apapa Street Lagos",
    rating: 4.5
  },

  {
    id: "p2",
    author: {
      name: "Ken’s Fashion Hub",
      username: "@kenshub",
      isVerified: false,
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    timeAgo: "1d ago",
    description: "Fresh knitwear just landed! Exclusive hoodies and joggers.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1516822003754-cca485356ecb",
      "https://images.unsplash.com/photo-1503602642458-232111445657"
    ],
    likes: 48000,
    comments: 500,
    saves: 400,
    category: "Fashion & Beauty",
    location: "Lekki Phase 1, Lagos",
    rating: 4.8
  }
];



const MarketplaceFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(sampleCategories[0]);

  const filteredPosts = samplePosts.filter(
    (p) => p.category === activeCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Stats */}
      <div className="mb-8">
        <StatsRow stats={sampleStats} />
      </div>

      <div className="mb-6 flex items-center gap-4">
        <h4 className="text-sm font-medium">Popular Category</h4>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <CategoryTabs
          categories={sampleCategories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {filteredPosts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No posts found for this category.
          </div>
        )}
      </div>
    </div>
  );
};


export default MarketplaceFeed;
