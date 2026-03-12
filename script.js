(function () {
  const track = document.getElementById("heroTrack");
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");

  if (!track || !dots.length || !prev || !next) return;

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

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  render(0);
  startAuto();
})();