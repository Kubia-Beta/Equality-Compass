/**
 * This background script is responsible for keeping settings in sync across tabs.
 * Triggers content.js listeners when detecting new local information storage.
 */

function reprocessTabs(){
	browser.tabs.query({ url: "*://*.linkedin.com/jobs*" }).then(sendMessageToTabs);
	browser.tabs.query({ url: "*://*.indeed.com/*" }).then(sendMessageToTabs);
	browser.tabs.query({ url: "*://*.ziprecruiter.com/*" }).then(sendMessageToTabs);
}

function sendMessageToTabs(tabs) {
	for (const tab of tabs) {
		browser.tabs
		  .sendMessage(tab.id, { type: "modeChanged" }).catch((error) => {
				console.warn(`[Equality Compass] Tab ${tab.id} could not receive message:`, error.message);
			});
	} // .catch(console.warn) exists since tabs that were never opened since install / not reloaded will throw
}

browser.storage.local.onChanged.addListener(reprocessTabs);