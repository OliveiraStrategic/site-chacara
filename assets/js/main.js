/**
 * Refúgio Santa Rita - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Navbar Scroll Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // Scroll Animations (IntersectionObserver)
    // ==========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // Gallery Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    // Store current visible items for lightbox
    let currentGalleryGroup = Array.from(galleryItems);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            currentGalleryGroup = [];
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Small timeout to allow display block to apply before animating opacity/transform
                    setTimeout(() => {
                        item.classList.remove('hide');
                    }, 50);
                    currentGalleryGroup.push(item);
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match transition time if any
                }
            });
        });
    });

    // ==========================================
    // Lightbox Logic
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;

    // Open Lightbox
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Update the current visible group in case of filters
            const visibleItems = Array.from(galleryItems).filter(el => el.style.display !== 'none');
            currentIndex = visibleItems.indexOf(item);
            
            if(currentIndex === -1) {
                // Fallback
                currentIndex = Array.from(galleryItems).indexOf(item);
                currentGalleryGroup = Array.from(galleryItems);
            } else {
                currentGalleryGroup = visibleItems;
            }
            
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    function updateLightboxImage() {
        if(currentGalleryGroup.length === 0) return;
        const src = currentGalleryGroup[currentIndex].getAttribute('data-src');
        lightboxImg.src = src;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300); // Clear image after animation
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentGalleryGroup.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentGalleryGroup.length) % currentGalleryGroup.length;
        updateLightboxImage();
    }

    // Event Listeners for Lightbox Controls
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        if (touchEndX < touchStartX - threshold) {
            // Swiped left -> next image
            nextImage();
        }
        if (touchEndX > touchStartX + threshold) {
            // Swiped right -> prev image
            prevImage();
        }
    }
});
