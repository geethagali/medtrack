// File: static/doctors.js

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("doctorModal");
  const closeBtn = document.querySelector(".close-btn");
  const bookForm = document.getElementById("bookForm");
  const inputName = document.getElementById("inputName");
  const inputSpeciality = document.getElementById("inputSpeciality");
  const inputExperience = document.getElementById("inputExperience");
  const inputHospital = document.getElementById("inputHospital");

  let selectedDoctor = "";

  // Handle clicking on AVAILABLE doctor cards
  document.querySelectorAll(".doctor-card.available").forEach(card => {
    card.addEventListener("click", () => {
      const name = card.querySelector("h3").textContent.trim();
      const speciality = card.querySelector(".speciality").textContent.trim();
      const fullText = card.innerText;

      const experienceMatch = fullText.match(/Experience: (.*?)\n/);
      const experience = experienceMatch ? experienceMatch[1].trim() : "";

      const hospitalMatch = fullText.split("Experience:")[1]?.split("\n")[1]?.trim() || "";

      // Fill modal
      document.getElementById("doctorName").textContent = name;
      document.getElementById("doctorSpeciality").textContent = `Speciality: ${speciality}`;
      document.getElementById("doctorExperience").textContent = `Experience: ${experience}`;
      document.getElementById("doctorHospital").textContent = `Hospital: ${hospitalMatch}`;
      document.getElementById("doctorStatus").textContent = `Status: AVAILABLE`;

      // Fill hidden form inputs
      inputName.value = name;
      inputSpeciality.value = speciality;
      inputExperience.value = experience;
      inputHospital.value = hospitalMatch;

      selectedDoctor = name;
      modal.classList.remove("hidden");
    });
  });

  // Close the modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Intercept the form submit to use AJAX
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const today = new Date();
    const date = today.toISOString().split("T")[0]; // yyyy-mm-dd
    const time = today.toTimeString().slice(0, 5);   // hh:mm

    const payload = {
      doctor: inputName.value,
      issue: "Booked via Available Doctors",
      date,
      time
    };

    try {
      const res = await fetch("/book-from-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      alert(result.message);

      if (res.status === 200) {
        modal.classList.add("hidden");
        window.location.href = "/home"; // Redirect to update counts
      }

    } catch (err) {
      console.error("Booking failed", err);
      alert("An error occurred while booking.");
    }
  });
});
