const surpriseButton = document.getElementById('surpriseButton');
const confettiButton = document.getElementById('confettiButton');
const surpriseCard = document.getElementById('surpriseCard');
const revealItems = document.querySelectorAll('.reveal');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
const birthdayMusic = document.getElementById('birthdayMusic');
const birthdayVideo = document.getElementById('birthdayVideo');

birthdayMusic.volume = 0.08;

let musicWasStarted = false;

function startBackgroundMusic() {
  if (musicWasStarted || !birthdayVideo.paused) return;
  birthdayMusic.play().then(() => {
    musicWasStarted = true;
  }).catch(() => {
    // Some browsers require a visitor interaction before allowing audio.
  });
}

startBackgroundMusic();
['click', 'keydown', 'touchstart'].forEach((eventName) => {
  document.addEventListener(eventName, startBackgroundMusic, { once: true, passive: true });
});

birthdayVideo.addEventListener('play', () => {
  birthdayMusic.pause();
});

birthdayVideo.addEventListener('pause', () => {
  if (birthdayVideo.currentTime < birthdayVideo.duration) {
    resumeMusicIfEnabled();
  }
});

birthdayVideo.addEventListener('ended', resumeMusicIfEnabled);

function resumeMusicIfEnabled() {
  if (!musicWasStarted) return;
  birthdayMusic.play().catch(() => {});
}
const wishForm = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const wishStatus = document.getElementById('wishStatus');
const ownerButton = document.getElementById('ownerButton');
const ownerPanel = document.getElementById('ownerPanel');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const passwordStatus = document.getElementById('passwordStatus');
const wishesList = document.getElementById('wishesList');
const wishesStorageKey = 'kholu-birthday-wishes';
const ownerPassword = '1818';

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

surpriseButton.addEventListener('click', () => {
  surpriseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  surpriseCard.classList.add('visible');
});

confettiButton.addEventListener('click', () => {
  launchConfetti();
});

wishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const wish = wishInput.value.trim();
  if (!wish) return;

  const wishes = JSON.parse(localStorage.getItem(wishesStorageKey) || '[]');
  wishes.push({ text: wish, submittedAt: new Date().toLocaleString() });
  localStorage.setItem(wishesStorageKey, JSON.stringify(wishes));
  wishInput.value = '';
  wishStatus.textContent = 'Your wish has been sent! ✨';
});

ownerButton.addEventListener('click', () => {
  ownerPanel.hidden = !ownerPanel.hidden;
  if (!ownerPanel.hidden) passwordInput.focus();
});

passwordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (passwordInput.value !== ownerPassword) {
    passwordStatus.textContent = 'That password is not correct.';
    wishesList.hidden = true;
    return;
  }

  passwordStatus.textContent = '';
  passwordInput.value = '';
  renderWishes();
});

function renderWishes() {
  const wishes = JSON.parse(localStorage.getItem(wishesStorageKey) || '[]');
  wishesList.hidden = false;
  wishesList.innerHTML = '';

  if (wishes.length === 0) {
    wishesList.innerHTML = '<p class="empty-wishes">No wishes have been sent yet.</p>';
    return;
  }

  wishes.forEach((wish) => {
    const item = document.createElement('div');
    item.className = 'wish-item';
    item.textContent = `${wish.text}\n${wish.submittedAt}`;
    wishesList.appendChild(item);
  });
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfettiBurst() {
  const particles = [];
  const colors = ['#ff5fa2', '#ffd166', '#8c6bff', '#ff9f43', '#7bdff2', '#70e000'];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: (Math.random() - 0.5) * 12,
      velocityY: Math.random() * 8 - 6,
      gravity: 0.14 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    });
  }

  return particles;
}

function launchConfetti() {
  const particles = createConfettiBurst();
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += particle.gravity;
      particle.rotation += particle.rotationSpeed;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.radius / 2, -particle.radius / 2, particle.radius, particle.radius * 1.8);
      ctx.restore();
    });

    frame += 1;
    if (frame < 90) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  draw();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
