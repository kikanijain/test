
/* =========================================================
   BIZVOICE — HOMEPAGE INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownTrigger = document.querySelector(".dropdown-trigger");
  const navLinks = document.querySelectorAll(".primary-nav a");
  const currentYear = document.getElementById("current-year");

  /* -------------------------
     AUTOMATIC COPYRIGHT YEAR
  -------------------------- */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* -------------------------
     MOBILE NAVIGATION
  -------------------------- */

  function closeMobileMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMobileMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    primaryNav.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }

  /* -------------------------
     COMPANY DROPDOWN
  -------------------------- */

  function closeDropdown() {
    if (!dropdown || !dropdownTrigger) return;

    dropdown.classList.remove("is-open");
    dropdownTrigger.setAttribute("aria-expanded", "false");
  }

  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = dropdown.classList.contains("is-open");

      dropdown.classList.toggle("is-open", !isOpen);
      dropdownTrigger.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        closeDropdown();
      }
    });

    dropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
      link.addEventListener("click", closeDropdown);
    });
  }

  /* -------------------------
     ESCAPE KEY SUPPORT
  -------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeMobileMenu();
    closeDropdown();
  });

  /* -------------------------
     SCROLL REVEAL
  -------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* -------------------------
     ACTIVE NAVIGATION STATE
  -------------------------- */

  const sections = document.querySelectorAll(
    "main section[id], main section:not([id])"
  );

  const mainNavLinks = document.querySelectorAll(
    '.primary-nav > a[href^="#"]'
  );

  if ("IntersectionObserver" in window && mainNavLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.getAttribute("id");

          if (!sectionId) return;

          mainNavLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      if (section.id) {
        sectionObserver.observe(section);
      }
    });
  }

  /* -------------------------
     FAQ KEYBOARD / DETAILS
     Native <details> handles the
     open and close interaction.
  -------------------------- */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");

    if (!summary) return;

    summary.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.open = !item.open;
      }
    });
  });

  /* -------------------------
     SMOOTH INTERNAL LINKS
     Native CSS smooth scrolling
     is used; close mobile menu
     before navigating.
  -------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      closeMobileMenu();
      closeDropdown();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      if (targetId !== "#top") {
        history.replaceState(null, "", targetId);
      }
    });
  });
});
