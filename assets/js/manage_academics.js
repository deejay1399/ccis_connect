// MANAGE ALUMNI JAVASCRIPT - COMPLETE VERSION
$(document).ready(function() {
    console.log('👥 Manage Alumni Page Initializing...');
    
    // Check session and initialize
    if (!checkAdminSession()) {
        return;
    }
    
    // Initialize page
    initializePage();
    
    // Load initial data for active tab only
    loadActiveTabData();
    
    // Setup auto-refresh every 30 seconds
    setInterval(loadActiveTabData, 30000);
    
    console.log('✅ Manage Alumni Page Ready');
});

// Navigation Functions
function returnToDashboardHome() {
    sessionStorage.setItem('targetSection', 'dashboard-home');
    return true;
}

function returnToContentManagement() {
    sessionStorage.setItem('targetSection', 'content-management');
    return true;
}

function returnToUserManagement() {
    sessionStorage.setItem('targetSection', 'user-management');
    return true;
}

// Check Admin Session
function checkAdminSession() {
    const session = window.checkUserSession();
    
    if (!session.isValid) {
        console.warn('❌ No valid session found, redirecting to login');
        showNotification('Please login to access admin panel', 'error');
        setTimeout(() => {
            window.location.href = '../user_side/login.html';
        }, 2000);
        return false;
    }
    
    if (session.user.role !== 'superadmin') {
        console.warn('🚫 Unauthorized access attempt by:', session.user.role);
        showNotification('Access denied. Super Admin privileges required.', 'error');
        setTimeout(() => {
            window.location.href = '../user_side/login.html';
        }, 2000);
        return false;
    }
    
    // Update admin name in navigation
    $('#user-name').text(session.user.name);
    $('#user-role').text('Super Admin');
    
    // Initialize date display
    updateCurrentDate();
    
    return true;
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

// Initialize Page
function initializePage() {
    console.log('🔄 Initializing manage alumni page...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup logout
    $('#logout-icon-link').click(function(e) {
        e.preventDefault();
        window.logoutUser();
        window.location.href = '../user_side/login.html';
    });
    
    // Setup mark all as read buttons
    $('#mark-all-mentor-read').click(markAllMentorRead);
    $('#mark-all-chatbot-read').click(markAllChatbotRead);
    $('#mark-all-connection-read').click(markAllConnectionRead);
    
    // Setup export button
    $('#export-alumni-data').click(exportAlumniData);
    
    // Setup featured alumni buttons
    $('#add-featured-alumni').click(showAddFeaturedModal);
    $('#add-first-featured').click(showAddFeaturedModal);
    $('#saveFeaturedAlumni').click(saveFeaturedAlumni);
    
    // Setup reply via email button
    $('#replyViaEmail').click(replyViaEmail);
    
    // Setup tab switching
    setupTabSwitching();
    
    // Setup notification bell
    setupNotificationBell();
    
    // Load initial notification counts
    loadNotificationCounts();
    loadNotificationDropdown();
}

// Setup Event Listeners
function setupEventListeners() {
    // Setup notification bell
    setupNotificationBell();
}

// Setup Tab Switching
function setupTabSwitching() {
    $('#alumniTabs button').on('shown.bs.tab', function(e) {
        // Update active tab state
        $('#alumniTabs .nav-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab panes
        $('#alumniTabContent .tab-pane').removeClass('show active');
        
        // Show only the active tab pane
        const target = $(this).data('bs-target');
        $(target).addClass('show active');
        
        // Load data for this specific tab
        loadTabData($(this).attr('id'));
        
        // Update notification counts
        updateNotificationCounts();
    });
}

// Load Active Tab Data
function loadActiveTabData() {
    const activeTab = $('#alumniTabs .nav-link.active').attr('id');
    if (activeTab) {
        loadTabData(activeTab);
    } else {
        // Default to mentor tab
        loadTabData('mentor-tab');
    }
}

// Load Data for Specific Tab
function loadTabData(tabId) {
    switch(tabId) {
        case 'mentor-tab':
            loadMentorSubmissions();
            break;
        case 'chatbot-tab':
            loadChatbotInquiries();
            break;
        case 'connection-tab':
            loadConnectionRequests();
            break;
        case 'updates-tab':
            loadAlumniUpdates();
            break;
        case 'featured-tab':
            loadFeaturedAlumni();
            break;
        default:
            loadMentorSubmissions();
    }
}

// Setup Notification Bell
function setupNotificationBell() {
    const notificationBell = $('#notification-bell');
    const notificationDropdown = $('#notification-dropdown');
    
    // Toggle dropdown on bell click
    notificationBell.click(function(e) {
        e.stopPropagation();
        $(this).addClass('active');
        notificationDropdown.toggleClass('show');
        console.log('🔔 Notification bell clicked');
    });
    
    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('#notification-wrapper').length) {
            notificationDropdown.removeClass('show');
            notificationBell.removeClass('active');
        }
    });
    
    // Mark all notifications as read
    $('#mark-all-notifications').click(function(e) {
        e.stopPropagation();
        markAllNotificationsAsRead();
    });
    
    // Prevent dropdown from closing when clicking inside
    notificationDropdown.click(function(e) {
        e.stopPropagation();
    });
}

