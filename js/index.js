// Deliverables:
// COMPLETE: 1. The index.html file has a form with a search input. When the form is submitted, it should take the value of the input and search GitHub for user matches using the User Search Endpoint.
// COMPLETE: 2. Using the results of the search, display information about the users to the page. (You might include showing their username, avatar and a link to their profile.)
// TODO: 3. Clicking on one of these users should send a request to the User Repos Endpoint and return data about all the repositories for that user.
// TODO: 4. Using the response from the Users Repos Endpoint, display all the repositories for that user on the page.

document.addEventListener("DOMContentLoaded", (e) => {
  console.log("index.js working");
  let githubForm = document.querySelector("#github-form");
  console.log("githubForm: ", githubForm);
  githubForm.addEventListener("submit", (e) => githubFormSubmit(e));
});

function githubFormSubmit(e){
  let userList = document.querySelector("#user-list");
  e.preventDefault();
  console.log("githubFormSubmit() function called")
  console.log("e: ", e);
  console.log("e.target: ", e.target);
  // console.log("typeof(e.target): ", typeof(e.target));
  // console.log("Object.keys(e.target): ", Object.keys(e.target));
  console.log("e.target[0]: ", e.target[0]);
  // console.log("e.target[1]: ", e.target[1]);
  const searchQuery = e.target[0].value;
  console.log("searchQuery: ", searchQuery);
  fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
    headers: {
      "Accept": "Application/vnd.github.v3+json"
    }})
    .then((response) => response.json())
    .then((obj) => {
      console.log("obj: ", obj)
      console.log("Object.keys(obj): ", Object.keys(obj));
      console.log("obj.items: ", obj.items);
      userResults = obj.items;
      console.log("typeof(userResults): ", typeof(userResults));
      userResults.forEach((user) => {
        console.log("user: ", user);
        let username = user.login;
        let avatar = user.avatar_url;
        let profileLink = user.html_url;


        const userUlTag = document.createElement("ul");
        const usernameLi = document.createElement("li");
        const avatarAnchor = document.createElement("a");
        const avatarLi = document.createElement("li");
        const profileLinkAnchor = document.createElement("a");
        const profileLinkLi = document.createElement("li");
        const breakTag = document.createElement("br");

        console.log("username: ", username);
        console.log("avatar: ", avatar);
        console.log("profileLink: ", profileLink);

        usernameLi.textContent = `Username: ${username}`

        avatarAnchor.href = `${avatar}`;
        avatarAnchor.innerText = "Avatar Link";
        avatarLi.append(avatarAnchor);

        profileLinkAnchor.href = `${profileLink}`
        profileLinkAnchor.innerText = "Profile Link";
        profileLinkLi.append(profileLinkAnchor);

        userUlTag.append(usernameLi);
        userUlTag.append(avatarLi);
        userUlTag.append(profileLinkLi);
        userUlTag.append(breakTag);

        userList.append(userUlTag);
      });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}
