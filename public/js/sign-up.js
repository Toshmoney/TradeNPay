document.querySelector(".submit").addEventListener("click", (e)=>{
    e.preventDefault();
    let input = document.querySelectorAll("input");
    let err = document.querySelector(".error");
    let password = document.querySelector(".password");
    let confirmPassword = document.querySelector(".confirm-password");
    let pass_err = document.querySelector(".pass-err")
    input.forEach((inp)=>{
        if (inp.value == ""){
            inp.style.borderColor = "red"
                err.style.display = "block"
        }else if(password != confirmPassword){
            confirmPassword.style.borderColor = "red"
            pass_err.style.display = "block"
        }
        else{
            inp.style.borderColor = "green"
            err.style.display ="none";
        }
    });

    e.curre

})