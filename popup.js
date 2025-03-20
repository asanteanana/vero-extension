// UI Elements
const privacyScore = document.getElementById('privacy-score');
const chatHistory = document.getElementById('chatHistory');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

// Initialize UI
async function initializeUI() {
    const stats = await chrome.runtime.sendMessage({ action: "getStats" });
    updatePrivacyScore(stats.blockedTrackers);
}

// Update privacy score display
function updatePrivacyScore(blockedCount) {
    privacyScore.textContent = `Protected: ${blockedCount} trackers blocked`;
}

// Clear cookies for current site
document.getElementById('clearCookies').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = new URL(tab.url);

        const cookies = await chrome.cookies.getAll({ domain: url.hostname });

        for (const cookie of cookies) {
            const protocol = cookie.secure ? "https:" : "http:";
            const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

            await chrome.cookies.remove({
                url: cookieUrl,
                name: cookie.name,
            });
        }

        addChatMessage('System', 'Cookies cleared successfully! 🍪');
    } catch (error) {
        addChatMessage('System', 'Error clearing cookies: ' + error.message);
    }
});

// Block trackers
document.getElementById('blockTrackers').addEventListener('click', async () => {
    try {
        await chrome.runtime.sendMessage({ action: "blockTrackers" });
        addChatMessage('System', 'Trackers blocked successfully! 🛡️');
    } catch (error) {
        addChatMessage('System', 'Error blocking trackers: ' + error.message);
    }
});

// Disable fingerprinting
document.getElementById('disableFingerprinting').addEventListener('click', async () => {
    try {
        await chrome.runtime.sendMessage({ action: "disableFingerprinting" });
        addChatMessage('System', 'Fingerprinting protection enabled! 👆');
    } catch (error) {
        addChatMessage('System', 'Error enabling fingerprinting protection: ' + error.message);
    }
});

// Add message to chat history
function addChatMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Handle chat input
sendChat.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage('You', message);
    chatInput.value = '';

    // TODO: Implement AI chat response
    // For now, we'll just echo a placeholder response
    setTimeout(() => {
        addChatMessage('Vero', 'I understand you want to know about privacy. I\'ll help you with that soon!');
    }, 500);
});

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', initializeUI); 