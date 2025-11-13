// src/components/dashboard/ProfileCard.tsx
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const { isLoading, user,related } = useAuthContext();

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <img
        src={"https://www.shutterstock.com/image-vector/abstract-orange-background-diagonal-lines-600nw-2490647129.jpg"}
        alt="Cover"
        className="h-28 w-full rounded-lg object-cover"
      />
      <div className="mt-4 text-center">
        {isLoading ? <Loader2
                  size="24px"
                  className="place-self-center self-center animate-spin"
                />: (
                  <>

                  <h2 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h2>
        <p className="text-sm text-gray-500">@{user?.firstName}{user?.lastName}_</p>
                  </>
                )}

        <div className="mt-3 flex justify-around text-sm text-gray-600">
          <div><p className="font-bold">{related?.counts.posts}</p><span>Posts</span></div>
          <div><p className="font-bold">{related?.counts.followers}</p><span>Followers</span></div>
          <div><p className="font-bold">{related?.counts.following}</p><span>Following</span></div>
        </div>

        <Button className="mt-4 bg-orange-500 text-white w-full" asChild>
          <Link to={`/dashboard/profile/${user?._id}`}>
          My Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
