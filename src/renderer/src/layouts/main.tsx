import Header from "@/components/header"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/sidebar"

export default function MainLayout() {
  return (
    <>
      <Header />
      <div className="flex overflow-hidden">
        <Sidebar className="fixed float-left top-[var(--titlebar-height)] w-[var(--sidebar-width)] bg-card h-[calc(100vh-var(--titlebar-height))]" />
        <main className="float-right overflow-auto h-screen container p-6 w-[calc(100%-var(--sidebar-width))] mt-[var(--titlebar-height)] ml-[var(--sidebar-width)]">
          <div className="pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
