const noticias = JSON.parse(localStorage.getItem("noticias")) || [];

function salvar() {
  localStorage.setItem("noticias", JSON.stringify(noticias));
}

if (location.pathname.includes("admin.html") && localStorage.getItem("logado") !== "true") {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("logado");
    window.location.href = "login.html";
  });
}

const form = document.getElementById("form-noticia");
const lista = document.getElementById("lista-admin");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;
    const imagemInput = document.getElementById("imagem");
    const editIndex = document.getElementById("edit-index").value;

    let imagem = "";
    if (imagemInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        imagem = reader.result;
        salvarNoticia();
      };
      reader.readAsDataURL(imagemInput.files[0]);
    } else {
      salvarNoticia();
    }

    function salvarNoticia() {
      if (editIndex) {
        noticias[editIndex] = { titulo, conteudo, imagem };
        document.getElementById("edit-index").value = "";
      } else {
        noticias.push({ titulo, conteudo, imagem });
      }
      salvar();
      form.reset();
      renderAdmin();
    }
  });
}

function renderAdmin() {
  if (!lista) return;
  lista.innerHTML = noticias.map((n, i) => `
    <div class="card">
      <h3>${n.titulo}</h3>
      ${n.imagem ? `<img src="${n.imagem}" style="max-width:100%; border-radius:8px; margin:10px 0;">` : ""}
      <p>${n.conteudo}</p>
      <button onclick="editar(${i})">✏️ Editar</button>
      <button onclick="excluir(${i})">🗑️ Excluir</button>
    </div>
  `).join("");
}

function editar(i) {
  const n = noticias[i];
  document.getElementById("titulo").value = n.titulo;
  document.getElementById("conteudo").value = n.conteudo;
  document.getElementById("edit-index").value = i;
}

function excluir(i) {
  if (confirm("Deseja realmente excluir esta notícia?")) {
    noticias.splice(i, 1);
    salvar();
    renderAdmin();
  }
}

renderAdmin();