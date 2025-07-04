const form = document.getElementById("form-agendamento");
const lista = document.getElementById("lista-agendamentos");
const toggleTema = document.getElementById("toggle-tema");

let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

// Aplica tema salvo
if (localStorage.getItem("tema") === "claro") {
  document.body.classList.add("claro");
  toggleTema.textContent = "🌞";
}

// Alterna tema ao clicar
toggleTema.addEventListener("click", () => {
  const isClaro = document.body.classList.toggle("claro");
  toggleTema.textContent = isClaro ? "🌞" : "🌙";
  localStorage.setItem("tema", isClaro ? "claro" : "escuro");
});

function ordenarAgendamentos() {
  agendamentos.sort((a, b) => {
    const dataA = new Date(`${a.data}T${a.hora}`);
    const dataB = new Date(`${b.data}T${b.hora}`);
    return dataA - dataB;
  });
}

function salvarLocal() {
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

function atualizarContador() {
  const hoje = new Date().toISOString().split("T")[0];
  const totalHoje = agendamentos.filter(a => a.data === hoje).length;
  const contador = document.getElementById("contador");
  if (contador) {
    contador.textContent = `📌 ${totalHoje} agendamento(s) para hoje`;
  }
}

function renderizarLista() {
  ordenarAgendamentos();
  lista.innerHTML = "";
  agendamentos.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>👤 ${item.nome}</strong><br>
      📅 ${item.data} ⏰ ${item.hora}
      <button onclick="remover(${index})">🗑️</button>
    `;
    lista.appendChild(li);
  });
  atualizarContador();
}

function remover(index) {
  agendamentos.splice(index, 1);
  salvarLocal();
  renderizarLista();
}

function estaDisponivel(data, hora) {
  return !agendamentos.some(item => item.data === data && item.hora === hora);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  if (!estaDisponivel(data, hora)) {
    alert("⚠️ Este horário já está agendado. Escolha outro.");
    return;
  }

  const novo = { nome, data, hora };
  agendamentos.push(novo);
  salvarLocal();
  renderizarLista();
  form.reset();
});

renderizarLista();
