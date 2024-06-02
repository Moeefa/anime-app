// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[allow(unused_imports)]
use tauri::{
    menu::{Menu, MenuItem},
    window::{Color, Effect, EffectState, EffectsBuilder},
    Manager, WebviewWindow, WindowEvent,
};

#[tauri::command]
fn context_menu(window: WebviewWindow) {
    let manager = window.app_handle();
    let menu = Menu::with_items(
        manager,
        &[
            &MenuItem::with_id(manager, "item1", "Menu Item 1", true, None::<&str>).unwrap(),
            &MenuItem::with_id(manager, "item2", "Menu Item 2", true, None::<&str>).unwrap(),
        ],
    )
    .unwrap();

    window.popup_menu(&menu).unwrap();
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
    // .transparent(true)
    .always_on_top(true)
    .inner_size(400.0, 500.0)
    // .effects(
    //     EffectsBuilder::new()
    //         .effects([Effect::Mica, Effect::FullScreenUI])
    //         .build(),
    // )
    .build();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![context_menu, open_settings])
        .on_window_event(|_window, event| match event {
            WindowEvent::Resized(_e) => {
                std::thread::sleep(std::time::Duration::from_nanos(1));
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