// Load Notification Counts
function loadNotificationCounts() {
    try {
        // Get all unread counts
        const mentorRequests = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') && item.status !== 'read');
        
        const chatbotInquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]')
            .filter(item => item.status !== 'read');
        
        const connectionRequests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
            .filter(item => item.status !== 'read');
        
        // Update tab badges only
        $('#mentor-badge').text(mentorRequests.length).toggle(mentorRequests.length > 0);
        $('#chatbot-tab-badge').text(chatbotInquiries.length).toggle(chatbotInquiries.length > 0);
        $('#connection-badge').text(connectionRequests.length).toggle(connectionRequests.length > 0);
        
        // Update dashboard badge
        const totalUnread = mentorRequests.length + chatbotInquiries.length + connectionRequests.length;
        const notificationBadge = $('#dashboard-notification-badge');
        
        if (totalUnread > 0) {
            notificationBadge.text(totalUnread).show();
            notificationBadge.addClass('pulse');
        } else {
            notificationBadge.hide();
            notificationBadge.removeClass('pulse');
        }
        
    } catch (error) {
        console.error('❌ Error loading notification counts:', error);
    }
}

// Load Notification Dropdown
function loadNotificationDropdown() {
    try {
        const notificationList = $('#notification-list');
        
        // Get latest unread notifications (max 5)
        const mentorRequests = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') && item.status !== 'read')
            .slice(0, 2);
        
        const chatbotInquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]')
            .filter(item => item.status !== 'read')
            .slice(0, 2);
        
        const connectionRequests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
            .filter(item => item.status !== 'read')
            .slice(0, 1);
        
        const allNotifications = [...mentorRequests, ...chatbotInquiries, ...connectionRequests]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);
        
        if (allNotifications.length === 0) {
            notificationList.html(`
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>No new notifications</p>
                </div>
            `);
            return;
        }
        
        let notificationsHtml = '';
        
        allNotifications.forEach((item, index) => {
            let type = 'Mentor';
            let icon = 'fa-handshake';
            let message = '';
            let time = '';
            
            if (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') {
                type = item.type;
                icon = item.type === 'Speaker' ? 'fa-chalkboard-teacher' : 
                       item.type === 'Internship' ? 'fa-briefcase' : 'fa-handshake';
                message = `${item.name} submitted a ${item.type} volunteer form`;
            } else if (item.question) {
                type = 'Chatbot';
                icon = 'fa-robot';
                const shortQuestion = item.question.length > 40 ? 
                    item.question.substring(0, 40) + '...' : item.question;
                message = `New chatbot inquiry: "${shortQuestion}"`;
            } else if (item.alumniName) {
                type = 'Connection';
                icon = 'fa-user-friends';
                message = `${item.userName} wants to connect with ${item.alumniName}`;
            }
            
            // Format time
            const now = new Date();
            const itemTime = new Date(item.timestamp);
            const diffMs = now - itemTime;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 60) {
                time = `${diffMins}m ago`;
            } else if (diffHours < 24) {
                time = `${diffHours}h ago`;
            } else {
                time = `${diffDays}d ago`;
            }
            
            notificationsHtml += `
                <div class="notification-item" data-index="${index}" data-type="${type.toLowerCase()}">
                    <div class="notification-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="notification-content">
                        <p class="notification-text">${message}</p>
                        <small class="notification-time">${time}</small>
                    </div>
                    <button class="notification-mark-read" title="Mark as read">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            `;
        });
        
        notificationList.html(notificationsHtml);
        
        // Add click handlers for notification items
        $('.notification-item').click(function() {
            const index = $(this).index();
            const type = $(this).data('type');
            handleNotificationClick(index, type);
        });
        
        // Add click handlers for mark as read buttons
        $('.notification-mark-read').click(function(e) {
            e.stopPropagation();
            const item = $(this).closest('.notification-item');
            const index = item.index();
            const type = item.data('type');
            markSingleNotificationAsRead(index, type);
            item.remove();
            
            // Update counts
            loadNotificationCounts();
        });
        
    } catch (error) {
        console.error('❌ Error loading notification dropdown:', error);
        notificationList.html(`
            <div class="notification-empty">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading notifications</p>
            </div>
        `);
    }
}

