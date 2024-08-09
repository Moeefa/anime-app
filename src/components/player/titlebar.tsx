import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft16Regular } from "@fluentui/react-icons";
import { Link } from "react-router-dom";
import { Titlebar as NativeTitlebar } from "../controls";
import { PlayerData } from "./player";

export default function Titlebar({
  data,
  ...props
}: {
  data: PlayerData;
  [key: string]: any;
}) {
  return (
    <div className="absolute z-50 flex w-full pointer-events-none">
      <NativeTitlebar
        data-tauri-drag-region
        className="bg-transparent h-28 p-0 m-0 w-full group"
        data-enabled={props["data-enabled"]}
        windowControlsProps={{
          className: `z-50 h-8 dark group-data-[enabled=false]:invisible pointer-events-auto`,
        }}
      >
        <div className="absolute z-40 w-full h-8" data-tauri-drag-region></div>
        <div className="absolute flex justify-end top-0 h-28 transition-all delay-300 bg-gradient-to-t to-black/40 from-transparent -translate-y-80 group-data-[enabled=true]:translate-y-0 w-full">
          <div className="text-white gap-4 transition-all delay-300 -translate-y-80 group-data-[enabled=true]:translate-y-0 items-center w-full flex px-6 py-2">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      tabIndex={-1}
                      to={`/episodes?url=${encodeURIComponent(data.origin)}`}
                    >
                      <Button
                        size="icon"
                        className="pointer-events-auto rounded-full titlebar-actions bg-secondary/50 backdrop-blur"
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
                Episode {data.episode}
              </h3>
            </div>
          </div>
        </div>
      </NativeTitlebar>
    </div>
  );
}
