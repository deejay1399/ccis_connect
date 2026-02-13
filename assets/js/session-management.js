// SESSION MANAGEMENT FOR ALL PAGES - DEBUG VERSION

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Session management initializing...');
    
    // Initialize user session
    const session = initializeUserSession();
    
    // Apply role-based content filtering
    filterContentByRole();
    
    // Enhanced: Check if we should show return button (for public pages)
    checkAndShowReturnButton(session.user);
    
    // Update navigation active state
    updateNavigationActiveState();
    
    // Log current access level
    console.log(`📄 Page loaded with ${session.isValid ? session.user.role : 'guest'} access`);
    console.log('📍 Current page:', window.location.pathname);
});

function getBaseUrl() {
    if (window.BASE_URL) {
        return window.BASE_URL;
    }
    const origin = window.location.origin || '';
    return origin.endsWith('/') ? origin : origin + '/';
}

function buildDashboardReturnConfig(user) {
    if (!user || !user.role) {
        return null;
    }

    const base = getBaseUrl();

    if (user.role === 'superadmin') {
        return {
            url: base + 'index.php/admin/dashboard',
            text: 'Return to Dashboard'
        };
    }

    if (user.role === 'faculty') {
        return {
            url: base + 'index.php/admin/dashboard',
            text: 'Return to Dashboard'
        };
    }

    if (user.role === 'orgadmin') {
        return {
            url: base + 'index.php/org/dashboard',
            text: 'Return to Dashboard'
        };
    }

    return null;
}

// ENHANCED: Check and show return button for admin users on public pages
function checkAndShowReturnButton(user) {
    console.log('Checking return button for user:', user);

    const config = buildDashboardReturnConfig(user);
    if (!config) {
        console.log('User is not eligible for dashboard return button');
        return;
    }

    // Keep canonical URL so stale legacy values don't break navigation.
    localStorage.setItem('admin_return_url', config.url);
    sessionStorage.setItem('admin_return_url', config.url);

    addFloatingReturnButton(config);
}

