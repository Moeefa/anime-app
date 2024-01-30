import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      URL: string
      SITE: "AnimeFire" | "AnimesOnline"
    }
  }
}
