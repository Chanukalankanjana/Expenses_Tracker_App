document.getElementById('income-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get input values
    const description = document.getElementById('income-description').value.trim();
    const amount = document.getElementById('income-amount').value.trim();
    const date = document.getElementById('income-date').value.trim();

    // Check if all fields are filled
    if (description && amount && date) {
        Swal.fire({
            title: 'Good job!',
            text: 'Income added successfully!',
            icon: 'success'
        });

        addIncome();

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill out all fields.',
            icon: 'error'
        });
    }
});

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get input values
    const description = document.getElementById('expense-description').value.trim();
    const amount = document.getElementById('expense-amount').value.trim();
    const date = document.getElementById('expense-date').value.trim();
    const category = document.querySelector('.category-item.active'); // Get the selected category

    // Check if all fields are filled and a category is selected
    if (description && amount && date && category) {
        Swal.fire({
            title: 'Good job!',
            text: 'Expense added successfully!',
            icon: 'success'
        });

        addExpense();

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill out all fields and select a category.',
            icon: 'error'
        });
    }
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

function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateChart();
}

function clearSummary() {
    document.getElementById('total-income').innerText = '0';
    document.getElementById('total-expenses').innerText = '0';
    document.getElementById('remaining-amount').innerText = '0';
}

function updateSummary() {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    const totalIncome = incomes.reduce((total, inc) => total + parseFloat(inc.amount), 0);
    const totalExpenses = expenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);
    const remainingAmount = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('remaining-amount').innerText = remainingAmount.toFixed(2);
}

function updateChart() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const categories = ['Bills', 'Vehicle', 'Clothes', 'Communication', 'Eating Out', 'Entertainment', 'Food', 'Gifts', 'Health', 'House', 'Pets', 'Sports', 'Taxi', 'Toiletry', 'Other'];

    const categoryTotals = categories.map(category => {
        return expenses
            .filter(exp => exp.category === category)
            .reduce((total, exp) => total + parseFloat(exp.amount), 0);
    });

    const totalIncome = incomes.reduce((total, inc) => total + parseFloat(inc.amount), 0);
    const totalExpenses = categoryTotals.reduce((total, amount) => total + amount, 0);
    const remainingAmount = totalIncome - totalExpenses;

    // Update chart
    const ctx = document.getElementById('expense-chart').getContext('2d');
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    const config = {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: categoryTotals,
                backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#17a2b8', '#6c757d', '#ff5733', '#33ff57', '#3357ff', '#ff33a8', '#33fff4', '#b833ff', '#ff5733', '#ff9f33', '#ffdd33']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Expense Distribution (${totalIncome.toFixed(2)}, ${totalExpenses.toFixed(2)}, ${remainingAmount.toFixed(2)})`
                }
            }
        }
    };

    window.expenseChart = new Chart(ctx, config);

    // Update income and remaining amount display
    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('remaining-amount').textContent = remainingAmount.toFixed(2);
}

function initApp() {
    displayExpenses();
    displayIncomes();
    updateSummary();
    updateChart();
}

document.addEventListener('DOMContentLoaded', initApp);