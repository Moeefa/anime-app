import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";

const startTimestamp = new Date();
export default function MainLayout() {
  window.electron.ipcRenderer.send("discord:rpc", {
    details: "In the rabbit hole",
    state: "Digging through the catalog",
    startTimestamp,
    largeImageKey: "icon",
    largeImageText: "Rabbit Hole",
    instance: false,
  });

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar className="min-w-52 float-left top-[var(--titlebar-height)] h-[calc(100vh-var(--titlebar-height))]" />
        <main className="overflow-auto min-w-[50%] h-[calc(100vh-40px)] shadow-lg dark:shadow-zinc-900 container p-6 pb-0 flex-1 mr-[10px] mt-[var(--titlebar-height)]">
          <Outlet />
        </main>
      </div>
    </>
  );
}
