document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reminderForm');
  const list = document.getElementById('reminderList');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const medName = document.getElementById('medicationName').value.trim();
    const reminderTime = document.getElementById('reminderTime').value;

    if (!medName || !reminderTime) return;

    const li = document.createElement('li');
    li.textContent = `💊 Take "${medName}" at ${new Date(reminderTime).toLocaleString()}`;

    list.appendChild(li);
    form.reset();
  });
});
