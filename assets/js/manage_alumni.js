$(document).ready(function () {
    const baseUrl = window.baseUrl || '/ccis_connect/';

    let activeSubmissionContext = null;

    function showNotification(type, message) {
        const notificationModal = `
            <div class="modal fade" id="notificationModal" tabindex="-1" role="alertdialog" aria-modal="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-5">
                            <div class="mb-3">
                                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} fa-4x" style="color: ${type === 'success' ? '#28a745' : '#dc3545'}"></i>
                            </div>
                            <h5 class="mb-2">${type === 'success' ? 'Success!' : 'Error'}</h5>
                            <p class="text-muted mb-4">${message}</p>
                            <button type="button" class="btn btn-${type === 'success' ? 'success' : 'danger'}" data-bs-dismiss="modal" autofocus>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#notificationModal').remove();
        $('body').append(notificationModal);
        new bootstrap.Modal(document.getElementById('notificationModal')).show();

        document.getElementById('notificationModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        }, { once: true });
    }

    function formatDate(value) {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function setTabBadge(selector, count) {
        const badge = $(selector);
        if (!badge.length) return;
        const safeCount = Number.isFinite(Number(count)) ? Number(count) : 0;
        badge.text(safeCount);
        badge.toggle(safeCount > 0);
    }

    function isUnreadNotification(row) {
        const status = String(row?.status || '').trim().toLowerCase();
        const isPending = status === '' || status === 'pending';
        const isUnread = Number(row?.notification_read || 0) !== 1;
        return isPending && isUnread;
    }

    function statusBadge(status) {
        const normalized = (status || '').toLowerCase();
        let cls = 'secondary';
        if (normalized === 'approved') cls = 'success';
        if (normalized === 'pending') cls = 'warning';
        if (normalized === 'rejected' || normalized === 'hidden' || normalized === 'disapproved') cls = 'danger';
        return `<span class="badge bg-${cls}">${status || 'Pending'}</span>`;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function toTitleCase(value) {
        const input = String(value || '').toLowerCase();
        return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
    }

    function buildGmailLink(to, subject, body) {
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function formatDetailRows(details) {
        return Object.entries(details)
            .map(([label, value]) => `<tr><th style="width: 35%;">${escapeHtml(label)}</th><td>${escapeHtml(value || '-')}</td></tr>`)
            .join('');
    }

    function openSubmissionModal(context) {
        activeSubmissionContext = context;
        const currentStatus = String(context.currentStatus || '').toLowerCase();
        const isPending = currentStatus === '' || currentStatus === 'pending';

        $('#submissionDetailsModalLabel').text(context.title);
        $('#submission-details-content').html(`
            <div class="table-responsive">
                <table class="table table-sm table-bordered align-middle mb-0">
                    <tbody>
                        ${formatDetailRows(context.details)}
                    </tbody>
                </table>
            </div>
        `);

        if (isPending) {
            $('#submission-approve-btn')
                .text('Approve & Open Gmail')
                .removeClass('d-none');
            $('#submission-disapprove-btn')
                .text('Disapprove & Open Gmail')
                .removeClass('d-none');
        } else {
            $('#submission-approve-btn').addClass('d-none');
            $('#submission-disapprove-btn').addClass('d-none');
        }

        new bootstrap.Modal(document.getElementById('submissionDetailsModal')).show();
    }

    function performStatusAndCompose(action) {
        if (!activeSubmissionContext) {
            return;
        }

        const context = activeSubmissionContext;
        const recordId = context.id;
        const status = action === 'approve' ? (context.approveStatus || 'approved') : (context.disapproveStatus || 'rejected');

        if (!context.recipientEmail) {
            showNotification('error', 'No recipient email found for this submission');
            return;
        }

        const payload = { id: recordId, status };
        if (context.source) {
            payload.source = context.source;
        }

        $.post(baseUrl + context.statusPath, payload, function(response) {
            if (!response.success) {
                showNotification('error', response.message || 'Failed to update status');
                return;
            }

            const normalizedStatus = status.toLowerCase();
            const readableStatus = toTitleCase(normalizedStatus);
            const subject = `[CCIS Alumni] ${context.emailType} ${readableStatus}`;
            const body = [
                `Hello ${context.recipientName || 'Alumni'},`,
                '',
                `Your ${context.emailType.toLowerCase()} has been marked as ${normalizedStatus} by the admin.`,
                '',
                'Submission details:',
                ...Object.entries(context.details).map(([label, value]) => `${label}: ${value || '-'}`),
                '',
                'Regards,',
                'CCIS Admin'
            ].join('\n');

            const modalEl = document.getElementById('submissionDetailsModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            context.reloadFn();

            const gmailUrl = buildGmailLink(context.recipientEmail, subject, body);
            window.open(gmailUrl, '_blank', 'noopener');

            showNotification('success', `Status updated to ${readableStatus}. Gmail compose opened.`);
        }, 'json').fail(function(xhr) {
            const msg = xhr.responseJSON?.message || 'Failed to update status';
            showNotification('error', msg);
        });
    }

    // ==================== LOADERS ====================
    function loadMentorRequests() {
        $.getJSON(baseUrl + 'admin/manage/alumni/mentor_requests', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#mentor-table-body');
            body.empty();
            setTabBadge('#mentor-badge', data.filter(isUnreadNotification).length);

            if (data.length === 0) {
                $('#no-mentor-data').show();
                return;
            }
            $('#no-mentor-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.name)}</td>
                        <td>${escapeHtml(row.batch || '-')}</td>
                        <td>${escapeHtml(row.email)}</td>
                        <td>${escapeHtml(row.expertise)}</td>
                        <td>${formatDate(row.created_at || row.request_date)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-view-submission" data-type="mentor" data-payload="${encodeURIComponent(JSON.stringify(row))}">View</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadChatbotInquiries() {
        $.getJSON(baseUrl + 'admin/manage/alumni/chatbot_inquiries', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#chatbot-table-body');
            body.empty();
            setTabBadge('#chatbot-tab-badge', data.filter(isUnreadNotification).length);

            if (data.length === 0) {
                $('#no-chatbot-data').show();
                return;
            }
            $('#no-chatbot-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.name)}</td>
                        <td>${escapeHtml(row.question)}</td>
                        <td>${escapeHtml(row.category)}</td>
                        <td>${formatDate(row.inquiry_date)}</td>
                    </tr>
                `);
            });
        });
    }

    function loadConnectionRequests() {
        $.getJSON(baseUrl + 'admin/manage/alumni/connection_requests', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#connection-table-body');
            body.empty();
            setTabBadge('#connection-badge', data.filter(isUnreadNotification).length);

            if (data.length === 0) {
                $('#no-connection-data').show();
                return;
            }
            $('#no-connection-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.from_name)}</td>
                        <td>${escapeHtml(row.from_email)}</td>
                        <td>${escapeHtml(row.to_name)}</td>
                        <td>${formatDate(row.request_date)}</td>
                        <td>${statusBadge(row.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-view-submission" data-type="connection" data-payload="${encodeURIComponent(JSON.stringify(row))}">View</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadUpdates() {
        $.getJSON(baseUrl + 'admin/manage/alumni/updates', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#updates-table-body');
            body.empty();

            if (data.length === 0) {
                $('#no-updates-data').show();
                return;
            }
            $('#no-updates-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.author)}</td>
                        <td>${escapeHtml(row.content)}</td>
                        <td>${formatDate(row.update_date)}</td>
                        <td>${statusBadge(row.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-view-submission" data-type="update" data-payload="${encodeURIComponent(JSON.stringify(row))}">View</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadGiveback() {
        $.getJSON(baseUrl + 'admin/manage/alumni/giveback', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#giveback-table-body');
            body.empty();
            setTabBadge('#giveback-badge', data.filter(isUnreadNotification).length);

            if (data.length === 0) {
                $('#no-giveback-data').show();
                return;
            }
            $('#no-giveback-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.author)}</td>
                        <td>${escapeHtml(row.title)}</td>
                        <td>${formatDate(row.submission_date)}</td>
                        <td>${statusBadge(row.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-view-submission" data-type="giveback" data-payload="${encodeURIComponent(JSON.stringify(row))}">View</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadFeatured() {
        $.getJSON(baseUrl + 'admin/manage/alumni/featured', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const grid = $('#featured-alumni-grid');
            grid.empty();

            if (data.length === 0) {
                $('#no-featured-data').show();
                return;
            }
            $('#no-featured-data').hide();

            data.forEach(row => {
                const photoHtml = row.photo
                    ? `<div class="mb-2"><img src="${baseUrl + row.photo}" alt="${escapeHtml(row.name)}" style="width:100%;height:180px;object-fit:cover;border-radius:6px;"></div>`
                    : '';
                grid.append(`
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                ${photoHtml}
                                <h5 class="card-title">${escapeHtml(row.name)}</h5>
                                <p class="text-muted mb-2">${escapeHtml(row.position)}</p>
                                <p class="card-text">${escapeHtml(row.bio)}</p>
                            </div>
                            <div class="card-footer text-end">
                                <button class="btn btn-sm btn-outline-danger btn-delete-featured" data-id="${row.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        });
    }

    function loadDirectory() {
        $.getJSON(baseUrl + 'admin/manage/alumni/directory', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#directory-table-body');
            body.empty();

            if (data.length === 0) {
                $('#no-directory-data').show();
                return;
            }
            $('#no-directory-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${escapeHtml(row.name)}</td>
                        <td>${escapeHtml(row.batch)}</td>
                        <td>${escapeHtml(row.email)}</td>
                        <td>${escapeHtml(row.phone)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger btn-delete-directory" data-id="${row.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadEvents() {
        $.getJSON(baseUrl + 'admin/manage/alumni/events', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const grid = $('#events-grid');
            grid.empty();

            if (data.length === 0) {
                grid.html('<p class="text-muted text-center">No alumni events yet</p>');
                return;
            }

            data.forEach(row => {
                const photoHtml = row.photo
                    ? `<div class="mb-2"><img src="${baseUrl + row.photo}" alt="${escapeHtml(row.name)}" style="width:100%;height:180px;object-fit:cover;border-radius:6px;"></div>`
                    : '';
                grid.append(`
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                ${photoHtml}
                                <h5 class="card-title">${escapeHtml(row.name)}</h5>
                                <p class="text-muted mb-1">${formatDate(row.event_date)} | ${escapeHtml(row.location)}</p>
                                <p class="card-text">${escapeHtml(row.description)}</p>
                            </div>
                            <div class="card-footer text-end">
                                <button class="btn btn-sm btn-outline-danger btn-delete-event" data-id="${row.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        });
    }

    function activateRequestedTab() {
        const params = new URLSearchParams(window.location.search);
        const requestedTabId = (params.get('tab') || window.location.hash.replace('#', '') || '').trim();
        if (!requestedTabId) return;

        const tabButton = document.getElementById(requestedTabId);
        if (!tabButton) return;

        const tabInstance = bootstrap.Tab.getOrCreateInstance(tabButton);
        tabInstance.show();

        const tabsContainer = document.getElementById('alumniTabs');
        if (tabsContainer) {
            tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function openSubmissionByType(type, row) {
        const commonDetails = {
            'Status': row.status || 'pending',
            'Submitted': formatDate(row.created_at || row.request_date || row.update_date || row.submission_date)
        };

        if (type === 'mentor') {
            openSubmissionModal({
                id: row.id,
                title: 'Mentor Request Details',
                emailType: 'Mentor Request',
                recipientEmail: row.email,
                recipientName: row.name,
                source: row.source || 'mentor_requests',
                currentStatus: row.status,
                statusPath: 'admin/manage/alumni/mentor_status',
                reloadFn: loadMentorRequests,
                approveStatus: 'approved',
                disapproveStatus: 'rejected',
                details: {
                    'Name': row.name,
                    'Email': row.email,
                    'Expertise': row.expertise,
                    ...commonDetails
                }
            });
            return true;
        }

        if (type === 'connection') {
            openSubmissionModal({
                id: row.id,
                title: 'Connection Request Details',
                emailType: 'Connection Request',
                recipientEmail: row.from_email,
                recipientName: row.from_name,
                currentStatus: row.status,
                statusPath: 'admin/manage/alumni/connection_status',
                reloadFn: loadConnectionRequests,
                approveStatus: 'approved',
                disapproveStatus: 'rejected',
                details: {
                    'From Name': row.from_name,
                    'From Email': row.from_email,
                    'To Alumni': row.to_name,
                    'Purpose': row.purpose,
                    'Message': row.message,
                    'Batch': row.batch,
                    'Request Date': formatDate(row.request_date),
                    ...commonDetails
                }
            });
            return true;
        }

        if (type === 'update') {
            openSubmissionModal({
                id: row.id,
                title: 'Alumni Update Details',
                emailType: 'Alumni Update',
                recipientEmail: row.email,
                recipientName: row.author,
                currentStatus: row.status,
                statusPath: 'admin/manage/alumni/update_status',
                reloadFn: loadUpdates,
                approveStatus: 'approved',
                disapproveStatus: 'hidden',
                details: {
                    'Author': row.author,
                    'Email': row.email,
                    'Batch': row.batch,
                    'Program': row.program,
                    'Position': row.position,
                    'Company': row.company,
                    'Update': row.content,
                    'Mentor': row.giveback_mentor ? 'Yes' : 'No',
                    'Speaker': row.giveback_speaker ? 'Yes' : 'No',
                    'Internship': row.giveback_internship ? 'Yes' : 'No',
                    'Donation': row.giveback_donation ? 'Yes' : 'No',
                    'Update Date': formatDate(row.update_date),
                    ...commonDetails
                }
            });
            return true;
        }

        if (type === 'giveback') {
            openSubmissionModal({
                id: row.id,
                title: 'Give Back Submission Details',
                emailType: 'Give Back Submission',
                recipientEmail: row.email,
                recipientName: row.author,
                currentStatus: row.status,
                statusPath: 'admin/manage/alumni/giveback_status',
                reloadFn: loadGiveback,
                approveStatus: 'approved',
                disapproveStatus: 'rejected',
                details: {
                    'Name': row.author,
                    'Email': row.email,
                    'Batch': row.batch,
                    'Type': row.title,
                    'Details': row.description,
                    'Submission Date': formatDate(row.submission_date),
                    ...commonDetails
                }
            });
            return true;
        }

        return false;
    }

    function autoOpenRequestedSubmission() {
        const params = new URLSearchParams(window.location.search);
        const kind = (params.get('notif_kind') || '').trim().toLowerCase();
        const id = Number(params.get('notif_id'));
        const source = (params.get('notif_source') || '').trim().toLowerCase();

        if (!kind || !id) return;

        const endpointByKind = {
            mentor: 'admin/manage/alumni/mentor_requests',
            connection: 'admin/manage/alumni/connection_requests',
            giveback: 'admin/manage/alumni/giveback',
            update: 'admin/manage/alumni/updates'
        };

        const endpoint = endpointByKind[kind];
        if (!endpoint) return;

        $.getJSON(baseUrl + endpoint, function(response) {
            if (!response.success) return;
            const rows = response.data || [];
            const row = rows.find(item => {
                const matchesId = Number(item.id) === id;
                if (!matchesId) return false;
                if (kind === 'mentor' && source) {
                    return String(item.source || '').toLowerCase() === source;
                }
                return true;
            });

            if (!row) return;
            openSubmissionByType(kind, row);

            // Prevent reopening modal on page refresh.
            params.delete('notif_kind');
            params.delete('notif_id');
            params.delete('notif_source');
            const nextQuery = params.toString();
            const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash || ''}`;
            window.history.replaceState({}, document.title, nextUrl);
        });
    }

    // ==================== ACTIONS ====================
    $(document).on('click', '.btn-view-submission', function () {
        const type = $(this).data('type');
        const payload = $(this).attr('data-payload') || '%7B%7D';
        let row = {};

        try {
            row = JSON.parse(decodeURIComponent(payload));
        } catch (e) {
            showNotification('error', 'Failed to read submission details');
            return;
        }

        openSubmissionByType(type, row);
    });

    $('#submission-approve-btn').on('click', function() {
        performStatusAndCompose('approve');
    });

    $('#submission-disapprove-btn').on('click', function() {
        performStatusAndCompose('disapprove');
    });

    $(document).on('submit', '#addFeaturedForm', function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', $('#featuredName').val().trim());
        formData.append('position', $('#featuredPosition').val().trim());
        formData.append('bio', $('#featuredBio').val().trim());
        const photoFile = $('#featuredPhoto')[0].files[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        $.ajax({
            url: baseUrl + 'admin/manage/alumni/featured/create',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#addFeaturedModal').modal('hide');
                    $('#addFeaturedForm')[0].reset();
                    loadFeatured();
                    showNotification('success', 'Featured alumni added');
                } else {
                    showNotification('error', response.message || 'Failed to add featured alumni');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to add featured alumni';
                showNotification('error', msg);
            }
        });
    });

    $(document).on('click', '.btn-delete-featured', function () {
        const id = $(this).data('id');
        if (!confirm('Delete this featured alumni?')) return;

        $.post(baseUrl + 'admin/manage/alumni/featured/delete', { id }, function(response) {
            if (response.success) {
                loadFeatured();
            } else {
                showNotification('error', response.message || 'Failed to delete featured alumni');
            }
        }, 'json');
    });

    $(document).on('submit', '#addDirectoryForm', function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', $('#dirName').val().trim());
        formData.append('batch', $('#dirBatch').val().trim());
        formData.append('email', $('#dirEmail').val().trim());
        formData.append('phone', $('#dirPhone').val().trim());
        const photoFile = $('#dirPhoto')[0].files[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        $.ajax({
            url: baseUrl + 'admin/manage/alumni/directory/create',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#addDirectoryModal').modal('hide');
                    $('#addDirectoryForm')[0].reset();
                    loadDirectory();
                    showNotification('success', 'Directory entry added');
                } else {
                    showNotification('error', response.message || 'Failed to add directory entry');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to add directory entry';
                showNotification('error', msg);
            }
        });
    });

    $(document).on('click', '.btn-delete-directory', function () {
        const id = $(this).data('id');
        if (!confirm('Delete this directory entry?')) return;

        $.post(baseUrl + 'admin/manage/alumni/directory/delete', { id }, function(response) {
            if (response.success) {
                loadDirectory();
            } else {
                showNotification('error', response.message || 'Failed to delete directory entry');
            }
        }, 'json');
    });

    $(document).on('submit', '#addEventForm', function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', $('#eventName').val().trim());
        formData.append('event_date', $('#eventDate').val());
        formData.append('location', $('#eventLocation').val().trim());
        formData.append('description', $('#eventDescription').val().trim());
        const photoFile = $('#eventPhoto')[0].files[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        $.ajax({
            url: baseUrl + 'admin/manage/alumni/events/create',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#addEventModal').modal('hide');
                    $('#addEventForm')[0].reset();
                    loadEvents();
                    showNotification('success', 'Event added');
                } else {
                    showNotification('error', response.message || 'Failed to add event');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to add event';
                showNotification('error', msg);
            }
        });
    });

    $(document).on('click', '.btn-delete-event', function () {
        const id = $(this).data('id');
        if (!confirm('Delete this event?')) return;

        $.post(baseUrl + 'admin/manage/alumni/events/delete', { id }, function(response) {
            if (response.success) {
                loadEvents();
            } else {
                showNotification('error', response.message || 'Failed to delete event');
            }
        }, 'json');
    });

    // Initial load
    loadMentorRequests();
    loadChatbotInquiries();
    loadConnectionRequests();
    loadUpdates();
    loadGiveback();
    loadFeatured();
    loadDirectory();
    loadEvents();
    activateRequestedTab();
    autoOpenRequestedSubmission();
});
