// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[allow(unused_imports)]
use tauri::{
  menu::{Menu, MenuItem},
  window::{Color, Effect, EffectState, EffectsBuilder},
  Manager, WebviewWindow, WindowEvent,
};

#[tauri::command]
async fn open_settings(app: tauri::AppHandle) {
  let _webview_window = tauri::WebviewWindowBuilder::new(
    &app,
    "settings",
    tauri::WebviewUrl::App("/#/settings".into()),
  )
  .title("Settings")
  .center()
  .decorations(false)
  .always_on_top(true)
  .inner_size(400.0, 500.0)
  .build();
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_os::init())
    .invoke_handler(tauri::generate_handler![open_settings])
    .on_window_event(|_window, event| match event {
      WindowEvent::Resized(_e) => {
        std::thread::sleep(std::time::Duration::from_nanos(1));
      }
      _ => {}
    })
    .setup(|app| {
      let main_window = tauri::WebviewWindowBuilder::new(
        app.app_handle(),
        "main",
        tauri::WebviewUrl::App("/".into()),
      )
      .title("Rabbit Hole")
      .resizable(true)
      .decorations(false)
      .transparent(true)
      .inner_size(1000.0, 562.0)
      .min_inner_size(500.0, 300.0)
      .center()
      .effects(
        EffectsBuilder::new()
          .effects([Effect::Mica, Effect::FullScreenUI])
          .build(),
      );

      #[cfg(target_os = "linux")]
      let main_window = main_window.transparent(false);

      main_window.build().unwrap();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
