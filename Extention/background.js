let user = {
  userId: null,
  userName: null,
  currentRoomId: null
};

// Create a WebSocket connection to the server
function connectToSever() {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to server');
  };
}

// Keep the service worker alive
function keepAlive() {
  setInterval(() => {
    chrome.runtime.sendMessage({ type: 'keepAlive' });
  }, 1000 * 25); // Send a message every 25 seconds
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'signUp') {
    const { userName } = message.data;
    const userId = `user-${Date.now()}`; // Generate a unique user ID
    user = { ...user, userId: userId, userName: userName };

    // Save user to local storage
    chrome.storage.local.set({ user }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving user to local storage:', chrome.runtime.lastError);
        sendResponse({ success: false, message: chrome.runtime.lastError.message });
      } else {
        console.log('User saved successfully:', user);
        connectToSever();
        sendResponse({ success: true });
      }
    });

    // Return true to keep the message channel open for async response
    return true;
  }

  // Check Login Status of User
  if (message.type === 'checkLoginStatus') {
    chrome.storage.local.get('user', (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error fetching user from local storage:', chrome.runtime.lastError);
        sendResponse({ isLoggedIn: false });
      } else {
        if (data.user) {
          console.log('User fetched successfully:', data.user);
          sendResponse({ isLoggedIn: true });
        } else {
          sendResponse({ isLoggedIn: false });
        }
      }
    });
    return true;  // Keep the message channel open for async response
  }

  // Log Out
  if (message.type === 'logOut') {
    chrome.storage.local.remove('user', () => {
      if (chrome.runtime.lastError) {
        console.error('Error removing user from local storage:', chrome.runtime.lastError);
        sendResponse({ success: false, message: chrome.runtime.lastError.message });
      } else {
        console.log('User removed successfully');
        sendResponse({ success: true });
      }
    });
    return true;  // Keep the message channel open for async response
  }

  // Keep Alive
  if (message.type === 'keepAlive') {
    sendResponse({ success: true });
    return true;  // Keep the message channel open for async response
  }
});

// Start the keep-alive mechanism
keepAlive();
