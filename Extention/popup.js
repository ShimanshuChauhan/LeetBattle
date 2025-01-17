// Show according to the login status
document.addEventListener('DOMContentLoaded', function () {
  function checkLoginStatus() {
    chrome.runtime.sendMessage({ type: 'checkLoginStatus' }, function (response) {
      if (response.isLoggedIn) {
        // Show logged-in elements and hide logged-out elements
        document.getElementById('logged_in').style.display = 'block';
        document.getElementById('logged_out').style.display = 'none';
      } else {
        // Show logged-out elements and hide logged-in elements
        document.getElementById('logged_in').style.display = 'none';
        document.getElementById('logged_out').style.display = 'block';
      }
    });
  }
  checkLoginStatus();


  // Sign up
  const signUpButton = document.getElementById('sign_up');
  signUpButton.addEventListener('click', () => {
    const userName = document.getElementById('user_name').value;
    if (userName === '') {
      alert('Please enter a username');
      return;
    }

    // Send message to background.js to handle signup
    chrome.runtime.sendMessage({ type: 'signUp', data: { userName: userName } }, function (response) {
      if (response.success) {
        alert('Sign up successful');
        // Show logged-in elements and hide logged-out elements
        document.getElementById('logged_in').style.display = 'block';
        document.getElementById('logged_out').style.display = 'none';
      } else {
        alert('Sign up failed: ' + response.message);
      }
    });
  });

  // Log out
  const logOutButton = document.getElementById('log_out');
  logOutButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'logOut' }, function (response) {
      if (response.success) {
        alert('Log out successful');
        // Show logged-out elements and hide logged-in elements
        document.getElementById('logged_in').style.display = 'none';
        document.getElementById('logged_out').style.display = 'block';
      } else {
        alert('Log out failed: ' + response.message);
      }
    });
  });

  // Create a new room
  const createRoomButton = document.getElementById('create_room');
  createRoomButton.addEventListener('click', () => {
    const questionUrl = document.getElementById('question_url').value;
    chrome.runtime.sendMessage({ type: 'create_room', data: { questionUrl } }, function (response) {
      if (!response.success) {
        alert(response.message);
      }
    });
  });

});


// Keeping the service worker active
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'keep_alive') {
    sendResponse({ status: 'alive' });
    return true;  // Keep the message channel open for async response
  }

  if (message.type === 'room_created') {
    const { roomId } = message.data;
    alert(`Room created with id: ${roomId}`);
  }
});