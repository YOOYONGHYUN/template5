// do something!
// import { observe } from "./observer";
import { store } from "./index.js";
import { observe } from "./observer.js";

function NewsList() {
  let container = document.createElement("div");
  container.classList.add("news-list-container");

  let article = document.createElement("article");
  article.classList.add("news-list");
  container.appendChild(article);
  document.querySelector("#root").appendChild(container);
  container.appendChild(article);

  let scrollObs = document.createElement("div");
  scrollObs.classList.add("scroll-observer");
  document.querySelector("#root").appendChild(scrollObs);

  function spinner() {
    const image = document.createElement("img");
    image.src = "img/ball-triangle.svg";
    image.alt = "Loading...";
    return image;
  }

  const spin = spinner();

  const showPost = (posts) => {
    posts.forEach((post) => {
      const newsItem = document.createElement("section");
      newsItem.classList.add("news-item");
      newsItem.innerHTML = `
            <div class="thumbnail">
              <a href=${post.url} target="_blank" rel="noopener noreferrer">
                <img
                  src=${post.urlToImage}
                  alt="thumbnail" />
              </a>
            </div>
            <div class="contents">
              <h2>
                <a href=${post.url} target="_blank" rel="noopener noreferrer">
                  ${post.title}
                </a>
              </h2>
              <p>
                ${post.description}
              </p>
            </div>
            `;
      article.appendChild(newsItem);
    });
  };

  let page = 0;
  let category = "all";
  const pageSize = 5;
  const apiKey = "3ba9cf6e16b349dd9ba846e5e05e0ac6";
  let url;

  observe(async () => {
    category = store.state.category;
    page = 0;
    reset();
  });

  function reset() {
    const $reset = document.querySelector(".news-list");
    $reset.innerHTML = "";
  }

  //intersaction 설정
  // option 설정
  const option = {
    root: null, //viewport
    rootMargin: "0px",
    threshold: 0.8, // 80%가 viewport에 들어와야 callback함수 실행
  };

  // callback 함수 정의
  const callback = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        page++;
        console.log(page);
        url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
          category === "all" ? "" : category
        }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
        try {
          const response = await axios.get(url);
          await showPost(response.data.articles);
          scrollObs.appendChild(spin);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  // IntersectionsObserver 생성
  const observer = new IntersectionObserver(callback, option);

  // target 관찰
  observer.observe(scrollObs);
}

export default NewsList;
