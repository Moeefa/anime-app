import {
  Archive16Regular,
  Dismiss32Regular,
  Maximize20Regular,
  ServerLink16Regular,
  Subtract24Regular,
  WeatherMoon16Regular,
} from "@fluentui/react-icons";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import useSWR from "swr";

const Icon = () => (
  <svg
    width="22.5"
    height="22.5"
    viewBox="0 0 32 32"
    fill="none"
    className="dark:fill-white fill-black"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.49 7.18994H20.6C21.39 7.18994 22.03 7.84994 21.99 8.64994C21.96 9.40994 21.31 9.99994 20.55 9.99994H13.51C13.22 9.99994 13 9.71994 13.07 9.42994C13.31 8.43994 14.16 7.67994 15.22 7.59994L20.49 7.18994Z" />
    <path d="M7.62 13.81C7.62 14.2574 7.25735 14.62 6.81 14.62C6.36265 14.62 6 14.2574 6 13.81C6 13.3626 6.36265 13 6.81 13C7.25735 13 7.62 13.3626 7.62 13.81Z" />
    <path d="M10.1791 4.9804L13.92 2.41996C15.08 1.62996 16.66 1.98996 17.36 3.19996C17.578 3.57981 17.6814 3.99459 17.6808 4.40391L20.2533 4.20621L20.2552 4.20606C22.8257 4.00518 25 6.04296 25 8.60006C25 8.89183 24.9714 9.17709 24.9168 9.45319C25.5509 9.16223 26.2564 9.00003 27 9.00003C29.7614 9.00003 32 11.2386 32 14C32 15.7211 31.1312 17.2381 29.8078 18.1375C30.1208 19.619 30.0412 21.1433 29.628 22.567L29.6196 22.596L29.5783 22.7238C29.5504 22.8373 29.5167 22.9354 29.4851 23.0147L28.4085 26.7299L28.394 26.7725C27.5398 29.2908 25.1704 31.0001 22.5 31.0001L12.1151 31L12.1 31H6.03003V29C6.03003 27.5234 6.83557 26.2303 8.03003 25.5373V21.0001H6.92C3.65543 21.0001 1 18.3446 1 15.0801C1 14.2568 1.15459 13.4087 1.49828 12.6101L2.54384 10.0908L2.54872 10.0791C2.59532 9.96728 2.65571 9.82232 2.71897 9.68312C4.01604 6.82749 6.78448 5.24069 9.84722 5.00591L10.1791 4.9804ZM4.54 10.5101C4.49 10.6201 4.44 10.7401 4.39 10.8601L3.34 13.3901C3.11001 13.92 3.00001 14.5 3 15.08C3.12 15.03 3.25 15 3.38 15C3.94 15 4.38 15.45 4.38 16C4.38 16.51 4 16.93 3.5 16.99C3.46063 16.9211 3.42338 16.8508 3.38833 16.7793C4.02295 18.0917 5.36826 19.0001 6.92 19.0001H10.03V27C8.93003 27 8.03003 27.9 8.03003 29H12.1C12.453 29 12.7812 28.8559 13.0186 28.6126C13.1512 28.4767 13.2555 28.3099 13.32 28.12L14.03 26H17.0001C17.0049 24.4873 17.1864 22.9946 17.9856 21.8747C18.8239 20.6999 20.2534 20.0469 22.4844 20.0469C22.7605 20.0469 22.9844 20.2707 22.9844 20.5469C22.9844 20.823 22.7605 21.0469 22.4844 21.0469C20.4497 21.0469 19.387 21.6323 18.7996 22.4555C18.1925 23.3063 18.0052 24.5234 18.0001 26H18.01V26.6901C18.01 26.8601 17.87 27.0001 17.7 27.0001H17C16.4649 27.0001 15.9772 27.213 15.6173 27.5584C15.4819 27.6883 15.3647 27.8369 15.2698 28C15.1479 28.2095 15.063 28.4427 15.0241 28.6907L15.0229 28.6984C15.0078 28.7968 15 28.8976 15 29.0001H22.5C24.31 29.0001 25.92 27.8401 26.5 26.1301L27.6008 22.3315L27.609 22.3131L27.6145 22.3014L27.62 22.29C27.63 22.27 27.64 22.24 27.64 22.22L27.6444 22.2051L27.6505 22.1852L27.7073 22.0096C27.9993 21.0034 28.077 19.9456 27.9176 18.9157C27.8699 18.6073 27.8009 18.3013 27.71 18C27.7 17.9601 27.6875 17.9224 27.675 17.885C27.6625 17.8475 27.65 17.81 27.64 17.77C27.63 17.75 27.62 17.72 27.62 17.7C27.6 17.64 27.58 17.58 27.55 17.52C27.545 17.5051 27.54 17.4924 27.535 17.48C27.53 17.4675 27.525 17.455 27.52 17.44C27.5 17.38 27.48 17.33 27.45 17.27C27.44 17.24 27.43 17.21 27.41 17.19C27.39 17.13 27.36 17.08 27.33 17.03C27.3242 17.0127 27.3184 16.9987 27.3107 16.9841C27.3512 16.98 27.3914 16.975 27.4313 16.9693C27.4881 16.9611 27.5444 16.9513 27.6002 16.94C27.6258 16.9348 27.6513 16.9293 27.6766 16.9234C27.8888 16.8745 28.0924 16.8031 28.2847 16.7118C28.5923 16.5658 28.8711 16.3691 29.1102 16.1324L29.1173 16.1254C29.6625 15.5822 30 14.8305 30 14C30 12.3432 28.6569 11 27 11C26.1723 11 25.423 11.3352 24.8802 11.8772C24.407 12.3497 24.0909 12.9794 24.0167 13.6812C23.7689 13.5626 23.5867 13.4581 23.4311 13.3689C23.0324 13.1402 22.808 13.0116 22.1002 13.0008C22.0679 13.0003 22.0345 13 22 13H16C16 12.3 15.88 11.6301 15.66 11.0001H20.6L20.6122 11C21.9267 10.9934 23 9.91598 23 8.60006C23 7.20006 21.81 6.09006 20.41 6.20006L10 7.00006C7.52 7.19006 5.48 8.44007 4.54 10.5101Z" />
  </svg>
);

