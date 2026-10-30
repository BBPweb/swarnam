(() => {
  const hero = document.getElementById('swHero');
  if (!hero) return;

  /*
  =========================================
  REQUIRED SLIDE ORDER
  =========================================
  01 - Gingelly Oil
  02 - Rice Bran Oil
  03 - Puttu Podi
  04 - Coconut Oil
  =========================================
  */

  const REQUIRED_ORDER = [
    'gingelly',
    'ricebran',
    'puttupodi',
    'coconutoil'
  ];

  /*
  =========================================
  GET SLIDE WRAPPER
  =========================================
  */

  const slidesWrap =
    hero.querySelector('.sw-slides') ||
    hero.querySelector('.sw-slider') ||
    hero;

  /*
  =========================================
  REORDER ACTUAL DOM SLIDES
  =========================================
  */

  REQUIRED_ORDER.forEach(name => {
    const slide = hero.querySelector(
      `.sw-slide[data-slide="${name}"]`
    );

    if (slide) {
      slidesWrap.appendChild(slide);
    }
  });

  /*
  =========================================
  GET FINAL ORDER AFTER DOM REORDER
  =========================================
  */

  const slides = [...slidesWrap.querySelectorAll('.sw-slide')];

  if (!slides.length) return;

  /*
  =========================================
  FORCE FIRST SLIDE ACTIVE
  =========================================
  */

  slides.forEach(slide => {
    slide.classList.remove(
      'is-active',
      'cube-out-left',
      'cube-in-right',
      'cube-out-right',
      'cube-in-left'
    );
  });

  slides[0].classList.add('is-active');

  /*
  =========================================
  CONTROLS
  =========================================
  */

  const prev = document.getElementById('swPrev');
  const next = document.getElementById('swNext');
  const currentEl = document.getElementById('swCurrent');
  const progress = document.getElementById('swProgress');
  const pagination = document.getElementById('swPagination');

  /*
  =========================================
  SETTINGS
  =========================================
  */

  const AUTOPLAY = 6800;
  const CUBE_TIME = 950;

  let current = 0;
  let busy = false;
  let timer = null;
  let touchX = 0;
  let pausedByHover = false;

  hero.style.setProperty('--duration', `${AUTOPLAY}ms`);

  /*
  =========================================
  PAGINATION
  =========================================
  */

  let dots = [];

  if (pagination) {
    pagination.innerHTML = '';

    slides.forEach((slide, i) => {
      const dot = document.createElement('button');

      dot.type = 'button';

      dot.setAttribute(
        'aria-label',
        `Go to slide ${i + 1}`
      );

      dot.dataset.slideIndex = i;

      dot.addEventListener('click', () => {
        if (i === current) return;

        const direction = i > current ? 1 : -1;

        goTo(i, direction);
      });

      pagination.appendChild(dot);
    });

    dots = [...pagination.children];
  }

  /*
  =========================================
  CLEAN TRANSITION CLASSES
  =========================================
  */

  function clearMotionClasses(slide) {
    if (!slide) return;

    slide.classList.remove(
      'cube-out-left',
      'cube-in-right',
      'cube-out-right',
      'cube-in-left'
    );
  }

  /*
  =========================================
  RESET PARALLAX INLINE STYLES
  =========================================
  */

  function resetParallax(slide) {
    if (!slide) return;

    const bg = slide.querySelector('.sw-slide__bg');
    const product = slide.querySelector('.sw-product');
    const floats = slide.querySelectorAll('.sw-float');

    if (bg) {
      bg.style.marginLeft = '';
      bg.style.marginTop = '';
      bg.style.transform = '';
    }

    if (product) {
      product.style.marginLeft = '';
      product.style.marginTop = '';
    }

    floats.forEach(el => {
      el.style.translate = '';
    });
  }

  /*
  =========================================
  UPDATE UI
  =========================================
  */

  function updateUi() {
    if (currentEl) {
      currentEl.textContent =
        String(current + 1).padStart(2, '0');
    }

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle(
          'is-active',
          i === current
        );
      });
    }

    if (progress) {
      progress.classList.remove('run');

      void progress.offsetWidth;

      progress.classList.add('run');
    }
  }

  /*
  =========================================
  AUTOPLAY
  =========================================
  */

  function stopAutoplay() {
    clearTimeout(timer);
    timer = null;
  }

  function schedule() {
    stopAutoplay();

    if (pausedByHover) return;

    timer = setTimeout(() => {
      goTo(
        (current + 1) % slides.length,
        1
      );
    }, AUTOPLAY);
  }

  /*
  =========================================
  MAIN SLIDE FUNCTION
  =========================================
  */

  function goTo(index, direction = 1) {
    if (busy) return;

    index =
      (index + slides.length) %
      slides.length;

    if (index === current) {
      schedule();
      return;
    }

    busy = true;

    stopAutoplay();

    const outgoing = slides[current];
    const incoming = slides[index];

    if (!outgoing || !incoming) {
      busy = false;
      return;
    }

    /*
    Reset all old transition states
    */

    slides.forEach(slide => {
      clearMotionClasses(slide);
      resetParallax(slide);
    });

    /*
    Make incoming visible before transition
    */

    incoming.classList.add('is-active');

    /*
    Direction classes
    */

    if (direction > 0) {
      incoming.classList.add('cube-in-right');
      outgoing.classList.add('cube-out-left');
    } else {
      incoming.classList.add('cube-in-left');
      outgoing.classList.add('cube-out-right');
    }

    /*
    Finish transition
    */

    setTimeout(() => {
      outgoing.classList.remove('is-active');

      clearMotionClasses(outgoing);
      clearMotionClasses(incoming);

      current = index;
      busy = false;

      updateUi();
      schedule();

    }, CUBE_TIME + 60);
  }

  /*
  =========================================
  NEXT / PREVIOUS
  =========================================
  */

  if (next) {
    next.addEventListener('click', () => {
      goTo(current + 1, 1);
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      goTo(current - 1, -1);
    });
  }

  /*
  =========================================
  PAUSE ON HOVER
  =========================================
  */

  hero.addEventListener('mouseenter', () => {
    pausedByHover = true;
    stopAutoplay();
  });

  hero.addEventListener('mouseleave', () => {
    pausedByHover = false;

    slides.forEach(slide => {
      resetParallax(slide);
    });

    schedule();
  });

  /*
  =========================================
  TOUCH / SWIPE
  =========================================
  */

  hero.addEventListener(
    'touchstart',
    e => {
      if (!e.changedTouches.length) return;

      touchX =
        e.changedTouches[0].clientX;
    },
    {
      passive: true
    }
  );

  hero.addEventListener(
    'touchend',
    e => {
      if (!e.changedTouches.length) return;

      const endX =
        e.changedTouches[0].clientX;

      const dx =
        endX - touchX;

      if (Math.abs(dx) < 45) return;

      if (dx < 0) {
        goTo(current + 1, 1);
      } else {
        goTo(current - 1, -1);
      }
    },
    {
      passive: true
    }
  );

  /*
  =========================================
  KEYBOARD
  =========================================
  */

  document.addEventListener('keydown', e => {
    const rect = hero.getBoundingClientRect();

    const heroVisible =
      rect.bottom > 0 &&
      rect.top < window.innerHeight;

    if (!heroVisible) return;

    if (e.key === 'ArrowRight') {
      goTo(current + 1, 1);
    }

    if (e.key === 'ArrowLeft') {
      goTo(current - 1, -1);
    }
  });

  /*
  =========================================
  CURSOR PARALLAX
  =========================================
  */

  hero.addEventListener('mousemove', e => {
    if (window.innerWidth < 701) return;
    if (busy) return;

    const rect =
      hero.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) /
        rect.width) -
      0.5;

    const y =
      ((e.clientY - rect.top) /
        rect.height) -
      0.5;

    const active =
      slides[current];

    if (!active) return;

    const bg =
      active.querySelector(
        '.sw-slide__bg'
      );

    const product =
      active.querySelector(
        '.sw-product'
      );

    const floats =
      active.querySelectorAll(
        '.sw-float'
      );

    /*
    Background moves slower,
    opposite direction
    */

    if (bg) {
      bg.style.marginLeft =
        `${x * -12}px`;

      bg.style.marginTop =
        `${y * -8}px`;
    }

    /*
    Product stronger movement
    */

    if (product) {
      product.style.marginLeft =
        `${x * 18}px`;

      product.style.marginTop =
        `${y * 10}px`;
    }

    /*
    Floating elements different depths
    */

    floats.forEach((el, i) => {
      const factor =
        10 + i * 7;

      const moveX =
        x * factor;

      const moveY =
        y * factor * 0.7;

      el.style.translate =
        `${moveX}px ${moveY}px`;
    });
  });

  /*
  =========================================
  TAB VISIBILITY
  =========================================
  */

  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        schedule();
      }
    }
  );

  /*
  =========================================
  INITIALIZE
  =========================================
  */

  current = 0;

  updateUi();
  schedule();

  /*
  =========================================
  DEBUG
  Remove this after testing if you want
  =========================================
  */

  console.log(
    'Swarnam Slider Order:',
    slides.map(slide =>
      slide.dataset.slide
    )
  );

})();