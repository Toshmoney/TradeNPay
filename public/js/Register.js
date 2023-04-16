
const passwordInput = document.querySelector('#password');
const togglePasswordButton = document.querySelector('#toggle-password');

togglePasswordButton.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});


function handleSubmit(e){
  return true
}