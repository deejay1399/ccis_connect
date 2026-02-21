// Organization Management System for Super Admin - COMPLETE VERSION

$(document).ready(function() {
    console.log('🏢 Initializing Organization Management System...');
    
    // Initialize page
    initializePage();
});

// Enhanced session check matching manage_forms.js
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
    
    // Initialize organization management
    initializeOrganizationManagement();
    
    // Set up event handlers
    initializeEventHandlers();
    
    // Remove any Return to Dashboard links
    removeReturnToDashboard();
    
    console.log('🎯 Organization Management Page initialized successfully');
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

// Date Display Function - Same as manage_forms.js
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

function initializeEventHandlers() {
    // Add organization button
    $('#addOrganizationBtn').on('click', showAddOrganizationModal);
    
    // Refresh activities button
    $('#refreshActivities').on('click', function() {
        loadOrganizationData();
        showNotification('Activities refreshed!', 'success');
    });
    
    // Activity filter buttons
    $('.activity-filters .btn').on('click', function() {
        const filter = $(this).data('filter');
        filterActivities(filter);
        
        // Update active state
        $('.activity-filters .btn').removeClass('active');
        $(this).addClass('active');
    });
    
    // Logout functionality
    $('#logout-icon-link').on('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.logoutUser();
        }
    });
}

function initializeOrganizationManagement() {
    console.log('📊 Loading organization management system...');
    
    // Initialize organizations data structure if not exists
    initializeOrganizationsData();
    
    // Load all data
    loadOrganizationData();
    
    // Set up auto-refresh every 30 seconds
    setInterval(loadOrganizationData, 30000);
}

function initializeOrganizationsData() {
    const defaultLogos = {
        legion: (window.BASE_URL || '/') + 'assets/images/legion.jpg',
        csguild: (window.BASE_URL || '/') + 'assets/images/csguild.jpg'
    };

    // Initialize organizations list if not exists
    if (!localStorage.getItem('ccis_organizations')) {
        const defaultOrganizations = [
            {
                id: 'legion',
                name: 'The Legion',
                shortName: 'Legion',
                description: 'BSIT Student Organization - Leading organization for IT enthusiasts providing technical support for campus events.',
                logo: defaultLogos.legion,
                program: 'BSIT',
                color: '#4b0082',
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'csguild',
                name: 'CS Guild',
                shortName: 'CS Guild',
                description: 'BSCS Student Organization - Student-led group focusing on programming, peer tutoring, and coding assistance.',
                logo: defaultLogos.csguild,
                program: 'BSCS',
                color: '#4b0082',
                createdAt: new Date().toISOString(),
                status: 'active'
            }
        ];
        localStorage.setItem('ccis_organizations', JSON.stringify(defaultOrganizations));
        return;
    }

    // Backfill logos for existing organizations with empty logo values.
    const organizations = JSON.parse(localStorage.getItem('ccis_organizations') || '[]');
    let changed = false;
    const patched = organizations.map(org => {
        if (!org || !org.id || org.logo) {
            return org;
        }
        if (defaultLogos[org.id]) {
            changed = true;
            return { ...org, logo: defaultLogos[org.id] };
        }
        return org;
    });

    if (changed) {
        localStorage.setItem('ccis_organizations', JSON.stringify(patched));
    }
}

function loadOrganizationData() {
    console.log('🔄 Refreshing organization data...');
    
    // Load organizations list
    const organizations = getOrganizations();
    
    // Load data for each organization
    const organizationsData = organizations.map(org => {
        return {
            ...org,
            ...getOrganizationData(org.id)
        };
    });
    
    // Update UI
    updateOrganizationsList(organizationsData);
    updateStatistics(organizationsData);
    updateActivityLog(organizationsData);
    
    console.log('✅ Organization data updated');
}

function getOrganizations() {
    try {
        return JSON.parse(localStorage.getItem('ccis_organizations') || '[]');
    } catch (error) {
        console.error('Error loading organizations:', error);
        return [];
    }
}

function getOrganizationData(orgId) {
    try {
        const members = JSON.parse(localStorage.getItem(`${orgId}_members`) || '[]');
        const advisers = JSON.parse(localStorage.getItem(`${orgId}_advisers`) || '[]');
        const announcements = JSON.parse(localStorage.getItem(`${orgId}_announcements`) || '[]');
        const happenings = JSON.parse(localStorage.getItem(`${orgId}_happenings`) || '[]');
        
        // Get admin info
        const adminInfo = getOrganizationAdminInfo(orgId);
        
        return {
            members,
            advisers,
            announcements,
            happenings,
            adminInfo,
            lastUpdate: getLastUpdateTime(orgId)
        };
    } catch (error) {
        console.error(`Error loading ${orgId} data:`, error);
        return getDefaultOrganizationData();
    }
}

