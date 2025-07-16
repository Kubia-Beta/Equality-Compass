/**
 * This content drives the logic behind the "popup" or "addon" menu,
 * and is responsible for storing and retrieving relevent addon settings.
 * Triggers background.js listeners when storing local information.
 */
 
//============================================================================
// Mode Logic
//============================================================================
const toggle = document.getElementById("modeToggle");

// Load saved setting from storage
browser.storage.local.get("mode").then(({ mode }) => {
	toggle.checked = mode === "GenderIdentityTally";
});


/**
 * Listen for changes to the OverallTally/GenderIdentityTally toggle. Defaults to OFF.
 * @param toggle, the output of the switch container for which mode to use sent to const "modeToggle"
 */
toggle.addEventListener("change", () => {
	const newMode = toggle.checked ? "GenderIdentityTally" : "OverallTally";
	browser.storage.local.set({ mode: newMode });
});


//============================================================================
// Tooltip logic
//============================================================================
const tooltipToggle = document.getElementById("tooltipToggle");

// Load saved setting from storage
browser.storage.local.get("tooltipsEnabled").then(({ tooltipsEnabled }) => {
	tooltipToggle.checked = tooltipsEnabled !== false; // default is ON
});


/**
 * Listen for changes to the tooltip toggle. Defaults to ON.
 * @param toggle, the output of the switch container for which mode to use sent to const "tooltipToggle"
 */
tooltipToggle.addEventListener("change", () => {
	const enabled = tooltipToggle.checked;
	browser.storage.local.set({ tooltipsEnabled: enabled });
});
