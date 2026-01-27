// Common Utilities
function initNavigation() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileBackdrop = document.getElementById('mobileBackdrop');

    // Helper function to close menu
    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileBackdrop) mobileBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Helper function to open menu
    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileBackdrop) mobileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (mobileMenuButton && mobileMenu) {
        // Open menu button
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openMenu();
        });

        // Close menu button (X)
        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close menu when clicking backdrop
        if (mobileBackdrop) {
            mobileBackdrop.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close menu when clicking on menu links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMenu();
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu when clicking outside (on desktop-like behavior)
        document.addEventListener('click', (e) => {
            // Only close if menu is open and click is outside menu and button
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target)) {
                closeMenu();
            }
        });
    }
}}

function initScrollEffects() {
    const progressBar = document.getElementById("progress-bar");
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (progressBar) progressBar.style.width = scrolled + "%";
        if (backToTop) backToTop.classList.toggle('hidden', winScroll < 300);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    window.addEventListener('load', () => {
        overlay.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.target) {
            const href = link.getAttribute('href');
            if (!href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                e.preventDefault();
                overlay.classList.add('show');
                // 0-5 saniye arasında rastgele süreli yüklenme
                const randomDelay = Math.random() * 5000;
                setTimeout(() => {
                    window.location.href = href;
                }, randomDelay);
            }
        }
    });
}

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }
            }
        });
    });
}

// Security features (Disabled for developer mode if needed, but keeping user's preference)
function initSecurity() {
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                target.dataset.animated = 'true';
                
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = countTo / (duration / 16); // 60 FPS

                const updateCount = () => {
                    count += increment;
                    if (count < countTo) {
                        target.innerText = Math.floor(count) + (target.classList.contains('text-access') ? '/7' : '+');
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = countTo + (target.classList.contains('text-access') ? '/7' : '+');
                    }
                };
                updateCount();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.3 });

    stats.forEach(stat => observer.observe(stat));
}

function initLazyLoad() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initLoadingOverlay();
    initSmoothAnchors();
    initSecurity();
    initLazyLoad();
    initStatsCounter();
});
