const toggle = document.getElementById("modeToggle");

browser.storage.local.get("mode").then(({ mode }) => {
  toggle.checked = mode === "Secondary";
});

toggle.addEventListener("change", () => {
  const newMode = toggle.checked ? "Secondary" : "Primary";
  browser.storage.local.set({ mode: newMode }).then(() => {
    // Send message to active tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.id) {
        browser.tabs.sendMessage(tabs[0].id, { type: "modeChanged" });
      }
    });
  });
});
