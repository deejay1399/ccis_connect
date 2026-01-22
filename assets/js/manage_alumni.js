// MANAGE ALUMNI JAVASCRIPT - COMPLETE MANAGEMENT SYSTEM
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

// ===== SESSION MANAGEMENT =====
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

// ===== PAGE INITIALIZATION =====
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
    
    // Setup all button handlers
    setupButtonHandlers();
    
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
    // View details
    $(document).on('click', '.view-btn', function() {
        const index = $(this).data('index');
        const type = $(this).closest('tr')?.data('type') || 
                     $(this).closest('.featured-card')?.data('type') ||
                     $(this).closest('.story-card')?.data('type') ||
                     $(this).closest('.event-card')?.data('type') || 'featured';
        
        if (type === 'featured') {
            viewFeaturedDetails(index);
        } else if (type === 'story') {
            viewStoryDetails(index);
        } else if (type === 'event') {
            viewEventDetails(index);
        } else if (type === 'directory') {
            viewDirectoryDetails(index);
        } else {
            viewSubmissionDetails(index, type);
        }
    });
    
    // Mark as read
    $(document).on('click', '.mark-read-btn', function() {
        const index = $(this).data('index');
        const type = $(this).closest('tr').data('type');
        markAsRead(index, type);
    });
    
    // Delete items
    $(document).on('click', '.delete-btn', function() {
        const index = $(this).data('index');
        const type = $(this).closest('.featured-card')?.data('type') ||
                     $(this).closest('.story-card')?.data('type') ||
                     $(this).closest('.event-card')?.data('type') ||
                     $(this).closest('tr')?.data('type') || 'featured';
        
        if (type === 'featured') {
            const alumniName = $(this).closest('.featured-card').find('h5').text();
            if (confirm(`Are you sure you want to remove ${alumniName} from featured alumni?`)) {
                deleteFeaturedAlumni(index);
            }
        } else if (type === 'story') {
            const storyTitle = $(this).closest('.story-card').find('h5').text();
            if (confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
                deleteSuccessStory(index);
            }
        } else if (type === 'event') {
            const eventTitle = $(this).closest('.event-card').find('h5').text();
            if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
                deleteAlumniEvent(index);
            }
        } else if (type === 'directory') {
            const alumniName = $(this).closest('tr').find('td:first-child').text();
            if (confirm(`Are you sure you want to remove ${alumniName} from the directory?`)) {
                deleteDirectoryEntry(index);
            }
        }
    });
    
    // Edit items
    $(document).on('click', '.edit-btn', function() {
        const index = $(this).data('index');
        const type = $(this).closest('.featured-card')?.data('type') ||
                     $(this).closest('.story-card')?.data('type') ||
                     $(this).closest('.event-card')?.data('type') ||
                     $(this).closest('tr')?.data('type');
        
        if (type === 'featured') {
            editFeaturedAlumni(index);
        } else if (type === 'story') {
            editSuccessStory(index);
        } else if (type === 'event') {
            editAlumniEvent(index);
        } else if (type === 'directory') {
            editDirectoryEntry(index);
        }
    });
}

// Setup Button Handlers
function setupButtonHandlers() {
    // Mark all as read buttons
    $('#mark-all-mentor-read').click(markAllMentorRead);
    $('#mark-all-chatbot-read').click(markAllChatbotRead);
    $('#mark-all-connection-read').click(markAllConnectionRead);
    $('#mark-all-giveback-read').click(markAllGivebackRead);
    
    // Export button
    $('#export-alumni-data').click(exportAlumniData);
    
    // Add to directory from updates
    $('#add-directory-alumni').click(function() {
        showAddToDirectoryModal();
    });
    
    // Featured alumni buttons
    $('#add-featured-alumni').click(showAddFeaturedModal);
    $('#add-first-featured').click(showAddFeaturedModal);
    $('#saveFeaturedAlumni').click(saveFeaturedAlumni);
    $('#import-from-updates').click(showImportFromUpdatesModal);
    
    // Directory buttons
    $('#add-directory-entry').click(showAddDirectoryModal);
    $('#saveDirectoryEntry').click(saveDirectoryEntry);
    
    // Success story buttons
    $('#add-success-story').click(showAddStoryModal);
    $('#saveSuccessStory').click(saveSuccessStory);
    
    // Event buttons
    $('#add-alumni-event').click(showAddEventModal);
    $('#saveEvent').click(saveEvent);
    
    // Reply via email
    $('#replyViaEmail').click(replyViaEmail);
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

// ===== NOTIFICATION SYSTEM =====
function setupNotificationBell() {
    const notificationBell = $('#notification-bell');
    const notificationDropdown = $('#notification-dropdown');
    
    // Toggle dropdown on bell click
    notificationBell.click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // Add click animation
        $(this).addClass('clicked');
        setTimeout(() => {
            $(this).removeClass('clicked');
        }, 100);
        
        const isOpen = notificationDropdown.hasClass('show');
        
        if (isOpen) {
            // Close dropdown
            closeNotificationDropdown();
        } else {
            // Open dropdown
            openNotificationDropdown();
        }
        
        console.log('🔔 Notification bell clicked - State:', !isOpen);
    });
    
    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('#notification-wrapper').length) {
            closeNotificationDropdown();
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
    
    // Close dropdown when clicking notification items
    $(document).on('click', '.notification-item', function() {
        closeNotificationDropdown();
    });
    
    // Close dropdown when clicking "View All"
    $(document).on('click', '.view-all-link', function() {
        closeNotificationDropdown();
    });
}

