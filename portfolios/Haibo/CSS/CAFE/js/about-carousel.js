/* CARRUSEL ABOUT (muy simple) Cambia de imagen cada 3s usando solo opacity-- */
let aboutIndex = 0;
const aboutImages = document.querySelectorAll(".about-carousel img");

function changeAboutImage() {
  if (!aboutImages.length) return;

  aboutIndex = (aboutIndex + 1) % aboutImages.length;

  aboutImages.forEach((img, i) => {
    img.style.opacity = i === aboutIndex ? "1" : "0";
  });
}

// Mostrar primera imagen
changeAboutImage();
setInterval(changeAboutImage, 3000);


/* CARRUSEL DE PRODUCTOS (simple)*/
const productTrack = document.querySelector(".product-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

if (productTrack && prevBtn && nextBtn) {

  prevBtn.addEventListener("click", () => {
    productTrack.scrollBy({ left: -300, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    productTrack.scrollBy({ left: 300, behavior: "smooth" });
  });
}


/* CARRUSEL DE TESTIMONIOS/ Aparece 1 tarjeta cada 4s */
const testimonials = document.querySelectorAll(".testimonial-card");
let testIndex = 0;

function showTestimonial() {
  if (!testimonials.length) return;

  testimonials.forEach(card => card.classList.remove("is-active"));

  testimonials[testIndex].classList.add("is-active");

  testIndex = (testIndex + 1) % testimonials.length;
}

showTestimonial();
setInterval(showTestimonial, 4000);
