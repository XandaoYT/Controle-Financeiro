const lista = document.getElementById("lista-transacoes");
const saldo = document.getElementById("saldo");
const form = document.getElementById("form-transacao");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

function atualizarSaldo() {
  const total = transacoes.reduce((acc, item) => acc + item.valor, 0);
  saldo.textContent = `R$ ${total.toFixed(2)}`;
}

function salvarLocal() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function renderizarLista() {
  lista.innerHTML = "";
  transacoes.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.valor >= 0 ? "entrada" : "saida";
    li.innerHTML = `
      ${item.descricao} - R$ ${item.valor.toFixed(2)}
      <button onclick="remover(${index})" style="float:right;">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

function remover(index) {
  transacoes.splice(index, 1);
  salvarLocal();
  renderizarLista();
  atualizarSaldo();
  atualizarGrafico();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const novaTransacao = {
    descricao: descricao.value,
    valor: parseFloat(valor.value)
  };
  transacoes.push(novaTransacao);
  salvarLocal();
  renderizarLista();
  atualizarSaldo();
  atualizarGrafico();

  form.reset();
});

renderizarLista();
atualizarSaldo();
atualizarGrafico();


const ctx = document.getElementById("grafico").getContext("2d");

let grafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Entradas", "Saídas"],
    datasets: [{
      label: "Resumo Financeiro",
      data: [0, 0],
      backgroundColor: ["#4caf50", "#f44336"]
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function atualizarGrafico() {
  const entradas = transacoes
    .filter(t => t.valor > 0)
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoes
    .filter(t => t.valor < 0)
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);

  grafico.data.datasets[0].data = [entradas, saidas];
  grafico.update();
}