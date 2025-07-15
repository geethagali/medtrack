// Highlight selected doctor
document.querySelectorAll(".doctor-card").forEach(card => {
  card.addEventListener("click", () => {
    const name = card.getAttribute("data-name");
    document.getElementById("selectedDoctor").value = name;

    // Highlight selected
    document.querySelectorAll(".doctor-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});

// Submit the appointment form
document.getElementById("appointmentForm").addEventListener("submit", (e) => {
  const doctor = document.getElementById("selectedDoctor").value;
  const issue = document.getElementById("description").value.trim();
  const date = document.querySelector("input[name='date']").value;
  const time = document.querySelector("input[name='time']").value;

  // Basic validation
  if (!doctor || !issue || !date || !time) {
    alert("Please fill all fields: doctor, issue, date, and time.");
    e.preventDefault(); // stop form from submitting
    return;
  }

  // Optional: Confirmation before submission
  const confirmBooking = confirm(`Confirm appointment with ${doctor} on ${date} at ${time}?\nIssue: ${issue}`);
  if (!confirmBooking) {
    e.preventDefault(); // stop form from submitting
    return;
  }

  // Let the form submit to Flask route
});
