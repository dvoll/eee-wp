// window.addEventListener('DOMContentLoaded', () => {

// })
/** @type {number} lastScrollPosition */
let lastScrollPosition = 0;
/** @type {number} newScrollPosition */
let newScrollPosition = 0;
let ticking = false;

function doSomething(scrollPos) {
    document.body.classList.toggle('body-scrolled', scrollPos > 0);
    if (scrollPos < lastScrollPosition - 8 && scrollPos >= 170) {
        document.body.classList.add('scrolled-up');
    } else if (scrollPos < 170 || scrollPos > lastScrollPosition) {
        document.body.classList.remove('scrolled-up');
    }
    // document.body.classList.toggle('scrolled-up', scrollPos < lastScrollPosition - 10 && scrollPos >= 70);
    lastScrollPosition = scrollPos;
}

document.addEventListener('scroll', (event) => {
    newScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            doSomething(newScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
});
