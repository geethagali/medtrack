// Reserved for future behavior
console.log("Navbar and sidebar correctly structured.");// Sample Data - Replace with real data from backend in the future
document.addEventListener("DOMContentLoaded", function () {
  const bookBtn = document.querySelector('.book-btn');
  const doctorSection = document.getElementById('availableDoctorsSection');
  const myAppointmentsBtn = document.getElementById('myAppointmentsBtn');
  const tableWrapper = document.getElementById('appointmentsTableWrapper');

  // Show the table when "My Appointments" button is clicked
  myAppointmentsBtn.addEventListener("click", function () {
    tableWrapper.style.display = "block";
    loadAppointments(); // Load from DB when integrated
  });

  // Placeholder for database fetch
  function loadAppointments() {
    const tableBody = document.querySelector("#appointmentsTable tbody");
    tableBody.innerHTML = ""; // Clear old data

    // Replace this with real DB fetch
    // Example using fetch:
    // fetch("fetch_appointments.php")
    // .then(res => res.json())
    // .then(data => {
    //   data.forEach(app => {
    //     const row = document.createElement("tr");
    //     row.innerHTML = `
    //       <td>${app.doctor}</td>
    //       <td>${app.date}</td>
    //       <td>${app.time}</td>
    //       <td>${app.status}</td>
    //     `;
    //     tableBody.appendChild(row);
    //   });
    // });

    // (Optional) Sample row for layout demo (remove in production)
    // const sample = document.createElement("tr");
    // sample.innerHTML = `<td>Dr. Example</td><td>2025-07-05</td><td>11:00 AM</td><td>Pending</td>`;
    // tableBody.appendChild(sample);
  }
});
