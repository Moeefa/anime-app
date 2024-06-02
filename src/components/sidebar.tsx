import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  ArrowCounterclockwise16Regular,
  ArrowDownload16Regular,
  ArrowTrending16Regular,
  ChannelAdd16Regular,
  Home16Regular,
  SlideAdd16Regular,
} from "@fluentui/react-icons";
import { useContext, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SettingsContext } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { emit } from "@tauri-apps/api/event";

export default function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [updated] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const { settings, update } = useContext(SettingsContext);
  const isResized = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (isResized.current === false) return;

      window.document.body.style.cursor = "w-resize";
      window.document.body.style.userSelect = "none";

      sidebarRef.current &&
        (sidebarRef.current.style.width =
          (sidebarRef.current.clientWidth + e.movementX) / 16 + "rem");

      update("sidebar.width").set(sidebarRef.current?.style.width);
    });

    window.addEventListener("mouseup", () => {
      setIsDragging(false);
      isResized.current = false;
      window.document.body.style.cursor = "auto";
      window.document.body.style.userSelect = "auto";
    });
  }, []);

  return (
    <aside
      ref={sidebarRef}
      data-display={settings.sidebar?.display}
      className={cn(
        "h-full min-h-28 max-w-[50%] w-[var(--sidebar-width)] overflow-auto relative data-[display=false]:hidden",
        className,
      )}
      style={{
        width: settings.sidebar.width || "var(--sidebar-width)",
      }}
    >
      <div
        onMouseDown={() => {
          isResized.current = true;
          setIsDragging(true);
        }}
        data-dragging={isDragging}
        className="data-[dragging=true]:dark:bg-zinc-50/50 data-[dragging=true]:bg-zinc-950/50 absolute right-1 group z-50 w-1 h-[calc(100vh-40px)] cursor-w-resize dark:hover:bg-zinc-50/50 hover:bg-zinc-950/50 rounded-full"
      ></div>
      <div className="h-full flex flex-col justify-between">
        {/* Section */}
        <div className="h-full">
          <div className="px-3">
            <div className="flex items-center gap-2 mb-4 mt-2 flex justify-between">
              <p className="text-xs text-muted-foreground font-semibold">
                Discover
              </p>
              <Button
                onClick={() => emit("refresh-data")}
                size="icon"
                variant="ghost"
                className="size-6 bg-transparent group hover:bg-black/[.05] dark:hover:bg-white/[.06]"
              >
                <ArrowCounterclockwise16Regular className="text-muted-foreground group-hover:-rotate-[75deg] transition-transform" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full gap-2 justify-start hover:bg-black/[.05] dark:hover:bg-white/[.06] cursor-default"
                >
                  <Home16Regular />
                  Home
                </Button>
              </Link>
              <Link to="/popular" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full gap-2 justify-start hover:bg-black/[.05] dark:hover:bg-white/[.06] cursor-default"
                >
                  <ArrowTrending16Regular />
                  Popular
                </Button>
              </Link>
              <Link to="/latest/animes" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full gap-2 justify-start hover:bg-black/[.05] dark:hover:bg-white/[.06] cursor-default"
                >
                  <ChannelAdd16Regular />
                  Latest animes
                </Button>
              </Link>
              <Link to="/latest/episodes" className=":cursor-default">
                <Button
                  variant="ghost"
                  className="w-full gap-2 justify-start hover:bg-black/[.05] dark:hover:bg-white/[.06] cursor-default"
                >
                  <SlideAdd16Regular />
                  Latest episodes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-3 flex-1">
          {!updated && (
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/Moeefa/anime-app/releases"
            >
              <Alert className="flex bg-background/60 justify-center items-center [&>svg]:static [&>svg]:translate-x-0 [&>svg]:translate-y-0 [&>svg~*]:pl-2 [&>h5]:mb-0">
                <ArrowDownload16Regular />
                <AlertTitle className="font-normal">
                  Update available!
                </AlertTitle>
              </Alert>
            </a>
          )}
        </div>

        {/* <div className="flex-1 p-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              await invoke("open_settings");
              emit("settings-load", settings);
            }}
            className="h-7 w-7 shadow-none cursor-default flex items-center justify-center bg-transparent text-black/90 hover:bg-black/[.05] data-[state=open]:bg-black/[.03] focus:bg-black/[.03] dark:text-white dark:hover:bg-white/[.06] dark:data-[state=open]:bg-white/[.04] dark:focus:bg-white/[.04]"
          >
            <Settings16Regular />
          </Button>
        </div> */}
      </div>
    </aside>
  );
}
