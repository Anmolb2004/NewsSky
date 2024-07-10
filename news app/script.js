const API_KEY = "4b117d37204d0d53c6990501f5621dc4";
const url = "https://gnews.io/api/v4/search?q=";
let savedArticles = [];

window.addEventListener("load", () => {
    fetchNews("India");
    loadSavedArticles();
});

async function fetchNews(query) {
    const timestamp = new Date().getTime(); // Get current timestamp
    const res = await fetch(`${url}${query}&lang=en&country=us&max=10&apikey=${API_KEY}&timestamp=${timestamp}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const saveButton = cardClone.querySelector(".save-button");
    const shareButton = cardClone.querySelector(".share-button");

    newsImg.src = article.image;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });

    saveButton.addEventListener("click", (event) => {
        event.stopPropagation();
        saveArticle(article);
    });

    shareButton.addEventListener("click", (event) => {
        event.stopPropagation();
        shareArticle(article.url);
    });
}

function shareArticle(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this news article',
            url: url
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support the Web Share API
        prompt('Copy this link to share:', url);
    }
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Add event listener to the logo
const logo = document.getElementById("logo");
logo.addEventListener("click", () => {
    fetchNews("India"); // Default topic for home page
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

function saveArticle(article) {
    if (savedArticles.some(saved => saved.url === article.url)) return;
    savedArticles.push(article);
    renderSavedArticles();
}

function removeArticle(url) {
    savedArticles = savedArticles.filter(article => article.url !== url);
    renderSavedArticles();
}

function renderSavedArticles() {
    const savedArticlesContainer = document.getElementById("saved-articles-container");
    const savedArticleTemplate = document.getElementById("template-saved-article");

    savedArticlesContainer.innerHTML = "";

    savedArticles.forEach((article) => {
        const savedClone = savedArticleTemplate.content.cloneNode(true);
        fillDataInSavedArticle(savedClone, article);
        savedArticlesContainer.appendChild(savedClone);
    });
}

function fillDataInSavedArticle(savedClone, article) {
    const newsImg = savedClone.querySelector(".saved-news-img");
    const newsTitle = savedClone.querySelector(".saved-news-title");
    const newsSource = savedClone.querySelector(".saved-news-source");
    const newsDesc = savedClone.querySelector(".saved-news-desc");
    const removeButton = savedClone.querySelector(".remove-button");
    const shareButton = savedClone.querySelector(".share-button");

    newsImg.src = article.image;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;
    newsSource.innerHTML = article.source.name;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    removeButton.addEventListener("click", () => {
        removeArticle(article.url);
    });

    shareButton.addEventListener("click", () => {
        shareArticle(article.url);
    });
}

function loadSavedArticles() {
    const savedArticlesFromLocalStorage = JSON.parse(localStorage.getItem("saved-articles")) || [];
    savedArticles = savedArticlesFromLocalStorage;
    renderSavedArticles();
}

function saveArticlesToLocalStorage() {
    localStorage.setItem("saved-articles", JSON.stringify(savedArticles));
}

// Save to local storage whenever articles are added or removed
window.addEventListener("beforeunload", saveArticlesToLocalStorage);







