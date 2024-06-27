const closeModalButton = document.querySelector("#mdh003_close-modal");
const mdh003_modal_class = document.querySelector("#mdh003_modal");
const bodyClass = document.querySelector("#content-home")
const headerClass = document.querySelector("#header")
const footerClass = document.querySelector("#footer")

const toggleModal = () => {
  mdh003_modal_class.classList.toggle("hide");
  bodyClass.classList.remove("blur")
  headerClass.classList.remove("blur")
  footerClass.classList.remove("blur")
};

[closeModalButton].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
  bodyClass.classList.add("blur")
  headerClass.classList.add("blur")
  footerClass.classList.add("blur")

});