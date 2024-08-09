import { DEFAULT_SETTINGS, SettingsContext } from "@/contexts/settings-context";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useTheme } from "@/contexts/theme-provider";
import { resolveTheme } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { settings } = useContext(SettingsContext);
  const { theme } = useTheme();

  async function setDiscordRPC() {
    invoke("update_discord_rpc", {
      details: "Browsing the web",
      state: "Just chilling",
      start: Date.now(),
      end: 0,
    });
  }

  useEffect(() => {
    setDiscordRPC();
  }, []);

  return (
    <div
      style={{
        backgroundColor: `rgb(${
          settings.background?.[resolveTheme(theme)] ||
          (resolveTheme(theme) === "dark"
            ? DEFAULT_SETTINGS.background.dark
            : DEFAULT_SETTINGS.background.light)
        } / ${
          1 -
          (settings.transparency?.[resolveTheme(theme)] ||
            (resolveTheme(theme) === "dark"
              ? DEFAULT_SETTINGS.transparency.dark
              : DEFAULT_SETTINGS.transparency.light))
        })`,
      }}
    >
      <Header />
      <div
        data-sidebar={settings.sidebar.display}
        className="flex data-[sidebar=true]:pr-[8px] data-[sidebar=false]:px-[8px]"
      >
        <Sidebar className="min-w-52 float-left h-[calc(100vh-32px)]" />
        <main className="overflow-auto min-w-[50%] h-[calc(100vh-42px)] shadow-lg dark:shadow-zinc-900 p-6 pb-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
