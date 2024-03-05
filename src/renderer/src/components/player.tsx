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
import { useContext, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { IGetWatchURL } from "src/types/watch";
import { Link } from "react-router-dom";
import { PlayerContext } from "@/contexts/player-context";
import ReactPlayer from "react-player";
import { Slider } from "@/components/ui/slider";

const startTimestamp = new Date();
let timeout: string | number | NodeJS.Timeout | undefined;
export default function Player({
  className = "",
  sources,
  ...props
}: {
  className?: string;
  sources: IGetWatchURL["sources"];
}): React.ReactElement {
  const { state, update } = useContext(PlayerContext);
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    update("quality").set(Object.keys(sources).at(-1));
  }, [sources]);

  useEffect(() => {
    window.electron.ipcRenderer.send("discord:rpc", {
      startTimestamp,
      details: props["data-title"],
      state: `Watching episode ${props["data-episode"]}`,
      largeImageKey: "icon",
      largeImageText: "Rabbit Hole",
      smallImageKey: "watching",
      smallImageText: "Watching",
      instance: false,
    });
  }, []);

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

  const handleKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowLeft":
        playerRef.current?.seekTo(
          (playerRef.current?.getCurrentTime() || 0) - 5
        );

        break;

      case "ArrowRight":
        playerRef.current?.seekTo(
          (playerRef.current?.getCurrentTime() || 0) + 5
        );

        break;

      case "Space":
        resetIdleCursor();
        update("playing").toggle();

        break;

      case "Escape":
        window.electron.ipcRenderer.send("fullscreen");

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
        className={cn(
          "outline-none relative overflow-hidden flex flex-col justify-center items-center group aspect-video cursor-none data-[enabled=true]:cursor-auto w-full h-full",
          className
        )}
        tabIndex={0}
        data-enabled={state.controls.main}
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
            onEnded={() => update("playing").set(false)}
            onBuffer={() => console.log("buffering")}
            onDuration={(duration) => update("duration").set(duration)}
            onProgress={({ playedSeconds }) =>
              update("played").set(playedSeconds)
            }
            url={Object.entries(sources)
              .reverse()
              .map(([_k, v]) => v)}
          />
        </div>
        <div className="draggable text-white gap-4 transition-all delay-300 -translate-y-80 group-data-[enabled=true]:translate-y-0 bg-gradient-to-t from-transparent to-black/40 items-center w-full flex absolute top-0 mt-auto p-6">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    tabIndex={-1}
                    to={`/episodes?url=${props["data-origin"]}`}
                  >
                    <Button
                      size="icon"
                      className="rounded-full titlebar-actions"
                      variant="secondary"
                      tabIndex={-1}
                    >
                      <ArrowLeft16Regular />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight titlebar-actions">
              Episódio {props["data-episode"]}
            </h3>
          </div>
        </div>
        <div
          ref={controlsRef}
          tabIndex={-1}
          className="gap-4 transition-all delay-300 translate-y-80 group-data-[enabled=true]:translate-y-0 bg-gradient-to-b from-transparent to-black/40 items-center w-full flex absolute bottom-0 mt-auto p-6"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {props["data-title"]}
              </h3>
            </div>
            <div className="flex w-full items-center gap-4">
              <Button
                variant="secondary"
                className="rounded-full"
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
                    className="rounded-full"
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

              <small className="text-sm text-white font-medium leading-none">
                {time(playerRef.current?.getCurrentTime() || 0)}
              </small>

              <Slider
                tabIndex={-1}
                background="bg-white"
                className="flex-1"
                max={playerRef.current?.getDuration() || 0}
                value={[playerRef.current?.getCurrentTime() || 0]}
                onPointerDown={() => update("playing").set(false)}
                onPointerUp={() => update("playing").set(true)}
                onValueChange={(value) => {
                  resetIdleCursor();
                  playerRef.current?.seekTo(value[0]);
                }}
              />

              <small className="text-sm text-white font-medium leading-none">
                {time(playerRef.current?.getDuration() || 0)}
              </small>

              <Popover open={state.controls.volume}>
                <PopoverTrigger asChild>
                  <Button
                    onClick={() => update("controls.volume").toggle()}
                    variant="secondary"
                    className="rounded-full"
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
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  container={controlsRef.current}
                  side="top"
                  className="w-[50px] flex-col flex items-center justify-center"
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
                      window.storage.set("settings.volume", Number(value));
                      update("volume").set(Number(value));
                    }}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="secondary"
                className="rounded-full"
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
                    className="rounded-full"
                    size="icon"
                    tabIndex={-1}
                  >
                    <Settings16Regular />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Quality</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                className="rounded-full"
                size="icon"
                tabIndex={-1}
                onClick={() => window.electron.ipcRenderer.send("fullscreen")}
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
