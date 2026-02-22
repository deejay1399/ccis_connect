// Admin Manage Forms JavaScript - Connected to Backend

(function($) {
    'use strict';

    $(document).ready(function() {
        console.log('🔐 Manage Forms Page Loading...');
        
        const BASE_URL = $('base').attr('href') || '/ccis_connect/';
        
        // Initialize on page load
        initializeManageForms();

        // Initialize manage forms
        function initializeManageForms() {
            loadFormsList();
            bindUploadForm();
            bindEditForm();
            bindDeleteForm();
        }

        // Load all forms from database
        function loadFormsList() {
            $.ajax({
                url: BASE_URL + 'index.php/FormsController/get_forms',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        displayFormsList(response.data);
                        console.log('✅ Forms loaded successfully:', response.data.length);
                    } else {
                        showNotification('Failed to load forms', 'error');
                        console.error('Error loading forms');
                    }
                },
                error: function(error) {
                    showNotification('Error loading forms', 'error');
                    console.error('AJAX error:', error);
                }
            });
        }

        // Display forms as cards
        function displayFormsList(forms) {
            const $formsList = $('#forms-list');
            $formsList.empty();

            if (forms.length === 0) {
                $formsList.html('<div class="col-12"><p class="text-muted text-center py-5">No forms uploaded yet. Create your first form above!</p></div>');
                return;
            }

            forms.forEach(form => {
                const formCard = `
                    <div class="col">
                        <div class="card h-100 form-card shadow-sm hover-card">
                            <div class="card-body">
                                <div class="d-flex align-items-start mb-3">
                                    <div class="flex-grow-1">
                                        <h5 class="card-title mb-1"><i class="fas fa-file-pdf text-danger me-2"></i>${escapeHtml(form.title)}</h5>
                                        <small class="text-muted d-block">
                                            <i class="fas fa-calendar me-1"></i>${formatDate(form.created_at)}
                                        </small>
                                    </div>
                                    <span class="badge bg-success">Active</span>
                                </div>
                                <div class="text-muted small mb-3 border-top pt-2">
                                    <div><i class="fas fa-file me-1"></i> <strong>File:</strong> ${escapeHtml(form.original_filename)}</div>
                                    <div><i class="fas fa-database me-1"></i> <strong>Size:</strong> ${formatFileSize(form.file_size)}</div>
                                </div>
                            </div>
                            <div class="card-footer bg-white border-top">
                                <div class="btn-group w-100" role="group">
                                    <a href="${BASE_URL}${form.file_url}" target="_blank" class="btn btn-sm btn-outline-primary" title="Download Form">
                                        <i class="fas fa-download me-1"></i>Download
                                    </a>
                                    <button type="button" class="btn btn-sm btn-outline-info edit-form-btn" data-form-id="${form.id}" data-form-title="${escapeHtml(form.title)}" title="Edit Form">
                                        <i class="fas fa-edit me-1"></i>Edit
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-danger delete-form-btn" data-form-id="${form.id}" title="Delete Form">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $formsList.append(formCard);
            });

            bindEditButtons();
            bindDeleteButtons();
        }

        // Bind upload form submit handler
        function bindUploadForm() {
            $('#uploadForm').on('submit', function(e) {
                e.preventDefault();

                const formTitle = $('#formTitle').val().trim();
                const fileInput = $('#formFile')[0];
                const file = fileInput.files[0];

                // Validation
                if (!formTitle) {
                    showNotification('Please enter a form name', 'warning');
                    return;
                }

                if (!file) {
                    showNotification('Please select a file', 'warning');
                    return;
                }

                if (!isAllowedDocumentFile(file)) {
                    showNotification('Only PDF, DOC, and DOCX files are allowed', 'error');
                    return;
                }

                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    showNotification('File size exceeds 10MB limit', 'error');
                    return;
                }

                uploadForm(formTitle, file);
            });
        }

        // Upload form via AJAX
        function uploadForm(title, file) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('file', file);

            const $btn = $('#uploadFormBtn');
            const originalText = $btn.html();
            $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Uploading...').prop('disabled', true);

            $.ajax({
                url: BASE_URL + 'index.php/FormsController/upload_form',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showNotification('Form uploaded successfully!', 'success');
                        $('#uploadForm')[0].reset();
                        loadFormsList();
                    } else {
                        showNotification(response.message || 'Upload failed', 'error');
                    }
                },
                error: function(xhr) {
                    let errorMsg = 'Upload failed';
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response && response.message) {
                            errorMsg = response.message;
                        }
                    } catch (e) {
                        errorMsg = 'Server error (Status: ' + xhr.status + ')';
                    }
                    console.error('Upload error response:', xhr.responseText);
                    showNotification(errorMsg, 'error');
                },
                complete: function() {
                    $btn.html(originalText).prop('disabled', false);
                }
            });
        }

        // Bind edit form modal handler
        function bindEditForm() {
            $('#editFormDetails').on('submit', function(e) {
                e.preventDefault();

                const formId = $('#editFormId').val();
                const formTitle = $('#editFormTitle').val().trim();
                const fileInput = $('#editFormFile')[0];
                const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

                if (!formTitle) {
                    showNotification('Please enter a form name', 'warning');
                    return;
                }

                // Validate file if provided
                if (file) {
                    if (!isAllowedDocumentFile(file)) {
                        showNotification('Only PDF, DOC, and DOCX files are allowed', 'error');
                        return;
                    }

                    const maxSize = 10 * 1024 * 1024;
                    if (file.size > maxSize) {
                        showNotification('File size exceeds 10MB limit', 'error');
                        return;
                    }
                }

                updateForm(formId, formTitle, file);
            });
        }

        // Update form via AJAX
        function updateForm(formId, title, file) {
            const formData = new FormData();
            formData.append('form_id', formId);
            formData.append('title', title);
            if (file) {
                formData.append('file', file);
            }

            const $btn = $('#saveChangesBtn');
            const originalText = $btn.html();
            $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);

            $.ajax({
                url: BASE_URL + 'index.php/FormsController/update_form',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showNotification('Form updated successfully!', 'success');
                        try {
                            bootstrap.Modal.getInstance(document.getElementById('editFormModal')).hide();
                        } catch (e) {}
                        loadFormsList();
                    } else {
                        showNotification(response.message || 'Update failed', 'error');
                    }
                },
                error: function(xhr) {
                    let errorMsg = 'Update failed';
                    try {
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            errorMsg = xhr.responseJSON.message;
                        }
                    } catch (e) {}
                    showNotification(errorMsg, 'error');
                },
                complete: function() {
                    $btn.html(originalText).prop('disabled', false);
                }
            });
        }

        // Bind edit buttons
        function bindEditButtons() {
            $('.edit-form-btn').off('click').on('click', function() {
                const formId = $(this).data('form-id');
                const formTitle = $(this).data('form-title');

                $('#editFormId').val(formId);
                $('#editFormTitle').val(formTitle);
                $('#editFormFile').val('');

                try {
                    const modal = new bootstrap.Modal(document.getElementById('editFormModal'));
                    modal.show();
                } catch (e) {
                    console.error('Modal error:', e);
                }
            });
        }

        // Bind delete buttons
        function bindDeleteButtons() {
            $('.delete-form-btn').off('click').on('click', function() {
                window.formIdToDelete = $(this).data('form-id');
                try {
                    const modal = new bootstrap.Modal(document.getElementById('removeFormModal'));
                    modal.show();
                } catch (e) {
                    console.error('Modal error:', e);
                }
            });
        }

        // Bind delete form confirmation
        function bindDeleteForm() {
            $('#confirmRemoveBtn').off('click').on('click', function() {
                if (window.formIdToDelete) {
                    deleteForm(window.formIdToDelete);
                    try {
                        bootstrap.Modal.getInstance(document.getElementById('removeFormModal')).hide();
                    } catch (e) {}
                }
            });
        }

        // Delete form via AJAX
        function deleteForm(formId) {
            $.ajax({
                url: BASE_URL + 'index.php/FormsController/delete_form',
                type: 'POST',
                data: { form_id: formId },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showNotification('Form deleted successfully!', 'success');
                        loadFormsList();
                    } else {
                        showNotification(response.message || 'Delete failed', 'error');
                    }
                },
                error: function() {
                    showNotification('Error deleting form', 'error');
                }
            });
        }

        // Show notification
        function showNotification(message, type = 'info') {
            const notificationClass = type === 'error' ? 'alert-danger' : 
                                     type === 'success' ? 'alert-success' : 
                                     type === 'warning' ? 'alert-warning' :
                                     'alert-info';
            
            const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                             type === 'success' ? 'fa-check-circle' : 
                             type === 'warning' ? 'fa-exclamation-triangle' :
                             'fa-info-circle';
            
            const notification = $(`
                <div class="alert ${notificationClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 500px;">
                    <div class="d-flex align-items-center">
                        <i class="fas ${iconClass} me-2"></i>
                        <span class="flex-grow-1">${escapeHtml(message)}</span>
                        <button type="button" class="btn-close btn-close-sm" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>
            `);
            
            $('body').append(notification);
            
            setTimeout(() => {
                notification.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
        }

        // Format date
        function formatDate(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                return dateString;
            }
        }

        // Format file size
        function formatFileSize(bytes) {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (Math.round(bytes / Math.pow(k, i) * 100) / 100) + ' ' + sizes[i];
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        function isAllowedDocumentFile(file) {
            if (!file || !file.name) return false;

            const allowedMimes = [
                'application/pdf',
                'application/msword',
                'application/vnd.ms-word',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const mime = (file.type || '').toLowerCase();
            const extension = file.name.split('.').pop().toLowerCase();
            const allowedExtensions = ['pdf', 'doc', 'docx'];

            if (allowedMimes.includes(mime)) {
                return true;
            }

            return allowedExtensions.includes(extension);
        }

        console.log('✅ Manage Forms Page initialized successfully');
    });
})(jQuery);
