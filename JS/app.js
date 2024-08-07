document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addExpense();
});

document.getElementById('income-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addIncome();
});

document.getElementById('clear-summary-btn').addEventListener('click', function() {
    clearSummary();
});

let selectedCategory = 'Food';
let editExpenseId = null;
let editIncomeId = null;

document.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        selectedCategory = this.dataset.category;
    });
});

function addIncome() {
    const description = document.getElementById('income-description').value;
    const amount = document.getElementById('income-amount').value;
    const date = document.getElementById('income-date').value;

    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    if (editIncomeId) {
        const index = incomes.findIndex(inc => inc.id === editIncomeId);
        incomes[index] = {
            description,
            amount: parseFloat(amount).toFixed(2),
            id: editIncomeId,
            date
        };
        editIncomeId = null;
    } else {
        const income = {
            description,
            amount: parseFloat(amount).toFixed(2),
            id: Date.now(),
            date
        };
        incomes.push(income);
    }

    localStorage.setItem('incomes', JSON.stringify(incomes));
    displayIncomes();
    updateChart();
    clearIncomeForm();
}

function clearIncomeForm() {
    document.getElementById('income-description').value = '';
    document.getElementById('income-amount').value = '';
    document.getElementById('income-date').value = '';
    editIncomeId = null;
}

function displayIncomes() {
    const incomesList = document.getElementById('income-list');
    if (!incomesList) {
        console.error('Element with ID "incomes-list" not found.');
        return;
    } 

    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    incomesList.innerHTML = incomes.map(inc => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h5>${inc.description}</h5>
                <small>${inc.date}</small>
            </div>
            <div>
                <span>Rs. ${inc.amount}</span>
                <div class="income-actions">
                    <button class="btn btn-sm btn-warning" onclick="editIncome(${inc.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteIncome(${inc.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function initApp() {
    displayIncomes();
}

document.addEventListener('DOMContentLoaded', initApp);