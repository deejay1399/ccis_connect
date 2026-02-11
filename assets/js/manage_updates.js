// MANAGE UPDATES - SUPER ADMIN JAVASCRIPT (DB + FILE UPLOAD)

$(document).ready(function () {
    console.log('🔐 Manage Updates Loading...')

    // -----------------------------
    // Session / base URL
    // -----------------------------

    function checkSuperAdminSession() {
        const session = window.checkUserSession ? window.checkUserSession() : (window.sessionData || { isValid: false, user: null })

        if (!session.isValid) {
            showStatusModal('Session Required', 'Please login to access Super Admin dashboard.', 'error')
            setTimeout(() => {
                window.location.href = (window.baseUrl || window.BASE_URL || '/') + 'login'
            }, 1500)
            return false
        }

        if (!session.user || !['superadmin', 'faculty'].includes(session.user.role)) {
            showStatusModal('Access Denied', 'Super Admin or Faculty privileges required.', 'error')
            setTimeout(() => {
                window.location.href = (window.baseUrl || window.BASE_URL || '/')
            }, 1500)
            return false
        }

        return true
    }

    function getBaseURL() {
        // base_url() from PHP footer sets window.baseUrl and window.BASE_URL
        const b = window.baseUrl || window.BASE_URL
        if (b) return b.endsWith('/') ? b : (b + '/')

        // Fallback (repo is under /ccis_connect/ in this environment)
        const guessed = window.location.origin + '/ccis_connect/'
        return guessed
    }

    const baseURL = getBaseURL()

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
        deansList: {
            list: baseURL + 'admin/manage/load_deans_list',
            create: baseURL + 'admin/manage/create_deans_list',
            del: baseURL + 'admin/manage/delete_deans_list'
        }
    }

    // -----------------------------
    // Modals
    // -----------------------------

    let pendingAction = null

    function showConfirmation(message, confirmCallback) {
        $('#confirmationMessage').text(message)
        pendingAction = confirmCallback

        const modalEl = document.getElementById('confirmationModal')
        const modal = new bootstrap.Modal(modalEl)
        modal.show()
    }

    $('#confirmActionBtn').on('click', function () {
        if (pendingAction) {
            try {
                pendingAction()
            } finally {
                pendingAction = null
            }
        }

        const modalEl = document.getElementById('confirmationModal')
        const inst = bootstrap.Modal.getInstance(modalEl)
        if (inst) inst.hide()
    })

    function showStatusModal(title, message, type) {
        const header = $('#statusModalHeader')
        const icon = $('#statusModalIcon')

        header.removeClass('bg-success bg-danger bg-info text-white')
        icon.removeClass('text-success text-danger text-info')

        if (type === 'success') {
            header.addClass('bg-success text-white')
            icon.addClass('text-success').html('<i class="fas fa-check-circle"></i>')
        } else if (type === 'error') {
            header.addClass('bg-danger text-white')
            icon.addClass('text-danger').html('<i class="fas fa-exclamation-circle"></i>')
        } else {
            header.addClass('bg-info text-white')
            icon.addClass('text-info').html('<i class="fas fa-info-circle"></i>')
        }

        $('#statusModalTitle').text(title)
        $('#statusModalMessage').text(message)

        const modalEl = document.getElementById('statusModal')
        const modal = new bootstrap.Modal(modalEl)
        modal.show()
    }

    // -----------------------------
    // Rendering
    // -----------------------------

    function escapeHtml(text) {
        return $('<div>').text(text || '').html()
    }

    function formatDate(dateStr) {
        if (!dateStr) return ''
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        } catch {
            return dateStr
        }
    }

    function renderAnnouncements(list) {
        const container = $('#announcements-list')
        container.empty()

        if (!list || list.length === 0) {
            container.append('<div class="col-12 text-center text-muted py-4">No announcements found.</div>')
            return
        }

        list.forEach((a) => {
            const imageHtml = a.image ? `<img src="${baseURL + a.image}" class="announcement-image-preview" alt="${escapeHtml(a.title)}">` : ''

            const card = `
                <div class="col-12">
                    <div class="updates-list-card">
                        ${imageHtml}
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(a.title)}</h5>
                            <div class="meta-info">
                                <span><i class="fas fa-calendar me-1"></i> ${formatDate(a.announcement_date)}</span>
                            </div>
                            <p class="card-text">${escapeHtml(a.content)}</p>
                            <div class="actions">
                                <button class="btn btn-sm btn-info edit-announcement-btn" data-id="${a.announcement_id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-announcement-btn" data-id="${a.announcement_id}" data-title="${escapeHtml(a.title)}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `

            container.append(card)
        })
    }

    function renderEvents(list) {
        const container = $('#events-list')
        container.empty()

        if (!list || list.length === 0) {
            container.append('<div class="col-12 text-center text-muted py-4">No events/achievements found.</div>')
            return
        }

        list.forEach((e) => {
            const imageHtml = e.image ? `<img src="${baseURL + e.image}" class="event-image-preview" alt="${escapeHtml(e.title)}">` : ''

            const badgeClass = e.type === 'Achievement' ? 'bg-success' : 'bg-primary'

            const card = `
                <div class="col-12">
                    <div class="updates-list-card">
                        ${imageHtml}
                        <div class="card-body">
                            <div class="d-flex align-items-start justify-content-between gap-3">
                                <h5 class="card-title mb-0">${escapeHtml(e.title)}</h5>
                                <span class="badge ${badgeClass}">${escapeHtml(e.type)}</span>
                            </div>
                            <div class="meta-info mt-2">
                                <span><i class="fas fa-calendar me-1"></i> ${formatDate(e.event_date)}</span>
                            </div>
                            <p class="card-text">${escapeHtml(e.description)}</p>
                            <div class="actions">
                                <button class="btn btn-sm btn-info edit-event-btn" data-id="${e.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-event-btn" data-id="${e.id}" data-title="${escapeHtml(e.title)}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `

            container.append(card)
        })
    }

    function renderDeansList(list) {
        const container = $('#deanslist-list')
        container.empty()

        if (!list || list.length === 0) {
            container.append('<div class="col-12 text-center text-muted py-4">No Dean\'s List entries found.</div>')
            return
        }

        list.forEach((d) => {
            const pdfUrl = d.pdf_file ? (baseURL + d.pdf_file) : '#'

            const card = `
                <div class="col">
                    <div class="updates-list-card">
                        <div class="card-body">
                            <h5 class="card-title">Academic Year ${escapeHtml(d.academic_year)}</h5>
                            <div class="meta-info">
                                <span><i class="fas fa-tag me-1"></i> ${escapeHtml(d.semester)}</span>
                                <span><i class="fas fa-upload me-1"></i> ${formatDate(d.uploaded_at)}</span>
                            </div>
                            <div class="mt-2">
                                <a class="btn btn-sm btn-outline-primary" href="${pdfUrl}" target="_blank" rel="noopener">View PDF</a>
                                <button class="btn btn-sm btn-danger ms-2 delete-deanslist-btn" data-id="${d.id}" data-title="${escapeHtml(d.academic_year)} ${escapeHtml(d.semester)}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `

            container.append(card)
        })
    }

    // -----------------------------
    // Data loading
    // -----------------------------

    let cachedAnnouncements = []
    let cachedEvents = []

    function loadAnnouncements() {
        $.ajax({
            url: API.announcements.list,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    cachedAnnouncements = res.data || []
                    renderAnnouncements(cachedAnnouncements)
                } else {
                    showStatusModal('Error', (res && res.message) ? res.message : 'Failed to load announcements.', 'error')
                }
            },
            error: function (xhr) {
                showStatusModal('Error', 'Failed to load announcements.', 'error')
                console.error(xhr)
            }
        })
    }

    function loadEvents() {
        $.ajax({
            url: API.events.list,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    cachedEvents = res.data || []
                    renderEvents(cachedEvents)
                } else {
                    showStatusModal('Error', (res && res.message) ? res.message : 'Failed to load events/achievements.', 'error')
                }
            },
            error: function (xhr) {
                showStatusModal('Error', 'Failed to load events/achievements.', 'error')
                console.error(xhr)
            }
        })
    }

    function loadDeansList() {
        $.ajax({
            url: API.deansList.list,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    renderDeansList(res.data || [])
                } else {
                    showStatusModal('Error', (res && res.message) ? res.message : 'Failed to load Dean\'s List.', 'error')
                }
            },
            error: function (xhr) {
                showStatusModal('Error', 'Failed to load Dean\'s List.', 'error')
                console.error(xhr)
            }
        })
    }

    function loadAll() {
        loadAnnouncements()
        loadEvents()
        loadDeansList()
    }

    // -----------------------------
    // Create handlers
    // -----------------------------

    $('#createAnnouncementForm').on('submit', function (e) {
        e.preventDefault()

        const title = $('#announcementTitle').val().trim()
        const content = $('#announcementContent').val().trim()
        const date = $('#announcementDate').val()
        const file = $('#announcementImage')[0]?.files?.[0] || null

        if (!title || !content || !date) {
            showStatusModal('Validation Error', 'Title, content, and date are required.', 'error')
            return
        }

        const fd = new FormData()
        fd.append('title', title)
        fd.append('content', content)
        fd.append('announcement_date', date)
        if (file) fd.append('image', file)

        $.ajax({
            url: API.announcements.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    showStatusModal('Success', res.message || 'Announcement created.', 'success')
                    $('#createAnnouncementForm')[0].reset()
                    loadAnnouncements()
                } else {
                    showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to create announcement.', 'error')
                }
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to create announcement.'
                showStatusModal('Failed', msg, 'error')
                console.error(xhr)
            }
        })
    })

    $('#createEventForm').on('submit', function (e) {
        e.preventDefault()

        const title = $('#eventTitle').val().trim()
        const type = $('#eventType').val()
        const description = $('#eventDescription').val().trim()
        const date = $('#eventDate').val()
        const file = $('#eventImage')[0]?.files?.[0] || null

        if (!title || !type || !description || !date) {
            showStatusModal('Validation Error', 'Title, type, description, and date are required.', 'error')
            return
        }

        const fd = new FormData()
        fd.append('title', title)
        fd.append('type', type)
        fd.append('description', description)
        fd.append('event_date', date)
        if (file) fd.append('image', file)

        $.ajax({
            url: API.events.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    showStatusModal('Success', res.message || 'Event/Achievement created.', 'success')
                    $('#createEventForm')[0].reset()
                    loadEvents()
                } else {
                    showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to create event/achievement.', 'error')
                }
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to create event/achievement.'
                showStatusModal('Failed', msg, 'error')
                console.error(xhr)
            }
        })
    })

    $('#createDeansListForm').on('submit', function (e) {
        e.preventDefault()

        const academicYear = $('#deansListYear').val().trim()
        const semester = $('#deansListSemester').val()
        const file = $('#deansListFile')[0]?.files?.[0] || null

        if (!academicYear || !semester || !file) {
            showStatusModal('Validation Error', 'Academic year, semester, and a PDF file are required.', 'error')
            return
        }

        const fd = new FormData()
        fd.append('academic_year', academicYear)
        fd.append('semester', semester)
        fd.append('pdf_file', file)

        $.ajax({
            url: API.deansList.create,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    showStatusModal('Success', res.message || "Dean's List uploaded.", 'success')
                    $('#createDeansListForm')[0].reset()
                    loadDeansList()
                } else {
                    showStatusModal('Failed', (res && res.message) ? res.message : "Failed to upload Dean's List.", 'error')
                }
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || "Failed to upload Dean's List."
                showStatusModal('Failed', msg, 'error')
                console.error(xhr)
            }
        })
    })

    // -----------------------------
    // Edit handlers
    // -----------------------------

    $(document).on('click', '.edit-announcement-btn', function () {
        const id = parseInt($(this).data('id'))
        const a = cachedAnnouncements.find(x => parseInt(x.announcement_id) === id)
        if (!a) {
            showStatusModal('Error', 'Announcement not found.', 'error')
            return
        }

        $('#editAnnouncementId').val(a.announcement_id)
        $('#editAnnouncementTitle').val(a.title)
        $('#editAnnouncementContent').val(a.content)
        $('#editAnnouncementDate').val(a.announcement_date)
        $('#editAnnouncementImage').val('')

        new bootstrap.Modal(document.getElementById('editAnnouncementModal')).show()
    })

    $('#editAnnouncementForm').on('submit', function (e) {
        e.preventDefault()

        const id = $('#editAnnouncementId').val()
        const title = $('#editAnnouncementTitle').val().trim()
        const content = $('#editAnnouncementContent').val().trim()
        const date = $('#editAnnouncementDate').val()
        const file = $('#editAnnouncementImage')[0]?.files?.[0] || null

        if (!id || !title || !content || !date) {
            showStatusModal('Validation Error', 'Title, content, and date are required.', 'error')
            return
        }

        const fd = new FormData()
        fd.append('announcement_id', id)
        fd.append('title', title)
        fd.append('content', content)
        fd.append('announcement_date', date)
        if (file) fd.append('image', file)

        $.ajax({
            url: API.announcements.update,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    bootstrap.Modal.getInstance(document.getElementById('editAnnouncementModal'))?.hide()
                    showStatusModal('Success', res.message || 'Announcement updated.', 'success')
                    loadAnnouncements()
                } else {
                    showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to update announcement.', 'error')
                }
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to update announcement.'
                showStatusModal('Failed', msg, 'error')
                console.error(xhr)
            }
        })
    })

    $(document).on('click', '.edit-event-btn', function () {
        const id = parseInt($(this).data('id'))
        const ev = cachedEvents.find(x => parseInt(x.id) === id)
        if (!ev) {
            showStatusModal('Error', 'Event/Achievement not found.', 'error')
            return
        }

        $('#editEventId').val(ev.id)
        $('#editEventTitle').val(ev.title)
        $('#editEventType').val(ev.type)
        $('#editEventDescription').val(ev.description)
        $('#editEventDate').val(ev.event_date)
        $('#editEventImage').val('')

        new bootstrap.Modal(document.getElementById('editEventModal')).show()
    })

    $('#editEventForm').on('submit', function (e) {
        e.preventDefault()

        const id = $('#editEventId').val()
        const title = $('#editEventTitle').val().trim()
        const type = $('#editEventType').val()
        const description = $('#editEventDescription').val().trim()
        const date = $('#editEventDate').val()
        const file = $('#editEventImage')[0]?.files?.[0] || null

        if (!id || !title || !type || !description || !date) {
            showStatusModal('Validation Error', 'Title, type, description, and date are required.', 'error')
            return
        }

        const fd = new FormData()
        fd.append('id', id)
        fd.append('title', title)
        fd.append('type', type)
        fd.append('description', description)
        fd.append('event_date', date)
        if (file) fd.append('image', file)

        $.ajax({
            url: API.events.update,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    bootstrap.Modal.getInstance(document.getElementById('editEventModal'))?.hide()
                    showStatusModal('Success', res.message || 'Event/Achievement updated.', 'success')
                    loadEvents()
                } else {
                    showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to update event/achievement.', 'error')
                }
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to update event/achievement.'
                showStatusModal('Failed', msg, 'error')
                console.error(xhr)
            }
        })
    })

    // -----------------------------
    // Delete handlers
    // -----------------------------

    $(document).on('click', '.delete-announcement-btn', function () {
        const id = $(this).data('id')
        const title = $(this).data('title') || 'this announcement'

        showConfirmation(`Are you sure you want to remove "${title}"?`, function () {
            $.ajax({
                url: API.announcements.del,
                method: 'POST',
                dataType: 'json',
                data: { announcement_id: id },
                success: function (res) {
                    if (res && res.success) {
                        showStatusModal('Success', res.message || 'Announcement deleted.', 'success')
                        loadAnnouncements()
                    } else {
                        showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to delete announcement.', 'error')
                    }
                },
                error: function (xhr) {
                    showStatusModal('Failed', xhr.responseJSON?.message || 'Failed to delete announcement.', 'error')
                    console.error(xhr)
                }
            })
        })
    })

    $(document).on('click', '.delete-event-btn', function () {
        const id = $(this).data('id')
        const title = $(this).data('title') || 'this item'

        showConfirmation(`Are you sure you want to remove "${title}"?`, function () {
            $.ajax({
                url: API.events.del,
                method: 'POST',
                dataType: 'json',
                data: { id: id },
                success: function (res) {
                    if (res && res.success) {
                        showStatusModal('Success', res.message || 'Event/Achievement deleted.', 'success')
                        loadEvents()
                    } else {
                        showStatusModal('Failed', (res && res.message) ? res.message : 'Failed to delete event/achievement.', 'error')
                    }
                },
                error: function (xhr) {
                    showStatusModal('Failed', xhr.responseJSON?.message || 'Failed to delete event/achievement.', 'error')
                    console.error(xhr)
                }
            })
        })
    })

    $(document).on('click', '.delete-deanslist-btn', function () {
        const id = $(this).data('id')
        const title = $(this).data('title') || "this Dean's List"

        showConfirmation(`Are you sure you want to remove ${title}?`, function () {
            $.ajax({
                url: API.deansList.del,
                method: 'POST',
                dataType: 'json',
                data: { id: id },
                success: function (res) {
                    if (res && res.success) {
                        showStatusModal('Success', res.message || "Dean's List deleted.", 'success')
                        loadDeansList()
                    } else {
                        showStatusModal('Failed', (res && res.message) ? res.message : "Failed to delete Dean's List.", 'error')
                    }
                },
                error: function (xhr) {
                    showStatusModal('Failed', xhr.responseJSON?.message || "Failed to delete Dean's List.", 'error')
                    console.error(xhr)
                }
            })
        })
    })

    // -----------------------------
    // Init
    // -----------------------------

    if (!checkSuperAdminSession()) {
        return
    }

    loadAll()
})

