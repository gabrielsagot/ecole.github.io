// === IMPORT GSAP NÉCESSAIRE ===
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  // === GESTION MODALE ===
  const modal = document.getElementById("image-modal");
  const modalContent = modal.querySelector(".modal-content");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalAuthor = document.getElementById("modal-author");
  const modalDate = document.getElementById("modal-date");
  const modalDescription = document.getElementById("modal-description");
  const modalClose = document.querySelector(".modal-close");
  const technicalDetails = document.querySelector(".technical-details");

  let modalOpen = false;

  document.querySelectorAll(".clickable-image").forEach(img => {
    img.addEventListener("click", () => {
      const section = img.closest(".artwork-section");

      modalImage.src = img.src;
      modalTitle.textContent = section.querySelector(".artwork-title")?.textContent || "";
      modalAuthor.textContent = section.querySelector(".artwork-author")?.textContent || "";
      modalDate.textContent = section.querySelector(".artwork-date")?.textContent || "";
      modalDescription.textContent = section.querySelector(".artwork-description")?.textContent || "";

      technicalDetails.innerHTML = `
        <li><strong>Taille :</strong> Environ 150 × 200 cm</li>
        <li><strong>Technique :</strong> Huile sur toile</li>
        <li><strong>Lieu :</strong> Musée du Louvre</li>
      `;

      modal.style.opacity = "0";
      modal.style.display = "flex";
      modalOpen = true;

      gsap.to(modal, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.fromTo(modalContent,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    });
  });

  function closeModal() {
    if (!modalOpen) return;

    gsap.to(modalContent, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = "none";
        modalImage.src = "";
        modalOpen = false;
      }
    });

    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  }

  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOpen) closeModal();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // === VOIR PLUS / VOIR MOINS ===
  document.querySelectorAll(".see-more-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const desc = btn.previousElementSibling;
      const isExpanded = desc.classList.toggle("expanded");
      btn.textContent = isExpanded ? "Voir moins" : "Voir plus";
    });
  });

  // === ANIMATION HEADER ===
  gsap.from(".site-header", {
    opacity: 0,
    y: -50,
    duration: 1.2,
    ease: "power4.out"
  });

  // === ANIMATION DES SECTIONS AU SCROLL ===
  document.querySelectorAll(".artwork-section").forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      }
    });
  });

  // === GESTION DES FILTRES ===
  const toggleBtn = document.getElementById("toggle-filters");
  const filterBar = document.querySelector(".filter-bar");

  let filtersVisible = false;

  toggleBtn.addEventListener("click", () => {
    filtersVisible = !filtersVisible;
    filterBar.classList.toggle("hidden");

    toggleBtn.innerHTML = `<i class="fas fa-sliders-h" style="margin-right: 0.5rem;"></i>` +
      (filtersVisible ? "Masquer les filtres" : "Afficher les filtres");

    console.log(`[Filtres] État : ${filtersVisible ? "OUVERTS" : "FERMÉS"}`);
  });

  // === FILTRAGE DES ŒUVRES ===
  const allArtworks = document.querySelectorAll(".artwork-section");
  let activeAuthor = "all";
  let activeCentury = "all";

  const authorBtns = document.querySelectorAll("[data-filter-author]");
  const centuryBtns = document.querySelectorAll("[data-filter-century]");

  authorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeAuthor = btn.getAttribute("data-filter-author");
      setActiveButton(authorBtns, btn);
      filterArtworks();
      console.log(`[Filtre Auteur] Sélection : ${activeAuthor}`);
    });
  });

  centuryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeCentury = btn.getAttribute("data-filter-century");
      setActiveButton(centuryBtns, btn);
      filterArtworks();
      console.log(`[Filtre Siècle] Sélection : ${activeCentury}`);
    });
  });

  function setActiveButton(buttons, active) {
    buttons.forEach(btn => btn.classList.remove("active"));
    active.classList.add("active");
  }

  function filterArtworks() {
    allArtworks.forEach(artwork => {
      const authors = artwork.dataset.author.split(" ");
      const centuries = artwork.dataset.century.split(" ");

      const authorMatch = activeAuthor === "all" || authors.includes(activeAuthor);
      const centuryMatch = activeCentury === "all" || centuries.includes(activeCentury);
      const shouldShow = authorMatch && centuryMatch;

      if (shouldShow) {
        gsap.to(artwork, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          display: "flex"
        });
      } else {
        gsap.to(artwork, {
          autoAlpha: 0,
          scale: 0.95,
          y: 30,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            artwork.style.display = "none";
          }
        });
      }
    });
  }

  // === INIT ÉTAT PAR DÉFAUT ===
  document.querySelector('[data-filter-author="all"]')?.classList.add("active");
  document.querySelector('[data-filter-century="all"]')?.classList.add("active");
  console.log("[Init] Filtres et modale opérationnels.");
});