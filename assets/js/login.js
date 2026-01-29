// LOGIN PAGE JAVASCRIPT - WITH ENHANCED VALIDATION MESSAGES

$(document).ready(function() {
    console.log('🔐 CCIS Login System Loading...');
    
    // ✅ CRITICAL: Initialize session management first for navigation blocking
    const session = checkUserSession();
    if (session.isValid) {
        updateUIForLoggedInUser(session.user);
    } else {
        updateUIForGuest();
    }
    
    // Apply role-based content filtering for navigation
    filterContentByRole();
    
    // PREVENT BACK BUTTON - CRITICAL SECURITY
    if (window.history && window.history.pushState) {
        window.history.pushState('forward', null, window.location.href);
        
        $(window).on('popstate', function() {
            window.history.pushState('forward', null, window.location.href);
        });
    }

    // CHECK IF ALREADY LOGGED IN
    if (session.isValid && !isIntentionalLogin()) {
        console.log('User already logged in:', session.user);
        showSuccess(`Welcome back, ${session.user.name}! Redirecting...`);
        
        setTimeout(() => {
            redirectBasedOnRole(session.user);
        }, 1500);
        return;
    }

    // CHECK FOR LOGOUT MESSAGE
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
        showSuccess('You have been logged out successfully.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // ✅ ENHANCED INITIALIZATION - IDENTICAL TO HOMEPAGE
    initializeAll();
});

// ENHANCED SECURITY INITIALIZATION
function initializeSecurity() {
    if (checkAccountLock()) {
        return;
    }
    
    localStorage.removeItem('ccis_manual_login');
    
    $('#email, #password').on('input', function() {
        const value = $(this).val();
        $(this).val(value.replace(/[<>]/g, ''));
        
        // Clear validation messages when user starts typing
        if ($(this).attr('id') === 'email') {
            clearEmailValidation();
        } else if ($(this).attr('id') === 'password') {
            clearPasswordValidation();
        }
    });
}

// CLEAR VALIDATION MESSAGES
function clearEmailValidation() {
    $('#emailValidation').removeClass('error').hide();
    $('#email').removeClass('error');
    $('.input-group').removeClass('error');
}

function clearPasswordValidation() {
    $('#passwordValidation').removeClass('error').hide();
    $('#password').removeClass('error');
    $('.input-group').removeClass('error');
}

// SHOW VALIDATION MESSAGES
function showEmailValidation(message) {
    $('#emailValidationText').text(message);
    $('#emailValidation').addClass('error').show();
    $('#email').addClass('error');
    $('.input-group').addClass('error');
}

function showPasswordValidation(message) {
    $('#passwordValidationText').text(message);
    $('#passwordValidation').addClass('error').show();
    $('#password').addClass('error');
    $('.input-group').addClass('error');
}

// ============================================
// ✅ IDENTICAL NAVIGATION FUNCTIONALITY AS HOMEPAGE
// ============================================

// Enhanced Dropdown Hover Functionality - IDENTICAL COPY FROM HOMEPAGE
function initDropdownHover() {
    console.log('🔄 Initializing dropdown hover (identical to homepage)...');
    
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
    
    console.log('✅ Dropdown hover initialized (identical to homepage)');
}

// Enhanced Mobile Menu Functionality - IDENTICAL COPY FROM HOMEPAGE
function enhanceMobileMenu() {
    console.log('📱 Initializing mobile menu (identical to homepage)...');
    
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
    
    console.log('✅ Mobile menu initialized (identical to homepage)');
}

// Smooth scrolling for anchor links - IDENTICAL COPY FROM HOMEPAGE
function initSmoothScrolling() {
    console.log('🎯 Initializing smooth scrolling (identical to homepage)...');
    
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
    
    console.log('✅ Smooth scrolling initialized (identical to homepage)');
}

// Enhanced navbar toggler accessibility - IDENTICAL COPY FROM HOMEPAGE
function initNavbarAccessibility() {
    console.log('♿ Initializing navbar accessibility (identical to homepage)...');
    
    $('#mainNav').on('show.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'true');
    });

    $('#mainNav').on('hide.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'false');
    });
    
    console.log('✅ Navbar accessibility initialized (identical to homepage)');
}

