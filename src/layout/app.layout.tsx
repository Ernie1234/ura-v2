import { Outlet } from "react-router-dom";

import { AuthProvider } from "@/context/auth-provider";
import DashboardNav from "@/components/nav/DashboardNav";


const AppLayout = () => {
  return (
    <AuthProvider>
      <DashboardNav />
                <Outlet />
      {/* <SidebarProvider>
        <AppSideBar />
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <>
              <Header />
              <div className="px-3 lg:px-20 py-3">
              </div>
            </>
          </div>
        </SidebarInset>
      </SidebarProvider> */}
    </AuthProvider>
  );
};

export default AppLayout;