function getOrganizationAdminInfo(orgId) {
    const orgAdmins = JSON.parse(localStorage.getItem('organizationAdmins') || '[]');
    return orgAdmins.find(admin => 
        admin.organization === orgId && admin.status === 'active'
    ) || { name: 'No Admin Assigned', email: 'N/A' };
}

function getLastUpdateTime(orgId) {
    const key = `${orgId}_last_update`;
    return localStorage.getItem(key) || 'Never';
}

function updateOrganizationsList(organizationsData) {
    const container = $('#organizationsContainer');
    container.empty();
    
    if (organizationsData.length === 0) {
        container.append(`
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-sitemap"></i>
                    <h5>No Organizations Yet</h5>
                    <p>Start by creating your first student organization.</p>
                    <button class="btn btn-success mt-3" onclick="showAddOrganizationModal()">
                        <i class="fas fa-plus me-2"></i>Create First Organization
                    </button>
                </div>
            </div>
        `);
        return;
    }
    
    // Add organization cards
    organizationsData.forEach(orgData => {
        container.append(createOrganizationCard(orgData));
    });
    
    // Add "Add Organization" card at the end
    container.append(`
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="organization-card add-org-card" onclick="showAddOrganizationModal()">
                <div class="add-org-content">
                    <i class="fas fa-plus-circle"></i>
                    <h4>Add New Organization</h4>
                    <p>Create a new student organization</p>
                </div>
            </div>
        </div>
    `);
}