// ENHANCED FLOATING RETURN BUTTON FUNCTION - canonical role routes
function addFloatingReturnButton(config) {
    console.log('Adding floating return button with config:', config);

    const existingBtn = document.getElementById('floating-return-btn');
    if (existingBtn) {
        existingBtn.remove();
    }

    if (!config || !config.url) {
        console.log('Missing dashboard return config, cannot create button');
        return;
    }

    const returnBtn = document.createElement('a');
    returnBtn.href = config.url;
    returnBtn.className = 'floating-return-btn';
    returnBtn.id = 'floating-return-btn';
    returnBtn.setAttribute('aria-label', config.text || 'Return to Dashboard');
    returnBtn.setAttribute('title', config.text || 'Return to Dashboard');
    returnBtn.innerHTML = `<i class="fas fa-tachometer-alt"></i>${config.text || 'Return to Dashboard'}`;

    document.body.appendChild(returnBtn);

    setTimeout(() => {
        returnBtn.classList.add('show');
    }, 100);
}
// ENHANCED: Update UI for logged in user - show floating button when appropriate
function updateUIForLoggedInUser(user) {
    console.log('👤 Updating UI for logged in user:', user.name);
    
    // Show logout icon, hide login icon
    const loginIconLink = document.getElementById('login-icon-link');
    const logoutIconLink = document.getElementById('logout-icon-link');
    const userInfoItem = document.getElementById('user-info-item');
    
    if (loginIconLink) loginIconLink.style.display = 'none';
    if (logoutIconLink) {
        logoutIconLink.style.display = 'flex';
        // FIXED: Change logout icon to person icon instead of arrow
        logoutIconLink.innerHTML = '<i class="fas fa-user-circle"></i>';
        // Ensure absolute logout URL
        if (window.BASE_URL) {
            logoutIconLink.href = window.BASE_URL + 'index.php/logout?logout=true';
        }
    }
    if (userInfoItem) userInfoItem.style.display = 'none';
    
    // Add logout functionality to both icon and text links
    if (logoutIconLink) {
        logoutIconLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    console.log('✅ UI updated for logged in user');
}

function updateUIForGuest() {
    console.log('👤 Updating UI for guest user');
    
    // Hide user info and logout icon, show login icon
    const userInfoItem = document.getElementById('user-info-item');
    const logoutIconLink = document.getElementById('logout-icon-link');
    const loginIconLink = document.getElementById('login-icon-link');
    const logoutLink = document.getElementById('logout-link');
    const loginLink = document.getElementById('login-link');
    
    if (userInfoItem) userInfoItem.style.display = 'none';
    if (logoutIconLink) logoutIconLink.style.display = 'none';
    if (loginIconLink) {
        loginIconLink.style.display = 'flex';
        if (window.BASE_URL) {
            loginIconLink.href = window.BASE_URL + 'index.php/login';
        }
        // Ensure click always navigates
        loginIconLink.addEventListener('click', function() {
            if (window.BASE_URL) {
                window.location.href = window.BASE_URL + 'index.php/login';
            }
        });
    }
    
    // Handle text links if they exist
    if (logoutLink) logoutLink.style.display = 'none';
    if (loginLink) {
        loginLink.style.display = 'block';
        loginLink.href = window.BASE_URL ? window.BASE_URL + 'index.php/login' : './index.php/login';
    }
    
    console.log('✅ UI updated for guest user');
}

// ========================================
// UPDATED SESSION MANAGEMENT FUNCTIONS (NO EXPIRATION)
// ========================================

function checkUserSession() {
    console.log('🔐 Checking user session...');
    
    const userData = localStorage.getItem('ccis_user');
    const sessionId = localStorage.getItem('ccis_session_id');
    
    if (!userData || !sessionId) {
        console.log('❌ No valid session found');
        return { isValid: false, user: null };
    }
    
    try {
        const user = JSON.parse(userData);
        
        // Check if session ID matches
        if (user.sessionId !== sessionId) {
            console.log('🚫 Session ID mismatch');
            clearUserSession();
            return { isValid: false, user: null };
        }
        
        // NO EXPIRATION CHECK - SESSION IS ALWAYS VALID UNTIL MANUAL LOGOUT
        console.log('✅ Valid session found for user:', user.name);
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
    localStorage.removeItem('ccis_session_id');
    // Also clear admin return URLs on logout
    localStorage.removeItem('admin_return_url');
    sessionStorage.removeItem('admin_return_url');
    
    console.log('🧹 User session completely cleared');
}

function logoutUser() {
    const user = JSON.parse(localStorage.getItem('ccis_user') || '{}');
    console.log('🚪 Logging out user:', user.name);
    
    // Show custom centered logout modal instead of browser confirm
    showLogoutModal(user);
}

// MODERN LOGOUT MODAL - Updated with your requirements
function showLogoutModal(user) {
    console.log('🔄 Showing logout modal');
    
    // Remove existing modal if any
    const existingModal = document.getElementById('logoutModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal elements using pure JavaScript
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'logoutModal';
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', 'logoutModalLabel');
    modalDiv.setAttribute('aria-hidden', 'true');
    modalDiv.setAttribute('data-bs-backdrop', 'static'); 
    
    // Updated HTML structure with your requirements
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content" style="border-radius: 12px; border: 4px solid var(--accent); box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-sign-out-alt" style="font-size: 3rem; color: #dc3545;"></i>
                    </div>
                    <h5 class="mb-5" style="color: var(--primary-purple); font-weight: 700; font-size: 1.5rem;">
                        Are you sure you want to logout?
                    </h5>
                    <div class="d-flex gap-3 justify-content-center">
                        <button type="button" class="btn btn-secondary cancel-btn" data-bs-dismiss="modal" 
                            style="border-radius: 50px; padding: 10px 30px; font-weight: 600; 
                            background: #f8f9fa; color: #6c757d; border: 2px solid #dee2e6;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            Cancel
                        </button>
                        
                        <button type="button" class="btn btn-danger logout-btn" id="confirmLogoutBtn" 
                            style="border-radius: 50px; padding: 10px 30px; font-weight: 600; 
                            background: #f8f9fa; color: #6c757d; border: 2px solid #dee2e6;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    // Initialize Bootstrap Modal
    const $modalElement = $(modalDiv);
    $modalElement.modal('show');

    // Add hover effects for buttons
    const cancelBtn = modalDiv.querySelector('.cancel-btn');
    const logoutBtn = modalDiv.querySelector('.logout-btn');

    // Cancel button hover effects
    cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--primary-purple)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--primary-purple)';
        this.style.boxShadow = '0 4px 10px rgba(75, 0, 130, 0.3)';
    });

    cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.color = '#6c757d';
        this.style.borderColor = '#dee2e6';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    // Logout button hover effects
    logoutBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--logout-color)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--logout-color)';
        this.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
    });

    logoutBtn.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.color = '#6c757d';
        this.style.borderColor = '#dee2e6';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    // Focus management and event listeners
    $modalElement.on('shown.bs.modal', function() {
        document.getElementById('confirmLogoutBtn').focus();
    });

    document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
        const btn = this;
        
        // Show loading state
        btn.innerHTML = '<span class="logout-loading-spinner" style="border-top-color: white;"></span>Logging out...';
        btn.disabled = true;
        
        // Log logout activity
        logLogoutActivity(user);
        
        // Clear session and redirect
        setTimeout(() => {
                clearUserSession();
                $modalElement.modal('hide'); 
                
                setTimeout(() => {
                    // Redirect to root logout using global BASE_URL
                    window.location.href = window.BASE_URL + 'index.php/logout?logout=true';
                }, 500);
        }, 1000);
    });

    // Keyboard navigation
    modalDiv.addEventListener('keydown', function(e) {
        // Close modal on Escape key, since 'X' button is removed
        if (e.key === 'Escape') {
            $modalElement.modal('hide');
        }
        
        if (e.key === 'Enter' && !document.getElementById('confirmLogoutBtn').disabled) {
            document.getElementById('confirmLogoutBtn').click();
        }
    });

    // Clean up modal after it's hidden
    $modalElement.on('hidden.bs.modal', function() {
        modalDiv.remove();
    });
}

