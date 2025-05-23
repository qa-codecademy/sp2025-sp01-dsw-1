import { loadHTML } from './utils.js';

loadHTML('../templates/header.html', 'afterbegin');
loadHTML('../templates/footer.html', 'beforeend');

async function fetchProducts() {
    const response = await fetch('../assets/products.json');
    const data = await response.json();
    return data.products;
}

let cart = [
    { id: 5, quantity: 1 },
    { id: 4, quantity: 2 }
];

function parsePrice(priceStr) {
    return Number(priceStr.replace(/[^\d]/g, ''));
}

function formatCurrency(num) {
    return "Rp " + num.toLocaleString("id-ID");
}

function renderCart(products) {
    const tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((cartItem, idx) => {
        const product = products.find(p => p.id === cartItem.id);
        if (!product) return;

        const price = parsePrice(product.price);
        const itemSubtotal = price * cartItem.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement("tr");

        const productTd = document.createElement("td");
        productTd.innerHTML = `
            <div class="cart-product-info">
                <img src="${product.image}" alt="${product.name}" class="cart-product-img">
                <span class="cart-product-name">${product.name}</span>
            </div>
        `;

        const priceTd = document.createElement("td");
        priceTd.textContent = formatCurrency(price);

        const qtyTd = document.createElement("td");
        qtyTd.innerHTML = `<input type="number" min="1" max="${product.stock}" value="${cartItem.quantity}" class="cart-qty-input" data-idx="${idx}">`;

        const subtotalTd = document.createElement("td");
        subtotalTd.textContent = formatCurrency(itemSubtotal);

        const removeTd = document.createElement("td");

        row.append(productTd, priceTd, qtyTd, subtotalTd, removeTd);
        tbody.appendChild(row);
    });

    document.getElementById("subtotal-value").textContent = formatCurrency(subtotal);
    document.getElementById("total-value").textContent = formatCurrency(subtotal);
}

document.addEventListener("DOMContentLoaded", async () => {
    const products = await fetchProducts();
    renderCart(products);

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn && checkoutBtn.tagName === 'BUTTON') {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = "checkout.html";
        });
    }
});