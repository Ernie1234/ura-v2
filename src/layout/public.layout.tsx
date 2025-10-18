import { NavBar } from "@/components/nav/NavBar"
import Footer from "@/components/shared/Footer"
import { Outlet } from "react-router-dom"


const PublichLayout = () => {
  return (
    <div>
        <NavBar />
        <div className="min-h-dvh">

        <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default PublichLayout