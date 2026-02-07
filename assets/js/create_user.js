// SUPER ADMIN CREATE USER JAVASCRIPT - UPDATED VERSION

$(document).ready(function() {
    console.log('?? Create User Page Loading...');

    function getBaseUrl() {
        if (typeof window.BASE_URL === 'string' && window.BASE_URL.length > 0) {
            return window.BASE_URL;
        }
        if (typeof window.baseUrl === 'string' && window.baseUrl.length > 0) {
            return window.baseUrl;
        }
        return '/ccis_connect/';
    }

    function buildUrl(path) {
        const base = getBaseUrl().replace(/\/+$/, '');
        const cleanPath = String(path || '').replace(/^\/+/, '');
        return `${base}/${cleanPath}`;
    }
    
    // Enhanced session check for Super Admin
    function checkSuperAdminSession() {
        const session = window.checkUserSession(); // Use global checkUserSession
        
        console.log('Session check result:', session);
        
        if (!session.isValid) {
            console.warn('? No valid session found, redirecting to login');
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = buildUrl('index.php/login');
            }, 2000);
            return false;
        }
        
        if (session.user.role !== 'superadmin') {
            console.warn('?? Unauthorized access attempt by:', session.user.role);
            showNotification('Access denied. Super Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = buildUrl('index.php/login');
            }, 2000);
            return false;
        }
        
        // Session is valid and user is superadmin
        console.log('? Super Admin session confirmed:', session.user.name);
        
        // Update UI with admin info
        updateAdminUI(session.user);
        
        return true;
    }
    
    function updateAdminUI(user) {
        // Update user name and role
        $('#user-name').text(user.name);
        $('#user-role').text(user.role);
        
        console.log('?? UI updated for:', user.name);
    }
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        // Setup logout handler
        setupLogoutHandler();
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        
        // SETUP CONDITIONAL FIELDS HANDLER
        setupConditionalFields();
        
        console.log('?? Create User Page initialized successfully');
    }
    
    // Function to setup logout handler
    function setupLogoutHandler() {
        $('#logout-icon-link').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('?? Logout requested - Super Admin');
            showLogoutModal();
        });
    }

    // FUNCTION TO SETUP CONDITIONAL FIELDS DISPLAY
    function setupConditionalFields() {
        console.log('?? Setting up conditional fields handler...');
        
        $('.user-type-radio').on('change', function() {
            const selectedRole = $(this).val();
            
            console.log(`?? User type changed to: ${selectedRole}`);
            
            // Hide all conditional field sections
            $('#studentFields').slideUp(300);
            $('#facultyFields').slideUp(300);
            $('#orgAdminFields').slideUp(300);
            
            // Clear validation for hidden fields
            $('#studentFields input, #studentFields select, #facultyFields input, #facultyFields textarea, #orgAdminFields select, #organizationCustom, #studentOrganizationCustom').removeAttr('required');
            $('#organizationCustomWrapper').hide();
            $('#studentOrganizationCustomWrapper').hide();
            
            // Show appropriate section based on selection
            if (selectedRole === '3') {
                // Student
                $('#studentFields').slideDown(300);
                $('#studentNumber, #course, #yearLevel, #section, #studentOrganization').attr('required', 'required');
                console.log('?? Student fields displayed');
            } else if (selectedRole === '2') {
                // Faculty
                $('#facultyFields').slideDown(300);
                $('#position, #department, #bio, #officeLocation').attr('required', 'required');
                console.log('????? Faculty fields displayed');
            } else if (selectedRole === '4') {
                // Organization Admin
                $('#orgAdminFields').slideDown(300);
                $('#organization').attr('required', 'required');
                console.log('?? Organization Admin fields displayed');
            } else if (selectedRole === '1') {
                // Super Admin
                console.log('?? Super Admin selected (no additional fields needed)');
            }
        });

        $('#organization').on('change', function() {
            if ($(this).val() === 'other') {
                $('#organizationCustomWrapper').slideDown(200);
                $('#organizationCustom').attr('required', 'required');
            } else {
                $('#organizationCustomWrapper').slideUp(200);
                $('#organizationCustom').removeAttr('required').val('');
            }
        });

        $('#studentOrganization').on('change', function() {
            if ($(this).val() === 'other') {
                $('#studentOrganizationCustomWrapper').slideDown(200);
                $('#studentOrganizationCustom').attr('required', 'required');
            } else {
                $('#studentOrganizationCustomWrapper').slideUp(200);
                $('#studentOrganizationCustom').removeAttr('required').val('');
            }
        });
        
        console.log('? Conditional fields handler attached');
    }
    function setupPublicSiteLink() {
        const publicSiteLink = $('#view-public-site-link');
        if (publicSiteLink.length) {
            // Determine the relative path to the admin dashboard for the return button
            const dashboardUrl = 'super_admin/index.html';
                                 
            publicSiteLink.on('click', function(e) {
                // Store the current dashboard URL in local storage
                localStorage.setItem('admin_return_url', dashboardUrl);
                sessionStorage.setItem('admin_return_url', dashboardUrl); // Use both for redundancy
                console.log(`?? Storing return URL: ${dashboardUrl}`);
                // Continue with navigation
            });
        }
    }
    
    // FUNCTION TO REMOVE RETURN TO DASHBOARD LINKS
    function removeReturnToDashboard() {
        console.log('?? Searching for Return to Dashboard links...');
        
        // Method 1: Remove by exact text content
        $('a').each(function() {
            const text = $(this).text().trim();
            if (text === 'Return to Dashboard') {
                console.log('?? Removing Return to Dashboard link:', text);
                $(this).remove();
            }
        });
        
        // Method 2: Remove by partial text match
        $('a:contains("Return to Dashboard")').each(function() {
            console.log('?? Removing Return to Dashboard element');
            $(this).remove();
        });
        
        // Method 3: Remove any quick-links or footer-links containers
        $('.quick-links, .footer-links').each(function() {
            console.log('?? Removing quick-links/footer-links container');
            $(this).remove();
        });
        
        // Method 4: Remove any elements containing the text
        $('*:contains("Return to Dashboard")').each(function() {
            if ($(this).children().length === 0) {
                const text = $(this).text().trim();
                if (text.includes('Return to Dashboard')) {
                    console.log('?? Removing element with text:', text);
                    $(this).remove();
                }
            }
        });
    }
    
    // Date Display Function
    function updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        $('#current-date').text(now.toLocaleDateString('en-US', options));
    }
    
    // Notification functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        $('.admin-notification').remove();
        
        const notificationClass = type === 'error' ? 'alert-danger' : 
                                 type === 'success' ? 'alert-success' : 
                                 type === 'warning' ? 'alert-warning' :
                                 'alert-info';
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                          type === 'success' ? 'fa-check-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' :
                          'fa-info-circle';
        
        const notification = $(`
            <div class="admin-notification alert ${notificationClass} alert-dismissible fade show" 
                 style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 5000);
    }

    // Modal notification functions
    function showNotificationModal(title, message, type = 'success') {
        // Set the modal title and message
        $('#modal-title').text(title);
        $('#modal-message').text(message);
        
        // Update icon color based on type
        const modal = $('#notification-modal');
        const backdrop = $('#notification-backdrop');
        const icon = $('#modal-icon');
        
        // Remove previous icon classes and add appropriate one
        icon.removeClass('error');
        if (type === 'error') {
            icon.addClass('error');
            icon.html('<i class="fas fa-exclamation-circle"></i>');
        } else {
            icon.html('<i class="fas fa-check-circle"></i>');
        }
        
        // Show the modal and backdrop
        backdrop.addClass('show');
        modal.addClass('show');
    }

    function hideNotificationModal() {
        $('#notification-backdrop').removeClass('show');
        $('#notification-modal').removeClass('show');
    }

    // Modal close button handlers
    $('#close-modal-btn').on('click', function() {
        hideNotificationModal();
    });

    $('#modal-close-btn').on('click', function() {
        hideNotificationModal();
    });

    // Close modal on backdrop click
    $('#notification-backdrop').on('click', function() {
        hideNotificationModal();
    });

    // Floating notification functions (deprecated but kept for compatibility)
    function showFloatingNotification(message) {
        // Now using the proper modal instead
        showNotificationModal('Success!', message, 'success');
    }

    function hideFloatingNotification() {
        hideNotificationModal();
    }

    $('#close-notification').on('click', function() {
        hideFloatingNotification();
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest('.floating-notification').length === 0 && 
            $('#success-notification').hasClass('show')) {
            hideFloatingNotification();
        }
    });

    // FORM SUBMISSION - UPDATED TO HANDLE ALL USER TYPES
    $('#create-user-form').on('submit', function(e) {
        e.preventDefault();
        
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const roleId = $('input[name="userType"]:checked').val();
        
        // Validate required fields
        if (!firstName || !lastName || !email || !roleId) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email domain
        if (!email.endsWith('@bisu.edu.ph')) {
            showNotification('Please use an official @bisu.edu.ph email address.', 'error');
            return;
        }
        
        // Prepare user data
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            role_id: roleId,
            password: 'temp_' + Math.random().toString(36).substr(2, 9) // Temporary password
        };
        
        // Add role-specific data
        if (roleId === '3') {
            // Student
            userData.student_number = $('#studentNumber').val().trim();
            userData.course = $('#course').val().trim();
            userData.year_level = $('#yearLevel').val();
            userData.section = $('#section').val().trim();
            userData.student_organization = $('#studentOrganization').val();
            userData.student_organization_custom = $('#studentOrganizationCustom').val().trim();
        } else if (roleId === '2') {
            // Faculty
            userData.position = $('#position').val().trim();
            userData.department = $('#department').val().trim();
            userData.bio = $('#bio').val().trim();
            userData.office_location = $('#officeLocation').val().trim();
        } else if (roleId === '4') {
            // Organization Admin
            userData.organization = $('#organization').val();
            userData.organization_custom = $('#organizationCustom').val().trim();
        }
        
        console.log('?? User data to submit:', userData);
        
        // Send to backend
        submitUserForm(userData);
    });

    // FUNCTION TO SUBMIT USER FORM TO BACKEND
    function submitUserForm(userData) {
        // Get the base URL - try multiple methods
        let baseUrl = window.baseUrl || 'http://localhost/ccis_connect/';
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        
        const saveUrl = baseUrl + 'admin/users/save';
        
        console.log('?? Submitting to:', saveUrl);
        
        $.ajax({
            url: saveUrl,
            type: 'POST',
            dataType: 'json',
            data: userData,
            success: function(response) {
                if (response.success) {
                    const fullName = userData.first_name + ' ' + userData.last_name;
                    const roleNames = {
                        '1': 'Super Admin',
                        '2': 'Faculty',
                        '3': 'Student',
                        '4': 'Organization Admin'
                    };
                    const roleDisplay = roleNames[userData.role_id];
                    
                    showFloatingNotification(`Account for ${fullName} (${roleDisplay}) has been created successfully!`);
                    
                    console.log(`? User created successfully:`, response);
                    
                    // Reset the form
                    $('#create-user-form')[0].reset();
                    
                    // Hide conditional fields
                    $('#studentFields, #facultyFields, #orgAdminFields').slideUp(300);
                    
                    // Reload the form after 2 seconds
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                } else {
                    showNotification(response.message || 'Error creating user', 'error');
                }
            },
            error: function(xhr) {
                console.error('? Ajax error:', xhr);
                let errorMsg = 'Error creating user. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.statusText) {
                    errorMsg = 'Server error: ' + xhr.statusText;
                }
                showNotification(errorMsg, 'error');
            }
        });
    }


    // LOGOUT MODAL FUNCTION
    function showLogoutModal() {
        const user = window.getCurrentUser ? window.getCurrentUser() : null;

        if ($('#logoutModal').length > 0) {
            return;
        }

        const modalHTML = `
        <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content" style="border-radius: 12px; border: 4px solid var(--accent); box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <div class="modal-body text-center p-5">
                        <div class="mb-4">
                            <i class="fas fa-sign-out-alt" style="font-size: 3rem; color: var(--primary-purple);"></i>
                        </div>
                        <h5 class="mb-5" style="color: var(--primary-purple); font-weight: 700; font-size: 1.5rem;">
                            Are you sure you want to logout?
                        </h5>
                        <div class="d-flex gap-3 justify-content-center">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                style="border-radius: 50px; padding: 10px 30px; font-weight: 600;">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-danger" id="confirmLogoutBtn"
                                style="border-radius: 50px; padding: 10px 30px; font-weight: 600;">
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        $('body').append(modalHTML);

        const modalElement = document.getElementById('logoutModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        $(modalElement).on('shown.bs.modal', function() {
            $('#confirmLogoutBtn').focus();
        });

        // Redirect to user_side login after logout
        $('#confirmLogoutBtn').on('click', function() {
            const btn = $(this);
            const originalText = btn.html();

            btn.html('<div class="loading-spinner"></div>Logging out...');
            btn.prop('disabled', true);

            console.log('?? Starting logout process...');
            clearUserSession();

            setTimeout(() => {
                console.log('?? Redirecting to system logout...');
                modal.hide();
                window.location.href = buildUrl('index.php/logout?logout=true');
            }, 1000);
        });

        $(modalElement).on('keydown', function(e) {
            if (e.key === 'Escape') modal.hide();
            if (e.key === 'Enter' && !$('#confirmLogoutBtn').is(':disabled')) {
                $('#confirmLogoutBtn').click();
            }
        });

        $(modalElement).on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }

    // CLEAR SESSION FUNCTION
    function clearUserSession() {
        console.log('?? Clearing user session...');
        const userData = localStorage.getItem('ccis_user');
        const user = userData ? JSON.parse(userData) : null;

        if (user) logLogoutActivity(user);

        localStorage.removeItem('ccis_user');
        localStorage.removeItem('ccis_login_time');
        localStorage.removeItem('ccis_session_id');
        localStorage.removeItem('ccis_session_expiry');
        localStorage.removeItem('admin_return_url');
        sessionStorage.removeItem('admin_return_url');

        console.log('? User session completely cleared');
    }

    // LOG LOGOUT ACTIVITY FUNCTION
    function logLogoutActivity(user) {
        const logoutLogs = JSON.parse(localStorage.getItem('ccis_logout_logs') || '[]');

        const logEntry = {
            timestamp: new Date().toISOString(),
            email: user.email || 'Unknown',
            name: user.name || 'Unknown',
            role: user.role || 'Unknown'
        };

        logoutLogs.unshift(logEntry);
        if (logoutLogs.length > 50) logoutLogs.splice(50);
        localStorage.setItem('ccis_logout_logs', JSON.stringify(logoutLogs));
        console.log('?? Logout activity logged for:', user.email || 'Unknown');
    }

    // Initialize the page
    initializePage();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});
