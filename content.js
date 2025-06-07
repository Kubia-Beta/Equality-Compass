/**
 * LinkedIn State Colorizer Content Script
 * Colors listings of LinkedIn job postings by their state according to their equalitymaps color.
 * Handles dynamic content loading, SPA navigation, and mode toggling.
 *
 * Note that the derived color is the overall policy tally, a mix of Sexual Orientation and Gender Identity.
 * Secondary mode is for trans-identifying folk who need to know the gender identity tally more than overall policy.
 * Please also note that while I am using EqualityMap's language such as "Fair policy tally", this does not
 * mean I agree with the assessment of the word "fairness", nor does it necessarily map to the outlook of
 * the people who live in that area.
 * If you are transgender, especially a transgender woman of color, please consider high and medium policy
 * areas in secondary mode only for your safety if possible.
 *
 */
 
console.log("[LinkedIn Colorizer] Content script loaded");

/**
 * Listen for messages from the popup to reprocess listings
 * when the user switches between Primary/Secondary mode.
 */
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "modeChanged") {
	console.log("[LinkedIn Colorizer] Mode changed — reprocessing all visible spans");
	// Unmark all previously processed spans
	document.querySelectorAll('[data-processed="true"]').forEach(el => {
	  el.removeAttribute("data-processed");
	});
	applyColoring(); // Recolor all current listings with new mode
  }
});

// Initial application in case listings already exist on page load
applyColoring();

/**
 * Persistent MutationObserver that handles all dynamic LinkedIn changes.
 * Watches the entire document for new nodes that match the job span selector.
 * This is reliable on LinkedIn's SPA behavior.
 */
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (!(node instanceof HTMLElement)) continue; // Skip non-element nodes

			// Check if the node itself or its descendants match our target span
			const spans = node.matches?.('span[dir="ltr"]')
				? [node] // Node is directly the target span
				: node.querySelectorAll?.('span[dir="ltr"]') || []; // Or search inside it

			spans.forEach(span => {
				// Only handle spans within job location components
				const parent = span.closest('.artdeco-entity-lockup__caption');
				if (parent && !span.dataset.processed) {
				span.dataset.processed = "true"; // Mark as processed
				processSpan(span); // Apply highlighting
				}
			});
		}
	}
});

// Begin observing the entire body for dynamically injected listings
observer.observe(document.body, {
	childList: true,
	subtree: true // Important: LinkedIn deeply injects content
});

/**
 * Recolors all visible job listing location spans on the page.
 * Uses a querySelectorAll to find matching spans that haven't been processed.
 */
async function applyColoring() {
	const spans = document.querySelectorAll('.artdeco-entity-lockup__caption span[dir="ltr"]');
	for (const span of spans) {
		if (!span.dataset.processed) {
		span.dataset.processed = "true";
		await processSpan(span);
		}
	}
}

/**
 * Highlights a single span element with state coloring based on mode.
 *
 * @param {HTMLElement} span - the span to modify (must contain location text)
 */
async function processSpan(span) {
	const { mode = "Primary" } = await browser.storage.local.get("mode");

	const stateScores = { // TODO: Add proper colors and add all the states
  
	// Proper colors from before:
	// Determine the color for a given score based on the policy tally
	//function getColor(score) {
	//	if (score >= 36.75) return 'DarkGreen';		   // High policy tally
	//	if (score >= 24.5) return 'DarkSeaGreen';	   // Medium policy tally
	//	if (score >= 12.25) return 'DarkKhaki';		   // Fair policy tally
	//	if (score >= 0) return 'Coral';				   // Low policy tally
	//	return 'FireBrick';							   // Negative policy tally
	//}
  
	Primary: {
		"California": "#FFCCCC",
		"CA": "#FFCCCC",
		"Texas": "#CCE5FF",
		"TX": "#CCE5FF"
		// TODO: full list
	},
	Secondary: {
		"California": "#CCCCFF",
		"CA": "#CCCCFF",
		"Texas": "#00E5CC",
		"TX": "#00E5CC"
		// TODO: full list
	}
  };

	const colors = stateScores[mode];

	const originalText = span.dataset.originalText || span.textContent.trim();
	span.dataset.originalText = originalText; // Cache the original content

	// Separate trailing info like (Remote), (On-site), etc.
	const parenIndex = originalText.indexOf(" (");
	const trailing = parenIndex !== -1 ? originalText.slice(parenIndex) : "";
	const locationPart = parenIndex !== -1 ? originalText.slice(0, parenIndex) : originalText;

	const parts = locationPart.split(",").map(p => p.trim()); // Split by comma

	let city = null;
	let stateCandidate = null;

	// Handle formats: City, State or State, United States or City, State, United States
	if (parts.length === 3) {
		city = parts[0];
		stateCandidate = parts[1];
	} else if (parts.length === 2) {
		if (parts[1] === "United States") {
			city = null;
			stateCandidate = parts[0];
		} else {
			city = parts[0];
			stateCandidate = parts[1];
		}
	} else {
		return; // Unknown format, skip
	}

	const color = colors[stateCandidate] || colors[stateCandidate.toUpperCase()];
	if (!color) return; // Not a match for any known state/territory

	// Clear and reconstruct the span content
	span.textContent = "";

	// Add city and comma if city exists
	if (city) {
		span.appendChild(document.createTextNode(city + ", "));
	}

	// Add colored state span
	const stateSpan = document.createElement("span");
	stateSpan.textContent = stateCandidate;
	stateSpan.style.backgroundColor = color;
	stateSpan.style.borderRadius = "3px";
	stateSpan.style.padding = "0 2px";
	span.appendChild(stateSpan);

	// Add any remaining trailing info
	if (trailing) {
		span.appendChild(document.createTextNode(trailing));
	}
}
