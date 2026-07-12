/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - ADDANKI SAI NAVADEEP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initMobileDrawer();
    initCanvasParticles();
    initScrollReveal();
    initTiltEffect();
    initCustomVideoPlayer();
    initEmailCopy();
});

/* -------------------------------------------------------------
   THEME MANAGER (DARK / LIGHT MODE)
   ------------------------------------------------------------- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = currentTheme;

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
        
        // Trigger canvas color adjustment
        window.dispatchEvent(new Event('themeChanged'));
    });
}

/* -------------------------------------------------------------
   STICKY NAVBAR SCROLL DYNAMICS
   ------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* -------------------------------------------------------------
   MOBILE MENU DRAWER
   ------------------------------------------------------------- */
function initMobileDrawer() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-nav-item');

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        drawer.classList.toggle('open');
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close drawer on resize to desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && drawer.classList.contains('open')) {
            menuBtn.classList.remove('active');
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

/* -------------------------------------------------------------
   INTERACTIVE CANVAS PARTICLE BACKGROUND
   ------------------------------------------------------------- */
function initCanvasParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Responsive Canvas Size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Listeners
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Color configuration depending on current theme
    function getParticleColors() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return {
            particleColor: isLightTheme ? 'rgba(217, 119, 6, 0.25)' : 'rgba(99, 102, 241, 0.3)',
            lineColor: isLightTheme ? 'rgba(217, 119, 6, 0.05)' : 'rgba(99, 102, 241, 0.06)'
        };
    }

    let colors = getParticleColors();
    window.addEventListener('themeChanged', () => {
        colors = getParticleColors();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = colors.particleColor;
            ctx.fill();
        }

        update() {
            // Check canvas borders collision
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particle
            this.draw();
        }
    }

    // Initialize particles array
    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * (canvas.width - size * 2 - 10) + size;
            const y = Math.random() * (canvas.height - size * 2 - 10) + size;
            const directionX = (Math.random() * 0.4) - 0.2;
            const directionY = (Math.random() * 0.4) - 0.2;

            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    // Connect lines between close particles
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = colors.lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Re-initialize particles on window resize to fit the density
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initParticles();
        }, 200);
    });
}

/* -------------------------------------------------------------
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ------------------------------------------------------------- */
function initScrollReveal() {
    // 1. Core Section Scroll Reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Immediate/Staggered Reveal (e.g. Hero Content)
    const animateElements = document.querySelectorAll('.animate-reveal');
    setTimeout(() => {
        animateElements.forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            setTimeout(() => {
                el.classList.add('active');
            }, delay);
        });
    }, 100);
}

/* -------------------------------------------------------------
   3D PERSPECTIVE CARD TILT EFFECT
   ------------------------------------------------------------- */
function initTiltEffect() {
    const profileCard = document.getElementById('profile-card');
    const skillCards = document.querySelectorAll('.skills-category-card');

    function applyTilt(element, event) {
        const rect = element.getBoundingClientRect();
        
        // Mouse coordinates relative to card
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Normalize coordinates to -0.5 to 0.5
        const normX = (x / rect.width) - 0.5;
        const normY = (y / rect.height) - 0.5;
        
        // Angles of rotation (max 10 degrees)
        const rotX = -normY * 12;
        const rotY = normX * 12;

        element.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    }

    function resetTilt(element) {
        element.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    // Profile Card Tilt
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => applyTilt(profileCard, e));
        profileCard.addEventListener('mouseleave', () => resetTilt(profileCard));
    }

    // Skills Card Tilts (only on wider screens to prevent awkward mobile scroll interaction)
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                applyTilt(card, e);
            }
        });
        card.addEventListener('mouseleave', () => {
            resetTilt(card);
        });
    });
}

/* -------------------------------------------------------------
   CUSTOM LIGHTBOX VIDEO PLAYER
   ------------------------------------------------------------- */
