// ======================================== */
// PAGINATION CONFIGURATION
// ======================================== */

const PAGINATION_CONFIG = {
    itemsPerPage: 6, // Pila ka items per page
    maxPagesDisplayed: 5 // Pila ka page numbers ang ipakita
};

let currentAnnouncementsPage = 1;
let currentHappeningsPage = 1;

// ======================================== */
// MAIN INITIALIZATION
// ======================================== */

$(document).ready(function() {
    console.log('🌐 The Legion Admin System Loading...');
    
    // Check authentication
    const user = getCurrentUser();
    if (!user || user.role !== 'orgadmin' || !user.organization.includes('The Legion')) {
        showNotification('Access Denied. The Legion Admins only.', 'error');
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000);
        return;
    }
    
    // Ensure the admin return URL is set immediately for View Public Site button
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('admin_return_url', 'legion_admin/index.html');
    }
    
    initializeLegionAdmin();
});

function initializeLegionAdmin() {
    console.log('🎯 Initializing The Legion Admin...');
    
    const user = getCurrentUser();
    // Set admin name to Marc Jay Magan and role to The Legion Admin
    $('#adminNameSmall').text('Marc Jay Magan');
    $('#adminRoleSmall').text('The Legion Admin');
    
    // Load admin profile picture if exists
    const adminProfilePic = localStorage.getItem('admin_profile_pic');
    if (adminProfilePic) {
        $('#adminProfilePicSmall').attr('src', adminProfilePic).show();
        $('.admin-avatar-placeholder-small').hide();
    }
    
    // Check if password manager functions are loaded
    if (typeof initializePasswordManager === 'function') {
        initializePasswordManager();
    } else {
        console.error('Password Manager not loaded!');
    }
    
    // Determine if setup is complete
    const setupComplete = typeof hasCompletedFirstTimeSetup === 'function' ? hasCompletedFirstTimeSetup() : true;

    if (setupComplete) {
        // Show navigation and main content
        $('.admin-nav').show();
        $('.admin-main').show();
        
        initializeNavigation();
        loadDashboardData();
        loadOfficers();
        loadAdvisers();
        loadAnnouncements();
        loadHappenings();
        initializeEventHandlers();
        
    } else {
        // Hide navigation and main content until mandatory setup is done
        $('.admin-main').hide();
        $('.admin-nav').hide();
        // The password modal will be shown by initializePasswordManager()
    }
    
    console.log('✅ The Legion Admin Initialized');
}

function initializeNavigation() {
    $('.admin-nav .nav-link').on('click', function(e) {
        const href = $(this).attr('href');
        
        if (href === '../login.html' || href === '../index.html') {
            return;
        }
        
        e.preventDefault();
        
        const target = href.substring(1);
        
        // Custom Logic to show/hide the header logout icon
        const headerAuthIcon = $('.header-auth-icon');
        
        if (target === 'dashboard') {
            // Show icon only on the Dashboard
            headerAuthIcon.show();
        } else {
            // Hide icon on other sections
            headerAuthIcon.hide();
        }

        $('.admin-nav .nav-link').removeClass('active');
        $(this).addClass('active');
        
        $('.admin-section').removeClass('active-section');
        $(`#${target}`).addClass('active-section');
    });

    // Initial check on page load: Hide the icon if the initial active section is not the dashboard
    // This finds the currently active link ('.active') and checks its href.
    const initialActiveLink = $('.admin-nav .nav-link.active').attr('href');
    const initialTarget = initialActiveLink ? initialActiveLink.substring(1) : 'dashboard'; // Default to dashboard
    if (initialTarget !== 'dashboard') {
        $('.header-auth-icon').hide();
    }
}

function initializeEventHandlers() {
    console.log('🔗 Initializing event handlers...');
    
    // Quick Actions
    $('.action-btn[data-action="add-officer"]').on('click', showAddOfficerModal);
    $('.action-btn[data-action="add-adviser"]').on('click', showAddAdviserModal);
    $('.action-btn[data-action="post-announcement"]').on('click', showAddAnnouncementModal);
    $('.action-btn[data-action="upload-happening"]').on('click', showUploadHappeningModal);
    
    // Main Buttons
    $('#addOfficerBtn').on('click', showAddOfficerModal);
    $('#addAdviserBtn').on('click', showAddAdviserModal);
    $('#addAnnouncementBtn').on('click', showAddAnnouncementModal);
    $('#uploadHappeningBtn').on('click', showUploadHappeningModal);
    
    // Admin profile picture click
    $('.admin-avatar-small').on('click', function() {
        showAdminProfileModal();
    });
    
    // UPDATED: Logout from header icon - NOW MATCHES HOMEPAGE STYLE WITH CONFIRMATION MODAL
    $('#logout-icon-link').on('click', function(e) {
        e.preventDefault();
        logoutUser(); // This now uses the confirmation modal like homepage
    });
    
    console.log('✅ Event handlers initialized');
}

// ======================================== */
// LOGOUT FUNCTION - UPDATED TO MATCH HOMEPAGE STYLE
// ======================================== */

function logoutUser() {
    // Show confirmation modal exactly like homepage
    showConfirmationModal(
        'Confirm Logout',
        'Are you sure you want to logout from The Legion Admin?',
        () => {
            performLogout();
        },
        null,
        'Logout',
        'btn-danger'
    );
}

function performLogout() {
    if (typeof localStorage !== 'undefined') {
        // Clear only the current user session data
        localStorage.removeItem('ccis_user');
        localStorage.removeItem('ccis_login_time');
        localStorage.removeItem('ccis_session_expiry');
        // KEEP admin_return_url so the public site knows where to return the next time
    }
    
    // Show notification like homepage
    showNotification('Logging out...', 'success');
    
    setTimeout(() => {
        window.location.href = '../login.html';
    }, 1500);
}

