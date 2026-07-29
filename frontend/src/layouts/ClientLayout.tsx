import { Outlet } from "react-router-dom"
import Header from "../components/client/Header"
import Sidebar from "../components/client/Sidebar"

const ClientLayout = () => {
  return (
      <>
          <div className="flex">
            <Sidebar/>
            <main>
                <Header/>
                <Outlet/>
            </main>
          </div>
      </>
  )
}

export default ClientLayout