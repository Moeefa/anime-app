import { DEFAULT_SETTINGS, SettingsContext } from "@/contexts/settings-context";
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Effect } from "@tauri-apps/api/window";
import { ProviderContext } from "@/contexts/provider-context";
import { RgbColorPicker } from "react-colorful";
import { Slider } from "@/components/ui/slider";
import { Titlebar } from "@/components/controls";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit } from "@tauri-apps/api/event";
import { resolveTheme } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-provider";
import providers from "@/lib/providers";

export function Settings(): React.ReactElement {
  const { setTheme, theme } = useTheme();
  const { settings, update, clear, state } = useContext(SettingsContext);
  const { status, setStatus } = useContext(ProviderContext);

  const [transparency, setTransparency] = useState(0);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });

  const resolvedTheme = resolveTheme(theme);

  useEffect(() => {
    if (state === "fetching") return;

    settings.transparency &&
      setTransparency(
        settings.transparency?.[resolvedTheme] ||
          (resolvedTheme === "dark"
            ? DEFAULT_SETTINGS.transparency.dark
            : DEFAULT_SETTINGS.transparency.light),
      );

    const background =
      settings.background?.[resolvedTheme] ||
      (resolvedTheme === "dark"
        ? DEFAULT_SETTINGS.background.dark
        : DEFAULT_SETTINGS.background.light);
    background &&
      setColor({
        r: parseInt(background.split(" ")[0]),
        g: parseInt(background.split(" ")[1]),
        b: parseInt(background.split(" ")[2]),
      });
  }, [state]);

  useEffect(() => {
    setTransparency(settings.transparency?.[resolvedTheme] || 0.3);

    setColor({
      r: parseInt(
        settings.background?.[resolvedTheme]?.split(" ")[0] ||
          DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[0],
      ),
      g: parseInt(
        settings.background?.[resolvedTheme]?.split(" ")[1] ||
          DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[1],
      ),
      b: parseInt(
        settings.background?.[resolvedTheme]?.split(" ")[2] ||
          DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[2],
      ),
    });
  }, [theme]);

  return (
    <>
      <div className="dark:bg-zinc-900 bg-zinc-100">
        <Titlebar
          data-tauri-drag-region
          className="bg-transparent h-8 p-0 m-0"
          controlsOrder="platform"
        />
        <div>
          <div className="container space-y-4 pb-8 overflow-auto h-[calc(100vh-2rem)]">
            <SettingItem
              title="Provider"
              description="Choose between providers for a better experience."
            >
              <Select
                value={settings.provider}
                onValueChange={async (value) => {
                  update("provider").set(value);
                  setStatus("fetching");
                  emit("provider-status-set", "fetching");
                  emit("settings-set", settings);
                }}
              >
                <SelectTrigger className="w-[150px] bg-background/30 focus:ring-0 border">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(providers).map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingItem>

            <SettingItem
              title="Theme"
              description="Choose between dark and light theme."
            >
              <Select
                defaultValue={theme}
                onValueChange={(value: "dark" | "light" | "system") => {
                  setTheme(value);
                  emit("theme-set", value);
                }}
              >
                <SelectTrigger className="w-[120px] bg-background/30 focus:ring-0 border">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </SettingItem>

            <SettingItem
              title="Backdrop"
              description="Choose between window backdrops for a comfy effect."
            >
              <Select
                onValueChange={(value) => {
                  WebviewWindow.getAll().map(async (window) => {
                    await window.setEffects({
                      effects: [value as Effect],
                    });
                  });
                }}
              >
                <SelectTrigger className="w-[120px] bg-background/30 focus:ring-0 border">
                  <SelectValue placeholder="Backdrop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Windows</SelectLabel>
                    <SelectItem value="mica">Mica</SelectItem>
                    <SelectItem value="acrylic">Acrylic</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>MacOS</SelectLabel>
                    <SelectItem value="fullScreenUI">FullScreenUI</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SettingItem>

            <SettingItem
              title="Color"
              description="Set the window background color."
            >
              <RgbColorPicker
                color={color}
                onChange={(e) => {
                  setColor(e);
                  update(`background.${resolvedTheme}`).set(
                    `${e.r} ${e.g} ${e.b}`,
                  );
                  emit("settings-set", settings);
                }}
              />
            </SettingItem>

            <SettingItem
              title="Transparency"
              description="Set window background transparency."
            >
              <div className="flex gap-3">
                {(transparency * 100).toFixed(0)}%
                <Slider
                  max={100}
                  defaultValue={[
                    settings.transparency?.[resolvedTheme] ||
                      (resolvedTheme === "dark"
                        ? DEFAULT_SETTINGS.transparency.dark
                        : DEFAULT_SETTINGS.transparency.light) * 100,
                  ]}
                  value={[transparency * 100]}
                  className="w-24"
                  onValueChange={(e) => {
                    setTransparency(e[0] / 100);
                    update(`transparency.${resolvedTheme}`).set(e[0] / 100);
                    emit("settings-set", settings);
                  }}
                />
              </div>
            </SettingItem>

            <SettingItem
              title="Provider status"
              description="Wether the provider is reachable."
            >
              <div>
                {status === "fetching"
                  ? "Checking..."
                  : status === "online"
                    ? "Online"
                    : "Offline"}
              </div>
            </SettingItem>

            <SettingItem title="Erase data" description="Erase all your data.">
              <Button
                className="bg-background/30 text-foreground font-normal border"
                variant="destructive"
                onClick={async () => {
                  clear();
                  setTransparency(
                    resolvedTheme === "dark"
                      ? DEFAULT_SETTINGS.transparency.dark
                      : DEFAULT_SETTINGS.transparency.light,
                  );
                  setColor({
                    r: parseInt(
                      DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[0],
                    ),
                    g: parseInt(
                      DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[1],
                    ),
                    b: parseInt(
                      DEFAULT_SETTINGS.background[resolvedTheme].split(" ")[2],
                    ),
                  });
                  emit("settings-set", DEFAULT_SETTINGS);
                }}
              >
                Erase data
              </Button>
            </SettingItem>
          </div>
        </div>
      </div>
    </>
  );
}

const SettingItem = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <>
      <div className="flex gap-2 justify-between items-center border bg-background/60 dark:bg-background/30 p-6 rounded-md">
        <div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{title}</p>
          <p className="text-sm text-muted-foreground text-pretty">
            {description}
          </p>
        </div>
        {children}
      </div>
    </>
  );
};
