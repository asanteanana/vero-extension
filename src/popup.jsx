import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Cookie, Shield, Fingerprint, Send } from 'lucide-react';

const Popup = () => {
    const [privacyScore, setPrivacyScore] = useState('Analyzing site...');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        initializeUI();
    }, []);

    const initializeUI = async () => {
        const stats = await chrome.runtime.sendMessage({ action: "getStats" });
        updatePrivacyScore(stats.blockedTrackers);
    };

    const updatePrivacyScore = (blockedCount) => {
        setPrivacyScore(`Protected: ${blockedCount} trackers blocked`);
    };

    const addChatMessage = (sender, message) => {
        setChatHistory(prev => [...prev, { sender, message }]);
    };

    const handleClearCookies = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({ domain: url.hostname });

            for (const cookie of cookies) {
                const protocol = cookie.secure ? "https:" : "http:";
                const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
                await chrome.cookies.remove({ url: cookieUrl, name: cookie.name });
            }

            addChatMessage('System', 'Cookies cleared successfully! 🍪');
        } catch (error) {
            addChatMessage('System', 'Error clearing cookies: ' + error.message);
        }
    };

    const handleBlockTrackers = async () => {
        try {
            await chrome.runtime.sendMessage({ action: "blockTrackers" });
            addChatMessage('System', 'Trackers blocked successfully! 🛡️');
        } catch (error) {
            addChatMessage('System', 'Error blocking trackers: ' + error.message);
        }
    };

    const handleDisableFingerprinting = async () => {
        try {
            await chrome.runtime.sendMessage({ action: "disableFingerprinting" });
            addChatMessage('System', 'Fingerprinting protection enabled! 👆');
        } catch (error) {
            addChatMessage('System', 'Error enabling fingerprinting protection: ' + error.message);
        }
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;

        addChatMessage('You', chatInput);
        setChatInput('');

        // TODO: Implement AI chat response
        setTimeout(() => {
            addChatMessage('Vero', 'I understand you want to know about privacy. I\'ll help you with that soon!');
        }, 500);
    };

    return (
        <div id="popup">
            <header>
                <h2>Vero</h2>
                <div id="privacy-score">{privacyScore}</div>
            </header>

            <section className="actions">
                <button onClick={handleClearCookies} className="action-btn">
                    <Cookie size={18} />
                    Clear Cookies
                </button>
                <button onClick={handleBlockTrackers} className="action-btn">
                    <Shield size={18} />
                    Block Trackers
                </button>
                <button onClick={handleDisableFingerprinting} className="action-btn">
                    <Fingerprint size={18} />
                    Disable Fingerprinting
                </button>
            </section>

            <section className="chat">
                <div id="chatHistory">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.sender}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about privacy..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    />
                    <button onClick={handleSendChat}>
                        <Send size={18} />
                    </button>
                </div>
            </section>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />); 