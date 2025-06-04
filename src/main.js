function openModal() {
  // const blurArea = document.getElementById("blur-item");
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
  // blurArea.classList.add("blur-xl");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  // const blurArea = document.getElementById("blur-item");
  const blurOverlay = document.getElementById("blur-overlay");
  const modal = document.getElementById("menu-list");
  modal.classList.remove("translate-x-0", "opacity-100");
  // blurArea.classList.remove("blur-xl");
  blurOverlay.classList.add("opacity-0", "pointer-events-none");
  blurOverlay.classList.remove("opacity-100");
  modal.classList.add("translate-x-full", "opacity-0", "pointer-events-none");
  document.body.style.overflow = "";
}