// ======================================== */
// ADMIN PROFILE MANAGEMENT
// ======================================== */

function showAdminProfileModal() {
    const user = getCurrentUser();
    const currentProfilePic = localStorage.getItem('admin_profile_pic');
    
    const modalHTML = `
        <div class="modal fade" id="adminProfileModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Admin Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="profile-picture-container">
                            <div class="profile-picture-preview" id="adminProfilePicturePreview" onclick="document.getElementById('adminProfilePicture').click()">
                                ${currentProfilePic ? 
                                    `<img src="${currentProfilePic}" alt="Profile Picture">` : 
                                    `<div class="profile-picture-placeholder"><i class="fas fa-user"></i></div>`
                                }
                            </div>
                            <input type="file" class="profile-picture-upload" id="adminProfilePicture" accept="image/*" onchange="previewAdminProfilePicture(event)">
                            <label for="adminProfilePicture" class="profile-picture-label">
                                <i class="fas fa-camera me-2"></i>Change Profile Picture
                            </label>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" value="Marc Jay Magan" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Role</label>
                            <input type="text" class="form-control" value="The Legion Admin" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Organization</label>
                            <input type="text" class="form-control" value="The Legion - BSIT Student Organization" readonly>
                        </div>
                        <div class="security-section">
                            <h6>Password Settings</h6>
                            <button type="button" class="btn btn-outline-primary w-100" onclick="showChangePasswordModal(false)">
                                <i class="fas fa-lock me-2"></i>Change Password
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="saveAdminProfilePicture()">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('adminProfileModal'));
    modal.show();
}

let adminProfilePictureData = null;

function previewAdminProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            adminProfilePictureData = e.target.result;
            $('#adminProfilePicturePreview').html(`<img src="${adminProfilePictureData}" alt="Profile Preview">`);
        };
        reader.readAsDataURL(file);
    }
}

function saveAdminProfilePicture() {
    if (adminProfilePictureData) {
        localStorage.setItem('admin_profile_pic', adminProfilePictureData);
        $('#adminProfilePicSmall').attr('src', adminProfilePictureData).show();
        $('.admin-avatar-placeholder-small').hide();
        showNotification('Profile picture updated successfully!', 'success');
    }
    
    const modalElement = document.getElementById('adminProfileModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    adminProfilePictureData = null;
}

// ======================================== */
// NOTIFICATION SYSTEM
// ======================================== */

function showNotification(message, type = 'success', title = '') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    
    const notificationId = 'notification-' + Date.now();
    const notificationHTML = `
        <div class="notification ${type}" id="${notificationId}">
            <div class="notification-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <h6>${title || titles[type]}</h6>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="closeNotification('${notificationId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    $('#notificationContainer').append(notificationHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeNotification(notificationId);
    }, 5000);
}

function closeNotification(id) {
    const notification = $('#' + id);
    notification.css('transform', 'translateX(100%)');
    notification.css('opacity', '0');
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ======================================== */
// CONFIRMATION MODAL - UPDATED TO MATCH HOMEPAGE
// ======================================== */

function showConfirmationModal(title, message, confirmCallback, cancelCallback = null, confirmLabel = 'Remove', confirmBtnClass = 'btn-danger') {
    const modalHTML = `
        <div class="modal fade" id="confirmationModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                            <p>${message}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn ${confirmBtnClass}" id="confirmActionBtn">${confirmLabel}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    $('#confirmActionBtn').on('click', function() {
        modal.hide();
        confirmCallback();
    });

    if (cancelCallback) {
        $('#confirmationModal').on('hidden.bs.modal', cancelCallback);
    }

    modal.show();
}

// ======================================== */
// OFFICERS MANAGEMENT
// ======================================== */

function showAddOfficerModal() {
    console.log('➕ Opening Add Officer Modal');
    const modalHTML = `
        <div class="modal fade" id="officerModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Officer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="officerForm">
                            <div class="profile-picture-container">
                                <div class="profile-picture-preview" id="officerPicturePreview" onclick="document.getElementById('officerPicture').click()">
                                    <div class="profile-picture-placeholder">
                                        <i class="fas fa-user"></i>
                                    </div>
                                </div>
                                <input type="file" class="profile-picture-upload" id="officerPicture" accept="image/*" onchange="previewOfficerPicture(event)">
                                <label for="officerPicture" class="profile-picture-label">
                                    <i class="fas fa-camera me-2"></i>Upload Photo
                                </label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="officerName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Position</label>
                                <input type="text" class="form-control" id="officerPosition" placeholder="e.g., President, Vice President">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveOfficer()">
                            Save Officer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('officerModal'));
    modal.show();
}

let officerPictureData = null;

function previewOfficerPicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            officerPictureData = e.target.result;
            $('#officerPicturePreview').html(`<img src="${officerPictureData}" alt="Profile Preview">`);
        };
        reader.readAsDataURL(file);
    }
}

