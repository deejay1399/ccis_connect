// LIST USERS PAGE JAVASCRIPT - UPDATED WITH MANAGE_FORMS STYLING

$(document).ready(function() {
    console.log('🔐 List Users Page Loading...');
    
    // Enhanced session check for Super Admin
    function checkSuperAdminSession() {
        const session = window.checkUserSession(); // Use global checkUserSession
        
        console.log('Session check result:', session);
        
        if (!session.isValid) {
            console.warn('❌ No valid session found, redirecting to login');
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 2000);
            return false;
        }
        
        if (session.user.role !== 'superadmin') {
            console.warn('🚫 Unauthorized access attempt by:', session.user.role);
            showNotification('Access denied. Super Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return false;
        }
        
        // Session is valid and user is superadmin
        console.log('✅ Super Admin session confirmed:', session.user.name);
        
        // Update UI with admin info
        updateAdminUI(session.user);
        
        return true;
    }
    
    function updateAdminUI(user) {
        // Update user name and role
        $('#user-name').text(user.name);
        $('#user-role').text(user.role);
        
        console.log('👤 UI updated for:', user.name);
    }
    
    // Function to remove Return to Dashboard links
    function removeReturnToDashboard() {
        console.log('🔍 Searching for Return to Dashboard links...');
        
        // Method 1: Remove by exact text content
        $('a').each(function() {
            const text = $(this).text().trim();
            if (text === 'Return to Dashboard') {
                console.log('🚫 Removing Return to Dashboard link:', text);
                $(this).remove();
            }
        });
        
        // Method 2: Remove by partial text match
        $('a:contains("Return to Dashboard")').each(function() {
            console.log('🚫 Removing Return to Dashboard element');
            $(this).remove();
        });
        
        // Method 3: Remove any quick-links or footer-links containers
        $('.quick-links, .footer-links').each(function() {
            console.log('🚫 Removing quick-links/footer-links container');
            $(this).remove();
        });
        
        // Method 4: Remove any elements containing the text
        $('*:contains("Return to Dashboard")').each(function() {
            if ($(this).children().length === 0) {
                const text = $(this).text().trim();
                if (text.includes('Return to Dashboard')) {
                    console.log('🚫 Removing element with text:', text);
                    $(this).remove();
                }
            }
        });
    }
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Load users data
        loadUsers();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        
        console.log('🎯 List Users Page initialized successfully');
    }
    
    // Function to handle the "View Public Site" link
    function setupPublicSiteLink() {
        const publicSiteLink = $('#view-public-site-link');
        if (publicSiteLink.length) {
            // Determine the relative path to the admin dashboard for the return button
            const dashboardUrl = 'super_admin/index.html';
                                 
            publicSiteLink.on('click', function(e) {
                // Store the current dashboard URL in local storage
                localStorage.setItem('admin_return_url', dashboardUrl);
                sessionStorage.setItem('admin_return_url', dashboardUrl); // Use both for redundancy
                console.log(`🔗 Storing return URL: ${dashboardUrl}`);
                // Continue with navigation
            });
        }
    }
    
    // Date Display Function - Same as manage_forms
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

    // Sample data structure for organization admins
    let organizationAdmins = JSON.parse(localStorage.getItem('organizationAdmins')) || [];

    // Enhanced confirmation system
    let pendingAction = null;

    // Show confirmation modal
    function showConfirmation(message, details, actionType, callback) {
        $('#confirmation-message').text(message);
        $('#confirmation-details').text(details || '');
        
        // Style based on action type
        const confirmBtn = $('#confirm-action-btn');
        confirmBtn.removeClass('btn-primary btn-danger btn-success');
        
        if (actionType === 'delete' || actionType === 'deactivate') {
            confirmBtn.addClass('btn-danger');
            confirmBtn.html('<i class="fas fa-check me-2"></i>Confirm');
        } else if (actionType === 'activate') {
            confirmBtn.addClass('btn-primary');
            confirmBtn.html('<i class="fas fa-check me-2"></i>Confirm');
        } else {
            confirmBtn.addClass('btn-primary');
            confirmBtn.html('<i class="fas fa-check me-2"></i>Confirm');
        }
        
        // Set up the callback
        pendingAction = callback;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }

    // Handle confirmation button click
    $('#confirm-action-btn').on('click', function() {
        if (pendingAction) {
            pendingAction();
            pendingAction = null;
        }
        $('#confirmationModal').modal('hide');
    });

    // Floating notification functions
    function showFloatingNotification(title, message, type = 'success') {
        $('#notification-title').text(title);
        $('#notification-message').text(message);
        
        // Change color based on type
        const notification = $('#success-notification');
        if (type === 'success') {
            notification.css('border-left-color', '#28a745');
            $('.notification-icon').html('<i class="fas fa-check-circle"></i>').css('color', '#28a745');
        } else if (type === 'error') {
            notification.css('border-left-color', '#dc3545');
            $('.notification-icon').html('<i class="fas fa-exclamation-circle"></i>').css('color', '#dc3545');
        } else if (type === 'warning') {
            notification.css('border-left-color', '#ffc107');
            $('.notification-icon').html('<i class="fas fa-exclamation-triangle"></i>').css('color', '#ffc107');
        }
        
        notification.addClass('show');
        
        // Auto hide after 5 seconds
        setTimeout(function() {
            hideFloatingNotification();
        }, 5000);
    }

    function hideFloatingNotification() {
        $('#success-notification').removeClass('show');
    }

    // Close notification when X is clicked
    $('#close-notification').on('click', function() {
        hideFloatingNotification();
    });

    // Close notification when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).closest('.floating-notification').length === 0 && 
            $('#success-notification').hasClass('show')) {
            hideFloatingNotification();
        }
    });

    // Load users and display
    function loadUsers() {
        displayUsers(organizationAdmins);
        updateStatistics();
    }

    // Display users in table
    function displayUsers(users) {
        const tbody = $('#users-table-body');
        tbody.empty();

        if (users.length === 0) {
            $('#empty-state').show();
            $('#users-table').hide();
            return;
        }

        $('#empty-state').hide();
        $('#users-table').show();

        users.forEach(user => {
            const statusClass = `status-${user.status}`;
            const statusText = user.status === 'active' ? 'Active' : 
                              user.status === 'pending' ? 'Pending' : 'Inactive';

            const createdDate = new Date(user.createdDate).toLocaleDateString();

            const row = `
                <tr data-user-id="${user.id}">
                    <td>
                        <strong>${user.name}</strong>
                        ${user.status === 'pending' ? '<br><small class="text-warning"><i class="fas fa-user-clock me-1"></i>Awaiting Initial Setup</small>' : ''}
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge bg-secondary">${user.organization === 'csguild' ? 'CSGuild' : 'The Legion'}</span>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td>${createdDate}</td>
                    <td class="text-end">
                        <div class="action-buttons">
                            <button class="btn btn-edit btn-sm" onclick="editUser('${user.id}')" title="Edit User">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-password btn-sm" onclick="setPassword('${user.id}')" title="Set Password">
                                <i class="fas fa-key"></i>
                            </button>
                            ${user.status === 'active' ? `
                                <button class="btn btn-deactivate btn-sm" onclick="toggleUserStatus('${user.id}', 'inactive')" title="Deactivate User">
                                    <i class="fas fa-user-slash"></i>
                                </button>
                            ` : `
                                <button class="btn btn-activate btn-sm" onclick="toggleUserStatus('${user.id}', 'active')" title="Activate User">
                                    <i class="fas fa-user-check"></i>
                                </button>
                            `}
                            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')" title="Delete User">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Update statistics
    function updateStatistics() {
        const total = organizationAdmins.length;
        const active = organizationAdmins.filter(u => u.status === 'active').length;
        const pending = organizationAdmins.filter(u => u.status === 'pending').length;
        const inactive = organizationAdmins.filter(u => u.status === 'inactive').length;

        $('#total-users').text(total);
        $('#active-users').text(active);
        $('#pending-users').text(pending);
        $('#inactive-users').text(inactive);
    }

    // Edit user function - REMOVED STATUS FIELD
    window.editUser = function(userId) {
        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        $('#edit-user-id').val(user.id);
        $('#edit-fullName').val(user.name);
        $('#edit-userEmail').val(user.email);
        $('#edit-orgName').val(user.organization);
        // Status field removed from edit modal as requested

        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    }

    // Set password function - AUTO-ADJUSTS BASED ON USER STATUS
    window.setPassword = function(userId) {
        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        $('#password-user-id').val(user.id);
        $('#password-user-name').text(user.name);
        $('#new-password').val('');
        $('#confirm-password').val('');

        // AUTO-ADJUST MODAL BASED ON USER STATUS
        const modalTitle = document.getElementById('setPasswordModalLabel');
        const saveButton = document.getElementById('save-password');
        const alertMessage = document.querySelector('#setPasswordModal .alert-info');
        
        if (user.status === 'pending') {
            // NEW USER - FIRST TIME SETUP
            modalTitle.innerHTML = '<i class="fas fa-key me-2"></i>Set Initial Password for <span id="password-user-name"></span>';
            saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Set Password';
            alertMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i><strong>Initial Setup:</strong> User will be able to login with this temporary password and will be prompted to set their own password.';
        } else {
            // EXISTING USER - PASSWORD RESET
            modalTitle.innerHTML = '<i class="fas fa-redo-alt me-2"></i>Reset Password for <span id="password-user-name"></span>';
            saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Reset Password';
            alertMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i><strong>Password Reset:</strong> User will be forced to set a new password upon next login.';
        }
        
        // Update the name in the title
        document.getElementById('password-user-name').textContent = user.name;

        const modal = new bootstrap.Modal(document.getElementById('setPasswordModal'));
        modal.show();
    }

    // Save password - HANDLES BOTH INITIAL SETUP AND PASSWORD RESET
    $('#save-password').on('click', function() {
        const userId = $('#password-user-id').val();
        const newPassword = $('#new-password').val();
        const confirmPassword = $('#confirm-password').val();

        if (!newPassword || !confirmPassword) {
            showFloatingNotification('Error', 'Please fill in both password fields.', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showFloatingNotification('Error', 'Password must be at least 8 characters long.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showFloatingNotification('Error', 'Passwords do not match.', 'error');
            return;
        }

        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        // PASSWORD SET/RESET LOGIC
        if (user.status === 'pending') {
            // FIRST-TIME PASSWORD SETUP FOR NEW USER
            localStorage.setItem(`legion_${user.email}_password`, newPassword);
            user.status = 'active';
            user.lastLogin = null;
            
            saveUsers();
            loadUsers();
            $('#setPasswordModal').modal('hide');
            showFloatingNotification('Password Set', 
                `Initial password has been set for "${user.name}". They can now login and will be prompted to set their own password.`,
                'success');
        } else {
            // PASSWORD RESET FOR EXISTING USER
            localStorage.removeItem(`legion_${user.email}_password_changed`);
            localStorage.setItem(`legion_${user.email}_password`, newPassword);
            user.forcePasswordChange = true;
            user.lastLogin = null;
            user.passwordResetDate = new Date().toISOString();

            saveUsers();
            loadUsers();
            $('#setPasswordModal').modal('hide');
            showFloatingNotification('Password Reset', 
                `Password has been reset for "${user.name}". They will be forced to set a new password upon next login.`,
                'warning');
        }
    });

    // Enhanced toggle user status with confirmation modal
    window.toggleUserStatus = function(userId, newStatus) {
        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        const action = newStatus === 'active' ? 'activate' : 'deactivate';
        const actionText = newStatus === 'active' ? 'activate' : 'deactivate';
        const message = `Are you sure you want to ${actionText} "${user.name}"?`;
        const details = newStatus === 'active' 
            ? 'This user will be able to access the system.' 
            : 'This user will no longer be able to access the system until reactivated.';

        showConfirmation(message, details, action, function() {
            user.status = newStatus;
            if (newStatus === 'active') {
                user.lastLogin = null;
            }
            saveUsers();
            loadUsers();
            
            const notificationMessage = newStatus === 'active' 
                ? `"${user.name}" has been activated successfully.` 
                : `"${user.name}" has been deactivated successfully.`;
                
            showFloatingNotification('Status Updated', notificationMessage);
        });
    }

    // Enhanced delete user with confirmation modal
    window.deleteUser = function(userId) {
        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        const message = `Are you sure you want to delete "${user.name}"?`;
        const details = 'This action cannot be undone. All user data will be permanently removed.';

        showConfirmation(message, details, 'delete', function() {
            organizationAdmins = organizationAdmins.filter(u => u.id !== userId);
            
            // Also remove their password data
            localStorage.removeItem(`legion_${user.email}_password_changed`);
            localStorage.removeItem(`legion_${user.email}_password`);
            
            saveUsers();
            loadUsers();
            showFloatingNotification('User Deleted', `"${user.name}" has been deleted successfully.`);
        });
    }

    // Save user changes
    $('#save-user-changes').on('click', function() {
        const userId = $('#edit-user-id').val();
        const user = organizationAdmins.find(u => u.id === userId);
        if (!user) return;

        user.name = $('#edit-fullName').val();
        user.email = $('#edit-userEmail').val();
        user.organization = $('#edit-orgName').val();
        // Status is not edited anymore as requested

        saveUsers();
        loadUsers();

        $('#editUserModal').modal('hide');
        showFloatingNotification('User Updated', `"${user.name}"'s information has been updated successfully.`);
    });

    // Save users to localStorage
    function saveUsers() {
        localStorage.setItem('organizationAdmins', JSON.stringify(organizationAdmins));
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