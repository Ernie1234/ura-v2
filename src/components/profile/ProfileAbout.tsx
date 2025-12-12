// src/components/profile/ProfileAbout.tsx
import React from "react";
import { MapPin, Phone, Globe, Clock } from "lucide-react";

const ProfileAbout: React.FC<{ profile: any }> = ({ profile }) => {

  return (
    // MOBILE ONLY
    <section className="bg-white rounded-xl p-6 shadow-sm space-y-5 lg:hidden">
      {/* About user business */}
      <div className="p-4 space-y-3 border-b border-t">
        <h3 className="font-semibold text-lg">About {profile.user.businessName}</h3>
        <p className="text-gray-700 leading-relaxed">{profile.user?.bussinessDescription}</p>
      </div>
      {/* Tabs */}
      <div className="mt-3 p-4 space-y-3 border-b">
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
        <div className="mt-5 rounded-lg overflow-hidden h-64">
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
    </section>
  );
};

export default ProfileAbout;
