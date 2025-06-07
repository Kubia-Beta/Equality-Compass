/*
 * Colors listings of LinkedIn job postings by their state according to their equalitymaps color.
 * Note that the derived color is the overall policy tally, a mix of Sexual Orientation and Gender Identity.
 * Please also note that while I am using EqualityMap's language such as "Fair policy tally", this does not
 * mean I agree with the assessment of the word "fairness", nor does it necessarily map to the outlook of
 * the people who live in that area.
 * If you are transgender, especially a transgender woman of color, please consider high and medium policy
 * areas only for your safety if possible.
 */
 
console.log("[LinkedIn Colorizer] Content script loaded");

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "modeChanged") {
    console.log("[LinkedIn Colorizer] Mode changed — reprocessing all visible spans");
    document.querySelectorAll('[data-processed="true"]').forEach(el => {
      el.removeAttribute("data-processed");
    });
    applyColoring();
  }
});

// Run coloring immediately in case content is already there
applyColoring();

// Start a global observer that tracks the entire page for changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;

      // Check for any new location span matching our selector
      const spans = node.matches?.('span[dir="ltr"]')
        ? [node]
        : node.querySelectorAll?.('span[dir="ltr"]') || [];

      spans.forEach(span => {
        const parent = span.closest('.artdeco-entity-lockup__caption');
        if (parent && !span.dataset.processed) {
          span.dataset.processed = "true";
          processSpan(span);
        }
      });
    }
  }
});

// Watch the entire body — yes, broader, but works reliably across LinkedIn's SPA behavior
observer.observe(document.body, {
  childList: true,
  subtree: true
});


// Initial full scan of all listings
async function applyColoring() {
  const spans = document.querySelectorAll('.artdeco-entity-lockup__caption span[dir="ltr"]');
  for (const span of spans) {
    if (!span.dataset.processed) {
      span.dataset.processed = "true";
      await processSpan(span);
    }
  }
}

// Highlights a single span based on current mode
async function processSpan(span) {
  const { mode = "Primary" } = await browser.storage.local.get("mode");

  const stateScores = {
    Primary: {
      "California": "#FFCCCC",
	  "CA": "#FFCCCC",
      "Texas": "#CCE5FF",
	  "TX": "#CCE5FF"
      // ... your full list
    },
    Secondary: {
      "California": "#CCCCFF",
	  "CA": "#CCCCFF",
      "Texas": "#00E5CC",
	  "TX": "#00E5CC"
      // ... your alternate list
    }
  };

  const colors = stateScores[mode];
  const originalText = span.dataset.originalText || span.textContent.trim();
  span.dataset.originalText = originalText;

  const parenIndex = originalText.indexOf(" (");
  const trailing = parenIndex !== -1 ? originalText.slice(parenIndex) : "";
  const locationPart = parenIndex !== -1 ? originalText.slice(0, parenIndex) : originalText;
  const parts = locationPart.split(",").map(p => p.trim());

  let city = null;
  let stateCandidate = null;

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
    return;
  }

  const color = colors[stateCandidate] || colors[stateCandidate.toUpperCase()];
  if (!color) return;

  span.textContent = "";

  if (city) {
    span.appendChild(document.createTextNode(city + ", "));
  }

  const stateSpan = document.createElement("span");
  stateSpan.textContent = stateCandidate;
  stateSpan.style.backgroundColor = color;
  stateSpan.style.borderRadius = "3px";
  stateSpan.style.padding = "0 2px";
  span.appendChild(stateSpan);

  if (trailing) {
    span.appendChild(document.createTextNode(trailing));
  }
}
