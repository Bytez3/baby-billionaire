import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useMediaQuery } from "react-responsive";

export default function Layout() {
  const isXXL = useMediaQuery({ minWidth: 1468 });
  const isLG = useMediaQuery({ minWidth: 1280 });

  const screenSizeClass = isXXL ? 'ml-90' : isLG ?  'ml-76' : "";

  return (
    <div className="bg-home-hero bg-cover bg-center min-h-screen w-full flex relative">
      <Sidebar />

      <div className={`flex-1 flex flex-col  ${screenSizeClass} `}>
        <main className="flex-1 p-2 sm:p-6 md:p-10 text-white overflow-y-auto">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
