import { useEffect, useState } from "react";

import { Controls } from "./native-controls";
import type { OsType } from "@tauri-apps/plugin-os";
import type { TitlebarProps } from "./types";
import { cn } from "./libs/utils";
import { getOsType } from "./libs/plugin-os";

export function Titlebar({
  children,
  controlsOrder = "platform",
  platform,
  className,
  windowControlsProps,
  ...props
}: TitlebarProps) {
  const [osType, setOsType] = useState<OsType | undefined>(undefined);

  useEffect(() => {
    getOsType().then((type) => {
      setOsType(type);
    });
  }, []);

  if (platform) {
    windowControlsProps = { platform, ...windowControlsProps };
  }

  const left =
    controlsOrder === "left" ||
    (controlsOrder === "platform" &&
      windowControlsProps?.platform === "macos") ||
    (controlsOrder === "system" && osType === "macos");

  const customProps = (ml: string) => {
    if (windowControlsProps?.justify !== undefined) return windowControlsProps;

    const {
      justify: windowControlsJustify,
      className: windowControlsClassName,
      ...restProps
    } = windowControlsProps || {};
    return {
      justify: false,
      className: cn(windowControlsClassName, ml),
      ...restProps,
    };
  };

  return (
    <div
      className={cn(
        "bg-background flex select-none flex-row overflow-hidden",
        className
      )}
      data-tauri-drag-region
      {...props}
    >
      {left ? (
        <>
          <Controls {...customProps("ml-0")} />
          {children}
        </>
      ) : (
        <>
          {children}
          <Controls {...customProps("ml-auto")} />
        </>
      )}
    </div>
  );
}
