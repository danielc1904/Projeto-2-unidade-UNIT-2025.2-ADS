// CONTROLE DE ETAPAS
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
let currentStep = 0;

function showStep(i){
  steps.forEach(step => step.classList.remove("active"));
  steps[i].classList.add("active");
}

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if(currentStep < steps.length - 1){
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if(currentStep > 0){
      currentStep--;
      showStep(currentStep);
    }
  });
});

// SUBCATEGORIAS AUTOMÁTICAS
const subcategorias = {
  numismatica: ["Moedas", "Cédulas", "Medalhas"],
  brinquedos: ["Bonecas", "Carrinhos", "Jogos"],
  vinil: ["LP", "Compacto", "Coletâneas"],
  radiofonia: ["Rádios antigos", "Transmissores", "Partes e peças"]
};

const categoriaSelect = document.getElementById("categoria");
const subcategoriaSelect = document.getElementById("subcategoria");

categoriaSelect.addEventListener("change", () => {
  const cat = categoriaSelect.value;
  subcategoriaSelect.innerHTML = "";

  if(subcategorias[cat]){
    subcategorias[cat].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub.toLowerCase();
      opt.textContent = sub;
      subcategoriaSelect.appendChild(opt);
    });
  } else {
    const opt = document.createElement("option");
    opt.textContent = "Selecione uma categoria primeiro";
    subcategoriaSelect.appendChild(opt);
  }
});

// PREVIEW DAS IMAGENS
const fotosInput = document.getElementById("fotos");
const previewArea = document.getElementById("previewArea");

fotosInput.addEventListener("change", () => {
  previewArea.innerHTML = "";

  [...fotosInput.files].forEach(file => {
    const reader = new FileReader();

    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewArea.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
});

// ENVIO DO FORMULÁRIO
const form = document.getElementById("sellForm");
form.addEventListener("submit", e => {
  e.preventDefault();
  alert("Seu item foi enviado com sucesso!");
});