function showEditOfficerModal(officerId) {
    console.log('✏️ Opening Edit Officer Modal for ID:', officerId);
    const officers = getLegionOfficers();
    const officer = officers.find(m => m.id === officerId);
    
    if (!officer) {
        showNotification('Officer not found!', 'error');
        return;
    }
    
    officerPictureData = officer.profilePicture || null;
    
    const modalHTML = `
        <div class="modal fade" id="officerModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Officer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="officerForm">
                            <input type="hidden" id="officerId" value="${officer.id}">
                            <div class="profile-picture-container">
                                <div class="profile-picture-preview" id="officerPicturePreview" onclick="document.getElementById('officerPicture').click()">
                                    ${officer.profilePicture ? 
                                        `<img src="${officer.profilePicture}" alt="Profile Picture">` : 
                                        `<div class="profile-picture-placeholder"><i class="fas fa-user"></i></div>`
                                    }
                                </div>
                                <input type="file" class="profile-picture-upload" id="officerPicture" accept="image/*" onchange="previewOfficerPicture(event)">
                                <label for="officerPicture" class="profile-picture-label">
                                    <i class="fas fa-camera me-2"></i>Change Photo
                                </label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="officerName" value="${officer.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Position</label>
                                <input type="text" class="form-control" id="officerPosition" value="${officer.position || ''}" placeholder="e.g., President, Vice President">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveOfficer()">
                            Update Officer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('officerModal'));
    modal.show();
}

function saveOfficer() {
    const name = $('#officerName').val().trim();
    const position = $('#officerPosition').val().trim() || 'Officer';
    
    if (!name) {
        showNotification('Please fill in the officer\'s name!', 'error');
        return;
    }
    
    let officers = getLegionOfficers();
    const officerId = $('#officerId').val();
    
    if (officerId) {
        // Update existing officer
        officers = officers.map(m => {
            if (m.id === parseInt(officerId)) {
                return { 
                    ...m, 
                    name, 
                    position,
                    profilePicture: officerPictureData || m.profilePicture
                };
            }
            return m;
        });
    } else {
        // Add new officer
        const newOfficer = {
            id: Date.now(),
            name,
            position,
            profilePicture: officerPictureData,
            joinDate: new Date().toISOString().split('T')[0]
        };
        officers.push(newOfficer);
    }
    
    localStorage.setItem('legion_officers', JSON.stringify(officers));
    
    // Close modal
    const modalElement = document.getElementById('officerModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    loadOfficers();
    loadDashboardData();
    
    showNotification(
        officerId ? 'Officer updated successfully!' : 'Officer added successfully!', 
        'success'
    );
    
    // Reset picture data
    officerPictureData = null;
}

function loadOfficers() {
    const officers = getLegionOfficers();
    const container = $('#officersContainer');
    
    container.empty();
    
    if (officers.length === 0) {
        container.append(`
            <div class="empty-state">
                <i class="fas fa-users fa-3x mb-3"></i>
                <h5>No Officers Yet</h5>
                <p>Start by adding your first Legion officer.</p>
                <button class="btn btn-primary" onclick="showAddOfficerModal()">
                    Add First Officer
                </button>
            </div>
        `);
        return;
    }
    
    container.append('<div class="officers-grid"></div>');
    const grid = container.find('.officers-grid');
    
    officers.forEach(officer => {
        grid.append(createOfficerCard(officer));
    });
}

function createOfficerCard(officer) {
    const initials = officer.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const avatarHTML = officer.profilePicture ? 
        `<img src="${officer.profilePicture}" alt="${officer.name}">` :
        initials;
    
    return `
        <div class="officer-card">
            <div class="officer-header">
                <div class="officer-avatar">${avatarHTML}</div>
                <div class="officer-info">
                    <h5>${officer.name}</h5>
                    <div class="officer-details">
                        <div><strong>Position:</strong> ${officer.position}</div>
                    </div>
                </div>
            </div>
            <div class="officer-actions mt-3">
                <button class="btn btn-sm edit-officer-btn me-2" onclick="editOfficer(${officer.id})">
                    Edit
                </button>
                <button class="btn btn-sm delete-officer-btn" onclick="removeOfficer(${officer.id})">
                    Remove
                </button>
            </div>
        </div>
    `;
}

function editOfficer(officerId) {
    console.log('✏️ Editing officer:', officerId);
    showEditOfficerModal(officerId);
}

function removeOfficer(officerId) {
    const officer = getLegionOfficers().find(m => m.id === officerId);
    if (!officer) return;
    
    showConfirmationModal(
        'Confirm Removal',
        `Are you sure you want to remove ${officer.name} from The Legion officers? This action cannot be undone.`,
        () => {
            let officers = getLegionOfficers();
            officers = officers.filter(m => m.id !== officerId);
            localStorage.setItem('legion_officers', JSON.stringify(officers));
            loadOfficers();
            loadDashboardData();
            showNotification('Officer removed successfully!', 'success');
        }
    );
}

// ======================================== */
// ADVISERS MANAGEMENT
// ======================================== */

function showAddAdviserModal() {
    console.log('👔 Opening Add Adviser Modal');
    const modalHTML = `
        <div class="modal fade" id="adviserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Adviser</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="adviserForm">
                            <div class="profile-picture-container">
                                <div class="profile-picture-preview" id="adviserPicturePreview" onclick="document.getElementById('adviserPicture').click()">
                                    <div class="profile-picture-placeholder">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                </div>
                                <input type="file" class="profile-picture-upload" id="adviserPicture" accept="image/*" onchange="previewAdviserPicture(event)">
                                <label for="adviserPicture" class="profile-picture-label">
                                    <i class="fas fa-camera me-2"></i>Upload Photo
                                </label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="adviserName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-control" id="adviserEmail" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Position *</label>
                                <input type="text" class="form-control" id="adviserPosition" placeholder="e.g., Faculty Adviser" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAdviser()">
                            Save Adviser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('adviserModal'));
    modal.show();
}

let adviserPictureData = null;

function previewAdviserPicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            adviserPictureData = e.target.result;
            $('#adviserPicturePreview').html(`<img src="${adviserPictureData}" alt="Profile Preview">`);
        };
        reader.readAsDataURL(file);
    }
}

