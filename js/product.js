import { handleScroll } from "./main.js";

async function getProductDetails() {
  const params = new URLSearchParams(window.location.search);

  const res = await fetch(
    `https://fakestoreapi.com/products/${params.get("id")}`
  );

  const data = await res.json();
  return data;
}

async function displayProductDetails() {
  const data = await getProductDetails();
  const starRatingMask = document.querySelectorAll(
    ".rating span i:nth-of-type(2)"
  );

  document.querySelector("title").textContent = data.title;

  let categoryText = [];
  data.category.split(" ").forEach((word) => {
    categoryText.push(`${word[0].toUpperCase()}${word.substring(1)}`);
  });
  document.querySelector(".category").innerHTML = categoryText.join(" ");

  document.querySelector("i + .rating-count").innerHTML = data.rating.count;

  document.querySelector(".title").innerHTML = data.title;

  document.querySelector(".price").innerHTML = `₱${(
    data.price * 50
  ).toLocaleString()}`;

  document.querySelector(".image").src = data.image;

  document.querySelector(
    ".reviews .rating-count"
  ).innerHTML = `(${data.rating.count})`;

  document.querySelector(".rating-rate").innerHTML = data.rating.rate;

  for (let i = 0; i < Math.floor(data.rating.rate); i++) {
    starRatingMask[i].classList.add("full");
  }
  document.documentElement.style.setProperty(
    "--width",
    `${(data.rating.rate - Math.floor(data.rating.rate)) * 100}%`
  );
  starRatingMask[Math.floor(data.rating.rate)].classList.add("not-full");

  document.querySelector(".description").innerHTML = data.description;
}

async function addToCart() {
  const result = await getProductDetails();
  const cartCount = document.querySelector(".cart-count");

  let cartItems = [];

  if (localStorage.getItem("cart") === null) {
    cartItems = [];
  } else {
    cartItems = JSON.parse(localStorage.getItem("cart"));
  }

  const existingItem = cartItems.find((item) => item.id === result.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    result.qty = 1;
    cartItems.push(result);
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));

  if (cartItems.length !== 0) {
    cartCount.style.display = "flex";
    cartCount.innerHTML = cartItems.length;
  }
}

document.addEventListener("DOMContentLoaded", displayProductDetails);
document.querySelector(".add-to-cart").addEventListener("click", addToCart);
