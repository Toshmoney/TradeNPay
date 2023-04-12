document.getElementById("check").addEventListener("click", () => {
    var input = document.getElementById("input");

    if (input.type == "password") {
        input.type = "text";
        document.querySelector(".password").innerHTML = "Hide Password";
    }else{
        input.type = "password";
        document.querySelector(".password").innerHTML = "Show Password";
    }
})