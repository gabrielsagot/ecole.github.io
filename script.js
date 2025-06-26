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

  // === BASE DE DONNÉES DES DÉTAILS TECHNIQUES ===
  const detailsData = {
    "cene.jpg": {
      taille: "460 × 880 cm",
      technique: "Fresque",
      lieu: "Couvent Santa Maria delle Grazie, Milan"
    },
    "joconde.webp": {
      taille: "77 × 53 cm",
      technique: "Huile sur bois",
      lieu: "Musée du Louvre"
    },
    "jeune-fille-perle.jpg": {
      taille: "44.5 × 39 cm",
      technique: "Huile sur toile",
      lieu: "Mauritshuis, La Haye"
    },
    "epoux-arnolfini.jpg": {
      taille: "82 × 60 cm",
      technique: "Huile sur bois",
      lieu: "National Gallery, Londres"
    },
    "angelots.webp": {
      taille: "Détail extrait (env. 30 × 40 cm)",
      technique: "Huile sur toile",
      lieu: "Galerie des Offices, Florence"
    },
    "tricheur.jpg": {
      taille: "106 × 146 cm",
      technique: "Huile sur toile",
      lieu: "Musée du Louvre"
    },
    "dame-hermine.webp": {
      taille: "54 × 39 cm",
      technique: "Huile sur bois",
      lieu: "Musée Czartoryski, Cracovie"
    },
    "francois-1er.jpg": {
      taille: "95 × 74 cm",
      technique: "Huile sur bois",
      lieu: "Musée du Louvre"
    },
    "liberte-peuple.jpg": {
      taille: "260 × 325 cm",
      technique: "Huile sur toile",
      lieu: "Musée du Louvre"
    }
  };

  document.querySelectorAll(".clickable-image").forEach(img => {
    img.addEventListener("click", () => {
      const section = img.closest(".artwork-section");

      modalImage.src = img.src;
      modalTitle.textContent = section.querySelector(".artwork-title")?.textContent || "";
      modalAuthor.textContent = section.querySelector(".artwork-author")?.textContent || "";
      modalDate.textContent = section.querySelector(".artwork-date")?.textContent || "";
      modalDescription.textContent = section.querySelector(".artwork-description")?.textContent || "";

      // Récupération dynamique des détails
      const filename = img.src.split("/").pop();
      const data = detailsData[filename];

      if (data) {
        technicalDetails.innerHTML = `
          <li><strong>Taille :</strong> ${data.taille}</li>
          <li><strong>Technique :</strong> ${data.technique}</li>
          <li><strong>Lieu :</strong> ${data.lieu}</li>
        `;
        console.log(`[Modale] Détails chargés pour ${filename}`);
      } else {
        technicalDetails.innerHTML = `<li>Détails techniques indisponibles.</li>`;
        console.warn(`[Modale] ⚠️ Détails manquants pour : ${filename}`);
      }

      // Affichage de la modale
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


// === VERSION MINIMALISTE & FULLSCREEN ===
document.querySelectorAll(".open-modal-btn, .open-modal-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const imgSrc = trigger.getAttribute("data-img");

    // Crée dynamiquement une div fullscreen
    const fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.classList.add("fullscreen-overlay");

    // Crée l'image
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Image agrandie";
    img.classList.add("fullscreen-image");

    // Ajoute l'image à l'overlay
    fullscreenOverlay.appendChild(img);
    document.body.appendChild(fullscreenOverlay);

    // Ferme au clic n'importe où
    fullscreenOverlay.addEventListener("click", () => {
      fullscreenOverlay.remove();
    });
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
        start: "top 100%",
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


// === TIMELINE STICKY (INTELLIGENTE) ===

// Lorsqu’on clique sur une bulle de siècle
document.querySelectorAll(".timeline-item").forEach(item => {
  item.addEventListener("click", () => {
    const century = item.dataset.century;

    // Trouve la première section qui contient ce siècle
    const targetSection = [...document.querySelectorAll(".artwork-section")]
      .find(section => section.dataset.century.split(" ").includes(century));

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth"
      });
    }

    // Mise à jour de l'affichage des bulles actives (couleurs)
    updateActiveTimelineItems([century]);
  });
});

// Lors du scroll de la page
window.addEventListener("scroll", () => {
  const centuriesInView = new Set();

  document.querySelectorAll(".artwork-section").forEach(section => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 150 && rect.bottom >= 150) {
      const centuries = section.dataset.century.split(" ");
      centuries.forEach(c => centuriesInView.add(c));
    }
  });

  updateActiveTimelineItems([...centuriesInView]);
});

// Fonction utilitaire pour mettre à jour les couleurs actives
function updateActiveTimelineItems(activeCenturies) {
  document.querySelectorAll(".timeline-item").forEach(item => {
    const isActive = activeCenturies.includes(item.dataset.century);
    item.classList.toggle("active", isActive);
  });
}



  // === INIT ÉTAT PAR DÉFAUT ===
  document.querySelector('[data-filter-author="all"]')?.classList.add("active");
  document.querySelector('[data-filter-century="all"]')?.classList.add("active");
  console.log("[Init] Filtres et modale opérationnels.");
});