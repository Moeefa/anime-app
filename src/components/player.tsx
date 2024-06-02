import {
  ArrowLeft16Regular,
  FastForward20Regular,
  FullScreenMaximize16Regular,
  Pause16Regular,
  PictureInPicture16Regular,
  Play16Regular,
  Settings16Regular,
  Speaker016Regular,
  Speaker116Regular,
  Speaker216Regular,
} from "@fluentui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, time } from "@/lib/utils";
import { useContext, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { IGetWatchURL } from "src/types/watch";
import { Link } from "react-router-dom";
import { PlayerContext } from "@/contexts/player-context";
import React from "react";
import ReactPlayer from "react-player";
import { Slider } from "@/components/ui/slider";
import { Titlebar } from "./controls";
import { getCurrent } from "@tauri-apps/api/webviewWindow";

let timeout: ReturnType<typeof setTimeout>;
export default function Player({
  className = "",
  sources,
  ...props
}: {
  className?: string;
  sources: IGetWatchURL["urls"];
  [key: string]: any;
}): React.ReactElement {
  const { state, update } = useContext(PlayerContext);
  const [buffering, setBuffering] = React.useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    update("quality").set(Object.keys(sources).at(-1));
  }, [sources]);

  const resetIdleCursor = () => {
    clearTimeout(timeout);
    update("controls.main").set(true);
    timeout = setTimeout(() => {
      update("controls.main").set(false);
      update("controls.volume").set(false);
      update("controls.settings").set(false);
    }, 3000);
  };

  const handleQuality = (value: string) => {
    if (!playerRef.current) return;
    update("quality").set(value);

    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.getInternalPlayer().src = sources[value];
    playerRef.current.seekTo(currentTime);
  };

  const toggleFullscreen = async () => {
    await getCurrent().setFullscreen(!(await getCurrent().isFullscreen()));
  };

  const handleKeys = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowLeft":
        playerRef.current?.seekTo(
          (playerRef.current?.getCurrentTime() || 0) - 5,
        );

        break;

      case "ArrowRight":
        playerRef.current?.seekTo(
          (playerRef.current?.getCurrentTime() || 0) + 5,
        );

        break;

      case "Space":
        resetIdleCursor();
        update("playing").toggle();

        break;

      case "Escape":
        toggleFullscreen();

        break;

      case "KeyP":
        update("pip").toggle();

        break;

      case "KeyV":
        resetIdleCursor();
        update("controls.volume").toggle();

        break;
    }
  };

  return (
    <>
      <div
        data-enabled={buffering || !Object.keys(sources).length}
        className="absolute data-[enabled=false]:hidden w-full h-full animate-pulse pointer-events-none bg-black/40 z-10"
      ></div>
      <div
        data-enabled={buffering || !Object.keys(sources).length}
        className="absolute top-1/2 right-1/2 data-[enabled=false]:hidden pointer-events-none z-10"
      >
        <svg
          aria-hidden="true"
          className="w-12 h-12 text-secondary animate-spin fill-secondary-foreground"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
      <div className="absolute z-50 flex w-full">
        <Titlebar
          data-tauri-drag-region
          className="bg-transparent h-28 p-0 m-0 w-full group"
          data-enabled={
            state.controls.main || buffering || !Object.keys(sources).length
          }
          windowControlsProps={{
            className: `z-50 h-8 ${
              (!state.controls.main && !buffering) ||
              !Object.keys(sources).length
                ? "hidden"
                : ""
            }`,
          }}
        >
          <div
            className="absolute z-40 w-full h-8"
            data-tauri-drag-region
          ></div>
          <div className="absolute flex justify-end top-0 h-28 transition-all delay-300 bg-gradient-to-t to-black/40 from-transparent -translate-y-80 group-data-[enabled=true]:translate-y-0 w-full">
            <div className="text-white gap-4 transition-all delay-300 -translate-y-80 group-data-[enabled=true]:translate-y-0 items-center w-full flex px-6 py-2">
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        tabIndex={-1}
                        to={`/episodes?url=${encodeURIComponent(
                          props["data-origin"],
                        )}`}
                      >
                        <Button
                          size="icon"
                          className="rounded-full titlebar-actions bg-secondary/50 backdrop-blur"
                          variant="secondary"
                          tabIndex={-1}
                        >
                          <ArrowLeft16Regular />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Return</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight titlebar-actions">
                  Episódio {props["data-episode"]}
                </h3>
              </div>
            </div>
          </div>
        </Titlebar>
      </div>
      <div
        className={cn(
          "outline-none relative overflow-hidden flex flex-col justify-center items-center group aspect-video cursor-none data-[enabled=true]:cursor-auto w-full h-full",
          className,
        )}
        tabIndex={0}
        data-enabled={
          state.controls.main || buffering || !Object.keys(sources).length
        }
        ref={wrapperRef}
        onMouseMove={resetIdleCursor}
        onKeyDown={handleKeys}
      >
        <div
          className="h-full w-full overflow-hidden"
          onClick={() => update("playing").toggle()}
        >
          <ReactPlayer
            width="100%"
            height="100%"
            ref={playerRef}
            controls={false}
            playing={state.playing}
            pip={state.pip}
            volume={Number(state.volume || 0) / 100}
            onBuffer={() => setBuffering(true)}
            onBufferEnd={() => setBuffering(false)}
            onDuration={(duration) => update("duration").set(duration)}
            onProgress={({ playedSeconds }) =>
              update("played").set(playedSeconds)
            }
            url={
              !Object.keys(sources).length
                ? ""
                : Object.entries(sources)
                    .reverse()
                    .map(([_k, v]) => {
                      return new RegExp("^(?:[a-z+]+:)?//", "i").test(v)
                        ? v
                        : import.meta.env.VITE_API_BASE_URL + v;
                    })
            }
          />
        </div>
        <div
          ref={controlsRef}
          tabIndex={-1}
          className="gap-4 z-30 transition-all delay-300 translate-y-80 opacity-0 group-data-[enabled=true]:opacity-100 group-data-[enabled=true]:translate-y-0 bg-gradient-to-b from-transparent to-black/40 items-center w-full flex absolute bottom-0 mt-auto p-6"
        >
          <div className="flex flex-col gap-4 w-full py-4">
            <div className="flex w-full">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {props["data-title"]}
              </h3>
            </div>
            <div className="flex w-full items-center gap-4">
              <Button
                variant="secondary"
                className="rounded-full bg-secondary/50 backdrop-blur"
                size="icon"
                onClick={() => update("playing").toggle()}
                tabIndex={-1}
              >
                {state.playing ? <Pause16Regular /> : <Play16Regular />}
              </Button>

              {!props["data-disable-next"] ? (
                <Link tabIndex={-1} to={props["data-next"]}>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-secondary/50 backdrop-blur"
                    size="icon"
                    onClick={() => update("playing").toggle()}
                    tabIndex={-1}
                  >
                    <FastForward20Regular />
                  </Button>
                </Link>
              ) : (
                <></>
              )}

              <small className="text-sm min-w-8 max-w-8 text-white font-medium leading-none">
                {time(playerRef.current?.getCurrentTime() || 0)}
              </small>

              <Slider
                tabIndex={-1}
                className="flex-1"
                max={playerRef.current?.getDuration() || state.duration || 0}
                value={[playerRef.current?.getCurrentTime() || 0]}
                onPointerDown={() => update("playing").set(false)}
                onPointerUp={() => update("playing").set(true)}
                onValueChange={(value: number[]) => {
                  resetIdleCursor();
                  playerRef.current?.seekTo(value[0]);
                }}
              />

              <small className="text-sm min-w-8 max-w-8 text-white font-medium leading-none">
                {time(playerRef.current?.getDuration() || state.duration || 0)}
              </small>

              <Popover open={state.controls.volume}>
                <PopoverTrigger asChild>
                  <Button
                    onClick={() => update("controls.volume").toggle()}
                    variant="secondary"
                    className="rounded-full bg-secondary/50 backdrop-blur"
                    size="icon"
                    tabIndex={-1}
                  >
                    {state.volume === 0 ? (
                      <Speaker016Regular />
                    ) : state.volume < 50 ? (
                      <Speaker116Regular />
                    ) : (
                      <Speaker216Regular />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  onMouseEnter={resetIdleCursor}
                  onEscapeKeyDown={(e: any) => e.preventDefault()}
                  container={controlsRef.current}
                  side="top"
                  className="w-[50px] flex-col flex items-center justify-center bg-secondary/50 backdrop-blur border-secondary/40"
                >
                  <small className="text-sm font-medium leading-none mb-2">
                    {state.volume}%
                  </small>
                  <Slider
                    defaultValue={[state.volume]}
                    max={100}
                    min={0}
                    orientation="vertical"
                    tabIndex={-1}
                    onValueChange={(value) => {
                      update("volume").set(Number(value));
                    }}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="secondary"
                className="rounded-full bg-secondary/50 backdrop-blur"
                size="icon"
                onClick={() => update("pip").toggle()}
                tabIndex={-1}
              >
                <PictureInPicture16Regular />
              </Button>

              <DropdownMenu
                open={state.controls.settings}
                onOpenChange={() => update("controls.settings").toggle()}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    disabled={Object.keys(sources).length === 0}
                    className="rounded-full bg-secondary/50 backdrop-blur"
                    size="icon"
                    tabIndex={-1}
                  >
                    <Settings16Regular />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary/50 backdrop-blur border-secondary/40">
                  <DropdownMenuLabel>Quality</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-secondary/40" />
                  <DropdownMenuRadioGroup
                    value={state.quality}
                    onValueChange={handleQuality}
                  >
                    {Object.entries(sources)
                      .reverse()
                      .map(([key, _], i) => {
                        return (
                          <DropdownMenuRadioItem
                            key={i}
                            disabled={Object.keys(sources).length === 0}
                            value={key}
                            tabIndex={-1}
                          >
                            {key}
                          </DropdownMenuRadioItem>
                        );
                      })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="secondary"
                className="rounded-full bg-secondary/50 backdrop-blur"
                size="icon"
                tabIndex={-1}
                onClick={async () => toggleFullscreen()}
              >
                <FullScreenMaximize16Regular className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
