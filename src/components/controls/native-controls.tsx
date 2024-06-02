import { Gnome, MacOS, Windows } from "./controls";
import { useEffect, useState } from "react";

import type { ControlsProps } from "./types";
import { TauriAppWindowProvider } from "./contexts/plugin-window";
import { cn } from "./libs/utils";
import { getOsType } from "./libs/plugin-os";

export function Controls({
  platform,
  justify = false,
  hide = false,
  hideMethod = "display",
  // linuxDesktop = "gnome",
  className,
  ...props
}: ControlsProps) {
  const [osType, setOsType] = useState<string | undefined>(undefined);

  useEffect(() => {
    getOsType().then((type) => {
      setOsType(type);
    });
  }, []);

  const customClass = cn(
    "flex",
    className,
    hide && (hideMethod === "display" ? "hidden" : "invisible")
  );

  // Determine the default platform based on the operating system if not specified
  if (!platform) {
    switch (osType) {
      case "macos":
        platform = "macos";
        break;
      case "linux":
        platform = "gnome";
        break;
      default:
        platform = "windows";
    }
  }

  const ControlsComponent = () => {
    switch (platform) {
      case "windows":
        return (
          <Windows
            className={cn(customClass, justify && "ml-auto")}
            {...props}
          />
        );
      case "macos":
        return (
          <MacOS className={cn(customClass, justify && "ml-0")} {...props} />
        );
      case "gnome":
        return (
          <Gnome className={cn(customClass, justify && "ml-auto")} {...props} />
        );
      default:
        return (
          <Windows
            className={cn(customClass, justify && "ml-auto")}
            {...props}
          />
        );
    }
  };

  return (
    <TauriAppWindowProvider>
      <ControlsComponent />
    </TauriAppWindowProvider>
  );
}
