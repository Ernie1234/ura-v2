/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
import useAuth from "@/hooks/api/use-auth";
import type { UserType } from "@/types/api.types";

// Define the context shape
type AuthContextType = {
  user?: UserType;
//   workspace?: IWorkspace;
//   hasPermission: (permission: PermissionType) => boolean;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
//   const navigate = useNavigate();
//   const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();
  const user = authData?.user;

//   const {
//     data: workspaceData,
//     isLoading: workspaceLoading,
//     error: workspaceError,
//     refetch: refetchWorkspace,
//   } = useGetWorkspaceQuery(workspaceId);

//   const workspace = workspaceData?.workspaceWithMembers;

//   useEffect(() => {
//     if (workspaceError) {
//       if (workspaceError?.errorCode === "ACCESS_UNAUTHORIZED") {
//         navigate("/");
//       }
//     }
//   }, [navigate, workspaceError]);

//   console.log("workspace Data here: ", workspaceData);

//   const permissions = usePermissions(user,workspace);

//   const hasPermission = (permission: PermissionType): boolean => {
//     return permissions.includes(permission);
//   };

  return (
    <AuthContext.Provider
      value={{
        user,
        // workspace,
        // hasPermission,
        error: authError,
        // error: authError || workspaceError,
        isLoading,
        isFetching,
        // workspaceLoading,
        refetchAuth,
        // refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