// Mark All Notifications as Read
function markAllNotificationsAsRead() {
    try {
        // Mark all mentor submissions as read
        let mentorItems = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        mentorItems.forEach(item => {
            if (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') {
                item.status = 'read';
            }
        });
        localStorage.setItem('giveback_interests', JSON.stringify(mentorItems));
        
        // Mark all chatbot inquiries as read
        let chatbotItems = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]');
        chatbotItems.forEach(item => {
            item.status = 'read';
        });
        localStorage.setItem('chatbot_inquiries', JSON.stringify(chatbotItems));
        
        // Mark all connection requests as read
        let connectionItems = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        connectionItems.forEach(item => {
            item.status = 'read';
        });
        localStorage.setItem('connection_requests', JSON.stringify(connectionItems));
        
        // Update UI
        showNotification('All notifications marked as read', 'success');
        loadNotificationCounts();
        loadNotificationDropdown();
        loadActiveTabData();
        
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
        showNotification('Error marking notifications as read', 'error');
    }
}

// Mark Single Notification as Read
function markSingleNotificationAsRead(index, type) {
    try {
        let items, storageKey;
        
        switch(type) {
            case 'mentor':
                storageKey = 'giveback_interests';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]')
                    .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship');
                if (items[index]) items[index].status = 'read';
                break;
            case 'chatbot':
                storageKey = 'chatbot_inquiries';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (items[index]) items[index].status = 'read';
                break;
            case 'connection':
                storageKey = 'connection_requests';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (items[index]) items[index].status = 'read';
                break;
        }
        
        if (items) {
            localStorage.setItem(storageKey, JSON.stringify(items));
            console.log(`✅ Marked ${type} notification ${index} as read`);
        }
        
    } catch (error) {
        console.error('❌ Error marking single notification as read:', error);
    }
}

// Handle Notification Click
function handleNotificationClick(index, type) {
    console.log(`📨 Notification clicked: ${type}, index: ${index}`);
    
    // Close dropdown
    $('#notification-dropdown').removeClass('show');
    $('#notification-bell').removeClass('active');
    
    // Redirect to appropriate tab
    let targetTab = '';
    
    switch(type) {
        case 'mentor':
            targetTab = 'mentor-tab';
            break;
        case 'chatbot':
            targetTab = 'chatbot-tab';
            break;
        case 'connection':
            targetTab = 'connection-tab';
            break;
    }
    
    // Activate the corresponding tab
    if (targetTab) {
        $(`#${targetTab}`).tab('show');
        // Scroll to top of tab content
        $('html, body').animate({
            scrollTop: $('#alumniTabs').offset().top - 20
        }, 300);
    }
}

