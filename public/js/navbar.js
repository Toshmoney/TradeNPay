function aside(x){
    const mobile = document.querySelector(".mobile-page");
    mobile.classList.toggle("dashboard")
    const menu= document.querySelector(".menu")
    menu.textContent==="☰"? menu.textContent ="X" : menu.textContent ="☰"
    menu.textContent==="☰"? document.body.style.overflow = 'scroll' : document.body.style.overflow = 'hidden'
}