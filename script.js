(function () {
  const track = document.getElementById("heroTrack");
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  if (track && dots.length && prev && next) {
    let current = 0;
    let timer = null;
    const total = dots.length;

    function render(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(() => render(current + 1), 5000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    prev.addEventListener("click", () => {
      render(current - 1);
      startAuto();
    });

    next.addEventListener("click", () => {
      render(current + 1);
      startAuto();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        render(i);
        startAuto();
      });
    });

    let touchStartX = 0;

    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) render(current + (diff > 0 ? 1 : -1));
      startAuto();
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        render(current - 1);
        startAuto();
      }

      if (event.key === "ArrowRight") {
        render(current + 1);
        startAuto();
      }
    });

    render(0);
    startAuto();
  }

  if (menuToggle && mobileMenu) {
    function closeMenu() {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", trapFocus);
      menuToggle.focus();
    }

    function toggleMenu() {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (isOpen) {
        const firstLink = mobileMenu.querySelector("a");
        if (firstLink) firstLink.focus();
        document.addEventListener("keydown", trapFocus);
      } else {
        document.removeEventListener("keydown", trapFocus);
      }
    }

    function trapFocus(e) {
      if (!mobileMenu.classList.contains("is-open")) return;
      const focusables = Array.from(
        mobileMenu.querySelectorAll("a, button, [tabindex]:not([tabindex='-1'])")
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") closeMenu();
    }

    menuToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
})();