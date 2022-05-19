// Deliverables:
// COMPLETE: 1. The index.html file has a form with a search input. When the form is submitted, it should take the value of the input and search GitHub for user matches using the User Search Endpoint.
// COMPLETE: 2. Using the results of the search, display information about the users to the page. (You might include showing their username, avatar and a link to their profile.)
// COMPLETE: 3. Clicking on one of these users should send a request to the User Repos Endpoint and return data about all the repositories for that user.
// COMPLETE: 4. Using the response from the Users Repos Endpoint, display all the repositories for that user on the page.
// COMPLETE: BONUS: Toggle the search bar between searching for users by keyword and searching for repos by keyword by adding an extra button

let userOrRepoDecision = false;

document.addEventListener("DOMContentLoaded", (e) => {
  // console.log("index.js working");
  let githubForm = document.querySelector("#github-form");
  let clearSearchButton = document.querySelector("#clear-search");
  let switchContextButton = document.querySelector("#switch-context");

  // console.log("githubForm: ", githubForm);

  githubForm.addEventListener("submit", (e) => githubFormSubmit(e));
  clearSearchButton.addEventListener("click", (e) => clearSearch(e));
  switchContextButton.addEventListener("click", (e) => switchContext(e));
});

function githubFormSubmit(e){
  // Clear search to multiple repo searches later on:
  clearSearch();
  let userList = document.querySelector("#user-list");
  let reposList = document.querySelector("#repos-list");
  e.preventDefault();
  // console.log("githubFormSubmit() function called");
  // console.log("e: ", e);
  // console.log("e.target: ", e.target);
  // console.log("typeof(e.target): ", typeof(e.target));
  // console.log("Object.keys(e.target): ", Object.keys(e.target));
  // console.log("e.target[0]: ", e.target[0]);
  // console.log("e.target[1]: ", e.target[1]);
  const searchQuery = e.target[0].value;
  // console.log("searchQuery: ", searchQuery);
  // MAIN DECISION PATH:
  // This will fire if the user decides to search for a user using 'Search User':
  if (userOrRepoDecision === false) {
  fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
    headers: {
      "Accept": "Application/vnd.github.v3+json"
    }
  })
      .then((response) => response.json())
      .then((obj) => {
        // console.log("obj: ", obj)
        // console.log("Object.keys(obj): ", Object.keys(obj));
        // console.log("obj.items: ", obj.items);
        userResults = obj.items;
        // console.log("typeof(userResults): ", typeof(userResults));
        userResults.forEach((user) => {
          // console.log("user: ", user);
          let username = user.login;
          let avatar = user.avatar_url;
          let profileLink = user.html_url;

          const userUlTag = document.createElement("ul");
          const usernameButton = document.createElement("button");
          const avatarAnchor = document.createElement("a");
          const avatarLi = document.createElement("li");
          const profileLinkAnchor = document.createElement("a");
          const profileLinkLi = document.createElement("li");
          const breakTag = document.createElement("br");

          // console.log("username: ", username);
          // console.log("avatar: ", avatar);
          // console.log("profileLink: ", profileLink);

          usernameButton.innerText = `${username}`;
          usernameButton.addEventListener("click", (e) => {
            // console.log("e: ", e);
            // console.log("typeof(e): ", typeof (e));
            // console.log("Object.keys(e): ", Object.keys(e));
            // console.log("e.target.value: ", e.target.value);

            // Use fetch() function using 'username' information:
            fetch(`https://api.github.com/users/${username}/repos`, {
              headers: {
                "Accept": "Application/vnd.github.v3+json"
              }})
              .then((response) => response.json())
              .then((reposArrayObj) => {
                // console.log("obj: ", obj);
                // console.log("typeof(obj): ", typeof(obj));
                reposList.innerHTML = "";
                reposArrayObj.forEach(repo => {
                  const repoLi = document.createElement("li");
                  const repoAnchor = document.createElement("a");

                  // console.log("repo: ", repo);
                  // console.log("repo[\"name\"]: ", repo["name"]);
                  let repoLink = profileLink + '/' + repo["name"];
                  // console.log("repoLink: ", repoLink);

                  repoAnchor.href = repoLink;
                  repoAnchor.innerText = repo["full_name"];
                  repoLi.append(repoAnchor);

                  // console.log("repoAnchor: " , repoAnchor);
                  // console.log("repoLi: ", repoLi);
                  reposList.append(repoLi);
                });
              });
          });

          avatarAnchor.href = `${avatar}`;
          avatarAnchor.innerText = "Avatar Link";
          avatarLi.append(avatarAnchor);

          profileLinkAnchor.href = `${profileLink}`;
          profileLinkAnchor.innerText = "Profile Link";
          profileLinkLi.append(profileLinkAnchor);

          userUlTag.append(usernameButton);
          userUlTag.append(avatarLi);
          userUlTag.append(profileLinkLi);
          userUlTag.append(breakTag);
          userList.append(userUlTag);
        });
      })
      .catch((error) => {
        // console.log("error: ", error.message);
      });
  }
  // This will fire if the user decides to search for a repo using 'Search Repo':
  else {
    // console.log("DECISION PATH: Search Repo chosen");
    fetch(`https://api.github.com/search/repositories?q=${searchQuery}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }})
      .then((response) => response.json())
      .then((obj) => {
        // console.log("obj: ", obj);
        // console.log("typeof(obj): ", typeof(obj));
        // console.log("Object.keys(obj): ", Object.keys(obj));

        let reposArrayObj = obj["items"];
        // console.log("reposArrayObj: ", reposArrayObj);
        reposArrayObj.forEach(repo => {
          // console.log("repo: ", repo);
          // Borrowed from previous section's code:
          const repoLi = document.createElement("li");
          const repoAnchor = document.createElement("a");

          // console.log("repo: ", repo);
          // console.log("repo[\"name\"]: ", repo["name"]);

          let repoLink = repo["html_url"];
          // console.log("repoLink: ", repoLink);

          repoAnchor.href = repoLink;
          repoAnchor.innerText = repo["full_name"];
          repoLi.append(repoAnchor);

          // console.log("repoAnchor: " , repoAnchor);
          // console.log("repoLi: ", repoLi);
          reposList.append(repoLi);
        });
      })
      .catch((error) => {
        // console.log("error: ", error.message);
      });
  }
}

function clearSearch(e) {
  // console.log("clearSearch() function called");
  // console.log("e: ", e);
  userListUl = document.querySelector("#user-list");
  reposListUl = document.querySelector("#repos-list");

  userListUl.innerHTML = "";
  reposListUl.innerHTML = "";
}

function switchContext(e) {
  // console.log("switchContext() function called");
  let githubFormInput = document.querySelector("#github-form-submit");
  if (userOrRepoDecision === false) {
    githubFormInput.value = "Search Repo Name";
    userOrRepoDecision = true
  }
  else {
    githubFormInput.value = "Search Username";
    userOrRepoDecision = false
  }
}
