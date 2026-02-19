// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// Cerrar menu al hacer click en un link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

// Particles.js configuration
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#d4af37",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3,
      random: true,
    },
    size: {
      value: 3,
      random: true,
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#d4af37",
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.5,
        },
      },
      push: {
        particles_nb: 4,
      },
    },
  },
});

window.addEventListener("load", function () {
  // TYPED.JS - Efecto de escritura
  if (typeof Typed !== "undefined") {
    const typed = new Typed("#typed", {
      strings: ["UI/UX Designer", "Frontend Developer", "Web Designer"],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  // VANILLA TILT.JS - Efecto 3D
  if (typeof VanillaTilt !== "undefined") {
    // Skill cards
    VanillaTilt.init(document.querySelectorAll(".skill-card"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });

    // Project cards
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });

    // Stat cards
    VanillaTilt.init(document.querySelectorAll(".stat-card"), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
    });
  }
});
