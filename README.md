An user-friendly app that provides a comfy and practice way to watch your animes without a single ad. With a simple and intuitive interface, you can search for your favorite animes and watch them in a simple and practical way.
Built with Tauri, React and TypeScript.

## Building the app
1. Install Rust. (https://www.rust-lang.org/tools/install)
2. You will need Microsoft Visual Studio C++ Build Tools in order to build the app on Windows. Find more details at: https://v2.tauri.app/start/prerequisites/
3. Clone the repository.
4. Install the dependencies:
```bash
pnpm install
```
5. Build the app:
```bash
pnpm tauri build
```

## Providers
The app currently supports the following providers:
- [AnimeFire](https://animefire.plus)
- [AnimePlus](https://animeland.appanimeplus.tk/)

If you want to add more providers, feel free to open a pull request.
You can find the providers in the `src/lib/providers` folder.

### ⚠️ Note: This app doesn't host any content, it just provides a way to watch animes from the providers listed above.
