use std::sync::{Mutex, MutexGuard};

use discord_rich_presence::{
  activity::{self, Activity, Assets},
  DiscordIpc, DiscordIpcClient,
};

pub struct Discord {
  client: Mutex<DiscordIpcClient>,
}

impl Discord {
  pub fn new() -> Self {
    let discord_client = DiscordIpcClient::new("1203896482659565619")
      .expect("Failed to initialize Discord Ipc Client");

    Self {
      client: Mutex::new(discord_client),
    }
  }

  pub fn connect(&self) {
    let mut client = self.get_client();
    client.connect().unwrap();
  }

  pub fn kill(&self) {
    let mut client = self.get_client();
    let result = client.close();
    result.unwrap();
  }

  pub fn get_client(&self) -> MutexGuard<DiscordIpcClient> {
    self.client.lock().unwrap()
  }

  pub fn change_activity(&self, state: String, details: String, start: i64, end: i64) {
    let mut client = self.get_client();

    let mut timestamps = activity::Timestamps::new().start(start);

    if end != 0 {
      timestamps = activity::Timestamps::new().start(start).end(end);
    }

    if let Err(_) = client.set_activity(
      Activity::new()
        .assets(Assets::new().large_image("icon"))
        .state(state.as_str())
        .details(details.as_str())
        .activity_type(activity::ActivityType::Watching)
        .timestamps(timestamps),
    ) {
      println!("Failed to set activity");
    }
  }
}
