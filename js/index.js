document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const input = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = input.value.trim();

    if (username) {
      await searchUsers(username);
      input.value = "";
    }
  });

  async function searchUsers(username) {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );

      if (!response.ok) throw new Error("Error fetching users");

      const userData = await response.json();
      displayUsers(userData.items);
    } catch (error) {
      console.error("Error:", error);
      userList.innerHTML = "<li>Error fetching users. Please try again.</li>";
    }
  }

  function displayUsers(users) {
    userList.innerHTML = "";
    reposList.innerHTML = "";

    users.forEach((user) => {
      const userItem = document.createElement("li");
      userItem.innerHTML = `
                <strong>${user.login}</strong>
                <img src="${user.avatar_url}" alt="${user.login}" width="50">
                <a href="${user.html_url}" target="_blank">Profile</a>
                <button class="view-repos" onclick="fetchUserRepos('${user.login}')">View Repos</button>
            `;
      userList.appendChild(userItem);
    });
  }

  window.fetchUserRepos = async function (username) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );

      if (!response.ok) throw new Error("Error fetching repositories");

      const repoData = await response.json();
      displayRepos(repoData);
    } catch (error) {
      console.error("Error:", error);
      reposList.innerHTML =
        "<li>Error fetching repositories. Please try again.</li>";
    }
  };

  function displayRepos(repos) {
    reposList.innerHTML = "";
    if (repos.length === 0) {
      reposList.innerHTML = "<li>No repositories found.</li>";
      return;
    }
    repos.forEach((repo) => {
      const repoItem = document.createElement("li");
      repoItem.innerHTML = `
                <strong>${repo.name}</strong> - ${
        repo.description || "No description available"
      }
                <button class="view-repo" onclick="window.open('${
                  repo.html_url
                }', '_blank')">View Repo</button>
            `;
      reposList.appendChild(repoItem);
    });
  }
});
