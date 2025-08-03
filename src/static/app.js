document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      let activities = await response.json();

      // If activities is empty or not as expected, use dummy data
      if (!activities || Object.keys(activities).length === 0) {
        activities = {
          "Yoga": {
            description: "Morning yoga session",
            schedule: "Mon 7am",
            max_participants: 10,
            participants: ["alice@example.com", "bob@example.com"]
          },
          "Painting": {
            description: "Evening painting class",
            schedule: "Wed 6pm",
            max_participants: 8,
            participants: ["carol@example.com"]
          },
          "Cooking": {
            description: "Weekend cooking workshop",
            schedule: "Sat 11am",
            max_participants: 12,
            participants: []
          }
        };
      }

      // Clear loading message
      activitiesList.innerHTML = "";

      // Clear previous options from the select dropdown
      activitySelect.innerHTML = "";

      // Optionally, add a placeholder option
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select an activity";
      placeholder.disabled = true;
      placeholder.selected = true;
      activitySelect.appendChild(placeholder);

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        // Add participants section
        const participantsDiv = document.createElement("div");
        participantsDiv.className = "activity-participants";
        participantsDiv.innerHTML = `
          <h5>Participants:</h5>
          <ul>
            ${
              details.participants.length > 0
                ? details.participants.map(email => `<li>${email}</li>`).join("")
                : "<li>No participants yet</li>"
            }
          </ul>
        `;
        activityCard.appendChild(participantsDiv);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      // Use dummy data if fetch fails
      const activities = {
        "Yoga": {
          description: "Morning yoga session",
          schedule: "Mon 7am",
          max_participants: 10,
          participants: ["alice@example.com", "bob@example.com"]
        },
        "Painting": {
          description: "Evening painting class",
          schedule: "Wed 6pm",
          max_participants: 8,
          participants: ["carol@example.com"]
        },
        "Cooking": {
          description: "Weekend cooking workshop",
          schedule: "Sat 11am",
          max_participants: 12,
          participants: []
        }
      };

      activitiesList.innerHTML = "";
      activitySelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select an activity";
      placeholder.disabled = true;
      placeholder.selected = true;
      activitySelect.appendChild(placeholder);

      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";
        const spotsLeft = details.max_participants - details.participants.length;
        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;
        const participantsDiv = document.createElement("div");
        participantsDiv.className = "activity-participants";
        participantsDiv.innerHTML = `
          <h5>Participants:</h5>
          <ul>
            ${
              details.participants.length > 0
                ? details.participants.map(email => `<li>${email}</li>`).join("")
                : "<li>No participants yet</li>"
            }
          </ul>
        `;
        activityCard.appendChild(participantsDiv);
        activitiesList.appendChild(activityCard);

        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      console.error("Error fetching activities, using dummy data:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
