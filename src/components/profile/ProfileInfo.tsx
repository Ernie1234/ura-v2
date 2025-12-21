import React, { useState } from "react";
import {
  MapPin, Phone, Globe, Pencil, UserPlus,
  MessageCircle, Briefcase, Share2, Bookmark,
  UserCheck, PlusCircle, User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { UserType, BusinessType } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmark, useProfileActions } from "@/hooks/api/use-user-profile";
import { UnfollowDialog } from "./UnfollowDialog";
import { useToggleBookmark } from "@/hooks/api/use-feed";

type Props = {
  user: UserType;
  business: BusinessType | null;
  related: any;
  isMe: boolean;
};

const ProfileInfo: React.FC<Props> = ({ user, business, related, isMe }) => {
  const location = useLocation();
  const isBusinessRoute = location.pathname.includes("/business/");
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  const isFollowing = related?.isFollowing;
  const isSaved = related?.isBookmarked;
  const displayName = (isBusinessRoute ? business?.businessName : user?.firstName) || "User";
  const targetId = isBusinessRoute ? business?._id : user._id;

  const { follow, isFollowingLoading } = useProfileActions(targetId!, isBusinessRoute);

  const profileKey = ["profile", isBusinessRoute ? business?._id : user.username];

  const { mutate: handleBookmark, isPending: isBookmarkLoading } = useToggleBookmark(
    targetId!,
    'Business',
    profileKey
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayName,
          text: `Check out ${displayName} on our platform!`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing", err);
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      // If already following, show confirmation before unfollowing
      setShowUnfollowDialog(true);
    } else {
      // If not following, just follow immediately
      follow();
    }
  };

  // Button Styles
  const btnBase = "flex items-center justify-center transition-all duration-200";
  const btnAction = "flex-col py-4 px-1 h-auto text-[11px] gap-2 rounded-[22px] font-bold border";

  const title = isBusinessRoute && business ? business.businessName : `${user.firstName} ${user.lastName}`;
  const subTitle = isBusinessRoute && business ? business.category : `@${user.username}`;
  const bio = isBusinessRoute && business ? business.about : (user as any).bio;

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Identity Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-orange-600 font-bold text-sm mt-0.5">{subTitle}</p>
        <p className="mt-4 text-gray-500 leading-relaxed text-sm">
          {bio || "No bio description yet."}
        </p>
      </div>

      {/* Stats Table */}
      <div className="flex justify-between items-center py-4 border-y border-gray-100 mt-2">
        <StatBlock label="Followers" value={related?.counts?.followers || 0} />
        <div className="w-[1px] h-6 bg-gray-100" />
        <StatBlock label="Following" value={related?.counts?.following || 0} />
        <div className="w-[1px] h-6 bg-gray-100" />
        <StatBlock label="Posts" value={related?.counts?.posts || 0} />
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        {isMe ? (
          <>
            {/* EDIT PROFILE */}
            <Link to="/dashboard/settings/profile"
              className={cn(btnBase, btnAction, "bg-orange-500 border-transparent text-white shadow-lg shadow-orange-100 hover:bg-orange-600")}

            >
              <Pencil size={20} strokeWidth={2.5} />
              <span>Edit</span>
            </Link>

            {/* BOOKMARK (Only if on Business Page) */}
            {isBusinessRoute ? (
              <button
                onClick={() => handleBookmark()}
                disabled={isBookmarkLoading}
                className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200 hover:bg-gray-50", isSaved && "bg-orange-50 border-orange-100")}
              >
                <Bookmark size={20} className={isSaved ? "fill-orange-500 text-orange-500" : "text-gray-400"} strokeWidth={2.5} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            ) : (
              /* If personal profile, replace Save with Settings or placeholder */
              <Link to="/settings" className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200")}>
                <PlusCircle size={20} className="text-gray-400" />
                <span>Tools</span>
              </Link>
            )}

            <button onClick={handleShare} className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")}>
              <Share2 size={20} className="text-orange-500" strokeWidth={2.5} />
              <span>Share</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleFollow}
              disabled={isFollowingLoading}
              className={cn(btnBase, btnAction, isFollowing ? "bg-gray-100 border-gray-200 text-gray-800" : "bg-orange-500 border-transparent text-white shadow-lg shadow-orange-100 hover:bg-orange-600")}
            >
              {isFollowing ? <UserCheck size={20} strokeWidth={2.5} /> : <UserPlus size={20} strokeWidth={2.5} />}
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </button>

            {/* ONLY SHOW BOOKMARK ON BUSINESS PAGES */}
            {isBusinessRoute && (
              <button
                onClick={() => handleBookmark()}
                disabled={isBookmarkLoading}
                className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200", isSaved && "bg-orange-50 border-orange-100")}
              >
                <Bookmark size={20} className={isSaved ? "fill-orange-500 text-orange-500" : "text-gray-400"} strokeWidth={2.5} />
                <span>Save</span>
              </button>
            )}

            <Link to={`/dashboard/chats/${user._id}`} className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200", !isBusinessRoute && "col-span-1")}>
              <MessageCircle size={20} className="text-orange-500" strokeWidth={2.5} />
              <span>Message</span>
            </Link>

            {/* If Not Business, Share takes the 3rd spot */}
            {!isBusinessRoute && (
              <button onClick={handleShare} className={cn(btnBase, btnAction, "bg-white text-gray-700 border-gray-200")}>
                <Share2 size={20} className="text-gray-400" strokeWidth={2.5} />
                <span>Share</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Secondary Actions / Prompts */}
      <div className="flex flex-col gap-3 mt-4">
        {/* ADD BUSINESS PROMPT (If Me and No Business yet) */}
        {isMe && !user.isBusinessOwner && (
          <Link
            to="/business/onboarding"
            className="group flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-100 rounded-2xl hover:border-orange-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Start Selling</p>
                <p className="text-[11px] text-orange-700 font-medium">Create your business page</p>
              </div>
            </div>
            <PlusCircle size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
          </Link>
        )}

        {/* View Alternate Page Buttons */}
        {!isBusinessRoute && user.isBusinessOwner && business && (
          <Link
            to={`/dashboard/profile/business/${business._id}`}
            className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <Briefcase size={16} /> View Business Page
          </Link>
        )}

        {isBusinessRoute && (
          <Link
            to={`/dashboard/profile/user/${user._id}`}
            className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <User size={16} /> View Owner Profile
          </Link>
        )}
      </div>

      {/* Contact Info (Only for Business) */}
      {isBusinessRoute && business && (
        <div className="space-y-4 pt-6 border-t border-gray-100 mt-2">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Reach Us</h4>
          <div className="space-y-3">
            {business.address?.fullAddress && <InfoRow icon={<MapPin size={16} />} text={business.address.fullAddress} />}
            {business.contact?.phone && <InfoRow icon={<Phone size={16} />} text={business.contact.phone} />}
            {business.contact?.website && (
              <InfoRow
                icon={<Globe size={16} />}
                text={business.contact.website.replace(/^https?:\/\//, '')}
                link={business.contact.website}
              />
            )}
          </div>
        </div>
      )}

      {/* Unfollow Confirmation */}
      <UnfollowDialog
        isOpen={showUnfollowDialog}
        onClose={() => setShowUnfollowDialog(false)}
        onConfirm={follow}
        displayName={displayName}
      />
    </div>
  );
};

const StatBlock = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center flex flex-col gap-0.5">
    <span className="text-lg font-black text-gray-900">{value.toLocaleString()}</span>
    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{label}</span>
  </div>
);

const InfoRow = ({ icon, text, link }: { icon: React.ReactNode; text: string; link?: string }) => (
  <div className="flex items-center gap-3 text-[13px] text-gray-600 group">
    <div className="text-orange-500 shrink-0 bg-orange-50 p-1.5 rounded-lg">{icon}</div>
    {link ? (
      <a href={link} target="_blank" rel="noreferrer" className="hover:text-orange-600 font-medium truncate underline decoration-orange-200 underline-offset-4 decoration-2">{text}</a>
    ) : (
      <span className="font-medium line-clamp-1">{text}</span>
    )}
  </div>
);

export default ProfileInfo;