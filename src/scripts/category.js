import { loadHTML } from "../scripts/utils.js";

const productGrid = document.querySelector(".product-grid");
const paginationContainer = document.getElementById("pagination");

const livingRoomBtn = document.getElementById("living-room-btn");
const bedroomBtn = document.getElementById("bedroom-btn");
const diningRoomBtn = document.getElementById("dining-room-btn");

const productsPerPage = 16;
let allProducts = [];
let filteredProducts = [];

function renderProducts(page) {
  productGrid.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  productsToShow.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    let badgeHTML = "";
    if (product.discount) {
      const discountPercentage = Math.round(
        ((parseFloat(product.discount.replace(/[^0-9.-]+/g, "")) -
          parseFloat(product.price.replace(/[^0-9.-]+/g, ""))) /
          parseFloat(product.discount.replace(/[^0-9.-]+/g, ""))) *
          100
      );
      badgeHTML = `<div class="product-badge discount">${discountPercentage}%</div>`;
    } else {
      badgeHTML = `<div class="product-badge new">New</div>`;
    }

    productCard.innerHTML = `
      ${badgeHTML}
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">
          ${product.price}
          ${
            product.discount
              ? `<span class="product-discount">${product.discount}</span>`
              : ""
          }
        </p>
      </div>
      <button class="add-to-cart">Add to Cart</button>
      <div class="product-links">
        <a href="#" class="product-link"><img src="../assets/Frame 11.png" alt="Share" class="product-icon"></a>
        <a href="#" class="product-link"><img src="../assets/Frame 12.png" alt="Compare" class="product-icon"></a>
        <a href="#" class="product-link"><img src="../assets/Frame 10.png" alt="Like" class="product-icon"></a>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}

function setupPagination(totalItems) {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(totalItems / productsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn");
    if (i === 1) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      renderProducts(i);
      setActivePage(i);
    });

    paginationContainer.appendChild(pageBtn);
  }
}

function setActivePage(currentPage) {
  document.querySelectorAll(".pagination-buttons button").forEach((el, idx) => {
    el.classList.toggle("active", idx + 1 === currentPage);
  });
}

function filterByCategory(category) {
  filteredProducts = allProducts.filter((p) => p.category === category);
  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

fetch("../assets/products.json")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data.products;
    filteredProducts = allProducts;
    renderProducts(1);
    setupPagination(filteredProducts.length);
  })
  .catch((error) => console.error("Error fetching product data:", error));

livingRoomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("living-room");
});
bedroomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("bedroom");
});
diningRoomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("dining-room");
});

loadHTML("../templates/header.html", "afterbegin");
loadHTML("../templates/footer.html", "beforeend");
