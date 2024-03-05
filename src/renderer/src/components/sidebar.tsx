import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  ArrowDownload16Regular,
  Map24Regular,
  Search20Regular,
} from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [search, setSearch] = useState("");
  const [updated, setUpdated] = useState(true);
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
      window.storage.set(
        "settings.sidebar.width",
        sidebarRef.current?.style.width
      );
    });

    window.addEventListener("mouseup", () => {
      isResized.current = false;
      window.document.body.style.cursor = "auto";
      window.document.body.style.userSelect = "auto";
    });

    window.electron.ipcRenderer.on("update-available", () => {
      setUpdated(false);
    });
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "h-full min-h-28 max-w-[50%] w-[var(--sidebar-width)] overflow-auto relative",
        className
      )}
      style={{
        width:
          window.storage.get("settings.sidebar.width") ||
          "var(--sidebar-width)",
      }}
    >
      <div
        onMouseDown={() => (isResized.current = true)}
        className="absolute right-1 group z-50 w-1 h-[calc(100vh-40px)] cursor-w-resize dark:hover:bg-zinc-50/50 hover:bg-zinc-950/50 rounded-full"
      ></div>
      <div className="space-y-4 py-4 h-full flex flex-col justify-between">
        {/* Section */}
        <div className="h-full">
          <div className="px-3 py-2">
            <div className="flex w-full items-center mb-4">
              <form className="flex w-full">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className="flex-1 rounded-r-none focus-visible:ring-0 bg-zinc-50/60 dark:bg-zinc-950/60"
                  placeholder="Search"
                  minLength={1}
                />
                <Link
                  className="data-[disabled=true]:pointer-events-none"
                  to={
                    search.length === 0
                      ? "/"
                      : `/search?q=${encodeURIComponent(search.toLowerCase())}`
                  }
                >
                  <Button type="submit" size="icon" className="rounded-l-none">
                    <Search20Regular />
                  </Button>
                </Link>
              </form>
            </div>

            <div className="flex items-center gap-2 mb-4 mt-6">
              <Map24Regular />
              <h2 className="text-lg font-semibold tracking-tight">Discover</h2>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-foreground/5 cursor-default"
                >
                  Home
                </Button>
              </Link>
              <Link to="/popular" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-foreground/5 cursor-default"
                >
                  Popular
                </Button>
              </Link>
              <Link to="/latest/animes" className="cursor-default">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-foreground/5 cursor-default"
                >
                  Latest animes
                </Button>
              </Link>
              <Link to="/latest/episodes" className=":cursor-default">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-foreground/5 cursor-default"
                >
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
      </div>
    </aside>
  );
}
