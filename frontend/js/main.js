function showMessage(elementId, text, type) {
  const messageElement = document.getElementById(elementId);
  if (!messageElement) return;

  messageElement.textContent = text;
  messageElement.className = `message ${type}`;
}

function handleDonorForm() {
  const form = document.getElementById("donorForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      age: Number(formData.get("age")),
      bloodGroup: formData.get("bloodGroup"),
      organ: formData.get("organ"),
      location: formData.get("location"),
    };

    try {
      await createDonor(payload);
      showMessage("donorMessage", "Donor registered successfully", "success");
      form.reset();
    } catch (error) {
      showMessage("donorMessage", error.message, "error");
    }
  });
}

function handleRecipientForm() {
  const form = document.getElementById("recipientForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      age: Number(formData.get("age")),
      bloodGroup: formData.get("bloodGroup"),
      requiredOrgan: formData.get("requiredOrgan"),
      urgency: formData.get("urgency"),
    };

    try {
      await createRecipient(payload);
      showMessage("recipientMessage", "Recipient registered successfully", "success");
      form.reset();
    } catch (error) {
      showMessage("recipientMessage", error.message, "error");
    }
  });
}

async function loadAdminSummary() {
  const summaryContainer = document.getElementById("adminSummary");
  const donorList = document.getElementById("recentDonors");
  const recipientList = document.getElementById("recentRecipients");
  const matchPairsList = document.getElementById("matchPairs");
  const bloodGroupFilter = document.getElementById("filterBloodGroup");
  const organFilter = document.getElementById("filterOrgan");
  const matchNote = document.getElementById("matchNote");
  if (!summaryContainer) return;

  try {
    const [summaryData, matchesData] = await Promise.all([
      getAdminSummary(),
      getMatches(),
    ]);

    summaryContainer.innerHTML = `
      <div class="stat"><strong>Total Donors:</strong> ${summaryData.totalDonors}</div>
      <div class="stat"><strong>Total Recipients:</strong> ${summaryData.totalRecipients}</div>
      <div class="stat"><strong>Total Matches:</strong> ${summaryData.totalMatches}</div>
    `;

    if (matchNote) {
      matchNote.textContent =
        "Note: lists below show latest 5 records only. One donor can match multiple recipients, so total matches can be greater than total donors/recipients.";
    }

    donorList.innerHTML = summaryData.recentDonors.length
      ? summaryData.recentDonors
          .map((donor) => `<li>${donor.name} - ${donor.bloodGroup} - ${donor.organ}</li>`)
          .join("")
      : "<li>No donors yet</li>";

    recipientList.innerHTML = summaryData.recentRecipients.length
      ? summaryData.recentRecipients
          .map(
            (recipient) =>
              `<li>${recipient.name} - ${recipient.bloodGroup} - ${recipient.requiredOrgan} (${recipient.urgency})</li>`
          )
          .join("")
      : "<li>No recipients yet</li>";

    const uniqueOrgans = [...new Set(matchesData.matches.map((item) => item.donor.organ))].sort();
    if (organFilter) {
      organFilter.innerHTML = `
        <option value="">All Organs</option>
        ${uniqueOrgans.map((organ) => `<option value="${organ}">${organ}</option>`).join("")}
      `;
    }

    const renderMatches = () => {
      const selectedBloodGroup = bloodGroupFilter ? bloodGroupFilter.value : "";
      const selectedOrgan = organFilter ? organFilter.value : "";

      const filteredMatches = matchesData.matches.filter((item) => {
        const bloodGroupOk = !selectedBloodGroup || item.donor.bloodGroup === selectedBloodGroup;
        const organOk = !selectedOrgan || item.donor.organ === selectedOrgan;
        return bloodGroupOk && organOk;
      });

      matchPairsList.innerHTML = filteredMatches.length
        ? filteredMatches
            .slice(0, 15)
            .map(
              (item) =>
                `<li><strong>${item.donor.name}</strong> (${item.donor.bloodGroup}, ${item.donor.organ}) ↔ <strong>${item.recipient.name}</strong> (${item.recipient.requiredOrgan}, ${item.recipient.urgency})</li>`
            )
            .join("")
        : "<li>No matching pairs found for selected filters</li>";
    };

    if (bloodGroupFilter) {
      bloodGroupFilter.addEventListener("change", renderMatches);
    }
    if (organFilter) {
      organFilter.addEventListener("change", renderMatches);
    }

    renderMatches();
  } catch (error) {
    summaryContainer.innerHTML = `<p class="error">${error.message}</p>`;
    if (matchNote) {
      matchNote.textContent = "";
    }
    if (matchPairsList) {
      matchPairsList.innerHTML = "";
    }
  }
}

handleDonorForm();
handleRecipientForm();
loadAdminSummary();
