(function($) {
    'use strict';

    const ORG_OVERVIEW_URL = (window.BASE_URL || '/') + 'index.php/admin/manage/organizations/overview';
    const ORG_FALLBACK_LOGO = (window.BASE_URL || '/') + 'assets/images/ccis.png';

    let cachedData = {
        stats: {},
        organizations: [],
        activities: []
    };
    let activeFilter = 'all';

    $(document).ready(function() {
        if (!hasValidSuperadminSession()) {
            return;
        }

        updateCurrentDate();
        bindEvents();
        loadOverview();
    });

    function hasValidSuperadminSession() {
        if (!window.sessionData || !window.sessionData.isValid || !window.sessionData.user) {
            window.location.href = (window.BASE_URL || '/') + 'index.php/login';
            return false;
        }

        const allowedRoles = ['superadmin', 'faculty'];
        if (!allowedRoles.includes(String(window.sessionData.user.role || '').toLowerCase())) {
            showNotification('Access denied. Authorized staff only.', 'error');
            window.location.href = (window.BASE_URL || '/') + 'index.php/admin';
            return false;
        }

        return true;
    }

    function bindEvents() {
        $('#refreshActivities').on('click', function() {
            loadOverview(true);
        });

        $('.activity-filters .btn').on('click', function() {
            $('.activity-filters .btn').removeClass('active');
            $(this).addClass('active');

            activeFilter = String($(this).data('filter') || 'all');
            renderActivities(cachedData.activities);
        });
    }

    function loadOverview(showToast) {
        const $refreshBtn = $('#refreshActivities');
        const originalBtn = $refreshBtn.html();

        $refreshBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Refreshing');

        $.ajax({
            url: ORG_OVERVIEW_URL,
            method: 'GET',
            dataType: 'json'
        }).done(function(response) {
            if (!response || !response.success || !response.data) {
                showNotification('Failed to load organization data.', 'error');
                return;
            }

            cachedData = {
                stats: response.data.stats || {},
                organizations: Array.isArray(response.data.organizations) ? response.data.organizations : [],
                activities: Array.isArray(response.data.activities) ? response.data.activities : []
            };

            renderStats(cachedData.stats);
            renderOrganizations(cachedData.organizations);
            renderActivities(cachedData.activities);

            if (showToast) {
                showNotification('Activity log refreshed.', 'success');
            }
        }).fail(function(xhr) {
            const message = extractErrorMessage(xhr) || 'Unable to load organization overview.';
            showNotification(message, 'error');
        }).always(function() {
            $refreshBtn.prop('disabled', false).html(originalBtn);
        });
    }

    function renderStats(stats) {
        $('#totalLegionPosts').text(toInt(stats.total_legion_posts));
        $('#totalCSGuildPosts').text(toInt(stats.total_csguild_posts));
        $('#totalOrganizations').text(toInt(stats.total_organizations));
        $('#totalPosts').text(toInt(stats.total_posts));
    }

    function renderOrganizations(organizations) {
        const $container = $('#organizationsContainer');
        $container.empty();

        if (!organizations.length) {
            $container.append([
                '<div class="col-12">',
                '  <div class="empty-state">',
                '    <i class="fas fa-sitemap"></i>',
                '    <h5>No organizations found</h5>',
                '    <p>Organization data will appear here once content is posted.</p>',
                '  </div>',
                '</div>'
            ].join(''));
            return;
        }

        organizations.forEach(function(org) {
            $container.append(buildOrganizationCard(org));
        });
    }

    function buildOrganizationCard(org) {
        const slug = String(org.id || 'organization');
        const logo = sanitizeUrl(org.logo) || ORG_FALLBACK_LOGO;
        const latestAnnouncements = Array.isArray(org.announcements) ? org.announcements.slice(0, 2) : [];
        const latestHappenings = Array.isArray(org.happenings) ? org.happenings.slice(0, 1) : [];

        const announcementsHtml = latestAnnouncements.length
            ? latestAnnouncements.map(function(item) {
                return [
                    '<div class="activity-item small ' + escapeHtml(slug) + '" style="margin-bottom: 0.5rem; padding: 0.75rem;">',
                    '  <div class="activity-title" style="font-size: 0.85rem;">' + escapeHtml(item.title || 'Untitled') + '</div>',
                    '  <div class="activity-date" style="font-size: 0.7rem;">' + escapeHtml(formatDate(item.created_at || item.event_date)) + '</div>',
                    '</div>'
                ].join('');
            }).join('')
            : '<div class="empty-state" style="padding: 1rem;"><p style="font-size: 0.85rem; margin: 0;">No announcements</p></div>';

        const happeningsHtml = latestHappenings.length
            ? latestHappenings.map(function(item) {
                return [
                    '<div class="activity-item small ' + escapeHtml(slug) + '" style="margin-bottom: 0.5rem; padding: 0.75rem;">',
                    '  <div class="activity-title" style="font-size: 0.85rem;">' + escapeHtml(item.title || 'Untitled') + '</div>',
                    '  <div class="activity-date" style="font-size: 0.7rem;">' + escapeHtml(formatDate(item.created_at || item.event_date)) + '</div>',
                    '</div>'
                ].join('');
            }).join('')
            : '<div class="empty-state" style="padding: 1rem;"><p style="font-size: 0.85rem; margin: 0;">No happenings</p></div>';

        return [
            '<div class="col-md-6 col-lg-4 mb-4">',
            '  <div class="organization-card ' + escapeHtml(slug) + '-card">',
            '    <div class="organization-header">',
            '      <div class="org-logo-container">',
            '        <img src="' + escapeHtml(logo) + '" alt="' + escapeHtml(org.name || 'Organization') + ' Logo" class="org-logo" onerror="this.onerror=null;this.src=\'' + escapeHtml(ORG_FALLBACK_LOGO) + '\';">',
            '      </div>',
            '      <div class="org-info">',
            '        <h4>' + escapeHtml(org.name || 'Organization') + '</h4>',
            '        <p class="org-subtitle">' + escapeHtml(org.program || 'Organization') + '</p>',
            '        <p class="org-description">' + escapeHtml(org.description || '') + '</p>',
            '        <div class="org-stats">',
            '          <span class="badge bg-primary"><i class="fas fa-file-alt me-1"></i>' + toInt(org.post_count) + ' Posts</span>',
            '          <span class="badge bg-success"><i class="fas fa-users me-1"></i>' + toInt(org.member_count) + ' Members</span>',
            '          <span class="badge bg-info"><i class="fas fa-user-tie me-1"></i>' + toInt(org.adviser_count) + ' Advisers</span>',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="organization-content">',
            '      <h5><i class="fas fa-bullhorn me-2"></i>Recent Announcements</h5>',
            '      <div class="activity-log" style="max-height: 120px;">' + announcementsHtml + '</div>',
            '      <h5 class="mt-3"><i class="fas fa-images me-2"></i>Recent Happenings</h5>',
            '      <div class="activity-log" style="max-height: 80px;">' + happeningsHtml + '</div>',
            '    </div>',
            '    <div class="organization-footer">',
            '      <small class="text-muted">Updated: ' + escapeHtml(formatLastUpdate(org.last_activity)) + '</small>',
            '      <div class="org-actions">',
            buildOrgLinkButton(slug),
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function buildOrgLinkButton(slug) {
        const lower = String(slug || '').toLowerCase();
        let href = (window.BASE_URL || '/') + 'index.php/organization';

        if (lower === 'the_legion') {
            href = (window.BASE_URL || '/') + 'index.php/organization#the-legion';
        } else if (lower === 'csguild' || lower === 'cs_guild') {
            href = (window.BASE_URL || '/') + 'index.php/organization#cs-guild';
        }

        return '<a class="btn btn-sm btn-outline-primary" href="' + escapeHtml(href) + '"><i class="fas fa-external-link-alt me-1"></i>Open Public Page</a>';
    }

    function renderActivities(activities) {
        const $activityLog = $('#recentActivityLog');
        $activityLog.empty();

        const filtered = activities.filter(function(item) {
            if (activeFilter === 'all') {
                return true;
            }

            const orgSlug = String(item.organization_slug || '').toLowerCase();
            if (activeFilter === 'legion') {
                return orgSlug === 'the_legion';
            }
            if (activeFilter === 'csguild') {
                return orgSlug === 'csguild' || orgSlug === 'cs_guild';
            }
            return true;
        });

        if (!filtered.length) {
            $activityLog.append([
                '<div class="empty-state">',
                '  <i class="fas fa-history"></i>',
                '  <h5>No activity found</h5>',
                '  <p>No records match the selected organization filter.</p>',
                '</div>'
            ].join(''));
            return;
        }

        filtered.forEach(function(activity) {
            $activityLog.append(buildActivityItem(activity));
        });
    }

    function buildActivityItem(activity) {
        const orgSlug = String(activity.organization_slug || 'organization').toLowerCase();
        const type = String(activity.activity_type || '').toLowerCase();
        const title = escapeHtml(activity.title || 'Untitled');
        const body = escapeHtml(activity.body || '');
        const orgName = escapeHtml(activity.organization_name || 'Organization');
        const postedBy = escapeHtml(activity.posted_by || 'Organization Admin');
        const createdAt = escapeHtml(formatDateTime(activity.created_at));

        const isAnnouncement = type === 'announcement';
        const iconClass = isAnnouncement ? 'fa-bullhorn' : 'fa-images';
        const typeText = isAnnouncement ? 'Announcement' : 'Happening';

        return [
            '<div class="activity-item ' + escapeHtml(orgSlug) + '" data-org="' + escapeHtml(orgSlug) + '" data-type="' + escapeHtml(type) + '">',
            '  <div class="activity-header">',
            '    <h6 class="activity-title"><i class="fas ' + iconClass + ' me-1"></i>' + title + '</h6>',
            '    <div class="activity-meta">',
            '      <span class="activity-org ' + escapeHtml(orgSlug) + '">' + orgName + '</span>',
            '      <span class="activity-type">' + typeText + '</span>',
            '      <span class="activity-date">' + createdAt + '</span>',
            '    </div>',
            '  </div>',
            '  <div class="activity-content">' + body + '</div>',
            '  <div class="activity-admin">' + postedBy + '</div>',
            '</div>'
        ].join('');
    }

    function toInt(value) {
        const n = parseInt(value, 10);
        return Number.isNaN(n) ? 0 : n;
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'Unknown date';
        }

        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return 'Unknown date';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatDateTime(dateValue) {
        if (!dateValue) {
            return 'Unknown date';
        }

        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return 'Unknown date';
        }

        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatLastUpdate(dateValue) {
        if (!dateValue) {
            return 'Never';
        }

        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return 'Never';
        }

        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMinutes < 1) {
            return 'Just now';
        }
        if (diffMinutes < 60) {
            return diffMinutes + 'm ago';
        }
        if (diffHours < 24) {
            return diffHours + 'h ago';
        }

        return formatDateTime(dateValue);
    }

    function updateCurrentDate() {
        const now = new Date();
        $('#current-date').text(now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }));
    }

    function sanitizeUrl(url) {
        if (!url) {
            return '';
        }

        const value = String(url).trim();
        if (!value) {
            return '';
        }

        if (value.indexOf('javascript:') === 0) {
            return '';
        }

        return value;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function extractErrorMessage(xhr) {
        if (!xhr) {
            return '';
        }

        if (xhr.responseJSON && xhr.responseJSON.message) {
            return xhr.responseJSON.message;
        }

        if (xhr.responseText) {
            try {
                const parsed = JSON.parse(xhr.responseText);
                return parsed.message || '';
            } catch (e) {
                return '';
            }
        }

        return '';
    }

    function showNotification(message, type) {
        const style = type || 'info';

        if ($('#notificationContainer').length === 0) {
            $('body').append('<div id="notificationContainer"></div>');
        }

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };

        const id = 'notif-' + Date.now();
        const html = [
            '<div class="notification ' + escapeHtml(style) + '" id="' + escapeHtml(id) + '">',
            '  <div class="notification-icon"><i class="fas ' + (iconMap[style] || iconMap.info) + '"></i></div>',
            '  <div class="notification-content"><p style="margin:0;">' + escapeHtml(message) + '</p></div>',
            '  <button type="button" class="notification-close" data-id="' + escapeHtml(id) + '"><i class="fas fa-times"></i></button>',
            '</div>'
        ].join('');

        $('#notificationContainer').append(html);

        $('#' + id + ' .notification-close').on('click', function() {
            closeNotification(id);
        });

        setTimeout(function() {
            closeNotification(id);
        }, 3500);
    }

    function closeNotification(id) {
        const $el = $('#' + id);
        if (!$el.length) {
            return;
        }

        $el.fadeOut(200, function() {
            $(this).remove();
        });
    }

})(jQuery);