// Back to Top Button - IDENTICAL COPY FROM HOMEPAGE
function initBackToTop() {
    console.log('🔄 Initializing Back to Top button (identical to homepage)...');
    
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
    
    console.log('✅ Back to Top button initialized successfully (identical to homepage)');
}

// ============================================
// LOGIN-SPECIFIC FUNCTIONALITY
// ============================================

// INITIALIZE LOGIN PAGE - COMBINES NAVIGATION + LOGIN
function initializeLoginPage() {
    console.log('🎯 Login page initialized');
    initializeSecurity();
    
    // PASSWORD VISIBILITY TOGGLE
    $('#togglePassword').on('click', function() {
        const passwordField = $('#password');
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        const isVisible = type === 'text';
        
        passwordField.attr('type', type);
        
        const icon = $(this).find('i');
        icon.toggleClass('fa-eye fa-eye-slash');
        
        $(this).attr({
            'aria-label': isVisible ? 'Hide password' : 'Show password',
            'title': isVisible ? 'Hide password' : 'Show password'
        });
        
        $(this).find('.visually-hidden').text(isVisible ? 'Hide password' : 'Show password');
    });

    // LOGIN FORM SUBMISSION WITH ENHANCED VALIDATION
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous validation messages
        clearEmailValidation();
        clearPasswordValidation();
        hideError();
        hideSuccess();
        
        if (checkAccountLock()) {
            return;
        }
        
        const email = $('#email').val().trim().toLowerCase();
        const password = $('#password').val();
        
        if (!email || !password) {
            if (!email) {
                showEmailValidation('Please enter your email address');
            }
            if (!password) {
                showPasswordValidation('Please enter your password');
            }
            return;
        }
        
        const loginBtn = $('#loginBtn');
        const originalText = loginBtn.html();
        loginBtn.html('<div class="loading-spinner"></div>Authenticating...');
        loginBtn.prop('disabled', true);
        
        setTimeout(() => {
            const loginResult = authenticateUser(email, password);
            
            if (loginResult.success) {
                failedAttempts = 0;
                localStorage.removeItem('ccis_login_lock');
                
                storeUserSession(loginResult.user);
                showSuccess(`Login successful! Welcome, ${loginResult.user.name}`);
                
                setTimeout(() => {
                    redirectBasedOnRole(loginResult.user);
                }, 1500);
            } else {
                trackFailedAttempt();
                
                // Show specific validation messages based on error type
                if (loginResult.errorType === 'email') {
                    showEmailValidation(loginResult.message);
                } else if (loginResult.errorType === 'password') {
                    showPasswordValidation(loginResult.message);
                } else {
                    showError(loginResult.message);
                }
                
                loginBtn.html(originalText);
                loginBtn.prop('disabled', false);
            }
        }, 1500);
    });

    // FORGOT PASSWORD
    $('#forgotPassword').on('click', function(e) {
        e.preventDefault();
        alert('Please contact the CCIS Office or Super Admin to reset your password.\n\nContact Info:\nEmail: ccis@bisu.edu.ph\nPhone: (038) 123-4567');
    });

    // ENTER KEY SUBMISSION
    $('#email, #password').on('keypress', function(e) {
        if (e.which === 13) {
            $('#loginForm').submit();
        }
    });
    
    $('#email').focus();
}

// ✅ UPDATED INITIALIZATION FUNCTION - IDENTICAL STRUCTURE AS HOMEPAGE
function initializeAll() {
    console.log('🚀 Initializing CCIS Login Page (IDENTICAL TO HOMEPAGE)...');
    
    // ✅ CRITICAL: Initialize core navigation functionality (IDENTICAL TO HOMEPAGE)
    initDropdownHover();
    enhanceMobileMenu();
    initSmoothScrolling();
    initNavbarAccessibility();
    
    // ✅ CRITICAL: Initialize Back to Top (IDENTICAL TO HOMEPAGE)
    initBackToTop();
    
    // Initialize login-specific functionality
    initializeLoginPage();

    console.log('✅ CCIS Login Page Loaded Successfully');
    console.log('✅ Back to Top button: ACTIVE');
    console.log('✅ Navigation: ACTIVE');
    console.log('✅ Dropdown Hover: ACTIVE (IDENTICAL TO HOMEPAGE)');
    console.log('✅ All features working exactly like homepage');
}

