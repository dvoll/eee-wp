import Accordion from './scripts/accordion';

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
    lastScrollPosition = scrollPos;
}

document.addEventListener(
    'scroll',
    () => {
        newScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                doSomething(newScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    },
    { passive: true }
);

document.addEventListener('DOMContentLoaded', () => {
    /** @type { HTMLTemplateElement | null } */
    const template = document.querySelector('#svg-template');
    if (!template) return;

    const paragraphsWithLinkIcon = document.querySelectorAll('.eee-icon');
    paragraphsWithLinkIcon.forEach((paragraph) => {
        const result = paragraph.className.match(/eee-icon-(\S*)/);
        const iconName = result && result[1] ? result[1] : 'arrow-long-right';
        const templateClone = /** @type { HTMLElement } */ (template.content.cloneNode(true));
        const use = /** @type { SVGUseElement } */ (templateClone.querySelector('use'));

        use.setAttribute('href', '#' + iconName);
        paragraph.querySelectorAll('a').forEach((link) => link.append(templateClone));
    });

    requestAnimationFrame(() => {
        document.querySelectorAll('.wp-block-details').forEach((el) => {
            new Accordion(/** @type {HTMLDetailsElement} */ (el));
        });
    });
});
