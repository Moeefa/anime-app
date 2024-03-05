import {
  BrowserWindow,
  app,
  ipcMain,
  nativeTheme,
  session,
  shell,
} from "electron";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";

import DiscordRPC from "discord-rpc";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import icon from "../../resources/icon.png?asset";
import { join } from "path";

const store = new Store({
  accessPropertiesByDotNotation: true,
});

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1056,
    height: 594,
    minHeight: 200,
    minWidth: 500,
    title: "Rabbit Hole",
    show: false,
    frame: ["win32", "darwin"].includes(process.platform),
    autoHideMenuBar: true,
    transparent: false,
    maximizable: false,
    useContentSize: true,
    backgroundMaterial: "mica",
    vibrancy: "appearance-based",
    titleBarStyle: process.platform === "win32" ? "hidden" : "default",
    icon,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const rpc = new DiscordRPC.Client({ transport: "ipc" });

  rpc
    .login({ clientId: import.meta.env.MAIN_VITE_CLIENT_ID })
    .catch(() => console.error("RPC failed to login"));

  ipcMain.handle("dark-mode:toggle", () => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors
      ? "light"
      : "dark";

    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("maximize", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close", () => {
    win.close();
  });

  ipcMain.on("discord:rpc", (_, presence) => {
    rpc
      .setActivity(presence)
      .catch(() => console.error("RPC failed to set activity"));
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  ipcMain.on("fullscreen", () => {
    win.setFullScreen(!win.fullScreen);
  });

  ipcMain.on("addTitleBarOverlay", () => {
    win.setTitleBarOverlay({
      height: 30,
      color: nativeTheme.shouldUseDarkColors ? "#1e1e1e" : "#ffffff",
      symbolColor: nativeTheme.shouldUseDarkColors ? "#ffffff" : "#1e1e1e",
    });
  });

  ipcMain.on("setStorage", (_, key, value) => {
    store.set(key, value);
  });

  ipcMain.on("getStorage", (event, key) => {
    event.returnValue = store.get(key);
  });

  ipcMain.on("removeStorage", (_, key) => {
    store.delete(key);
  });

  ipcMain.on("clearStorage", () => {
    store.clear();
  });

  autoUpdater.on("update-available", () => {
    win.webContents.send("update-available");
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  autoUpdater.checkForUpdates();

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        ...details.responseHeaders,
      },
    });
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
