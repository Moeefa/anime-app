#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod discord;

use discord::Discord;
use lazy_static::lazy_static;
use std::sync::Mutex;

use tauri::window::Effect;
use tauri::window::EffectsBuilder;
use tauri::WindowEvent;

lazy_static! {
  pub static ref DISCORD: Mutex<Discord> = Mutex::new(Discord::new());
}

#[tauri::command]
async fn update_discord_rpc(
  _app: tauri::AppHandle,
  _window: tauri::Window,
  state: String,
  details: String,
  start: i64,
  end: i64,
) {
  DISCORD
    .lock()
    .unwrap()
    .change_activity(state, details, start, end);
}

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
  DISCORD.lock().unwrap().connect();
  tauri::Builder::default()
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_os::init())
    .invoke_handler(tauri::generate_handler![open_settings, update_discord_rpc])
    .on_window_event(|_window, event| match event {
      WindowEvent::Resized(_e) => {
        std::thread::sleep(std::time::Duration::from_nanos(1));
      }
      _ => {}
    })
    .setup(|app| {
      let main_window =
        tauri::WebviewWindowBuilder::new(app.handle(), "main", tauri::WebviewUrl::App("/".into()))
          .title("Rabbit Hole")
          .resizable(true)
          .decorations(false)
          .inner_size(1000.0, 562.0)
          .min_inner_size(500.0, 300.0)
          .center()
          .effects(
            EffectsBuilder::new()
              .effects([Effect::Mica, Effect::FullScreenUI])
              .build(),
          );

      #[cfg(target_os = "windows")]
      let main_window = main_window.transparent(true);

      main_window.build().unwrap();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
