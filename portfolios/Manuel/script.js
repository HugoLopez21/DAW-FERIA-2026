document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const burger = document.querySelector(".header__burger");
  const mobileMenu = document.querySelector(".header__mobile");

  function closeMobileMenu() {
    header.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");
  }

  burger?.addEventListener("click", () => {
    const willOpen = !header.classList.contains("is-open");
    header.classList.toggle("is-open", willOpen);
    burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", willOpen ? "false" : "true");
  });

  document.querySelectorAll(".header__mobile a").forEach((a) => {
    a.addEventListener("click", closeMobileMenu);
  });

  const tabs = Array.from(document.querySelectorAll(".projects__tab"));
  const projects = Array.from(document.querySelectorAll("#projectsGrid .project"));

  function setActiveTab(activeBtn) {
    tabs.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function filterProjects(filter) {
    projects.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;
      card.style.display = shouldShow ? "" : "none";
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setActiveTab(btn);
      filterProjects(filter);
    });
  });

  const modal = document.getElementById("pmodal");
  const modalImg = document.getElementById("pmodalImg");
  const modalTitle = document.getElementById("pmodalTitle");
  const modalDesc = document.getElementById("pmodalDesc");
  const closeEls = Array.from(modal.querySelectorAll("[data-close]"));

  function openModal({ img, title, desc }) {
    modalImg.src = img || "";
    modalImg.alt = title || "Proyecto";
    modalTitle.textContent = title || "";
    modalDesc.textContent = desc || "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  projects.forEach((card) => {
    card.addEventListener("click", () => {
      openModal({
        img: card.dataset.img,
        title: card.dataset.title,
        desc: card.dataset.desc,
      });
    });
  });

  closeEls.forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});
