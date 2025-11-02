// Replace with your Google Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaxKrofwEgJmqa0rHahOkUIP3P-UjcGJxGtOzjHrvSYSgeCeiUoZQid6w7g9kmFcl1/exec";

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Phone validation regex (only 10 digits)
const phoneRegex = /^[0-9]{10}$/;

// Get form elements
const form = document.getElementById("contactForm");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");

// Email validation on focus out
emailInput.addEventListener("focusout", function () {
  const emailValue = this.value.trim();

  if (emailValue === "") {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    emailError.textContent = "Email address is required.";
    emailError.style.display = "block";
  } else if (!emailRegex.test(emailValue)) {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    emailError.textContent =
      "Please enter a valid email address (e.g., user@example.com).";
    emailError.style.display = "block";
  } else {
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    emailError.style.display = "none";
  }
});

// Phone validation on focus out
phoneInput.addEventListener("focusout", function () {
  const phoneValue = this.value.trim();

  if (phoneValue === "") {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    phoneError.textContent = "Phone number is required.";
    phoneError.style.display = "block";
  } else if (!phoneRegex.test(phoneValue)) {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    phoneError.textContent =
      "Please enter a valid 10-digit phone number (e.g., 1234567890).";
    phoneError.style.display = "block";
  } else if (phoneValue.replace(/\D/g, "").length < 10) {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    phoneError.textContent = "Phone number must be at least 10 digits.";
    phoneError.style.display = "block";
  } else {
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    phoneError.style.display = "none";
  }
});

// Form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Trigger validation on all fields
  emailInput.dispatchEvent(new Event("focusout"));
  phoneInput.dispatchEvent(new Event("focusout"));

  // Check if form is valid
  if (
    !form.checkValidity() ||
    emailInput.classList.contains("is-invalid") ||
    phoneInput.classList.contains("is-invalid")
  ) {
    form.classList.add("was-validated");
    return;
  }

  // Collect form data
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    // Send data to Google Sheets
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Note: With no-cors mode, we can't read the response
    // But if no error is thrown, submission was successful

    // Success message
    console.log(
      "✅ SUCCESS: Form data submitted to Google Sheets successfully!"
    );

    // Update button to show sent state
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent';
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-info");

    // Show custom alert with professional message
    const messageHtml = `
      <div class="modal fade" id="successModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center p-4">
              <i class="fas fa-check-circle text-success display-1 mb-4"></i>
              <h4 class="mb-3">Thank You for Contacting Us!</h4>
              <p class="text-muted mb-4">
                Your message has been successfully sent to Developer at <a href="mailto:smpandya2008@gmail.com">smpandya2008@gmail.com</a>. 
                We will get back to you shortly via your provided contact details.
              </p>
              <button type="button" class="btn btn-success px-4" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", messageHtml);

    // Show modal
    const successModal = new bootstrap.Modal(
      document.getElementById("successModal")
    );
    successModal.show();

    // Reset form and button when modal is closed
    document
      .getElementById("successModal")
      .addEventListener("hidden.bs.modal", function () {
        // Reset form
        form.reset();
        form.classList.remove("was-validated");
        emailInput.classList.remove("is-valid");
        phoneInput.classList.remove("is-valid");

        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.classList.remove("btn-info");
        submitBtn.classList.add("btn-success");

        // Remove modal from DOM
        this.remove();
      });
  } catch (error) {
    console.error("❌ ERROR: Failed to submit form data", error);
    alert("Failed to send message. Please try again.");
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
});

// Reset validation on form reset
form.addEventListener("reset", function () {
  form.classList.remove("was-validated");
  emailInput.classList.remove("is-valid", "is-invalid");
  phoneInput.classList.remove("is-valid", "is-invalid");
  successMessage.style.display = "none";
});
