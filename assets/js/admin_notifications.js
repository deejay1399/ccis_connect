$(document).ready(function() {
    const notificationBell = $('#notification-bell');
    const notificationDropdown = $('#notification-dropdown');
    const notificationList = $('#notification-list');
    const notificationBadge = $('#dashboard-notification-badge');

    if (!notificationBell.length || !notificationDropdown.length || !notificationList.length) {
        return;
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

    function isPending(item) {
        const status = normalizeStatus(item.status);
        const isUnread = Number(item.notification_read || 0) !== 1;
        return (status === '' || status === 'pending') && isUnread;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
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

    function updateBadge(total) {
        const safeTotal = Number(total) || 0;
        if (safeTotal > 0) {
            notificationBadge.text(safeTotal).show().addClass('pulse');
            return;
        }
        notificationBadge.hide().removeClass('pulse');
    }

    async function markSingleNotificationAsRead(notification) {
        const endpoint = NOTIFICATION_STATUS_API[notification.kind];
        if (!endpoint || !notification.id) {
            return false;
        }

        const payload = {
            id: notification.id,
            status: 'read'
        };
        if (notification.kind === 'mentor' && notification.source) {
            payload.source = notification.source;
        }

        try {
            const response = await apiPost(endpoint, payload);
            return !!(response && response.success);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            return false;
        }
    }

    async function loadNotificationCounts() {
        try {
            const data = await fetchNotificationData();
            const notifications = buildNotificationItems(data);
            updateBadge(notifications.length);
        } catch (error) {
            console.error('Failed to load notification counts:', error);
        }
    }

    async function loadNotificationDropdown() {
        try {
            const data = await fetchNotificationData();
            latestNotifications = buildNotificationItems(data);
            updateBadge(latestNotifications.length);

            if (latestNotifications.length === 0) {
                notificationList.html(`
                    <div class="notification-empty">
                        <i class="fas fa-bell-slash"></i>
                        <p>No new notifications</p>
                    </div>
                `);
                return;
            }

            const html = latestNotifications.slice(0, 8).map((item, index) => `
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

            notificationList.html(html);
        } catch (error) {
            console.error('Failed to load notification dropdown:', error);
            notificationList.html(`
                <div class="notification-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading notifications</p>
                </div>
            `);
        }
    }

    async function markAllNotificationsAsRead() {
        const data = await fetchNotificationData();
        const pending = buildNotificationItems(data);
        if (!pending.length) {
            return;
        }
        await Promise.all(pending.map(item => markSingleNotificationAsRead(item)));
        await loadNotificationDropdown();
    }

    notificationBell.off('click.adminNotifications').on('click.adminNotifications', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (notificationDropdown.hasClass('show')) {
            notificationDropdown.removeClass('show');
            notificationBell.removeClass('active');
            return;
        }

        notificationDropdown.addClass('show');
        notificationBell.addClass('active');
        await loadNotificationDropdown();
    });

    $(document).off('click.adminNotifications').on('click.adminNotifications', function(e) {
        if (!$(e.target).closest('#notification-wrapper').length) {
            notificationDropdown.removeClass('show');
            notificationBell.removeClass('active');
        }
    });

    notificationList.off('click.adminNotifications').on('click.adminNotifications', '.notification-item', async function(e) {
        if ($(e.target).closest('.notification-mark-read').length) {
            return;
        }
        const index = Number($(this).attr('data-index'));
        const notification = latestNotifications[index];
        if (!notification) {
            return;
        }

        await markSingleNotificationAsRead(notification);

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
    });

    notificationList.off('click.adminNotificationsMark', '.notification-mark-read').on('click.adminNotificationsMark', '.notification-mark-read', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        const item = $(this).closest('.notification-item');
        const index = Number(item.attr('data-index'));
        const notification = latestNotifications[index];
        if (!notification) {
            return;
        }
        await markSingleNotificationAsRead(notification);
        await loadNotificationDropdown();
    });

    $(document).off('click.adminNotificationsMarkAll', '#mark-all-notifications').on('click.adminNotificationsMarkAll', '#mark-all-notifications', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        await markAllNotificationsAsRead();
    });

    loadNotificationCounts();
    setInterval(loadNotificationCounts, 30000);
});