function showEditAdviserModal(adviserId) {
    console.log('✏️ Opening Edit Adviser Modal for ID:', adviserId);
    const advisers = getLegionAdvisers();
    const adviser = advisers.find(a => a.id === adviserId);
    
    if (!adviser) {
        showNotification('Adviser not found!', 'error');
        return;
    }
    
    adviserPictureData = adviser.profilePicture || null;
    
    const modalHTML = `
        <div class="modal fade" id="adviserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Adviser</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="adviserForm">
                            <input type="hidden" id="adviserId" value="${adviser.id}">
                            <div class="profile-picture-container">
                                <div class="profile-picture-preview" id="adviserPicturePreview" onclick="document.getElementById('adviserPicture').click()">
                                    ${adviser.profilePicture ? 
                                        `<img src="${adviser.profilePicture}" alt="Profile Picture">` : 
                                        `<div class="profile-picture-placeholder"><i class="fas fa-user-tie"></i></div>`
                                    }
                                </div>
                                <input type="file" class="profile-picture-upload" id="adviserPicture" accept="image/*" onchange="previewAdviserPicture(event)">
                                <label for="adviserPicture" class="profile-picture-label">
                                    <i class="fas fa-camera me-2"></i>Change Photo
                                </label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="adviserName" value="${adviser.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-control" id="adviserEmail" value="${adviser.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Position *</label>
                                <input type="text" class="form-control" id="adviserPosition" value="${adviser.position}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAdviser()">
                            Update Adviser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('adviserModal'));
    modal.show();
}

function saveAdviser() {
    const name = $('#adviserName').val().trim();
    const email = $('#adviserEmail').val().trim();
    const position = $('#adviserPosition').val().trim();
    
    if (!name || !email || !position) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    let advisers = getLegionAdvisers();
    const adviserId = $('#adviserId').val();
    
    if (adviserId) {
        // Update existing adviser
        advisers = advisers.map(a => {
            if (a.id === parseInt(adviserId)) {
                return { 
                    ...a, 
                    name, 
                    email, 
                    position,
                    profilePicture: adviserPictureData || a.profilePicture
                };
            }
            return a;
        });
    } else {
        // Add new adviser
        const newAdviser = {
            id: Date.now(),
            name,
            email,
            position,
            profilePicture: adviserPictureData
        };
        advisers.push(newAdviser);
    }
    
    localStorage.setItem('legion_advisers', JSON.stringify(advisers));
    
    // Close modal
    const modalElement = document.getElementById('adviserModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    loadAdvisers();
    loadDashboardData();
    
    showNotification(
        adviserId ? 'Adviser updated successfully!' : 'Adviser added successfully!', 
        'success'
    );
    
    // Reset picture data
    adviserPictureData = null;
}

function loadAdvisers() {
    const advisers = getLegionAdvisers();
    const container = $('#advisersContainer');
    
    container.empty();
    
    if (advisers.length === 0) {
        container.append(`
            <div class="empty-state">
                <i class="fas fa-user-tie fa-3x mb-3"></i>
                <h5>No Advisers Yet</h5>
                <p>Start by adding your first Legion adviser.</p>
                <button class="btn btn-primary" onclick="showAddAdviserModal()">
                    Add First Adviser
                </button>
            </div>
        `);
        return;
    }
    
    container.append('<div class="advisers-grid"></div>');
    const grid = container.find('.advisers-grid');
    
    advisers.forEach(adviser => {
        grid.append(createAdviserCard(adviser));
    });
}

function createAdviserCard(adviser) {
    const initials = adviser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const avatarHTML = adviser.profilePicture ? 
        `<img src="${adviser.profilePicture}" alt="${adviser.name}">` :
        initials;
    
    return `
        <div class="adviser-card">
            <div class="adviser-header">
                <div class="adviser-avatar">${avatarHTML}</div>
                <div class="adviser-info">
                    <h5>${adviser.name}</h5>
                    <div class="adviser-details">
                        <div><strong>Position:</strong> ${adviser.position}</div>
                        <div><strong>Email:</strong> ${adviser.email}</div>
                    </div>
                </div>
            </div>
            <div class="adviser-actions mt-3">
                <button class="btn btn-sm edit-adviser-btn me-2" onclick="editAdviser(${adviser.id})">
                    Edit
                </button>
                <button class="btn btn-sm delete-adviser-btn" onclick="removeAdviser(${adviser.id})">
                    Remove
                </button>
            </div>
        </div>
    `;
}

function editAdviser(adviserId) {
    console.log('✏️ Editing adviser:', adviserId);
    showEditAdviserModal(adviserId);
}

function removeAdviser(adviserId) {
    const adviser = getLegionAdvisers().find(a => a.id === adviserId);
    if (!adviser) return;
    
    showConfirmationModal(
        'Confirm Removal',
        `This will permanently remove ${adviser.name} from The Legion advisers. This action cannot be undone.`,
        () => {
            let advisers = getLegionAdvisers();
            advisers = advisers.filter(a => a.id !== adviserId);
            localStorage.setItem('legion_advisers', JSON.stringify(advisers));
            loadAdvisers();
            loadDashboardData();
            showNotification('Adviser removed successfully!', 'success');
        }
    );
}

// ======================================== */
// ANNOUNCEMENTS MANAGEMENT - UPDATED WITH PAGINATION
// ======================================== */

function showAddAnnouncementModal() {
    console.log('📢 Opening Add Announcement Modal');
    const modalHTML = `
        <div class="modal fade" id="announcementModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Post Announcement</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="announcementForm">
                            <div class="mb-3">
                                <label class="form-label">Title *</label>
                                <input type="text" class="form-control" id="announcementTitle" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Content *</label>
                                <textarea class="form-control" id="announcementContent" rows="4" required></textarea>
                            </div>
                            
                            <div class="announcement-form-fields">
                                <h6 class="mb-3">Event Details (Optional)</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Date</label>
                                        <input type="date" class="form-control" id="announcementDate">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Time</label>
                                        <input type="time" class="form-control" id="announcementTime">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Venue</label>
                                        <input type="text" class="form-control" id="announcementVenue" placeholder="e.g., CCIS Computer Lab">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAnnouncement()">
                            Post Announcement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
    modal.show();
}