export default function Header({
  className,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const [online, setOnline] = React.useState(true);
  const [shouldUseDarkColors, setShouldUseDarkColors] = React.useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const { data, isLoading, error } = useSWR(`${window.api.BASE_URL}`);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => setShouldUseDarkColors(e.matches));

  window.addEventListener("online", () => setOnline((state) => !state));

  return (
    <>
      <header
        className={cn("titlebar z-50 flex justify-between w-full", className)}
      >
        <div className="flex items-center px-[2em]">
          <Icon />
          <Menubar className="ml-4 bg-tranparent border-none shadow-none titlebar-actions h-full">
            <MenubarMenu>
              <MenubarTrigger className="py-0 px-3 focus:bg-transparent focus:text-inherit data-[state=open]:bg-foreground/5">
                Settings
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>
                    <ServerLink16Regular className="mr-2" />
                    Providers
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    {data?.availableSites.map((site: string) => (
                      <MenubarItem
                        key={site}
                        onClick={() => {
                          window.storage.set("settings.provider", site);
                          window.location.replace("/");
                        }}
                      >
                        {site}
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem
                  onClick={() => {
                    window.storage.remove("recents.episodes");
                    window.location.reload();
                  }}
                >
                  <Archive16Regular className="mr-2" />
                  Clear History
                </MenubarItem>
                <MenubarSeparator />
                <MenubarCheckboxItem
                  checked={shouldUseDarkColors}
                  onClick={async () =>
                    setShouldUseDarkColors(
                      await window.electron.ipcRenderer.invoke(
                        "dark-mode:toggle"
                      )
                    )
                  }
                >
                  <WeatherMoon16Regular className="mr-2" />
                  Dark Theme
                </MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="flex items-center min-w-1">
          <p className="cursor-default select-none items-center rounded-sm text-sm font-medium outline-none">
            {!online ? "Offline" : ""}
          </p>
        </div>
        <div
          data-show={window.electron.process.platform === "win32"}
          className="data-[show=true]:flex data-[show=false]:hidden titlebar-actions items-center justify-center w-[var(--windows-buttons-width)]"
        >
          <Button
            tabIndex={-1}
            onClick={() => window.electron.ipcRenderer.send("minimize")}
            className="focus-visible:ring-0 w-[46px] transition-none duration-0 delay-0 h-[var(--titlebar-height)] hover:text-black dark:hover:text-white text-black dark:text-white cursor-default hover:bg-foreground/5 shadow-none rounded-none bg-transparent"
          >
            <svg
              viewBox="0 0 24 25"
              fill="currentColor"
              className="___12fm75w_v8ls9a0 f1w7gpdv fez10in fg4l7m0"
              aria-hidden="true"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.75 12.5h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z"
                fill="currentColor"
              ></path>
            </svg>
          </Button>
          <Button
            tabIndex={-1}
            disabled
            onClick={() => window.electron.ipcRenderer.send("maximize")}
            className="focus-visible:ring-0 w-[46px] transition-none duration-0 delay-0 h-[var(--titlebar-height)] hover:text-black dark:hover:text-white text-black dark:text-white cursor-default hover:bg-foreground/5 shadow-none rounded-none bg-transparent"
          >
            <svg
              fill="currentColor"
              className="___12fm75w_v8ls9a0 f1w7gpdv fez10in fg4l7m0"
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5Z"
                fill="currentColor"
              ></path>
            </svg>
          </Button>
          <Button
            tabIndex={-1}
            onClick={() => window.electron.ipcRenderer.send("close")}
            className="focus-visible:ring-0 w-[46px] transition-none duration-0 delay-0 h-[var(--titlebar-height)] text-black dark:text-white cursor-default hover:bg-red-600 hover:text-white shadow-none rounded-none bg-transparent"
          >
            <svg
              fill="currentColor"
              className="___12fm75w_v8ls9a0 f1w7gpdv fez10in fg4l7m0"
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.29 4.3a1 1 0 1 1 1.41 1.4L17.41 16l10.3 10.29a1 1 0 1 1-1.42 1.41l-10.3-10.29-10.28 10.3a1 1 0 0 1-1.42-1.42l10.3-10.3L4.28 5.72a1 1 0 0 1 1.42-1.42L16 14.6l10.29-10.3Z"
                fill="currentColor"
              ></path>
            </svg>
          </Button>
        </div>
      </header>
    </>
  );
}