// Admin-specific logout modal handler
function showLogoutModalWithAdminCleanup() {
    console.log('🔄 Showing admin logout modal with cleanup');
    
    const user = JSON.parse(localStorage.getItem('ccis_user') || '{}');
    
    // Remove existing modal if any
    const existingModal = document.getElementById('logoutModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal elements using pure JavaScript
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'logoutModal';
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', 'logoutModalLabel');
    modalDiv.setAttribute('aria-hidden', 'true');
    modalDiv.setAttribute('data-bs-backdrop', 'static'); 
    
    // Updated HTML structure with your requirements
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content" style="border-radius: 12px; border: 4px solid var(--accent); box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-sign-out-alt" style="font-size: 3rem; color: #dc3545;"></i>
                    </div>
                    <h5 class="mb-5" style="color: var(--primary-purple); font-weight: 700; font-size: 1.5rem;">
                        Are you sure you want to logout?
                    </h5>
                    <div class="d-flex gap-3 justify-content-center">
                        <button type="button" class="btn btn-secondary cancel-btn" data-bs-dismiss="modal" 
                            style="border-radius: 50px; padding: 10px 30px; font-weight: 600; 
                            background: #f8f9fa; color: #6c757d; border: 2px solid #dee2e6;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            Cancel
                        </button>
                        
                        <button type="button" class="btn btn-danger logout-btn" id="confirmAdminLogoutBtn" 
                            style="border-radius: 50px; padding: 10px 30px; font-weight: 600; 
                            background: #f8f9fa; color: #6c757d; border: 2px solid #dee2e6;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    // Initialize Bootstrap Modal
    const $modalElement = $(modalDiv);
    $modalElement.modal('show');

    // Add hover effects for buttons
    const cancelBtn = modalDiv.querySelector('.cancel-btn');
    const logoutBtn = modalDiv.querySelector('.logout-btn');

    // Cancel button hover effects
    cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--primary-purple)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--primary-purple)';
        this.style.boxShadow = '0 4px 10px rgba(75, 0, 130, 0.3)';
    });

    cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.color = '#6c757d';
        this.style.borderColor = '#dee2e6';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    // Logout button hover effects
    logoutBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--logout-color)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--logout-color)';
        this.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
    });

    logoutBtn.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.color = '#6c757d';
        this.style.borderColor = '#dee2e6';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    // Focus management and event listeners
    $modalElement.on('shown.bs.modal', function() {
        document.getElementById('confirmAdminLogoutBtn').focus();
    });

    document.getElementById('confirmAdminLogoutBtn').addEventListener('click', function() {
        const btn = this;
        
        // Show loading state
        btn.innerHTML = '<span class="logout-loading-spinner" style="border-top-color: white;"></span>Logging out...';
        btn.disabled = true;
        
        // Log logout activity
        logLogoutActivity(user);
        
        // Clear session (both standard and admin-specific)
        setTimeout(() => {
                clearUserSession();
                // Clear admin-specific auth state
                try {
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');
                    localStorage.removeItem('admin_return_url');
                    sessionStorage.removeItem('admin_return_url');
                } catch (e) {
                    // Intentionally ignore storage errors (e.g., private mode / disabled)
                }
                
                $modalElement.modal('hide'); 
                
                setTimeout(() => {
                    // Redirect to root logout using global BASE_URL
                    window.location.href = window.BASE_URL + 'index.php/logout?logout=true';
                }, 500);
        }, 1000);
    });

    // Keyboard navigation
    modalDiv.addEventListener('keydown', function(e) {
        // Close modal on Escape key, since 'X' button is removed
        if (e.key === 'Escape') {
            $modalElement.modal('hide');
        }
        
        if (e.key === 'Enter' && !document.getElementById('confirmAdminLogoutBtn').disabled) {
            document.getElementById('confirmAdminLogoutBtn').click();
        }
    });

    // Clean up modal after it's hidden
    $modalElement.on('hidden.bs.modal', function() {
        modalDiv.remove();
    });
}

