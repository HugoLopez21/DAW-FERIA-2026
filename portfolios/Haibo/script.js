//  Para el carrusel
document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("projects-track");
  const prevBtn = document.querySelector(".projects-btn.prev");
  const nextBtn = document.querySelector(".projects-btn.next");

  if (!track || !prevBtn || !nextBtn) return;

  let isAnimating = false;

  function getStep() {
    const card = track.querySelector(".project-card");
    const gap = 30;
    return card.offsetWidth + gap;
  }

  function move(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStep();

    if (direction === "next") {
      track.style.transition = "transform 0.4s ease";
      track.style.transform = `translateX(-${step}px)`;

      track.addEventListener("transitionend", () => {
        track.appendChild(track.firstElementChild);
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        isAnimating = false;
      }, { once: true });
    }

    if (direction === "prev") {
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transition = "none";
      track.style.transform = `translateX(-${step}px)`;

      setTimeout(() => {
        track.style.transition = "transform 0.4s ease";
        track.style.transform = "translateX(0)";
      }, 10);

      track.addEventListener("transitionend", () => {
        isAnimating = false;
      }, { once: true });
    }
  }

  nextBtn.addEventListener("click", () => move("next"));
  prevBtn.addEventListener("click", () => move("prev"));

});

// Para el Nav cuando bajo
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