// ============================================
// AUTHENTICATION & SESSION MANAGEMENT
// ============================================

// ROLE-BASED REDIRECTION (WITH SUPER ADMIN)
function redirectBasedOnRole(user) {
    console.log('🎯 Redirecting user based on role:', user.role, user.organization);
    
    if (user.role === 'superadmin') {
        console.log('🚀 Redirecting to Super Admin Dashboard');
        window.location.replace('super_admin/index.html');
    } else if (user.role === 'orgadmin') {
        if (user.organization && user.organization.includes('CS Guild')) {
            console.log('💻 Redirecting to CS Guild Admin');
            window.location.replace('csguild_admin/index.html');
        } else if (user.organization && user.organization.includes('The Legion')) {
            console.log('🌐 Redirecting to The Legion Admin');
            window.location.replace('legion_admin/index.html');
        } else {
            console.log('📱 Redirecting to Main Website');
            window.location.replace('index.html');
        }
    } else {
        console.log('🎓 Redirecting to Main Website (Student)');
        window.location.replace('index.html');
    }
}

// USER AUTHENTICATION SYSTEM - NOW ACCEPTS BOTH BISU AND PERSONAL EMAILS
function authenticateUser(email, password) {
    console.log('🔑 Authenticating user via backend API:', email);
    
    // Make synchronous AJAX call to backend API
    let result = {success: false, message: 'Authentication failed'};
    
    $.ajax({
        type: 'POST',
        url: 'login/api_authenticate',
        dataType: 'json',
        data: {
            email: email,
            password: password
        },
        async: false,  // Synchronous call
        success: function(response) {
            console.log('✅ Backend authentication successful:', response);
            if (response.success && response.user) {
                result = {
                    success: true,
                    user: {
                        email: response.user.email,
                        role: response.user.role,
                        name: response.user.name,
                        first_name: response.user.first_name,
                        last_name: response.user.last_name,
                        loginTime: new Date().toISOString(),
                        sessionId: generateSessionId()
                    }
                };
            } else {
                result = {
                    success: false,
                    errorType: 'credentials',
                    message: response.message || 'Invalid credentials'
                };
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ Backend authentication error:', error, xhr.responseText);
            let errorMsg = 'Invalid email or password';
            
            try {
                const response = JSON.parse(xhr.responseText);
                errorMsg = response.message || errorMsg;
            } catch(e) {
                // Response is not JSON
            }
            
            result = {
                success: false,
                errorType: 'credentials',
                message: errorMsg
            };
        }
    });
    
    return result;
}


// GENERATE SESSION ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// STORE USER SESSION - NO EXPIRATION
function storeUserSession(user) {
    localStorage.setItem('ccis_user', JSON.stringify(user));
    localStorage.setItem('ccis_login_time', new Date().toISOString());
    localStorage.setItem('ccis_session_id', user.sessionId);
    
    // NO EXPIRATION SET - SESSION WILL PERSIST UNTIL MANUAL LOGOUT
    logLoginActivity(user);
    
    console.log('💾 User session stored (no expiration):', user);
}

// LOG LOGIN ACTIVITY
function logLoginActivity(user) {
    const loginLogs = JSON.parse(localStorage.getItem('ccis_login_logs') || '[]');
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isPersonalEmail: user.isPersonalEmail || false,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent
    };
    
    loginLogs.unshift(logEntry);
    
    if (loginLogs.length > 100) {
        loginLogs.splice(100);
    }
    
    localStorage.setItem('ccis_login_logs', JSON.stringify(loginLogs));
    console.log('📝 Login activity logged for:', user.email);
}

// SECURITY FUNCTIONS
function trackFailedAttempt() {
    failedAttempts++;
    const attemptsLeft = MAX_ATTEMPTS - failedAttempts;
    
    if (failedAttempts >= MAX_ATTEMPTS) {
        lockAccountTemporarily();
        showError('Too many failed attempts. Account locked for 15 minutes.');
        return;
    }
    
    if (attemptsLeft <= 2) {
        showError(`Invalid credentials. ${attemptsLeft} attempt(s) remaining before lockout.`);
    }
}

