const tog = document.querySelector('.toggle');
tog.addEventListener('click', () => {

    document.querySelector('aside').classList.toggle('close-aside');

    document.querySelector('main').classList.toggle('toggle-main')

    document.querySelectorAll('.item').forEach(element => {
        element.classList.toggle('close-item');
    });
})

const mobileToggle = document.querySelector('.mobile-toggle') 
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open')
    document.querySelector('aside').classList.toggle('open');
})