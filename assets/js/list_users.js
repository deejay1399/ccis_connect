// LIST USERS PAGE JAVASCRIPT - UPDATED WITH MANAGE_FORMS STYLING

$(document).ready(function() {
    console.log('ðŸ” List Users Page Loading...');
    
    // Enhanced session check for Super Admin
    function checkSuperAdminSession() {
        const session = window.checkUserSession(); // Use global checkUserSession
        
        console.log('Session check result:', session);
        
        if (!session.isValid) {
            console.warn('âŒ No valid session found, redirecting to login');
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 2000);
            return false;
        }
        
        if (!['superadmin', 'faculty'].includes(session.user.role)) {
            console.warn('ðŸš« Unauthorized access attempt by:', session.user.role);
            showNotification('Access denied. Super Admin or Faculty privileges required.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return false;
        }
        
        // Session is valid and user is superadmin
        console.log('âœ… Super Admin session confirmed:', session.user.name);
        
        // Update UI with admin info
        updateAdminUI(session.user);
        
        return true;
    }
    
    function updateAdminUI(user) {
        // Update user name and role
        $('#user-name').text(user.name);
        $('#user-role').text(user.role);
        
        console.log('ðŸ‘¤ UI updated for:', user.name);
    }
    
    // Function to remove Return to Dashboard links
    function removeReturnToDashboard() {
        console.log('ðŸ” Searching for Return to Dashboard links...');
        
        // Method 1: Remove by exact text content
        $('a').each(function() {
            const text = $(this).text().trim();
            if (text === 'Return to Dashboard') {
                console.log('ðŸš« Removing Return to Dashboard link:', text);
                $(this).remove();
            }
        });
        
        // Method 2: Remove by partial text match
        $('a:contains("Return to Dashboard")').each(function() {
            console.log('ðŸš« Removing Return to Dashboard element');
            $(this).remove();
        });
        
        // Method 3: Remove any quick-links or footer-links containers
        $('.quick-links, .footer-links').each(function() {
            console.log('ðŸš« Removing quick-links/footer-links container');
            $(this).remove();
        });
        
        // Method 4: Remove any elements containing the text
        $('*:contains("Return to Dashboard")').each(function() {
            if ($(this).children().length === 0) {
                const text = $(this).text().trim();
                if (text.includes('Return to Dashboard')) {
                    console.log('ðŸš« Removing element with text:', text);
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
        
        // Initialize baseUrl if not already set
        if (!window.baseUrl) {
            window.baseUrl = window.location.origin + '/ccis_connect/';
            console.log('ðŸ“ Initialized baseUrl:', window.baseUrl);
        }
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Setup navigation
        setupNavigation();
        
        // Load users data
        loadUsers();
        
        // Setup search functionality
        setupSearch();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        
        console.log('ðŸŽ¯ List Users Page initialized successfully');
    }

    // Setup navigation handlers
    function setupNavigation() {
        console.log('ðŸ“ Setting up navigation handlers...');
        
        // Get base URL
        const baseUrl = window.baseUrl || (window.location.origin + '/ccis_connect');
        console.log('Base URL:', baseUrl);
        
        // Handle navigation clicks with event delegation
        $(document).on('click', '.navbar-nav .nav-link[data-section]', function(e) {
            e.preventDefault();
            const section = $(this).data('section');
            console.log('ðŸ”— Navigation clicked:', section);
            
            if (section === 'dashboard-home') {
                console.log('â†’ Redirecting to Dashboard Home');
                window.location.href = baseUrl + '/admin';
            } else if (section === 'content-management') {
                console.log('â†’ Redirecting to Content Management');
                window.location.href = baseUrl + '/admin#content-management';
            } else if (section === 'user-management') {
                console.log('â†’ Redirecting to User Management');
                window.location.href = baseUrl + '/admin#user-management';
            }
        });
        // Setup view public site link
        $(document).on('click', '#view-public-site-link', function(e) {
            e.preventDefault();
            console.log('ðŸŒ View Public Site clicked');
            const publicUrl = baseUrl.replace('/admin', '') || '/ccis_connect/';
            console.log('Opening:', publicUrl);
            window.open(publicUrl, '_blank');
        });
        
        console.log('âœ… Navigation handlers setup complete');
    }
    // Setup public site link
    function setupPublicSiteLink() {
        $('#view-public-site-link').on('click', function(e) {
            e.preventDefault();
            const publicUrl = window.baseUrl ? window.baseUrl.replace('admin', '') : '/ccis_connect/';
            window.open(publicUrl, '_blank');
        });
    }

    // Update current date
    function updateCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        $('#current-date, #nav-date span').text(today);
    }

    // Remove return to dashboard
    function removeReturnToDashboard() {
        $('#return-to-dashboard').remove();
    }

    // Show notification
    function showNotification(title, message, type = 'success') {
        const notification = $('#success-notification');
        $('#notification-title').text(title);
        $('#notification-message').text(message);
        
        notification.removeClass('show');
        notification.addClass('show');
        
        setTimeout(() => {
            notification.removeClass('show');
        }, 3000);
    }

    // Setup search functionality
    function setupSearch() {
        $('#user-search').on('keyup', function() {
            const searchTerm = $(this).val().toLowerCase();
            const rows = $('#users-table tbody tr');
            
            rows.each(function() {
                const text = $(this).text().toLowerCase();
                
                if (text.includes(searchTerm)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    }

    // Sample data structure for organization admins
    // Removed - data now loaded from server

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
        showSkeletonLoader();
        
        $.ajax({
            url: baseUrl + '/admin/users/get_all',
            method: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(response) {
                hideSkeletonLoader();
                if (response.success) {
                    displayUsers(response.data);
                    updateRoleStatistics(response.data);
                } else {
                    showFloatingNotification('Error', 'Failed to load users', 'error');
                    displayUsers([]);
                }
            },
            error: function(xhr, status, error) {
                hideSkeletonLoader();
                console.error('Error loading users:', error);
                showFloatingNotification('Error', 'Failed to load users from server', 'error');
                displayUsers([]);
            }
        });
    }

    // Calculate role-based statistics
    function updateRoleStatistics(users) {
        // Group users by role
        const stats = {
            admin: { active: 0, total: 0 },
            faculty: { active: 0, total: 0 },
            student: { active: 0, total: 0 },
            org: { active: 0, total: 0 }
        };

        users.forEach(user => {
            if (user.roles && user.roles.length > 0) {
                user.roles.forEach(role => {
                    let roleKey = role.toLowerCase();
                    if (roleKey.includes('admin') && roleKey.includes('system')) {
                        roleKey = 'admin';
                    } else if (roleKey.includes('admin') && roleKey.includes('org')) {
                        roleKey = 'org';
                    } else if (roleKey.includes('faculty')) {
                        roleKey = 'faculty';
                    } else if (roleKey.includes('student')) {
                        roleKey = 'student';
                    }

                    if (stats[roleKey]) {
                        stats[roleKey].total++;
                        if (user.is_active === 1 || user.is_active === true) {
                            stats[roleKey].active++;
                        }
                    }
                });
            }
        });

        // Update UI
        updateRoleCard('admin', stats.admin);
        updateRoleCard('faculty', stats.faculty);
        updateRoleCard('student', stats.student);
        updateRoleCard('org', stats.org);
    }

    // Update individual role card
    function updateRoleCard(role, data) {
        const selector = `#${role}-count`;
        const barSelector = `#${role}-bar`;
        
        $(selector).text(`${data.active}/${data.total}`);
        
        const percentage = data.total > 0 ? (data.active / data.total) * 100 : 0;
        $(barSelector).css('width', percentage + '%');
        
        // Animate the numbers
        animateNumber(selector, data.active, data.total);
    }

    // Animate number changes
    function animateNumber(selector, active, total) {
        const element = $(selector);
        element.fadeOut(100).fadeIn(100);
    }

    // Show skeleton loading state
    function showSkeletonLoader() {
        $('#empty-state').addClass('show').html(`
            <div style="text-align: center; padding: 4rem 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 1.5s infinite;">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p style="color: #7f8c8d;">Loading users...</p>
            </div>
        `);
        $('#users-table').hide();
    }

    // Hide skeleton loader
    function hideSkeletonLoader() {
        $('#empty-state').removeClass('show').empty();
    }

    // Display users in table
    function displayUsers(users) {
        const tbody = $('#users-table-body');
        
        hideSkeletonLoader();

        if (users.length === 0) {
            $('#empty-state').addClass('show').html(`
                <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                <h3>No Users Found</h3>
                <p>There are no users in the system yet.</p>
            `);
            $('#users-table').hide();
            return;
        }

        $('#empty-state').removeClass('show').empty();
        $('#users-table').show();

        tbody.empty();

        users.forEach((user, index) => {
            const roleDisplay = user.roles && user.roles.length > 0 ? user.roles[0] : 'No role';
            const roleClass = roleDisplay.toLowerCase().includes('admin') && roleDisplay.toLowerCase().includes('system') ? 'admin' :
                            roleDisplay.toLowerCase().includes('faculty') ? 'faculty' :
                            roleDisplay.toLowerCase().includes('student') ? 'student' :
                            roleDisplay.toLowerCase().includes('org') ? 'org' : 'admin';
            
            const statusClass = user.is_active ? 'active' : 'inactive';
            const statusText = user.is_active ? 'Active' : 'Inactive';
            const createdDate = new Date(user.created_at).toLocaleDateString();

            const row = `
                <tr style="animation: fadeIn 0.3s ease-out ${index * 30}ms;" data-user-id="${user.id}">
                    <td>
                        <strong>${user.name}</strong>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="role-badge ${roleClass}">${roleDisplay}</span>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            <i class="fas fa-${user.is_active ? 'circle' : 'circle'}" style="font-size: 0.5rem;"></i>
                            ${statusText}
                        </span>
                    </td>
                    <td>${createdDate}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-view" onclick="viewUser('${user.id}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action btn-edit" onclick="editUser('${user.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Setup base URL
    const baseUrl = window.location.origin + '/ccis_connect';

    // View user details
    window.viewUser = function(userId) {
        showFloatingNotification('Loading', 'Fetching user details...', 'info');
        
        $.ajax({
            url: baseUrl + '/admin/users/get_details/' + userId,
            method: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(response) {
                if (response.success) {
                    const user = response.data;
                    const message = `
                        <div style="text-align: left;">
                            <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Role:</strong> ${user.roles && user.roles.length > 0 ? user.roles[0] : 'No role'}</p>
                            <p><strong>Status:</strong> <span class="badge ${user.is_active ? 'bg-success' : 'bg-danger'}">${user.is_active ? 'Active' : 'Inactive'}</span></p>
                            <p><strong>Joined:</strong> ${new Date(user.created_at).toLocaleString()}</p>
                        </div>
                    `;
                    
                    showDetailModal('User Information', message);
                } else {
                    showFloatingNotification('Error', 'Failed to load user details', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading user:', error);
                showFloatingNotification('Error', 'Failed to load user details', 'error');
            }
        });
    }

    // Show detail modal with better styling
    function showDetailModal(title, content) {
        const modalHTML = `
            <div class="modal fade" id="detailModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem;">
                            <h5 class="modal-title" style="color: white; font-weight: 800; font-size: 1.3rem; margin: 0;">${title}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
        
        $('#detailModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }

    // Edit user function
    window.editUser = function(userId) {
        showFloatingNotification('Loading', 'Fetching user details...', 'info');
        
        $.ajax({
            url: baseUrl + '/admin/users/get_details/' + userId,
            method: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(response) {
                if (response.success) {
                    const user = response.data;
                    $('#edit-user-id').val(user.id);
                    $('#edit-fullName').val(user.first_name + ' ' + user.last_name);
                    $('#edit-userEmail').val(user.email);

                    // Hide all detail sections by default
                    $('#student-details-section').hide();
                    $('#faculty-details-section').hide();

                    // Show and populate student details if available
                    if (user.student_number) {
                        $('#student-details-section').show();
                        $('#edit-studentNumber').val(user.student_number || '');
                        $('#edit-course').val(user.course || '');
                        $('#edit-yearLevel').val(user.year_level || '');
                        $('#edit-section').val(user.section || '');
                    }

                    // Show and populate faculty details if available
                    if (user.position) {
                        $('#faculty-details-section').show();
                        $('#edit-position').val(user.position || '');
                        $('#edit-department').val(user.department || '');
                        $('#edit-officeLocation').val(user.office_location || '');
                        $('#edit-bio').val(user.bio || '');
                    }

                    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
                    modal.show();
                } else {
                    showFloatingNotification('Error', 'Failed to load user details', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading user:', error);
                showFloatingNotification('Error', 'Failed to load user details', 'error');
            }
        });
    }

    // Set password function - AUTO-ADJUSTS BASED ON USER STATUS
    window.setPassword = function(userId) {
        // Feature not implemented in this version
        showFloatingNotification('Info', 'Password management will be implemented in admin panel', 'info');
    }

    // Enhanced delete user with confirmation modal
    window.deleteUser = function(userId) {
        const message = 'Are you sure you want to delete this user?';
        const details = 'This action cannot be undone. All user data will be permanently removed from the system.';

        showConfirmation(message, details, 'delete', function() {
            const confirmBtn = $('#confirm-action-btn');
            const originalHtml = confirmBtn.html();
            confirmBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Deleting...');

            $.ajax({
                url: baseUrl + '/admin/users/remove',
                method: 'POST',
                dataType: 'json',
                data: {
                    user_id: userId
                },
                timeout: 10000,
                success: function(response) {
                    confirmBtn.prop('disabled', false).html(originalHtml);
                    $('#confirmationModal').modal('hide');
                    if (response.success) {
                        showFloatingNotification('Success', 'User deleted successfully', 'success');
                        setTimeout(() => loadUsers(), 500);
                    } else {
                        showFloatingNotification('Error', response.message || 'Failed to delete user', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    confirmBtn.prop('disabled', false).html(originalHtml);
                    $('#confirmationModal').modal('hide');
                    console.error('Error deleting user:', error);
                    showFloatingNotification('Error', 'Failed to delete user: ' + error, 'error');
                }
            });
        });
    }

    // Save user changes
    $('#save-user-changes').on('click', function() {
        const userId = $('#edit-user-id').val();
        const fullName = $('#edit-fullName').val();
        const email = $('#edit-userEmail').val();

        if (!fullName || !email) {
            showFloatingNotification('Validation Error', 'Please fill in all required fields', 'error');
            return;
        }

        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Show loading state
        const btn = $(this);
        const originalHtml = btn.html();
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...');

        $.ajax({
            url: baseUrl + '/admin/users/update',
            method: 'POST',
            dataType: 'json',
            data: {
                user_id: userId,
                first_name: firstName,
                last_name: lastName,
                email: email
            },
            timeout: 10000,
            success: function(response) {
                btn.prop('disabled', false).html(originalHtml);
                if (response.success) {
                    $('#editUserModal').modal('hide');
                    showFloatingNotification('Success', 'User information updated successfully', 'success');
                    setTimeout(() => loadUsers(), 500);
                } else {
                    showFloatingNotification('Error', response.message || 'Failed to update user', 'error');
                }
            },
            error: function(xhr, status, error) {
                btn.prop('disabled', false).html(originalHtml);
                console.error('Error updating user:', error);
                showFloatingNotification('Error', 'Failed to update user: ' + error, 'error');
            }
        });
    });

    // Save users to localStorage
    // Removed - data now managed by server

    // Initialize the page
    initializePage();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});

