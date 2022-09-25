'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');


const openModal = function (e) {
    /*    e.preventDefault(); */
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));




btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


/* scrolling */

btnScrollTo.addEventListener('click', function (e) {
    const s1coords = section1.getBoundingClientRect();
    console.log('link', s1coords.top);
    console.log('wP', window.pageYOffset);


    /*  window.scrollTo({
         left: s1coords.left + window.pageXOffset,
         top: s1coords.top + window.pageYOffset,
         behavior: 'smooth',
     }); */
    section1.scrollIntoView({ behavior: 'smooth' });
});

/* PAGE N A V I G A T I O N */
/* this if site has 1000+ links it would be slow see optiomized one belozw */
/* document.querySelectorAll('.nav__link').forEach(el => el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
})); */

document.querySelector('.nav__links').addEventListener('click', function (e) {
    if (e.target.classList.contains('nav__link')) {
        e.preventDefault();
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

/* TABBED COMPONENT */
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');


    if (!clicked) return;
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    /* activate content area */
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

/* MENU FADE NAVIGATION */
const handleHover = function (e, opacity) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach(el => {
            if (el !== link) el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
}

nav.addEventListener('mouseover', function (e) {
    handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
    handleHover(e, 1);
});

/* sticky navigation */

/* old way 
const Coords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
    if (window.scrollY > Coords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}); */

/* new way  */

/* const obsCallback = function (entries, observer) {
    entries.forEach(entry => {
        console.log(entry);
    });
};
const obsOptions = {
    root: null,
    threshold: [0, 0.2],
};
const observer = new IntersectionObserver
    (obsCallback, obsOptions);
observer.observe(section1); */
const header = document.querySelector('.header');
const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting)
        nav.classList.add('sticky');
    else
        nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(
    stickyNav, {
    root: null,
    threshold: 0
}
);
headerObserver.observe(header);


/* section reveal */
/* const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
}); */


/* lazy loading images */

const imgTargets = document.querySelectorAll('img[data-src]');


const LoadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    /* replace src with data-src */
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

};
const imgObserver = new IntersectionObserver(LoadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));



/* SLIIDER  */
const dotContainer = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
    slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML('beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`);
    });

};

createDots();
const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activateDot(0);

/* 0%,100%,200%,300% */


const goToSlide = function (slide) {
    slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
};





goToSlide(0);
dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
    }
});

btnright.addEventListener('click', function () {
    if (maxSlide - 1 === curSlide) {
        curSlide = 0;
    }
    else { curSlide++; }

    goToSlide(curSlide);
    activateDot(curSlide);
});

btnLeft.addEventListener('click', function () {
    if (curSlide === 0) {
        curSlide = maxSlide - 1;
    }
    else { curSlide--; }


    goToSlide(curSlide);
    activateDot(curSlide);

});

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        }
        else { curSlide--; }


        goToSlide(curSlide);
    }
    else if (e.key === 'ArrowRight') {
        if (maxSlide - 1 === curSlide) {
            curSlide = 0;
        }
        else { curSlide++; }

        goToSlide(curSlide);
    }

});







































/* random color */
/* const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
    e.preventDefault();
    this.style.backgroundColor = randomColor();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {


});
document.querySelector('.nav').addEventListener('click', function (e) {


}); */


/* const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', function (e) {
    alert('sexy lady');
}); */

















/* const message = document.createElement('div');
message.innerHTML = `HELLO SUCKERRSSSS`;
const header = document.querySelector('header');
message.insertBefore(header);
document.querySelector('btn--close--cookie').addEventListener('click', function () {



}); */

