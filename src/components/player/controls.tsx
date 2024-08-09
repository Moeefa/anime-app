import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { PlayerContext } from "@/contexts/player-context";
import { SettingsContext } from "@/contexts/settings-context";
import { time } from "@/lib/utils";
import {
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
import { RefObject, useContext, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { PlayerData } from "./player";

export default function Controls({
  data,
  player,
}: {
  data: PlayerData;
  player: RefObject<ReactPlayer>;
}) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const settings = useContext(SettingsContext);
  const { state, update, resetIdleCursor, toggleFullscreen } =
    useContext(PlayerContext);

  const handleQuality = (value: string) => {
    if (!player.current) return;
    update("quality").set(value);

    const currentTime = player.current.getCurrentTime();
    player.current.getInternalPlayer().src = data.sources[value];
    player.current.seekTo(currentTime);
  };

  useEffect(() => {
    update("quality").set(Object.keys(data.sources).at(-1));
  }, [data.sources]);

  return (
    <div
      ref={controlsRef}
      tabIndex={-1}
      className="gap-4 pointer-events-none z-30 transition-all delay-300 translate-y-80 opacity-0 group-data-[enabled=true]:opacity-100 group-data-[enabled=true]:translate-y-0 bg-gradient-to-b from-transparent to-black/40 items-center w-full flex absolute bottom-0 mt-auto p-6"
    >
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex w-full">
          <h3 className="scroll-m-20 text-2xl text-white font-semibold tracking-tight">
            {data.title}
          </h3>
        </div>
        <div className="flex w-full items-center gap-4 [&>*]:pointer-events-auto">
          <Button
            variant="secondary"
            className="rounded-full bg-secondary/50 backdrop-blur"
            size="icon"
            onClick={() => update("playing").toggle()}
            tabIndex={-1}
          >
            {state.playing ? <Pause16Regular /> : <Play16Regular />}
          </Button>

          {data.next.enabled ? (
            <Link tabIndex={-1} to={data.next.url}>
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
            {time(state.elapsed || player.current?.getCurrentTime() || 0)}
          </small>

          <Slider
            tabIndex={-1}
            className="flex-1"
            max={state.duration || player.current?.getDuration() || 0}
            value={[state.elapsed || player.current?.getCurrentTime() || 0]}
            onPointerDown={() => update("playing").set(false)}
            onPointerUp={() => update("playing").set(true)}
            onValueChange={(value: number[]) => {
              resetIdleCursor();
              update("elapsed").set(value[0]);
              player.current?.seekTo(value[0]);
            }}
          />

          <small className="text-sm min-w-8 max-w-8 text-white font-medium leading-none">
            {time(state.duration || player.current?.getDuration() || 0)}
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
              className="w-[50px] flex-col flex items-center justify-center bg-secondary/50 backdrop-blur border-secondary/10"
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
                onValueCommit={(value) => {
                  settings.update("volume").set(Number(value));
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
                disabled={Object.keys(data.sources).length === 0}
                className="rounded-full bg-secondary/50 backdrop-blur"
                size="icon"
                tabIndex={-1}
              >
                <Settings16Regular />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-secondary/50 backdrop-blur border-secondary/10">
              <DropdownMenuLabel>Quality</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-secondary/40" />
              <DropdownMenuRadioGroup
                value={state.quality}
                onValueChange={handleQuality}
              >
                {Object.entries(data.sources)
                  .reverse()
                  .map(([key, _], i) => {
                    return (
                      <DropdownMenuRadioItem
                        key={i}
                        disabled={Object.keys(data.sources).length === 0}
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
  );
}
