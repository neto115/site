const form = document.getElementById('transactionForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('totalIncome');
const expenseEl = document.getElementById('totalExpense');
const ctx = document.getElementById('balanceChart').getContext('2d');

let transactions = [];
let chart = null;

form.addEventListener('submit', e => {
  e.preventDefault();
  addTransaction();
});

function addTransaction() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert('Por favor, insira uma descrição e valor válido.');
    return;
  }

  transactions.push({ desc, amount, type });
  updateUI();

  form.reset();
}

function updateUI() {
  // Atualizar lista
  transactionList.innerHTML = '';
  transactions.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.type;
    li.innerHTML = `
      <span>${t.desc}</span>
      <span>R$ ${t.amount.toFixed(2)}</span>
      <button onclick="removeTransaction(${i})">&times;</button>
    `;
    transactionList.appendChild(li);
  });

  // Calcular totais
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // Atualizar valores no DOM
  incomeEl.textContent = `R$ ${income.toFixed(2)}`;
  expenseEl.textContent = `R$ ${expense.toFixed(2)}`;
  balanceEl.textContent = `R$ ${balance.toFixed(2)}`;

  // Atualizar gráfico
  updateChart(income, expense);
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

function updateChart(income, expense) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverOffset: 30
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ctx.label + ': R$ ' + ctx.parsed } }
      }
    }
  });
}

// Inicializa UI vazia
updateUI();
