/* =====================================================================
   MERLE NORMAN METUCHEN — SITE INTERACTIONS
   Mobile nav toggle, modal open/close (Reserve a Beauty Specialist /
   Mail Order), and small progressive-enhancement touches.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById("nav-burger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Modal system ----------
     Any element with [data-modal-open="modal-id"] opens the overlay
     with that id. Works for the Reserve a Beauty Specialist form and
     the Mail Order form triggers used across the homepage. */
  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    var firstField = overlay.querySelector("input, textarea, select, button");
    if (firstField) firstField.focus({ preventScroll: true });
  }

  function closeModal(overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (overlay.id === "video-modal") {
      var iframe = document.getElementById("video-modal-iframe");
      if (iframe) iframe.src = "";
    }
  }

  document.addEventListener("click", function (e) {
    var videoTile = e.target.closest("[data-video-id]");
    if (videoTile) {
      e.preventDefault();
      var id = videoTile.getAttribute("data-video-id");
      var title = videoTile.getAttribute("data-video-title") || "Treatment Video";
      var iframe = document.getElementById("video-modal-iframe");
      var titleEl = document.getElementById("video-modal-title");
      if (iframe) iframe.src = "https://player.vimeo.com/video/" + id + "?autoplay=1";
      if (titleEl) titleEl.textContent = title;
      openModal("video-modal");
      return;
    }
    var opener = e.target.closest("[data-modal-open]");
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute("data-modal-open"));
      return;
    }
    var closer = e.target.closest("[data-modal-close]");
    if (closer) {
      var overlay = closer.closest(".mn-overlay");
      if (overlay) closeModal(overlay);
      return;
    }
    if (e.target.classList && e.target.classList.contains("mn-overlay")) {
      closeModal(e.target);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".mn-overlay.open").forEach(closeModal);
    }
  });

  /* ---------- Demo form submit handling ----------
     Placeholder handler until each form is wired to the real
     opportunity-tab endpoint. Prevents a hard page reload during
     local review and gives visible confirmation. */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-form-status]");
      if (status) {
        status.textContent = "Thanks — this is a local preview, so nothing was actually sent yet. Once this form is connected to the opportunity tab, submissions will land there automatically.";
        status.style.display = "block";
      }
      form.reset();
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(".reveal, .card-grid");
  if (revealTargets.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.querySelector("header.nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        nav.style.boxShadow = "0 8px 24px -18px rgba(34,48,58,.5)";
      } else {
        nav.style.boxShadow = "none";
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
