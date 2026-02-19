
/*VARIABLES*/
let cart = [];

// Elementos carrito
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Elementos de pago
const checkoutPanel = document.getElementById("checkout-panel");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutOpen = document.getElementById("checkout-open");
const checkoutClose = document.getElementById("checkout-close");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutPay = document.getElementById("checkout-pay");

// Elementos buscador
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("search-options");
const productGrid = document.getElementById("product-grid");

//Elemento aviso
const toast = document.getElementById("toast");

let originalOrder = []; // Guarda el orden original de los productos


/*QUITAR €*/

// Convierte texto "3.99€" → 3.99
function getNumber(price) {
  return parseFloat(price.replace("€", "").trim());
}

// Muestra mensaje inferior
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}


// Pintar productos del carrito
function renderCart() {
  cartItems.innerHTML = "";
  checkoutItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += getNumber(item.price);

    cartItems.innerHTML += `
      <div class="cart-card">
        <img src="${item.image}">
        <h4>${item.name}</h4>
        <p>${item.price}</p>
      </div>
    `;

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <img src="${item.image}">
        <div>${item.name}</div>
        <strong>${item.price}</strong>
      </div>
    `;
  });

  //ACTUALIZA EL CONTADOR DEL PANEL
  let palabra = "artículo";

  // Si hay más de uno (o cero), ponemos la palabra en plural
  if (cart.length !== 1) {
    palabra = "artículos";
  }

  const countText = cart.length + " " + palabra;
  document.getElementById("checkout-count").textContent = countText;


  //ACTUALIZA EL TOTAL
  cartTotal.textContent = "Total: €" + total.toFixed(2);
  checkoutTotal.textContent = "Total: €" + total.toFixed(2);
}


// Actualizar el numerito del carrito
function updateCartCount() {
  cartCount.textContent = cart.length;
}


/*AÑADIR AL CARRITO*/
function addToCart(productCard) {
  const name = productCard.querySelector(".product-title").textContent;
  const price = productCard.querySelector(".price").textContent;
  const image = productCard.querySelector("img").src;

  cart.push({ name, price, image });

  updateCartCount();
  renderCart();
  showToast(name + " añadido al carrito");
}

/* EJECUTAR FUNCION AÑADIR"*/
const botones = document.querySelectorAll(".add-to-cart");

botones.forEach(function(boton) {
  boton.addEventListener("click", function() {

    // Busca la tarjeta del producto donde está el botón
    const tarjeta = boton.closest(".product-card"); //Desde este botón, sube por el HTML hasta encontrar el primer elemento con la clase PADRE .product-card”.

    // Llama a la función que añade al carrito
    addToCart(tarjeta);

  });
});



/*CHECKOUT PANEL*/
checkoutOpen.addEventListener("click", () => {
  if (cart.length === 0) return showToast("El carrito está vacío");

  checkoutPanel.classList.add("open");
  checkoutOverlay.classList.add("show");
});

checkoutClose.addEventListener("click", closePanel);
checkoutOverlay.addEventListener("click", closePanel);

function closePanel() {
  checkoutPanel.classList.remove("open");
  checkoutOverlay.classList.remove("show");
}

// Simular pago
checkoutPay.addEventListener("click", () => {
  cart = [];
  updateCartCount();
  renderCart();
  closePanel();
  showToast("Pago realizado con éxito");
});


/*BUSCADOR*/
if (searchInput) {
  searchInput.addEventListener("input", function () {

    const texto = searchInput.value.toLowerCase();
    const productos = document.querySelectorAll(".product-card");

    productos.forEach(function (card) {
      const contenido = card.textContent.toLowerCase();

      if (contenido.includes(texto)) {
        card.style.display = "block";  
      } else {
        card.style.display = "none";   
      }
    });

  });
}



/*ORDENAR*/
if (productGrid && sortSelect) {

  // 1. Guardamos cómo estaban al principio
  const ordenOriginal = Array.from(productGrid.children);

  // 2. Cuando el usuario cambia el select:
  sortSelect.addEventListener("change", () => {

    const opcion = sortSelect.value;

    // A) Si elige Relevancia → recuperamos el orden original
    if (opcion === "relevance") {
      productGrid.innerHTML = "";
      ordenOriginal.forEach(producto => productGrid.appendChild(producto));
      return; // Detenemos aquí
    }

    // B) Si elige otra opción → ordenamos
    const productos = Array.from(productGrid.children);

    productos.sort((a, b) => {

      const nombreA = a.querySelector(".product-title").textContent;
      const nombreB = b.querySelector(".product-title").textContent;

      const precioA = getNumber(a.querySelector(".price").textContent);
      const precioB = getNumber(b.querySelector(".price").textContent);

      if (opcion === "priceAsc") return precioA - precioB; // menor a mayor
      if (opcion === "priceDesc") return precioB - precioA; // mayor a menor
      if (opcion === "nameAsc") return nombreA.localeCompare(nombreB); // A–Z
      if (opcion === "nameDesc") return nombreB.localeCompare(nombreA); // Z–A
    });

    // C) Volvemos a pintar las tarjetas en el contenedor
    productGrid.innerHTML = "";
    productos.forEach(producto => productGrid.appendChild(producto));

  });
}


/* INICIALIZACIÓN */

// Actualiza el numerito del icono del carrito al cargar la página
updateCartCount();

// Dibuja el carrito (vacío o con productos si los hubiera)
renderCart();