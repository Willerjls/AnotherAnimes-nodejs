const closeModalButton = document.querySelector("#mdh003_close-modal");
const mdh003_modal_class = document.querySelector("#mdh003_modal");

const toggleModal = () => {
  mdh003_modal_class.classList.toggle("hide");
};

[closeModalButton].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});