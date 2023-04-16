// const passwordInput = document.querySelector('input[name=password]')
// const confirmPasswordInput = document.querySelector('input[name=confirmPassword]')
// const nameInput = document.querySelector('input[name=name]')
// const emailInput = document.querySelector('input[name=email]')
// const phoneInput = document.querySelector('input[name=phoneNumber]')

// const form = document.querySelector('form')

// passwordInput.addEventListener('input', ()=> {

// })

function validateInputs() {
    let input = document.querySelectorAll("input");
    let err = document.querySelector(".error");
    let pass_err = document.querySelector(".pass-err")

    const passwordInput = document.querySelector('input[name=password]')
    const confirmPasswordInput = document.querySelector('input[name=confirmPassword]')
    const nameInput = document.querySelector('input[name=name]')
    const emailInput = document.querySelector('input[name=email]')
    const phoneInput = document.querySelector('input[name=phoneNumber]')
        
    input.forEach( (inp) => {
        if (!inp.value.trim()){
            console.log(inp.value);
            inp.style.borderColor = "red"
            err.style.display = "block"
            return false
        }
    });

    if (nameInput.value === '') {
        return false
    }
    if (phoneInput.value === '') {
        return false
    }
    if (emailInput.value === '') {
        return false
    }
    if (passwordInput.value === '') {
        return false
    }
    if (confirmPasswordInput.value === '') {
        return false
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = "red"
        passwordInput.style.borderColor = "red"
        pass_err.style.display = "block"
        console.log('passwords not equal');
        return false
    }
    else {
        console.log('ok');
        confirmPasswordInput.style.borderColor = "green"
        passwordInput.style.borderColor = "green"
        return true
    }
}
