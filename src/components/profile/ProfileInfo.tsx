import React from "react";
import { MapPin, Phone, Globe, Pencil, UserPlus, MessageCircle, Briefcase, Share2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { UserType, BusinessType } from "@/types/api.types";

type Props = {
  user: UserType;
  business: BusinessType | null;
  related: any;
  isMe: boolean;
};

const ProfileInfo: React.FC<Props> = ({ user, business, related, isMe }) => {
  const location = useLocation();
  const isBusinessRoute = location.pathname.includes("/business/");

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
          {bio || "No description provided."}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center py-4 border-y border-gray-100">
        <StatBlock label="Followers" value={related?.counts?.followers || 0} />
        <StatBlock label="Following" value={related?.counts?.following || 0} />
        <StatBlock label="Posts" value={related?.counts?.posts || 0} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {isMe ? (
          <Link to="/user/settings/edit" className={btnPrimary}>
            <Pencil size={18} /> Edit {isBusinessRoute ? "Business" : "Profile"}
          </Link>
        ) : (
          <>
            <button className={btnPrimary}><UserPlus size={18} /> Follow</button>
            <button className={btnOutline}><MessageCircle size={18} /> Message</button>
          </>
        )}
        <button className={btnOutline}><Share2 size={18} /> Share Profile</button>

        {/* Dynamic Navigation Switch */}
        {!isBusinessRoute && user.isBusinessOwner && business && (
          <Link to={`/business/${business._id}`} className={`${btnOutline} border-orange-200 text-orange-600 bg-orange-50/50 mt-2`}>
            <Briefcase size={18} /> View Business Page
          </Link>
        )}
        {isBusinessRoute && (
          <Link to={`/dashboard/profile/${user._id}`} className={`${btnOutline} mt-2`}>
            <User size={18} /> View Owner Profile
          </Link>
        )}
      </div>

      {/* Contact Info (Only for Business) */}
      {isBusinessRoute && business && (
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact & Location</h4>
          {business.address?.fullAddress && <InfoRow icon={<MapPin size={18}/>} text={business.address.fullAddress} />}
          {business.contact?.phone && <InfoRow icon={<Phone size={18}/>} text={business.contact.phone} />}
          {business.contact?.website && (
            <InfoRow 
              icon={<Globe size={18}/>} 
              text={business.contact.website} 
              link={business.contact.website} 
            />
          )}
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default ProfileInfo;