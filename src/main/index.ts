import { BrowserWindow, app, ipcMain, nativeTheme, session, shell } from "electron"
import { electronApp, is, optimizer } from "@electron-toolkit/utils"

import { autoUpdater } from "electron-updater"
import icon from "../../resources/icon.png?asset"
import { join } from "path"

function createWindow(): void {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1050,
    height: 590,
    minHeight: 200,
    minWidth: 500,
    show: false,
    frame: ["win32", "darwin"].includes(process.platform),
    autoHideMenuBar: true,
    transparent: false,
    backgroundMaterial: "none",
    titleBarStyle: "hidden",
    icon,
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? "#1e1e1e" : "#ffffff",
      symbolColor: nativeTheme.shouldUseDarkColors ? "#ffffff" : "#1e1e1e",
      height: 30,
    },
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  nativeTheme.on("updated", () => {
    win.setTitleBarOverlay({
      color: nativeTheme.shouldUseDarkColors ? "#1e1e1e" : "#ffffff",
      symbolColor: nativeTheme.shouldUseDarkColors ? "#ffffff" : "#1e1e1e",
      height: 30,
    })
  })

  ipcMain.on("dark-mode:toggle", () => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "light" : "dark"

    return nativeTheme.shouldUseDarkColors
  })

  win.on("ready-to-show", () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  ipcMain.on("fullscreen", () => {
    win.setFullScreen(!win.fullScreen)
  })

  ipcMain.on("addTitleBarOverlay", () => {
    win.setTitleBarOverlay({
      height: 30,
      color: nativeTheme.shouldUseDarkColors ? "#1e1e1e" : "#ffffff",
      symbolColor: nativeTheme.shouldUseDarkColors ? "#ffffff" : "#1e1e1e",
    })
  })

  autoUpdater.on("update-available", () => {
    win.webContents.send("update-available")
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"))
  }

  autoUpdater.checkForUpdates()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron")

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } })
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        ...details.responseHeaders,
      },
    })
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
