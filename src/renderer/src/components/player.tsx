import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Fullscreen,
  MoveLeft,
  Pause,
  PictureInPicture2,
  Play,
  Settings,
  StepForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react"
import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import React from "react"
import ReactPlayer from "react-player"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const Qualities = ({ playerRef }) => {
  return <></>
}

let timeout: string | number | NodeJS.Timeout | undefined
export default function Player({
  className = "",
  src,
  ...props
}: {
  className?: string
  src: string
}): React.ReactElement {
  const playerRef = useRef() as MutableRefObject<ReactPlayer>
  const wrapperRef = useRef() as RefObject<HTMLDivElement>
  const controlsRef = useRef() as RefObject<HTMLDivElement>
  const [playing, setPlaying] = useState(true)
  const [showPip, setShowPip] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [playedSeconds, setPlayedSeconds] = useState([0])
  const [volume, setVolume] = useState(100)
  const [highestQuality, setHighestQuality] = useState("")
  const [quality, setQuality] = useState("")

  const transform = {
    "1080p": "fhd",
    "720p": "hd",
    "480p": "sd",
  }

  const handleQuality = (quality: string) => {
    if (/(1080p|720p|480p)/g.test(playerRef.current.getInternalPlayer().src))
      quality = Object.fromEntries(Object.entries(transform).map((a) => a.reverse()))[quality]

    const currentTime = playerRef.current.getCurrentTime()
    playerRef.current.getInternalPlayer().src = playerRef.current
      .getInternalPlayer()
      .src.replace(/(fhd|hd|sd|1080p|720p|480p)/g, quality)
    playerRef.current.seekTo(currentTime)
  }

  const formatTime = (durationSeconds: number) => {
    const hrs = Math.floor(durationSeconds / 3600)
    const mins = Math.floor((durationSeconds % 3600) / 60)
    const secs = Math.floor(durationSeconds % 60)

    let formated = hrs !== 0 ? `${hrs.toString().padStart(2, "0")}:` : ""

    return (formated += `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
  }

  const whenMouseMoves = () => {
    clearTimeout(timeout)
    setShowControls(true)
    timeout = setTimeout(() => {
      setShowControls(false)
      setShowVolume(false)
    }, 3000)
  }

  const handleKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowLeft":
        setPlaying(false)
        playerRef.current.seekTo(Math.floor(playedSeconds[0]) - 5)
        break

      case "ArrowRight":
        setPlaying(false)
        playerRef.current.seekTo(Math.floor(playedSeconds[0]) + 5)
        break

      case "Space":
        whenMouseMoves()
        setPlaying((state) => !state)
        break

      case "Escape":
        window.electron.ipcRenderer.send("fullscreen")
        break

      case "KeyP":
        setShowPip((state) => !state)
        break

      case "KeyV":
        whenMouseMoves()
        setShowVolume((state) => !state)
        break
    }
  }

  return (
    <>
      <div
        className={cn(
          "outline-none relative overflow-hidden flex flex-col justify-center items-center group aspect-video cursor-none data-[enabled=true]:cursor-auto w-full h-full",
          className,
        )}
        tabIndex={0}
        data-enabled={showControls}
        ref={wrapperRef}
        onMouseMove={whenMouseMoves}
        onKeyDown={handleKeys}
      >
        <div
          className="h-full w-full overflow-hidden"
          onClick={(e) => setPlaying((state) => !state)}
        >
          <ReactPlayer
            width="100%"
            height="100%"
            ref={playerRef}
            controls={false}
            volume={Number(volume || 0) / 100}
            playing={playing}
            onEnded={() => setPlaying(false)}
            onProgress={(state) => setPlayedSeconds([state.playedSeconds])}
            onReady={() =>
              highestQuality === "" &&
              setHighestQuality(
                playerRef.current?.getInternalPlayer().src.match(/(fhd|hd|sd|1080p|720p|480p)/g)[0],
              )
            }
            pip={showPip}
            url={src}
          />
        </div>
        <div className="draggable text-white gap-4 transition-all delay-300 -translate-y-80 group-data-[enabled=true]:translate-y-0 bg-gradient-to-t from-transparent to-black/40 items-center w-full flex absolute top-0 mt-auto p-6">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link tabIndex={-1} to={`/episodes?url=${props["data-origin"]}`}>
                    <Button
                      size="icon"
                      className="rounded-full titlebar-actions"
                      variant="secondary"
                      tabIndex={-1}
                    >
                      <MoveLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h2 className="scroll-m-20 text-xl text-white font-extrabold tracking-tight titlebar-actions">
              Episódio {props["data-episode"]}
            </h2>
          </div>
        </div>
        <div
          ref={controlsRef}
          tabIndex={-1}
          className="gap-4 transition-all delay-300 translate-y-80 group-data-[enabled=true]:translate-y-0 bg-gradient-to-b from-transparent to-black/40 items-center w-full flex absolute bottom-0 mt-auto p-6"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full">
              <h2 className="scroll-m-20 border-b pb-2 text-xl text-white border-white font-extrabold tracking-tight first:mt-0">
                {props["data-title"]}
              </h2>
            </div>
            <div className="flex w-full items-center gap-4">
              <Button
                variant="secondary"
                className="rounded-full"
                size="icon"
                onClick={() => setPlaying((state) => !state)}
                data-clickable={true}
                tabIndex={-1}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Link tabIndex={-1} to={props["data-next"]}>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  size="icon"
                  onClick={() => setPlaying((state) => !state)}
                  tabIndex={-1}
                >
                  <StepForward className="w-4 h-4" />
                </Button>
              </Link>

              <small className="text-sm text-white font-medium leading-none">
                {formatTime(playerRef.current?.getCurrentTime() || 0)}
              </small>

              <Slider
                background="bg-white"
                className="flex-1"
                max={playerRef.current?.getDuration() || 0}
                value={playedSeconds}
                onValueChange={(value) => {
                  whenMouseMoves()
                  playerRef.current.seekTo(value[0])
                }}
                onPointerDown={() => {
                  setPlaying(false), whenMouseMoves()
                }}
                onPointerUp={() => setPlaying(true)}
                tabIndex={-1}
              />

              <small className="text-sm text-white font-medium leading-none">
                {formatTime(playerRef.current?.getDuration() || 0)}
              </small>

              <Popover open={showVolume}>
                <PopoverTrigger asChild>
                  <Button
                    onClick={() => setShowVolume((state) => !state)}
                    variant="secondary"
                    className="rounded-full"
                    size="icon"
                    tabIndex={-1}
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : volume < 50 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  onMouseEnter={whenMouseMoves}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  container={controlsRef.current}
                  side="top"
                  className="w-[50px] flex-col flex items-center justify-center"
                >
                  <small className="text-sm font-medium leading-none mb-2">{volume}%</small>
                  <Slider
                    onValueChange={(value) => setVolume(Number(value))}
                    defaultValue={[volume]}
                    max={100}
                    min={0}
                    orientation="vertical"
                    tabIndex={-1}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="secondary"
                className="rounded-full"
                size="icon"
                onClick={() => setShowPip((state) => !state)}
                tabIndex={-1}
              >
                <PictureInPicture2 className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="rounded-full" size="icon" tabIndex={-1}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Quality</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={quality || transform[highestQuality] || highestQuality}
                    onValueChange={(value) => {
                      setQuality(value)
                      handleQuality(value)
                    }}
                  >
                    {[...Array(3)].map((_, i) => {
                      if (["sd", "480p"].includes(highestQuality) && i <= 1) return
                      if (["hd", "720p"].includes(highestQuality) && i === 0) return

                      return (
                        <DropdownMenuRadioItem key={i} value={["fhd", "hd", "sd"][i]}>
                          {["Full HD", "HD", "SD"][i]}
                        </DropdownMenuRadioItem>
                      )
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="secondary"
                className="rounded-full"
                size="icon"
                tabIndex={-1}
                onClick={() => {
                  window.electron.ipcRenderer.send("fullscreen")
                }}
              >
                <Fullscreen className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
