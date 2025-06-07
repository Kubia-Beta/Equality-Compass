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

	const stateScores = {
	// Minified versions. Human readable format is in stateScores.js.
	Primary: {"Alabama":{"color":"rgba(178, 34, 34, 0.5)","score":-10.5},"Alaska":{"color":"rgba(255, 127, 80, 0.65)","score":8.25},"American Samoa":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"Arizona":{"color":"rgba(255, 127, 80, 0.65)","score":7.5},"Arkansas":{"color":"rgba(178, 34, 34, 0.5)","score":-12.25},"California":{"color":"rgba(0, 100, 0, 0.5)","score":45.0},"Colorado":{"color":"rgba(0, 100, 0, 0.5)","score":45.25},"Connecticut":{"color":"rgba(0, 100, 0, 0.5)","score":40.75},"Delaware":{"color":"rgba(143, 188, 143, 0.75)","score":30.25},"District of Columbia":{"color":"rgba(0, 100, 0, 0.5)","score":40.75},"Florida":{"color":"rgba(178, 34, 34, 0.5)","score":-3.0},"Georgia":{"color":"rgba(178, 34, 34, 0.5)","score":-1.0},"Guam":{"color":"rgba(255, 127, 80, 0.65)","score":4.75},"Hawaii":{"color":"rgba(143, 188, 143, 0.75)","score":31.25},"Idaho":{"color":"rgba(178, 34, 34, 0.5)","score":-9.5},"Illinois":{"color":"rgba(0, 100, 0, 0.5)","score":43.0},"Indiana":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75},"Iowa":{"color":"rgba(255, 127, 80, 0.65)","score":6.5},"Kansas":{"color":"rgba(255, 127, 80, 0.65)","score":0.5},"Kentucky":{"color":"rgba(255, 127, 80, 0.65)","score":5.0},"Louisiana":{"color":"rgba(178, 34, 34, 0.5)","score":-6.75},"Maine":{"color":"rgba(0, 100, 0, 0.5)","score":44.5},"Maryland":{"color":"rgba(0, 100, 0, 0.5)","score":42.0},"Massachusetts":{"color":"rgba(0, 100, 0, 0.5)","score":39},"Michigan":{"color":"rgba(143, 188, 143, 0.75)","score":30},"Minnesota":{"color":"rgba(0, 100, 0, 0.5)","score":36.75},"Mississippi":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"Missouri":{"color":"rgba(178, 34, 34, 0.5)","score":-1.5},"Montana":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75},"Nebraska":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"Nevada":{"color":"rgba(0, 100, 0, 0.5)","score":41.25},"New Hampshire":{"color":"rgba(143, 188, 143, 0.75)","score":32.5},"New Jersey":{"color":"rgba(0, 100, 0, 0.5)","score":41.75},"New Mexico":{"color":"rgba(143, 188, 143, 0.75)","score":36.0},"New York":{"color":"rgba(0, 100, 0, 0.5)","score":44.5},"North Carolina":{"color":"rgba(255, 127, 80, 0.65)","score":7.25},"North Dakota":{"color":"rgba(255, 127, 80, 0.65)","score":9.5},"Northern Mariana Islands":{"color":"rgba(255, 127, 80, 0.65)","score":2.75},"Ohio":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"Oklahoma":{"color":"rgba(178, 34, 34, 0.5)","score":-5.0},"Oregon":{"color":"rgba(0, 100, 0, 0.5)","score":37.5},"Pennsylvania":{"color":"rgba(189, 183, 107, 0.75)","score":16.75},"Puerto Rico":{"color":"rgba(189, 183, 107, 0.75)","score":19.75},"Rhode Island":{"color":"rgba(0, 100, 0, 0.5)","score":38.0},"South Carolina":{"color":"rgba(178, 34, 34, 0.5)","score":-7.75},"South Dakota":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"Tennessee":{"color":"rgba(178, 34, 34, 0.5)","score":-14.0},"Texas":{"color":"rgba(178, 34, 34, 0.5)","score":-1.75},"U.S. Virgin Islands":{"color":"rgba(189, 183, 107, 0.75)","score":13.5},"Utah":{"color":"rgba(255, 127, 80, 0.65)","score":10.0},"Vermont":{"color":"rgba(0, 100, 0, 0.5)","score":38.5},"Virginia":{"color":"rgba(143, 188, 143, 0.75)","score":24.5},"Washington":{"color":"rgba(0, 100, 0, 0.5)","score":40.25},"West Virginia":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"Wisconsin":{"color":"rgba(189, 183, 107, 0.75)","score":17.75},"Wyoming":{"color":"rgba(178, 34, 34, 0.5)","score":-6.0},"AL":{"color":"rgba(178, 34, 34, 0.5)","score":-10.5},"AK":{"color":"rgba(255, 127, 80, 0.65)","score":8.25},"AS":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"AZ":{"color":"rgba(255, 127, 80, 0.65)","score":7.5},"AR":{"color":"rgba(178, 34, 34, 0.5)","score":-12.25},"CA":{"color":"rgba(0, 100, 0, 0.5)","score":45.0},"CO":{"color":"rgba(0, 100, 0, 0.5)","score":45.25},"CT":{"color":"rgba(0, 100, 0, 0.5)","score":40.75},"DE":{"color":"rgba(143, 188, 143, 0.75)","score":30.25},"DC":{"color":"rgba(0, 100, 0, 0.5)","score":40.75},"FL":{"color":"rgba(178, 34, 34, 0.5)","score":-3.0},"GA":{"color":"rgba(178, 34, 34, 0.5)","score":-1.0},"GU":{"color":"rgba(255, 127, 80, 0.65)","score":4.75},"HI":{"color":"rgba(143, 188, 143, 0.75)","score":31.25},"ID":{"color":"rgba(178, 34, 34, 0.5)","score":-9.5},"IL":{"color":"rgba(0, 100, 0, 0.5)","score":43.0},"IN":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75},"IA":{"color":"rgba(255, 127, 80, 0.65)","score":6.5},"KS":{"color":"rgba(255, 127, 80, 0.65)","score":0.5},"KY":{"color":"rgba(255, 127, 80, 0.65)","score":5.0},"LA":{"color":"rgba(178, 34, 34, 0.5)","score":-6.75},"ME":{"color":"rgba(0, 100, 0, 0.5)","score":44.5},"MD":{"color":"rgba(0, 100, 0, 0.5)","score":42.0},"MA":{"color":"rgba(0, 100, 0, 0.5)","score":39},"MI":{"color":"rgba(143, 188, 143, 0.75)","score":30},"MN":{"color":"rgba(0, 100, 0, 0.5)","score":36.75},"MS":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"MO":{"color":"rgba(178, 34, 34, 0.5)","score":-1.5},"MT":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75},"NE":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"NV":{"color":"rgba(0, 100, 0, 0.5)","score":41.25},"NH":{"color":"rgba(143, 188, 143, 0.75)","score":32.5},"NJ":{"color":"rgba(0, 100, 0, 0.5)","score":41.75},"NM":{"color":"rgba(143, 188, 143, 0.75)","score":36.0},"NY":{"color":"rgba(0, 100, 0, 0.5)","score":44.5},"NC":{"color":"rgba(255, 127, 80, 0.65)","score":7.25},"ND":{"color":"rgba(255, 127, 80, 0.65)","score":9.5},"MP":{"color":"rgba(255, 127, 80, 0.65)","score":2.75},"OH":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"OK":{"color":"rgba(178, 34, 34, 0.5)","score":-5.0},"OR":{"color":"rgba(0, 100, 0, 0.5)","score":37.5},"PA":{"color":"rgba(189, 183, 107, 0.75)","score":16.75},"PR":{"color":"rgba(189, 183, 107, 0.75)","score":19.75},"RI":{"color":"rgba(0, 100, 0, 0.5)","score":38.0},"SC":{"color":"rgba(178, 34, 34, 0.5)","score":-7.75},"SD":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"TN":{"color":"rgba(178, 34, 34, 0.5)","score":-14.0},"TX":{"color":"rgba(178, 34, 34, 0.5)","score":-1.75},"VI":{"color":"rgba(189, 183, 107, 0.75)","score":13.5},"UT":{"color":"rgba(255, 127, 80, 0.65)","score":10.0},"VT":{"color":"rgba(0, 100, 0, 0.5)","score":38.5},"VA":{"color":"rgba(143, 188, 143, 0.75)","score":24.5},"WA":{"color":"rgba(0, 100, 0, 0.5)","score":40.25},"WV":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"WI":{"color":"rgba(189, 183, 107, 0.75)","score":17.75},"WY":{"color":"rgba(178, 34, 34, 0.5)","score":-6.0}},
	Secondary: {"Alabama":{"color":"rgba(178, 34, 34, 0.5)","score":-7.75},"Alaska":{"color":"rgba(255, 127, 80, 0.65)","score":4.25},"American Samoa":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"Arizona":{"color":"rgba(178, 34, 34, 0.5)","score":-0.25},"Arkansas":{"color":"rgba(178, 34, 34, 0.5)","score":-8.25},"California":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"Colorado":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"Connecticut":{"color":"rgba(0, 100, 0, 0.5)","score":22.25},"Delaware":{"color":"rgba(143, 188, 143, 0.75)","score":16.5},"District of Columbia":{"color":"rgba(0, 100, 0, 0.5)","score":22.5},"Florida":{"color":"rgba(178, 34, 34, 0.5)","score":-6.25},"Georgia":{"color":"rgba(178, 34, 34, 0.5)","score":-1.0},"Guam":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"Hawaii":{"color":"rgba(143, 188, 143, 0.75)","score":17.75},"Idaho":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"Illinois":{"color":"rgba(0, 100, 0, 0.5)","score":22.5},"Indiana":{"color":"rgba(178, 34, 34, 0.5)","score":-3.75},"Iowa":{"color":"rgba(255, 127, 80, 0.65)","score":3.0},"Kansas":{"color":"rgba(178, 34, 34, 0.5)","score":-1.75},"Kentucky":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"Louisiana":{"color":"rgba(178, 34, 34, 0.5)","score":-7.25},"Maine":{"color":"rgba(0, 100, 0, 0.5)","score":23.5},"Maryland":{"color":"rgba(0, 100, 0, 0.5)","score":22.75},"Massachusetts":{"color":"rgba(0, 100, 0, 0.5)","score":20.25},"Michigan":{"color":"rgba(143, 188, 143, 0.75)","score":14.0},"Minnesota":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"Mississippi":{"color":"rgba(178, 34, 34, 0.5)","score":-6.0},"Missouri":{"color":"rgba(178, 34, 34, 0.5)","score":-5.5},"Montana":{"color":"rgba(178, 34, 34, 0.5)","score":-4.0},"Nebraska":{"color":"rgba(178, 34, 34, 0.5)","score":-2.25},"Nevada":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"New Hampshire":{"color":"rgba(143, 188, 143, 0.75)","score":15.0},"New Jersey":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"New Mexico":{"color":"rgba(143, 188, 143, 0.75)","score":19.0},"New York":{"color":"rgba(0, 100, 0, 0.5)","score":24.0},"North Carolina":{"color":"rgba(255, 127, 80, 0.65)","score":2.0},"North Dakota":{"color":"rgba(255, 127, 80, 0.65)","score":0.75},"Northern Mariana Islands":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"Ohio":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"Oklahoma":{"color":"rgba(178, 34, 34, 0.5)","score":-6.5},"Oregon":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"Pennsylvania":{"color":"rgba(189, 183, 107, 0.75)","score":10.5},"Puerto Rico":{"color":"rgba(189, 183, 107, 0.75)","score":10.5},"Rhode Island":{"color":"rgba(0, 100, 0, 0.5)","score":20.25},"South Carolina":{"color":"rgba(178, 34, 34, 0.5)","score":-8.25},"South Dakota":{"color":"rgba(178, 34, 34, 0.5)","score":-5.0},"Tennessee":{"color":"rgba(178, 34, 34, 0.5)","score":-11.25},"Texas":{"color":"rgba(178, 34, 34, 0.5)","score":-3.75},"U.S. Virgin Islands":{"color":"rgba(255, 127, 80, 0.65)","score":4.75},"Utah":{"color":"rgba(255, 127, 80, 0.65)","score":1.75},"Vermont":{"color":"rgba(0, 100, 0, 0.5)","score":20.5},"Virginia":{"color":"rgba(143, 188, 143, 0.75)","score":14.5},"Washington":{"color":"rgba(0, 100, 0, 0.5)","score":22.0},"West Virginia":{"color":"rgba(255, 127, 80, 0.65)","score":1.0},"Wisconsin":{"color":"rgba(255, 127, 80, 0.65)","score":5.5},"Wyoming":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75},"AL":{"color":"rgba(178, 34, 34, 0.5)","score":-7.75},"AK":{"color":"rgba(255, 127, 80, 0.65)","score":4.25},"AS":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"AZ":{"color":"rgba(178, 34, 34, 0.5)","score":-0.25},"AR":{"color":"rgba(178, 34, 34, 0.5)","score":-8.25},"CA":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"CO":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"CT":{"color":"rgba(0, 100, 0, 0.5)","score":22.25},"DE":{"color":"rgba(143, 188, 143, 0.75)","score":16.5},"DC":{"color":"rgba(0, 100, 0, 0.5)","score":22.5},"FL":{"color":"rgba(178, 34, 34, 0.5)","score":-6.25},"GA":{"color":"rgba(178, 34, 34, 0.5)","score":-1.0},"GU":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"HI":{"color":"rgba(143, 188, 143, 0.75)","score":17.75},"ID":{"color":"rgba(178, 34, 34, 0.5)","score":-7.5},"IL":{"color":"rgba(0, 100, 0, 0.5)","score":22.5},"IN":{"color":"rgba(178, 34, 34, 0.5)","score":-3.75},"IA":{"color":"rgba(255, 127, 80, 0.65)","score":3.0},"KS":{"color":"rgba(178, 34, 34, 0.5)","score":-1.75},"KY":{"color":"rgba(255, 127, 80, 0.65)","score":0.0},"LA":{"color":"rgba(178, 34, 34, 0.5)","score":-7.25},"ME":{"color":"rgba(0, 100, 0, 0.5)","score":23.5},"MD":{"color":"rgba(0, 100, 0, 0.5)","score":22.75},"MA":{"color":"rgba(0, 100, 0, 0.5)","score":20.25},"MI":{"color":"rgba(143, 188, 143, 0.75)","score":14.0},"MN":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"MS":{"color":"rgba(178, 34, 34, 0.5)","score":-6.0},"MO":{"color":"rgba(178, 34, 34, 0.5)","score":-5.5},"MT":{"color":"rgba(178, 34, 34, 0.5)","score":-4.0},"NE":{"color":"rgba(178, 34, 34, 0.5)","score":-2.25},"NV":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"NH":{"color":"rgba(143, 188, 143, 0.75)","score":15.0},"NJ":{"color":"rgba(0, 100, 0, 0.5)","score":23.25},"NM":{"color":"rgba(143, 188, 143, 0.75)","score":19.0},"NY":{"color":"rgba(0, 100, 0, 0.5)","score":24.0},"NC":{"color":"rgba(255, 127, 80, 0.65)","score":2.0},"ND":{"color":"rgba(255, 127, 80, 0.65)","score":0.75},"MP":{"color":"rgba(178, 34, 34, 0.5)","score":-0.75},"OH":{"color":"rgba(255, 127, 80, 0.65)","score":2.25},"OK":{"color":"rgba(178, 34, 34, 0.5)","score":-6.5},"OR":{"color":"rgba(0, 100, 0, 0.5)","score":21.0},"PA":{"color":"rgba(189, 183, 107, 0.75)","score":10.5},"PR":{"color":"rgba(189, 183, 107, 0.75)","score":10.5},"RI":{"color":"rgba(0, 100, 0, 0.5)","score":20.25},"SC":{"color":"rgba(178, 34, 34, 0.5)","score":-8.25},"SD":{"color":"rgba(178, 34, 34, 0.5)","score":-5.0},"TN":{"color":"rgba(178, 34, 34, 0.5)","score":-11.25},"TX":{"color":"rgba(178, 34, 34, 0.5)","score":-3.75},"VI":{"color":"rgba(255, 127, 80, 0.65)","score":4.75},"UT":{"color":"rgba(255, 127, 80, 0.65)","score":1.75},"VT":{"color":"rgba(0, 100, 0, 0.5)","score":20.5},"VA":{"color":"rgba(143, 188, 143, 0.75)","score":14.5},"WA":{"color":"rgba(0, 100, 0, 0.5)","score":22.0},"WV":{"color":"rgba(255, 127, 80, 0.65)","score":1.0},"WI":{"color":"rgba(255, 127, 80, 0.65)","score":5.5},"WY":{"color":"rgba(178, 34, 34, 0.5)","score":-2.75}}
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
	
	// TODO: Replace const color with a tuple version - prereq, tuple data structure
	// REPLACE WITH THIS:
	const entry =
		colors[stateCandidate] || colors[stateCandidate.toUpperCase()];
	if (!entry) return; // Not a match for any known state/territory
	
	const { color, score } = entry;

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
	stateSpan.style.color = "white";
	stateSpan.style.outline = "1px solid black"
	span.appendChild(stateSpan);
	stateSpan.title = `${stateCandidate} — MAP score: ${score.toFixed(2)}`;

	// Add any remaining trailing info
	if (trailing) {
		span.appendChild(document.createTextNode(trailing));
	}
}
