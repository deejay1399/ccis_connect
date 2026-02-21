// ABOUT PAGE SPECIFIC JAVASCRIPT - Updated to match homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Global notification function - SAME AS HOMEPAGE
    window.showNotification = function(message, type = 'info') {
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
        
        // 🎯 CONSISTENT Top-Right positioning across all pages
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
    };

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

    // Hash mapping for URL navigation
    const hashMapping = {
        'history': 'history-section',
        'vmgo': 'vmgo-section', 
        'hymn': 'hymn-section'
    };

    // Show specific section - FIXED VERSION
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none';
            section.style.visibility = 'hidden';
            section.style.opacity = '0';
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            targetSection.style.display = 'block';
            targetSection.style.visibility = 'visible';
            targetSection.style.opacity = '1';
            
            // Scroll to section with offset for header
            const universityHeader = document.querySelector('.university-header');
            const navbarMain = document.querySelector('.navbar-main');
            
            const headerHeight = (universityHeader ? universityHeader.offsetHeight : 0) + 
                               (navbarMain ? navbarMain.offsetHeight : 0) + 20;
            
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
            
            // Update URL hash - ONLY if it's different
            const currentHash = window.location.hash.substring(1);
            const mappedHash = Object.keys(hashMapping).find(key => hashMapping[key] === sectionId) || sectionId;
            
            if (currentHash !== mappedHash) {
                if (window.history.pushState) {
                    window.history.pushState(null, null, `#${mappedHash}`);
                } else {
                    window.location.hash = mappedHash;
                }
            }
            
            // Initialize section-specific components
            initializeSectionComponents(sectionId);
        } else {
            // Fallback to history section
            console.warn('Section not found, defaulting to history-section');
            showSection('history-section');
        }
    }

    // Initialize section-specific components
    function initializeSectionComponents(sectionId) {
        switch(sectionId) {
            case 'vmgo-section':
                initVmgoTabs();
                break;
            case 'hymn-section':
                initHymnMedia();
                break;
        }
    }

    // VMGO Tab functionality - FIXED VERSION
    function initVmgoTabs() {
        const tabButtons = document.querySelectorAll('.vmgo-tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab pane
                document.querySelectorAll('.vmgo-tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    // Hymn media functionality (video)
    function initHymnMedia() {
        const mediaPlayer = document.querySelector('#hymn-section video');
        if (mediaPlayer) {
            mediaPlayer.addEventListener('play', function() {
                document.querySelector('.hymn-audio .card').classList.add('border-primary');
            });
            
            mediaPlayer.addEventListener('pause', function() {
                document.querySelector('.hymn-audio .card').classList.remove('border-primary');
            });
        }
    }

    // Handle navigation from dropdown menu - FIXED VERSION
    function setupDropdownNavigation() {
        // Handle dropdown item clicks for About page sections
        document.querySelectorAll('.dropdown-item[href^="#"]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Dropdown item clicked:', this.getAttribute('href'));
                
                // Check if the link is blocked first
                if (this.classList.contains('blocked-nav-item')) {
                    console.log('Item is blocked, skipping navigation');
                    return;
                }
                const targetId = this.getAttribute('href').substring(1);
                console.log('Target section:', targetId);
                showSection(targetId);
            });
        });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const validSections = ['history-section', 'vmgo-section', 'hymn-section'];
        
        let mappedHash = hashMapping[hash] || hash;
        
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    });

    // Handle hash changes (e.g. clicking nav links like /about#vmgo while already on /about)
    function handleHashChange() {
        let hash = window.location.hash.substring(1);
        const validSections = ['history-section', 'vmgo-section', 'hymn-section'];

        // Allow both short hashes (#history) and full section ids (#history-section)
        const mappedHash = hashMapping[hash] || hash;

        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    // Handle hash on page load - FIXED VERSION
    function handleHashOnLoad() {
        // Only run this on the About page - check if about content sections exist
        const aboutPageSections = document.querySelectorAll('.content-section');
        if (aboutPageSections.length === 0) {
            // Not on the about page, don't modify the URL
            return;
        }
        
        let hash = window.location.hash.substring(1);
        const validSections = ['history-section', 'vmgo-section', 'hymn-section'];
        
        // Map hash to actual section IDs
        if (hashMapping[hash]) {
            hash = hashMapping[hash];
            window.location.hash = hash;
        }
        
        // Determine which section to show
        let targetSection;
        if (hash && validSections.includes(hash)) {
            targetSection = hash;
        } else if (hash) {
            // If there's a hash but it's not valid, show history section
            targetSection = 'history-section';
        } else {
            // No hash at all - just show history section without modifying URL
            targetSection = 'history-section';
            // Don't add hash to URL when coming from other pages
            showSection(targetSection);
            return;
        }
        
        showSection(targetSection);
    }

    // Back to Top functionality - SAME AS HOMEPAGE
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Focus management for accessibility
            $('html, body').promise().done(function() {
                $('body').focus();
            });
        });
        
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop);
    }

    // Create back to top button if not exists - SAME AS HOMEPAGE
    function createBackToTopButton() {
        if (!document.getElementById('backToTop')) {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'backToTop';
            backToTopBtn.className = 'back-to-top-btn';
            backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i><span class="visually-hidden">Back to top</span>';
            document.body.appendChild(backToTopBtn);
        }
    }

    // Enhanced Mobile Menu Functionality - SAME AS HOMEPAGE
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

    // Smooth scrolling for anchor links (only for same page) - SAME AS HOMEPAGE
    function initSmoothScrolling() {
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
    }

    // Add animation to elements on scroll - SAME AS HOMEPAGE
    function animateOnScroll() {
        $('.content-card').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < windowBottom - 100) {
                $(this).addClass('fade-in');
            }
        });
    }

    // Enhanced navbar toggler accessibility - SAME AS HOMEPAGE
    function initNavbarAccessibility() {
        $('#mainNav').on('show.bs.collapse', function () {
            $('.navbar-toggler').attr('aria-expanded', 'true');
        });

        $('#mainNav').on('hide.bs.collapse', function () {
            $('.navbar-toggler').attr('aria-expanded', 'false');
        });
    }

    // Enhanced program card interactions - SAME AS HOMEPAGE STYLE
    function setupCardInteractions() {
        // Hover effects for content cards
        $(document).on('mouseenter', '.content-card', function() {
            $(this).addClass('card-hover');
        }).on('mouseleave', '.content-card', function() {
            $(this).removeClass('card-hover');
        });
    }

    // Initialize everything - FIXED VERSION
    function initializeAll() {
        console.log('Initializing About Page...');
        
        // Set up navigation
        handleHashOnLoad();
        setupDropdownNavigation();
        
        // Initialize components
        initVmgoTabs();
        initHymnMedia();
        initDropdownHover(); // ADDED: Dropdown hover functionality
        
        // Initialize homepage-style functionality
        createBackToTopButton();
        initBackToTop();
        enhanceMobileMenu();
        initSmoothScrolling();
        initNavbarAccessibility();
        setupCardInteractions();
        
        // Force re-apply role filter
        if (typeof window.filterContentByRole === 'function') {
            window.filterContentByRole(); 
            console.log('✅ Role-based blocking re-applied.');
        }
        
        console.log('✅ About Page Loaded Successfully');
        console.log('📖 History, VMGO, and Hymn sections initialized');
        console.log('🎵 Video player ready for BISU Hymn');
        console.log('🎯 All homepage functionality integrated');
    }

    // Scroll event listener - SAME AS HOMEPAGE
    window.addEventListener('scroll', function() {
        animateOnScroll();
        if (typeof initBackToTop === 'function') {
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            }
        }
    });

    // Start the application
    initializeAll();
});
