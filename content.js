/**
 * Job State Coloring Content Script
 * Colors listings of job postings by their state according to their Equalitymaps color.
 * Handles dynamic content loading, SPA navigation, and mode toggling.
 * Currently supports Indeed, LinkedIn, and ZipRecruiter.
 *
 * Note that the default derived color is the overall policy tally.
 * GenderIdentityTally mode is for folk who need to know the gender identity tally more than overall policy tally.
 * Please also note that while I am using EqualityMap's language such as "Fair policy tally", this does not
 * mean I agree with the assessment of the word "fairness", nor does it necessarily map to the outlook of
 * the people who live in that area.
 *
 */


//============================================================================
// Startup
//============================================================================
console.log("[Equality Compass] Content script loaded");

/**
 * Initial application in case listings already exist on page load.
 * Checks against which website is currently in use.
 * For Indeed, runs the coloring function multiple times due to strange async loading.
 */
if (window.location.href.includes("linkedin.com")){
	applyLinkedinColoring(); 
}
else if (window.location.hostname.includes("indeed.com")) {
	for (let i = 1; i < 5; i++) { // Run this 4 times
		setTimeout(function(){
			applyIndeedColoring();
		}, 2000 * i); // Fires at 2s, 4s, 6s, 8s.
	}
}
else if (window.location.hostname.includes("ziprecruiter.com")) {
	applyZiprecruiterColoring();
}

//============================================================================
// Observer Logic
//============================================================================

/**
 * Locally listen for messages from the background script to reprocess locations when the user changes addon settings.
 * @param msg, the .sendMessage from the background script
 */
browser.runtime.onMessage.addListener((msg) => {
	if (msg.type === "modeChanged") {
		console.log("[Equality Compass] Mode changed — reprocessing all visible spans");
		// Unmark all previously processed spans
		document.querySelectorAll('[data-processed="true"]').forEach(el => {
			el.removeAttribute("data-processed");
		});
		colorHelper(); // Recolor all current locations with new mode
	}
});


/**
 * Persistent MutationObserver that handles all dynamic changes. Terminates when there is no watchable page.
 * Watches the entire document for new nodes that match the job span selector.
 * For ZipRecruiter, this observer has a delay in action to prevent flickering.
 * This is reliable on both LinkedIn's and ZipRecruiter's Single Page Application (SPA) behavior.
 */
const observer = new MutationObserver((mutations) => {
	// NOT LinkedIn and NOT ZipRecruiter
	if (!window.location.href.includes("linkedin") && !window.location.href.includes("ziprecruiter")) {
		observer.disconnect(); // Turn the observer off
		//console.log("[Equality Compass] Disconnecting DOM Observer");
	}
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (!(node instanceof HTMLElement)) continue; // Skip non-element nodes
			if (window.location.href.includes("linkedin")) {
				// Check if the node itself or its descendants match our target linkedin span
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
			} else if (window.location.href.includes("ziprecruiter")){
				// Check if the node itself or its descendants match our target ZipRecruiter span
				const spans = node.matches?.("[data-testid='job-card-location']")
					? [node] 
					: node.querySelectorAll?.("[data-testid='job-card-location']") || []; // Or search inside it
					
				setTimeout(function(){ // Delay to prevent the highlighted span from popping in and out during SPA changes
					spans.forEach(span => { // ZipRecruiter dynamically changes the page multiple times when you click a job
						const parent = span.closest("[data-testid='job-card-location']");
						if (parent && !span.dataset.processed) {
						span.dataset.processed = "true";
						processSpan(span);
						}
					})
				}, 200);
			}
		}
	}
});


// Begin observing the entire body for dynamically injected listings
observer.observe(document.body, {
	childList: true,
	subtree: true
});

//============================================================================
// Selection Logic
//============================================================================

/**
 * Color helper function. Call to color any of the supported areas in the United States.
 * Currently supports: LinkedIn, Indeed, ZipRecruiter.
 */
function colorHelper(){
	if (window.location.href.includes("linkedin.com")){
		applyLinkedinColoring(); 
	}
	else if (window.location.href.includes("indeed.com")){
		applyIndeedColoring();
	}
	else if (window.location.href.includes("ziprecruiter.com")){
		applyZiprecruiterColoring();
	}
}

/**
 * Traverses the provided span and marks it as processed.
 * @param locationSpans, a list of spans to traverse.
 */
function spanWalker(locationSpans) {
	locationSpans.forEach(span => {
		if (!span.dataset.processed) {
			span.dataset.processed = "true";
			processSpan(span);
		}
	});
}


