const main = document.querySelector("main");
const searchForm = document.querySelector(".search-form");
const filterSidebar = document.querySelector(".filter-sidebar");
const closeBtn = document.querySelector(".close-btn");
const priceFilterForm = document.querySelector(".price-filter-form");
const categories = document.querySelectorAll(".category");
const ratings = document.querySelectorAll(".rating");
const minPrice = document.querySelector(".min");
const maxPrice = document.querySelector(".max");

let categoriesSelected = [];
let ratingSelected = 0;
let priceRange = { min: 0, max: 0 };

let allSearchResults = [];
let filteredResults = [];

function handleScroll() {
  const header = document.querySelector("header");

  if (window.scrollY > 0) {
    header.classList.add("on-scroll");
  } else {
    header.classList.remove("on-scroll");
  }
}

async function fetchAPIData() {
  const res = await fetch("https://fakestoreapi.com/products/");
  const data = await res.json();

  return data;
}

async function displayProducts() {
  const products = await fetchAPIData();

  products.forEach((product) => {
    const a = createProductCard(product);
    const mensClothing = document.querySelector(".mens-clothing");

    if (mensClothing) {
      if (product.category === "men's clothing") {
        mensClothing.appendChild(a);
      } else if (product.category === "women's clothing") {
        document.querySelector(".womens-clothing").appendChild(a);
      } else if (product.category === "jewelery") {
        document.querySelector(".jewelry").appendChild(a);
      } else {
        document.querySelector(".electronics").appendChild(a);
      }
    }
  });
}

function getItemsFromCart() {
  const cartCount = document.querySelector(".cart-count");
  const cartItems = JSON.parse(localStorage.getItem("cart"));

  if (cartItems) {
    if (cartItems.length !== 0) {
      cartCount.style.display = "flex";
      cartCount.innerHTML = cartItems.length;
    }
  }
}

function createProductCard(product) {
  const a = document.createElement("a");
  a.href = `product.html?id=${product.id}`;
  a.className = "card";
  a.innerHTML = `
      <div class="image-container">
        <img
          src="${product.image}"
          alt="product-image"
          class="image"
        />
      </div>
      <div class="product-info">
        <h3 class="title">${product.title}</h3>
        <span class="price">₱${(product.price * 50).toLocaleString()}</span>
      </div>   
    `;

  return a;
}

async function searchAPIData(e) {
  e.preventDefault();

  const searchInput = document.querySelector(".search-input");
  const rightNav = document.querySelector(".right-nav");
  const products = await fetchAPIData();

  categoriesSelected = [];
  ratingSelected = 0;
  priceRange = { min: 0, max: 0 };

  let resultCount = 0;
  allSearchResults = [];
  filteredResults = [];

  main.innerHTML = "";
  main.classList.add("search");
  rightNav.classList.add("search");

  products.forEach((product) => {
    if (product.title.toLowerCase().includes(searchInput.value)) {
      resultCount += 1;
      allSearchResults.push(product);

      const a = createProductCard(product);
      main.appendChild(a);
    }
  });

  if (resultCount === 0) {
    rightNav.classList.remove("search");

    const div = document.createElement("div");
    div.innerHTML = `<h2 class="mb-2">Sorry, no matches were found.</h2>
    <p>Try a new search or browse all products on our <a href='/' class='underline text-[#006edb]'>homepage</a>.</p>`;
    main.appendChild(div);
  } else {
    displayResultCount(resultCount);
  }

  searchInput.value = "";
}

function displayResultCount(resultCount) {
  const small = document.createElement("small");
  small.className = "absolute top-[76px] left-0 px-4 text-[#6e6e73]";
  small.innerHTML = `${resultCount} results found`;
  main.appendChild(small);
}

function showFilterSidebar() {
  filterSidebar.classList.add("show");
}

function hideFilterSidebar() {
  filterSidebar.classList.remove("show");
}

function handleCategoryClick(category) {
  if (category.checked) {
    categoriesSelected.push(category.id);
  } else {
    categoriesSelected = categoriesSelected.filter(
      (categorySelected) => categorySelected !== category.id
    );
  }

  filterResults();
}

function handleRatingClick(rating) {
  if (!rating.classList.contains("click")) {
    ratings.forEach((rating) => rating.classList.remove("click"));
    rating.classList.add("click");

    ratingSelected = Number(rating.children[0].id);
  } else {
    rating.classList.remove("click");

    ratingSelected = 0;
  }

  filterResults();
}

function handlePriceSubmit(e) {
  e.preventDefault();

  if (minPrice.value !== "" && maxPrice.value !== "") {
    priceRange.min = Number(minPrice.value);
    priceRange.max = Number(maxPrice.value);
  } else {
    alert("Please input valid price range");
  }

  filterResults();
}

function filterResults() {
  filteredResults = allSearchResults.filter(
    (result) =>
      (categoriesSelected.length === 0 ||
        categoriesSelected.includes(
          result.category
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .split(" ")
            .join("-")
        )) &&
      (ratingSelected === 0 ||
        (result.rating.rate >= ratingSelected &&
          result.rating.rate < ratingSelected + 1)) &&
      ((priceRange.min === 0 && priceRange.max === 0) ||
        (result.price * 50 >= priceRange.min &&
          result.price * 50 <= priceRange.max))
  );

  renderResults(filteredResults);
}

function renderResults(results) {
  main.innerHTML = "";
  results.forEach((result) => {
    const a = createProductCard(result);
    main.appendChild(a);
  });

  displayResultCount(results.length);
}

function handleNextBtnClick(e) {
  if (e.target.parentElement.classList.contains("next-btn")) {
    const productsContainer =
      e.target.parentElement.parentElement.previousElementSibling;

    productsContainer.scrollLeft +=
      productsContainer.firstElementChild.clientWidth;
  }
}

function handlePrevBtnClick(e) {
  if (e.target.parentElement.classList.contains("prev-btn")) {
    const productsContainer =
      e.target.parentElement.parentElement.previousElementSibling;

    productsContainer.scrollLeft -=
      productsContainer.firstElementChild.clientWidth;
  }
}

function init() {
  displayProducts();
  getItemsFromCart();
}

window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", init);
document
  .querySelector(".filter-btn")
  .addEventListener("click", showFilterSidebar);

if (searchForm) searchForm.addEventListener("submit", searchAPIData);
if (closeBtn) closeBtn.addEventListener("click", hideFilterSidebar);
if (priceFilterForm)
  priceFilterForm.addEventListener("submit", handlePriceSubmit);

categories.forEach((category) => {
  category.addEventListener("change", () => {
    handleCategoryClick(category);
  });
});
ratings.forEach((rating) => {
  rating.addEventListener("click", () => handleRatingClick(rating));
});
document
  .querySelectorAll(".next-btn")
  .forEach((btn) => btn.addEventListener("click", handleNextBtnClick));
document
  .querySelectorAll(".prev-btn")
  .forEach((btn) => btn.addEventListener("click", handlePrevBtnClick));

export { handleScroll, getItemsFromCart };
