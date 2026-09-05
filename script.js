/* ===== Portfolio Script ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- INTRO SHARINGAN ZOOM -----
  const introOverlay = document.getElementById('introOverlay');
  document.body.classList.add('intro-active');

  // Play a deeper whoosh for the intro
  function playIntroSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      filter.type = 'lowpass';
      filter.frequency.value = 600;

      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {}
  }

  // Start intro
  if (introOverlay) {
    // Small delay so the page paints first
    requestAnimationFrame(() => {
      playIntroSound();
    });

    // After zoom animation finishes → fade out overlay & reveal site
    setTimeout(() => {
      introOverlay.classList.add('fade-out');
      document.body.classList.remove('intro-active');

      // Remove overlay from DOM after transition
      setTimeout(() => {
        introOverlay.remove();
      }, 900);
    }, 2400);
  }

  // ----- Cursor Glow -----
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // ----- Sharingan + Mangekyou + Susanoo -----
  const sharingan = document.getElementById('sharingan');
  const heroCard = document.getElementById('heroCard');
  const statusText = document.getElementById('sharinganStatus');
  const particlesContainer = document.getElementById('chakraParticles');

  let isMangekyou = false;
  let pressTimer = null;
  let longPressTriggered = false;

  // Simple chakra/activation sound using Web Audio API
  function playActivateSound(type = 'normal') {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      filter.type = 'lowpass';
      filter.frequency.value = type === 'mangekyou' ? 800 : 1200;

      if (type === 'mangekyou') {
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio not supported or blocked — silent fail
    }
  }

  // Create floating chakra particles
  function spawnParticles(count = 12) {
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'chakra-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = 60 + Math.random() * 40 + '%';
      p.style.animationDelay = (Math.random() * 2) + 's';
      p.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
      particlesContainer.appendChild(p);
    }
  }

  function setMode(mode) {
    if (!sharingan || !heroCard) return;

    sharingan.classList.remove('activated', 'mangekyou');
    heroCard.classList.remove('aura-active', 'mangekyou-aura');

    if (mode === 'normal') {
      isMangekyou = false;
      if (statusText) statusText.textContent = 'Sharingan';
      playActivateSound('normal');
    } else if (mode === 'activated') {
      isMangekyou = false;
      sharingan.classList.add('activated');
      heroCard.classList.add('aura-active');
      if (statusText) statusText.textContent = 'Sharingan Activated';
      spawnParticles(10);
      playActivateSound('normal');
    } else if (mode === 'mangekyou') {
      isMangekyou = true;
      sharingan.classList.add('mangekyou', 'activated');
      heroCard.classList.add('aura-active', 'mangekyou-aura');
      if (statusText) statusText.textContent = 'Mangekyou Sharingan';
      spawnParticles(18);
      playActivateSound('mangekyou');
    }
  }

  if (sharingan) {
    // Auto demo after intro finishes
    setTimeout(() => {
      setMode('activated');
      setTimeout(() => {
        if (!isMangekyou) setMode('normal');
      }, 2800);
    }, 3200);

    // Short click = toggle activated
    // Long press (~700ms) = Mangekyou
    const startPress = () => {
      longPressTriggered = false;
      pressTimer = setTimeout(() => {
        longPressTriggered = true;
        setMode('mangekyou');
      }, 700);
    };

    const endPress = () => {
      clearTimeout(pressTimer);
      if (!longPressTriggered) {
        if (isMangekyou) {
          setMode('normal');
        } else if (sharingan.classList.contains('activated')) {
          setMode('normal');
        } else {
          setMode('activated');
        }
      }
    };

    sharingan.addEventListener('mousedown', startPress);
    sharingan.addEventListener('mouseup', endPress);
    sharingan.addEventListener('mouseleave', () => clearTimeout(pressTimer));

    // Touch support
    sharingan.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startPress();
    }, { passive: false });
    sharingan.addEventListener('touchend', endPress);
  }

   // ----- Navbar Scroll -----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]'); // ← dipindah ke atas

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ----- Mobile Nav Toggle -----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
  // ----- Typing Effect -----
  const typedEl = document.getElementById('typedText');
  const roles = [
    'Full-Stack Developer',
    'UI/UX Designer',
    'Problem Solver',
    'Creative Thinker'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  if (typedEl) type();

 // ----- Counter Animation -----
function startCounters() {
  const counters = document.querySelectorAll('.stat-num');
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target') || 0;
    let current = 0;
    const duration = 1600;
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, stepTime);
  });
}

// Jalankan setelah intro selesai
setTimeout(startCounters, 3200);

  // ----- Skill Bars Animation -----
  const skillBars = document.querySelectorAll('.skill-progress');
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });
    }
  }

  window.addEventListener('scroll', animateSkills, { passive: true });
  animateSkills();

  // ----- Project Filter -----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ----- Back to Top -----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Contact Form -----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-check"></i> <span>Terkirim!</span>';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    });
  }

  // ----- Intersection Observer for Fade-in -----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe timeline items, project cards, skill categories
  document.querySelectorAll('.timeline-item, .project-card, .skill-category, .contact-card, .about-content, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add style for in-view
  const style = document.createElement('style');
  style.textContent = `
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
    // ----- Background Music -----
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  let isPlaying = false;

  if (bgMusic && musicToggle) {
    bgMusic.volume = 0.35; // volume pelan (35%)

    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicIcon.className = 'fas fa-music';
        isPlaying = false;
      } else {
        bgMusic.play().then(() => {
          musicToggle.classList.add('playing');
          musicIcon.className = 'fas fa-pause';
          isPlaying = true;
        }).catch((err) => {
          console.log('Gagal putar audio:', err);
          alert('Gagal memutar musik.\nPastikan file madara-theme.mp3 ada di folder yang sama dengan index.html');
        });
      }
    });
  }
});
