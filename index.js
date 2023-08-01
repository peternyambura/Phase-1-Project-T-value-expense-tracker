document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
  
    // Function to fetch expenses from the local JSON Server
    function fetchExpenses() {
      fetch('http://localhost:3000/expenses')
        .then((response) => response.json())
        .then((data) => displayExpenses(data))
        .catch((error) => console.error('Error fetching expenses:', error));
    }
  
    // Function to display expenses on the page
    function displayExpenses(expenses) {
      expenseList.innerHTML = '';
      expenses.forEach((expense) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>Date: ${expense.expenseDate}</span> | <span>Item: ${expense.itemName}</span> | <span>Amount: ${expense.itemAmount}</span> | <span>Category: ${expense.category}</span>`;
        expenseList.appendChild(listItem);
      });
    }
  
    // Function to handle form submission and add a new expense
    function addExpense(event) {
      event.preventDefault();
      const expenseDate = document.getElementById('expenseDate').value;
      const itemName = document.getElementById('itemName').value;
      const category = document.getElementById('category').value;
      const itemAmount = parseFloat(document.getElementById('itemAmount').value);
  
      const newExpense = {
        expenseDate,
        itemName,
        category,
        itemAmount,
        isDeleted: false,
      };
  
      fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Expense added successfully:', data);
          fetchExpenses();
        })
        .catch((error) => console.error('Error adding expense:', error));
    }
  
    // Add event listener to form submission
    expenseForm.addEventListener('submit', addExpense);
  
    // Fetch and display expenses on page load
    fetchExpenses();
  });
  