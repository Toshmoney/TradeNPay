const tog = document.querySelector('.toggle');
tog.addEventListener('click', () => {

    document.querySelector('aside').classList.toggle('close-aside');

    document.querySelector('main').classList.toggle('toggle-main')

    document.querySelectorAll('.item').forEach(element => {
        element.classList.toggle('close-item');
    });
})


const togTwo = document.querySelector('.toggle-two');
togTwo.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('nav-sub')

    document.querySelector('.toggle-two').classList.toggle('toggle-sub')

})