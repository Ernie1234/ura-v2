// src/components/dashboard/ProfileCard.tsx
import { Button } from "@/components/ui/button";

const ProfileCard = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <img
        src="/images/profile-cover.jpg"
        alt="Cover"
        className="h-28 w-full rounded-lg object-cover"
      />
      <div className="mt-4 text-center">
        <h2 className="font-semibold text-lg">Binta Bespoke</h2>
        <p className="text-sm text-gray-500">@bintabespoke_</p>

        <div className="mt-3 flex justify-around text-sm text-gray-600">
          <div><p className="font-bold">250</p><span>Posts</span></div>
          <div><p className="font-bold">2022</p><span>Followers</span></div>
          <div><p className="font-bold">590</p><span>Following</span></div>
        </div>

        <Button className="mt-4 bg-orange-500 text-white w-full">
          My Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
