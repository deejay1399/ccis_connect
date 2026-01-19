$(document).ready(function() {
    // Highlights Carousel Functionality for 10 images
    let currentSlide = 0;
    const slides = $('.highlight-slide');
    const dots = $('.dot');
    const totalSlides = slides.length;
    let autoSlideInterval;
    let isAutoRotating = true;

    // Smart image optimization function
    function optimizeImages() {
        $('.highlight-image img').each(function() {
            const img = $(this);
            const src = img.attr('src');
            
            // Create a new image to check dimensions
            const testImage = new Image();
            testImage.src = src;
            
            testImage.onload = function() {
                const width = testImage.width;
                const height = testImage.height;
                const aspectRatio = width / height;
                
                // If image is portrait (taller than wide), add special class
                if (aspectRatio < 1) {
                    img.parent().addClass('portrait');
                }
                
                // Add optimized class for better positioning
                img.addClass('image-optimized');
                
                // If image has people, try to focus on upper part
                if (height > width && height > 1000) {
                    img.css('object-position', 'center 25%');
                }
            };
        });
    }

    // Function to show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.removeClass('active');
        dots.removeClass('active');
        
        // Show current slide
        slides.eq(index).addClass('active');
        dots.eq(index).addClass('active');
        
        currentSlide = index;
        
        // Update ARIA labels for accessibility
        updateSlideAccessibility(index);
        
        // Reset progress bar animation
        resetProgressBar();
        
        // Preload next image for smoother transitions
        preloadNextImage();
    }

    // Update accessibility attributes for slides
    function updateSlideAccessibility(index) {
        // Update slide ARIA attributes
        slides.each(function(i) {
            const $slide = $(this);
            const isActive = i === index;
            $slide.attr('aria-hidden', !isActive);
            $slide.attr('aria-live', isActive ? 'polite' : 'off');
        });
        
        // Update navigation buttons ARIA labels
        $('.highlight-prev').attr('aria-label', `Previous image (${index + 1} of ${totalSlides})`);
        $('.highlight-next').attr('aria-label', `Next image (${index + 1} of ${totalSlides})`);
    }

    // Preload next image function
    function preloadNextImage() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        const nextImageSrc = $('.highlight-slide').eq(nextIndex).find('img').attr('src');
        
        if (nextImageSrc) {
            const preloadImage = new Image();
            preloadImage.src = nextImageSrc;
        }
    }

    // Next slide function
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }

    // Previous slide function
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    // Auto-rotate slides every 4 seconds
    function startAutoSlide() {
        isAutoRotating = true;
        $('.highlights-carousel').addClass('auto-rotating');
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    // Stop auto-rotation
    function stopAutoSlide() {
        isAutoRotating = false;
        $('.highlights-carousel').removeClass('auto-rotating');
        clearInterval(autoSlideInterval);
    }

    // Reset progress bar animation
    function resetProgressBar() {
        $('.highlights-carousel').removeClass('auto-rotating');
        setTimeout(() => {
            if (isAutoRotating) {
                $('.highlights-carousel').addClass('auto-rotating');
            }
        }, 50);
    }

    // Event listeners for navigation
    $('.highlight-next').click(function() {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    $('.highlight-prev').click(function() {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // Dot click event
    dots.click(function() {
        stopAutoSlide();
        const slideIndex = parseInt($(this).data('slide'));
        showSlide(slideIndex);
        startAutoSlide();
    });

    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        } else if (e.key === 'Home') {
            stopAutoSlide();
            showSlide(0);
            startAutoSlide();
        } else if (e.key === 'End') {
            stopAutoSlide();
            showSlide(totalSlides - 1);
            startAutoSlide();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    $('.highlights-carousel').on('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    $('.highlights-carousel').on('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            } else {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            }
        }
    }

    // Pause auto-rotation on hover
    $('.highlights-carousel').hover(
        function() {
            stopAutoSlide();
        },
        function() {
            startAutoSlide();
        }
    );

    // Initialize carousel
    function initCarousel() {
        optimizeImages();
        showSlide(0);
        startAutoSlide();
        
        // Initialize ARIA attributes
        $('.highlights-carousel').attr('aria-label', 'Image carousel');
        $('.highlight-dots').attr('aria-label', 'Carousel navigation dots');
    }

    // Enhanced Dropdown Hover Functionality
    function initDropdownHover() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest('.dropdown');
            
            // Show on hover
            dropdown.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 992) { // Desktop only
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.add('show');
                        this.classList.add('show');
                    }
                }
            });
            
            // Hide when mouse leaves
            dropdown.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 992) {
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                        this.classList.remove('show');
                    }
                }
            });
        });
        
        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }

    // Enhanced Mobile Menu Functionality
    function enhanceMobileMenu() {
        const $navbarToggler = $('.navbar-toggler');
        const $navbarMain = $('.navbar-main');
        const $navbarCollapse = $('#mainNav');
        
        // Handle mobile menu toggle
        $navbarToggler.on('click', function() {
            $navbarMain.toggleClass('mobile-open');
            
            // Update ARIA attributes for accessibility
            const isExpanded = $navbarCollapse.hasClass('show');
            $navbarToggler.attr('aria-expanded', isExpanded ? 'false' : 'true');
        });
        
        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if ($(window).width() < 992) {
                if (!$navbarMain.is(e.target) && $navbarMain.has(e.target).length === 0 && 
                    !$navbarToggler.is(e.target)) {
                    $navbarCollapse.collapse('hide');
                    $navbarMain.removeClass('mobile-open');
                    $navbarToggler.attr('aria-expanded', 'false');
                }
            }
        });
        
        // Close mobile menu when a link is clicked
        $('.navbar-nav .nav-link, .dropdown-item').on('click', function() {
            if ($(window).width() < 992) {
                $navbarCollapse.collapse('hide');
                $navbarMain.removeClass('mobile-open');
                $navbarToggler.attr('aria-expanded', 'false');
            }
        });
        
        // Handle dropdown behavior on mobile
        $('.dropdown-toggle').on('click', function(e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                const $thisDropdown = $(this).closest('.dropdown');
                const $dropdownMenu = $thisDropdown.find('.dropdown-menu');
                
                // Close other dropdowns
                $('.dropdown').not($thisDropdown).removeClass('show');
                $('.dropdown-menu').not($dropdownMenu).removeClass('show');
                
                // Toggle current dropdown
                $thisDropdown.toggleClass('show');
                $dropdownMenu.toggleClass('show');
            }
        });
        
        // Close dropdowns when clicking outside on mobile
        $(document).on('click', function(e) {
            if ($(window).width() < 992) {
                if (!$(e.target).closest('.dropdown').length) {
                    $('.dropdown').removeClass('show');
                    $('.dropdown-menu').removeClass('show');
                }
            }
        });
    }

    // Smooth scrolling for anchor links (only for same page)
    $('a[href^="#"]').on('click', function(e) {
        // Only prevent default if it's a same-page anchor
        if (this.pathname === window.location.pathname) {
            e.preventDefault();
            const target = $($(this).attr('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000);
            }
        }
    });

    // Add animation to elements on scroll
    function animateOnScroll() {
        $('.program-card').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < windowBottom - 100) {
                $(this).addClass('fade-in');
            }
        });
    }

    // ✅✅✅ BACK TO TOP BUTTON FUNCTIONALITY - GUARANTEED WORKING
    function initBackToTop() {
        console.log('🔄 Initializing Back to Top button...');
        
        const $backToTop = $('#backToTop');
        
        if (!$backToTop.length) {
            console.log('❌ Back to Top button not found in HTML, creating one...');
            // Create the button if it doesn't exist
            $('body').append(`
                <button id="backToTop" class="back-to-top-btn" aria-label="Back to top" style="display: none;">
                    <i class="fas fa-chevron-up"></i>
                    <span class="visually-hidden">Back to top</span>
                </button>
            `);
        }
        
        const $backToTopBtn = $('#backToTop');
        
        // Function to toggle button visibility
        function toggleBackToTop() {
            if ($(window).scrollTop() > 300) {
                console.log('⬆️ Showing Back to Top button');
                $backToTopBtn.fadeIn(300);
            } else {
                console.log('⬇️ Hiding Back to Top button');
                $backToTopBtn.fadeOut(300);
            }
        }
        
        // Click event for back to top
        $backToTopBtn.off('click').on('click', function() {
            console.log('🎯 Back to Top clicked');
            $('html, body').animate({ scrollTop: 0 }, 800, function() {
                console.log('✅ Scrolled to top');
            });
            return false;
        });
        
        // Initial check
        toggleBackToTop();
        
        // Scroll event
        $(window).off('scroll.backtotop').on('scroll.backtotop', toggleBackToTop);
        
        console.log('✅ Back to Top button initialized successfully');
    }

    // Enhanced navbar toggler accessibility
    $('#mainNav').on('show.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'true');
    });

    $('#mainNav').on('hide.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'false');
    });

    $(window).on('scroll', function() {
        animateOnScroll();
    });

    // Enhanced hover effects for program cards
    $('.program-card').on('mouseenter', function() {
        $(this).find('i').css('color', '#ffd700');
    }).on('mouseleave', function() {
        $(this).find('i').css('color', '#4b0082');
    });

    // ============================================
    // ACADEMIC PROGRAMS DISPLAY SYSTEM - USER SIDE
    // ============================================
    let academicPrograms = [];
    let programsLoaded = false;

    // Initialize programs display
    function initProgramsDisplay() {
        loadProgramsForDisplay();
        setupProgramsAutoRefresh();
    }

    // Load programs for display only
    function loadProgramsForDisplay() {
        const storedPrograms = localStorage.getItem('ccis_academic_programs');
        
        if (storedPrograms) {
            try {
                const adminPrograms = JSON.parse(storedPrograms);
                // Combine hard-coded programs with admin-added programs
                academicPrograms = [...getDefaultPrograms(), ...adminPrograms];
                programsLoaded = true;
            } catch (error) {
                console.error('Error parsing programs data:', error);
                academicPrograms = getDefaultPrograms();
            }
        } else {
            academicPrograms = getDefaultPrograms();
        }
        
        renderProgramsDisplay();
    }

    // Get default hard-coded programs
    function getDefaultPrograms() {
        return [
            {
                id: 1,
                name: "Bachelor of Science in Computer Science (BSCS)",
                icon: "fas fa-laptop-code",
                description: "Focuses on software development, algorithms, and computer systems theory. Prepares students for careers in software engineering, AI, and web development.",
                courses: [
                    "Software Engineering",
                    "Data Structures and Algorithms", 
                    "Artificial Intelligence",
                    "Web and Mobile Development",
                    "Computer Networks",
                    "Database Systems"
                ]
            },
            {
                id: 2,
                name: "Bachelor of Science in Information Technology (BSIT)",
                icon: "fas fa-network-wired",
                description: "Emphasizes IT infrastructure, networking, and system administration. Trains students for roles in network administration, cybersecurity, and IT management.",
                courses: [
                    "Network Administration",
                    "Database Management",
                    "System Analysis and Design",
                    "Information Security",
                    "Cloud Computing",
                    "IT Project Management"
                ]
            }
        ];
    }

    // Render programs display
    function renderProgramsDisplay() {
        const programsContainer = $('#programs-container');
        
        // Clear container
        programsContainer.empty();
        
        // Render all programs
        academicPrograms.forEach((program, index) => {
            const programHtml = createProgramCardHtml(program, index);
            programsContainer.append(programHtml);
        });
    }

    // Create program card HTML - FIXED: Removed bullet points
    function createProgramCardHtml(program, index) {
        const coursesList = program.courses.map(course => 
            `<li>${course}</li>`
        ).join('');
        
        // Add animation delay for staggered entrance
        const animationDelay = index * 0.1;
        
        return `
            <div class="program-card" style="animation-delay: ${animationDelay}s">
                <div class="program-header">
                    <i class="${program.icon}"></i>
                    <h5>${program.name}</h5>
                </div>
                <p>${program.description}</p>
                <ul class="career-list">${coursesList}</ul>
            </div>
        `;
    }

    // Setup auto-refresh to detect new programs
    function setupProgramsAutoRefresh() {
        // Check for program updates every 3 seconds
        setInterval(() => {
            checkForProgramUpdates();
        }, 3000);
    }

    // Check for program updates
    function checkForProgramUpdates() {
        const storedPrograms = localStorage.getItem('ccis_academic_programs');
        
        if (storedPrograms) {
            try {
                const adminPrograms = JSON.parse(storedPrograms);
                const newPrograms = [...getDefaultPrograms(), ...adminPrograms];
                
                const currentProgramIds = academicPrograms.map(p => p.id).join(',');
                const newProgramIds = newPrograms.map(p => p.id).join(',');
                
                // If programs changed, update display
                if (currentProgramIds !== newProgramIds) {
                    console.log('Programs changed, updating display...');
                    
                    academicPrograms = newPrograms;
                    renderProgramsDisplay();
                    
                    // Show notification if new admin programs were added
                    if (adminPrograms.length > 0 && newPrograms.length > academicPrograms.length) {
                        const newAdminProgramsCount = adminPrograms.length;
                        showNewProgramsNotification(newAdminProgramsCount);
                    }
                }
            } catch (error) {
                console.error('Error checking for program updates:', error);
            }
        } else {
            // No admin programs in storage, use only default programs
            const defaultPrograms = getDefaultPrograms();
            if (academicPrograms.length !== defaultPrograms.length) {
                academicPrograms = defaultPrograms;
                renderProgramsDisplay();
            }
        }
    }

    // Show notification when new programs are added
    function showNewProgramsNotification(programCount) {
        // Only show if user is actively viewing the page
        if (document.visibilityState === 'visible') {
            const notification = $(`
                <div class="notification alert alert-success alert-dismissible fade show">
                    <i class="fas fa-graduation-cap me-2"></i>
                    <strong>New Program${programCount > 1 ? 's' : ''} Available!</strong><br>
                    ${programCount} new academic program${programCount > 1 ? 's' : ''} added to our offerings.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `);
            
            $('body').append(notification);
            
            // Auto remove after 6 seconds
            setTimeout(() => {
                notification.alert('close');
            }, 6000);
        }
    }

    // Enhanced program card interactions
    function setupProgramInteractions() {
        // Hover effects
        $(document).on('mouseenter', '.program-card', function() {
            $(this).addClass('program-hover');
        }).on('mouseleave', '.program-card', function() {
            $(this).removeClass('program-hover');
        });
    }

    // ✅ UPDATED INITIALIZATION FUNCTION - PRIORITIZE BACK TO TOP
    function initializeAll() {
        console.log('🚀 Initializing CCIS Homepage...');
        
        // Initialize core functionality
        initCarousel();
        initDropdownHover();
        enhanceMobileMenu();
        animateOnScroll();
        
        // ✅ CRITICAL: Initialize Back to Top FIRST
        initBackToTop();
        
        // Initialize other features
        initProgramsDisplay();
        setupProgramInteractions();

        console.log('✅ CCIS Homepage Loaded Successfully');
        console.log('✅ Back to Top button: ACTIVE');
        console.log('✅ Carousel: ACTIVE');
        console.log('✅ Navigation: ACTIVE');
    }

    // Initialize everything
    initializeAll();

    // Debug info
    console.log('🏠 Current Page: Homepage');
    console.log('📍 URL:', window.location.href);
});

// Global notification function for consistency
window.showNotification = function(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notificationClass = type === 'error' ? 'alert-danger alert-error' : 
                                 type === 'success' ? 'alert-success' : 
                                 type === 'warning' ? 'alert-warning' :
                                 'alert-info';
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'success' ? 'fa-check-circle' : 
                         type === 'warning' ? 'fa-exclamation-triangle' :
                         'fa-info-circle';
        
        const notification = document.createElement('div');
        notification.className = `notification alert ${notificationClass} alert-dismissible fade show`;
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${iconClass} me-2"></i>
                <span class="flex-grow-1">${message}</span>
                <button type="button" class="btn-close btn-close-sm" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    } catch (error) {
        console.error('Notification error:', error);
    }
};