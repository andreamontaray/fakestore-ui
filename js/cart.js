import { handleScroll, getItemsFromCart } from "./main.js";

const cart = document.querySelector(".cart");
const selectAll = document.querySelector("#select-all");

function displayCartItems() {
  let cartItems = JSON.parse(localStorage.getItem("cart"));
  if (cartItems.length !== 0) {
    cart.innerHTML = "";
    cartItems.forEach((item) => {
      const div = document.createElement("div");
      div.className =
        "cart-item flex items-center gap-4 p-4 md:p-8 lg:p-10 bg-white rounded-lg";
      div.id = item.id;
      div.innerHTML = `
            <input type="checkbox" class="cart-item-checkbox cursor-pointer" />
              <div class="w-30 h-30 md:w-40 md:h-40">
                <img
                  src="${item.image}"
                  alt=""
                  class="w-full h-full object-contain object-center"
                />
              </div>
              <div class="flex-1">
                <a
                  href="product.html?id=${item.id}"
                  class="block mb-2 text-sm md:text-[16px] lg:text-lg hover:text-[#006edb] transition-all duration-200"
                >
                  ${item.title}
                </a>
                <div class="flex items-center justify-between">
                  <strong class="price lg:text-lg">₱${(
                    item.price * 50
                  ).toLocaleString()}</strong>
                  <div class="flex items-center text-xs text-[#666]">
                    <button class="cart-qty-decrease px-1 py-.5 border border-[#ccc] rounded-l-md">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span
                      class="qty w-6 px-1 py-.5 text-center border-y-1 border-y-[#ccc]"
                      >${item.qty}</span
                    >
                    <button class="cart-qty-increase px-1 py-.5 border border-[#ccc] rounded-r-md">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <button class="remove-btn text-[#006edb] text-xs border-b border-[#006edb]">
                    Remove
                  </button>
                </div>
              </div>
          `;

      cart.appendChild(div);
    });
  }
}

function handleClick(e) {
  let cartItems = JSON.parse(localStorage.getItem("cart"));

  if (e.target.closest(".remove-btn")) {
    const itemToRemove = e.target.closest(".cart-item");

    cartItems = cartItems.filter((item) => item.id !== Number(itemToRemove.id));

    cart.removeChild(itemToRemove);

    const cartCount = document.querySelector(".cart-count");

    if (cartItems.length === 0) {
      cart.innerHTML = `<h2 class="font-bold">Your cart is empty.</h2>
      <p>
        Sign in to see if you have any saved items. Or
        <a href="/" class="underline text-[#006edb]">continue shopping</a>.
      </p>`;

      cartCount.style.display = "none";
    } else {
      cartCount.innerHTML = cartItems.length;
    }

    updateTotalPrice(cartItems);
  } else if (e.target.closest(".cart-qty-increase")) {
    cartItems.forEach((item) => {
      if (item.id === Number(e.target.closest(".cart-item").id)) {
        item.qty += 1;

        e.target.closest(".cart-item").querySelector(".qty").innerHTML =
          item.qty;

        updateTotalPrice(cartItems);
      }
    });
  } else if (e.target.closest(".cart-qty-decrease")) {
    cartItems.forEach((item) => {
      if (item.id === Number(e.target.closest(".cart-item").id)) {
        if (item.qty > 1) {
          item.qty -= 1;
        }

        e.target.closest(".cart-item").querySelector(".qty").innerHTML =
          item.qty;

        updateTotalPrice(cartItems);
      }
    });
  } else if (e.target.classList.contains("cart-item-checkbox")) {
    updateTotalPrice(cartItems);
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function selectAllItems() {
  if (document.querySelector(".cart-item")) {
    const cartItemsCheckbox = document.querySelectorAll(".cart-item-checkbox");
    let cartItems = JSON.parse(localStorage.getItem("cart"));

    if (selectAll.checked) {
      cartItemsCheckbox.forEach((item) => (item.checked = true));
      updateTotalPrice(cartItems);
    } else {
      cartItemsCheckbox.forEach((item) => (item.checked = false));
      updateTotalPrice(cartItems);
    }
  }
}

function updateTotalPrice(cartItems) {
  let prices = [];
  const cartItemsCheckbox = document.querySelectorAll(".cart-item-checkbox");

  cartItemsCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      cartItems.forEach((item) => {
        if (item.id === Number(checkbox.parentElement.id)) {
          prices.push(item.price * 50 * item.qty);
        }
      });

      if (
        [...cartItemsCheckbox].every((checkbox) => checkbox.checked === true)
      ) {
        selectAll.checked = true;
      }
    } else {
      selectAll.checked = false;
    }
  });

  document.querySelector(".total-price").innerHTML = `₱${prices
    .reduce((sum, num) => sum + num, 0)
    .toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", displayCartItems);
cart.addEventListener("click", handleClick);
selectAll.addEventListener("click", selectAllItems);