function createOrganizationCard(orgData) {
    const totalPosts = orgData.announcements.length + orgData.happenings.length;
    const recentAnnouncements = orgData.announcements.slice(0, 2);
    const recentHappenings = orgData.happenings.slice(0, 1);
    
    // Use uploaded logo or placeholder
    const logoUrl = orgData.logo || `https://via.placeholder.com/80x80/4b0082/ffffff?text=${orgData.shortName.substring(0, 2).toUpperCase()}`;
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="organization-card ${orgData.id}-card">
                <div class="organization-header">
                    <div class="org-logo-container">
                        <img src="${logoUrl}" alt="${orgData.name} Logo" class="org-logo" 
                             onerror="this.src='https://via.placeholder.com/80x80/4b0082/ffffff?text=${orgData.shortName.substring(0, 2).toUpperCase()}'">
                    </div>
                    <div class="org-info">
                        <h4>${orgData.name}</h4>
                        <p class="org-subtitle">${orgData.program} Student Organization</p>
                        <p class="org-description">${orgData.description}</p>
                        <div class="org-stats">
                            <span class="badge bg-primary">📊 ${totalPosts} Posts</span>
                            <span class="badge bg-success">👥 ${orgData.members.length} Members</span>
                            <span class="badge bg-info">🎓 ${orgData.advisers.length} Advisers</span>
                        </div>
                    </div>
                </div>
                
                <div class="organization-content">
                    <h5><i class="fas fa-bullhorn me-2"></i>Recent Announcements</h5>
                    <div class="activity-log" style="max-height: 120px;">
                        ${recentAnnouncements.length > 0 ? 
                            recentAnnouncements.map(ann => `
                                <div class="activity-item small ${orgData.id}" style="margin-bottom: 0.5rem; padding: 0.75rem;">
                                    <div class="activity-title" style="font-size: 0.85rem;">${ann.title}</div>
                                    <div class="activity-date" style="font-size: 0.7rem;">${formatDate(ann.date || ann.createdAt)}</div>
                                </div>
                            `).join('') :
                            `<div class="empty-state" style="padding: 1rem;">
                                <p style="font-size: 0.85rem; margin: 0;">No announcements</p>
                            </div>`
                        }
                    </div>
                    
                    <h5 class="mt-3"><i class="fas fa-images me-2"></i>Recent Happenings</h5>
                    <div class="activity-log" style="max-height: 80px;">
                        ${recentHappenings.length > 0 ? 
                            recentHappenings.map(hap => `
                                <div class="activity-item small ${orgData.id}" style="margin-bottom: 0.5rem; padding: 0.75rem;">
                                    <div class="activity-title" style="font-size: 0.85rem;">${hap.title}</div>
                                    <div class="activity-date" style="font-size: 0.7rem;">${formatDate(hap.date)}</div>
                                </div>
                            `).join('') :
                            `<div class="empty-state" style="padding: 1rem;">
                                <p style="font-size: 0.85rem; margin: 0;">No happenings</p>
                            </div>`
                        }
                    </div>
                </div>
                
                <div class="organization-footer">
                    <small class="text-muted">Updated: ${formatLastUpdate(orgData.lastUpdate)}</small>
                    <div class="org-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewOrganizationDetails('${orgData.id}')" title="View all posts and details">
                            <i class="fas fa-eye me-1"></i>View Posts
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editOrganization('${orgData.id}')" title="Edit organization details">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeOrganization('${orgData.id}')" title="Remove organization">
                            <i class="fas fa-trash me-1"></i>Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateStatistics(organizationsData) {
    let totalLegionPosts = 0;
    let totalCSGuildPosts = 0;
    let totalOrganizations = organizationsData.length;
    let totalPosts = 0;
    
    organizationsData.forEach(org => {
        const orgAnnouncements = org.announcements.length;
        const orgHappenings = org.happenings.length;
        const orgTotalPosts = orgAnnouncements + orgHappenings;
        
        totalPosts += orgTotalPosts;
        
        if (org.id === 'legion') {
            totalLegionPosts = orgTotalPosts;
        } else if (org.id === 'csguild') {
            totalCSGuildPosts = orgTotalPosts;
        }
    });
    
    $('#totalLegionPosts').text(totalLegionPosts);
    $('#totalCSGuildPosts').text(totalCSGuildPosts);
    $('#totalOrganizations').text(totalOrganizations);
    $('#totalPosts').text(totalPosts);
}

function updateActivityLog(organizationsData) {
    const activityLog = $('#recentActivityLog');
    activityLog.empty();
    
    // Combine all activities from all organizations
    const allActivities = [];
    
    organizationsData.forEach(orgData => {
        // Add announcements
        orgData.announcements.forEach(announcement => {
            allActivities.push({
                ...announcement,
                type: 'announcement',
                organization: orgData.id,
                orgName: orgData.name,
                adminInfo: orgData.adminInfo,
                timestamp: new Date(announcement.date || announcement.createdAt)
            });
        });
        
        // Add happenings
        orgData.happenings.forEach(happening => {
            allActivities.push({
                ...happening,
                type: 'happening',
                organization: orgData.id,
                orgName: orgData.name,
                adminInfo: orgData.adminInfo,
                timestamp: new Date(happening.date)
            });
        });
    });
    
    // Sort by timestamp (newest first)
    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    
    // Display activities
    if (allActivities.length === 0) {
        activityLog.append(`
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h5>No Activity Yet</h5>
                <p>Organization admins haven't posted any content yet.</p>
            </div>
        `);
    } else {
        allActivities.forEach(activity => {
            activityLog.append(createActivityItem(activity));
        });
    }
}

function createActivityItem(activity) {
    const date = new Date(activity.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const isAnnouncement = activity.type === 'announcement';
    const icon = isAnnouncement ? '📢' : '📷';
    const typeText = isAnnouncement ? 'Announcement' : 'Happening';
    
    const time = activity.eventTime ? ` at ${formatTime(activity.eventTime)}` : '';
    const venue = activity.eventVenue ? ` • ${activity.eventVenue}` : '';
    
    return `
        <div class="activity-item ${activity.organization}" data-org="${activity.organization}" data-type="${activity.type}">
            <div class="activity-header">
                <h6 class="activity-title">${icon} ${activity.title}</h6>
                <div class="activity-meta">
                    <span class="activity-org ${activity.organization}">${activity.orgName}</span>
                    <span class="activity-type">${typeText}</span>
                    <span class="activity-date">${formattedDate}</span>
                </div>
            </div>
            <div class="activity-content">
                ${activity.content || activity.description}
            </div>
            ${isAnnouncement && (activity.eventDate || time || venue) ? `
                <div class="activity-details">
                    <small class="text-muted">
                        ${activity.eventDate ? `📅 ${new Date(activity.eventDate).toLocaleDateString()}${time}` : ''}
                        ${venue}
                    </small>
                </div>
            ` : ''}
            ${!isAnnouncement ? `
                <div class="activity-details">
                    <small class="text-muted">
                        <i class="fas fa-images me-1"></i>${activity.images ? activity.images.length : activity.imageCount || 0} photo(s)
                    </small>
                </div>
            ` : ''}
            <div class="activity-admin">
                ${activity.adminInfo.name} (${activity.adminInfo.email})
            </div>
        </div>
    `;
}

// ORGANIZATION MANAGEMENT FUNCTIONS

let currentLogoFile = null;

function showAddOrganizationModal() {
    currentLogoFile = null;
    
    const modalHTML = `
        <div class="modal fade org-modal" id="addOrganizationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-plus-circle me-2"></i>Add New Organization</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addOrganizationForm">
                            <div class="file-upload-container">
                                <div class="file-upload-preview" id="logoPreview" onclick="document.getElementById('logoUpload').click()">
                                    <div class="file-upload-placeholder">
                                        <i class="fas fa-camera"></i>
                                        <div>Upload Logo</div>
                                    </div>
                                </div>
                                <input type="file" class="file-upload-input" id="logoUpload" accept="image/*" onchange="previewLogo(event)">
                                <label for="logoUpload" class="file-upload-label">
                                    <i class="fas fa-upload me-2"></i>Choose Logo
                                </label>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Organization Name *</label>
                                    <input type="text" class="form-control" id="orgName" required placeholder="e.g., The Legion">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Short Name *</label>
                                    <input type="text" class="form-control" id="orgShortName" required placeholder="e.g., Legion">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Program/Course *</label>
                                    <input type="text" class="form-control" id="orgProgram" required placeholder="e.g., BS Information Technology">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Description *</label>
                                <textarea class="form-control" id="orgDescription" rows="3" required placeholder="Describe the organization's purpose and activities..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="saveNewOrganization()">
                            <i class="fas fa-save me-2"></i>Create Organization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('addOrganizationModal'));
    modal.show();
}

function previewLogo(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File size too large! Please choose an image under 2MB.', 'error');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogoFile = e.target.result;
            $('#logoPreview').html(`<img src="${currentLogoFile}" alt="Logo Preview">`);
        };
        reader.readAsDataURL(file);
    }
}

function saveNewOrganization() {
    const name = $('#orgName').val().trim();
    const shortName = $('#orgShortName').val().trim();
    const program = $('#orgProgram').val().trim();
    const description = $('#orgDescription').val().trim();
    
    if (!name || !shortName || !program || !description) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Generate organization ID
    const id = generateOrgId(shortName);
    
    const newOrganization = {
        id: id,
        name: name,
        shortName: shortName,
        description: description,
        logo: currentLogoFile,
        program: program,
        color: '#4b0082',
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Save to organizations list
    const organizations = getOrganizations();
    organizations.push(newOrganization);
    localStorage.setItem('ccis_organizations', JSON.stringify(organizations));
    
    // Initialize organization data
    initializeOrganizationData(id);
    
    // Close modal
    const modalElement = document.getElementById('addOrganizationModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    // Reload data
    loadOrganizationData();
    
    showNotification(`Organization "${name}" created successfully!`, 'success');
}

function editOrganization(orgId) {
    const organizations = getOrganizations();
    const organization = organizations.find(org => org.id === orgId);
    
    if (!organization) {
        showNotification('Organization not found!', 'error');
        return;
    }
    
    currentLogoFile = organization.logo || null;
    
    const modalHTML = `
        <div class="modal fade org-modal" id="editOrganizationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-edit me-2"></i>Edit Organization</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editOrganizationForm">
                            <input type="hidden" id="editOrgId" value="${organization.id}">
                            
                            <div class="file-upload-container">
                                <div class="file-upload-preview" id="editLogoPreview" onclick="document.getElementById('editLogoUpload').click()">
                                    ${organization.logo ? 
                                        `<img src="${organization.logo}" alt="Logo">` :
                                        `<div class="file-upload-placeholder">
                                            <i class="fas fa-camera"></i>
                                            <div>Upload Logo</div>
                                        </div>`
                                    }
                                </div>
                                <input type="file" class="file-upload-input" id="editLogoUpload" accept="image/*" onchange="previewEditLogo(event)">
                                <label for="editLogoUpload" class="file-upload-label">
                                    <i class="fas fa-upload me-2"></i>Change Logo
                                </label>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Organization Name *</label>
                                    <input type="text" class="form-control" id="editOrgName" value="${organization.name}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Short Name *</label>
                                    <input type="text" class="form-control" id="editOrgShortName" value="${organization.shortName}" required>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Program/Course *</label>
                                    <input type="text" class="form-control" id="editOrgProgram" value="${organization.program}" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Description *</label>
                                <textarea class="form-control" id="editOrgDescription" rows="3" required>${organization.description}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="updateOrganization()">
                            <i class="fas fa-save me-2"></i>Update Organization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('editOrganizationModal'));
    modal.show();
}

function previewEditLogo(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File size too large! Please choose an image under 2MB.', 'error');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogoFile = e.target.result;
            $('#editLogoPreview').html(`<img src="${currentLogoFile}" alt="Logo Preview">`);
        };
        reader.readAsDataURL(file);
    }
}

