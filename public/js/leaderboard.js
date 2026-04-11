
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("leaderboardContainer");

  fetch("/api/leaderboard")
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        container.innerHTML = "<p class='text-muted'>No leaderboard data available.</p>";
        return;
      }

      const table = document.createElement("table");
      table.className = "table table-striped";
      table.innerHTML = `
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Total</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(entry => `
            <tr>
              <td>${entry.user}</td>
              <td>${entry.score}</td>
              <td>${entry.total}</td>
              <td>${entry.category}</td>
              <td>${new Date(entry.date).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      `;

      container.appendChild(table);
    })
    .catch(err => {
      console.error("Error loading leaderboard:", err);
      container.innerHTML = "<p class='text-danger'>Error loading leaderboard.</p>";
    });
});