// Load Mentor Submissions
function loadMentorSubmissions() {
    try {
        const submissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship');
        
        // Render table
        if (submissions.length > 0) {
            $('#no-mentor-data').hide();
            const tableBody = $('#mentor-table-body');
            tableBody.empty();
            
            submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            submissions.forEach((submission, index) => {
                const isRead = submission.status === 'read';
                const date = new Date(submission.timestamp).toLocaleDateString();
                const time = new Date(submission.timestamp).toLocaleTimeString();
                
                const row = `
                    <tr data-id="${index}" data-type="mentor">
                        <td>
                            <span class="status-badge ${isRead ? 'status-read' : 'status-unread'}">
                                ${isRead ? 'Read' : 'New'}
                            </span>
                        </td>
                        <td><strong>${submission.name || 'N/A'}</strong></td>
                        <td>${submission.batch || 'N/A'}</td>
                        <td>${submission.email || 'No email'}</td>
                        <td>${submission.type || 'Mentor'}</td>
                        <td>${date}<br><small>${time}</small></td>
                        <td>
                            <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${!isRead ? `
                                <button class="action-btn mark-read-btn" title="Mark as Read" data-index="${index}">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        } else {
            $('#no-mentor-data').show();
            $('#mentor-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading mentor submissions:', error);
        showNotification('Error loading mentor submissions', 'error');
    }
}

// Load Chatbot Inquiries
function loadChatbotInquiries() {
    try {
        const inquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]');
        
        // Render table
        if (inquiries.length > 0) {
            $('#no-chatbot-data').hide();
            const tableBody = $('#chatbot-table-body');
            tableBody.empty();
            
            inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            inquiries.forEach((inquiry, index) => {
                const isRead = inquiry.status === 'read';
                const date = new Date(inquiry.timestamp).toLocaleDateString();
                const time = new Date(inquiry.timestamp).toLocaleTimeString();
                const shortQuestion = inquiry.question.length > 50 ? 
                    inquiry.question.substring(0, 50) + '...' : inquiry.question;
                
                const row = `
                    <tr data-id="${index}" data-type="chatbot">
                        <td>
                            <span class="status-badge ${isRead ? 'status-read' : 'status-unread'}">
                                ${isRead ? 'Read' : 'New'}
                            </span>
                        </td>
                        <td title="${inquiry.question}">${shortQuestion}</td>
                        <td>${inquiry.email || 'No email'}</td>
                        <td>${inquiry.page || 'Unknown'}</td>
                        <td>${date}<br><small>${time}</small></td>
                        <td>
                            <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${!isRead ? `
                                <button class="action-btn mark-read-btn" title="Mark as Read" data-index="${index}">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        } else {
            $('#no-chatbot-data').show();
            $('#chatbot-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading chatbot inquiries:', error);
        showNotification('Error loading chatbot inquiries', 'error');
    }
}

// Load Connection Requests
function loadConnectionRequests() {
    try {
        const requests = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        
        // Render table
        if (requests.length > 0) {
            $('#no-connection-data').hide();
            const tableBody = $('#connection-table-body');
            tableBody.empty();
            
            requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            requests.forEach((request, index) => {
                const isRead = request.status === 'read';
                const date = new Date(request.timestamp).toLocaleDateString();
                const time = new Date(request.timestamp).toLocaleTimeString();
                const shortMessage = request.message.length > 50 ? 
                    request.message.substring(0, 50) + '...' : request.message;
                
                const row = `
                    <tr data-id="${index}" data-type="connection">
                        <td>
                            <span class="status-badge ${isRead ? 'status-read' : 'status-unread'}">
                                ${isRead ? 'Read' : 'New'}
                            </span>
                        </td>
                        <td>${request.userName || 'N/A'}</td>
                        <td>${request.alumniName || 'N/A'}</td>
                        <td>${request.purpose || 'N/A'}</td>
                        <td title="${request.message}">${shortMessage}</td>
                        <td>${date}<br><small>${time}</small></td>
                        <td>
                            <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${!isRead ? `
                                <button class="action-btn mark-read-btn" title="Mark as Read" data-index="${index}">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        } else {
            $('#no-connection-data').show();
            $('#connection-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading connection requests:', error);
        showNotification('Error loading connection requests', 'error');
    }
}

// Load Alumni Updates
function loadAlumniUpdates() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        // Render table
        if (updates.length > 0) {
            $('#no-updates-data').hide();
            const tableBody = $('#updates-table-body');
            tableBody.empty();
            
            updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            updates.forEach((update, index) => {
                const date = new Date(update.timestamp).toLocaleDateString();
                
                const row = `
                    <tr data-id="${index}" data-type="update">
                        <td><strong>${update.name || 'N/A'}</strong></td>
                        <td>${update.batch || 'N/A'}</td>
                        <td>${update.program || 'N/A'}</td>
                        <td>${update.company || 'Not specified'}</td>
                        <td>${update.position || 'Not specified'}</td>
                        <td>${date}</td>
                        <td>
                            <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        } else {
            $('#no-updates-data').show();
            $('#updates-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading alumni updates:', error);
        showNotification('Error loading alumni updates', 'error');
    }
}

// Load Featured Alumni
function loadFeaturedAlumni() {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        
        // Render grid
        if (featured.length > 0) {
            $('#no-featured-data').hide();
            const grid = $('#featured-alumni-grid');
            grid.empty();
            
            featured.forEach((alumni, index) => {
                const card = `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="featured-card">
                            <div class="featured-image">
                                <img src="${alumni.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                                     alt="${alumni.name}">
                            </div>
                            <div class="featured-content">
                                <h5>${alumni.name}</h5>
                                <p class="featured-batch">${alumni.batch} • ${alumni.program}</p>
                                <p class="featured-position">${alumni.position}</p>
                                <p class="featured-company">${alumni.company}</p>
                                <div class="featured-actions">
                                    <button class="action-btn view-btn" title="View" data-index="${index}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn delete-btn" title="Remove" data-index="${index}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                grid.append(card);
            });
        } else {
            $('#no-featured-data').show();
            $('#featured-alumni-grid').empty();
        }
    } catch (error) {
        console.error('❌ Error loading featured alumni:', error);
        showNotification('Error loading featured alumni', 'error');
    }
}

// Update Notification Counts
function updateNotificationCounts() {
    try {
        // Mentor requests
        const mentorRequests = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship')
            .filter(item => item.status !== 'read');
        
        // Chatbot inquiries
        const chatbotInquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]')
            .filter(item => item.status !== 'read');
        
        // Connection requests
        const connectionRequests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
            .filter(item => item.status !== 'read');
        
        // Update tab badges only
        $('#mentor-badge').text(mentorRequests.length).toggle(mentorRequests.length > 0);
        $('#chatbot-tab-badge').text(chatbotInquiries.length).toggle(chatbotInquiries.length > 0);
        $('#connection-badge').text(connectionRequests.length).toggle(connectionRequests.length > 0);
        
    } catch (error) {
        console.error('❌ Error updating notification counts:', error);
    }
}

// View Details Event Delegation
$(document).on('click', '.view-btn', function() {
    const index = $(this).data('index');
    const type = $(this).closest('tr')?.data('type') || 'featured';
    
    if (type === 'featured') {
        viewFeaturedDetails(index);
    } else {
        viewSubmissionDetails(index, type);
    }
});

// View Submission Details
function viewSubmissionDetails(index, type) {
    try {
        let data, title;
        
        switch(type) {
            case 'mentor':
                data = JSON.parse(localStorage.getItem('giveback_interests') || '[]')[index];
                title = 'Mentor Volunteer Submission';
                break;
            case 'chatbot':
                data = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]')[index];
                title = 'Chatbot Inquiry';
                break;
            case 'connection':
                data = JSON.parse(localStorage.getItem('connection_requests') || '[]')[index];
                title = 'Connection Request';
                break;
            case 'update':
                data = JSON.parse(localStorage.getItem('alumni_updates') || '[]')[index];
                title = 'Alumni Update';
                break;
        }
        
        if (!data) {
            showNotification('Data not found', 'error');
            return;
        }
        
        // Format details
        let detailsHtml = '';
        
        if (type === 'mentor') {
            detailsHtml = `
                <div class="detail-section">
                    <h6>Personal Information</h6>
                    <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${data.email || 'No email provided'}</p>
                    <p><strong>Batch Year:</strong> ${data.batch || 'Not specified'}</p>
                </div>
                <div class="detail-section">
                    <h6>Volunteer Details</h6>
                    <p><strong>Type:</strong> ${data.type || 'Mentor'}</p>
                    <p><strong>Additional Details:</strong></p>
                    <div class="bg-light p-3 rounded">${data.details || 'No additional details provided'}</div>
                </div>
                <div class="detail-section">
                    <h6>Submission Information</h6>
                    <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="badge ${data.status === 'read' ? 'bg-success' : 'bg-warning'}">${data.status === 'read' ? 'Read' : 'New'}</span></p>
                </div>
            `;
        } else if (type === 'chatbot') {
            detailsHtml = `
                <div class="detail-section">
                    <h6>Question Details</h6>
                    <p><strong>Question:</strong></p>
                    <div class="bg-light p-3 rounded">${data.question || 'N/A'}</div>
                </div>
                <div class="detail-section">
                    <h6>Contact Information</h6>
                    <p><strong>Email:</strong> ${data.email || 'No email provided'}</p>
                    <p><strong>Page:</strong> ${data.page || 'Unknown page'}</p>
                </div>
                <div class="detail-section">
                    <h6>Submission Information</h6>
                    <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="badge ${data.status === 'read' ? 'bg-success' : 'bg-warning'}">${data.status === 'read' ? 'Read' : 'New'}</span></p>
                </div>
            `;
        } else if (type === 'connection') {
            detailsHtml = `
                <div class="detail-section">
                    <h6>Requester Information</h6>
                    <p><strong>Name:</strong> ${data.userName || 'N/A'}</p>
                    <p><strong>Email:</strong> ${data.userEmail || 'N/A'}</p>
                    <p><strong>Batch:</strong> ${data.batch || 'Not specified'}</p>
                </div>
                <div class="detail-section">
                    <h6>Connection Request</h6>
                    <p><strong>Target Alumni:</strong> ${data.alumniName || 'N/A'}</p>
                    <p><strong>Purpose:</strong> ${data.purpose || 'N/A'}</p>
                    <p><strong>Message:</strong></p>
                    <div class="bg-light p-3 rounded">${data.message || 'No message'}</div>
                </div>
                <div class="detail-section">
                    <h6>Submission Information</h6>
                    <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="badge ${data.status === 'read' ? 'bg-success' : 'bg-warning'}">${data.status === 'read' ? 'Read' : 'New'}</span></p>
                </div>
            `;
        } else if (type === 'update') {
            const giveback = data.giveback || {};
            const givebackOptions = [];
            if (giveback.mentor) givebackOptions.push('Willing to mentor');
            if (giveback.speaker) givebackOptions.push('Available as speaker');
            if (giveback.internship) givebackOptions.push('Offers internships');
            if (giveback.donation) givebackOptions.push('Interested in donations');
            
            detailsHtml = `
                <div class="detail-section">
                    <h6>Personal Information</h6>
                    <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${data.email || 'No email'}</p>
                    <p><strong>Batch:</strong> ${data.batch || 'N/A'}</p>
                    <p><strong>Program:</strong> ${data.program || 'N/A'}</p>
                </div>
                <div class="detail-section">
                    <h6>Professional Information</h6>
                    <p><strong>Current Position:</strong> ${data.position || 'Not specified'}</p>
                    <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
                </div>
                <div class="detail-section">
                    <h6>Achievements/Updates</h6>
                    <div class="bg-light p-3 rounded">${data.achievements || 'No achievements specified'}</div>
                </div>
                <div class="detail-section">
                    <h6>Give Back Options</h6>
                    <p>${givebackOptions.length > 0 ? givebackOptions.join(', ') : 'Not specified'}</p>
                </div>
                <div class="detail-section">
                    <h6>Submission Information</h6>
                    <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                </div>
            `;
        }
        
        // Store current view data for reply functionality
        window.currentViewData = {
            type: type,
            data: data,
            index: index
        };
        
        // Update modal
        $('#modalTitle').text(title);
        $('#modalBodyContent').html(detailsHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
        // Mark as read when viewed
        if (type !== 'update' && data.status !== 'read') {
            markAsRead(index, type);
        }
        
    } catch (error) {
        console.error('❌ Error viewing details:', error);
        showNotification('Error loading details', 'error');
    }
}

// View Featured Details
function viewFeaturedDetails(index) {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]')[index];
        
        if (!featured) {
            showNotification('Featured alumni not found', 'error');
            return;
        }
        
        const detailsHtml = `
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${featured.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                         alt="${featured.name}" class="img-fluid rounded mb-3">
                </div>
                <div class="col-md-8">
                    <h4>${featured.name}</h4>
                    <p class="text-muted">${featured.batch} • ${featured.program}</p>
                    <p><strong>Position:</strong> ${featured.position}</p>
                    <p><strong>Company:</strong> ${featured.company}</p>
                    <div class="mt-3">
                        <h6>Achievements:</h6>
                        <div class="bg-light p-3 rounded">${featured.achievements}</div>
                    </div>
                    ${featured.email ? `<p class="mt-3"><strong>Email:</strong> ${featured.email}</p>` : ''}
                </div>
            </div>
        `;
        
        $('#modalTitle').text('Featured Alumni Details');
        $('#modalBodyContent').html(detailsHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error viewing featured alumni:', error);
        showNotification('Error loading featured alumni details', 'error');
    }
}

// Mark as Read
function markAsRead(index, type) {
    try {
        let storageKey, items;
        
        switch(type) {
            case 'mentor':
                storageKey = 'giveback_interests';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (items[index]) items[index].status = 'read';
                break;
            case 'chatbot':
                storageKey = 'chatbot_inquiries';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (items[index]) items[index].status = 'read';
                break;
            case 'connection':
                storageKey = 'connection_requests';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (items[index]) items[index].status = 'read';
                break;
        }
        
        if (items) {
            localStorage.setItem(storageKey, JSON.stringify(items));
            showNotification('Marked as read', 'success');
            loadNotificationCounts();
            loadTabData($('#alumniTabs .nav-link.active').attr('id'));
        }
    } catch (error) {
        console.error('❌ Error marking as read:', error);
        showNotification('Error updating status', 'error');
    }
}

// Mark All as Read Functions
function markAllMentorRead() {
    try {
        const items = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        items.forEach(item => {
            if (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') {
                item.status = 'read';
            }
        });
        localStorage.setItem('giveback_interests', JSON.stringify(items));
        showNotification('All mentor submissions marked as read', 'success');
        loadNotificationCounts();
        loadTabData('mentor-tab');
    } catch (error) {
        console.error('❌ Error marking all mentor as read:', error);
        showNotification('Error updating mentor submissions', 'error');
    }
}

function markAllChatbotRead() {
    try {
        const items = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]');
        items.forEach(item => {
            item.status = 'read';
        });
        localStorage.setItem('chatbot_inquiries', JSON.stringify(items));
        showNotification('All chatbot inquiries marked as read', 'success');
        loadNotificationCounts();
        loadTabData('chatbot-tab');
    } catch (error) {
        console.error('❌ Error marking all chatbot as read:', error);
        showNotification('Error updating chatbot inquiries', 'error');
    }
}

function markAllConnectionRead() {
    try {
        const items = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        items.forEach(item => {
            item.status = 'read';
        });
        localStorage.setItem('connection_requests', JSON.stringify(items));
        showNotification('All connection requests marked as read', 'success');
        loadNotificationCounts();
        loadTabData('connection-tab');
    } catch (error) {
        console.error('❌ Error marking all connection as read:', error);
        showNotification('Error updating connection requests', 'error');
    }
}

// Mark as Read Event Delegation
$(document).on('click', '.mark-read-btn', function() {
    const index = $(this).data('index');
    const type = $(this).closest('tr').data('type');
    markAsRead(index, type);
});

// Delete Featured Alumni Event Delegation
$(document).on('click', '.delete-btn', function() {
    const index = $(this).data('index');
    const alumniName = $(this).closest('.featured-card').find('h5').text();
    
    if (confirm(`Are you sure you want to remove ${alumniName} from featured alumni?`)) {
        deleteFeaturedAlumni(index);
    }
});

// Delete Featured Alumni
function deleteFeaturedAlumni(index) {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        featured.splice(index, 1);
        localStorage.setItem('featured_alumni', JSON.stringify(featured));
        showNotification('Featured alumni removed', 'success');
        loadTabData('featured-tab');
    } catch (error) {
        console.error('❌ Error deleting featured alumni:', error);
        showNotification('Error removing featured alumni', 'error');
    }
}

// Export Alumni Data
function exportAlumniData() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        if (updates.length === 0) {
            showNotification('No alumni data to export', 'warning');
            return;
        }
        
        // Convert to CSV
        let csv = 'Name,Email,Batch,Program,Company,Position,Achievements,Timestamp\n';
        
        updates.forEach(update => {
            const row = [
                `"${update.name || ''}"`,
                `"${update.email || ''}"`,
                `"${update.batch || ''}"`,
                `"${update.program || ''}"`,
                `"${update.company || ''}"`,
                `"${update.position || ''}"`,
                `"${update.achievements || ''}"`,
                `"${update.timestamp || ''}"`
            ].join(',');
            csv += row + '\n';
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ccis_alumni_updates_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Alumni data exported successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error exporting alumni data:', error);
        showNotification('Error exporting alumni data', 'error');
    }
}

// Show Add Featured Modal
function showAddFeaturedModal() {
    // Reset form
    $('#featuredAlumniForm')[0].reset();
    
    const modal = new bootstrap.Modal(document.getElementById('addFeaturedModal'));
    modal.show();
}

// Save Featured Alumni
function saveFeaturedAlumni() {
    try {
        // Validate form
        const name = $('#featuredName').val().trim();
        const batch = $('#featuredBatch').val().trim();
        const program = $('#featuredProgram').val();
        const position = $('#featuredPosition').val().trim();
        const company = $('#featuredCompany').val().trim();
        const achievements = $('#featuredAchievements').val().trim();
        
        if (!name || !batch || !program || !position || !company || !achievements) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Get existing featured alumni
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        
        // Add new alumni
        featured.push({
            id: Date.now(),
            name: name,
            batch: batch,
            program: program,
            position: position,
            company: company,
            achievements: achievements,
            image: $('#featuredImage').val().trim() || '',
            email: $('#featuredEmail').val().trim() || '',
            created: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('featured_alumni', JSON.stringify(featured));
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addFeaturedModal')).hide();
        
        // Show success and refresh
        showNotification('Featured alumni added successfully', 'success');
        loadTabData('featured-tab');
        
    } catch (error) {
        console.error('❌ Error saving featured alumni:', error);
        showNotification('Error saving featured alumni', 'error');
    }
}

// Reply via Email
function replyViaEmail() {
    const data = window.currentViewData;
    
    if (!data || !data.data) {
        showNotification('No data available for email', 'error');
        return;
    }
    
    let email = '';
    let subject = '';
    let body = '';
    
    switch(data.type) {
        case 'mentor':
            email = data.data.email;
            subject = `Re: Your Mentor/Volunteer Submission to CCIS`;
            body = `Dear ${data.data.name},\n\nThank you for your interest in giving back to CCIS as a ${data.data.type}. We appreciate your willingness to support our students.\n\nWe will contact you soon regarding next steps.\n\nBest regards,\nCCIS Alumni Office`;
            break;
        case 'chatbot':
            email = data.data.email;
            subject = `Re: Your Question to CCIS Assistant`;
            body = `Dear User,\n\nThank you for your question: "${data.data.question}"\n\nOur team will look into this and get back to you with more information.\n\nBest regards,\nCCIS Information Office`;
            break;
        case 'connection':
            email = data.data.userEmail;
            subject = `Re: Your Connection Request to ${data.data.alumniName}`;
            body = `Dear ${data.data.userName},\n\nThank you for your interest in connecting with ${data.data.alumniName}. We have received your request and will facilitate the connection.\n\nWe will notify both parties once the connection is established.\n\nBest regards,\nCCIS Alumni Office`;
            break;
        case 'update':
            email = data.data.email;
            subject = `Re: Your Alumni Information Update`;
            body = `Dear ${data.data.name},\n\nThank you for updating your information in the CCIS Alumni Database. Your details have been received and will be verified by our alumni office.\n\nBest regards,\nCCIS Alumni Office`;
            break;
    }
    
    if (!email) {
        showNotification('No email address available for this submission', 'warning');
        return;
    }
    
    // Open default email client
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
}

// Notification Function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.admin-alert').remove();
    
    const alertClass = type === 'error' ? 'alert-danger' : 
                     type === 'success' ? 'alert-success' : 
                     type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 
                type === 'success' ? 'fa-check-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    const alert = $(`
        <div class="admin-alert alert ${alertClass} alert-dismissible fade show" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.is(':visible')) {
            alert.alert('close');
        }
    }, 5000);
}