function logLogoutActivity(user) {
    const logoutLogs = JSON.parse(localStorage.getItem('ccis_logout_logs') || '[]');
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        email: user.email || 'Unknown',
        name: user.name || 'Unknown',
        role: user.role || 'Unknown'
    };
    
    logoutLogs.unshift(logEntry);
    
    if (logoutLogs.length > 50) {
        logoutLogs.splice(50);
    }
    
    localStorage.setItem('ccis_logout_logs', JSON.stringify(logoutLogs));
    console.log('📝 Logout activity logged for:', user.email || 'Unknown');
}

function getCurrentUserRole() {
    const session = checkUserSession();
    return session.isValid ? session.user.role : 'guest';
}

function getCurrentUser() {
    const session = checkUserSession();
    return session.isValid ? session.user : null;
}

function getRoleDisplayName(role) {
    const roleNames = {
        'superadmin': 'Super Admin',
        'faculty': 'Faculty',
        'student': 'Student',
        'orgadmin': 'Organization Admin',
        'guest': 'Guest'
    };
    return roleNames[role] || 'User';
}

function hasAccess(requiredRole) {
    const userRole = getCurrentUserRole();
    const roleHierarchy = {
        'guest': 0,
        'student': 1,
        'faculty': 3,
        'orgadmin': 2,
        'superadmin': 3
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

function initializeUserSession() {
    const session = checkUserSession();
    
    if (session.isValid) {
        updateUIForLoggedInUser(session.user);
    } else {
        updateUIForGuest();
    }
    
    return session;
}

// ENHANCED NOTIFICATION SYSTEM - CONSISTENT ACROSS ALL PAGES
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

// ROLE-BASED CONTENT ACCESS CONTROL
function getAccessibleContent(userRole = 'guest') {
    const contentAccess = {
        'guest': [
            'home', 'history', 'vmgo', 'faculty', 'hymn', 
            'programs', 'subjects', 'announcements', 'news', 
            'events', 'deanslist', 'achievements'
        ],
        'student': [
            'home', 'history', 'vmgo', 'faculty', 'hymn',
            'programs', 'subjects', 'schedule', 'announcements', 
            'news', 'events', 'deanslist', 'achievements', 'calendar', 
            'forms', 'organization', 'curriculum'
        ],
        'faculty': [
            'home', 'history', 'vmgo', 'faculty', 'hymn',
            'programs', 'subjects', 'schedule', 'announcements', 
            'news', 'events', 'deanslist', 'achievements', 'calendar', 
            'forms', 'organization', 'curriculum'
        ],
        'orgadmin': [
            'home', 'history', 'vmgo', 'faculty', 'hymn',
            'programs', 'subjects', 'schedule', 'announcements', 
            'news', 'events', 'deanslist', 'achievements', 'calendar', 
            'forms', 'organization', 'curriculum'
        ],
        'superadmin': [
            'home', 'history', 'vmgo', 'faculty', 'hymn',
            'programs', 'subjects', 'schedule', 'announcements', 
            'news', 'events', 'deanslist', 'achievements', 'calendar', 
            'forms', 'organization', 'admin', 'curriculum'
        ]
    };
    
    return contentAccess[userRole] || contentAccess['guest'];
}

// ENHANCED: BLOCK NAVIGATION ITEMS FOR GUESTS WITH CONSISTENT STYLING
function blockNavigationItem(element, message) {
    element.classList.add('blocked-nav-item');
    element.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Show notification that they need to login
        window.showNotification(message, 'warning');
    });
    
    // Add consistent visual indication that item is blocked
    element.style.opacity = '0.6';
    element.style.cursor = 'not-allowed';
    element.setAttribute('title', 'Login required');
    
    // Remove any hover transforms and background colors
    element.style.transform = 'none';
    element.style.backgroundColor = 'transparent';
}

