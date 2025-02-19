const escondeDropdown = () => {
  const dropdown_navbar = document.querySelector(".dropdown_navbar");
  if (dropdown_navbar.style.display === "none") {
    dropdown_navbar.style.display = "flex";
  }
  else {
    dropdown_navbar.style.display = "none";
  }
}