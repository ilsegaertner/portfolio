document.addEventListener("click", function (event) {
  const modal = document.getElementById("menu-list");
  const isMenuOpen = !modal.classList.contains("translate-x-full");
  const clickedInsideMenu = modal.contains(event.target);
  const clickedToggleButton = event.target.closest(
    "[aria-label='Toggle Menu']"
  );

  if (isMenuOpen && !clickedInsideMenu && !clickedToggleButton) {
    closeModal();
  }
});

function openModal() {
  const blurOverlay = document.getElementById("blur-overlay");
  const modal = document.getElementById("menu-list");
  modal.classList.remove(
    "translate-x-full",
    "opacity-0",
    "pointer-events-none"
  );
  modal.classList.add("translate-x-0", "opacity-100");

  blurOverlay.classList.remove("opacity-0", "pointer-events-none");
  blurOverlay.classList.add("opacity-100");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const blurOverlay = document.getElementById("blur-overlay");
  const modal = document.getElementById("menu-list");
  modal.classList.remove("translate-x-0", "opacity-100");
  blurOverlay.classList.add("opacity-0", "pointer-events-none");
  blurOverlay.classList.remove("opacity-100");
  modal.classList.add("translate-x-full", "opacity-0", "pointer-events-none");
  document.body.style.overflow = "";
}

const cards = document.querySelectorAll(".project-list__item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card, i) => {
  card.classList.add("opacity-0");
  card.style.animationDelay = `${i * 100}ms`;
  observer.observe(card);
});
