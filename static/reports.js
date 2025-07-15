document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector('.reports-table tbody');
  const detailSection = document.getElementById('reportDetails');
  const detailContent = document.getElementById('reportDetailContent');

  // Sample function to create the detail HTML - replace with your DB data later
  function createDetailHTML(report) {
    return `
      <p><strong>Date:</strong> ${report.date}</p>
      <p><strong>Report Type:</strong> ${report.type}</p>
      <p><strong>Doctor:</strong> ${report.doctor}</p>
      <p><strong>Summary:</strong> ${report.summary}</p>
      <p><strong>Prescription:</strong> ${report.prescription || 'Not provided'}</p>
      <p><strong>Notes:</strong> ${report.notes || 'No additional notes'}</p>
    `;
  }

  // Event delegation: handle clicks on table rows
  tbody.addEventListener('click', (event) => {
    let tr = event.target.closest('tr');
    if (!tr) return;

    // Example: Fetch data attributes or use row data to show details
    // For demo, create dummy data from row cells:
    const cells = tr.querySelectorAll('td');
    if (cells.length < 4) return; // Invalid row

    const report = {
      date: cells[0].textContent,
      type: cells[1].textContent,
      doctor: cells[2].textContent,
      summary: cells[3].textContent,
      prescription: tr.getAttribute('data-prescription'),
      notes: tr.getAttribute('data-notes')
    };

    // Show detail section
    detailContent.innerHTML = createDetailHTML(report);
    detailSection.style.display = 'block';
    detailSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Example: you will load data from DB and dynamically create rows like this:
  // Here is a dummy example (remove when integrating with real DB)
  const dummyReports = [
    {
      date: '2025-07-01',
      type: 'General Checkup',
      doctor: 'Dr. Smith',
      summary: 'Routine health check',
      prescription: 'Vitamin D supplements',
      notes: 'Follow-up in 3 months'
    },
    {
      date: '2025-06-15',
      type: 'Cardiology',
      doctor: 'Dr. Jones',
      summary: 'Chest pain evaluation',
      prescription: 'Beta blockers',
      notes: 'Monitor blood pressure daily'
    }
  ];

  // Populate the table with dummy data for demo
  dummyReports.forEach(report => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-prescription', report.prescription);
    tr.setAttribute('data-notes', report.notes);
    tr.innerHTML = `
      <td>${report.date}</td>
      <td>${report.type}</td>
      <td>${report.doctor}</td>
      <td>${report.summary}</td>
      <td><a href="#" class="download-link" title="Download report"><i class="fas fa-download"></i></a></td>
    `;
    tbody.appendChild(tr);
  });
});
