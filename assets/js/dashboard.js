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
    
    const NOTIFICATION_API = {
        mentor: 'admin/manage/alumni/mentor_requests',
        chatbot: 'admin/manage/alumni/chatbot_inquiries',
        connection: 'admin/manage/alumni/connection_requests',
        giveback: 'admin/manage/alumni/giveback'
    };
    const NOTIFICATION_STATUS_API = {
        mentor: 'admin/manage/alumni/mentor_status',
        chatbot: 'admin/manage/alumni/chatbot_status',
        connection: 'admin/manage/alumni/connection_status',
        giveback: 'admin/manage/alumni/giveback_status'
    };
    let latestNotifications = [];

    function getBaseUrl() {
        return window.baseUrl || window.BASE_URL || '/ccis_connect/';
    }

    function apiGet(path) {
        return $.getJSON(getBaseUrl() + path);
    }

    function apiPost(path, payload) {
        return $.ajax({
            url: getBaseUrl() + path,
            type: 'POST',
            data: payload,
            dataType: 'json'
        });
    }

    function normalizeStatus(status) {
        return String(status || '').trim().toLowerCase();
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function isPending(item) {
        const status = normalizeStatus(item.status);
        const isUnread = Number(item.notification_read || 0) !== 1;
        return (status === '' || status === 'pending') && isUnread;
    }

    function formatRelativeTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'just now';
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.max(0, Math.floor(diffMs / 60000));
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    async function fetchNotificationData() {
        const fallback = { success: false, data: [] };
        const [mentorRes, chatbotRes, connectionRes, givebackRes] = await Promise.all([
            apiGet(NOTIFICATION_API.mentor).catch(() => fallback),
            apiGet(NOTIFICATION_API.chatbot).catch(() => fallback),
            apiGet(NOTIFICATION_API.connection).catch(() => fallback),
            apiGet(NOTIFICATION_API.giveback).catch(() => fallback)
        ]);

        return {
            mentor: mentorRes.success ? (mentorRes.data || []) : [],
            chatbot: chatbotRes.success ? (chatbotRes.data || []) : [],
            connection: connectionRes.success ? (connectionRes.data || []) : [],
            giveback: givebackRes.success ? (givebackRes.data || []) : []
        };
    }

    function buildNotificationItems(data) {
        const mentorItems = (data.mentor || [])
            .filter(isPending)
            .map(row => ({
                kind: 'mentor',
                id: row.id,
                source: row.source || 'mentor_requests',
                tab: 'mentor-tab',
                icon: 'fa-handshake',
                text: `${row.name || 'Someone'} submitted a mentor request`,
                createdAt: row.created_at
            }));

        const chatbotItems = (data.chatbot || [])
            .filter(isPending)
            .map(row => {
                const question = String(row.question || '');
                const shortQuestion = question.length > 40 ? `${question.substring(0, 40)}...` : question;
                return {
                    kind: 'chatbot',
                    id: row.id,
                    tab: 'chatbot-tab',
                    icon: 'fa-robot',
                    text: `New chatbot inquiry: "${shortQuestion}"`,
                    createdAt: row.created_at || row.inquiry_date
                };
            });

        const connectionItems = (data.connection || [])
            .filter(isPending)
            .map(row => ({
                kind: 'connection',
                id: row.id,
                tab: 'connection-tab',
                icon: 'fa-user-friends',
                text: `${row.from_name || 'Someone'} wants to connect with ${row.to_name || 'an alumni'}`,
                createdAt: row.created_at || row.request_date
            }));

        const givebackItems = (data.giveback || [])
            .filter(isPending)
            .map(row => ({
                kind: 'giveback',
                id: row.id,
                tab: 'giveback-tab',
                icon: 'fa-donate',
                text: `${row.author || 'Someone'} submitted a Give Back form (${row.title || 'submission'})`,
                createdAt: row.created_at || row.submission_date
            }));

        return [...mentorItems, ...chatbotItems, ...connectionItems, ...givebackItems]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    // Setup Notification Bell Functionality
    function setupNotificationBell() {
        const notificationBell = $("#notification-bell");
        const notificationDropdown = $("#notification-dropdown");
        const notificationList = $("#notification-list");

        if (!notificationBell.length || !notificationDropdown.length || !notificationList.length) {
            console.warn('Notification UI not found on this page; skipping bell setup.');
            return;
        }

        loadNotificationCounts();
        loadNotificationDropdown();

        notificationBell.off("click").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (notificationDropdown.hasClass("show")) {
                notificationDropdown.removeClass("show");
                notificationBell.removeClass("active");
                return;
            }

            notificationDropdown.addClass("show");
            notificationBell.addClass("active");
            loadNotificationDropdown();
        });

        $(document).off("click.notification").on("click.notification", function(e) {
            if (!$(e.target).closest("#notification-wrapper").length) {
                notificationDropdown.removeClass("show");
                notificationBell.removeClass("active");
            }
        });

        $(document).off("click", "#mark-all-notifications").on("click", "#mark-all-notifications", function(e) {
            e.preventDefault();
            e.stopPropagation();
            markAllNotificationsAsRead();
        });

        setInterval(function() {
            loadNotificationCounts();
            if (notificationDropdown.hasClass("show")) {
                loadNotificationDropdown();
            }
        }, 30000);
    }

    // Load Notification Counts for Dashboard Stats
    async function loadNotificationCounts() {
        try {
            const data = await fetchNotificationData();
            const notifications = buildNotificationItems(data);

            const mentorTotal = (data.mentor || []).length;
            const mentorNew = (data.mentor || []).filter(isPending).length;
            const chatbotTotal = (data.chatbot || []).length;
            const chatbotNew = (data.chatbot || []).filter(isPending).length;
            const connectionTotal = (data.connection || []).length;
            const connectionNew = (data.connection || []).filter(isPending).length;

            $('#stat-mentor-count').text(mentorTotal);
            $('#stat-mentor-new').text(`${mentorNew} new`);
            $('#stat-chatbot-count').text(chatbotTotal);
            $('#stat-chatbot-new').text(`${chatbotNew} new`);
            $('#stat-connection-count').text(connectionTotal);
            $('#stat-connection-new').text(`${connectionNew} new`);

            displayNotificationBadges(notifications.length);
        } catch (error) {
            console.error('❌ Error loading notification counts:', error);
        }
    }

    // Display Notification Badges
    function displayNotificationBadges(total) {
        const notificationBadge = $('#dashboard-notification-badge');
        const safeTotal = Number(total) || 0;
        if (safeTotal > 0) {
            notificationBadge.text(safeTotal).show().addClass('pulse');
            return;
        }
        notificationBadge.hide().removeClass('pulse');
    }

    // Load Notification Dropdown Content
    async function loadNotificationDropdown() {
        const notificationList = $('#notification-list');
        if (!notificationList.length) return;

        try {
            const data = await fetchNotificationData();
            latestNotifications = buildNotificationItems(data);

            if (latestNotifications.length === 0) {
                notificationList.html(`
                    <div class="notification-empty">
                        <i class="fas fa-bell-slash"></i>
                        <p>No new notifications</p>
                    </div>
                `);
                return;
            }

            const notificationsHtml = latestNotifications.slice(0, 8).map((item, index) => `
                <div class="notification-item" data-index="${index}">
                    <div class="notification-icon">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <p class="notification-text">${escapeHtml(item.text)}</p>
                        <small class="notification-time">${formatRelativeTime(item.createdAt)}</small>
                    </div>
                    <button class="notification-mark-read" title="Mark as read">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            `).join('');

            notificationList.html(notificationsHtml);

            notificationList.off('click').on('click', '.notification-item', function(e) {
                if ($(e.target).closest('.notification-mark-read').length) return;
                const index = Number($(this).attr('data-index'));
                const notification = latestNotifications[index];
                if (notification) {
                    handleNotificationClick(notification);
                }
            });

            notificationList.off('click', '.notification-mark-read').on('click', '.notification-mark-read', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                const item = $(this).closest('.notification-item');
                const index = Number(item.attr('data-index'));
                const notification = latestNotifications[index];
                if (!notification) return;

                await markSingleNotificationAsRead(notification);
                item.fadeOut(250, function() {
                    $(this).remove();
                });
                await loadNotificationCounts();
                await loadNotificationDropdown();
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
    async function handleNotificationClick(notification) {
        console.log(`📨 Notification clicked: ${notification.kind}, id: ${notification.id}`);

        await markSingleNotificationAsRead(notification);
        $('#notification-dropdown').removeClass('show');
        $('#notification-bell').removeClass('active');

        const base = window.BASE_URL || window.baseUrl || '/';
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        const params = new URLSearchParams({
            tab: notification.tab || 'mentor-tab',
            notif_kind: notification.kind || '',
            notif_id: String(notification.id || '')
        });
        if (notification.source) {
            params.set('notif_source', notification.source);
        }
        window.location.href = `${normalizedBase}index.php/admin/content/alumni?${params.toString()}`;
    }

    // Mark All Notifications as Read
    async function markAllNotificationsAsRead() {
        try {
            const data = await fetchNotificationData();
            const allPending = buildNotificationItems(data);
            if (allPending.length === 0) {
                showNotification('No pending notifications to mark', 'info');
                return;
            }

            await Promise.all(allPending.map(item => markSingleNotificationAsRead(item)));
            showNotification('All notifications marked as read', 'success');
            await loadNotificationCounts();
            await loadNotificationDropdown();
        } catch (error) {
            console.error('❌ Error marking all notifications as read:', error);
            showNotification('Error marking notifications as read', 'error');
        }
    }

    // Mark Single Notification as Read
    async function markSingleNotificationAsRead(notification) {
        try {
            const endpoint = NOTIFICATION_STATUS_API[notification.kind];
            if (!endpoint || !notification.id) return false;

            const payload = {
                id: notification.id,
                status: 'read'
            };
            if (notification.kind === 'mentor' && notification.source) {
                payload.source = notification.source;
            }

            const response = await apiPost(endpoint, payload);
            return !!(response && response.success);
        } catch (error) {
            console.error('❌ Error marking single notification as read:', error);
            return false;
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
            const session = window.checkUserSession ? window.checkUserSession() : null;
            const role = session && session.isValid && session.user ? session.user.role : null;
            const base = window.BASE_URL || window.baseUrl || '/';
            const dashboardUrl = (role === 'faculty' || role === 'superadmin')
                ? base + 'index.php/admin/dashboard'
                : base + 'index.php/admin/dashboard';
                                
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

