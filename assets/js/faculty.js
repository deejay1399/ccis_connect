// FACULTY PAGE JAVASCRIPT - Updated with homepage functionality

$(document).ready(function() {
    // Global notification function - SAME AS HOMEPAGE
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
        } catch (error) {
            console.error('Notification error:', error);
        }
    };

    // Enhanced Mobile Menu Functionality - SAME AS HOMEPAGE
    function enhanceMobileMenu() {
        try {
            const $navbarToggler = $('.navbar-toggler');
            const $navbarMain = $('.navbar-main');
            const $navbarCollapse = $('#mainNav');
            
            if (!$navbarToggler.length) return;
            
            // Handle mobile menu toggle
            $navbarToggler.off('click').on('click', function() {
                $navbarMain.toggleClass('mobile-open');
                
                // Update ARIA attributes for accessibility
                const isExpanded = $navbarCollapse.hasClass('show');
                $navbarToggler.attr('aria-expanded', isExpanded ? 'false' : 'true');
            });
            
            // Close mobile menu when clicking outside
            $(document).off('click.menu').on('click.menu', function(e) {
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
            $('.navbar-nav .nav-link, .dropdown-item').off('click.menu').on('click.menu', function() {
                if ($(window).width() < 992) {
                    $navbarCollapse.collapse('hide');
                    $navbarMain.removeClass('mobile-open');
                    $navbarToggler.attr('aria-expanded', 'false');
                }
            });
            
            // Handle dropdown behavior on mobile
            $('.dropdown-toggle').off('click.menu').on('click.menu', function(e) {
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
            $(document).off('click.dropdown').on('click.dropdown', function(e) {
                if ($(window).width() < 992) {
                    if (!$(e.target).closest('.dropdown').length) {
                        $('.dropdown').removeClass('show');
                        $('.dropdown-menu').removeClass('show');
                    }
                }
            });
        } catch (error) {
            console.error('Mobile menu error:', error);
        }
    }

    // Faculty card hover effects
    function initFacultyHover() {
        try {
            $('.faculty-card').off('hover.animation').hover(
                function() {
                    $(this).find('.faculty-image img').css('transform', 'scale(1.05)');
                    $(this).addClass('shadow-lg');
                },
                function() {
                    $(this).find('.faculty-image img').css('transform', 'scale(1)');
                    $(this).removeClass('shadow-lg');
                }
            );
        } catch (error) {
            console.error('Faculty hover error:', error);
        }
    }
    
    // Add animation to elements on scroll - SAME AS HOMEPAGE
    function animateOnScroll() {
        try {
            $('.faculty-card').each(function() {
                const elementTop = $(this).offset().top;
                const windowBottom = $(window).scrollTop() + $(window).height();
                
                if (elementTop < windowBottom - 100) {
                    $(this).addClass('fade-in');
                }
            });
        } catch (error) {
            console.error('Animate on scroll error:', error);
        }
    }
    
    // Image error handling
    function initImageErrorHandling() {
        try {
            $('img').off('error.image').on('error.image', function() {
                const altText = $(this).attr('alt') || 'Image';
                const $parent = $(this).parent();
                if (!$parent.find('.image-placeholder').length) {
                    $parent.append(`<div class="image-placeholder">${altText}</div>`);
                }
                $(this).hide();
            });
        } catch (error) {
            console.error('Image error handling error:', error);
        }
    }
    
    // ✅ BACK TO TOP BUTTON FUNCTIONALITY - COMPLETE FIX
    function initBackToTop() {
        try {
            const $backToTop = $('#backToTop');
            if (!$backToTop.length) return;
            
            function toggleBackToTop() {
                if ($(window).scrollTop() > 300) {
                    $backToTop.fadeIn();
                } else {
                    $backToTop.fadeOut();
                }
            }
            
            $backToTop.off('click.top').on('click.top', function() {
                $('html, body').animate({ scrollTop: 0 }, 800);
            });
            
            toggleBackToTop();
            $(window).off('scroll.top').on('scroll.top', toggleBackToTop);
        } catch (error) {
            console.error('Back to top error:', error);
        }
    }

    // Create back to top button if not exists - SAME AS HOMEPAGE
    function createBackToTopButton() {
        try {
            if ($('#backToTop').length === 0) {
                $('body').append(`
                    <button id="backToTop" class="back-to-top-btn" aria-label="Back to top">
                        <i class="fas fa-chevron-up"></i>
                        <span class="visually-hidden">Back to top</span>
                    </button>
                `);
                
                $('#backToTop').off('click.create').on('click.create', function() {
                    $('html, body').animate({ scrollTop: 0 }, 800);
                    // Focus management for accessibility
                    $('html, body').promise().done(function() {
                        $('body').focus();
                    });
                });
            }
        } catch (error) {
            console.error('Create back to top button error:', error);
        }
    }

    // Enhanced dropdown functionality with role-based filtering
    function enhanceDropdowns() {
        try {
            // Close other dropdowns when one is opened (mobile behavior)
            $('.dropdown-toggle').off('click.dropdown').on('click.dropdown', function(e) {
                if ($(window).width() < 992) {
                    const $thisDropdown = $(this).closest('.dropdown');
                    $('.dropdown').not($thisDropdown).removeClass('show');
                    $('.dropdown-menu').not($thisDropdown.find('.dropdown-menu')).removeClass('show');
                }
            });

            // Re-apply role filter to ensure navigation links are blocked
            if (typeof window.filterContentByRole === 'function') {
                setTimeout(() => {
                    window.filterContentByRole();
                    console.log('✅ Role-based blocking applied on Faculty page');
                }, 100);
            }
        } catch (error) {
            console.error('Enhanced dropdowns error:', error);
        }
    }

    // Smooth scrolling for anchor links - SAME AS HOMEPAGE
    function initSmoothScrolling() {
        try {
            $('a[href^="#"]').off('click.smooth').on('click.smooth', function(e) {
                // Only prevent default if it's a same-page anchor
                if (this.pathname === window.location.pathname && this.hash) {
                    e.preventDefault();
                    const target = $(this.hash);
                    if (target.length) {
                        $('html, body').animate({
                            scrollTop: target.offset().top - 80
                        }, 1000);
                    }
                }
            });
        } catch (error) {
            console.error('Smooth scrolling error:', error);
        }
    }

    // Enhanced navbar toggler accessibility - SAME AS HOMEPAGE
    function initNavbarAccessibility() {
        try {
            $('#mainNav').off('show.bs.collapse hide.bs.collapse').on('show.bs.collapse', function () {
                $('.navbar-toggler').attr('aria-expanded', 'true');
            }).on('hide.bs.collapse', function () {
                $('.navbar-toggler').attr('aria-expanded', 'false');
            });
        } catch (error) {
            console.error('Navbar accessibility error:', error);
        }
    }

    // Faculty search functionality
    function initFacultySearch() {
        try {
            const $searchInput = $('#facultySearch');
            const $facultyCards = $('.faculty-card');
            
            if ($searchInput.length && $facultyCards.length) {
                $searchInput.off('input.search').on('input.search', function() {
                    const searchTerm = $(this).val().toLowerCase().trim();
                    
                    $facultyCards.each(function() {
                        const $card = $(this);
                        const facultyName = $card.find('.faculty-name').text().toLowerCase();
                        const facultyPosition = $card.find('.faculty-position').text().toLowerCase();
                        const facultyDepartment = $card.find('.faculty-department').text().toLowerCase();
                        
                        const matches = facultyName.includes(searchTerm) || 
                                      facultyPosition.includes(searchTerm) || 
                                      facultyDepartment.includes(searchTerm);
                        
                        if (matches || searchTerm === '') {
                            $card.show().addClass('fade-in');
                        } else {
                            $card.hide().removeClass('fade-in');
                        }
                    });
                    
                    // Show no results message if needed
                    const visibleCards = $facultyCards.filter(':visible').length;
                    const $noResults = $('#noResultsMessage');
                    
                    if (visibleCards === 0 && searchTerm !== '') {
                        if (!$noResults.length) {
                            $('.faculty-grid').after(`
                                <div id="noResultsMessage" class="text-center py-5">
                                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h5 class="text-muted">No faculty members found</h5>
                                    <p class="text-muted">Try adjusting your search terms</p>
                                </div>
                            `);
                        } else {
                            $noResults.show();
                        }
                    } else {
                        $noResults.hide();
                    }
                });
            }
        } catch (error) {
            console.error('Faculty search error:', error);
        }
    }

    // Faculty filter by department
    function initFacultyFilter() {
        try {
            const $filterSelect = $('#departmentFilter');
            const $facultyCards = $('.faculty-card');
            
            if ($filterSelect.length && $facultyCards.length) {
                $filterSelect.off('change.filter').on('change.filter', function() {
                    const selectedDepartment = $(this).val();
                    
                    $facultyCards.each(function() {
                        const $card = $(this);
                        const cardDepartment = $card.data('department') || $card.find('.faculty-department').text().toLowerCase();
                        
                        if (selectedDepartment === 'all' || cardDepartment.includes(selectedDepartment)) {
                            $card.show().addClass('fade-in');
                        } else {
                            $card.hide().removeClass('fade-in');
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Faculty filter error:', error);
        }
    }

    // Faculty modal functionality
    function initFacultyModal() {
        try {
            $('.faculty-card').off('click.modal').on('click.modal', function() {
                const $card = $(this);
                const name = $card.find('.faculty-name').text();
                const position = $card.find('.faculty-position').text();
                const department = $card.find('.faculty-department').text();
                const imageSrc = $card.find('.faculty-image img').attr('src');
                const email = $card.data('email') || '';
                const phone = $card.data('phone') || '';
                const bio = $card.data('bio') || 'No biography available.';
                
                // Populate modal
                $('#facultyModal .modal-title').text(name);
                $('#facultyModal .faculty-modal-image').attr('src', imageSrc).attr('alt', name);
                $('#facultyModal .faculty-modal-position').text(position);
                $('#facultyModal .faculty-modal-department').text(department);
                $('#facultyModal .faculty-modal-email').text(email).parent().toggle(!!email);
                $('#facultyModal .faculty-modal-phone').text(phone).parent().toggle(!!phone);
                $('#facultyModal .faculty-modal-bio').text(bio);
                
                // Show modal
                const facultyModal = new bootstrap.Modal(document.getElementById('facultyModal'));
                facultyModal.show();
            });
        } catch (error) {
            console.error('Faculty modal error:', error);
        }
    }

    // Safe initialization with error handling
    function safeInit(initFunction, functionName) {
        try {
            initFunction();
        } catch (error) {
            console.error(`Error in ${functionName}:`, error);
        }
    }
    
    // Initialize all functions
    function initFacultyPage() {
        // Initialize homepage-style functionality
        safeInit(enhanceMobileMenu, 'enhanceMobileMenu');
        safeInit(initSmoothScrolling, 'initSmoothScrolling');
        safeInit(initNavbarAccessibility, 'initNavbarAccessibility');
        safeInit(animateOnScroll, 'animateOnScroll');
        safeInit(createBackToTopButton, 'createBackToTopButton');
        safeInit(initBackToTop, 'initBackToTop');
        safeInit(enhanceDropdowns, 'enhanceDropdowns');
        safeInit(initFacultyHover, 'initFacultyHover');
        safeInit(initImageErrorHandling, 'initImageErrorHandling');
        safeInit(initFacultySearch, 'initFacultySearch');
        safeInit(initFacultyFilter, 'initFacultyFilter');
        safeInit(initFacultyModal, 'initFacultyModal');
        
        console.log('✅ CCIS Faculty Page Loaded Successfully');
        console.log('🎯 All homepage functionality integrated');
        console.log('📱 Mobile navigation menu initialized');
        console.log('👨‍🏫 Faculty cards with hover effects');
        console.log('🔍 Faculty search and filter initialized');
        console.log('🔐 Role-based blocking applied');
        console.log('⬆️ Back to Top button initialized');
    }
    
    // Scroll event listener - SAME AS HOMEPAGE
    function initScrollEvents() {
        try {
            $(window).off('scroll.faculty').on('scroll.faculty', function() {
                safeInit(animateOnScroll, 'animateOnScroll');
                // Back to top is handled by initBackToTop scroll listener
            });
        } catch (error) {
            console.error('Scroll events error:', error);
        }
    }
    
    // Initialize the page
    function initializeAll() {
        initFacultyPage();
        initScrollEvents();
        
        // Trigger initial animations
        setTimeout(() => {
            safeInit(animateOnScroll, 'animateOnScroll');
        }, 500);
    }

    // Initialize everything
    initializeAll();

    // Error boundary for unhandled errors
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        if (!e.error?.message?.includes('navigation')) {
            showNotification('An unexpected error occurred. Please refresh the page.', 'error');
        }
    });

    // Handle promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        if (!e.reason?.message?.includes('navigation')) {
            showNotification('An unexpected error occurred. Please refresh the page.', 'error');
        }
    });
});