function openNotificationDropdown() {
    $('#notification-dropdown').addClass('show');
    $('#notification-bell').addClass('active');
    
    // Optional: Load notifications when opening
    loadNotificationDropdown();
}

function closeNotificationDropdown() {
    $('#notification-dropdown').removeClass('show');
    $('#notification-bell').removeClass('active');
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
        
        const givebackSubmissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Donation' && item.status !== 'read');
        
        // Update tab badges
        $('#mentor-badge').text(mentorRequests.length).toggle(mentorRequests.length > 0);
        $('#chatbot-tab-badge').text(chatbotInquiries.length).toggle(chatbotInquiries.length > 0);
        $('#connection-badge').text(connectionRequests.length).toggle(connectionRequests.length > 0);
        $('#giveback-badge').text(givebackSubmissions.length).toggle(givebackSubmissions.length > 0);
        
        // Update dashboard badge
        const totalUnread = mentorRequests.length + chatbotInquiries.length + connectionRequests.length + givebackSubmissions.length;
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
        
        // Giveback submissions
        const givebackSubmissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Donation' && item.status !== 'read');
        
        // Update tab badges only
        $('#mentor-badge').text(mentorRequests.length).toggle(mentorRequests.length > 0);
        $('#chatbot-tab-badge').text(chatbotInquiries.length).toggle(chatbotInquiries.length > 0);
        $('#connection-badge').text(connectionRequests.length).toggle(connectionRequests.length > 0);
        $('#giveback-badge').text(givebackSubmissions.length).toggle(givebackSubmissions.length > 0);
        
    } catch (error) {
        console.error('❌ Error updating notification counts:', error);
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
        
        const givebackSubmissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Donation' && item.status !== 'read')
            .slice(0, 1);
        
        const allNotifications = [...mentorRequests, ...chatbotInquiries, ...connectionRequests, ...givebackSubmissions]
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
            } else if (item.type === 'Donation') {
                type = 'Giveback';
                icon = 'fa-donate';
                message = `${item.name} submitted a ${item.type} form`;
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
    }
}

