console.log("hello world :o");

const dreams = [];

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const clearButton = document.querySelector("#clear-dreams");

const linkButton = document.querySelector("#view");

// request the dreams from our app's sqlite database
fetch("/getDream")
  .then((res) => res.json())
  .then((response) => {
    console.log(response);
    response.result.forEach((element) => {
      appendNewDream(element.dream);
      changeSource(element.permalink);
    });
  });

// // a helper function that creates a list item for a given dream
const appendNewDream = (dream) => {
  const newListItem = document.createElement("h1");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
};

const changeSource = (permalink) => {
  linkButton.href = permalink;
};

clearButton.addEventListener("click", (event) => {
  fetch("/getDream", {})
    .then((res) => res.json())
    .then((response) => {
      dreamsList.innerHTML = "";
      response.result.forEach((row) => {
        appendNewDream(row.dream);
        changeSource(row.permalink);
      });
    });
});
