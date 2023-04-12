function change() {
    document.querySelector(".open").classList.add("open-sub")
    document.querySelector(".close").classList.add("close-sub")
}
function changer(){
    document.querySelector(".open").classList.remove("open-sub")
    document.querySelector(".close").classList.remove("close-sub")
}



const passwordInput = document.querySelector('#balance');
const togglePasswordButton = document.querySelector('#toggle-balance');

togglePasswordButton.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});
