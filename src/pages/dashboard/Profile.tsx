import { useParams } from "react-router-dom";

export const Profile = () => {
    const { userId } = useParams<{ userId: string }>();

     // Use userId to fetch profile data
  console.log('Profile userId:', userId);
  
  return (
   <div>
      <h1>Profile Page for user: {userId}</h1>
      {/* Your profile content */}
    </div>
  )
}