function showEditAnnouncementModal(announcementId) {
    console.log('✏️ Opening Edit Announcement Modal for ID:', announcementId);
    const announcements = getLegionAnnouncements();
    const announcement = announcements.find(a => a.id === announcementId);
    
    if (!announcement) {
        showNotification('Announcement not found!', 'error');
        return;
    }
    
    // Format date for input field (YYYY-MM-DD)
    const formattedDate = announcement.eventDate ? new Date(announcement.eventDate).toISOString().split('T')[0] : '';
    
    const modalHTML = `
        <div class="modal fade" id="announcementModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Announcement</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="announcementForm">
                            <input type="hidden" id="announcementId" value="${announcement.id}">
                            <div class="mb-3">
                                <label class="form-label">Title *</label>
                                <input type="text" class="form-control" id="announcementTitle" value="${announcement.title}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Content *</label>
                                <textarea class="form-control" id="announcementContent" rows="4" required>${announcement.content}</textarea>
                            </div>
                            
                            <div class="announcement-form-fields">
                                <h6 class="mb-3">Event Details (Optional)</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Date</label>
                                        <input type="date" class="form-control" id="announcementDate" value="${formattedDate}">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Time</label>
                                        <input type="time" class="form-control" id="announcementTime" value="${announcement.eventTime || ''}">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Venue</label>
                                        <input type="text" class="form-control" id="announcementVenue" value="${announcement.eventVenue || ''}" placeholder="e.g., CCIS Computer Lab">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAnnouncement()">
                            Update Announcement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
    modal.show();
}

function saveAnnouncement() {
    const title = $('#announcementTitle').val().trim();
    const content = $('#announcementContent').val().trim();
    const eventDate = $('#announcementDate').val();
    const eventTime = $('#announcementTime').val();
    const eventVenue = $('#announcementVenue').val().trim();
    
    if (!title || !content) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    let announcements = getLegionAnnouncements();
    const announcementId = $('#announcementId').val();
    
    if (announcementId) {
        // Update existing announcement
        announcements = announcements.map(a => {
            if (a.id === parseInt(announcementId)) {
                return {
                    ...a,
                    title,
                    content,
                    eventDate: eventDate || null,
                    eventTime: eventTime || null,
                    eventVenue: eventVenue || null,
                    updatedAt: new Date().toISOString().split('T')[0]
                };
            }
            return a;
        });
    } else {
        // Add new announcement
        const newAnnouncement = {
            id: Date.now(),
            title,
            content,
            date: new Date().toISOString().split('T')[0],
            eventDate: eventDate || null,
            eventTime: eventTime || null,
            eventVenue: eventVenue || null,
            createdAt: new Date().toISOString().split('T')[0]
        };
        announcements.unshift(newAnnouncement);
    }
    
    localStorage.setItem('legion_announcements', JSON.stringify(announcements));
    
    // Close modal
    const modalElement = document.getElementById('announcementModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    loadAnnouncements(currentAnnouncementsPage);
    loadDashboardData();
    
    showNotification(
        announcementId ? 'Announcement updated successfully!' : 'Announcement posted successfully!', 
        'success'
    );
}

function loadAnnouncements(page = 1) {
    const announcements = getLegionAnnouncements();
    const container = $('#announcementsContainer');
    
    container.empty();
    
    if (announcements.length === 0) {
        container.append(`
            <div class="empty-state">
                <i class="fas fa-bullhorn fa-3x mb-3"></i>
                <h5>No Announcements Yet</h5>
                <p>Post your first announcement or event.</p>
                <button class="btn btn-primary" onclick="showAddAnnouncementModal()">
                    Post First Announcement
                </button>
            </div>
        `);
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(announcements.length / PAGINATION_CONFIG.itemsPerPage);
    const startIndex = (page - 1) * PAGINATION_CONFIG.itemsPerPage;
    const endIndex = startIndex + PAGINATION_CONFIG.itemsPerPage;
    const paginatedAnnouncements = announcements.slice(startIndex, endIndex);
    
    // Create grid container
    container.append('<div class="announcements-grid" id="announcementsGrid"></div>');
    const grid = container.find('#announcementsGrid');
    
    // Add announcements to grid
    paginatedAnnouncements.forEach(announcement => {
        grid.append(createAnnouncementCard(announcement));
    });
    
    // Add pagination if needed
    if (totalPages > 1) {
        container.append(createPagination('announcements', page, totalPages));
    }
    
    currentAnnouncementsPage = page;
}

function createAnnouncementCard(announcement) {
    // Format dates for display
    const postDate = new Date(announcement.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let eventDateDisplay = '';
    if (announcement.eventDate) {
        eventDateDisplay = new Date(announcement.eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Check if announcement has event details
    const hasEventDetails = announcement.eventDate || announcement.eventTime || announcement.eventVenue;
    
    return `
        <div class="announcement-card">
            <div class="announcement-header">
                <div class="announcement-title-section">
                    <h5 title="${announcement.title}">${announcement.title}</h5>
                    <small class="text-muted">
                        ${announcement.updatedAt ? 
                            `Updated on ${new Date(announcement.updatedAt).toLocaleDateString()}` : 
                            `Posted on ${postDate}`
                        }
                    </small>
                </div>
            </div>
            <div class="announcement-body">
                <p title="${announcement.content}">${announcement.content}</p>
                
                ${hasEventDetails ? `
                    <div class="announcement-details-grid">
                        ${announcement.eventDate ? `
                            <div class="announcement-detail-item">
                                <i class="fas fa-calendar"></i>
                                <span title="${eventDateDisplay}"><strong>Date:</strong> ${eventDateDisplay}</span>
                            </div>
                        ` : ''}
                        
                        ${announcement.eventTime ? `
                            <div class="announcement-detail-item">
                                <i class="fas fa-clock"></i>
                                <span><strong>Time:</strong> ${formatTime(announcement.eventTime)}</span>
                            </div>
                        ` : ''}
                        
                        ${announcement.eventVenue ? `
                            <div class="announcement-detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span title="${announcement.eventVenue}"><strong>Venue:</strong> ${announcement.eventVenue}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : '<div class="announcement-details-grid"></div>'} <!-- Empty div for consistent spacing -->
            </div>
            <div class="announcement-footer">
                <div class="d-flex gap-2">
                    <button class="btn btn-sm edit-announcement-btn" onclick="editAnnouncement(${announcement.id})">
                        Edit
                    </button>
                    <button class="btn btn-sm delete-announcement-btn" onclick="removeAnnouncement(${announcement.id})">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `;
}

function formatTime(timeString) {
    // Convert 24-hour format to 12-hour format
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

function editAnnouncement(announcementId) {
    console.log('✏️ Editing announcement:', announcementId);
    showEditAnnouncementModal(announcementId);
}

function removeAnnouncement(announcementId) {
    const announcement = getLegionAnnouncements().find(a => a.id === announcementId);
    if (!announcement) return;
    
    showConfirmationModal(
        'Confirm Removal',
        `Are you sure you want to remove the announcement "${announcement.title}"? This action cannot be undone.`,
        () => {
            let announcements = getLegionAnnouncements();
            announcements = announcements.filter(a => a.id !== announcementId);
            localStorage.setItem('legion_announcements', JSON.stringify(announcements));
            loadAnnouncements(currentAnnouncementsPage);
            loadDashboardData();
            showNotification('Announcement removed successfully!', 'success');
        }
    );
}

// ======================================== */
// HAPPENINGS MANAGEMENT - UPDATED WITH PAGINATION
// ======================================== */

let selectedFiles = [];

function showUploadHappeningModal() {
    console.log('📷 Opening Upload Happening Modal');
    selectedFiles = [];
    
    const modalHTML = `
        <div class="modal fade" id="happeningModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Upload Happening</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="happeningForm">
                            <div class="mb-3">
                                <label class="form-label">Title *</label>
                                <input type="text" class="form-control" id="happeningTitle" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description *</label>
                                <textarea class="form-control" id="happeningDescription" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Upload Images (Multiple Selection)</label>
                                <input type="file" class="form-control" id="happeningImages" accept="image/*" multiple onchange="handleImageSelect(event)">
                                <small class="text-muted">You can select multiple images at once</small>
                            </div>
                            <div id="imagePreviewContainer" class="image-preview-grid"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveHappening()">
                            Upload Happening
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('happeningModal'));
    modal.show();
}

