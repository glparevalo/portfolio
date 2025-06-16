// 🍔 Mobile burger menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', !expanded);
  navLinks.classList.toggle('active');
});


// 🌗 Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
  document.body.classList.add('dark');
}
updateGlowColor();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
  setTimeout(updateGlowColor, 300);
});
function updateGlowColor() {
  const isDark = document.body.classList.contains('dark');
  const color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(230, 0, 255, 0.6)';
  document.body.style.setProperty('--glow-color', color);
}

// 🌌 Stars background
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const numStars = 2000;

  function resizeCanvas() {
    const hero = document.getElementById('home');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.3,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.6 + 0.3
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'white';
    for (let s of stars) {
      ctx.globalAlpha = s.opacity;
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    moveStars();
  }

  function moveStars() {
    for (let s of stars) {
      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    }
  }

  function animateStars() {
    drawStars();
    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
  });

  resizeCanvas();
  initStars();
  animateStars();
})();

// 👁️ Section reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
    }
  });
});
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// ✨ Mouse Glow
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--glow-x', `${e.clientX}px`);
  document.body.style.setProperty('--glow-y', `${e.clientY}px`);
});

// 📍 Scroll-based active nav
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', activateNavLink);
  activateNavLink(); // on load
});

// 📦 Load projects from JSON and render with carousel + modal
document.addEventListener('DOMContentLoaded', () => {
  fetch('others/json/projects.json')
    .then(res => res.json())
    .then(data => {
      const grid = document.querySelector('.project-grid');
      grid.innerHTML = '';

      data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.dataset.title = project.title;
        card.dataset.type = project.type;
        card.dataset.description = project.description;
        card.dataset.process = project.process;
        card.dataset.stack = project.stack.join(', ');
        card.dataset.img1 = project.img1;
        card.dataset.img2 = project.img2;
        card.dataset.img3 = project.img3;
        card.dataset.live = project.live;
        card.dataset.code = project.code;

        card.innerHTML = `
          <div class="project-img-wrapper">
            <img src="${project.img1}" alt="${project.title}" class="project-img active" />
            <button class="img-nav prev">&#10094;</button>
            <button class="img-nav next">&#10095;</button>
          </div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <strong>${capitalize(project.type)}</strong>
          <div class="project-tags">
            ${project.stack.map(tag => `<span>${tag}</span>`).join('')}
          </div>
        `;

        grid.appendChild(card);
      });

      setupImageCarousels();
      setupModalListeners();
      setupFilterListeners();
    });
});

function setupImageCarousels() {
  document.querySelectorAll('.project-card').forEach(card => {
    const images = [card.dataset.img1, card.dataset.img2, card.dataset.img3];
    const imgElement = card.querySelector('.project-img');
    let index = 0;

    card.querySelector('.next').addEventListener('click', e => {
      e.stopPropagation();
      index = (index + 1) % images.length;
      imgElement.classList.remove('fade-in');
      setTimeout(() => {
        imgElement.src = images[index];
        imgElement.classList.add('fade-in');
      }, 100);
    });

    card.querySelector('.prev').addEventListener('click', e => {
      e.stopPropagation();
      index = (index - 1 + images.length) % images.length;
      imgElement.classList.remove('fade-in');
      setTimeout(() => {
        imgElement.src = images[index];
        imgElement.classList.add('fade-in');
      }, 100);
    });
  });
}

function setupModalListeners() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.close-modal');
  const mainImg = modal.querySelector('.modal-main-img');
  const thumbs = modal.querySelectorAll('.thumb');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-description');
  const modalProc = modal.querySelector('.modal-process');
  const modalStack = modal.querySelector('.modal-stack');
  const modalLive = modal.querySelector('.live-link');
  const modalCode = modal.querySelector('.code-link');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgs = [card.dataset.img1, card.dataset.img2, card.dataset.img3];
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.description;
      modalProc.textContent = card.dataset.process;

      modalStack.innerHTML = '';
      card.dataset.stack.split(',').forEach(tech => {
        const li = document.createElement('li');
        li.textContent = tech.trim();
        modalStack.appendChild(li);
      });

      mainImg.src = imgs[0];
      thumbs.forEach((t, i) => {
        t.src = imgs[i];
        t.classList.remove('selected');
      });
      thumbs[0].classList.add('selected');

      thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
          mainImg.src = imgs[i];
          thumbs.forEach(t => t.classList.remove('selected'));
          thumb.classList.add('selected');
        });
      });

      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function setupFilterListeners() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projects.forEach(card => {
        const type = card.dataset.type;
        if (category === 'all' || category === type) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