function lockAccountTemporarily() {
    const lockUntil = Date.now() + LOCKOUT_TIME;
    localStorage.setItem('ccis_login_lock', lockUntil.toString());
    
    $('#loginBtn').prop('disabled', true).text('Account Locked (15 min)');
    $('#email, #password').prop('disabled', true).addClass('account-locked');
    
    setTimeout(() => {
        failedAttempts = 0;
        localStorage.removeItem('ccis_login_lock');
        $('#loginBtn').prop('disabled', false).html('<i class="fas fa-sign-in-alt me-2"></i>Login');
        $('#email, #password').prop('disabled', false).removeClass('account-locked');
        showSuccess('Account unlocked. You may try logging in again.');
    }, LOCKOUT_TIME);
}

function checkAccountLock() {
    const lockUntil = localStorage.getItem('ccis_login_lock');
    if (lockUntil && Date.now() < parseInt(lockUntil)) {
        const timeLeft = Math.ceil((parseInt(lockUntil) - Date.now()) / 1000 / 60);
        showError(`Account locked. Try again in ${timeLeft} minutes.`);
        $('#loginBtn').prop('disabled', true).text(`Account Locked (${timeLeft} min)`);
        $('#email, #password').prop('disabled', true).addClass('account-locked');
        return true;
    }
    return false;
}

// SESSION MANAGEMENT FUNCTIONS - NO EXPIRATION CHECK
function checkUserSession() {
    const userData = localStorage.getItem('ccis_user');
    const sessionId = localStorage.getItem('ccis_session_id');
    
    if (!userData || !sessionId) {
        return { isValid: false, user: null };
    }
    
    try {
        const user = JSON.parse(userData);
        
        if (user.sessionId !== sessionId) {
            console.log('🚫 Session ID mismatch');
            clearUserSession();
            return { isValid: false, user: null };
        }
        
        // NO EXPIRATION CHECK - SESSION IS ALWAYS VALID UNTIL MANUAL LOGOUT
        return { isValid: true, user: user };
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        clearUserSession();
        return { isValid: false, user: null };
    }
}

function clearUserSession() {
    localStorage.removeItem('ccis_user');
    localStorage.removeItem('ccis_login_time');
    localStorage.removeItem('ccis_session_expiry');
    localStorage.removeItem('ccis_session_id');
    localStorage.removeItem('ccis_login_lock');
    localStorage.removeItem('ccis_manual_login');
    localStorage.removeItem('admin_return_url');
    sessionStorage.removeItem('admin_return_url');
    
    failedAttempts = 0;
    
    console.log('🧹 User session completely cleared');
}

// HELPER FUNCTIONS
function isIntentionalLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('force') || urlParams.has('test') || 
           document.referrer.includes('login') ||
           localStorage.getItem('ccis_manual_login') === 'true';
}

// MESSAGE DISPLAY FUNCTIONS
function showError(message) {
    $('#errorText').text(message);
    $('#errorMessage').slideDown(300);
    $('#successMessage').slideUp(300);
    
    $('#loginForm').addClass('shake-animation');
    setTimeout(() => {
        $('#loginForm').removeClass('shake-animation');
    }, 500);
    
    setTimeout(() => {
        $('#errorMessage').slideUp(300);
    }, 5000);
    
    console.log('❌ Login error:', message);
}

function hideError() {
    $('#errorMessage').slideUp(300);
}

function showSuccess(message) {
    $('#successText').text(message);
    $('#successMessage').slideDown(300);
    $('#errorMessage').slideUp(300);
    
    console.log('✅ Login success:', message);
}

function hideSuccess() {
    $('#successMessage').slideUp(300);
}

// Security tracking variables
let failedAttempts = 0;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; 

// EXPORT FUNCTIONS FOR GLOBAL USE
window.checkUserSession = checkUserSession;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserRole = getCurrentUserRole;
window.hasAccess = hasAccess;
window.redirectBasedOnRole = redirectBasedOnRole;

// Utility functions (if needed from session-management.js)
function getCurrentUser() {
    const session = checkUserSession();
    return session.isValid ? session.user : null;
}

function getCurrentUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

function hasAccess(requiredRole) {
    const userRole = getCurrentUserRole();
    if (!userRole) return false;
    
    const roleHierarchy = {
        'superadmin': 4,
        'orgadmin': 3,
        'faculty': 2,
        'student': 1
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}