function handleImageSelect(event) {
    const files = Array.from(event.target.files);
    
    // Clear the previous files to add new ones
    selectedFiles = [];
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            // Create a temporary URL for the file to display it
            const objectURL = URL.createObjectURL(file);
            selectedFiles.push({ file, url: objectURL });
        }
    });

    displayImagePreviews();
}

function displayImagePreviews() {
    const container = $('#imagePreviewContainer');
    container.empty();
    
    selectedFiles.forEach((image, index) => {
        container.append(`
            <div class="image-preview-item">
                <img src="${image.url}" alt="Preview ${index + 1}">
                <button type="button" class="image-preview-remove" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);
    });
}

function removeImage(index) {
    // Remove the file from the array
    URL.revokeObjectURL(selectedFiles[index].url); // Clean up the temporary URL
    selectedFiles.splice(index, 1);
    // Re-display previews
    displayImagePreviews();
}

function saveHappening() {
    const title = $('#happeningTitle').val().trim();
    const description = $('#happeningDescription').val().trim();
    
    if (!title || !description) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    if (selectedFiles.length === 0) {
        showNotification('Please select at least one image!', 'error');
        return;
    }
    
    let happenings = getLegionHappenings();
    
    // IMPORTANT: We are NOT saving the actual image data to localStorage due to size limits.
    // We are only saving the metadata and the number of images.
    const newHappening = {
        id: Date.now(),
        title,
        description,
        date: new Date().toISOString().split('T')[0],
        images: [], 
        imageCount: selectedFiles.length 
    };
    
    happenings.unshift(newHappening);
    localStorage.setItem('legion_happenings', JSON.stringify(happenings));
    
    // Close modal
    const modalElement = document.getElementById('happeningModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    // Clean up temporary object URLs after closing the modal
    selectedFiles.forEach(image => URL.revokeObjectURL(image.url));
    selectedFiles = [];

    loadHappenings(currentHappeningsPage);
    loadDashboardData();
    
    showNotification(`Happening uploaded with ${newHappening.imageCount} image(s)!`, 'success');
}

function showViewHappeningModal(happeningId) {
    const happenings = getLegionHappenings();
    const happening = happenings.find(h => h.id === happeningId);
    
    if (!happening) return;
    
    // Display a placeholder because images were not saved to localStorage
    const imagesHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
            <h5>Image previews are not available.</h5>
            <p>For demonstration purposes, images are not permanently stored in your browser's local storage due to file size limits.</p>
        </div>
    `;

    const modalHTML = `
        <div class="modal fade" id="viewHappeningModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${happening.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="happening-gallery">
                            ${imagesHTML}
                        </div>
                        <div class="mt-3">
                            <h6>Description:</h6>
                            <p>${happening.description}</p>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${new Date(happening.date).toLocaleDateString()}
                                <i class="fas fa-images ms-3 me-1"></i>
                                ${happening.imageCount || 0} image(s)
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('viewHappeningModal'));
    modal.show();
}

function loadHappenings(page = 1) {
    const happenings = getLegionHappenings();
    const container = $('#happeningsContainer');
    
    container.empty();
    
    if (happenings.length === 0) {
        container.append(`
            <div class="empty-state">
                <i class="fas fa-images fa-3x mb-3"></i>
                <h5>No Happenings Yet</h5>
                <p>Upload your first happening with photos.</p>
                <button class="btn btn-primary" onclick="showUploadHappeningModal()">
                    Upload First Happening
                </button>
            </div>
        `);
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(happenings.length / PAGINATION_CONFIG.itemsPerPage);
    const startIndex = (page - 1) * PAGINATION_CONFIG.itemsPerPage;
    const endIndex = startIndex + PAGINATION_CONFIG.itemsPerPage;
    const paginatedHappenings = happenings.slice(startIndex, endIndex);
    
    // Create grid container
    container.append('<div class="happenings-grid" id="happeningsGrid"></div>');
    const grid = container.find('#happeningsGrid');
    
    // Add happenings to grid
    paginatedHappenings.forEach(happening => {
        grid.append(createHappeningCard(happening));
    });
    
    // Add pagination if needed
    if (totalPages > 1) {
        container.append(createPagination('happenings', page, totalPages));
    }
    
    currentHappeningsPage = page;
}

function createHappeningCard(happening) {
    // We use a placeholder since the images are not saved
    const imageHTML = `
        <div class="happening-image-placeholder">
            <i class="fas fa-images"></i>
            <div class="image-count-badge">+${happening.imageCount || 0}</div>
        </div>
    `;
    
    return `
        <div class="happening-card">
            ${imageHTML}
            <div class="happening-content">
                <h6>${happening.title}</h6>
                <p class="happening-description">${happening.description}</p>
                <small class="happening-date">
                    <i class="fas fa-calendar me-1"></i>${new Date(happening.date).toLocaleDateString()}
                    <i class="fas fa-images ms-2 me-1"></i>${happening.imageCount || 0} image(s)
                </small>
                <div class="happening-actions">
                    <button class="btn btn-sm edit-happening-btn me-2" onclick="viewHappening(${happening.id})">
                        View
                    </button>
                    <button class="btn btn-sm delete-happening-btn" onclick="removeHappening(${happening.id})">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `;
}

function viewHappening(happeningId) {
    showViewHappeningModal(happeningId);
}

function removeHappening(happeningId) {
    const happening = getLegionHappenings().find(h => h.id === happeningId);
    if (!happening) return;
    
    showConfirmationModal(
        'Confirm Removal',
        `Are you sure you want to remove the happening "${happening.title}" with ${happening.imageCount || 0} image(s)? This action cannot be undone.`,
        () => {
            let happenings = getLegionHappenings();
            happenings = happenings.filter(h => h.id !== happeningId);
            localStorage.setItem('legion_happenings', JSON.stringify(happenings));
            loadHappenings(currentHappeningsPage);
            loadDashboardData();
            showNotification('Happening removed successfully!', 'success');
        }
    );
}

// ======================================== */
// PAGINATION FUNCTIONS
// ======================================== */

function createPagination(type, currentPage, totalPages) {
    if (totalPages <= 1) return '';
    
    let paginationHTML = '<div class="pagination-container"><nav><ul class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="load${type.charAt(0).toUpperCase() + type.slice(1)}(${currentPage - 1}); return false;">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
    } else {
        paginationHTML += `
            <li class="page-item disabled">
                <span class="page-link"><i class="fas fa-chevron-left"></i></span>
            </li>
        `;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - Math.floor(PAGINATION_CONFIG.maxPagesDisplayed / 2));
    const endPage = Math.min(totalPages, startPage + PAGINATION_CONFIG.maxPagesDisplayed - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <li class="page-item active">
                    <span class="page-link">${i}</span>
                </li>
            `;
        } else {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="load${type.charAt(0).toUpperCase() + type.slice(1)}(${i}); return false;">${i}</a>
                </li>
            `;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="load${type.charAt(0).toUpperCase() + type.slice(1)}(${currentPage + 1}); return false;">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
    } else {
        paginationHTML += `
            <li class="page-item disabled">
                <span class="page-link"><i class="fas fa-chevron-right"></i></span>
            </li>
        `;
    }
    
    paginationHTML += '</ul></nav></div>';
    
    return paginationHTML;
}

// ======================================== */
// DASHBOARD FUNCTIONS
// ======================================== */

function loadDashboardData() {
    const officers = getLegionOfficers();
    const advisers = getLegionAdvisers();
    const announcements = getLegionAnnouncements();
    const happenings = getLegionHappenings();
    
    $('#totalOfficers').text(officers.length);
    $('#totalAdvisers').text(advisers.length);
    $('#totalAnnouncements').text(announcements.length);
    $('#totalHappenings').text(happenings.length);
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = [
        {
            icon: 'fa-user-plus',
            message: 'New officer registered: Pedro Reyes',
            time: '3 hours ago'
        },
        {
            icon: 'fa-user-tie',
            message: 'New adviser added: Prof. Maria Santos',
            time: '1 day ago'
        },
        {
            icon: 'fa-bullhorn',
            message: 'New announcement posted: IT Skills Workshop',
            time: '2 days ago'
        },
        {
            icon: 'fa-camera',
            message: 'New happening uploaded: Team Building Activity',
            time: '4 days ago'
        }
    ];
    
    const activityList = $('#recentActivity');
    activityList.empty();
    
    activities.forEach(activity => {
        activityList.append(`
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p class="mb-1">${activity.message}</p>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `);
    });
}

// ======================================== */
// DATA MANAGEMENT FUNCTIONS
// ======================================== */

function getLegionOfficers() {
    if (typeof localStorage === 'undefined') return getDefaultOfficers();
    try {
        const stored = localStorage.getItem('legion_officers');
        if (stored) return JSON.parse(stored);
        const defaultOfficers = getDefaultOfficers();
        localStorage.setItem('legion_officers', JSON.stringify(defaultOfficers));
        return defaultOfficers;
    } catch (error) {
        console.error('Error loading officers:', error);
        return getDefaultOfficers();
    }
}

function getDefaultOfficers() {
    return [
        {
            id: 1,
            name: 'Marc Jay Magan',
            position: 'President',
            joinDate: '2023-08-15'
        },
        {
            id: 2,
            name: 'Jun Philip Poyos',
            position: 'Vice President',
            joinDate: '2024-01-20'
        }
    ];
}

function getLegionAdvisers() {
    if (typeof localStorage === 'undefined') return getDefaultAdvisers();
    try {
        const stored = localStorage.getItem('legion_advisers');
        if (stored) return JSON.parse(stored);
        const defaultAdvisers = getDefaultAdvisers();
        localStorage.setItem('legion_advisers', JSON.stringify(defaultAdvisers));
        return defaultAdvisers;
    } catch (error) {
        console.error('Error loading advisers:', error);
        return getDefaultAdvisers();
    }
}

function getDefaultAdvisers() {
    return [
        {
            id: 1,
            name: 'Engr. Eduardo Carpio Jr.',
            email: 'eduardo.carpio@bisu.edu.ph',
            position: 'BSIT Program Coordinator'
        }
    ];
}

function getLegionAnnouncements() {
    if (typeof localStorage === 'undefined') return getDefaultAnnouncements();
    try {
        const stored = localStorage.getItem('legion_announcements');
        if (stored) return JSON.parse(stored);
        const defaultAnnouncements = getDefaultAnnouncements();
        localStorage.setItem('legion_announcements', JSON.stringify(defaultAnnouncements));
        return defaultAnnouncements;
    } catch (error) {
        console.error('Error loading announcements:', error);
        return getDefaultAnnouncements();
    }
}

function getDefaultAnnouncements() {
    return [
        {
            id: 1,
            title: 'IT Skills Workshop',
            content: 'Join us for a hands-on workshop on web development and networking. All BSIT students are welcome! Learn the latest technologies and enhance your skills.',
            date: '2025-04-01',
            eventDate: '2025-04-15',
            eventTime: '09:00',
            eventVenue: 'CCIS Computer Lab',
            createdAt: '2025-04-01'
        },
        {
            id: 2,
            title: 'General Assembly Meeting',
            content: 'Important general assembly meeting for all Legion officers. We will discuss upcoming activities, projects, and organizational matters.',
            date: '2025-03-28',
            eventDate: '2025-04-05',
            eventTime: '14:00',
            eventVenue: 'BISU Auditorium',
            createdAt: '2025-03-28'
        }
    ];
}

function getLegionHappenings() {
    if (typeof localStorage === 'undefined') return getDefaultHappenings();
    try {
        const stored = localStorage.getItem('legion_happenings');
        if (stored) return JSON.parse(stored);
        const defaultHappenings = getDefaultHappenings();
        localStorage.setItem('legion_happenings', JSON.stringify(defaultHappenings));
        return defaultHappenings;
    } catch (error) {
        console.error('Error loading happenings:', error);
        return getDefaultHappenings();
    }
}

function getDefaultHappenings() {
    return [
        {
            id: 1,
            title: 'Team Building Activity 2025',
            description: 'Amazing team building experience with all Legion officers at the beach resort.',
            date: '2025-03-15',
            images: [],
            imageCount: 3
        }
    ];
}

// ======================================== */
// UTILITY FUNCTIONS
// ======================================== */

function getCurrentUser() {
    if (typeof localStorage === 'undefined') {
        return {
            name: 'Marc Jay Magan',
            role: 'orgadmin',
            organization: ['The Legion'],
            position: 'The Legion Admin',
            email: 'legion.admin@bisu.edu.ph'
        };
    }
    
    try {
        const userData = localStorage.getItem('ccis_user');
        return userData ? JSON.parse(userData) : {
            name: 'Marc Jay Magan',
            role: 'orgadmin',
            organization: ['The Legion'],
            position: 'The Legion Admin',
            email: 'legion.admin@bisu.edu.ph'
        };
    } catch (error) {
        console.error('Error getting user:', error);
        return {
            name: 'Marc Jay Magan',
            role: 'orgadmin',
            organization: ['The Legion'],
            position: 'The Legion Admin',
            email: 'legion.admin@bisu.edu.ph'
        };
    }
}