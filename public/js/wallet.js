const nigerianCurrencyFormat = new Intl.NumberFormat('en-NG', {
  currency: 'NGN',
  style: 'currency',
});

const hideBalanceElement = document.querySelector('.hide-balance')
const showBalanceElement = document.querySelector('.show-balance')

const walletBalanceElement = document.querySelector('.wallet-balance')
let walletBalance = walletBalanceElement.textContent
walletBalanceElement.textContent = nigerianCurrencyFormat.format(walletBalance)

function hideBalance() {
  const balance = nigerianCurrencyFormat.format(walletBalanceElement.dataset.balance)
  let hiddenBalance = "";
  for (let index = 0; index < balance.length; index++) {
    hiddenBalance += "*"
  }
  walletBalanceElement.textContent = hiddenBalance
  document.querySelector('.balance-box').classList.add('closed')
  document.querySelector('.balance-box').classList.remove('opened')
}

function showBalance () {
  let balance = walletBalanceElement.dataset.balance
  const openBalance = nigerianCurrencyFormat.format(balance)
  walletBalanceElement.textContent = openBalance
  document.querySelector('.balance-box').classList.remove('closed')
  document.querySelector('.balance-box').classList.add('opened')
}
hideBalance()

hideBalanceElement.addEventListener('click', () => {
  hideBalance()
} )

showBalanceElement.addEventListener('click', () => {
  showBalance()
})
