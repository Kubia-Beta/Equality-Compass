/*
 * Colors listings of LinkedIn job postings by their state according to their equalitymaps color.
 * Note that the derived color is the overall policy tally, a mix of Sexual Orientation and Gender Identity.
 * Please also note that while I am using EqualityMap's language such as "Fair policy tally", this does not
 * mean I agree with the assessment of the word "fairness", nor does it necessarily map to the outlook of
 * the people who live in that area.
 * If you are transgender, especially a transgender woman of color, please consider high and medium policy
 * areas only for your safety if possible.
 */

// Merge full state names and abbreviations into a single lookup object
function resolveScores() {
  const scores = { ...window.fullStateScores }; // "..." Shallow copy
  for (const [abbr, fullName] of Object.entries(window.stateAbbreviations)) {
    if (window.fullStateScores[fullName] !== undefined) {
      scores[abbr] = window.fullStateScores[fullName];
    }
  }
  return scores;
}

const stateScores = resolveScores();
const states = Object.keys(stateScores).sort((a, b) => b.length - a.length);
const regex = new RegExp(`\\b(${states.join("|")})\\b`, "g");

// Determine the color for a given score based on the policy tally
function getColor(score) {
  if (score >= 36.75) return 'DarkGreen';        // High policy tally
  if (score >= 24.5) return 'DarkSeaGreen';      // Medium policy tally
  if (score >= 12.25) return 'DarkKhaki';        // Fair policy tally
  if (score >= 0) return 'Coral';                // Low policy tally
  return 'FireBrick';                            // Negative policy tally
}

// Cache to avoid reprocessing already-highlighted text nodes
const processedNodes = new WeakSet();


// Highlight all matching state names on the page
function highlightStates() {
  let changes = 0;
  document.querySelectorAll("*:not(script):not(style)").forEach(el => {
    if (el.children.length === 0 && regex.test(el.textContent)) {
      el.innerHTML = el.textContent.replace(regex, match => {
        const score = stateScores[match];
        const color = getColor(score);
        changes++;
        return `<span style=\"color:${color}; font-weight:bold;\" title=\"Score: ${score}\">${match}</span>`;
      });
    }
  });
  return changes;
}

// Throttle highlighting to reduce performance impact
let mutationTimeout = null;
let stableCount = 0; // How many scans with no new highlights we have
const MAX_STABLE = 3; // Stop highlighting after this many scans produce no new highlights

const throttledHighlightStates = () => {
  if (mutationTimeout !== null) return;
  mutationTimeout = setTimeout(() => {
    mutationTimeout = null;
    if (document.visibilityState !== "visible") return; // skip if not visible
    const changes = highlightStates();
    if (changes === 0) {
      stableCount++;
      if (stableCount >= MAX_STABLE) {
        observer.disconnect();
        console.log("Equality Listing: Observer disconnected (DOM stable).");
      }
    } else {
      stableCount = 0;
    }
  }, 500);
};

// Monitor DOM for job card changes
const observer = new MutationObserver(throttledHighlightStates);
observer.observe(document.body, { childList: true, subtree: true });

// Handle tab visibility changes to avoid background work
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    highlightStates();
    stableCount = 0;
    observer.observe(document.body, { childList: true, subtree: true });
  }
});

// Run initially and on idle
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => highlightStates(), { timeout: 2000 });
} else {
  window.addEventListener("load", () => {
    highlightStates();
    setTimeout(() => highlightStates(), 2000);
  });
}
