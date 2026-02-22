$(document).ready(function () {
    // LAST UPDATED: 2026-01-28 - Circular profile card design

    let facultyData = [];
    let addImageFile = null;
    let editImageFile = null;
    let editingId = null;
    const baseUrl = window.baseUrl || '/ccis_connect/';
    const VP_TYPES = [
        'VP for Academics and Quality Assurance',
        'VP for Research, Development and Extension',
        'VP for Administration and Finance',
        'VP for Student Affairs and Services'
    ];

    function applyAddPositionRules(position) {
        const p = String(position || '').trim();
        $('#add-vp-type-wrapper, #add-course-wrapper').hide();
        $('#add-vp-type, #add-course').val('');
        $('#add-advisory-check').prop('checked', false);
        $('.add-advisory-section').hide();
        $('#add-year, #add-section').val('');
        if (p === 'Vice President') {
            $('#add-vp-type-wrapper').show();
        } else if (p === 'Chairperson') {
            $('#add-course-wrapper').show();
        }
    }

    function applyEditPositionRules(position) {
        const p = String(position || '').trim();
        $('#edit-vp-type-wrapper, #edit-course-wrapper').hide();
        $('#edit-advisory-check').prop('checked', false);
        $('.edit-advisory-section').hide();
        $('#edit-year, #edit-section').val('');
        if (p === 'Vice President') {
            $('#edit-vp-type-wrapper').show();
        } else if (p === 'Chairperson') {
            $('#edit-course-wrapper').show();
        }
    }

    /* ================= HEADER & USER INFO SETUP ================= */
    function setupUserInfo() {
        const session = window.checkUserSession();
        if (session && session.isValid) {
            // Update user name
            $('[id*="admin-name"], [id*="welcome-admin-name"], #user-name').text(session.user.name);
            $('#user-role').text('Super Admin');
        }
    }

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

    /* ================= NAVIGATION SETUP ================= */
    function setupSectionNavigation() {
        // Handle navigation clicks - navigate to dashboard
        $('.navbar-main .nav-link[data-section]').on('click', function(e) {
            e.preventDefault();
            const targetSection = $(this).data('section');
            // Navigate to dashboard with the section hash
            window.location.href = baseUrl + 'admin#' + targetSection;
        });

        // Highlight Content Management nav item since we're on this page
        $('.navbar-main .nav-link').removeClass('active');
        $('.navbar-main .nav-link[data-section="content-management"]').addClass('active');
    }

    // Initialize
    setupUserInfo();
    updateCurrentDate();
    setupSectionNavigation();
    
    // Update date every minute
    setInterval(updateCurrentDate, 60000);

    /* ================= NOTIFICATION MODAL ================= */
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
        
        // Remove old modal if exists
        $('#notificationModal').remove();
        
        $('body').append(notificationModal);
        new bootstrap.Modal(document.getElementById('notificationModal')).show();
        
        // Auto cleanup
        document.getElementById('notificationModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        }, { once: true });
    }

    /* ================= SIMPLE IMAGE PICKER FOR ADD MODAL ================= */
    function initAddImagePicker() {
        const fileInput = document.getElementById('add-image-input');
        const uploadArea = document.getElementById('add-upload-area');
        const previewImg = document.getElementById('add-image-preview');

        if (!fileInput || !uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                addImageFile = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block';
                    uploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    /* ================= SIMPLE IMAGE PICKER FOR EDIT MODAL ================= */
    function initEditImagePicker() {
        const fileInput = document.getElementById('edit-image-input');
        const uploadArea = document.getElementById('edit-upload-area');
        const previewImg = document.getElementById('edit-image-preview');

        if (!fileInput || !uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                editImageFile = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block';
                    uploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // Initialize when modals are shown
    $('#addFacultyModal').on('shown.bs.modal', function() {
        initAddImagePicker();
        applyAddPositionRules($('#add-position').val());
        
        // Advisory checkbox toggle
        $('#add-advisory-check').on('change', function() {
            if ($('#add-position').val() !== 'Instructor') {
                $(this).prop('checked', false);
                return;
            }
            if ($(this).is(':checked')) {
                $('.add-advisory-section').slideDown();
            } else {
                $('.add-advisory-section').slideUp();
                $('#add-year').val('');
                $('#add-section').val('');
            }
        });
        $('#add-position').off('change').on('change', function() {
            applyAddPositionRules($(this).val());
        });
        
        // Make image clickable to change
        $(document).on('click', '#add-image-preview', function() {
            $('#add-image-input').click();
        });
    });

    $('#editFacultyModal').on('shown.bs.modal', function() {
        initEditImagePicker();
        applyEditPositionRules($('#edit-position').val());
        
        // Advisory checkbox toggle
        $('#edit-advisory-check').on('change', function() {
            if ($('#edit-position').val() !== 'Instructor') {
                $(this).prop('checked', false);
                return;
            }
            if ($(this).is(':checked')) {
                $('.edit-advisory-section').slideDown();
            } else {
                $('.edit-advisory-section').slideUp();
                $('#edit-year').val('');
                $('#edit-section').val('');
            }
        });
        $('#edit-position').off('change').on('change', function() {
            applyEditPositionRules($(this).val());
        });
        
        // Make image clickable to change
        $(document).on('click', '#edit-image-preview', function() {
            $('#edit-image-input').click();
        });
    });

    /* ================= ADD FACULTY ================= */
    $(document).on('submit', '#add-faculty-form', function (e) {
        e.preventDefault();

        const firstName = $('#add-firstname').val().trim();
        const lastName = $('#add-lastname').val().trim();
        const position = $('#add-position').val().trim();
        const vpType = ($('#add-vp-type').val() || '').trim();
        const course = ($('#add-course').val() || '').trim();
        const year = $('#add-year').val().trim();
        const section = $('#add-section').val().trim();
        
        // Combine year and section for advisory field
        let advisory = '';
        if (year && section) {
            advisory = year + ' - ' + section;
        } else if (year) {
            advisory = year;
        } else if (section) {
            advisory = section;
        }

        // Validation
        if (!firstName || !lastName || !position) {
            showNotification('error', 'Please fill in First Name, Last Name, and Position');
            return;
        }
        if (position === 'Vice President' && !VP_TYPES.includes(vpType)) {
            showNotification('error', 'Please select a valid Vice President type');
            return;
        }
        if (position === 'Chairperson' && !course) {
            showNotification('error', 'Please select a course for Chairperson');
            return;
        }

        if (!addImageFile) {
            showNotification('error', 'Please select an image');
            return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('firstname', firstName);
        formData.append('lastname', lastName);
        formData.append('position', position);
        formData.append('advisory', advisory);
        formData.append('vp_type', vpType);
        formData.append('course', course);
        formData.append('image', addImageFile);

        // Submit
        $.ajax({
            url: baseUrl + 'admin/AdminContent/save_faculty',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showNotification('success', 'Faculty added successfully!');
                    resetAddForm();
                    $('#addFacultyModal').modal('hide');
                    loadFaculty();
                } else {
                    showNotification('error', response.message || 'Failed to add faculty');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to save faculty';
                showNotification('error', msg);
            }
        });
    });

    function resetAddForm() {
        $('#add-faculty-form')[0].reset();
        $('#add-vp-type-wrapper, #add-course-wrapper').hide();
        $('.add-advisory-section').hide();
        document.getElementById('add-image-input').value = '';
        document.getElementById('add-image-preview').style.display = 'none';
        document.getElementById('add-upload-area').style.display = 'flex';
        addImageFile = null;
    }

    /* ================= EDIT FACULTY ================= */
    $(document).on('click', '.btn-edit-faculty', function() {
        const id = $(this).data('id');
        const faculty = facultyData.find(f => f.id == id);
        
        if (!faculty) return;

        editingId = id;
        $('#edit-firstname').val(faculty.firstname);
        $('#edit-lastname').val(faculty.lastname);
        $('#edit-position').val(faculty.position);
        $('#edit-vp-type').val(faculty.vp_type || '');
        $('#edit-course').val(faculty.course || '');
        applyEditPositionRules(faculty.position);
        
        // Parse advisory field to extract year and section
        let year = '';
        let section = '';
        let hasAdvisory = false;
        
        if (faculty.advisory) {
            hasAdvisory = true;
            const parts = faculty.advisory.split(' - ');
            if (parts.length === 2) {
                year = parts[0];
                section = parts[1];
            } else if (parts[0].includes('Year')) {
                year = parts[0];
            } else if (parts[0].includes('Section')) {
                section = parts[0];
            }
        }
        
        // Set checkbox and show/hide fields
        $('#edit-advisory-check').prop('checked', hasAdvisory && faculty.position === 'Instructor');
        if (hasAdvisory && faculty.position === 'Instructor') {
            $('.edit-advisory-section').show();
        } else {
            $('.edit-advisory-section').hide();
        }
        
        $('#edit-year').val(year);
        $('#edit-section').val(section);

        // Show existing image
        const imageUrl = faculty.image && faculty.image.startsWith('http') 
            ? faculty.image 
            : (baseUrl + 'uploads/faculty/' + faculty.image);
        
        document.getElementById('edit-image-preview').src = imageUrl;
        document.getElementById('edit-image-preview').style.display = 'block';
        document.getElementById('edit-upload-area').style.display = 'none';
        editImageFile = null;

        new bootstrap.Modal(document.getElementById('editFacultyModal')).show();
    });

    $(document).on('submit', '#edit-faculty-form', function (e) {
        e.preventDefault();

        const firstName = $('#edit-firstname').val().trim();
        const lastName = $('#edit-lastname').val().trim();
        const position = $('#edit-position').val().trim();
        const vpType = ($('#edit-vp-type').val() || '').trim();
        const course = ($('#edit-course').val() || '').trim();
        const year = $('#edit-year').val().trim();
        const section = $('#edit-section').val().trim();
        
        // Combine year and section for advisory field
        let advisory = '';
        if (year && section) {
            advisory = year + ' - ' + section;
        } else if (year) {
            advisory = year;
        } else if (section) {
            advisory = section;
        }

        if (!firstName || !lastName || !position) {
            showNotification('error', 'Please fill in all required fields');
            return;
        }
        if (position === 'Vice President' && !VP_TYPES.includes(vpType)) {
            showNotification('error', 'Please select a valid Vice President type');
            return;
        }
        if (position === 'Chairperson' && !course) {
            showNotification('error', 'Please select a course for Chairperson');
            return;
        }

        const formData = new FormData();
        formData.append('id', editingId);
        formData.append('firstname', firstName);
        formData.append('lastname', lastName);
        formData.append('position', position);
        formData.append('advisory', advisory);
        formData.append('vp_type', vpType);
        formData.append('course', course);
        if (editImageFile) {
            formData.append('image', editImageFile);
        }

        $.ajax({
            url: baseUrl + 'admin/AdminContent/update_faculty',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showNotification('success', 'Faculty updated successfully!');
                    $('#editFacultyModal').modal('hide');
                    loadFaculty();
                } else {
                    showNotification('error', response.message || 'Failed to update faculty');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to update faculty';
                showNotification('error', msg);
            }
        });
    });

    /* ================= DELETE FACULTY ================= */
    $(document).on('click', '.btn-delete-faculty', function() {
        const id = $(this).data('id');
        const faculty = facultyData.find(f => f.id == id);
        
        if (!faculty) return;

        if (confirm(`Delete ${faculty.firstname} ${faculty.lastname}?`)) {
            $.ajax({
                url: baseUrl + 'admin/AdminContent/delete_faculty',
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showNotification('success', 'Faculty deleted successfully!');
                        loadFaculty();
                    } else {
                        showNotification('error', response.message || 'Failed to delete');
                    }
                },
                error: function(xhr) {
                    const msg = xhr.responseJSON?.message || 'Failed to delete faculty';
                    showNotification('error', msg);
                }
            });
        }
    });

    /* ================= LOAD & RENDER ================= */
    function loadFaculty() {
        $.ajax({
            url: baseUrl + 'admin/AdminContent/load_faculty',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    facultyData = response.data || [];
                    renderFaculty();
                }
            },
            error: function(xhr) {
                console.error('Error loading faculty:', xhr);
            }
        });
    }

    function renderFaculty() {
        const list = $('#faculty-list');
        list.empty();

        if (!facultyData || facultyData.length === 0) {
            list.html('<p class="text-muted text-center col-12">No faculty members yet.</p>');
            return;
        }

        facultyData.forEach(f => {
            const imageUrl = f.image && f.image.startsWith('http') 
                ? f.image 
                : (baseUrl + 'uploads/faculty/' + f.image);
            
            list.append(`
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="faculty-card">
                        <div class="faculty-card-image-wrapper">
                            <img src="${imageUrl}" alt="${f.firstname} ${f.lastname}">
                        </div>
                        <div class="faculty-info">
                            <h5>${f.firstname} ${f.lastname}</h5>
                            <p class="position">${f.position}</p>
                            ${f.vp_type ? `<p class="advisory"><i class="fas fa-network-wired"></i> ${f.vp_type}</p>` : ''}
                            ${f.course ? `<p class="advisory"><i class="fas fa-book"></i> ${f.course}</p>` : ''}
                            ${f.advisory ? `<p class="advisory"><i class="fas fa-book-reader"></i> ${f.advisory}</p>` : ''}
                            <div class="faculty-actions">
                                <button class="btn btn-warning btn-edit-faculty" data-id="${f.id}" title="Edit Faculty">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-danger btn-delete-faculty" data-id="${f.id}" title="Delete Faculty">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Initial load
    loadFaculty();
});
