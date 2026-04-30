
/*
// ==================== STATE ====================
const state = {
  currentUser: null,
  bookmarks: []
};

// ==================== DOM ====================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const userProfile = document.getElementById('userProfile');
const reposList = document.getElementById('reposList');

const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');

const bookmarkCount = document.getElementById('bookmarkCount');

// ==================== DISPLAY USER ====================
function displayUserProfile(user) {
  userProfile.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="120">
      <div>
         <h3>${user.name || user.login}</h3>
        <p>${user.bio || "No bio available"}</p>

        <div class="stats">
          <div><span>${user.followers}</span>Followers</div>
          <div><span>${user.following}</span>Following</div>
          <div><span>${user.public_repos}</span>Repos</div>
        </div>

        <button class="btn primary" onclick="addBookmark('${user.login}')">
          ⭐ Add to favoris
        </button>
        <!-- 🔗 profile link -->
        <a href="${user.html_url}" target="_blank" class="btn link">
          🔗 View Profile
        </a>
      </div>
    </div>
  `;

  userProfile.classList.remove("hidden");
  welcomeState.classList.add("hidden");
  errorState.classList.add("hidden");
}

// ==================== DISPLAY REPOS ====================

function displayRepositories(repos) {
  reposList.innerHTML = "<h3>Repositories</h3>";

    repos.slice(0, 5).forEach(repo => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="repo-info">
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description"}</p>
      </div>

      <div class="repo-stats">
        <span class="star">⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count || 0}</span>
      </div>
    `;

    reposList.appendChild(div);
  });

  reposList.classList.remove("hidden");
}
// ==================== STATES ====================
function showLoading() {
  loadingState.classList.remove("hidden");
  welcomeState.classList.add("hidden");
  errorState.classList.add("hidden");

  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
}

function showError(msg) {
  errorState.textContent = msg;
  errorState.classList.remove("hidden");

  loadingState.classList.add("hidden");
  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
}

function showWelcome() {
  welcomeState.classList.remove("hidden");

  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
}
// ==================== SEARCH ====================

async function searchUser(username) {
  try {
    showLoading();

    // 👤 USER
  
     const userResponse = await fetch(`https://api.github.com/users/${username}` ,{headers: {
                'Authorization': `token ${env.Token}`
            }});
    if (userResponse.status === 404) {
      throw new Error(`User "@${username}" not found`);
    } else if (userResponse.status === 403) {
      throw new Error("API rate limit reached. Try later");
    } else if (!userResponse.ok) {
      throw new Error("Unexpected error occurred");
    }

    const user = await userResponse.json();

    state.currentUser = user;
    displayUserProfile(user);

    // 📦 REPOS
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=5` ,{headers: {
                'Authorization': `token ${env.Token}`
            }});
    

    if (!reposResponse.ok) {
      throw new Error("Error loading repositories");
    }

    const repos = await reposResponse.json();

    displayRepositories(repos);

    loadingState.classList.add("hidden");

  } catch (error) {
    showError(error.message);
  }
}

// ==================== FAVORIS ====================
function addBookmark(login) {
  const user = state.currentUser;

  if (!user) return;

  const exists = state.bookmarks.some(u => u.login === login);
  if (exists) {
    alert("Déjà en favoris !");
    return;
  }

  state.bookmarks.push(user);

  bookmarkCount.textContent = state.bookmarks.length;

  displayBookmarks();
}

  function displayBookmarks() {
  const favList = document.querySelector(".fav-list");

  favList.innerHTML = "";

  state.bookmarks.forEach(user => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h4>${user.name || user.login}</h4>
      <p>@${user.login}</p>
    `;

    favList.appendChild(div);
  });

  document.querySelector(".favorites").classList.remove("hidden");

  // ✨ hide other sections
  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
  welcomeState.classList.add("hidden");
}


// ==================== EVENTS ====================
searchBtn.addEventListener('click', () => {
  const username = searchInput.value.trim();
  if (username) searchUser(username); // local
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    const username = searchInput.value.trim();
    if (username) searchUser(username);
  }
});


showWelcome(); 
*/
// ==================== STATE ====================
const state = {
  currentUser: null,
  bookmarks: JSON.parse(localStorage.getItem("githubBookmarks")) || [],
  isViewingBookmarks: false
};

// ==================== DOM ====================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const userProfile = document.getElementById('userProfile');
const reposList = document.getElementById('reposList');

const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');

const bookmarkCount = document.getElementById('bookmarkCount');

// ==================== LOCAL STORAGE ====================
function saveBookmarks() {
  localStorage.setItem("githubBookmarks", JSON.stringify(state.bookmarks));
}

function updateBookmarkCount() {
  bookmarkCount.textContent = state.bookmarks.length;
}

