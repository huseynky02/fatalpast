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
}

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
    const spinner = overlay?.querySelector('.spinner');
    const statusText = overlay?.querySelector('.loading-status');
    const loadingProgress = overlay?.querySelector('.loading-progress-bar');

    if (!overlay) return;

    const messages = [
        "Analyzing Case Files...",
        "Retrieving Evidence...",
        "Scanning Archive...",
        "Accessing Dossier...",
        "Processing Forensic Data..."
    ];

    const hideOverlay = () => {
        setTimeout(() => {
            overlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        }, 500);
    };

    if (document.readyState === 'complete') {
        hideOverlay();
    } else {
        window.addEventListener('load', hideOverlay);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
            const href = link.getAttribute('href');
            const url = new URL(link.href);
            const isInternal = url.hostname === window.location.hostname;
            const isAnchor = href.startsWith('#');
            const isSpecial = href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:');

            if (isInternal && !isAnchor && !isSpecial) {
                e.preventDefault();

                if (statusText) {
                    statusText.innerText = messages[Math.floor(Math.random() * messages.length)];
                }

                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';

                const randomDelay = 500 + Math.random() * 4500;

                if (loadingProgress) {
                    loadingProgress.style.width = '0%';
                    loadingProgress.style.transition = `width ${randomDelay}ms linear`;
                    setTimeout(() => {
                        loadingProgress.style.width = '100%';
                    }, 50);
                }

                setTimeout(() => {
                    window.location.href = link.href;
                }, randomDelay);
            }
        }
    });
    console.log('FatalPast Loading Overlay Initialized');
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

function initFeaturedCases() {
    const featuredGrid = document.getElementById('featuredCasesGrid');
    if (!featuredGrid) return;

    fetch('cases.json')
        .then(response => response.json())
        .then(cases => {
            // Take first 6 cases for featured section
            const featured = cases.slice(0, 6);

            featuredGrid.innerHTML = featured.map((c, idx) => `
                <a href="${c.link}"
                    class="case-card group relative h-48 md:h-80 rounded-xl overflow-hidden backdrop-blur-sm hover:backdrop-blur-lg transition-all duration-500 block"
                    style="animation: slideInUp 0.6s ease-out backwards; animation-delay: ${(idx + 1) * 0.1}s;">
                    <div
                        class="absolute inset-0 bg-gradient-to-b from-red-600/30 via-dark-bg/50 to-dark-bg z-10 group-hover:from-red-600/60 group-hover:via-dark-bg/70 transition-all duration-500">
                    </div>
                    <div
                        class="absolute inset-0 border-t-2 border-l-2 border-red-600/40 group-hover:border-red-600/80 transition-all duration-500 rounded-xl">
                    </div>

                    <img src="${c.image}"
                        class="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 grayscale group-hover:grayscale-0"
                        alt="${c.name}">

                    <div class="absolute inset-0 flex flex-col justify-between p-4 md:p-6 z-20">
                        <div>
                            <span
                                class="inline-block px-2 md:px-3 py-1 bg-red-600/30 border border-red-600/50 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-2 md:mb-3 group-hover:bg-red-600/60 group-hover:border-red-600 transition-all">
                                ${c.year} • ${c.location}
                            </span>
                            <h3 class="text-lg md:text-2xl lg:text-3xl font-bold font-serif text-white leading-tight">
                                ${c.name}</h3>
                        </div>

                        <div class="space-y-2 md:space-y-3 hidden md:block">
                            <p
                                class="text-zinc-300 text-xs md:text-sm leading-relaxed group-hover:text-white transition-colors">
                                ${c.description}
                            </p>
                            <div
                                class="flex items-center space-x-2 text-red-400 font-semibold text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span>Learn More</span>
                                <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </div>
                        </div>
                    </div>
                </a>
            `).join('');
        })
        .catch(err => console.error('Error loading featured cases:', err));
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
    initFeaturedCases();
});
