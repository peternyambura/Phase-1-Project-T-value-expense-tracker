document.addEventListener('DOMContentLoaded', () => {
  const savingsInput = document.getElementById('savingsInput');
  const setSavingsButton = document.getElementById('setSavingsButton');
  const savingsProgressBar = document.getElementById('savingsProgressBar');

  const budgetInput = document.getElementById('budgetInput');
  const expenseNameInput = document.getElementById('expenseNameInput');
  const expenseAmountInput = document.getElementById('expenseAmountInput');
  const addExpenseButton = document.getElementById('addExpenseButton');
  const expensesList = document.getElementById('expensesList');

  const categoryDropdown = document.getElementById('categoryDropdown');
  const categoryInput = document.getElementById('categoryInput');
  const addCategoryButton = document.getElementById('addCategoryButton');
  const categoryList = document.getElementById('categoryList');

  // Initialize savings, expenses, and categories
  let savings = 0;
  let expenses = [];
  let categories = [];

  // Load data from localStorage if available
  const savedSavings = localStorage.getItem('savings');
  const savedExpenses = localStorage.getItem('expenses');
  const savedCategories = localStorage.getItem('categories');

  if (savedSavings) {
    savings = parseFloat(savedSavings);
    savingsInput.value = savings;
    updateSavingsProgressBar();
  }

  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
    updateExpensesList();
  }

  if (savedCategories) {
    categories = JSON.parse(savedCategories);
    updateCategoryDropdown();
    updateCategoryList();
  }

  setSavingsButton.addEventListener('click', () => {
    savings = parseFloat(savingsInput.value);
    localStorage.setItem('savings', savings);
    updateSavingsProgressBar();
  });

  addExpenseButton.addEventListener('click', () => {
    const expenseName = expenseNameInput.value.trim();
    if (expenseName === '') return;

    const expenseAmount = parseFloat(expenseAmountInput.value);
    if (isNaN(expenseAmount)) return;

    const selectedCategory = categoryDropdown.value;
    const isIncome = expenseAmount >= 0; // Determine if it's income or expense

    expenses.push({ name: expenseName, amount: expenseAmount, category: selectedCategory, isIncome });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateExpensesList();

  });

  addCategoryButton.addEventListener('click', () => {
    const category = categoryInput.value.trim();
    if (category === '') return;

    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateCategoryDropdown();
    updateCategoryList();
  });

  function updateSavingsProgressBar() {
    const currentSavings = parseFloat(savingsInput.value);
    const percentage = (currentSavings / savings) * 100;
    savingsProgressBar.style.width = `${percentage}%`;
  }

  function updateExpensesList() {
    expensesList.innerHTML = '';
    let totalExpenses = 0;

    for (const expense of expenses) {
      const listItem = document.createElement('li');
      listItem.textContent = `${expense.name}: $${expense.amount.toFixed(2)} (${expense.category})`;
      
      // delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      listItem.appendChild(deleteButton);

      // delete expense event
      deleteButton.addEventListener('click', () => {
        deleteExpense(expense);
      });

      expensesList.appendChild(listItem);
      totalExpenses += expense.amount;
    }

    const remainingBudget = parseFloat(budgetInput.value) - totalExpenses;
    if (!isNaN(remainingBudget)) {
      savingsInput.value = remainingBudget;
      localStorage.setItem('savings', remainingBudget);
      updateSavingsProgressBar();
    }
  }

  function updateCategoryDropdown() {
    categoryDropdown.innerHTML = '<option value="" disabled selected>Select a category</option>';

    for (const category of categories) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryDropdown.appendChild(option);
    }
  }

  function updateCategoryList() {
    categoryList.innerHTML = '';

    for (const category of categories) {
      const listItem = document.createElement('li');
      listItem.textContent = category;
      categoryList.appendChild(listItem);
    }
  }


  // Function to delete an expense
  function deleteExpense(expense) {
    const index = expenses.indexOf(expense);
    if (index !== -1) {
      expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      updateExpensesList();
    }
  }
});
