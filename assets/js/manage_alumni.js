$(document).ready(function () {
    const baseUrl = window.baseUrl || window.BASE_URL || '/';

    let activeSubmissionContext = null;
    let mentorRequestsCache = [];
    let nextDirectoryEntryIndex = 0;
    let activeFeaturedUpload = {
        active: false,
        xhr: null,
        uploadToken: '',
        cleanupRequested: false
    };

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

    function normalizeDirectoryImages(row) {
        const images = [];
        const addImage = (value) => {
            const path = String(value ?? '').trim();
            if (path) {
                images.push(path);
            }
        };

        if (Array.isArray(row?.images)) {
            row.images.forEach(addImage);
        }

        if (!images.length && row?.images_json) {
            try {
                const decoded = JSON.parse(row.images_json);
                if (Array.isArray(decoded)) {
                    decoded.forEach(addImage);
                }
            } catch (error) {
                console.warn('Failed to parse alumni directory images_json', error);
            }
        }

        if (!images.length && row?.photo) {
            addImage(row.photo);
        }

        return [...new Set(images)];
    }

    function formatPhotoCountLabel(count) {
        return `${count} photo${count === 1 ? '' : 's'}`;
    }

    function formatFileSize(bytes) {
        const safeBytes = Number(bytes) || 0;
        if (safeBytes <= 0) {
            return '0 B';
        }

        const units = ['B', 'KB', 'MB', 'GB'];
        const exponent = Math.min(Math.floor(Math.log(safeBytes) / Math.log(1024)), units.length - 1);
        const value = safeBytes / Math.pow(1024, exponent);
        return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
    }

    function createFeaturedUploadToken() {
        return `featured_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    function getFeaturedMediaInfo(row) {
        const photo = String(row?.photo ?? '').trim();
        const video = String(row?.video ?? '').trim();
        const mediaType = String(row?.media_type ?? '').trim().toLowerCase();

        if (mediaType === 'video' || video) {
            return { type: 'video', path: video, label: 'Video Feature' };
        }

        if (mediaType === 'photo' || photo) {
            return { type: 'photo', path: photo, label: 'Photo Feature' };
        }

        return { type: 'none', path: '', label: 'Text Only' };
    }

    function getFeaturedSelectedMedia() {
        const photoFile = document.getElementById('featuredPhoto')?.files?.[0] || null;
        const videoFile = document.getElementById('featuredVideo')?.files?.[0] || null;

        if (videoFile) {
            return { type: 'video', file: videoFile, badge: 'Video Feature' };
        }

        if (photoFile) {
            return { type: 'photo', file: photoFile, badge: 'Photo Feature' };
        }

        return null;
    }

    function renderFeaturedMediaSelection() {
        const preview = $('#featuredMediaPreview');
        if (!preview.length) {
            return;
        }

        const media = getFeaturedSelectedMedia();
        if (!media) {
            preview.html(`
                <div class="featured-media-preview-empty">
                    <i class="fas fa-sparkles"></i>
                    <span>No media selected yet. The entry can still be saved without media.</span>
                </div>
            `);
            return;
        }

        const iconClass = media.type === 'video' ? 'fa-video' : 'fa-image';
        const helperCopy = media.type === 'video'
            ? 'This will play on the public featured alumni section and details modal.'
            : 'This will appear as the featured alumni hero image on the public page.';

        preview.html(`
            <div class="featured-media-preview-card">
                <span class="featured-media-preview-badge">${escapeHtml(media.badge)}</span>
                <div class="featured-media-preview-file">
                    <i class="fas ${iconClass}"></i>
                    <div>
                        <strong>${escapeHtml(media.file.name)}</strong>
                        <small>${formatFileSize(media.file.size)}</small>
                    </div>
                </div>
                <p>${helperCopy}</p>
            </div>
        `);
    }

    function parseJsonResponse(xhr) {
        if (xhr.response && typeof xhr.response === 'object') {
            return xhr.response;
        }

        try {
            return JSON.parse(xhr.responseText || '{}');
        } catch (error) {
            return {};
        }
    }

    function extractServerMessage(xhr, fallbackMessage) {
        const response = parseJsonResponse(xhr);
        if (response?.message) {
            return response.message;
        }

        const rawResponse = String(xhr?.responseText || '')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (rawResponse) {
            return rawResponse.slice(0, 320);
        }

        if (xhr?.status) {
            return `${fallbackMessage} (HTTP ${xhr.status})`;
        }

        return fallbackMessage;
    }

    function setFeaturedFormLocked(isLocked) {
        const modal = $('#addFeaturedModal');
        modal.toggleClass('featured-form-locked', isLocked);
        modal.find('input, textarea, button, .btn-close').prop('disabled', isLocked);
        $('#featuredUploadOverlay').attr('aria-hidden', String(!isLocked));
        $('body').toggleClass('featured-upload-active', isLocked);

        const submitBtn = modal.find('button[form="addFeaturedForm"]');
        submitBtn.html(isLocked ? '<i class="fas fa-spinner fa-spin me-2"></i>Uploading...' : 'Add Alumni');
    }

    function setFeaturedUploadOverlayVisible(isVisible) {
        const overlay = $('#featuredUploadOverlay');
        overlay.prop('hidden', !isVisible);
        overlay.attr('aria-hidden', String(!isVisible));
    }

    function updateFeaturedUploadOverlay(details = {}) {
        const percent = Math.max(0, Math.min(100, Number(details.percent ?? 0)));
        $('#featuredUploadMediaBadge').text(details.badge || 'Media');
        $('#featuredUploadFileName').text(details.fileName || 'Preparing upload...');
        $('#featuredUploadFileSize').text(details.fileSize || '0 MB');
        $('#featuredUploadStage').text(details.stage || 'Preparing upload...');
        $('#featuredUploadPercent').text(`${percent}%`);
        $('#featuredUploadStatus').text(details.status || 'Navigation is temporarily blocked so unfinished uploads can be cancelled and cleaned up safely.');
        $('#featuredUploadDescription').text(details.description || 'Please keep this page open while we upload and secure the file.');
        $('#featuredUploadProgressBar').css('width', `${percent}%`);
    }

    function beginFeaturedUpload(media, uploadToken) {
        activeFeaturedUpload = {
            active: true,
            xhr: null,
            uploadToken,
            cleanupRequested: false
        };

        setFeaturedFormLocked(true);
        setFeaturedUploadOverlayVisible(true);
        updateFeaturedUploadOverlay({
            badge: media?.badge || 'Profile Save',
            fileName: media?.file?.name || 'Featured alumni profile',
            fileSize: media?.file ? formatFileSize(media.file.size) : 'No media file',
            stage: media ? 'Preparing upload...' : 'Saving details...',
            percent: media ? 0 : 20,
            status: media
                ? 'Do not close or leave this page while the upload is in progress.'
                : 'Saving the featured alumni entry now.'
        });
    }

    function finishFeaturedUpload() {
        activeFeaturedUpload = {
            active: false,
            xhr: null,
            uploadToken: '',
            cleanupRequested: false
        };

        setFeaturedUploadOverlayVisible(false);
        setFeaturedFormLocked(false);
        updateFeaturedUploadOverlay({
            badge: 'Media',
            fileName: 'Preparing upload...',
            fileSize: '0 MB',
            stage: 'Preparing upload...',
            percent: 0,
            status: 'Navigation is temporarily blocked so unfinished uploads can be cancelled and cleaned up safely.'
        });
    }

    function requestFeaturedUploadCleanup(uploadToken) {
        const token = String(uploadToken || '').trim();
        if (!token || activeFeaturedUpload.cleanupRequested) {
            return;
        }

        activeFeaturedUpload.cleanupRequested = true;
        const cleanupUrl = baseUrl + 'admin/manage/alumni/featured/cancel_upload';
        const payload = new FormData();
        payload.append('upload_token', token);

        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(cleanupUrl, payload);
                return;
            }
        } catch (error) {
            console.warn('Featured upload cleanup beacon failed', error);
        }

        try {
            fetch(cleanupUrl, {
                method: 'POST',
                body: payload,
                credentials: 'same-origin',
                keepalive: true
            }).catch(() => {});
        } catch (error) {
            console.warn('Featured upload cleanup request failed', error);
        }
    }

    function buildDirectoryEntryMarkup(entryIndex, values = {}) {
        const safeName = escapeHtml(values.name || '');
        const safeBatch = escapeHtml(values.batch || '');
        const safeEmail = escapeHtml(values.email || '');
        const safePhone = escapeHtml(values.phone || '');

        return `
            <div class="card border-0 shadow-sm mb-3 directory-entry-item directory-entry-card" data-entry-index="${entryIndex}">
                <div class="card-body directory-entry-body">
                    <div class="directory-entry-toolbar d-flex justify-content-between align-items-start gap-3 mb-3">
                        <div class="directory-entry-copy">
                            <h6 class="mb-1 directory-entry-title">Entry</h6>
                            <p class="text-muted small mb-0">Fill out this alumni directory record.</p>
                        </div>
                        <button type="button" class="btn btn-outline-danger btn-sm directory-remove-entry">
                            <i class="fas fa-trash-alt me-1"></i>Remove
                        </button>
                    </div>
                    <div class="row g-3 directory-entry-fields">
                        <div class="col-md-6">
                            <label for="dirName_${entryIndex}" class="form-label">Name</label>
                            <input type="text" class="form-control directory-name-input" id="dirName_${entryIndex}" value="${safeName}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dirBatch_${entryIndex}" class="form-label">Batch/Year</label>
                            <input type="text" class="form-control directory-batch-input" id="dirBatch_${entryIndex}" value="${safeBatch}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dirEmail_${entryIndex}" class="form-label">Email</label>
                            <input type="email" class="form-control directory-email-input" id="dirEmail_${entryIndex}" value="${safeEmail}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dirPhone_${entryIndex}" class="form-label">Phone</label>
                            <input type="tel" class="form-control directory-phone-input" id="dirPhone_${entryIndex}" value="${safePhone}" required>
                        </div>
                        <div class="col-12">
                            <label for="dirPhoto_${entryIndex}" class="form-label">Photos (optional)</label>
                            <input type="file" class="form-control directory-photo-input" id="dirPhoto_${entryIndex}" data-entry-index="${entryIndex}" accept="image/*" multiple>
                            <div class="form-text">You can select multiple photos for this alumni entry.</div>
                            <div class="directory-photo-preview mt-2 small text-muted"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateDirectoryEntryControls() {
        const cards = $('#directoryEntryList .directory-entry-item');

        cards.each(function(position) {
            $(this).find('.directory-entry-title').text(`Entry ${position + 1}`);
        });

        cards.find('.directory-remove-entry').toggle(cards.length > 1);
    }

    function renderDirectoryPhotoSelection(entryIndex) {
        const card = $(`.directory-entry-item[data-entry-index="${entryIndex}"]`);
        const preview = card.find('.directory-photo-preview');
        const files = Array.from(card.find('.directory-photo-input')[0]?.files || []);

        if (!preview.length) {
            return;
        }

        if (!files.length) {
            preview.text('No photos selected yet.');
            return;
        }

        const fileList = files
            .map((file, index) => `${index + 1}. ${escapeHtml(file.name)}`)
            .join('<br>');

        preview.html(`
            <div class="fw-semibold text-dark mb-1">${formatPhotoCountLabel(files.length)} selected</div>
            <div>${fileList}</div>
        `);
    }

    function addDirectoryEntryRow(values = {}) {
        const entryIndex = nextDirectoryEntryIndex++;
        $('#directoryEntryList').append(buildDirectoryEntryMarkup(entryIndex, values));
        renderDirectoryPhotoSelection(entryIndex);
        updateDirectoryEntryControls();
    }

    function collectDirectoryEntries() {
        const entries = [];
        let hasInvalidField = false;

        $('#directoryEntryList .directory-entry-item').each(function() {
            const card = $(this);
            const entryIndex = Number(card.data('entry-index'));
            const nameInput = card.find('.directory-name-input');
            const batchInput = card.find('.directory-batch-input');
            const emailInput = card.find('.directory-email-input');
            const phoneInput = card.find('.directory-phone-input');
            const inputs = [nameInput, batchInput, emailInput, phoneInput];

            inputs.forEach((input) => input.removeClass('is-invalid'));

            const name = nameInput.val().trim();
            const batch = batchInput.val().trim();
            const email = emailInput.val().trim();
            const phone = phoneInput.val().trim();

            if (!name) {
                nameInput.addClass('is-invalid');
                hasInvalidField = true;
            }
            if (!batch) {
                batchInput.addClass('is-invalid');
                hasInvalidField = true;
            }
            if (!email) {
                emailInput.addClass('is-invalid');
                hasInvalidField = true;
            }
            if (!phone) {
                phoneInput.addClass('is-invalid');
                hasInvalidField = true;
            }

            entries.push({
                name,
                batch,
                email,
                phone,
                file_key: `photo_files_${entryIndex}`
            });
        });

        return hasInvalidField ? null : entries;
    }

    function resetDirectoryForm() {
        const form = $('#addDirectoryForm')[0];
        if (form) {
            form.reset();
        }
        $('#directoryEntryList').empty();
        nextDirectoryEntryIndex = 0;
        addDirectoryEntryRow();
    }

    function isLongFormDetail(label, value) {
        const normalizedLabel = String(label || '').trim().toLowerCase();
        const text = String(value ?? '');
        const hasParagraphBreak = /\r?\n/.test(text);
        const longFormLabels = ['message', 'update', 'details', 'question', 'biography', 'bio', 'content'];

        return hasParagraphBreak || longFormLabels.includes(normalizedLabel);
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
            .map(([label, value]) => {
                const safeValue = value || '-';
                const textClasses = isLongFormDetail(label, safeValue)
                    ? 'submission-detail-value submission-detail-longtext'
                    : 'submission-detail-value';
                return `<tr><th style="width: 35%;">${escapeHtml(label)}</th><td class="${textClasses}">${escapeHtml(safeValue)}</td></tr>`;
            })
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
            mentorRequestsCache = data;
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

    async function markAllMentorRequestsAsRead() {
        const unreadItems = (mentorRequestsCache || []).filter(isUnreadNotification);
        if (!unreadItems.length) {
            showNotification('success', 'No unread mentor submissions.');
            return;
        }

        const requests = unreadItems.map(function(row) {
            return $.ajax({
                url: baseUrl + 'admin/manage/alumni/mentor_status',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: row.id,
                    status: 'read',
                    source: row.source || 'mentor_requests'
                }
            });
        });

        try {
            const results = await Promise.all(requests);
            const failed = results.filter(function(res) { return !(res && res.success); }).length;
            if (failed > 0) {
                showNotification('error', `${failed} mentor submission(s) failed to mark as read.`);
            } else {
                showNotification('success', 'All mentor submissions marked as read.');
            }
            loadMentorRequests();
        } catch (xhr) {
            const msg = xhr?.responseJSON?.message || 'Failed to mark all mentor submissions as read';
            showNotification('error', msg);
        }
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
                        <td class="formatted-paragraph">${escapeHtml(row.question)}</td>
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
                        <td class="formatted-paragraph">${escapeHtml(row.content)}</td>
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

    function loadDonationSettings() {
        $.getJSON(baseUrl + 'admin/manage/alumni/donation_settings', function(response) {
            if (!response.success || !response.data) return;
            const data = response.data;

            $('#donation-bank-name').val(data.bank_name || '');
            $('#donation-bank-account-name').val(data.bank_account_name || '');
            $('#donation-bank-account-number').val(data.bank_account_number || '');
            $('#donation-bank-branch').val(data.bank_branch || '');
            $('#donation-gcash-number').val(data.gcash_number || '');
            $('#donation-maya-number').val(data.maya_number || '');
            $('#donation-digital-account-name').val(data.digital_account_name || '');
            $('#donation-contact-email').val(data.contact_email || '');
        });
    }

    function saveDonationSettings() {
        const payload = {
            bank_name: $('#donation-bank-name').val().trim(),
            bank_account_name: $('#donation-bank-account-name').val().trim(),
            bank_account_number: $('#donation-bank-account-number').val().trim(),
            bank_branch: $('#donation-bank-branch').val().trim(),
            gcash_number: $('#donation-gcash-number').val().trim(),
            maya_number: $('#donation-maya-number').val().trim(),
            digital_account_name: $('#donation-digital-account-name').val().trim(),
            contact_email: $('#donation-contact-email').val().trim()
        };

        $.post(baseUrl + 'admin/manage/alumni/donation_settings/save', payload, function(response) {
            if (response && response.success) {
                showNotification('success', 'Donation payment details saved.');
                return;
            }
            showNotification('error', (response && response.message) || 'Failed to save donation details');
        }, 'json').fail(function(xhr) {
            const msg = xhr.responseJSON?.message || 'Failed to save donation details';
            showNotification('error', msg);
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
                const media = getFeaturedMediaInfo(row);
                let mediaHtml = `
                    <div class="featured-image featured-image-placeholder">
                        <div class="featured-empty-state">
                            <i class="fas fa-star"></i>
                            <span>Text-only Feature</span>
                        </div>
                        <span class="featured-media-pill">Text Only</span>
                    </div>
                `;

                if (media.type === 'photo' && media.path) {
                    mediaHtml = `
                        <div class="featured-image">
                            <img src="${baseUrl + media.path}" alt="${escapeHtml(row.name)}">
                            <span class="featured-media-pill"><i class="fas fa-image me-1"></i>Photo</span>
                        </div>
                    `;
                } else if (media.type === 'video' && media.path) {
                    mediaHtml = `
                        <div class="featured-image featured-image-video">
                            <video class="featured-video-preview" src="${baseUrl + media.path}" controls muted playsinline preload="metadata"></video>
                            <span class="featured-media-pill"><i class="fas fa-video me-1"></i>Video</span>
                        </div>
                    `;
                }

                grid.append(`
                    <div class="col-md-6 col-xl-4">
                        <div class="featured-card h-100">
                            ${mediaHtml}
                            <div class="featured-content">
                                <h5 class="card-title">${escapeHtml(row.name)}</h5>
                                <p class="featured-position">${escapeHtml(row.position)}</p>
                                <p class="featured-copy formatted-paragraph">${escapeHtml(row.bio)}</p>
                                <div class="featured-actions justify-content-end">
                                    <button class="btn btn-sm btn-outline-danger btn-delete-featured" data-id="${row.id}">Delete</button>
                                </div>
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
                const images = normalizeDirectoryImages(row);
                const primaryImage = images[0] || '';
                const photoSummary = images.length > 1
                    ? `<div class="text-muted small">${formatPhotoCountLabel(images.length)}</div>`
                    : '';
                const photoThumb = primaryImage
                    ? `<img src="${baseUrl + primaryImage}" alt="${escapeHtml(row.name)}" style="width:42px;height:42px;object-fit:cover;border-radius:50%;border:2px solid #efe1ff;flex-shrink:0;">`
                    : `<div class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width:42px;height:42px;background:#f2e9ff;color:#6a0dad;flex-shrink:0;"><i class="fas fa-user"></i></div>`;

                body.append(`
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                ${photoThumb}
                                <div>
                                    <div class="fw-semibold">${escapeHtml(row.name)}</div>
                                    ${photoSummary}
                                </div>
                            </div>
                        </td>
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
                                <p class="card-text formatted-paragraph">${escapeHtml(row.description)}</p>
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

    $('#addFeaturedModal').on('hide.bs.modal', function(event) {
        if (activeFeaturedUpload.active) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }
        return true;
    });

    $(document).on('change', '#featuredPhoto', function() {
        if (this.files && this.files.length) {
            const videoInput = document.getElementById('featuredVideo');
            if (videoInput) {
                videoInput.value = '';
            }
        }
        renderFeaturedMediaSelection();
    });

    $(document).on('change', '#featuredVideo', function() {
        if (this.files && this.files.length) {
            const photoInput = document.getElementById('featuredPhoto');
            if (photoInput) {
                photoInput.value = '';
            }
        }
        renderFeaturedMediaSelection();
    });

    window.addEventListener('beforeunload', function(event) {
        if (!activeFeaturedUpload.active) {
            return;
        }

        event.preventDefault();
        event.returnValue = '';
    });

    window.addEventListener('pagehide', function() {
        if (!activeFeaturedUpload.active) {
            return;
        }

        requestFeaturedUploadCleanup(activeFeaturedUpload.uploadToken);
    });

    $(document).on('submit', '#addFeaturedForm', function (e) {
        e.preventDefault();
        if (activeFeaturedUpload.active) {
            return;
        }

        const name = $('#featuredName').val().trim();
        const position = $('#featuredPosition').val().trim();
        const bio = $('#featuredBio').val().trim();
        const media = getFeaturedSelectedMedia();
        const hasPhoto = Boolean(document.getElementById('featuredPhoto')?.files?.length);
        const hasVideo = Boolean(document.getElementById('featuredVideo')?.files?.length);

        if (!name || !position || !bio) {
            showNotification('error', 'Name, position/achievement, and biography are required.');
            return;
        }

        if (hasPhoto && hasVideo) {
            showNotification('error', 'Please choose only one media type for the featured alumni entry.');
            return;
        }

        const formData = new FormData();
        const uploadToken = createFeaturedUploadToken();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('bio', bio);
        formData.append('upload_token', uploadToken);

        if (media?.type === 'photo') {
            formData.append('photo', media.file);
        }

        if (media?.type === 'video') {
            formData.append('video', media.file);
        }

        beginFeaturedUpload(media, uploadToken);

        const xhr = new XMLHttpRequest();
        activeFeaturedUpload.xhr = xhr;
        xhr.open('POST', baseUrl + 'admin/manage/alumni/featured/create', true);
        xhr.responseType = 'json';

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', function(event) {
                if (!activeFeaturedUpload.active || !event.lengthComputable) {
                    return;
                }

                const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
                updateFeaturedUploadOverlay({
                    badge: media?.badge || 'Profile Save',
                    fileName: media?.file?.name || 'Featured alumni profile',
                    fileSize: media?.file ? formatFileSize(media.file.size) : 'No media file',
                    stage: media ? `Uploading ${media.type}...` : 'Saving details...',
                    percent,
                    status: media
                        ? `${formatFileSize(event.loaded)} of ${formatFileSize(event.total)} uploaded`
                        : 'Saving the featured alumni entry now.',
                    description: media
                        ? 'Please keep this page open while the media is uploading.'
                        : 'Please wait while the featured alumni details are being saved.'
                });
            });

            xhr.upload.addEventListener('load', function() {
                if (!activeFeaturedUpload.active) {
                    return;
                }

                updateFeaturedUploadOverlay({
                    badge: media?.badge || 'Profile Save',
                    fileName: media?.file?.name || 'Featured alumni profile',
                    fileSize: media?.file ? formatFileSize(media.file.size) : 'No media file',
                    stage: 'Securing upload...',
                    percent: 100,
                    status: 'Upload received. Finalizing the featured alumni entry now.',
                    description: 'We are finishing the save and cleaning temporary upload files.'
                });
            });
        }

        xhr.addEventListener('load', function() {
            const response = parseJsonResponse(xhr);
            const succeeded = xhr.status >= 200 && xhr.status < 300 && response.success;

            finishFeaturedUpload();

            if (succeeded) {
                const modalEl = document.getElementById('addFeaturedModal');
                if (modalEl && window.bootstrap?.Modal) {
                    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
                }

                document.getElementById('addFeaturedForm')?.reset();
                renderFeaturedMediaSelection();
                loadFeatured();
                showNotification('success', media?.type === 'video' ? 'Featured alumni video uploaded successfully.' : 'Featured alumni added successfully.');
                return;
            }

            const message = extractServerMessage(xhr, 'Failed to add featured alumni.');
            showNotification('error', message);
        });

        xhr.addEventListener('error', function() {
            finishFeaturedUpload();
            showNotification('error', 'Upload failed. Please check the file and try again.');
        });

        xhr.addEventListener('abort', function() {
            if (!activeFeaturedUpload.active) {
                return;
            }

            finishFeaturedUpload();
            showNotification('error', 'The upload was cancelled before it finished.');
        });

        xhr.send(formData);
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
        const entries = collectDirectoryEntries();
        if (!entries || !entries.length) {
            showNotification('error', 'Please complete all required fields for each directory entry.');
            return;
        }

        const formData = new FormData();
        formData.append('entries_json', JSON.stringify(entries));

        $('#directoryEntryList .directory-entry-item').each(function() {
            const card = $(this);
            const entryIndex = Number(card.data('entry-index'));
            const photoFiles = Array.from(card.find('.directory-photo-input')[0]?.files || []);

            photoFiles.forEach((file) => {
                formData.append(`photo_files_${entryIndex}[]`, file);
            });
        });

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
                    resetDirectoryForm();
                    loadDirectory();
                    const createdCount = Number(response.created_count || entries.length || 1);
                    showNotification('success', `${createdCount} directory entr${createdCount === 1 ? 'y' : 'ies'} added`);
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

    $(document).on('click', '#addDirectoryEntryRow', function() {
        addDirectoryEntryRow();
    });

    $(document).on('click', '.directory-remove-entry', function() {
        $(this).closest('.directory-entry-item').remove();
        updateDirectoryEntryControls();
        if (!$('#directoryEntryList .directory-entry-item').length) {
            addDirectoryEntryRow();
        }
    });

    $(document).on('change', '.directory-photo-input', function() {
        renderDirectoryPhotoSelection($(this).data('entry-index'));
    });

    $(document).on('input', '#directoryEntryList .form-control', function() {
        $(this).removeClass('is-invalid');
    });

    $('#addDirectoryModal').on('hidden.bs.modal', function() {
        resetDirectoryForm();
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

    $(document).on('submit', '#donationSettingsForm', function(e) {
        e.preventDefault();
        saveDonationSettings();
    });

    $('#mark-all-mentor-read').on('click', function() {
        markAllMentorRequestsAsRead();
    });

    // Initial load
    loadMentorRequests();
    loadChatbotInquiries();
    loadConnectionRequests();
    // Temporarily disabled: Alumni Updates loading
    // loadUpdates();
    loadGiveback();
    loadDonationSettings();
    loadFeatured();
    loadDirectory();
    loadEvents();
    renderFeaturedMediaSelection();
    resetDirectoryForm();
    activateRequestedTab();
    autoOpenRequestedSubmission();
});
