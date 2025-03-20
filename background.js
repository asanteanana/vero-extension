// Track blocked trackers count
let blockedTrackersCount = 0;

// Common tracking domains
const trackingDomains = [
    "*google-analytics.com*",
    "*doubleclick.net*",
    "*facebook.com*",
    "*analytics*",
    "*tracker*",
    "*pixel*"
];

// Initialize blocking rules
async function initializeBlockingRules() {
    const rules = trackingDomains.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: domain, resourceTypes: ["script", "image", "xmlhttprequest"] }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(rule => rule.id),
        addRules: rules
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
        case "blockTrackers":
            await initializeBlockingRules();
            sendResponse({ success: true });
            break;

        case "disableFingerprinting":
            // Implement advanced fingerprinting protection
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [{
                    id: 999,
                    priority: 1,
                    action: {
                        type: "modifyHeaders",
                        responseHeaders: [
                            { header: "User-Agent", operation: "remove" },
                            { header: "Accept-Language", operation: "remove" },
                            { header: "DNT", operation: "set", value: "1" }
                        ]
                    },
                    condition: { urlFilter: "*" }
                }]
            });
            sendResponse({ success: true });
            break;

        case "getStats":
            sendResponse({ blockedTrackers: blockedTrackersCount });
            break;
    }
    return true;
});

// Initialize when installed
chrome.runtime.onInstalled.addListener(() => {
    initializeBlockingRules();
}); 