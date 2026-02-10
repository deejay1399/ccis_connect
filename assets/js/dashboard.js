// Super Admin Dashboard - COMPLETE VERSION WITH NOTIFICATION SYSTEM
$(document).ready(function() {
    console.log('🔐 Super Admin Dashboard Loading...');
    
    // Enhanced session check for Super Admin
    function checkDashboardSession() {
        const session = window.checkUserSession();
        
        console.log('Session check result:', session);
        
        if (!session.isValid) {
            console.warn('❌ No valid session found, redirecting to login');
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = window.baseUrl ? window.baseUrl + 'login' : '/ccis_connect/login';
            }, 2000);
            return false;
        }
        
        const allowedRoles = ['superadmin', 'faculty'];
        if (!session.user || !allowedRoles.includes(session.user.role)) {
            console.warn('Unauthorized access attempt by:', session.user ? session.user.role : 'unknown');
            showNotification('Access denied. Authorized staff privileges required.', 'error');
            setTimeout(() => {
                window.location.href = window.baseUrl ? window.baseUrl + 'login' : '/ccis_connect/login';
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
        // Update all name elements
        $('[id*="admin-name"], [id*="welcome-admin-name"], #user-name').each(function() {
            $(this).text(user.name);
        });
        
        // Update user role
        const roleLabel = user.role === 'faculty' ? 'Faculty' : 'Super Admin';
        $('#user-role').text(roleLabel);
        
        // Setup public site link to store return URL
        setupPublicSiteLink();

        console.log('👤 UI updated for:', user.name);
    }
    
    // Initialize dashboard
    function initializeDashboard() {
        if (!checkDashboardSession()) {
            return;
        }
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Setup section navigation
        setupSectionNavigation();
        
        // Setup hidden overview cards toggle
        setupOverviewCardToggle();
        
        // Handle external navigation (from other pages like manage_homepage.html)
        handleExternalNavigation();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        // Keep notification icon visible but non-functional for now.
        setupNotificationBell();
        
        // Setup logout
        $('#logout-icon-link').on('click', function(e) {
            e.preventDefault();
            if (window.logoutUser) {
                window.logoutUser();
            } else {
                // Fallback: Redirect to logout controller
                window.location.href = window.baseUrl ? window.baseUrl + 'logout' : '/ccis_connect/logout';
            }
        });
        
        console.log('🎯 Super Admin Dashboard initialized successfully');
    }
    
    // Setup Notification Bell Functionality
    function setupNotificationBell() {
        const notificationBell = $("#notification-bell");
        const notificationDropdown = $("#notification-dropdown");

        notificationDropdown.removeClass("show").hide();
        $("#dashboard-notification-badge").hide();
        $("#notification-count").text("0");

        notificationBell.off("click").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            showNotification("Notifications are not available yet.", "info");
        });
    }
    
    // Load Notification Counts for Dashboard Stats
    function loadNotificationCounts() {
        try {
            // Get all unread counts
            const mentorRequests = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
                .filter(item => (item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship') && item.status !== 'read');
            
            const chatbotInquiries = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]')
                .filter(item => item.status !== 'read');
            
            const connectionRequests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
                .filter(item => item.status !== 'read');
            
            // Get total counts (including read)
            const totalMentor = JSON.parse(localStorage.getItem('giveback_interests') || '[]')
                .filter(item => item.type === 'Mentor' || item.type === 'Speaker' || item.type === 'Internship').length;
            
            const totalChatbot = JSON.parse(localStorage.getItem('chatbot_inquiries') || '[]').length;
            const totalConnection = JSON.parse(localStorage.getItem('connection_requests') || '[]').length;
            
            // Update quick stats
            $('#stat-mentor-count').text(totalMentor);
            $('#stat-mentor-new').text(`${mentorRequests.length} new`);
            $('#stat-chatbot-count').text(totalChatbot);
            $('#stat-chatbot-new').text(`${chatbotInquiries.length} new`);
            $('#stat-connection-count').text(totalConnection);
            $('#stat-connection-new').text(`${connectionRequests.length} new`);
            
            // Store counts for badge
            const totalUnread = mentorRequests.length + chatbotInquiries.length + connectionRequests.length;
            localStorage.setItem('notification_counts', JSON.stringify({
                mentor: mentorRequests.length,
                chatbot: chatbotInquiries.length,
                connection: connectionRequests.length,
                total: totalUnread
            }));
            
            console.log(`📊 Notification counts updated - Total unread: ${totalUnread}`);
            
            // Update badge
            displayNotificationBadges();
            
        } catch (error) {
            console.error('❌ Error loading notification counts:', error);
        }
    }
    
    // Display Notification Badges
    function displayNotificationBadges() {
        try {
            const counts = JSON.parse(localStorage.getItem('notification_counts') || '{}');
            const total = counts.total || 0;
            const notificationBadge = $('#dashboard-notification-badge');
            
            if (total > 0) {
                notificationBadge.text(total).show();
                // Add pulse animation
                notificationBadge.addClass('pulse');
            } else {
                notificationBadge.hide();
                notificationBadge.removeClass('pulse');
            }
            
        } catch (error) {
            console.error('❌ Error displaying notification badges:', error);
        }
    }
    
    // Load Notification Dropdown Content
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
    
    // Handle Notification Click
    function handleNotificationClick(index, type) {
        console.log(`📨 Notification clicked: ${type}, index: ${index}`);
        
        // Close dropdown
        $('#notification-dropdown').removeClass('show');
        $('#notification-bell').removeClass('active');
        
        // Redirect to appropriate page based on type
        let targetPage = 'manage_alumni.html';
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
        
        // Store target tab in session storage
        if (targetTab) {
            sessionStorage.setItem('alumni_target_tab', targetTab);
        }
        
        // Redirect to alumni management page
        window.location.href = targetPage;
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
    
    // Function to handle navigation from external pages
    function handleExternalNavigation() {
        const targetSection = sessionStorage.getItem('targetSection');
        if (targetSection) {
            console.log(`🔄 External navigation to: ${targetSection}`);
            showSection(targetSection);
            sessionStorage.removeItem('targetSection');
        }
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
                sessionStorage.setItem('admin_return_url', dashboardUrl);
                console.log(`🔗 Storing return URL: ${dashboardUrl}`);
            });
        }
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
    
    // SECTION NAVIGATION FUNCTIONALITY
    function setupSectionNavigation() {
        // Handle navigation clicks
        $('.navbar-main .nav-link[data-section]').on('click', function(e) {
            e.preventDefault();
            const targetSection = $(this).data('section');
            console.log(`🔄 Switching to section: ${targetSection}`);
            showSection(targetSection);
            
            // Update URL hash for browser back button support
            window.location.hash = targetSection;
        });
        
        // Handle overview section buttons
        $('.btn[data-section]').on('click', function(e) {
            e.preventDefault();
            const targetSection = $(this).data('section');
            console.log(`🔄 Overview navigation to: ${targetSection}`);
            showSection(targetSection);
            
            // Update URL hash for browser back button support
            window.location.hash = targetSection;
        });
        
        // Handle browser back/forward buttons
        $(window).on('hashchange', function() {
            const hash = window.location.hash.substring(1); // Remove the #
            if (hash && ['dashboard-home', 'content-management', 'user-management'].includes(hash)) {
                console.log(`🔗 Hash change detected: ${hash}`);
                showSection(hash);
            }
        });
        
        // Initialize with correct section based on URL hash or default
        const initialHash = window.location.hash.substring(1);
        if (initialHash && ['dashboard-home', 'content-management', 'user-management'].includes(initialHash)) {
            console.log(`🔗 Initializing with hash: ${initialHash}`);
            showSection(initialHash);
        } else {
            showSection('dashboard-home');
        }
    }
    
    function setupOverviewCardToggle() {
        // Handle "View Full Section" button clicks to toggle hidden overview cards
        $('.btn[data-section="content-management"]').on('click', function() {
            // Toggle visibility of hidden overview cards
            $('.additional-overview-card').fadeToggle(300);
            
            // Optional: Update button text to indicate state
            const isVisible = $('.additional-overview-card').first().is(':visible');
            const buttonText = isVisible ? 'Hide Additional Cards' : 'View Full Section';
            $(this).text(buttonText);
            
            console.log(`📊 Overview cards toggled: ${isVisible ? 'visible' : 'hidden'}`);
        });
    }
    
    function showSection(sectionId) {
        // Update navigation active state
        $('.navbar-main .nav-link').removeClass('active');
        $(`.navbar-main .nav-link[data-section="${sectionId}"]`).addClass('active');
        
        // Hide all sections
        $('.content-section').removeClass('active');
        
        // Show target section
        $(`#${sectionId}`).addClass('active');
        
        // Scroll to top of content (but maintain scrollability)
        $('html, body').animate({
            scrollTop: $('.dashboard-bg').offset().top - 20
        }, 300);
        
        console.log(`✅ Now showing section: ${sectionId}`);
    }
    
    // FUNCTION TO REMOVE RETURN TO DASHBOARD LINKS
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
    
    // Enhanced notification system for admin
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
    
    // Initialize the dashboard
    initializeDashboard();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});