function updateOrganization() {
    const orgId = $('#editOrgId').val();
    const name = $('#editOrgName').val().trim();
    const shortName = $('#editOrgShortName').val().trim();
    const program = $('#editOrgProgram').val().trim();
    const description = $('#editOrgDescription').val().trim();
    
    if (!name || !shortName || !program || !description) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    const organizations = getOrganizations();
    const updatedOrganizations = organizations.map(org => {
        if (org.id === orgId) {
            return {
                ...org,
                name: name,
                shortName: shortName,
                description: description,
                logo: currentLogoFile || org.logo,
                program: program,
                updatedAt: new Date().toISOString()
            };
        }
        return org;
    });
    
    localStorage.setItem('ccis_organizations', JSON.stringify(updatedOrganizations));
    
    // Close modal
    const modalElement = document.getElementById('editOrganizationModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    // Reload data
    loadOrganizationData();
    
    showNotification(`Organization "${name}" updated successfully!`, 'success');
}

function removeOrganization(orgId) {
    const organizations = getOrganizations();
    const organization = organizations.find(org => org.id === orgId);
    
    if (!organization) return;
    
    // Set up the confirmation modal
    $('#removeConfirmationText').html(`
        Are you sure you want to remove <strong>"${organization.name}"</strong>? 
        This will remove all organization data including members, advisers, announcements, and happenings. 
        This action cannot be undone.
    `);
    
    // Set up the confirm button
    $('#confirmRemoveBtn').off('click').on('click', function() {
        // Remove from organizations list
        const updatedOrganizations = organizations.filter(org => org.id !== orgId);
        localStorage.setItem('ccis_organizations', JSON.stringify(updatedOrganizations));
        
        // Remove organization data
        localStorage.removeItem(`${orgId}_members`);
        localStorage.removeItem(`${orgId}_advisers`);
        localStorage.removeItem(`${orgId}_announcements`);
        localStorage.removeItem(`${orgId}_happenings`);
        localStorage.removeItem(`${orgId}_last_update`);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('removeOrganizationModal'));
        modal.hide();
        
        // Reload data
        loadOrganizationData();
        
        showNotification(`Organization "${organization.name}" removed successfully!`, 'success');
    });
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('removeOrganizationModal'));
    modal.show();
}