// ==================== DISPLAY USER ====================
function displayUserProfile(user) {
  userProfile.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="120">
      <div>
        <h3>${user.name || user.login}</h3>
        <p>${user.bio || "No bio available"}</p>

        <div class="stats">
          <div><span>${user.followers}</span>Followers</div>
          <div><span>${user.following}</span>Following</div>
          <div><span>${user.public_repos}</span>Repos</div>
        </div>

        <button class="btn primary" onclick="toggleBookmark()">
          ⭐ Add to favoris
        </button>

        <a href="${user.html_url}" target="_blank" class="btn link">
          🔗 View Profile
        </a>
      </div>
    </div>
  `;

  userProfile.classList.remove("hidden");
  welcomeState.classList.add("hidden");
  errorState.classList.add("hidden");

  updateBookmarkButton();
  updateBookmarkCount();
}

// ==================== DISPLAY REPOS ====================
function displayRepositories(repos) {
  reposList.innerHTML = "<h3>Repositories</h3>";

  repos.slice(0, 5).forEach(repo => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="repo-info">
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description"}</p>
      </div>

      <div class="repo-stats">
        <span class="star">⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count || 0}</span>
      </div>
    `;

    reposList.appendChild(div);
  });

  reposList.classList.remove("hidden");
}

// ==================== STATES ====================
function showLoading() {
  loadingState.classList.remove("hidden");
  welcomeState.classList.add("hidden");
  errorState.classList.add("hidden");

  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
}

function showError(msg) {
  errorState.textContent = msg;
  errorState.classList.remove("hidden");

  loadingState.classList.add("hidden");
  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
}

function showWelcome() {
  welcomeState.classList.remove("hidden");

  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");

  document.querySelector(".favorites").classList.add("hidden");
}

// ==================== SEARCH ====================
async function searchUser(username) {
  try {
    showLoading();

    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Authorization': `token ${env.Token}`
        }
      }
    );

    if (userResponse.status === 404) {
      throw new Error(`User "@${username}" not found`);
    } else if (userResponse.status === 403) {
      throw new Error("API rate limit reached. Try later");
    }

    const user = await userResponse.json();

    state.currentUser = user;
    displayUserProfile(user);

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=5`,
      {
        headers: {
          'Authorization': `token ${env.Token}`
        }
      }
    );

    const repos = await reposResponse.json();
    displayRepositories(repos);

    loadingState.classList.add("hidden");

  } catch (error) {
    showError(error.message);
  }
}

// ==================== FAVORIS ====================
function toggleBookmark() {
  const user = state.currentUser;
  if (!user) return;

  const index = state.bookmarks.findIndex(u => u.login === user.login);

  if (index === -1) {
    state.bookmarks.push(user);
  } else {
    state.bookmarks.splice(index, 1);
  }

  saveBookmarks();
  updateBookmarkCount();
  updateBookmarkButton();
}

// Add / Remove
function updateBookmarkButton() {
  const btn = document.querySelector(".profile .btn.primary");

  if (!btn || !state.currentUser) return;

  const isBookmarked = state.bookmarks.some(
    u => u.login === state.currentUser.login
  );

  btn.textContent = isBookmarked
    ? "⭐ Remove from favoris"
    : "⭐ Add to favoris";
}

//favoris
function displayBookmarks() {
  const favList = document.querySelector(".fav-list");

  favList.innerHTML = "";

  state.bookmarks.forEach(user => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div>
        <h4>${user.name || user.login}</h4>
        <p>@${user.login}</p>
      </div>

      <button class="btn" onclick="removeBookmark('${user.login}')">
        ❌ Remove
      </button>
    `;

    favList.appendChild(div);
  });

  document.querySelector(".favorites").classList.remove("hidden");

  userProfile.classList.add("hidden");
  reposList.classList.add("hidden");
  welcomeState.classList.add("hidden");

  updateBookmarkCount();
}

// حذف favoris
function removeBookmark(login) {
  state.bookmarks = state.bookmarks.filter(u => u.login !== login);

  saveBookmarks();
  displayBookmarks();
}

// toggle view
function toggleBookmarksView() {
  state.isViewingBookmarks = !state.isViewingBookmarks;

  const favSection = document.querySelector(".favorites");

  if (state.isViewingBookmarks) {
    displayBookmarks();
    favSection.classList.remove("hidden");
  } else {
    favSection.classList.add("hidden");
    showWelcome();
  }
}

// ==================== EVENTS ====================
searchBtn.addEventListener('click', () => {
  const username = searchInput.value.trim();
  if (username) searchUser(username);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    const username = searchInput.value.trim();
    if (username) searchUser(username);
  }
});

// favoris navbar
document.querySelector(".navbar .btn")
  .addEventListener("click", toggleBookmarksView);

// ==================== INIT ====================
updateBookmarkCount();
showWelcome();


