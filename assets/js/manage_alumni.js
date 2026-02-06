$(document).ready(function () {
    const baseUrl = window.baseUrl || '/ccis_connect/';

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

    function statusBadge(status) {
        const normalized = (status || '').toLowerCase();
        let cls = 'secondary';
        if (normalized === 'approved') cls = 'success';
        if (normalized === 'pending') cls = 'warning';
        if (normalized === 'rejected' || normalized === 'hidden') cls = 'danger';
        return `<span class="badge bg-${cls}">${status || 'Pending'}</span>`;
    }

    // ==================== LOADERS ====================
    function loadMentorRequests() {
        $.getJSON(baseUrl + 'admin/manage/alumni/mentor_requests', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const body = $('#mentor-table-body');
            body.empty();

            if (data.length === 0) {
                $('#no-mentor-data').show();
                return;
            }
            $('#no-mentor-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${row.name}</td>
                        <td>${row.email}</td>
                        <td>${row.expertise}</td>
                        <td>${statusBadge(row.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-success btn-mentor-status" data-id="${row.id}" data-status="approved">Approve</button>
                            <button class="btn btn-sm btn-danger btn-mentor-status" data-id="${row.id}" data-status="rejected">Reject</button>
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

            if (data.length === 0) {
                $('#no-chatbot-data').show();
                return;
            }
            $('#no-chatbot-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${row.name}</td>
                        <td>${row.question}</td>
                        <td>${row.category}</td>
                        <td>${formatDate(row.inquiry_date)}</td>
                        <td>${statusBadge(row.status)}</td>
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

            if (data.length === 0) {
                $('#no-connection-data').show();
                return;
            }
            $('#no-connection-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${row.from_name}</td>
                        <td>${row.to_name}</td>
                        <td>${row.message}</td>
                        <td>${formatDate(row.request_date)}</td>
                        <td>${statusBadge(row.status)}</td>
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
                        <td>${row.author}</td>
                        <td>${row.content}</td>
                        <td>${formatDate(row.update_date)}</td>
                        <td>${statusBadge(row.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-success btn-update-status" data-id="${row.id}" data-status="approved">Approve</button>
                            <button class="btn btn-sm btn-danger btn-update-status" data-id="${row.id}" data-status="hidden">Hide</button>
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

            if (data.length === 0) {
                $('#no-giveback-data').show();
                return;
            }
            $('#no-giveback-data').hide();

            data.forEach(row => {
                body.append(`
                    <tr>
                        <td>${row.author}</td>
                        <td>${row.title}</td>
                        <td>${row.description}</td>
                        <td>${formatDate(row.submission_date)}</td>
                        <td>${statusBadge(row.status)}</td>
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
                    ? `<div class="mb-2"><img src="${baseUrl + row.photo}" alt="${row.name}" style="width:100%;height:180px;object-fit:cover;border-radius:6px;"></div>`
                    : '';
                grid.append(`
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                ${photoHtml}
                                <h5 class="card-title">${row.name}</h5>
                                <p class="text-muted mb-2">${row.position}</p>
                                <p class="card-text">${row.bio}</p>
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
                        <td>${row.name}</td>
                        <td>${row.batch}</td>
                        <td>${row.email}</td>
                        <td>${row.phone}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger btn-delete-directory" data-id="${row.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    function loadStories() {
        $.getJSON(baseUrl + 'admin/manage/alumni/stories', function(response) {
            if (!response.success) return;
            const data = response.data || [];
            const grid = $('#stories-grid');
            grid.empty();

            if (data.length === 0) {
                $('#no-stories-data').show();
                return;
            }
            $('#no-stories-data').hide();

            data.forEach(row => {
                const photoHtml = row.photo
                    ? `<div class="mb-2"><img src="${baseUrl + row.photo}" alt="${row.title}" style="width:100%;height:180px;object-fit:cover;border-radius:6px;"></div>`
                    : '';
                grid.append(`
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                ${photoHtml}
                                <h5 class="card-title">${row.title}</h5>
                                <p class="text-muted mb-2">By ${row.author}</p>
                                <p class="card-text">${row.content}</p>
                            </div>
                            <div class="card-footer text-end">
                                <button class="btn btn-sm btn-outline-danger btn-delete-story" data-id="${row.id}">Delete</button>
                            </div>
                        </div>
                    </div>
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
                    ? `<div class="mb-2"><img src="${baseUrl + row.photo}" alt="${row.name}" style="width:100%;height:180px;object-fit:cover;border-radius:6px;"></div>`
                    : '';
                grid.append(`
                    <div class="col-md-4">
                        <div class="card h-100">
                            <div class="card-body">
                                ${photoHtml}
                                <h5 class="card-title">${row.name}</h5>
                                <p class="text-muted mb-1">${formatDate(row.event_date)} | ${row.location}</p>
                                <p class="card-text">${row.description}</p>
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

    // ==================== ACTIONS ====================
    $(document).on('click', '.btn-mentor-status', function () {
        const id = $(this).data('id');
        const status = $(this).data('status');
        $.post(baseUrl + 'admin/manage/alumni/mentor_status', { id, status }, function(response) {
            if (response.success) {
                loadMentorRequests();
            } else {
                showNotification('error', response.message || 'Failed to update status');
            }
        }, 'json');
    });

    $(document).on('click', '.btn-update-status', function () {
        const id = $(this).data('id');
        const status = $(this).data('status');
        $.post(baseUrl + 'admin/manage/alumni/update_status', { id, status }, function(response) {
            if (response.success) {
                loadUpdates();
            } else {
                showNotification('error', response.message || 'Failed to update status');
            }
        }, 'json');
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

    $(document).on('submit', '#addStoryForm', function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', $('#storyTitle').val().trim());
        formData.append('author', $('#storyAuthor').val().trim());
        formData.append('content', $('#storyContent').val().trim());
        const photoFile = $('#storyPhoto')[0].files[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        $.ajax({
            url: baseUrl + 'admin/manage/alumni/stories/create',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#addStoryModal').modal('hide');
                    $('#addStoryForm')[0].reset();
                    loadStories();
                    showNotification('success', 'Success story added');
                } else {
                    showNotification('error', response.message || 'Failed to add story');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to add story';
                showNotification('error', msg);
            }
        });
    });

    $(document).on('click', '.btn-delete-story', function () {
        const id = $(this).data('id');
        if (!confirm('Delete this success story?')) return;

        $.post(baseUrl + 'admin/manage/alumni/stories/delete', { id }, function(response) {
            if (response.success) {
                loadStories();
            } else {
                showNotification('error', response.message || 'Failed to delete story');
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
    loadStories();
    loadEvents();
});
