const form = document.getElementById("donationForm");
const tableBody = document.querySelector("#recordsTable tbody");
const message = document.getElementById("message");

let donationList = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //const username = document.getElementById("username").value.trim();
  const wasteType = document.getElementById("wasteType").value;
  const weight = document.getElementById("weight").value;

  if (!wasteType || !weight) {
    message.textContent = "⚠ Please fill all fields.";
    message.style.color = "red";
    return;
  }

  const record = {
    waste: wasteType,
    weight: parseFloat(weight),
    date: new Date().toLocaleString()
  };

  donationList.push(record);
  displayTable();

  // Send data to backend for SMS
  try {
    const res = await fetch('https://mobileapp-production-272f.up.railway.app/send-donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({wasteType, weight })
    });
    const data = await res.json();

    if (data.success) {
      message.textContent = `✅ Thank you! Your ${wasteType} donation is recorded.`;
      message.style.color = "#1b5e20";
    } else {
      message.textContent = `⚠ Donation recorded, but SMS failed: ${data.message}`;
      message.style.color = "orange";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "⚠ An error occurred while sending SMS.";
    message.style.color = "red";
  }

  form.reset();
});

function displayTable() {
  tableBody.innerHTML = "";
  donationList.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.waste}</td>
      <td>${item.weight}</td>
      <td>${item.date}</td>
    `;
    tableBody.appendChild(row);
  });

}

