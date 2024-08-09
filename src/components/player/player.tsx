import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";

import { cn } from "@/lib/utils";
import { useContext, useEffect, useRef, useState } from "react";

import { PlayerContext } from "@/contexts/player-context";
import { invoke } from "@tauri-apps/api/core";
import React from "react";
import ReactPlayer from "react-player/lazy";
import Controls from "./controls";
import LoadingIndicator from "./loading-indicator";
import Titlebar from "./titlebar";

export type PlayerData = {
  sources: Record<string, string>;
  origin: string;
  episode: number;
  title: string;
  next: {
    url: string;
    enabled: boolean;
  };
};

type PlayerProps = {
  className?: string;
  data: PlayerData;
};

const start_time = Date.now();
export default function Player({
  className = "",
  data,
}: PlayerProps): React.ReactElement {
  const { state, update, resetIdleCursor, toggleFullscreen } =
    useContext(PlayerContext);

  const [buffering, setBuffering] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (!data) return;
    if (!playerRef.current) return;

    invoke("update_discord_rpc", {
      details: `Watching ${data.title}`,
      state: `Episode ${data.episode}`,
      start: start_time,
      end: state.playing
        ? Date.now() +
          parseInt(((playerRef.current.getDuration() || 0) * 1000).toString())
        : 0,
    });
  }, [state.duration, state.playing, data, playerRef]);

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
    <div
      className="group"
      data-buffering={buffering || !Object.keys(data.sources).length}
      data-enabled={
        state.controls.main || buffering || !Object.keys(data.sources).length
      }
    >
      <LoadingIndicator />
      <Titlebar data={data} />
      <div
        className={cn(
          "outline-none relative overflow-hidden flex flex-col justify-center items-center aspect-video cursor-none group-data-[enabled=true]:cursor-auto w-full h-full",
          className,
        )}
        tabIndex={0}
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
            volume={(state.volume || 0) / 100}
            onBuffer={() => setBuffering(true)}
            onBufferEnd={() => setBuffering(false)}
            onDuration={(duration) => update("duration").set(duration)}
            onEnded={() => update("playing").set(false)}
            onProgress={({ playedSeconds }) =>
              update("elapsed").set(playedSeconds)
            }
            url={
              Object.keys(data.sources).length === 0
                ? ""
                : Object.keys(data.sources).length === 1
                  ? Object.values(data.sources).at(0)
                  : Object.entries(data.sources)
                      .reverse()
                      .map(([_key, value]) =>
                        new RegExp("^(?:[a-z+]+:)?//", "i").test(value)
                          ? value
                          : import.meta.env.VITE_API_BASE_URL + value,
                      )
            }
          />
        </div>
        <Controls player={playerRef} data={data} />
      </div>
    </div>
  );
}