function initCustomVideoPlayer() {
    const reelCards = document.querySelectorAll('.reel-card');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    // Custom Controls Elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const centralPlayBtn = document.getElementById('central-play-trigger');
    const progressTimeline = document.getElementById('progress-timeline');
    const progressFilled = document.getElementById('progress-filled');
    const progressHover = document.getElementById('progress-hover-bar');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeText = document.getElementById('current-time');
    const durationText = document.getElementById('total-duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.querySelector('.custom-player-container');

    if (!videoModal || !modalVideo) return;

    let isMouseDownTimeline = false;

    // Open video lightbox
    reelCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video-src');
            modalVideo.src = videoSrc;
            
            // Set initial state
            modalVideo.load();
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Auto play
            modalVideo.play()
                .then(() => updatePlayState(true))
                .catch(() => updatePlayState(false));
        });
    });

    // Close video lightbox
    function closeModal() {
        modalVideo.pause();
        modalVideo.src = '';
        videoModal.classList.remove('open');
        document.body.style.overflow = '';
        updatePlayState(false);
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Play/Pause functions
    function togglePlay() {
        if (modalVideo.paused || modalVideo.ended) {
            modalVideo.play();
            updatePlayState(true);
        } else {
            modalVideo.pause();
            updatePlayState(false);
        }
    }

    function updatePlayState(isPlaying) {
        if (isPlaying) {
            playPauseBtn.classList.add('playing');
            centralPlayBtn.classList.remove('visible');
        } else {
            playPauseBtn.classList.remove('playing');
            centralPlayBtn.classList.add('visible');
        }
    }

    playPauseBtn.addEventListener('click', togglePlay);
    centralPlayBtn.addEventListener('click', togglePlay);
    modalVideo.addEventListener('click', togglePlay);

    // Update progress bar & timeline indicators
    function updateProgress() {
        const percent = (modalVideo.currentTime / modalVideo.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;
        
        currentTimeText.textContent = formatTime(modalVideo.currentTime);
    }

    function setVideoDuration() {
        durationText.textContent = formatTime(modalVideo.duration);
    }

    modalVideo.addEventListener('timeupdate', updateProgress);
    modalVideo.addEventListener('loadedmetadata', setVideoDuration);

    // Helper: format time seconds to mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Skip timeline interaction
    function scrubTimeline(e) {
        const rect = progressTimeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        let percentage = clickX / width;
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;

        modalVideo.currentTime = percentage * modalVideo.duration;
    }

    progressTimeline.addEventListener('click', scrubTimeline);
    
    // Timeline dragging logic
    progressTimeline.addEventListener('mousedown', (e) => {
        isMouseDownTimeline = true;
        scrubTimeline(e);
    });

    window.addEventListener('mousemove', (e) => {
        if (isMouseDownTimeline) {
            scrubTimeline(e);
        }
        
        // Show hover progress line
        if (!isMouseDownTimeline) {
            const rect = progressTimeline.getBoundingClientRect();
            if (e.clientY >= rect.top - 10 && e.clientY <= rect.bottom + 10 && e.clientX >= rect.left && e.clientX <= rect.right) {
                const hoverPercentage = (e.clientX - rect.left) / rect.width;
                progressHover.style.width = `${hoverPercentage * 100}%`;
            } else {
                progressHover.style.width = '0%';
            }
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDownTimeline = false;
    });

    // Volume Adjustment
    function changeVolume() {
        modalVideo.volume = volumeSlider.value;
        modalVideo.muted = (volumeSlider.value === 0);
        updateVolumeIcon();
    }

    function toggleMute() {
        modalVideo.muted = !modalVideo.muted;
        if (modalVideo.muted) {
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = modalVideo.volume || 1;
        }
        updateVolumeIcon();
    }

    function updateVolumeIcon() {
        volumeBtn.className = 'volume-btn';
        if (modalVideo.muted || modalVideo.volume === 0) {
            volumeBtn.classList.add('muted');
        } else if (modalVideo.volume < 0.5) {
            volumeBtn.classList.add('low');
        } else {
            // default icons
        }
    }

    volumeSlider.addEventListener('input', changeVolume);
    volumeBtn.addEventListener('click', toggleMute);

    // Fullscreen support
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen()
                .catch(err => console.log(`Fullscreen error: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Keyboard support inside lightbox
    window.addEventListener('keydown', (e) => {
        if (!videoModal.classList.contains('open')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === ' ') {
            e.preventDefault();
            togglePlay();
        }
    });
}

/* -------------------------------------------------------------
   EMAIL COPY TO CLIPBOARD
   ------------------------------------------------------------- */
function initEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const tooltip = document.getElementById('copy-tooltip');

    if (!copyBtn || !emailText || !tooltip) return;

    copyBtn.addEventListener('click', () => {
        const email = emailText.textContent.trim();
        
        navigator.clipboard.writeText(email)
            .then(() => {
                // Show copied tooltip
                tooltip.classList.add('show');
                
                // Hide after 2 seconds
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });
}
