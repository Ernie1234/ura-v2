import { useAuthContext } from "@/context/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link } from "react-router-dom"


export const DashboardAvatar = () => {
    const {isLoading,user} = useAuthContext()
  return (
    <>
   {!isLoading && user && (
  <Link to={`/${user._id}`}>
    <Avatar>
      <AvatarImage src={user.profilePicture} alt={user.firstName} />
      <AvatarFallback>
        {user.firstName.charAt(0)}
        {user.lastName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  </Link>
)}

            </>
  )
}
