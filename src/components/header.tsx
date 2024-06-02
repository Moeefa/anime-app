import {
  ArrowSyncCircle16Regular,
  CheckmarkCircle16Regular,
  DismissCircle16Regular,
  PanelLeft16Regular,
  Search16Regular,
  Settings16Regular,
} from "@fluentui/react-icons";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { exit, relaunch } from "@tauri-apps/plugin-process";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderContext } from "@/contexts/provider-context";
import { SettingsContext } from "@/contexts/settings-context";
import { Titlebar } from "@/components/controls";
import { emit } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";
import { useNavigate } from "react-router-dom";

export default function Header(): JSX.Element {
  const { settings, update } = useContext(SettingsContext);
  const { status } = useContext(ProviderContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Titlebar data-tauri-drag-region className="bg-transparent">
        <Menubar className="ml-1 bg-transparent border-none h-8 space-x-2">
          <MenubarMenu>
            <MenubarTrigger className="h-7 w-7 rounded-md flex items-center justify-center bg-transparent group text-black/90 hover:bg-black/[.05] data-[state=open]:bg-black/[.03] focus:bg-black/[.03] dark:text-white dark:hover:bg-white/[.06] dark:data-[state=open]:bg-white/[.04] dark:focus:bg-white/[.04]">
              <div className="h-4 w-4 flex items-center justify-center group-hover:rotate-90 transition-all">
                <Settings16Regular />
              </div>
            </MenubarTrigger>
            <MenubarContent className="bg-popover">
              <MenubarItem onClick={() => navigate(0)}>
                Reload <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onClick={async () => {
                  await invoke("open_settings");
                  emit("settings-load", settings);
                }}
              >
                Settings
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => open("https://github.com/Moeefa")}>
                GitHub
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={async () => await relaunch()}>
                Relaunch
              </MenubarItem>
              <MenubarItem onClick={async () => await exit(0)}>
                Quit <MenubarShortcut>⌘Q</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <Button
            size="icon"
            className="h-7 w-7 shadow-none cursor-default flex items-center justify-center bg-transparent text-black/90 hover:bg-black/[.05] data-[state=open]:bg-black/[.03] focus:bg-black/[.03] dark:text-white dark:hover:bg-white/[.06] dark:data-[state=open]:bg-white/[.04] dark:focus:bg-white/[.04]"
            onClick={async () => {
              update("sidebar.display").toggle();
            }}
          >
            <PanelLeft16Regular />
          </Button>
        </Menubar>

        <div
          className="flex p-1 w-full items-center justify-center h-8"
          data-tauri-drag-region
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();

              navigate(
                search.length === 0
                  ? "/"
                  : `/search?q=${encodeURIComponent(search.toLowerCase())}`,
              );
            }}
          >
            <div className="flex items-center w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1 h-7 focus-visible:ring-0 bg-zinc-50/60 dark:bg-zinc-950/60">
              <Search16Regular />
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="flex-1 focus-visible:ring-0 border-none bg-transparent"
                placeholder="Search"
                minLength={1}
              />
            </div>
          </form>
        </div>

        <div
          data-tauri-drag-region
          className="flex justify-end items-center mr-2"
        >
          <small
            data-tauri-drag-region
            className="text-xs flex items-center gap-1 text-nowrap leading-none"
          >
            {status === "online" ? (
              <CheckmarkCircle16Regular data-tauri-drag-region />
            ) : status === "offline" ? (
              <DismissCircle16Regular data-tauri-drag-region />
            ) : (
              <ArrowSyncCircle16Regular data-tauri-drag-region />
            )}
            {settings.provider}
          </small>
        </div>
      </Titlebar>
    </>
  );
}
