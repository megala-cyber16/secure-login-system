
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function showMessage(message, success = false) {
  const output = document.getElementById("message");
  output.textContent = message;
  output.style.color = success ? "green" : "crimson";
}

async function register() {
  const username = document.getElementById("regUser").value.trim();
  const password = document.getElementById("regPass").value;

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    showMessage("Username must be 3-20 letters, numbers or underscores.");
    return;
  }

  if (password.length < 8) {
    showMessage("Password must contain at least 8 characters.");
    return;
  }

  if (localStorage.getItem("user_" + username)) {
    showMessage("Username already exists.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  localStorage.setItem("user_" + username, hashedPassword);

  showMessage("Registration successful! Please login.", true);
  document.getElementById("regPass").value = "";
}

async function login() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  const savedHash = localStorage.getItem("user_" + username);

  if (!savedHash || await hashPassword(password) !== savedHash) {
    showMessage("Invalid username or password.");
    return;
  }

  sessionStorage.setItem("loggedInUser", username);
  document.getElementById("loginForm").hidden = true;
  document.getElementById("registerForm").hidden = true;
  document.getElementById("logoutBtn").hidden = false;

  showMessage("Login successful! Welcome, " + username + ".", true);
  document.getElementById("loginPass").value = "";
}

function logout() {
  sessionStorage.removeItem("loggedInUser");

  document.getElementById("loginForm").hidden = false;
  document.getElementById("registerForm").hidden = false;
  document.getElementById("logoutBtn").hidden = true;

  showMessage("You have logged out successfully.", true);
}
