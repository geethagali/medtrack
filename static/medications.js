document.addEventListener("DOMContentLoaded", () => {
  const prescribedMedications = [
    {
      condition: "Upper Respiratory Infection",
      name: "Azithromycin",
      dosage: "250mg",
      frequency: "Once daily",
      startDate: "2025-07-01",
      endDate: "2025-07-05",
      instructions: "Take after meals"
    },
    {
      condition: "Gastric Ulcer",
      name: "Pantoprazole",
      dosage: "40mg",
      frequency: "Before breakfast",
      startDate: "2025-07-01",
      endDate: "2025-07-10",
      instructions: "Take on empty stomach"
    },
    {
      condition: "Migraine",
      name: "Sumatriptan",
      dosage: "50mg",
      frequency: "As needed",
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      instructions: "Take during headache episode"
    },
    {
      condition: "Type 2 Diabetes",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2025-07-01",
      endDate: "2025-12-31",
      instructions: "With food"
    },
    {
      condition: "Iron Deficiency Anemia",
      name: "Ferrous Sulfate",
      dosage: "325mg",
      frequency: "Once daily",
      startDate: "2025-07-01",
      endDate: "2025-08-01",
      instructions: "Avoid dairy around dose"
    },
    {
      condition: "Seasonal Allergy",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2025-07-01",
      endDate: "2025-07-14",
      instructions: "Take at bedtime"
    },
    {
      condition: "Skin Infection (Cellulitis)",
      name: "Cephalexin",
      dosage: "500mg",
      frequency: "Every 6 hours",
      startDate: "2025-07-01",
      endDate: "2025-07-10",
      instructions: "Drink plenty of fluids"
    },
    {
      condition: "Hypertension",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2025-07-01",
      endDate: "2025-12-31",
      instructions: "Monitor blood pressure regularly"
    }
  ];

  const tbody = document.getElementById("medications-body");

  prescribedMedications.forEach(med => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${med.condition}</td>
      <td>${med.name}</td>
      <td>${med.dosage}</td>
      <td>${med.frequency}</td>
      <td>${med.startDate}</td>
      <td>${med.endDate}</td>
      <td>${med.instructions}</td>
    `;

    tbody.appendChild(row);
  });
});