// Mark All Notifications as Read
function markAllNotificationsAsRead() {
    try {
        // Mark all mentor submissions as read
        let mentorItems = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        mentorItems.forEach(item => {
            if (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship' || item.type === 'Donation') {
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
        
        // Close dropdown after marking all as read
        closeNotificationDropdown();
        
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
            case 'giveback':
                storageKey = 'giveback_interests';
                items = JSON.parse(localStorage.getItem(storageKey) || '[]')
                    .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship' || item.type === 'Donation');
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
            
            // Update counts and UI
            loadNotificationCounts();
            loadNotificationDropdown();
        }
        
    } catch (error) {
        console.error('❌ Error marking single notification as read:', error);
    }
}

// ===== DATA LOADING FUNCTIONS =====
function loadActiveTabData() {
    const activeTab = $('#alumniTabs .nav-link.active').attr('id');
    if (activeTab) {
        loadTabData(activeTab);
    } else {
        // Default to mentor tab
        loadTabData('mentor-tab');
    }
}

function loadTabData(tabId) {
    console.log(`📊 Loading data for tab: ${tabId}`);
    
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
        case 'giveback-tab':
            loadGivebackSubmissions();
            break;
        case 'featured-tab':
            loadFeaturedAlumni();
            break;
        case 'directory-tab':
            loadAlumniDirectory();
            break;
        case 'stories-tab':
            loadSuccessStories();
            break;
        case 'events-tab':
            loadAlumniEvents();
            break;
        default:
            loadMentorSubmissions();
    }
}

function loadMentorSubmissions() {
    try {
        const submissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship');
        
        if (submissions.length > 0) {
            $('#no-mentor-data').hide();
            const tableBody = $('#mentor-table-body');
            tableBody.empty();
            
            submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            submissions.forEach((submission, index) => {
                const isRead = submission.status === 'read';
                const date = new Date(submission.timestamp).toLocaleDateString();
                const time = new Date(submission.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const row = `
                    <tr data-id="${index}" data-type="mentor">
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

function loadChatbotInquiries() {
    try {
        const inquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]');
        
        if (inquiries.length > 0) {
            $('#no-chatbot-data').hide();
            const tableBody = $('#chatbot-table-body');
            tableBody.empty();
            
            inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            inquiries.forEach((inquiry, index) => {
                const isRead = inquiry.status === 'read';
                const date = new Date(inquiry.timestamp).toLocaleDateString();
                const time = new Date(inquiry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

function loadConnectionRequests() {
    try {
        const requests = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        
        if (requests.length > 0) {
            $('#no-connection-data').hide();
            const tableBody = $('#connection-table-body');
            tableBody.empty();
            
            requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            requests.forEach((request, index) => {
                const isRead = request.status === 'read';
                const date = new Date(request.timestamp).toLocaleDateString();
                const time = new Date(request.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

function loadAlumniUpdates() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        if (updates.length > 0) {
            $('#no-updates-data').hide();
            const tableBody = $('#updates-table-body');
            tableBody.empty();
            
            updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            updates.forEach((update, index) => {
                const date = new Date(update.timestamp).toLocaleDateString();
                const time = new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const row = `
                    <tr data-id="${index}" data-type="update">
                        <td><strong>${update.name || 'N/A'}</strong></td>
                        <td>${update.batch || 'N/A'}</td>
                        <td>${update.program || 'N/A'}</td>
                        <td>${update.company || 'Not specified'}</td>
                        <td>${update.position || 'Not specified'}</td>
                        <td>${date}<br><small>${time}</small></td>
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

function loadGivebackSubmissions() {
    try {
        const submissions = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
            .filter(item => item.type === 'Donation');
        
        if (submissions.length > 0) {
            $('#no-giveback-data').hide();
            const tableBody = $('#giveback-table-body');
            tableBody.empty();
            
            submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            submissions.forEach((submission, index) => {
                const isRead = submission.status === 'read';
                const date = new Date(submission.timestamp).toLocaleDateString();
                const time = new Date(submission.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const row = `
                    <tr data-id="${index}" data-type="giveback">
                        <td><strong>${submission.type || 'Donation'}</strong></td>
                        <td>${submission.name || 'N/A'}</td>
                        <td>${submission.batch || 'N/A'}</td>
                        <td>${submission.email || 'No email'}</td>
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
            $('#no-giveback-data').show();
            $('#giveback-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading giveback submissions:', error);
        showNotification('Error loading giveback submissions', 'error');
    }
}

function loadFeaturedAlumni() {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        
        if (featured.length > 0) {
            $('#no-featured-data').hide();
            const grid = $('#featured-alumni-grid');
            grid.empty();
            
            featured.forEach((alumni, index) => {
                const shortAchievements = alumni.achievements.length > 100 ? 
                    alumni.achievements.substring(0, 100) + '...' : alumni.achievements;
                
                const card = `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="featured-card" data-type="featured" data-id="${alumni.id || index}">
                            <div class="featured-image">
                                <img src="${alumni.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                                     alt="${alumni.name}">
                            </div>
                            <div class="featured-content">
                                <h5>${alumni.name}</h5>
                                <p class="featured-batch">${alumni.batch} • ${alumni.program}</p>
                                <p class="featured-position">${alumni.position}</p>
                                <p class="featured-company">${alumni.company}</p>
                                <p class="featured-achievements" style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">${shortAchievements}</p>
                                <div class="featured-actions">
                                    <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit-btn" title="Edit" data-index="${index}">
                                        <i class="fas fa-edit"></i>
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

function loadAlumniDirectory() {
    try {
        const directory = JSON.parse(localStorage.getItem('alumni_directory') || '[]');
        
        if (directory.length > 0) {
            $('#no-directory-data').hide();
            const tableBody = $('#directory-table-body');
            tableBody.empty();
            
            directory.forEach((alumni, index) => {
                const row = `
                    <tr data-id="${index}" data-type="directory">
                        <td><strong>${alumni.name || 'N/A'}</strong></td>
                        <td>${alumni.program || 'N/A'}</td>
                        <td>${alumni.batch || 'N/A'}</td>
                        <td>${alumni.company || 'Not specified'}</td>
                        <td>${alumni.position || 'Not specified'}</td>
                        <td>
                            <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-btn" title="Edit" data-index="${index}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Delete" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        } else {
            $('#no-directory-data').show();
            $('#directory-table-body').empty();
        }
    } catch (error) {
        console.error('❌ Error loading alumni directory:', error);
        showNotification('Error loading alumni directory', 'error');
    }
}

function loadSuccessStories() {
    try {
        const stories = JSON.parse(localStorage.getItem('success_stories') || '[]');
        
        if (stories.length > 0) {
            $('#no-stories-data').hide();
            const grid = $('#stories-grid');
            grid.empty();
            
            stories.forEach((story, index) => {
                const shortContent = story.content.length > 150 ? 
                    story.content.substring(0, 150) + '...' : story.content;
                
                const card = `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="story-card" data-type="story" data-id="${story.id || index}">
                            <div class="story-image">
                                <img src="${story.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                                     alt="${story.name}">
                            </div>
                            <div class="story-content">
                                <h5>${story.title}</h5>
                                <p class="story-details">${story.name} • ${story.details || ''}</p>
                                <p class="story-preview">${shortContent}</p>
                                <div class="featured-actions">
                                    <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit-btn" title="Edit" data-index="${index}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete-btn" title="Delete" data-index="${index}">
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
            $('#no-stories-data').show();
            $('#stories-grid').empty();
        }
    } catch (error) {
        console.error('❌ Error loading success stories:', error);
        showNotification('Error loading success stories', 'error');
    }
}

function loadAlumniEvents() {
    try {
        const events = JSON.parse(localStorage.getItem('alumni_events') || '[]');
        
        if (events.length > 0) {
            $('#no-events-data').hide();
            const grid = $('#events-grid');
            grid.empty();
            
            events.forEach((event, index) => {
                const shortDescription = event.description.length > 100 ? 
                    event.description.substring(0, 100) + '...' : event.description;
                
                const eventDate = new Date(event.date);
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = eventDate.getDate();
                const year = eventDate.getFullYear();
                
                const card = `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="event-card" data-type="event" data-id="${event.id || index}">
                            <div class="event-date">
                                <div class="event-month">${month}</div>
                                <div class="event-day">${day}</div>
                                <div class="event-year">${year}</div>
                            </div>
                            <div class="event-details">
                                <h5>${event.title}</h5>
                                <p class="event-time-location">
                                    <i class="fas fa-clock me-1"></i>${event.time || 'TBA'}<br>
                                    <i class="fas fa-map-marker-alt me-1"></i>${event.location || 'TBA'}
                                </p>
                                <p class="event-preview">${shortDescription}</p>
                                <div class="event-actions">
                                    <button class="action-btn view-btn" title="View Details" data-index="${index}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit-btn" title="Edit" data-index="${index}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete-btn" title="Delete" data-index="${index}">
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
            $('#no-events-data').show();
            $('#events-grid').empty();
        }
    } catch (error) {
        console.error('❌ Error loading alumni events:', error);
        showNotification('Error loading alumni events', 'error');
    }
}

// ===== VIEW DETAILS FUNCTIONS =====
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
            case 'giveback':
                data = JSON.parse(localStorage.getItem('giveback_interests') || '[]')[index];
                title = 'Give Back Submission';
                break;
        }
        
        if (!data) {
            showNotification('Data not found', 'error');
            return;
        }
        
        let detailsHtml = '';
        
        if (type === 'mentor' || type === 'giveback') {
            detailsHtml = `
                <div class="detail-section">
                    <h6>Personal Information</h6>
                    <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${data.email || 'No email provided'}</p>
                    <p><strong>Batch Year:</strong> ${data.batch || 'Not specified'}</p>
                </div>
                <div class="detail-section">
                    <h6>Submission Details</h6>
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
        
        window.currentViewData = {
            type: type,
            data: data,
            index: index
        };
        
        $('#modalTitle').text(title);
        $('#modalBodyContent').html(detailsHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
        if (type !== 'update' && data.status !== 'read') {
            markAsRead(index, type);
        }
        
    } catch (error) {
        console.error('❌ Error viewing details:', error);
        showNotification('Error loading details', 'error');
    }
}

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
                        <h6>Achievements/Description:</h6>
                        <div class="bg-light p-3 rounded">${featured.achievements}</div>
                    </div>
                    ${featured.email ? `<p class="mt-3"><strong>Email:</strong> ${featured.email}</p>` : ''}
                    <div class="mt-3">
                        <h6>Record Information:</h6>
                        <p><strong>Created:</strong> ${new Date(featured.created).toLocaleString()}</p>
                        <p><strong>ID:</strong> ${featured.id || 'N/A'}</p>
                    </div>
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

function viewDirectoryDetails(index) {
    try {
        const alumni = JSON.parse(localStorage.getItem('alumni_directory') || '[]')[index];
        
        if (!alumni) {
            showNotification('Alumni not found', 'error');
            return;
        }
        
        const detailsHtml = `
            <div class="detail-section">
                <h6>Personal Information</h6>
                <p><strong>Name:</strong> ${alumni.name || 'N/A'}</p>
                <p><strong>Program:</strong> ${alumni.program || 'N/A'}</p>
                <p><strong>Batch Year:</strong> ${alumni.batch || 'N/A'}</p>
            </div>
            <div class="detail-section">
                <h6>Professional Information</h6>
                <p><strong>Company:</strong> ${alumni.company || 'Not specified'}</p>
                <p><strong>Position:</strong> ${alumni.position || 'Not specified'}</p>
            </div>
            ${alumni.email ? `
                <div class="detail-section">
                    <h6>Contact Information</h6>
                    <p><strong>Email:</strong> ${alumni.email}</p>
                </div>
            ` : ''}
            <div class="detail-section">
                <h6>Record Information</h6>
                <p><strong>Added:</strong> ${new Date(alumni.created).toLocaleString()}</p>
                <p><strong>ID:</strong> ${alumni.id || 'N/A'}</p>
            </div>
        `;
        
        $('#modalTitle').text('Alumni Directory Details');
        $('#modalBodyContent').html(detailsHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error viewing directory details:', error);
        showNotification('Error loading directory details', 'error');
    }
}

function viewStoryDetails(index) {
    try {
        const story = JSON.parse(localStorage.getItem('success_stories') || '[]')[index];
        
        if (!story) {
            showNotification('Story not found', 'error');
            return;
        }
        
        const detailsHtml = `
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${story.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                         alt="${story.name}" class="img-fluid rounded mb-3">
                </div>
                <div class="col-md-8">
                    <h4>${story.title}</h4>
                    <p class="text-muted">${story.name} • ${story.details || ''}</p>
                    ${story.position ? `<p><strong>Position/Company:</strong> ${story.position}</p>` : ''}
                    <div class="mt-3">
                        <h6>Success Story:</h6>
                        <div class="bg-light p-3 rounded">${story.content}</div>
                    </div>
                    <div class="mt-3">
                        <h6>Record Information:</h6>
                        <p><strong>Created:</strong> ${new Date(story.created).toLocaleString()}</p>
                        <p><strong>ID:</strong> ${story.id || 'N/A'}</p>
                    </div>
                </div>
            </div>
        `;
        
        $('#modalTitle').text('Success Story Details');
        $('#modalBodyContent').html(detailsHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error viewing story details:', error);
        showNotification('Error loading story details', 'error');
    }
}

function viewEventDetails(index) {
    try {
        const event = JSON.parse(localStorage.getItem('alumni_events') || '[]')[index];
        
        if (!event) {
            showNotification('Event not found', 'error');
            return;
        }
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const detailsHtml = `
            <div class="detail-section">
                <h6>Event Information</h6>
                <p><strong>Title:</strong> ${event.title}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${event.time || 'To be announced'}</p>
                <p><strong>Location:</strong> ${event.location || 'To be announced'}</p>
            </div>
            <div class="detail-section">
                <h6>Event Description</h6>
                <div class="bg-light p-3 rounded">${event.description}</div>
            </div>
            <div class="detail-section">
                <h6>Record Information</h6>
                <p><strong>Created:</strong> ${new Date(event.created).toLocaleString()}</p>
                <p><strong>ID:</strong> ${event.id || 'N/A'}</p>
            </div>
        `;
        
        $('#modalTitle').text('Alumni Event Details');
        $('#modalBodyContent').html(detailsHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error viewing event details:', error);
        showNotification('Error loading event details', 'error');
    }
}

// ===== MARK AS READ FUNCTIONS =====
function markAsRead(index, type) {
    try {
        let storageKey, items;
        
        switch(type) {
            case 'mentor':
            case 'giveback':
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

function markAllGivebackRead() {
    try {
        const items = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        items.forEach(item => {
            if (item.type === 'Donation') {
                item.status = 'read';
            }
        });
        localStorage.setItem('giveback_interests', JSON.stringify(items));
        showNotification('All giveback submissions marked as read', 'success');
        loadNotificationCounts();
        loadTabData('giveback-tab');
    } catch (error) {
        console.error('❌ Error marking all giveback as read:', error);
        showNotification('Error updating giveback submissions', 'error');
    }
}

// ===== DELETE FUNCTIONS =====
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

function deleteDirectoryEntry(index) {
    try {
        const directory = JSON.parse(localStorage.getItem('alumni_directory') || '[]');
        directory.splice(index, 1);
        localStorage.setItem('alumni_directory', JSON.stringify(directory));
        showNotification('Directory entry removed', 'success');
        loadTabData('directory-tab');
    } catch (error) {
        console.error('❌ Error deleting directory entry:', error);
        showNotification('Error removing directory entry', 'error');
    }
}

function deleteSuccessStory(index) {
    try {
        const stories = JSON.parse(localStorage.getItem('success_stories') || '[]');
        stories.splice(index, 1);
        localStorage.setItem('success_stories', JSON.stringify(stories));
        showNotification('Success story deleted', 'success');
        loadTabData('stories-tab');
    } catch (error) {
        console.error('❌ Error deleting success story:', error);
        showNotification('Error deleting success story', 'error');
    }
}

function deleteAlumniEvent(index) {
    try {
        const events = JSON.parse(localStorage.getItem('alumni_events') || '[]');
        events.splice(index, 1);
        localStorage.setItem('alumni_events', JSON.stringify(events));
        showNotification('Event deleted', 'success');
        loadTabData('events-tab');
    } catch (error) {
        console.error('❌ Error deleting alumni event:', error);
        showNotification('Error deleting event', 'error');
    }
}

// ===== MODAL FUNCTIONS =====
function showAddFeaturedModal() {
    $('#featuredAlumniForm')[0].reset();
    $('#featuredAlumniForm').data('edit-index', null);
    
    const modal = new bootstrap.Modal(document.getElementById('addFeaturedModal'));
    modal.show();
}

function saveFeaturedAlumni() {
    try {
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
        
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        const editIndex = $('#featuredAlumniForm').data('edit-index');
        
        if (editIndex !== null && editIndex !== undefined) {
            featured[editIndex] = {
                ...featured[editIndex],
                name: name,
                batch: batch,
                program: program,
                position: position,
                company: company,
                achievements: achievements,
                image: $('#featuredImage').val().trim() || featured[editIndex].image,
                email: $('#featuredEmail').val().trim() || featured[editIndex].email,
                updated: new Date().toISOString()
            };
        } else {
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
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
        }
        
        localStorage.setItem('featured_alumni', JSON.stringify(featured));
        bootstrap.Modal.getInstance(document.getElementById('addFeaturedModal')).hide();
        showNotification(editIndex !== null ? 'Featured alumni updated successfully' : 'Featured alumni added successfully', 'success');
        loadTabData('featured-tab');
        
    } catch (error) {
        console.error('❌ Error saving featured alumni:', error);
        showNotification('Error saving featured alumni', 'error');
    }
}

function editFeaturedAlumni(index) {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        const alumni = featured[index];
        
        if (!alumni) {
            showNotification('Alumni not found', 'error');
            return;
        }
        
        $('#featuredName').val(alumni.name);
        $('#featuredBatch').val(alumni.batch);
        $('#featuredProgram').val(alumni.program);
        $('#featuredPosition').val(alumni.position);
        $('#featuredCompany').val(alumni.company);
        $('#featuredAchievements').val(alumni.achievements);
        $('#featuredImage').val(alumni.image || '');
        $('#featuredEmail').val(alumni.email || '');
        $('#featuredAlumniForm').data('edit-index', index);
        
        const modal = new bootstrap.Modal(document.getElementById('addFeaturedModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error editing featured alumni:', error);
        showNotification('Error loading alumni data', 'error');
    }
}

function showAddDirectoryModal() {
    $('#directoryEntryForm')[0].reset();
    $('#directoryEntryForm').data('edit-index', null);
    
    const modal = new bootstrap.Modal(document.getElementById('addDirectoryModal'));
    modal.show();
}

function saveDirectoryEntry() {
    try {
        const name = $('#directoryName').val().trim();
        const program = $('#directoryProgram').val();
        const batch = $('#directoryBatch').val().trim();
        
        if (!name || !program || !batch) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const directory = JSON.parse(localStorage.getItem('alumni_directory') || '[]');
        const editIndex = $('#directoryEntryForm').data('edit-index');
        
        if (editIndex !== null && editIndex !== undefined) {
            directory[editIndex] = {
                ...directory[editIndex],
                name: name,
                program: program,
                batch: batch,
                company: $('#directoryCompany').val().trim() || directory[editIndex].company,
                position: $('#directoryPosition').val().trim() || directory[editIndex].position,
                email: $('#directoryEmail').val().trim() || directory[editIndex].email,
                updated: new Date().toISOString()
            };
        } else {
            directory.push({
                id: Date.now(),
                name: name,
                program: program,
                batch: batch,
                company: $('#directoryCompany').val().trim() || '',
                position: $('#directoryPosition').val().trim() || '',
                email: $('#directoryEmail').val().trim() || '',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
        }
        
        localStorage.setItem('alumni_directory', JSON.stringify(directory));
        bootstrap.Modal.getInstance(document.getElementById('addDirectoryModal')).hide();
        showNotification(editIndex !== null ? 'Directory entry updated successfully' : 'Directory entry added successfully', 'success');
        loadTabData('directory-tab');
        
    } catch (error) {
        console.error('❌ Error saving directory entry:', error);
        showNotification('Error saving directory entry', 'error');
    }
}

function editDirectoryEntry(index) {
    try {
        const directory = JSON.parse(localStorage.getItem('alumni_directory') || '[]');
        const alumni = directory[index];
        
        if (!alumni) {
            showNotification('Alumni not found', 'error');
            return;
        }
        
        $('#directoryName').val(alumni.name);
        $('#directoryProgram').val(alumni.program);
        $('#directoryBatch').val(alumni.batch);
        $('#directoryCompany').val(alumni.company || '');
        $('#directoryPosition').val(alumni.position || '');
        $('#directoryEmail').val(alumni.email || '');
        $('#directoryEntryForm').data('edit-index', index);
        
        const modal = new bootstrap.Modal(document.getElementById('addDirectoryModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error editing directory entry:', error);
        showNotification('Error loading alumni data', 'error');
    }
}

function showAddToDirectoryModal() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        if (updates.length === 0) {
            showNotification('No alumni updates available', 'warning');
            return;
        }
        
        let optionsHtml = '<option value="">Select Alumni to Add</option>';
        updates.forEach((update, index) => {
            optionsHtml += `<option value="${index}">${update.name} (${update.batch} - ${update.program})</option>`;
        });
        
        const modalHtml = `
            <div class="modal fade" id="addToDirectorySelectModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Alumni to Directory</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Select Alumni *</label>
                                <select class="form-select" id="selectAlumniUpdate">
                                    ${optionsHtml}
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmAddToDirectory">Add to Directory</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#addToDirectorySelectModal').remove();
        $('body').append(modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('addToDirectorySelectModal'));
        modal.show();
        
        $('#confirmAddToDirectory').off('click').on('click', function() {
            const selectedIndex = $('#selectAlumniUpdate').val();
            if (!selectedIndex) {
                showNotification('Please select an alumni', 'error');
                return;
            }
            
            const update = updates[selectedIndex];
            addUpdateToDirectory(update);
            modal.hide();
        });
        
    } catch (error) {
        console.error('❌ Error showing add to directory modal:', error);
        showNotification('Error loading alumni updates', 'error');
    }
}

function addUpdateToDirectory(update) {
    try {
        const directory = JSON.parse(localStorage.getItem('alumni_directory') || '[]');
        
        const exists = directory.some(alumni => 
            alumni.name === update.name && 
            alumni.batch === update.batch && 
            alumni.program === update.program
        );
        
        if (exists) {
            showNotification('Alumni already exists in directory', 'warning');
            return;
        }
        
        directory.push({
            id: Date.now(),
            name: update.name,
            program: update.program,
            batch: update.batch,
            company: update.company || '',
            position: update.position || '',
            email: update.email || '',
            source: 'update_form',
            created: new Date().toISOString()
        });
        
        localStorage.setItem('alumni_directory', JSON.stringify(directory));
        showNotification('Alumni added to directory successfully', 'success');
        loadTabData('directory-tab');
        
    } catch (error) {
        console.error('❌ Error adding update to directory:', error);
        showNotification('Error adding to directory', 'error');
    }
}

function showImportFromUpdatesModal() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        if (updates.length === 0) {
            showNotification('No alumni updates available for import', 'warning');
            return;
        }
        
        let listHtml = '';
        updates.forEach((update, index) => {
            listHtml += `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="${index}" id="update-${index}">
                    <label class="form-check-label" for="update-${index}">
                        <strong>${update.name}</strong> - ${update.batch} ${update.program}
                        <br><small>${update.position || 'No position'} at ${update.company || 'No company'}</small>
                    </label>
                </div>
            `;
        });
        
        const modalHtml = `
            <div class="modal fade" id="importUpdatesModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Import Alumni from Updates</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Select alumni updates to import as featured alumni:</p>
                            <div id="updates-list" style="max-height: 300px; overflow-y: auto;">
                                ${listHtml}
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-primary" id="select-all-updates">Select All</button>
                                <button class="btn btn-sm btn-outline-secondary" id="deselect-all-updates">Deselect All</button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="import-selected-updates">Import Selected</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#importUpdatesModal').remove();
        $('body').append(modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('importUpdatesModal'));
        modal.show();
        
        $('#select-all-updates').click(function() {
            $('#importUpdatesModal .form-check-input').prop('checked', true);
        });
        
        $('#deselect-all-updates').click(function() {
            $('#importUpdatesModal .form-check-input').prop('checked', false);
        });
        
        $('#import-selected-updates').off('click').on('click', function() {
            const selectedIndexes = [];
            $('#importUpdatesModal .form-check-input:checked').each(function() {
                selectedIndexes.push(parseInt($(this).val()));
            });
            
            if (selectedIndexes.length === 0) {
                showNotification('Please select at least one alumni', 'error');
                return;
            }
            
            importUpdatesAsFeatured(selectedIndexes, updates);
            modal.hide();
        });
        
    } catch (error) {
        console.error('❌ Error showing import modal:', error);
        showNotification('Error loading updates', 'error');
    }
}

function importUpdatesAsFeatured(selectedIndexes, updates) {
    try {
        const featured = JSON.parse(localStorage.getItem('featured_alumni') || '[]');
        let importedCount = 0;
        
        selectedIndexes.forEach(index => {
            const update = updates[index];
            
            const exists = featured.some(alumni => 
                alumni.name === update.name && 
                alumni.batch === update.batch
            );
            
            if (!exists) {
                featured.push({
                    id: Date.now() + index,
                    name: update.name,
                    batch: update.batch,
                    program: update.program,
                    position: update.position || 'Not specified',
                    company: update.company || 'Not specified',
                    achievements: update.achievements || 'Updated their information recently.',
                    email: update.email || '',
                    source: 'update_form',
                    created: new Date().toISOString()
                });
                importedCount++;
            }
        });
        
        localStorage.setItem('featured_alumni', JSON.stringify(featured));
        showNotification(`Imported ${importedCount} alumni as featured`, 'success');
        loadTabData('featured-tab');
        
    } catch (error) {
        console.error('❌ Error importing updates:', error);
        showNotification('Error importing updates', 'error');
    }
}

function showAddStoryModal() {
    $('#successStoryForm')[0].reset();
    $('#successStoryForm').data('edit-index', null);
    
    const modal = new bootstrap.Modal(document.getElementById('addStoryModal'));
    modal.show();
}

function saveSuccessStory() {
    try {
        const name = $('#storyName').val().trim();
        const title = $('#storyTitle').val().trim();
        const content = $('#storyContent').val().trim();
        
        if (!name || !title || !content) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const stories = JSON.parse(localStorage.getItem('success_stories') || '[]');
        const editIndex = $('#successStoryForm').data('edit-index');
        
        if (editIndex !== null && editIndex !== undefined) {
            stories[editIndex] = {
                ...stories[editIndex],
                name: name,
                title: title,
                content: content,
                details: $('#storyDetails').val().trim() || stories[editIndex].details,
                position: $('#storyPosition').val().trim() || stories[editIndex].position,
                image: $('#storyImage').val().trim() || stories[editIndex].image,
                updated: new Date().toISOString()
            };
        } else {
            stories.push({
                id: Date.now(),
                name: name,
                title: title,
                content: content,
                details: $('#storyDetails').val().trim() || '',
                position: $('#storyPosition').val().trim() || '',
                image: $('#storyImage').val().trim() || '',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
        }
        
        localStorage.setItem('success_stories', JSON.stringify(stories));
        bootstrap.Modal.getInstance(document.getElementById('addStoryModal')).hide();
        showNotification(editIndex !== null ? 'Success story updated successfully' : 'Success story added successfully', 'success');
        loadTabData('stories-tab');
        
    } catch (error) {
        console.error('❌ Error saving success story:', error);
        showNotification('Error saving success story', 'error');
    }
}

function editSuccessStory(index) {
    try {
        const stories = JSON.parse(localStorage.getItem('success_stories') || '[]');
        const story = stories[index];
        
        if (!story) {
            showNotification('Story not found', 'error');
            return;
        }
        
        $('#storyName').val(story.name);
        $('#storyDetails').val(story.details || '');
        $('#storyTitle').val(story.title);
        $('#storyContent').val(story.content);
        $('#storyPosition').val(story.position || '');
        $('#storyImage').val(story.image || '');
        $('#successStoryForm').data('edit-index', index);
        
        const modal = new bootstrap.Modal(document.getElementById('addStoryModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error editing success story:', error);
        showNotification('Error loading story data', 'error');
    }
}

function showAddEventModal() {
    $('#eventForm')[0].reset();
    $('#eventDate').attr('min', new Date().toISOString().split('T')[0]);
    $('#eventForm').data('edit-index', null);
    
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
}

function saveEvent() {
    try {
        const title = $('#eventTitle').val().trim();
        const date = $('#eventDate').val();
        const description = $('#eventDescription').val().trim();
        
        if (!title || !date || !description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const events = JSON.parse(localStorage.getItem('alumni_events') || '[]');
        const editIndex = $('#eventForm').data('edit-index');
        
        if (editIndex !== null && editIndex !== undefined) {
            events[editIndex] = {
                ...events[editIndex],
                title: title,
                date: date,
                description: description,
                time: $('#eventTime').val() || events[editIndex].time,
                location: $('#eventLocation').val().trim() || events[editIndex].location,
                updated: new Date().toISOString()
            };
        } else {
            events.push({
                id: Date.now(),
                title: title,
                date: date,
                description: description,
                time: $('#eventTime').val() || '',
                location: $('#eventLocation').val().trim() || '',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
        }
        
        localStorage.setItem('alumni_events', JSON.stringify(events));
        bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
        showNotification(editIndex !== null ? 'Event updated successfully' : 'Event added successfully', 'success');
        loadTabData('events-tab');
        
    } catch (error) {
        console.error('❌ Error saving event:', error);
        showNotification('Error saving event', 'error');
    }
}

function editAlumniEvent(index) {
    try {
        const events = JSON.parse(localStorage.getItem('alumni_events') || '[]');
        const event = events[index];
        
        if (!event) {
            showNotification('Event not found', 'error');
            return;
        }
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toISOString().split('T')[0];
        
        $('#eventTitle').val(event.title);
        $('#eventDate').val(formattedDate);
        $('#eventTime').val(event.time || '');
        $('#eventLocation').val(event.location || '');
        $('#eventDescription').val(event.description);
        $('#eventForm').data('edit-index', index);
        
        const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ Error editing event:', error);
        showNotification('Error loading event data', 'error');
    }
}

// ===== EXPORT FUNCTION =====
function exportAlumniData() {
    try {
        const updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        
        if (updates.length === 0) {
            showNotification('No alumni data to export', 'warning');
            return;
        }
        
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

// ===== REPLY VIA EMAIL =====
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
        case 'giveback':
            email = data.data.email;
            subject = `Re: Your ${data.data.type} Submission to CCIS`;
            body = `Dear ${data.data.name},\n\nThank you for your interest in supporting CCIS through ${data.data.type}. We appreciate your generosity.\n\nWe will contact you soon regarding next steps.\n\nBest regards,\nCCIS Alumni Office`;
            break;
    }
    
    if (!email) {
        showNotification('No email address available for this submission', 'warning');
        return;
    }
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        if (alert.is(':visible')) {
            alert.alert('close');
        }
    }, 5000);
}