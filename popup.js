/**
 * This content drives the logic behind the "popup" or "addon" menu.
 * Stores and retrieves relevent addon settings and pushes those settings to content.js.
 */

// Gender Identity Toggle //
const toggle = document.getElementById("modeToggle");

// Load saved setting from storage
browser.storage.local.get("mode").then(({ mode }) => {
	toggle.checked = mode === "Secondary";
});

// Listen for changes to the Aggregate/GI toggle
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


// Tooltip Toggle
const tooltipToggle = document.getElementById("tooltipToggle");

// Load saved setting from storage
browser.storage.local.get("tooltipsEnabled").then(({ tooltipsEnabled }) => {
	tooltipToggle.checked = tooltipsEnabled !== false; // default is ON
});

// Listen for changes to the tooltip toggle
tooltipToggle.addEventListener("change", () => {
	const enabled = tooltipToggle.checked;
	browser.storage.local.set({ tooltipsEnabled: enabled }).then(() => {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			if (tabs[0]?.id) {
			browser.tabs.sendMessage(tabs[0].id, {
				type: "tooltipChanged",
				enabled
				});
			}
		});
	});
});
