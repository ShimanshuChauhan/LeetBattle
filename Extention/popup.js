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

  checkLoginStatus();
});
