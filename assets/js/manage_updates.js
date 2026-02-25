$(function () {
    function getBaseURL() {
        const b = window.baseUrl || window.BASE_URL;
        if (b) return b.endsWith('/') ? b : b + '/';
        return window.location.origin + '/ccis_connect/';
    }

    function escapeHtml(text) {
        return $('<div>').text(text || '').html();
    }

    function formatDate(value) {
        if (!value) return '';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function normalizeYearLevel(value) {
        const map = {
            '1': 'First Year',
            '2': 'Second Year',
            '3': 'Third Year',
            '4': 'Fourth Year',
            'first year': 'First Year',
            'second year': 'Second Year',
            'third year': 'Third Year',
            'fourth year': 'Fourth Year'
        };
        const key = String(value || '').trim().toLowerCase();
        return map[key] || value || '';
    }

    function parseImages(row) {
        const list = [];
        if (row && row.images_json) {
            try {
                const parsed = JSON.parse(row.images_json);
                if (Array.isArray(parsed)) {
                    parsed.forEach(function (p) {
                        if (typeof p === 'string' && p.trim() !== '') list.push(p);
                    });
                }
            } catch (e) {
                // ignore malformed legacy data
            }
        }
        if (row && row.image && list.indexOf(row.image) === -1) {
            list.unshift(row.image);
        }
        return list;
    }

    function fileKey(file) {
        return [file.name, file.size, file.lastModified].join('|');
    }

    function setInputFiles(input, files) {
        const dt = new DataTransfer();
        files.forEach(function (f) {
            dt.items.add(f);
        });
        input.files = dt.files;
    }

    function bindMultiImagePicker(inputSelector, previewSelector) {
        const input = document.querySelector(inputSelector);
        const $preview = $(previewSelector);
        if (!input || !$preview.length) return;

        input._selectedFiles = input._selectedFiles || [];

        function render() {
            const files = input._selectedFiles || [];
            if (!files.length) {
                $preview.html('');
                return;
            }

            const chips = files.map(function (file, idx) {
                const url = URL.createObjectURL(file);
                return (
                    `<div class="d-inline-flex align-items-center border rounded p-1 me-2 mb-2 bg-light" data-index="${idx}">` +
                    `<img src="${url}" alt="${escapeHtml(file.name)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;" class="me-2">` +
                    `<small class="me-2">${escapeHtml(file.name)}</small>` +
                    `<button type="button" class="btn btn-sm btn-outline-danger remove-selected-image" data-index="${idx}" data-target="${inputSelector}">&times;</button>` +
                    `</div>`
                );
            }).join('');

            $preview.html(`<div><small class="text-muted d-block mb-1">${files.length} image(s) selected</small>${chips}</div>`);
        }

        input.addEventListener('change', function () {
            const incoming = Array.from(input.files || []);
            const current = input._selectedFiles || [];
            const mergedMap = new Map();
            current.forEach(function (f) { mergedMap.set(fileKey(f), f); });
            incoming.forEach(function (f) { mergedMap.set(fileKey(f), f); });
            input._selectedFiles = Array.from(mergedMap.values());
            setInputFiles(input, input._selectedFiles);
            render();
        });

        $(document).on('click', `${previewSelector} .remove-selected-image`, function () {
            const index = Number($(this).data('index'));
            const files = input._selectedFiles || [];
            if (Number.isNaN(index) || index < 0 || index >= files.length) return;
            files.splice(index, 1);
            input._selectedFiles = files;
            setInputFiles(input, files);
            render();
        });
    }

    function clearMultiImagePicker(inputSelector, previewSelector) {
        const input = document.querySelector(inputSelector);
        const $preview = $(previewSelector);
        if (!input) return;
        input.value = '';
        input._selectedFiles = [];
        if ($preview.length) $preview.html('');
    }

    function notify(message, type) {
        const cls = type === 'error' ? 'danger' : (type === 'success' ? 'success' : 'info');
        const node = $(`
            <div class="alert alert-${cls} alert-dismissible fade show" role="alert" style="position:fixed;top:20px;right:20px;z-index:1090;max-width:420px;">
                ${escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        $('body').append(node);
        setTimeout(function () {
            node.alert('close');
        }, 3000);
    }

    function showNoticeModal(message, title) {
        $('#noticeModalLabel').text(title || 'Notice');
        $('#noticeModalMessage').text(message || '');
        bootstrap.Modal.getOrCreateInstance(document.getElementById('noticeModal')).show();
    }

    function getXhrMessage(xhr, fallback) {
        if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
            return xhr.responseJSON.message;
        }
        if (xhr && xhr.responseText) {
            try {
                const parsed = JSON.parse(xhr.responseText);
                if (parsed && parsed.message) {
                    return parsed.message;
                }
            } catch (e) {
                // ignore parse error
            }
        }
        return fallback;
    }

    const baseURL = getBaseURL();
    const API = {
        announcements: {
            list: baseURL + 'admin/manage/load_announcements',
            create: baseURL + 'admin/manage/create_announcement',
            update: baseURL + 'admin/manage/update_announcement',
            del: baseURL + 'admin/manage/delete_announcement'
        },
        events: {
            list: baseURL + 'admin/manage/load_events_achievements',
            create: baseURL + 'admin/manage/create_event_achievement',
            update: baseURL + 'admin/manage/update_event_achievement',
            del: baseURL + 'admin/manage/delete_event_achievement'
        },
        deans: {
            list: baseURL + 'admin/manage/load_deans_list',
            create: baseURL + 'admin/manage/create_deans_list',
            del: baseURL + 'admin/manage/delete_deans_list'
        }
    };

    let pendingAction = null;
    let announcementsCache = [];
    let eventsCache = [];

    function showConfirm(message, cb) {
        pendingAction = cb;
        $('#confirmationMessage').text(message);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmationModal')).show();
    }

    $('#confirmActionBtn').on('click', function () {
        if (typeof pendingAction === 'function') {
            pendingAction();
        }
        pendingAction = null;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmationModal')).hide();
    });

    function renderAnnouncements(rows) {
        const host = $('#announcementsList');
        host.empty();

        if (!rows.length) {
            host.append('<div class="col-12 text-center text-muted py-4">No announcements found.</div>');
            return;
        }

        rows.forEach(function (a) {
            const images = parseImages(a);
            const image = images.length ? `<img src="${baseURL + images[0]}" class="announcement-image-preview" alt="${escapeHtml(a.title)}">` : '';
            const imageCount = images.length > 1 ? `<div class="mt-1"><small class="text-muted">${images.length} images uploaded</small></div>` : '';
            const pdf = a.pdf_file
                ? `<div class="mt-2"><a href="${baseURL + a.pdf_file}" target="_blank" rel="noopener">View PDF</a></div>`
                : '';

            host.append(`
                <div class="col-12">
                    <div class="updates-list-card">
                        ${image}
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(a.title)}</h5>
                            <div class="meta-info">
                                <span><i class="fas fa-calendar me-1"></i>${formatDate(a.announcement_date)}</span>
                                ${a.announcement_time ? `<span><i class="fas fa-clock me-1"></i>${escapeHtml(a.announcement_time)}</span>` : ''}
                                ${a.announcement_venue ? `<span><i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(a.announcement_venue)}</span>` : ''}
                            </div>
                            <p class="card-text">${escapeHtml(a.content || '')}</p>
                            ${imageCount}
                            ${pdf}
                            <div class="actions">
                                <button class="btn btn-sm btn-info edit-announcement-btn" data-id="${a.announcement_id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-announcement-btn" data-id="${a.announcement_id}" data-title="${escapeHtml(a.title)}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    function renderEvents(rows) {
        const host = $('#eventsAchievementsList');
        host.empty();

        if (!rows.length) {
            host.append('<div class="col-12 text-center text-muted py-4">No events/achievements found.</div>');
            return;
        }

        rows.forEach(function (e) {
            const images = parseImages(e);
            const image = images.length ? `<img src="${baseURL + images[0]}" class="event-image-preview" alt="${escapeHtml(e.title)}">` : '';
            const imageCount = images.length > 1 ? `<div class="mt-1"><small class="text-muted">${images.length} images uploaded</small></div>` : '';
            const badgeClass = e.type === 'Achievement' ? 'bg-success' : 'bg-primary';

            host.append(`
                <div class="col-12">
                    <div class="updates-list-card">
                        ${image}
                        <div class="card-body">
                            <div class="d-flex align-items-start justify-content-between gap-3">
                                <h5 class="card-title mb-0">${escapeHtml(e.title)}</h5>
                                <span class="badge ${badgeClass}">${escapeHtml(e.type || 'Event')}</span>
                            </div>
                            <div class="meta-info mt-2">
                                <span><i class="fas fa-calendar me-1"></i>${formatDate(e.event_date)}</span>
                                ${e.event_time ? `<span><i class="fas fa-clock me-1"></i>${escapeHtml(e.event_time)}</span>` : ''}
                                ${e.event_location ? `<span><i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(e.event_location)}</span>` : ''}
                            </div>
                            ${e.event_team ? `<p class="card-text"><strong>Team/Student:</strong> ${escapeHtml(e.event_team)}</p>` : ''}
                            <p class="card-text">${escapeHtml(e.description || '')}</p>
                            ${imageCount}
                            <div class="actions">
                                <button class="btn btn-sm btn-info edit-event-btn" data-id="${e.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-event-btn" data-id="${e.id}" data-title="${escapeHtml(e.title)}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    function renderDeansList(rows) {
        const host = $('#academicYearsList');
        host.empty();

        if (!rows.length) {
            host.append('<div class="col-12 text-center text-muted py-4">No Dean\'s List achievers found.</div>');
            return;
        }

        const grouped = {};
        rows.forEach(function (r) {
            const year = r.academic_year || 'Unspecified';
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(r);
        });

        Object.keys(grouped).sort().reverse().forEach(function (year) {
            const items = grouped[year].map(function (d) {
                return `
                    <div class="col-md-6">
                        <div class="updates-list-card h-100">
                            ${d.image ? `<img src="${baseURL + d.image}" class="event-image-preview" alt="${escapeHtml(d.full_name)}">` : ''}
                            <div class="card-body">
                                <h5 class="card-title">${escapeHtml(d.full_name)}</h5>
                                <div class="meta-info">
                                    <span><i class="fas fa-graduation-cap me-1"></i>${escapeHtml(d.program)}</span>
                                    <span><i class="fas fa-layer-group me-1"></i>${escapeHtml(d.year_level)}</span>
                                </div>
                                <div class="meta-info mt-1">
                                    <span><i class="fas fa-award me-1"></i>${escapeHtml(d.honors)}</span>
                                    <span><i class="fas fa-percent me-1"></i>GWA: ${escapeHtml(d.gwa)}</span>
                                </div>
                                ${d.achievements ? `<p class="card-text">${escapeHtml(d.achievements)}</p>` : ''}
                                <div class="mt-2">
                                    <button class="btn btn-sm btn-danger delete-deanslist-btn" data-id="${d.id}" data-title="${escapeHtml(d.full_name)} (${escapeHtml(year)})">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            host.append(`
                <div class="col-12">
                    <div class="updates-list-card">
                        <div class="card-body">
                            <h4 class="card-title mb-3"><i class="fas fa-calendar-alt me-2"></i>Academic Year ${escapeHtml(year)}</h4>
                            <div class="row g-3">${items}</div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    function loadAnnouncements() {
        return $.getJSON(API.announcements.list).done(function (res) {
            if (!res || !res.success) throw new Error((res && res.message) || 'Failed to load announcements');
            announcementsCache = res.data || [];
            renderAnnouncements(announcementsCache);
        }).fail(function () {
            notify('Failed to load announcements.', 'error');
        });
    }

    function loadEvents() {
        return $.getJSON(API.events.list).done(function (res) {
            if (!res || !res.success) throw new Error((res && res.message) || 'Failed to load events');
            eventsCache = res.data || [];
            renderEvents(eventsCache);
        }).fail(function () {
            notify('Failed to load events/achievements.', 'error');
        });
    }

    function loadDeansList() {
        return $.getJSON(API.deans.list).done(function (res) {
            if (!res || !res.success) throw new Error((res && res.message) || 'Failed to load dean\'s list');
            renderDeansList(res.data || []);
        }).fail(function () {
            notify('Failed to load Dean\'s List.', 'error');
        });
    }

    function loadAll() {
        loadAnnouncements();
        loadEvents();
        loadDeansList();
    }

    bindMultiImagePicker('#announcementImage', '#addAnnouncementImagePreview');
    bindMultiImagePicker('#eventImage', '#addEventImagePreview');
    bindMultiImagePicker('#editAnnouncementImage', '#editAnnouncementSelectedImagesPreview');
    bindMultiImagePicker('#editEventImage', '#editEventSelectedImagesPreview');

    $('#addAnnouncementForm').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', $('#announcementTitle').val().trim());
        fd.append('content', $('#announcementDescription').val().trim());
        fd.append('announcement_date', $('#announcementDate').val());
        fd.append('announcement_venue', $('#announcementVenue').val().trim());
        fd.append('announcement_time', $('#announcementTime').val().trim());

        const pdf = $('#announcementPdfFile')[0].files[0];
        const images = Array.from($('#announcementImage')[0].files || []);
        if (pdf && images.length > 0) {
            showNoticeModal('You cannot add both PDF and Image at the same time. Please choose only one file type.', 'Cannot Add Announcement');
            return;
        }
        if (pdf) fd.append('pdf_file', pdf);
        images.forEach(function (file) {
            fd.append('image_files[]', file);
        });

        $.ajax({
            url: API.announcements.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            if (!res || !res.success) {
                notify((res && res.message) || 'Failed to create announcement.', 'error');
                return;
            }
            notify(res.message || 'Announcement added.', 'success');
            $('#addAnnouncementForm')[0].reset();
            clearMultiImagePicker('#announcementImage', '#addAnnouncementImagePreview');
            loadAnnouncements();
        }).fail(function (xhr) {
            notify(getXhrMessage(xhr, 'Failed to create announcement.'), 'error');
        });
    });

    $('#addEventAchievementForm').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', $('#eventTitle').val().trim());
        fd.append('description', $('#eventDescription').val().trim());
        fd.append('event_date', $('#eventDate').val());
        fd.append('event_time', $('#eventTime').val().trim());
        fd.append('event_location', $('#eventLocation').val().trim());
        fd.append('event_team', $('#eventTeam').val().trim());
        fd.append('type', 'Event');

        const images = Array.from($('#eventImage')[0].files || []);
        images.forEach(function (file) {
            fd.append('image_files[]', file);
        });

        $.ajax({
            url: API.events.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            if (!res || !res.success) {
                notify((res && res.message) || 'Failed to create event/achievement.', 'error');
                return;
            }
            notify(res.message || 'Event/Achievement added.', 'success');
            $('#addEventAchievementForm')[0].reset();
            clearMultiImagePicker('#eventImage', '#addEventImagePreview');
            loadEvents();
        }).fail(function (xhr) {
            notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to create event/achievement.', 'error');
        });
    });

    $('#addAchieverForm').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('academic_year', $('#deanlistAcademicYear').val().trim());
        fd.append('full_name', $('#achieverName').val().trim());
        fd.append('program', $('#achieverProgram').val());
        fd.append('year_level', normalizeYearLevel($('#achieverYear').val()));
        fd.append('honors', $('#achieverHonors').val());
        fd.append('gwa', $('#achieverGWA').val().trim());
        fd.append('achievements', $('#achieverAchievements').val().trim());

        const image = $('#achieverImage')[0].files[0];
        if (image) fd.append('achiever_image', image);

        $.ajax({
            url: API.deans.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            if (!res || !res.success) {
                notify((res && res.message) || 'Failed to add achiever.', 'error');
                return;
            }
            notify(res.message || 'Dean\'s List achiever added.', 'success');
            $('#addAchieverForm')[0].reset();
            loadDeansList();
        }).fail(function (xhr) {
            notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to add achiever.', 'error');
        });
    });

    $(document).on('click', '.edit-announcement-btn', function () {
        const id = Number($(this).data('id'));
        const a = announcementsCache.find(function (item) { return Number(item.announcement_id) === id; });
        if (!a) {
            notify('Announcement not found.', 'error');
            return;
        }

        $('#editAnnouncementId').val(a.announcement_id);
        $('#editAnnouncementTitle').val(a.title || '');
        $('#editAnnouncementDate').val(a.announcement_date || '');
        $('#editAnnouncementDescription').val(a.content || '');
        $('#editAnnouncementVenue').val(a.announcement_venue || '');
        $('#editAnnouncementTime').val(a.announcement_time || '');
        $('#editAnnouncementPdfFile').val('');
        clearMultiImagePicker('#editAnnouncementImage', '#editAnnouncementSelectedImagesPreview');

        $('#editAnnouncementPdfPreview').html(
            a.pdf_file ? `<small class="text-muted">Current PDF: <a href="${baseURL + a.pdf_file}" target="_blank" rel="noopener">View file</a></small>` : ''
        );
        const annImages = parseImages(a);
        $('#editAnnouncementImagePreview').html(
            annImages.length
                ? `<small class="text-muted d-block mb-1">Current images: ${annImages.length}</small><img src="${baseURL + annImages[0]}" alt="Current image" style="max-width:120px;max-height:120px;border-radius:8px;">`
                : ''
        );

        bootstrap.Modal.getOrCreateInstance(document.getElementById('editAnnouncementModal')).show();
    });

    $('#editAnnouncementForm').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('announcement_id', $('#editAnnouncementId').val());
        fd.append('title', $('#editAnnouncementTitle').val().trim());
        fd.append('content', $('#editAnnouncementDescription').val().trim());
        fd.append('announcement_date', $('#editAnnouncementDate').val());
        fd.append('announcement_venue', $('#editAnnouncementVenue').val().trim());
        fd.append('announcement_time', $('#editAnnouncementTime').val().trim());

        const pdf = $('#editAnnouncementPdfFile')[0].files[0];
        const images = Array.from($('#editAnnouncementImage')[0].files || []);
        if (pdf && images.length > 0) {
            showNoticeModal('You cannot upload both PDF and Image at the same time. Please choose only one file type.', 'Cannot Save Changes');
            return;
        }
        if (pdf) fd.append('pdf_file', pdf);
        images.forEach(function (file) {
            fd.append('image_files[]', file);
        });

        $.ajax({
            url: API.announcements.update,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            if (!res || !res.success) {
                notify((res && res.message) || 'Failed to update announcement.', 'error');
                return;
            }
            notify(res.message || 'Announcement updated.', 'success');
            bootstrap.Modal.getOrCreateInstance(document.getElementById('editAnnouncementModal')).hide();
            loadAnnouncements();
        }).fail(function (xhr) {
            notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to update announcement.', 'error');
        });
    });

    $(document).on('click', '.edit-event-btn', function () {
        const id = Number($(this).data('id'));
        const ev = eventsCache.find(function (item) { return Number(item.id) === id; });
        if (!ev) {
            notify('Event/Achievement not found.', 'error');
            return;
        }

        $('#editEventId').val(ev.id);
        $('#editEventTitle').val(ev.title || '');
        $('#editEventDate').val(ev.event_date || '');
        $('#editEventTime').val(ev.event_time || '');
        $('#editEventLocation').val(ev.event_location || '');
        $('#editEventTeam').val(ev.event_team || '');
        $('#editEventDescription').val(ev.description || '');
        clearMultiImagePicker('#editEventImage', '#editEventSelectedImagesPreview');

        const eventImages = parseImages(ev);
        $('#editEventImagePreview').html(
            eventImages.length
                ? `<small class="text-muted d-block mb-1">Current images: ${eventImages.length}</small><img src="${baseURL + eventImages[0]}" alt="Current image" style="max-width:120px;max-height:120px;border-radius:8px;">`
                : ''
        );

        bootstrap.Modal.getOrCreateInstance(document.getElementById('editEventModal')).show();
    });

    $('#editEventForm').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('id', $('#editEventId').val());
        fd.append('title', $('#editEventTitle').val().trim());
        fd.append('description', $('#editEventDescription').val().trim());
        fd.append('event_date', $('#editEventDate').val());
        fd.append('event_time', $('#editEventTime').val().trim());
        fd.append('event_location', $('#editEventLocation').val().trim());
        fd.append('event_team', $('#editEventTeam').val().trim());
        fd.append('type', 'Event');

        const images = Array.from($('#editEventImage')[0].files || []);
        images.forEach(function (file) {
            fd.append('image_files[]', file);
        });

        $.ajax({
            url: API.events.update,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            if (!res || !res.success) {
                notify((res && res.message) || 'Failed to update event/achievement.', 'error');
                return;
            }
            notify(res.message || 'Event/Achievement updated.', 'success');
            bootstrap.Modal.getOrCreateInstance(document.getElementById('editEventModal')).hide();
            loadEvents();
        }).fail(function (xhr) {
            notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to update event/achievement.', 'error');
        });
    });

    $(document).on('click', '.delete-announcement-btn', function () {
        const id = $(this).data('id');
        const title = $(this).data('title') || 'this announcement';

        showConfirm(`Are you sure you want to remove "${title}"?`, function () {
            $.post(API.announcements.del, { announcement_id: id }, null, 'json').done(function (res) {
                if (!res || !res.success) {
                    notify((res && res.message) || 'Failed to delete announcement.', 'error');
                    return;
                }
                notify(res.message || 'Announcement removed.', 'success');
                loadAnnouncements();
            }).fail(function (xhr) {
                notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to delete announcement.', 'error');
            });
        });
    });

    $(document).on('click', '.delete-event-btn', function () {
        const id = $(this).data('id');
        const title = $(this).data('title') || 'this item';

        showConfirm(`Are you sure you want to remove "${title}"?`, function () {
            $.post(API.events.del, { id: id }, null, 'json').done(function (res) {
                if (!res || !res.success) {
                    notify((res && res.message) || 'Failed to delete event/achievement.', 'error');
                    return;
                }
                notify(res.message || 'Event/Achievement removed.', 'success');
                loadEvents();
            }).fail(function (xhr) {
                notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to delete event/achievement.', 'error');
            });
        });
    });

    $(document).on('click', '.delete-deanslist-btn', function () {
        const id = $(this).data('id');
        const title = $(this).data('title') || 'this achiever';

        showConfirm(`Are you sure you want to remove ${title}?`, function () {
            $.post(API.deans.del, { id: id }, null, 'json').done(function (res) {
                if (!res || !res.success) {
                    notify((res && res.message) || 'Failed to delete Dean\'s List.', 'error');
                    return;
                }
                notify(res.message || 'Dean\'s List entry removed.', 'success');
                loadDeansList();
            }).fail(function (xhr) {
                notify((xhr.responseJSON && xhr.responseJSON.message) || 'Failed to delete Dean\'s List.', 'error');
            });
        });
    });

    loadAll();
});
