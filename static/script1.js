function toggleForm(formType) {
  document.getElementById('login-container').classList.toggle('hidden', formType === 'signup');
  document.getElementById('signup-container').classList.toggle('hidden', formType === 'login');
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  alert("✅ Login successful for " + email);
}

function signup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all the fields.");
    return;
  }

  alert("🎉 Welcome, " + name + "! Your account has been created.");
}
