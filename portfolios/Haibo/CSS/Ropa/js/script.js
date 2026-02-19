window.addEventListener("DOMContentLoaded", function () {
  /* PASO 1 · HEADER (cambia al hacer scroll) */
  var header = document.querySelector(".header");

  function headerSetScrolled(isScrolled) {
    if (isScrolled) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }

  function headerUpdateOnScroll() {
    var scrolled = window.scrollY > 40;
    headerSetScrolled(scrolled);
  }

  headerUpdateOnScroll();
  window.addEventListener("scroll", headerUpdateOnScroll, { passive: true });



  /* PASO 2 · BUSCADOR (abrir/cerrar + resultados) */

  var searchToggle = document.getElementById("search-toggle");
  var searchForm = document.getElementById("search-form");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");

  // 2.1) Leer productos desde el HTML (una sola vez)
  var productCards = document.querySelectorAll(".product-card");
  var products = [];

  function priceTextToNumber(priceText) {
    // Ejemplo: "39,99 €" -> 39.99
    var clean = priceText;
    clean = clean.replace("€", "");
    clean = clean.trim();
    clean = clean.replace(".", "");   // por si hay miles
    clean = clean.replace(",", ".");  // decimal
    var number = Number(clean);
    if (isNaN(number)) number = 0;
    return number;
  }

  function loadProductsFromHTML() {
    products = [];

    for (var i = 0; i < productCards.length; i++) {
      var card = productCards[i];

      var h3 = card.querySelector("h3");
      var priceEl = card.querySelector(".price");
      var imgEl = card.querySelector("img");

      var name = "Producto";
      if (h3) name = h3.textContent.trim();

      var price = 0;
      if (priceEl) price = priceTextToNumber(priceEl.textContent);

      var img = "";
      if (imgEl) img = imgEl.getAttribute("src");

      products.push({
        index: i,    // importante: coincide con el orden del HTML
        card: card,
        name: name,
        price: price,
        img: img
      });
    }
  }

  loadProductsFromHTML();


  // 2.2) Abrir y cerrar el buscador
  function searchOpen() {
    header.classList.add("search-open");
    setTimeout(function () {
      searchInput.focus();
    }, 80);
  }

  function searchClose() {
    header.classList.remove("search-open");
    resultsClose();
    searchInput.value = "";
  }

  function resultsOpen() {
    searchResults.classList.add("open");
  }

  function resultsClose() {
    searchResults.classList.remove("open");
    searchResults.innerHTML = "";
  }


  // 2.3) Crear un resultado HTML (una tarjeta de resultado)
  function createResultItem(product) {
    var item = document.createElement("div");
    item.className = "search-result-item";
    item.setAttribute("data-index", String(product.index));

    var html = "";
    html += '<div class="search-result-thumb">';
    html += '<img src="' + product.img + '" alt="' + product.name + '">';
    html += "</div>";

    html += '<div class="search-result-text">';
    html += '<p class="search-result-name">' + product.name + "</p>";
    html += '<p class="search-result-price">';
    html += product.price.toFixed(2).replace(".", ",") + " €";
    html += "</p>";
    html += "</div>";

    item.innerHTML = html;
    return item;
  }


  // 2.4) Pintar resultados en el desplegable según lo escrito
  function resultsRender(queryText) {
    var q = queryText.trim().toLowerCase();

    // limpiamos resultados anteriores
    searchResults.innerHTML = "";

    // si no hay texto, cerramos
    if (q === "") {
      resultsClose();
      return;
    }

    // buscamos coincidencias con un for (fácil de explicar)
    var foundAny = false;

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var nameLower = p.name.toLowerCase();

      if (nameLower.indexOf(q) !== -1) {
        foundAny = true;
        var resultEl = createResultItem(p);
        searchResults.appendChild(resultEl);
      }
    }

    // si no encontramos nada, mostramos mensaje
    if (!foundAny) {
      searchResults.innerHTML =
        '<div class="search-results-empty">No se han encontrado productos.</div>';
    }

    resultsOpen();
  }


  // 2.5) Eventos del buscador
  if (searchToggle && searchForm && searchInput && searchResults) {

    searchToggle.addEventListener("click", function () {
      if (header.classList.contains("search-open")) searchClose();
      else searchOpen();
    });

    searchInput.addEventListener("input", function () {
      resultsRender(searchInput.value);
    });

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      resultsRender(searchInput.value);
    });

    // Click en un resultado => scroll al producto
    searchResults.addEventListener("click", function (e) {
      var item = e.target.closest(".search-result-item");
      if (!item) return;

      var index = Number(item.getAttribute("data-index"));
      if (isNaN(index)) return;
      if (!products[index]) return;

      products[index].card.scrollIntoView({ behavior: "smooth", block: "center" });
      resultsClose();
    });

    // cerrar al clicar fuera
    document.addEventListener("click", function (e) {
      var clickInsideHeader = header.contains(e.target);
      var clickInsideResults = searchResults.contains(e.target);

      if (!clickInsideHeader && !clickInsideResults) {
        searchClose();
      }
    });

    // cerrar con ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") searchClose();
    });

    // si haces scroll mucho, cerramos el dropdown
    window.addEventListener("scroll", function () {
      if (window.scrollY > 80) resultsClose();
    }, { passive: true });
  }



  /* PASO 3 · IMPACTO (la sección 2 se “come” a la 1)*/

  var impacts = document.querySelectorAll(".impact");
  // Selecciona TODAS las secciones que tengan la clase .impact (devuelve una lista)
  // Solo continuamos si existen al menos 2 secciones .impact (porque necesitamos la 1 y la 2)
  if (impacts.length >= 2) {
    var impact1 = impacts[0];
    var impact2 = impacts[1];

   // 1) OVERLAY: capa oscura/efecto encima de la sección 1
    var overlay = impact1.querySelector(".impact__overlay");
    // Buscamos si ya existe un overlay dentro de la sección 1
    if (!overlay) {
      overlay = document.createElement("div");
      // Le asignamos la clase para que el CSS pueda estilizarlo (opacidad, fondo, etc.)
      overlay.className = "impact__overlay";
      impact1.appendChild(overlay);
    }

    // Guardamos referencias a elementos internos de la sección 1 (para animarlos)
     // Imagen de la sección 1 (se irá apagando y aplicando filtro)
    var impact1Img = impact1.querySelector(".impact__media img");
     // Texto/contenido de la sección 1 (se irá apagando)
    var impact1Content = impact1.querySelector(".impact__content");

    //2) FUNCIÓN UTILIDAD: limitar un valor entre 0 y 1
    function clamp01(value) {
      if (value < 0) return 0;
      if (value > 1) return 1;
      return value;
    }

    //3) FUNCIÓN PRINCIPAL: calcula el progreso del scroll y aplica estilos
    function impactUpdate() {
      // Alto visible de la ventana (viewport). Nos sirve para calcular el progreso.
      var h = window.innerHeight;

      // Posición de la sección 2 respecto a la ventana.
      // rect2.top = distancia desde arriba del viewport hasta el inicio de impact2
      var rect2 = impact2.getBoundingClientRect();

      // progresión: 0->1
      var start = h;

    // Punto final: cuando rect2.top llega a 1/4 de la pantalla desde arriba
    // (impact2 ya está bien metida y el efecto debe estar casi completo)
      var end = h * 0.25;

    // Fórmula para convertir la posición de impact2 en un progreso:
    // - Si rect2.top = start  -> p = 0
    // - Si rect2.top = end    -> p = 1
    // - Entre medias          -> p sube progresivamente
      var p = (start - rect2.top) / (start - end);

      // Nos aseguramos de que p nunca sea menor de 0 ni mayor de 1
      p = clamp01(p);

    // El overlay se vuelve más visible conforme p sube:
    // p=0 -> overlay transparente
    // p=1 -> overlay totalmente visible (según CSS)
      overlay.style.opacity = String(p);

      if (impact1Img) {
        impact1Img.style.opacity = String(1 - p * 0.85);

      // Filtro progresivo:
      // - grayscale(p): va de 0 a 1 (más gris según p)
      // - blur(p*4): de 0px a 4px (más borrosa según p)
        impact1Img.style.filter = "grayscale(" + p + ") blur(" + (p * 4) + "px)";
      }

      //Para el tecto
      if (impact1Content) {
        impact1Content.style.opacity = String(1 - p * 0.7);
      }


      //MOVIMIENTO (TRANSLATE) PARA "SUPERPOSICIÓN"
      // La sección 1 sube un poquito (hasta -20px)
      // Da sensación de que queda atrás mientras entra la sección 2
      impact1.style.transform = "translateY(" + (p * -20) + "px)";
      
      // La sección 2 sube más (hasta -80px)
      // Esto crea el efecto de que la sección 2 se "come" a la 1
      impact2.style.transform = "translateY(" + (p * -80) + "px)";
    }

    impactUpdate();
    window.addEventListener("scroll", impactUpdate, { passive: true });
  }



  /* PASO 4 · CESTA (añadir, cantidades, quitar, total) */

  var cartButton = document.getElementById("cart-button");
  var cartOverlay = document.getElementById("cart-overlay");
  var cartDrawer = document.getElementById("cart-drawer");
  var cartClose = document.getElementById("cart-close");
  var cartItems = document.getElementById("cart-items");
  var cartTotal = document.getElementById("cart-total");
  var cartCount = document.getElementById("cart-count");

  // array con productos dentro de la cesta
  // {name, price, qty, image}
  var cart = [];

  function cartSetOpen(isOpen) {
    cartOverlay.hidden = !isOpen;
    if (isOpen) cartOverlay.classList.add("open");
    else cartOverlay.classList.remove("open");

    if (isOpen) cartDrawer.classList.add("open");
    else cartDrawer.classList.remove("open");

    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  }

  function cartFindIndexByName(name) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) return i;
    }
    return -1;
  }

  function cartCountTotalUnits() {
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
      count += cart[i].qty;
    }
    return count;
  }

  function cartRender() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Tu cesta está vacía.</p>";
      cartTotal.textContent = "0,00 €";
      cartCount.textContent = "0";
      return;
    }

    var total = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      total += item.price * item.qty;

      var row = document.createElement("div");
      row.className = "cart-item";

      var html = "";
      html += '<div class="cart-item-image"><img src="' + item.image + '" alt="' + item.name + '"></div>';
      html += '<div class="cart-item-info">';
      html += "<h3>" + item.name + "</h3>";
      html += '<div class="cart-item-price">' + item.price.toFixed(2).replace(".", ",") + " €</div>";
      html += '<div class="cart-item-size">Talla: M</div>';

      html += "<div>";
      html += '<div class="cart-qty" data-index="' + i + '">';
      html += '<button type="button" data-action="decrease">−</button>';
      html += "<span>" + item.qty + "</span>";
      html += '<button type="button" data-action="increase">+</button>';
      html += "</div>";
      html += '<span class="cart-remove" data-action="remove" data-index="' + i + '">Quitar</span>';
      html += "</div>";

      html += "</div>";

      row.innerHTML = html;
      cartItems.appendChild(row);
    }

    cartTotal.textContent = total.toFixed(2).replace(".", ",") + " €";
    cartCount.textContent = String(cartCountTotalUnits());
  }

  function cartAddFromCard(card) {
    var name = card.querySelector("h3").textContent.trim();
    var price = priceTextToNumber(card.querySelector(".price").textContent);
    var image = card.querySelector("img").getAttribute("src");

    var idx = cartFindIndexByName(name);

    if (idx !== -1) {
      cart[idx].qty = cart[idx].qty + 1;
    } else {
      cart.push({ name: name, price: price, qty: 1, image: image });
    }

    cartRender();
    cartSetOpen(true);
  }

  // Botones "Añadir a la cesta"
  var addButtons = document.querySelectorAll(".btn-secundario");
  for (var b = 0; b < addButtons.length; b++) {
    addButtons[b].addEventListener("click", function (e) {
      var card = e.target.closest(".product-card");
      if (card) cartAddFromCard(card);
    });
  }

  // Abrir / cerrar
  cartButton.addEventListener("click", function () { cartSetOpen(true); });
  cartClose.addEventListener("click", function () { cartSetOpen(false); });
  cartOverlay.addEventListener("click", function () { cartSetOpen(false); });

  // Delegación: + / - / quitar (un solo listener)
  cartItems.addEventListener("click", function (e) {
    var action = e.target.getAttribute("data-action");
    if (!action) return;

    var indexText = e.target.getAttribute("data-index");

    // si el click fue en el botón +/-, el index está en el contenedor .cart-qty
    if (!indexText) {
      var qtyBox = e.target.closest(".cart-qty");
      if (qtyBox) indexText = qtyBox.getAttribute("data-index");
    }

    var index = Number(indexText);
    if (isNaN(index)) return;
    if (!cart[index]) return;

    if (action === "increase") cart[index].qty++;
    if (action === "decrease") cart[index].qty = Math.max(1, cart[index].qty - 1);
    if (action === "remove") cart.splice(index, 1);

    cartRender();
  });



  /* PASO 5 · NEWSLETTER  */
  var newsletter = document.querySelector(".newsletter-hero-form");
  if (newsletter) {
    newsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("¡Gracias por suscribirte!");
      newsletter.reset();
    });
  }



  /* PASO 6 · CARRUSEL DE TIENDAS */

  var storesTrack = document.querySelector(".stores-track");
  var slides = document.querySelectorAll(".store-slide");
  var arrows = document.querySelectorAll(".stores-arrow");

  if (storesTrack && slides.length > 0 && arrows.length > 0) {
    var current = 0;

    function slideClearClasses(slide) {
        // Quitamos todas las clases de posición para “reiniciar” la slide
        // (luego se volverán a poner según dónde deba ir cada una)
      slide.classList.remove("store-slide--center");
      slide.classList.remove("store-slide--left");
      slide.classList.remove("store-slide--right");
      slide.classList.remove("store-slide--left-far");
      slide.classList.remove("store-slide--right-far");
    }

    //2) PINTAR EL CARRUSEL (asignar clases según la slide actual)
    function carouselPaint() {
      var n = slides.length;

      for (var i = 0; i < n; i++) {
        var slide = slides[i];

         // Primero limpiamos para que no queden clases antiguas
        slideClearClasses(slide);
        

        var diff = i - current;
      // diff indica la distancia de la slide i respecto a la actual:
      // diff = 0  -> es la actual (va al centro)
      // diff = -1 -> va a la izquierda (cercana)
      // diff = 1  -> va a la derecha (cercana)
      // diff = -2 -> izquierda lejana
      // diff = 2  -> derecha lejana

      // “wrap” circular: hace que el carrusel sea “infinito”
      // Ej: si estás en la primera slide, la última debe considerarse “a la izquierda”
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;

        
      // Según el diff, añadimos la clase correspondiente
        if (diff === 0) slide.classList.add("store-slide--center");
        else if (diff === -1) slide.classList.add("store-slide--left");
        else if (diff === 1) slide.classList.add("store-slide--right");
        else if (diff === -2) slide.classList.add("store-slide--left-far");
        else if (diff === 2) slide.classList.add("store-slide--right-far");
      }
    }
    
    //3) MOVER EL CARRUSEL (cambiar el índice 'current')
    function carouselMove(direction) {
      var n = slides.length;

      if (direction === "next") {
        // Avanzar: suma 1 y vuelve a 0 cuando llega al final (módulo n)
        current = (current + 1) % n;
      } else {
        // Retroceder: resta 1 y si baja de 0 salta al final
        current = (current - 1 + n) % n;
      }

      carouselPaint();
    }

    //4) EVENTOS DE FLECHAS (click)
    for (var a = 0; a < arrows.length; a++) {
      arrows[a].addEventListener("click", function () {
        var dir = this.getAttribute("data-dir");
        carouselMove(dir);
      });
    }

    carouselPaint();
  }

});