// FIXED: Navigation blocking that properly handles logged-in users
function filterContentByRole() {
    const userRole = getCurrentUserRole();
    const user = getCurrentUser();
    
    console.log(`🔐 Current user role: ${userRole}`);
    
    // Role-based navigation filtering - BLOCK instead of HIDE
    if (!hasAccess('student')) {
        console.log('🚫 User is guest - blocking restricted content');
        
        // Block Forms link for guests
        const formsLink = document.querySelector('a[href="forms.html"]');
        if (formsLink && !formsLink.classList.contains('blocked-nav-item')) {
            blockNavigationItem(formsLink, 'You need to login as a student to access forms.');
        }
        
        // Block Organization dropdown for GUESTS only
        const orgDropdown = document.getElementById('organizationDropdown');
        if (orgDropdown && !orgDropdown.classList.contains('blocked-nav-item')) {
            blockNavigationItem(orgDropdown, 'You need to login as a student to view organizations.');
        }

        // Also block individual links within the organization dropdown
        const orgLinks = document.querySelectorAll('#organizationDropdown + .dropdown-menu .dropdown-item');
        orgLinks.forEach(link => {
            if (!link.classList.contains('blocked-nav-item')) {
                blockNavigationItem(link, 'You need to login as a student to view organizations.');
            }
        });
        
        // BLOCK CURRICULUM for guests
        const curriculumLinks = document.querySelectorAll('.dropdown-item[href*="curriculum"]');
        curriculumLinks.forEach(link => {
            if (!link.classList.contains('blocked-nav-item')) {
                blockNavigationItem(link, 'You need to login as a student to view curriculum.');
            }
        });
        
        // Block Schedule from Academics dropdown for guests
        const scheduleLinks = document.querySelectorAll('.dropdown-item[href*="schedule"]');
        scheduleLinks.forEach(link => {
            if (!link.classList.contains('blocked-nav-item')) {
                blockNavigationItem(link, 'You need to login as a student to view class schedules.');
            }
        });
        
        // Block Calendar from Updates dropdown for guests
        const calendarLinks = document.querySelectorAll('.dropdown-item[href*="calendar"]');
        calendarLinks.forEach(link => {
            if (!link.classList.contains('blocked-nav-item')) {
                blockNavigationItem(link, 'You need to login as a student to view the school calendar.');
            }
        });

    } else {
        console.log('✅ User is logged in - removing all blocking');
        
        // USER IS LOGGED IN - REMOVE ALL BLOCKING
        
        // Remove blocking from Forms link
        const formsLink = document.querySelector('a[href="forms.html"]');
        if (formsLink && formsLink.classList.contains('blocked-nav-item')) {
            formsLink.classList.remove('blocked-nav-item');
            formsLink.style.opacity = '1';
            formsLink.style.cursor = 'pointer';
            formsLink.removeAttribute('title');
            
            // Remove the click event listener that was blocking it
            const newFormsLink = formsLink.cloneNode(true);
            formsLink.parentNode.replaceChild(newFormsLink, formsLink);
        }
        
        // Remove blocking from Organization dropdown
        const orgDropdown = document.getElementById('organizationDropdown');
        if (orgDropdown && orgDropdown.classList.contains('blocked-nav-item')) {
            orgDropdown.classList.remove('blocked-nav-item');
            orgDropdown.style.opacity = '1';
            orgDropdown.style.cursor = 'pointer';
            orgDropdown.removeAttribute('title');
            
            // Remove the click event listener that was blocking it
            const newOrgDropdown = orgDropdown.cloneNode(true);
            orgDropdown.parentNode.replaceChild(newOrgDropdown, orgDropdown);
        }

        // Remove blocking from organization dropdown links
        const orgLinks = document.querySelectorAll('#organizationDropdown + .dropdown-menu .dropdown-item');
        orgLinks.forEach(link => {
            if (link.classList.contains('blocked-nav-item')) {
                link.classList.remove('blocked-nav-item');
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                link.removeAttribute('title');
                
                // Remove the click event listener that was blocking it
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
        
        // Remove blocking from curriculum links
        const curriculumLinks = document.querySelectorAll('.dropdown-item[href*="curriculum"]');
        curriculumLinks.forEach(link => {
            if (link.classList.contains('blocked-nav-item')) {
                link.classList.remove('blocked-nav-item');
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                link.removeAttribute('title');
                
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
        
        // Remove blocking from schedule links
        const scheduleLinks = document.querySelectorAll('.dropdown-item[href*="schedule"]');
        scheduleLinks.forEach(link => {
            if (link.classList.contains('blocked-nav-item')) {
                link.classList.remove('blocked-nav-item');
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                link.removeAttribute('title');
                
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
        
        // Remove blocking from calendar links
        const calendarLinks = document.querySelectorAll('.dropdown-item[href*="calendar"]');
        calendarLinks.forEach(link => {
            if (link.classList.contains('blocked-nav-item')) {
                link.classList.remove('blocked-nav-item');
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                link.removeAttribute('title');
                
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
    }
    
    // Show/hide specific content sections
    filterPageContent(userRole);
}

function filterPageContent(userRole) {
    const accessibleContent = getAccessibleContent(userRole);
    
    // Hide content sections that user doesn't have access to
    const sections = document.querySelectorAll('[id$="-section"]');
    sections.forEach(section => {
        const sectionId = section.id.replace('-section', '');
        if (!accessibleContent.includes(sectionId)) {
            section.style.display = 'none';
        } else {
             // Ensure the section is visible if it is accessible
            section.style.display = 'block'; 
        }
    });
    
    // Special handling for different pages
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'forms.html' && !hasAccess('student')) {
        // Redirect guests away from forms page
        window.showNotification('You need to login as a student to access forms.', 'error');
        setTimeout(() => {
            window.location.href = './index.php/login';
        }, 2000);
    }
    
    // Allow students to access organization page, only block guests
    if (currentPage === 'organization.html' && !hasAccess('student')) {
        // Redirect GUESTS away from organization page (but allow students)
        window.showNotification('You need to login as a student to view organizations.', 'error');
        setTimeout(() => {
            window.location.href = './index.php/login';
        }, 2000);
    }
    
    // Block curriculum page for guests
    if (currentPage === 'academics.html' && window.location.hash.includes('curriculum') && !hasAccess('student')) {
        // Redirect to programs section if user attempts to access curriculum directly
        if (document.getElementById('programs-section')) {
            window.showNotification('You need to login as a student to view curriculum.', 'error');
            setTimeout(() => {
                 // Change hash back to programs or home
                window.location.hash = 'programs-section';
            }, 1000);
        } else {
             window.showNotification('You need to login as a student to view curriculum.', 'error');
             setTimeout(() => {
                 window.location.href = './index.php/login';
            }, 2000);
        }
    }
}

// NAVIGATION ACTIVE STATE MANAGEMENT
function updateNavigationActiveState() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all nav items
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');
    const navItems = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => link.classList.remove('active'));
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    // Set active state based on current page
    switch(currentPage) {
        case 'index.html':
        case '':
            const homeLink = document.querySelector('.nav-link[href="index.html"]');
            if (homeLink) homeLink.classList.add('active');
            break;
        case 'about.html':
            const aboutDropdown = document.getElementById('aboutDropdown');
            if (aboutDropdown) {
                aboutDropdown.classList.add('active');
                aboutDropdown.closest('.nav-item').classList.add('active');
            }
            break;
        case 'faculty.html':
            const facultyLink = document.querySelector('.nav-link[href="faculty.html"]');
            if (facultyLink) {
                facultyLink.classList.add('active');
                facultyLink.closest('.nav-item').classList.add('active');
            }
            break;
        case 'academics.html':
            const academicsDropdown = document.getElementById('academicsDropdown');
            if (academicsDropdown) {
                academicsDropdown.classList.add('active');
                academicsDropdown.closest('.nav-item').classList.add('active');
            }
            break;
        case 'updates.html':
            const updatesDropdown = document.getElementById('updatesDropdown');
            if (updatesDropdown) {
                updatesDropdown.classList.add('active');
                updatesDropdown.closest('.nav-item').classList.add('active');
            }
            break;
        case 'forms.html':
            const formsLink = document.querySelector('.nav-link[href="forms.html"]');
            if (formsLink) {
                formsLink.classList.add('active');
                formsLink.closest('.nav-item').classList.add('active');
            }
            break;
        case 'organization.html':
            const orgDropdown = document.getElementById('organizationDropdown');
            if (orgDropdown) {
                orgDropdown.classList.add('active');
                orgDropdown.closest('.nav-item').classList.add('active');
            }
            break;
        case 'login.html':
            // No active state for login page
            break;
    }
}

// EXPORT FUNCTIONS FOR GLOBAL USE
window.checkUserSession = checkUserSession;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserRole = getCurrentUserRole;
window.hasAccess = hasAccess;
window.filterContentByRole = filterContentByRole;


