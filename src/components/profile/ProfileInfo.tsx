import React from "react";
import { MapPin, Phone, Globe, Pencil, UserPlus, MessageCircle, Briefcase, Share2, Bookmark, UserCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { UserType, BusinessType } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner"; // Or your preferred toast library
import { useBookmark, useProfileActions } from "@/hooks/api/use-user-profile";
type Props = {
  user: UserType;
  business: BusinessType | null;
  related: any;
  isMe: boolean;
};

const ProfileInfo: React.FC<Props> = ({ user, business, related, isMe }) => {


  const location = useLocation();
  const isBusinessRoute = location.pathname.includes("/business/");

  // Assuming these are passed via props or context
  const isFollowing = related?.isFollowing;
  const isSaved = related?.isBookmarked;
  const displayName = isBusinessRoute ? business?.businessName : user.firstName;

  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  const targetId = isBusinessRoute ? business?._id : user._id;

  // INITIALIZE EXTERNAL HOOK
  const { follow, isFollowingLoading } =
    useProfileActions(targetId!, isBusinessRoute);


  const onFollowToggle = () => {
    if (isFollowing) setShowUnfollowDialog(true);
    else follow();
  };


const profileKey = ["profile", isBusinessRoute ? business?._id : user.username];

// Initialize our separate hook
const { mutate: handleBookmark, isPending: isBookmarkLoading } = useBookmark(
  targetId!,
  profileKey
);

const showBookmarkButton = isBusinessRoute && !isMe;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          text: `Check out ${displayName} on our platform!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const btnBase = "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all text-sm";
  const btnPrimary = `${btnBase} bg-orange-500 text-white hover:bg-orange-600 shadow-sm`;
  const btnOutline = `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-50`;

  const title = isBusinessRoute && business ? business.businessName : `${user.firstName} ${user.lastName}`;
  const subTitle = isBusinessRoute && business ? business.category : `@${user.username}`;
  const bio = isBusinessRoute && business ? business.about : (user as any).bio;

  return (
    <div className="flex flex-col gap-6 bg-white p-2 md:p-0">
      {/* Identity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-orange-600 font-medium text-sm">{subTitle}</p>
        <p className="mt-4 text-gray-600 leading-relaxed text-sm">
          {bio || "No bio provided."}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-around items-center py-3 border-y border-gray-100 mt-4">
        <StatBlock label="Followers" value={related?.counts?.followers || 0} />

        {/* Vertical Divider */}
        <div className="w-[1px] h-4 bg-gray-200" />

        <StatBlock label="Following" value={related?.counts?.following || 0} />

        {/* Vertical Divider */}
        <div className="w-[1px] h-4 bg-gray-200" />

        <StatBlock label="Posts" value={related?.counts?.posts || 0} />
      </div>

      {/* Actions Container */}
<div className="flex flex-col gap-3 px-1">
      <div className={cn(
        "grid gap-2", 
        showBookmarkButton || isMe ? "grid-cols-3" : "grid-cols-2"
      )}>
        {isMe ? (
          <>
            {/* Owner Actions */}
            <Link to="/user/settings/edit" className={cn(btnPrimary, "flex-col py-3 px-1 h-auto text-[12px] gap-1 rounded-[18px]")}>
              <Pencil size={22} strokeWidth={2.5} />
              <span className="font-bold">Edit Profile</span>
            </Link>

            {/* In Owner view, we hide Save and show Share instead to fill the 3rd slot */}
            <button onClick={handleShare} className={cn(btnOutline, "flex-col py-3 px-1 h-auto text-[12px] gap-1 border-gray-200 rounded-[18px]")}>
              <Share2 size={22} className="text-orange-500" strokeWidth={2.5} />
              <span className="text-gray-600 font-bold">Share</span>
            </button>
          </>
        ) : (
          <>
            {/* Visitor Actions */}
            <button
              onClick={onFollowToggle}
              className={cn(isFollowing ? "bg-gray-100" : btnPrimary, "flex-col py-3 px-1 h-auto text-[12px] gap-1 rounded-[18px]")}
            >
              {isFollowing ? <UserCheck size={22} /> : <UserPlus size={22} />}
              <span className="font-bold">{isFollowing ? "Following" : "Follow"}</span>
            </button>

            {/* DYNAMIC BOOKMARK BUTTON: 
               Visible only on Business profiles that don't belong to the logged-in user 
            */}
            {showBookmarkButton && (
              <button
                onClick={() => handleBookmark("Business")}
                disabled={isBookmarkLoading}
                className={cn(
                  btnOutline, 
                  "flex-col py-3 px-1 h-auto text-[12px] gap-1 border-gray-200 rounded-[18px]", 
                  isSaved && "bg-orange-50 border-orange-200"
                )}
              >
                <Bookmark 
                  size={22} 
                  className={isSaved ? "fill-orange-500 text-orange-500" : "text-orange-500"} 
                  strokeWidth={2.5} 
                />
                <span className="text-gray-600 font-bold">
                  {isBookmarkLoading ? "..." : isSaved ? "Saved" : "Save"}
                </span>
              </button>
            )}

            <Link
              to={`/dashboard/chats/${user._id}`}
              className={cn(btnOutline, "flex-col py-3 px-1 h-auto text-[12px] gap-1 border-gray-200 rounded-[18px]")}
            >
              <MessageCircle size={22} className="text-orange-500" strokeWidth={2.5} />
              <span className="text-gray-600 font-bold">Message</span>
            </Link>
          </>
        )}
      </div>
    </div>

      {/* Contact Info (Only for Business) */}
      {isBusinessRoute && business && (
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact & Location</h4>
          {business.address?.fullAddress && <InfoRow icon={<MapPin size={18} />} text={business.address.fullAddress} />}
          {business.contact?.phone && <InfoRow icon={<Phone size={18} />} text={business.contact.phone} />}
          {business.contact?.website && (
            <InfoRow
              icon={<Globe size={18} />}
              text={business.contact.website}
              link={business.contact.website}
            />
          )}
        </div>
      )}

      {/* Unfollow Confirmation Dialog */}
      {showUnfollowDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-center">Unfollow {displayName}?</h3>
            <p className="text-gray-500 text-sm text-center mt-2">Their posts will no longer show up in your feed.</p>
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => {
                  follow();
                  setShowUnfollowDialog(false);
                }}
                className="w-full py-3 text-red-600 font-bold border-b border-gray-100"
              >
                {isFollowingLoading ? "Unfollowing..." : "Unfollow"}
              </button>
              <button onClick={() => setShowUnfollowDialog(false)} className="w-full py-3 text-gray-800 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Helpers
const StatBlock = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <span className="block text-lg font-bold text-gray-900">{value}</span>
    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{label}</span>
  </div>
);

const InfoRow = ({ icon, text, link }: { icon: React.ReactNode; text: string; link?: string }) => (
  <div className="flex items-start gap-3 text-sm text-gray-600">
    <div className="text-orange-500 shrink-0">{icon}</div>
    {link ? (
      <a href={link} target="_blank" className="hover:underline text-orange-600 truncate">{text}</a>
    ) : (
      <span className="line-clamp-2">{text}</span>
    )}
  </div>
);

const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);




export default ProfileInfo;