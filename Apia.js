async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    displayPosts(data);
  } catch (error) {
    console.error("Fetch error:", error);
    displayPosts({ error: error.message });
  }
}

document.querySelectorAll(".fetch-got-quote").forEach((button) => {
  button.addEventListener("click", () => {
    displayLoading(); // Show loading indicator
    fetchData("https://api.gameofthronesquotes.xyz/v1/random");
  });
});

function displayLoading() {
  const postsContainer = document.getElementById("posts");
  if (!postsContainer) return;

  // Clear previous posts and show loading
  while (postsContainer.firstChild) {
    postsContainer.removeChild(postsContainer.firstChild);
  }

  const loadingParagraph = document.createElement("p");
  loadingParagraph.textContent = "Loading...";
  postsContainer.appendChild(loadingParagraph);
}

function displayPosts(data) {
  const postsContainer = document.getElementById("posts");
  if (!postsContainer) {
    console.error("Element with ID 'posts' not found.");
    return;
  }

  // Clear loading indicator
  while (postsContainer.firstChild) {
    postsContainer.removeChild(postsContainer.firstChild);
  }

  if (data.error) {
    const errorParagraph = document.createElement("p");
    errorParagraph.textContent = `Error fetching data: ${data.error}`;
    postsContainer.appendChild(errorParagraph);
    return;
  }

  // Handle the response from Game of Thrones API
  if (data && data.sentence && data.character) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    const postTitle = document.createElement("h2");
    postTitle.textContent = "Game of Thrones Quote";
    const postBody = document.createElement("p");
    postBody.textContent = `"${data.sentence}" - ${data.character} (${data.series})`;
    postDiv.appendChild(postTitle);
    postDiv.appendChild(postBody);
    postsContainer.appendChild(postDiv);
  } else {
    const errorParagraph = document.createElement("p");
    errorParagraph.textContent = "No quote available.";
    postsContainer.appendChild(errorParagraph);
  }
}
