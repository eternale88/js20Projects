const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')


// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ]

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

//Add transaction
function addTransaction(e) {
  e.preventDefault()

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount')
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: parseInt(amount.value)
    }
    transactions.push(transaction)
    addTransactionDOM(transaction)
    updateValues()

    updateLocalStorage()

    text.value = ''
    amount.value = ''
  }
}

// Generate ran id function
function generateID() {
  return Math.floor(Math.random() * 100000000)
}

// Add transactions to dom list

function addTransactionDOM(transaction) {
  //Get sign
  const sign = transaction.amount < 0 ? '-' : '+'

  const item = document.createElement('li')


  // Add class based on value type, income or expense
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')


  // Math.abs turns into positive # since we already have
  // way of identifying our sign
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
     <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `

  list.appendChild(item)
}


// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => {
    return transaction.amount
  })

  const total = amounts.reduce((acc, item) => {
    // acc is amount after each iteration, stores it in item, starts at 0
    return acc += item
  }, 0).toFixed(2) //add 2 decimal places

  const income = amounts.filter(item => item > 0)
    .reduce((acc, item) => {
      return acc += item
    }, 0).toFixed(2)


  const expense = amounts.filter(item => item < 0)
    // * -1 is to set negative # to positive, since sign will be hard coded in Dom
    .reduce((acc, item) => (acc += item), 0) * -1
      .toFixed(2)

  // put into DOM
  balance.innerText = `$${total}`
  money_plus.innerText = `$${income}`
  money_minus.innerText = `$${expense}`
}

// Remove Transaction by ID 
function removeTransaction(id) {
  transactions = transactions.filter((item) => {
    return item.id !== id
  })
  updateLocalStorage()
  init()
}

// update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}


// Init app
function init() {
  list.innerHTML = ''

  // at render, render list items to dom
  transactions.forEach(addTransactionDOM)
  updateValues()
}

init()


form.addEventListener('submit', addTransaction)


// ideas
document.addEventListener('input', (e) => {
  e.preventDefault(
 // if class of the parent is .editMode
 if (containsClass) {
    //Switch from .editMode
    //label text become the input's value
    label.innerText = editInput.value;
  } else {
    //Switch to .editMode
    //input value becomes the labels text
    editInput.value = label.innerText;
  }
  //Toggle .editMode on the parent 
  listItem.classList.toggle("editMode");
})

//For updating note, could have
// the li become an input on click
// and edit the value
// as the value was edited
// update the value
// make it toggle, between those states
// create branch for this functionality