/**
 * Job State Coloring Content Script
 * Colors listings of job postings by their state according to their equalitymaps color.
 * Handles dynamic content loading, SPA navigation, and mode toggling.
 * Currently supports Indeed, LinkedIn, and ZipRecruiter.
 *
 * Note that the derived color is the overall policy tally, a mix of Sexual Orientation and Gender Identity.
 * Secondary mode is for trans-identifying folk who need to know the gender identity tally more than overall policy.
 * Please also note that while I am using EqualityMap's language such as "Fair policy tally", this does not
 * mean I agree with the assessment of the word "fairness", nor does it necessarily map to the outlook of
 * the people who live in that area.
 *
 */


// Startup
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
	for (var i = 1; i < 5; i++) { // Run this 4 times
		setTimeout(function(){
			applyIndeedColoring();
		}, 2000 * i); // Fires at 2s, 4s, 6s, 8s.
	}
}
else if (window.location.hostname.includes("ziprecruiter.com")) {
	applyZiprecruiterColoring();
}


/**
 * Listen for messages from the popup to reprocess listings when the user changes addon settings.
 * Settings: Primary/Gender Identity mode, Tooltips on/off.
 */
browser.runtime.onMessage.addListener((msg) => {
	if (msg.type === "modeChanged") {
		console.log("[Equality Compass] Mode changed — reprocessing all visible spans");
		// Unmark all previously processed spans
		document.querySelectorAll('[data-processed="true"]').forEach(el => {
			el.removeAttribute("data-processed");
		});
		colorHelper(); // Recolor all current listings with new mode
	}
	else if (msg.type === "tooltipChanged"){
		console.log("[Equality Compass] Tooltips changed — reprocessing all visible spans");
		document.querySelectorAll('[data-processed="true"]').forEach(el => {
			el.removeAttribute("data-processed");
		});
		colorHelper(); // Reprocess all current listings
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
	subtree: true // Important: LinkedIn deeply injects content
});


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
 * Recolors all visible job listing location spans on the page on Indeed.
 * Uses a querySelectorAll to find matching spans that haven't been processed.
 */
function applyIndeedColoring() {
  const locationSpans = document.querySelectorAll('div[data-testid="text-location"]'); // Identifier div
  locationSpans.forEach(span => {
    if (!span.dataset.processed) { // A for loop fails here
      span.dataset.processed = "true";
      processSpan(span);
    }
  });
}


/**
 * Recolors all visible job listing location spans on the page on LinkedIn.
 */
async function applyLinkedinColoring() {
	const locationSpans = document.querySelectorAll('.artdeco-entity-lockup__caption span[dir="ltr"]'); // Identifier class
	for (const span of locationSpans) {
		if (!span.dataset.processed) {
		span.dataset.processed = "true";
		await processSpan(span);
		}
	}
}


/**
 * Recolors all visible job listing location spans on the page on Ziprecruiter.
 */
async function applyZiprecruiterColoring() {
	const locationSpans = document.querySelectorAll("[data-testid='job-card-location']"); // Identifier data
	for (const span of locationSpans) {
		if (!span.dataset.processed) {
		span.dataset.processed = "true";
		//console.log("[Equality Compass] Processing span " + span);
		await processSpan(span);
		}
	}
}


/**
 * Processes the text of a location into relevant city and state parts.
 * @param originalText, the text object we are trying to process
 * @return { city , state , trailing }, an object containing the processed location parts.
 */
function processLocation(originalText){
	// Separate trailing info like (Remote), (On-site), etc.
	const parenIndex = originalText.indexOf(" (");
	// Ternary / if/else 
	// Check where the parenthesis are and assign it
	const locationPart = parenIndex !== -1 ? originalText.slice(0, parenIndex) : originalText;
	

	const parts = locationPart.split(",").map(p => p.trim()); // Split by comma


	let city = null;
	let stateCandidate = null;

	// Handle formats: City, State or State, United States or City, State, United States
	if (parts.length === 3) {
		// ex. Remote in, Remote from, etc.
		if (parts[0] === "Remote") { 
			city = null;
			stateCandidate = parts [2]
		}
		else if (parts[2] === "USA" || parts[2] === "United States") { // city, state, USA
			stateCandidate = parts[1];
			city = parts[1];
		}
		else { // Phoenix, AZ, U.S.
			city = parts[0];
			stateCandidate = parts[1];
		}
		
	}
	else if (parts.length === 2) {
		if (parts[1] === "United States"
			|| parts[1] === "US"
			|| parts[1] === "U.S.") 
			{ // ex. Nevada, United States
			city = null;
			stateCandidate = parts[0];
		}
		else if (/\d/.test(parts[1])){ // has numeric, so city, state zip
			// Find where the zip begins
			const zipIndex = parts[1].search(/[0-9]/);
			// Assign the state without the leading whitespace before the zip
			stateCandidate = parts[1].substring(0, (zipIndex - 1));
			city = parts[0];
		}
		else { // ex. Phoenix, Arizona
			city = parts[0];
			stateCandidate = parts[1];
		}
	}
	else if (parts.length === 1) { // Handle cases for "remote in X", "hybrid work in X"
		// split into substring by space
		const spaceParts = locationPart.split(" ").map(p => p.trim()); // Split by space
		const testSubstring = spaceParts[spaceParts.length - 2]; // Access the second to last substring
		const validSingleSpaceLocations = ["new", "north", "rhode", "south", "west", "american", "puerto"];
		const validDoubleSpaceLocations = ["mariana", "virgin"];
		
		if (validSingleSpaceLocations.includes(testSubstring)) {
			// ex. puerto + " " rico, stateCandidate = "Puerto Rico"
			stateCandidate = spaceParts[spaceParts.length - 2] + " " + spaceParts[spaceParts.length - 1];
		}
		else if (validDoubleSpaceLocations.includes(testSubstring)) {
			// ex. "U.S. Virgin Islands"
			stateCandidate = spaceParts[spaceParts.length - 3] + " " + 
			spaceParts[spaceParts.length - 2] + " " + spaceParts[spaceParts.length - 1];
		}
		else { // Remote in 
			stateCandidate = spaceParts[spaceParts.length - 1];
		}
	} // FIXME: parts.length === 1 seems to wipe out the "remote in". Trailing data is saved, preceeding data is not
	// Seems to be a problem in general. Might need to change trailing to "other data" and define it as the subtraction
	// of the original text and the text we want to parse
	else {
		city = null;
		stateCandidate = parts[0];
	}
	
	// construct the surrounding text
	let reconstructor = originalText;
	const stateLocation = reconstructor.indexOf(stateCandidate);
	const preceedingText = reconstructor.slice(0, stateLocation);
	const trailingText = reconstructor.slice(stateLocation + stateCandidate.length);
	
	return { preceedingText , stateCandidate, trailingText }
}

/**
 * Highlights a single span element with state coloring based on mode.
 *
 * @param {HTMLElement} span - the span to modify (must contain location text)
 */
async function processSpan(span) {
	// { defaults } = unless { storage is different }
	const { mode = "Primary", tooltipsEnabled = true } = await browser.storage.local.get(["mode", "tooltipsEnabled"]);

	// Minified versions. Human readable format located in stateScores.js. Minified using https://minify-js.com/
	const policyColors={high:"rgba(0, 100, 0, 0.5)",medium:"rgba(143, 188, 143, 0.75)",fair:"rgba(189, 183, 107, 0.75)",low:"rgba(255, 127, 80, 0.65)",negative:"rgba(178, 34, 34, 0.5)"};
	const stateScores={Primary:Primary={Alabama:{colorGrade:"negative",score:-10.5},Alaska:{colorGrade:"low",score:8.25},"American Samoa":{colorGrade:"low",score:0},Arizona:{colorGrade:"low",score:7.5},Arkansas:{colorGrade:"negative",score:-12.25},California:{colorGrade:"high",score:45},Colorado:{colorGrade:"high",score:45.25},Connecticut:{colorGrade:"high",score:40.75},Delaware:{colorGrade:"medium",score:30.25},"District of Columbia":{colorGrade:"high",score:40.75},Florida:{colorGrade:"negative",score:-3},Georgia:{colorGrade:"negative",score:-1},Guam:{colorGrade:"low",score:4.75},Hawaii:{colorGrade:"medium",score:31.25},Idaho:{colorGrade:"negative",score:-9.5},Illinois:{colorGrade:"high",score:43},Indiana:{colorGrade:"negative",score:-2.75},Iowa:{colorGrade:"low",score:6.5},Kansas:{colorGrade:"low",score:.5},Kentucky:{colorGrade:"low",score:5},Louisiana:{colorGrade:"negative",score:-6.75},Maine:{colorGrade:"high",score:44.5},Maryland:{colorGrade:"high",score:42},Massachusetts:{colorGrade:"high",score:39},Michigan:{colorGrade:"medium",score:30},Minnesota:{colorGrade:"high",score:36.75},Mississippi:{colorGrade:"negative",score:-7.5},Missouri:{colorGrade:"negative",score:-1.5},Montana:{colorGrade:"negative",score:-2.75},Nebraska:{colorGrade:"low",score:2.25},Nevada:{colorGrade:"high",score:41.25},"New Hampshire":{colorGrade:"medium",score:32.5},"New Jersey":{colorGrade:"high",score:41.75},"New Mexico":{colorGrade:"medium",score:36},"New York":{colorGrade:"high",score:44.5},"North Carolina":{colorGrade:"low",score:7.25},"North Dakota":{colorGrade:"low",score:9.5},"Northern Mariana Islands":{colorGrade:"low",score:2.75},Ohio:{colorGrade:"low",score:2.25},Oklahoma:{colorGrade:"negative",score:-5},Oregon:{colorGrade:"high",score:37.5},Pennsylvania:{colorGrade:"fair",score:16.75},"Puerto Rico":{colorGrade:"fair",score:19.75},"Rhode Island":{colorGrade:"high",score:38},"South Carolina":{colorGrade:"negative",score:-7.75},"South Dakota":{colorGrade:"negative",score:-7.5},Tennessee:{colorGrade:"negative",score:-14},Texas:{colorGrade:"negative",score:-1.75},"U.S. Virgin Islands":{colorGrade:"fair",score:13.5},Utah:{colorGrade:"low",score:10},Vermont:{colorGrade:"high",score:38.5},Virginia:{colorGrade:"medium",score:24.5},Washington:{colorGrade:"high",score:40.25},"West Virginia":{colorGrade:"negative",score:-.75},Wisconsin:{colorGrade:"fair",score:17.75},Wyoming:{colorGrade:"negative",score:-6},AL:{colorGrade:"negative",score:-10.5},AK:{colorGrade:"low",score:8.25},AS:{colorGrade:"low",score:0},AZ:{colorGrade:"low",score:7.5},AR:{colorGrade:"negative",score:-12.25},CA:{colorGrade:"high",score:45},CO:{colorGrade:"high",score:45.25},CT:{colorGrade:"high",score:40.75},DE:{colorGrade:"medium",score:30.25},DC:{colorGrade:"high",score:40.75},FL:{colorGrade:"negative",score:-3},GA:{colorGrade:"negative",score:-1},GU:{colorGrade:"low",score:4.75},HI:{colorGrade:"medium",score:31.25},ID:{colorGrade:"negative",score:-9.5},IL:{colorGrade:"high",score:43},IN:{colorGrade:"negative",score:-2.75},IA:{colorGrade:"low",score:6.5},KS:{colorGrade:"low",score:.5},KY:{colorGrade:"low",score:5},LA:{colorGrade:"negative",score:-6.75},ME:{colorGrade:"high",score:44.5},MD:{colorGrade:"high",score:42},MA:{colorGrade:"high",score:39},MI:{colorGrade:"medium",score:30},MN:{colorGrade:"high",score:36.75},MS:{colorGrade:"negative",score:-7.5},MO:{colorGrade:"negative",score:-1.5},MT:{colorGrade:"negative",score:-2.75},NE:{colorGrade:"low",score:2.25},NV:{colorGrade:"high",score:41.25},NH:{colorGrade:"medium",score:32.5},NJ:{colorGrade:"high",score:41.75},NM:{colorGrade:"medium",score:36},NY:{colorGrade:"high",score:44.5},NC:{colorGrade:"low",score:7.25},ND:{colorGrade:"low",score:9.5},MP:{colorGrade:"low",score:2.75},OH:{colorGrade:"low",score:2.25},OK:{colorGrade:"negative",score:-5},OR:{colorGrade:"high",score:37.5},PA:{colorGrade:"fair",score:16.75},PR:{colorGrade:"fair",score:19.75},RI:{colorGrade:"high",score:38},SC:{colorGrade:"negative",score:-7.75},SD:{colorGrade:"negative",score:-7.5},TN:{colorGrade:"negative",score:-14},TX:{colorGrade:"negative",score:-1.75},VI:{colorGrade:"fair",score:13.5},UT:{colorGrade:"low",score:10},VT:{colorGrade:"high",score:38.5},VA:{colorGrade:"medium",score:24.5},WA:{colorGrade:"high",score:40.25},WV:{colorGrade:"negative",score:-.75},WI:{colorGrade:"fair",score:17.75},WY:{colorGrade:"negative",score:-6}},Secondary:Secondary={Alabama:{colorGrade:"negative",score:-7.75},Alaska:{colorGrade:"low",score:4.25},"American Samoa":{colorGrade:"low",score:0},Arizona:{colorGrade:"negative",score:-.25},Arkansas:{colorGrade:"negative",score:-8.25},California:{colorGrade:"high",score:23.25},Colorado:{colorGrade:"high",score:23.25},Connecticut:{colorGrade:"high",score:22.25},Delaware:{colorGrade:"medium",score:16.5},"District of Columbia":{colorGrade:"high",score:22.5},Florida:{colorGrade:"negative",score:-6.25},Georgia:{colorGrade:"negative",score:-1},Guam:{colorGrade:"negative",score:-.75},Hawaii:{colorGrade:"medium",score:17.75},Idaho:{colorGrade:"negative",score:-7.5},Illinois:{colorGrade:"high",score:22.5},Indiana:{colorGrade:"negative",score:-3.75},Iowa:{colorGrade:"low",score:3},Kansas:{colorGrade:"negative",score:-1.75},Kentucky:{colorGrade:"low",score:0},Louisiana:{colorGrade:"negative",score:-7.25},Maine:{colorGrade:"high",score:23.5},Maryland:{colorGrade:"high",score:22.75},Massachusetts:{colorGrade:"high",score:20.25},Michigan:{colorGrade:"medium",score:14},Minnesota:{colorGrade:"high",score:21},Mississippi:{colorGrade:"negative",score:-6},Missouri:{colorGrade:"negative",score:-5.5},Montana:{colorGrade:"negative",score:-4},Nebraska:{colorGrade:"negative",score:-2.25},Nevada:{colorGrade:"high",score:21},"New Hampshire":{colorGrade:"medium",score:15},"New Jersey":{colorGrade:"high",score:23.25},"New Mexico":{colorGrade:"medium",score:19},"New York":{colorGrade:"high",score:24},"North Carolina":{colorGrade:"low",score:2},"North Dakota":{colorGrade:"low",score:.75},"Northern Mariana Islands":{colorGrade:"negative",score:-.75},Ohio:{colorGrade:"low",score:2.25},Oklahoma:{colorGrade:"negative",score:-6.5},Oregon:{colorGrade:"high",score:21},Pennsylvania:{colorGrade:"fair",score:10.5},"Puerto Rico":{colorGrade:"fair",score:10.5},"Rhode Island":{colorGrade:"high",score:20.25},"South Carolina":{colorGrade:"negative",score:-8.25},"South Dakota":{colorGrade:"negative",score:-5},Tennessee:{colorGrade:"negative",score:-11.25},Texas:{colorGrade:"negative",score:-3.75},"U.S. Virgin Islands":{colorGrade:"low",score:4.75},Utah:{colorGrade:"low",score:1.75},Vermont:{colorGrade:"high",score:20.5},Virginia:{colorGrade:"medium",score:14.5},Washington:{colorGrade:"high",score:22},"West Virginia":{colorGrade:"low",score:1},Wisconsin:{colorGrade:"low",score:5.5},Wyoming:{colorGrade:"negative",score:-2.75},AL:{colorGrade:"negative",score:-7.75},AK:{colorGrade:"low",score:4.25},AS:{colorGrade:"low",score:0},AZ:{colorGrade:"negative",score:-.25},AR:{colorGrade:"negative",score:-8.25},CA:{colorGrade:"high",score:23.25},CO:{colorGrade:"high",score:23.25},CT:{colorGrade:"high",score:22.25},DE:{colorGrade:"medium",score:16.5},DC:{colorGrade:"high",score:22.5},FL:{colorGrade:"negative",score:-6.25},GA:{colorGrade:"negative",score:-1},GU:{colorGrade:"negative",score:-.75},HI:{colorGrade:"medium",score:17.75},ID:{colorGrade:"negative",score:-7.5},IL:{colorGrade:"high",score:22.5},IN:{colorGrade:"negative",score:-3.75},IA:{colorGrade:"low",score:3},KS:{colorGrade:"negative",score:-1.75},KY:{colorGrade:"low",score:0},LA:{colorGrade:"negative",score:-7.25},ME:{colorGrade:"high",score:23.5},MD:{colorGrade:"high",score:22.75},MA:{colorGrade:"high",score:20.25},MI:{colorGrade:"medium",score:14},MN:{colorGrade:"high",score:21},MS:{colorGrade:"negative",score:-6},MO:{colorGrade:"negative",score:-5.5},MT:{colorGrade:"negative",score:-4},NE:{colorGrade:"negative",score:-2.25},NV:{colorGrade:"high",score:21},NH:{colorGrade:"medium",score:15},NJ:{colorGrade:"high",score:23.25},NM:{colorGrade:"medium",score:19},NY:{colorGrade:"high",score:24},NC:{colorGrade:"low",score:2},ND:{colorGrade:"low",score:.75},MP:{colorGrade:"negative",score:-.75},OH:{colorGrade:"low",score:2.25},OK:{colorGrade:"negative",score:-6.5},OR:{colorGrade:"high",score:21},PA:{colorGrade:"fair",score:10.5},PR:{colorGrade:"fair",score:10.5},RI:{colorGrade:"high",score:20.25},SC:{colorGrade:"negative",score:-8.25},SD:{colorGrade:"negative",score:-5},TN:{colorGrade:"negative",score:-11.25},TX:{colorGrade:"negative",score:-3.75},VI:{colorGrade:"low",score:4.75},UT:{colorGrade:"low",score:1.75},VT:{colorGrade:"high",score:20.5},VA:{colorGrade:"medium",score:14.5},WA:{colorGrade:"high",score:22},WV:{colorGrade:"low",score:1},WI:{colorGrade:"low",score:5.5},WY:{colorGrade:"negative",score:-2.75}}};
	// Change object table based on current mode
	const colors = stateScores[mode];

	// Grab the original text and cache it
	const originalText = span.dataset.originalText || span.textContent;
	span.dataset.originalText = originalText;
	
	// Separate our city and state and any trailing information along with it
	const { preceedingText , stateCandidate, trailingText } = processLocation(originalText);
	
	// Check if our state is in the score listing
	const entry =
		colors[stateCandidate] || colors[stateCandidate.toUpperCase()];
	if (!entry) return; // Not a match for any known state/territory
	
	// Grab the score and colorGrade from the entry, process the grade into a score
	const { colorGrade, score } = entry;
	const stateColor = policyColors[colorGrade];

	// Clear and reconstruct the span content
	span.textContent = "";
	// Add city and comma if city exists
	if (preceedingText) {
		span.appendChild(document.createTextNode(preceedingText));
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
	if (tooltipsEnabled) { // Add a tooltip if enabled (default = true)
		const tooltipText = `${stateCandidate} — MAP score: ${score.toFixed(2)}`;
		stateSpan.title = tooltipText;
		stateSpan.dataset.tooltipContent = tooltipText;
		stateSpan.dataset.tooltipApplied = "true";
		//console.log("[Equality Compass] Processing tooltip " + tooltipText);
	}
}