// src/components/profile/ProfileAbout.tsx
import React from "react";
import { MapPin } from "lucide-react";

const ProfileAbout: React.FC<{ profile: any }> = ({ profile }) => {
  const address = profile?.user?.address ?? "Plot 55, Apapa Street Lagos";
  const phone = profile?.user?.phone ?? "+234 70 456 323";
  const website = profile?.user?.website ?? "https://example.com";

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-3">About</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        {profile?.user?.about ?? "No about info provided. This user hasn't added an about section yet."}
      </p>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-orange-400" />
          <div>{address}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-orange-400">📞</div>
          <div>{phone}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-orange-400">🔗</div>
          <div>
            <a href={website} target="_blank" rel="noreferrer" className="text-orange-500">
              {website}
            </a>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-6 rounded-lg overflow-hidden border">
        <img src="https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png" alt="map" className="w-full h-48 object-cover" />
      </div>
    </section>
  );
};

export default ProfileAbout;