/**
 * Recolors all visible job listing location spans on the page on Indeed.
 * Uses a querySelectorAll to find matching spans.
 */
function applyIndeedColoring() {
	const locationSpans = document.querySelectorAll('div[data-testid="text-location"]');
	spanWalker(locationSpans)
}


/**
 * Recolors all visible job listing location spans on the page on LinkedIn.
 */
function applyLinkedinColoring() {
	let locationSpans = document.querySelectorAll('.artdeco-entity-lockup__caption span[dir="ltr"]'); // Identifier class
	spanWalker(locationSpans)
}


/**
 * Recolors all visible job listing location spans on the page on Ziprecruiter.
 */
function applyZiprecruiterColoring() {
	const locationSpans = document.querySelectorAll("[data-testid='job-card-location'], .company_location"); // Identifier data
	spanWalker(locationSpans)
}

//============================================================================
// Parsing and Coloring logic
//============================================================================

function findFirstMatchingState(span, mode) {
  const states = window.stateScores[mode];

  for (const key of Object.keys(states)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i'); // match whole word, case-insensitive
    const match = span.match(regex);

    if (match) {
      const { colorGrade, score } = states[key];
      return {
        match: match[0],
        index: match.index,
        colorGrade,
        score
      };
    }
  }

  // No match found
  return null;
}



/**
 * Processes a span into a matching state and surrounding text using a regular expression.
 * @param originalText, the text object we are trying to process
 * @return { precedingText , stateCandidate, trailingText }, an object containing the processed location parts.
 */
function processLocation(originalText, mode){
	const states = window.stateScores[mode];
	let stateLocation = 0;
	let stateCandidate = "";
	
	// Sort the keys from stateScores.js to match abbreviations first
	const sortedKeys = Object.keys(states).sort((a, b) => b.length - a.length);
	
	for (const key of sortedKeys) {
		const regex = new RegExp(`\\b${key}\\b`); // match whole word
		const match = originalText.match(regex);
		if (match) {
			stateCandidate = match[0];
			stateLocation = match.index;
		}
	}
	
	// construct the surrounding text
	let reconstructor = originalText;
	const precedingText = reconstructor.slice(0, stateLocation);
	const trailingText = reconstructor.slice(stateLocation + stateCandidate.length);
	
	return { precedingText , stateCandidate, trailingText }
}


/**
 * Highlights a single span element with state coloring based on mode.
 *
 * @param {HTMLElement} span - the span to modify (must contain location text)
 */
async function processSpan(span) {
	// { defaults } = unless { storage is different }
	const { mode = "OverallTally", tooltipsEnabled = true } = await browser.storage.local.get(["mode", "tooltipsEnabled"]);

	// Change object table based on current mode
	const colors = stateScores[mode];

	// Grab the original text and cache it
	const originalText = span.dataset.originalText || span.textContent;
	span.dataset.originalText = originalText;
	
	// Separate our city and state and any trailing information along with it
	const { precedingText , stateCandidate, trailingText } = processLocation(originalText, mode);
	
	// Check if our state is in the score listing
	const entry =
		colors[stateCandidate] || colors[stateCandidate.toUpperCase()];
	if (!entry) return; // Not a match for any known state/territory
	
	// Grab the score and colorGrade from the entry
	const { colorGrade, score } = entry;
	const stateColor = policyColors[colorGrade];

	// Clear and reconstruct the span content
	span.textContent = "";
	
	// Add the leading content
	if (precedingText) {
		span.appendChild(document.createTextNode(precedingText));
	}

	// Add colored and formatted state span element
	const stateSpan = document.createElement("span");
	stateSpan.textContent = stateCandidate;
	stateSpan.style.backgroundColor = stateColor;
	stateSpan.style.borderRadius = "3px";
	stateSpan.style.padding = "0 2px";
	stateSpan.style.color = "white";
	stateSpan.style.outline = "1px solid black"
	span.appendChild(stateSpan);
	
	// Add any remaining trailing info if it exists
	if (trailingText) {
		span.appendChild(document.createTextNode(trailingText))
	}
	
	// Tooltips section
	if (tooltipsEnabled) { // Add a tooltip if enabled (enabled by default)
		const tooltipText = `${stateCandidate} — MAP score: ${score.toFixed(2)}`;
		stateSpan.title = tooltipText;
		stateSpan.dataset.tooltipContent = tooltipText;
		stateSpan.dataset.tooltipApplied = "true";
	}
}