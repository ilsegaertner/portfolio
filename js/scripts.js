function openModal() {
  const modal = document.getElementById("menu-list");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  // modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("menu-list");
  // modal.classList.remove("flex");
  modal.classList.add("hidden");
  // modal.style.display = "hidden";
}
