const inputFile = document.getElementById('inputFile');
const imagePreview = document.getElementById('imagePreview');

inputFile.addEventListener('change', function () {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '200px'; // Defina a altura máxima desejada

      // Limpe o conteúdo anterior da visualização
      imagePreview.innerHTML = '';

      // Adicione a imagem à visualização
      imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
  } else {
    // Limpe a visualização se nenhum arquivo for selecionado
    imagePreview.innerHTML = '';
  }
});