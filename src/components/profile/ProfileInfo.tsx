// src/components/profile/ProfileHeader.tsx
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";
import {
    MessageCircle,
    Send,
    UserPlus,
    UserMinus,
    Bookmark,
    BookmarkCheck,
    Pencil,
    MapPin,
    Star,
    Phone,
    Globe,
    Clock
} from "lucide-react";


type Props = {
    profile: any;
};

const ProfileInfo: React.FC<Props> = ({ profile }) => {
    const { user: currentUser, isAuthenticated } = useAuthContext();

    const isMe = currentUser?._id === profile?.user?._id;

    // mock states (later replaced with backend response)
    const [isFollowing, setIsFollowing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const fullName = `${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`;
    const businessName = profile?.user?.businessName;
    const baseBtn =
        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap";

    const pillBtn =
        "rounded-full p-0";


    const filledBtn =
        "bg-orange-500 text-white hover:bg-orange-600";

    const outlineBtn =
        "border border-orange-400 text-orange-500 hover:bg-orange-50";

    return (
        <>
            {/* Info */}
            <div className="md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{businessName || fullName}</h1>
                    <p className="text-sm text-gray-600 mt-1">{profile?.user?.bio ?? profile?.user?.businessName ?? ""}</p>

                    <div className="mt-1 text-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Rating stars + value */}
                            <div className="flex items-center gap-1 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < Math.round(profile?.rating ?? 4) ? "fill-yellow-500" : ""}
                                    />
                                ))}

                                <span className="ml-1 text-sm font-semibold text-gray-800">
                                    {profile?.rating ?? 4.2}
                                </span>
                            </div>

                            {/* Reviews count */}
                            <span className="text-sm text-gray-500">
                                ({profile?.reviewsCount ?? 180} reviews)
                            </span>
                        </div>

                        <div className="flex gap-5 mt-3">
                            <div className="text-gray-700">
                                <span className="block">Followers {profile?.related?.counts?.posts ?? 0}</span>
                            </div>

                            <div className="text-gray-700">
                                <span className="block">Following {profile?.related?.counts?.followers ?? 0}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* actions */}
                <div className="mt-5 flex flex-wrap gap-3 items-center">
                    {/* EDIT PROFILE (ME) */}
                    {isMe && (
                        <Link
                            to={`/dashboard/profile/${currentUser?._id}/edit`}
                            className={`${baseBtn} ${filledBtn}`}
                        >
                            <Pencil size={16} />
                            Edit Profile
                        </Link>
                    )}

                    {/* OTHER USER ACTIONS */}
                    {!isMe && (
                        <>
                            {/* FOLLOW / UNFOLLOW */}
                            {isAuthenticated && (
                                <button
                                    onClick={() => setIsFollowing((prev) => !prev)}
                                    className={`${baseBtn} ${isFollowing ? filledBtn : outlineBtn
                                        }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserMinus size={16} />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            Follow
                                        </>
                                    )}
                                </button>
                            )}

                            {/* MOBILE MESSAGE BUTTON */}
                            <button
                                className={`${baseBtn} ${outlineBtn} lg:hidden`}
                            >
                                <MessageCircle size={16} />

                                Message
                            </button>
                        </>
                    )}

                    {/* SAVE / UNSAVE */}
                    <button
                        onClick={() => setIsSaved((prev) => !prev)}
                        className={`${baseBtn} ${isSaved ? filledBtn : outlineBtn
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <BookmarkCheck size={16} />
                                Saved
                            </>
                        ) : (
                            <>
                                <Bookmark size={16} />
                                Save
                            </>
                        )}
                    </button>

                    {/* SHARE */}
                    <button className={`${baseBtn} ${outlineBtn}`}>
                        <Send size={16} />
                        Share
                    </button>

                    {/* DESKTOP MESSAGE BUTTON (FULL WIDTH) */}
                    {!isMe && (
                        <button
                            className={`hidden lg:flex w-full justify-center items-center gap-2 mt-2 ${baseBtn} ${pillBtn} ${outlineBtn} pt-1.5 pb-1.5`}
                        >
                            <MessageCircle size={18} />
                            Message
                        </button>
                    )}
                </div>

                {/* About user business */}
                <div className="mt-4 p-4 space-y-3 hidden lg:block border-b border-t">
                    <h3 className="font-semibold text-lg">About {fullName}</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.user?.bussinessDescription}</p>
                </div>
                {/* Tabs */}
                <div className="mt-3 p-4 space-y-3 hidden lg:block border-b">
                    {/* Address */}
                    {profile?.related?.businesses?.address && (
                        <div className="flex items-start gap-3 text-sm text-gray-700">
                            <MapPin size={18} className="text-orange-500 mt-0.5" />
                            <span>{profile.related.businesses.address}</span>
                        </div>
                    )}

                    {/* Opening hours */}
                    {(profile.related.businesses.openingTime || profile.related.businesses.closingTime) && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Clock size={18} className="text-orange-500" />
                            <span>
                                {profile.related.businesses.openingTime} – {profile.related.businesses.closingTime}
                            </span>
                        </div>
                    )}

                    {/* Phone */}
                    {profile.related.businesses.phone && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Phone size={18} className="text-orange-500" />
                            <a
                                href={`tel:${profile.related.businesses.phone}`}
                                className="hover:underline"
                            >
                                {profile.related.businesses.phone}
                            </a>
                        </div>
                    )}

                    {/* Website */}
                    {profile.related.businesses.website && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Globe size={18} className="text-orange-500" />
                            <a
                                href={profile.related.businesses.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline truncate"
                            >
                                {profile.related.businesses.website}
                            </a>
                        </div>
                    )}
                </div>

                {/* Google Map Preview */}
                {profile?.related?.businesses?.address && (
                    <div className="mt-5 rounded-lg overflow-hidden h-64 hidden lg:flex">
                        <iframe
                            width="100%"
                            height="100%"
                            className="border-0"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                profile.related.businesses.address
                            )}&output=embed`}
                        />
                    </div>
                )}

            </div>


        </>
    );
};

export default ProfileInfo;
