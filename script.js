(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.site-nav a');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const track = slider.querySelector('[data-slider-track]');
    const slides = Array.from(slider.querySelectorAll('[data-slide]'));
    if (!track || slides.length <= 1) {
      return;
    }

    let index = 0;
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    const dotsContainer = slider.querySelector('[data-slider-dots]');
    const dots = [];
    let timer = null;
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const slideCount = slides.length;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    const goTo = (targetIndex) => {
      index = (targetIndex + slideCount) % slideCount;
      update();
    };

    const stopAuto = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const startAuto = () => {
      if (reduceMotionQuery.matches) {
        return;
      }
      stopAuto();
      timer = window.setInterval(() => {
        goTo(index + 1);
      }, 6000);
    };

    const handleMotionChange = () => {
      if (reduceMotionQuery.matches) {
        stopAuto();
      } else {
        startAuto();
      }
    };

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleMotionChange);
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, slideIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (slideIndex === index ? ' active' : '');
        dot.setAttribute('aria-label', `切换到第 ${slideIndex + 1} 张`);
        dot.addEventListener('click', () => {
          goTo(slideIndex);
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prev) {
      prev.addEventListener('click', () => {
        goTo(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        goTo(index + 1);
      });
    }

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);
    slider.addEventListener('touchstart', stopAuto, { passive: true });
    slider.addEventListener('touchend', startAuto);

    update();
    startAuto();
  });

  const animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && animated.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animated.forEach(section => observer.observe(section));
  } else {
    animated.forEach(section => section.classList.add('visible'));
  }
})();
