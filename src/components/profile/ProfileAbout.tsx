import React from "react";
import { MapPin, Phone, Globe, Clock, Info } from "lucide-react";
import type { ProfileResponse } from "@/types/api.types";

// Using the typed ProfileResponse we established earlier
const ProfileAbout: React.FC<{ profile: ProfileResponse }> = ({ profile }) => {
  const { user, business } = profile;

  // If there's no business, we can show a simple user bio instead of an empty business section
  if (!business) {
    return (
      <section className="bg-white rounded-xl p-6 shadow-sm lg:hidden">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Info size={20} className="text-orange-500" />
          About {user.firstName}
        </h3>
        <p className="mt-3 text-gray-700 leading-relaxed">
          {(user as any).bio || "This user hasn't added a bio yet."}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm space-y-5 lg:hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Business Identity */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">About {business.businessName}</h3>
        <p className="text-gray-700 leading-relaxed text-sm">{business.about}</p>
      </div>

      {/* Contact Details */}
      <div className="py-4 space-y-4 border-t border-b border-gray-50">
        {/* Address */}
        {business.address?.fullAddress && (
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <span>{business.address.fullAddress}</span>
          </div>
        )}

        {/* Operating Hours (Assuming array or string based on your schema) */}
        {business.operatingHours && (
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Clock size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Operating Hours</p>
              {/* Example: "9:00 AM - 6:00 PM" or mapping an array */}
              <p className="text-gray-500">Check business schedule</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {business.contact?.phone && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone size={18} className="text-orange-500 shrink-0" />
            <a href={`tel:${business.contact.phone}`} className="hover:text-orange-600">
              {business.contact.phone}
            </a>
          </div>
        )}

        {/* Website */}
        {business.contact?.website && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Globe size={18} className="text-orange-500 shrink-0" />
            <a
              href={business.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-orange-600 truncate"
            >
              {business.contact.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Google Map Preview */}
      {business.address?.fullAddress && (
        <div className="rounded-xl overflow-hidden h-48 border border-gray-100 shadow-inner">
          <iframe
            width="100%"
            height="100%"
            className="border-0 grayscale contrast-125"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
              business.address.fullAddress
            )}`}
          />
        </div>
      )}
    </section>
  );
};

export default ProfileAbout;