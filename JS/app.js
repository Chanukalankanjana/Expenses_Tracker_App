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
    const incomesList = document.getElementById('incomes-list');
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

function editIncome(id) {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const income = incomes.find(inc => inc.id === id);

    document.getElementById('income-description').value = income.description;
    document.getElementById('income-amount').value = income.amount;
    document.getElementById('income-date').value = income.date;

    editIncomeId = id;
}

function deleteIncome(id) {
    let incomes = JSON.parse(localStorage.getItem('incomes'));
    incomes = incomes.filter(inc => inc.id !== id);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    displayIncomes();
    updateChart();
}

function addExpense() {
    const description = document.getElementById('expense-description').value;
    const amount = document.getElementById('expense-amount').value;
    const date = document.getElementById('expense-date').value;

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (editExpenseId) {
        const index = expenses.findIndex(exp => exp.id === editExpenseId);
        expenses[index] = {
            description,
            amount: parseFloat(amount).toFixed(2),
            category: selectedCategory,
            id: editExpenseId,
            date
        };
        editExpenseId = null;
    } else {
        const expense = {
            description,
            amount: parseFloat(amount).toFixed(2),
            category: selectedCategory,
            id: Date.now(),
            date
        };
        expenses.push(expense);
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateChart();
    clearExpenseForm();
}

function clearExpenseForm() {
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
    selectedCategory = 'Food';
    document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="Food"]').classList.add('active');
}

function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expensesList = document.getElementById('expenses-list');

    expensesList.innerHTML = expenses.map(exp => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h5>${exp.description}</h5>
                <small>${exp.category} - ${exp.date}</small>
            </div>
            <div>
                <span>Rs. ${exp.amount}</span>
                <div class="expense-actions">
                    <button class="btn btn-sm btn-warning" onclick="editExpense(${exp.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editExpense(id) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses.find(exp => exp.id === id);

    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-date').value = expense.date;

    editExpenseId = id;
    selectedCategory = expense.category;
    document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${selectedCategory}"]`).classList.add('active');
}



function initApp() {
    displayExpenses();
    displayIncomes();
    updateSummary();
    updateChart();
}

document.addEventListener('DOMContentLoaded', initApp);