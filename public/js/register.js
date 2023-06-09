function validateForm(event) {
    //event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var usernameError = document.getElementById("username-error");
    var passwordError = document.getElementById("password-error");

    // Simple email validation regex pattern
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim() === "") {
      usernameError.textContent = "Username/Email is required.";
      return;
    } else if (!emailPattern.test(username)) {
      usernameError.textContent = "Invalid email format.";
      return;
    }

    if (password.trim() === "") {
      passwordError.textContent = "Password is required.";
      return;
    } else if (password !== confirmPassword) {
      passwordError.textContent = "Passwords do not match.";
      return;
    }

    // If form is valid, you can perform the sign-up logic here
    // For simplicity, we'll just display an alert message
    //alert("Sign up successful!");
  }