document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle with responsive feedback
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Filter Projects with smooth cross-fade & blur transition (Emil rule: mask transitions with subtle blur)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Apply slight blur and scale down on state change
        card.style.opacity = '0';
        card.style.filter = 'blur(3px)';
        card.style.transform = 'scale(0.97)';

        setTimeout(() => {
          const categories = card.getAttribute('data-category') || '';
          const match = filterValue === 'all' || categories.includes(filterValue);

          if (match) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.filter = 'blur(0px)';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.display = 'none';
          }
        }, 120);
      });
    });
  });

  // Emil rule: natural entrance using IntersectionObserver without jank
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-enter').forEach(el => {
    observer.observe(el);
  });
});
