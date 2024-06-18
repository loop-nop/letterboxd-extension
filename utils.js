const SETTINGSVAR = "LBPSettings";

class LBPSettings {
  constructor() {
    this.random = true;
    this.randomMethod = "accurate";
    this.randomAnimation = "none";
    this.randomAnimationTime = 2;
  }
}

class LBPMovie {
  constructor() {
    this.id = -0;
    this.rating = 0.0;
  }
}

class LBPlus {
  constructor() {}

  static getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(SETTINGSVAR, async (o) => {
        let s = new LBPSettings();
        console.log("get: ", o);

        if (o[SETTINGSVAR] == null) {
          this.setSettings(s);
        } else {
          const settings = o[SETTINGSVAR];
          const ek = Object.keys(settings);
          for (const key of ek) {
            if (settings[key] != undefined) {
              s[key] = settings[key];
            }
          }
        }
        // console.debug("resolving: ", s);
        resolve(s);
      });
    });
  }

  static setSettings(settings) {
    chrome.storage.local.set({
      [SETTINGSVAR]: {
        "random": settings.random,
        "randomMethod": settings.randomMethod,
        "randomAnimation": settings.randomAnimation,
        "randomAnimationTime": settings.randomAnimationTime,
      },
    });
    // console.debug("set:", settings);
  }
}
