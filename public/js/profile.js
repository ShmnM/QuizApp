document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("historyContainer");

  fetch("/api/profile")
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        historyContainer.innerHTML = "<p class='text-muted'>No games played yet.</p>";
        return;
      }

      const table = document.createElement("table");
      table.className = "table table-striped";
      table.innerHTML = `
        <thead>
          <tr>
            <th>Score</th>
            <th>Total</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(entry => `
            <tr>
              <td>${entry.score}</td>
              <td>${entry.total}</td>
              <td>${entry.category}</td>
              <td>${new Date(entry.date).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      `;

      historyContainer.appendChild(table);
    })
    .catch(err => {
      console.error("Error loading profile:", err);
      historyContainer.innerHTML = "<p class='text-danger'>Error loading history.</p>";
    });
});