// ORGANIZATION VIEW FUNCTION - IMPROVED VERSION
function viewOrganizationDetails(orgId) {
    const organizations = getOrganizations();
    const organization = organizations.find(org => org.id === orgId);
    
    if (!organization) {
        showNotification('Organization not found!', 'error');
        return;
    }

    // Get organization data
    const orgData = getOrganizationData(orgId);
    
    // Create view modal
    const modalHTML = `
        <div class="modal fade org-modal" id="viewOrganizationModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-eye me-2"></i>View Organization: ${organization.name}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <!-- Organization Info -->
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Organization Details</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="text-center mb-3">
                                            <img src="${organization.logo || `https://via.placeholder.com/100x100/4b0082/ffffff?text=${organization.shortName.substring(0, 2).toUpperCase()}`}" 
                                                 alt="${organization.name} Logo" 
                                                 class="rounded-circle" 
                                                 style="width: 100px; height: 100px; object-fit: cover;">
                                        </div>
                                        <h6 class="text-center">${organization.name}</h6>
                                        <p class="text-muted text-center small">${organization.program}</p>
                                        <p class="small">${organization.description}</p>
                                        
                                        <div class="mt-3">
                                            <div class="d-flex justify-content-between small">
                                                <span>Members:</span>
                                                <span class="fw-bold">${orgData.members.length}</span>
                                            </div>
                                            <div class="d-flex justify-content-between small">
                                                <span>Advisers:</span>
                                                <span class="fw-bold">${orgData.advisers.length}</span>
                                            </div>
                                            <div class="d-flex justify-content-between small">
                                                <span>Total Posts:</span>
                                                <span class="fw-bold">${orgData.announcements.length + orgData.happenings.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Organization Content -->
                            <div class="col-md-8">
                                <!-- Announcements -->
                                <div class="card mb-4">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0"><i class="fas fa-bullhorn me-2"></i>Recent Announcements</h6>
                                    </div>
                                    <div class="card-body" style="max-height: 300px; overflow-y: auto;">
                                        ${orgData.announcements.length > 0 ? 
                                            orgData.announcements.map(ann => `
                                                <div class="border-bottom pb-2 mb-2">
                                                    <h6 class="mb-1">${ann.title}</h6>
                                                    <p class="small text-muted mb-1">${ann.content || 'No content'}</p>
                                                    <div class="d-flex justify-content-between small">
                                                        <span>Date: ${formatDate(ann.date || ann.createdAt)}</span>
                                                        ${ann.eventDate ? `<span>Event: ${formatDate(ann.eventDate)}</span>` : ''}
                                                    </div>
                                                    ${ann.eventVenue ? `<div class="small text-muted">Venue: ${ann.eventVenue}</div>` : ''}
                                                </div>
                                            `).join('') :
                                            '<p class="text-muted text-center small">No announcements posted yet.</p>'
                                        }
                                    </div>
                                </div>
                                
                                <!-- Happenings -->
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0"><i class="fas fa-images me-2"></i>Recent Happenings</h6>
                                    </div>
                                    <div class="card-body" style="max-height: 300px; overflow-y: auto;">
                                        ${orgData.happenings.length > 0 ? 
                                            orgData.happenings.map(hap => `
                                                <div class="border-bottom pb-2 mb-2">
                                                    <h6 class="mb-1">${hap.title}</h6>
                                                    <p class="small text-muted mb-1">${hap.description || 'No description'}</p>
                                                    <div class="d-flex justify-content-between small">
                                                        <span>Date: ${formatDate(hap.date)}</span>
                                                        <span>Photos: ${hap.images ? hap.images.length : hap.imageCount || 0}</span>
                                                    </div>
                                                </div>
                                            `).join('') :
                                            '<p class="text-muted text-center small">No happenings posted yet.</p>'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="openPublicOrganizationPage('${orgId}')">
                            <i class="fas fa-external-link-alt me-2"></i>View Public Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#modalContainer').html(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('viewOrganizationModal'));
    modal.show();
}

// Function to open public organization page
function openPublicOrganizationPage(orgId) {
    window.open(`../user_side/organization.html#${orgId}`, '_blank');
}

function viewOrganizationDetailsOld(orgId) {
    // Redirect to organization page
    window.open(`../user_side/organization.html#${orgId}`, '_blank');
}

// UTILITY FUNCTIONS

function generateOrgId(shortName) {
    return shortName.toLowerCase().replace(/\s+/g, '-');
}

function initializeOrganizationData(orgId) {
    // Initialize empty data structures for new organization
    const emptyData = {
        members: [],
        advisers: [],
        announcements: [],
        happenings: []
    };
    
    localStorage.setItem(`${orgId}_members`, JSON.stringify(emptyData.members));
    localStorage.setItem(`${orgId}_advisers`, JSON.stringify(emptyData.advisers));
    localStorage.setItem(`${orgId}_announcements`, JSON.stringify(emptyData.announcements));
    localStorage.setItem(`${orgId}_happenings`, JSON.stringify(emptyData.happenings));
    localStorage.setItem(`${orgId}_last_update`, new Date().toISOString());
}

function filterActivities(filter) {
    const activities = $('.activity-item');
    
    if (filter === 'all') {
        activities.show();
    } else {
        activities.hide();
        $(`.activity-item[data-org="${filter}"]`).show();
    }
}

function formatLastUpdate(timestamp) {
    if (timestamp === 'Never') return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

function getDefaultOrganizationData() {
    return {
        members: [],
        advisers: [],
        announcements: [],
        happenings: [],
        adminInfo: { name: 'No Admin', email: 'N/A' },
        lastUpdate: 'Never'
    };
}

// NOTIFICATION AND CONFIRMATION FUNCTIONS

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
    
    // Create notification container if it doesn't exist
    if ($('#notificationContainer').length === 0) {
        $('body').append('<div id="notificationContainer"></div>');
    }
    
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

// Export functions for global access
window.showAddOrganizationModal = showAddOrganizationModal;
window.viewOrganizationDetails = viewOrganizationDetails;
window.editOrganization = editOrganization;
window.removeOrganization = removeOrganization;
window.filterActivities = filterActivities;
window.previewLogo = previewLogo;
window.previewEditLogo = previewEditLogo;
window.openPublicOrganizationPage = openPublicOrganizationPage;
