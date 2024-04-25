class Settings {
  constructor() {
    this.random = true;
    this.randomMethod = "accurate";
    this.randomAnimation = "none";
    this.randomAnimationTime = 2;
  }
}

class LBPlus {
  constructor() {}

  static getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get("settings", async (o) => {
        const s = new Settings();
        console.log("get: ", o);

        if (o["settings"] == null) {
          await setSettings(s);
        } else {
          const settings = o["settings"];
          const ek = Object.keys(settings);
          for (const key of ek) {
            if (settings[key] != undefined) {
              s[key] = settings[key];
            }
          }
        }
        resolve(s);
      });
    });
  }

  static async setSettings(settings) {
    await chrome.storage.local.set({
      "settings": {
        "random": settings.random,
        "randomMethod": settings.randomMethod,
        "randomAnimation": settings.randomAnimation,
        "randomAnimationTime": settings.randomAnimationTime,
      },
    });
    console.debug("set:", settings);
  }
}
