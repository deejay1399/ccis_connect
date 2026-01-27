// MANAGE HOMEPAGE - Super Admin Functional Form Handler

$(document).ready(function() {
    console.log('🏠 Manage Homepage Loading...');
    
    // Initialize baseUrl
    if (!window.baseUrl) {
        window.baseUrl = window.location.origin + '/ccis_connect/';
    }
    
    console.log('Base URL:', window.baseUrl);
    
    // Modal for notifications
    function showModalNotification(title, message, type = 'success') {
        console.log('Showing modal:', title, message, type);
        
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const modalHTML = `
            <div class="modal fade" id="notificationModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-body text-center py-4">
                            <i class="fas ${iconClass} fa-3x mb-3" style="color: ${type === 'success' ? '#28a745' : '#dc3545'};"></i>
                            <h5 class="modal-title mb-2">${title}</h5>
                            <p class="text-muted mb-0">${message}</p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        $('#notificationModal').remove();
        $('body').append(modalHTML);
        
        // Wait a moment for DOM to update, then show modal
        setTimeout(function() {
            try {
                const modalElement = document.getElementById('notificationModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Auto-close after 5 seconds
                setTimeout(() => {
                    try {
                        modal.hide();
                    } catch(e) {
                        console.log('Modal close error:', e);
                    }
                }, 5000);
            } catch(e) {
                console.error('Modal display error:', e);
            }
        }, 100);
    }
    
    // Load existing homepage data
    function loadHomepageData() {
        console.log('Loading homepage data from:', window.baseUrl + 'admin/manage/load_homepage');
        
        $.ajax({
            url: window.baseUrl + 'admin/manage/load_homepage',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('✅ Loaded data:', response);
                if (response.success && response.data) {
                    const data = response.data;
                    $('#homepageTitle').val(data.title || '');
                    $('#homepageContent').val(data.content || '');
                    
                    if (data.banner_image) {
                        const imageHtml = `
                            <div class="mt-2">
                                <p class="text-muted small">Current Image:</p>
                                <img src="${window.baseUrl}${data.banner_image}" alt="Banner" style="max-width: 300px; max-height: 200px; border-radius: 4px;">
                            </div>
                        `;
                        $('#banner-preview').html(imageHtml);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.log('Load error:', error, xhr.responseText);
            }
        });
    }
    
    // Handle form submission
    $('#homepage-form').on('submit', function(e) {
        e.preventDefault();
        
        const title = $('#homepageTitle').val().trim();
        const content = $('#homepageContent').val().trim();
        const bannerFile = $('#homepageBanner')[0].files[0];
        
        // Validation
        if (!title) {
            showModalNotification('Validation Error', 'Please enter a homepage title', 'error');
            return;
        }
        
        if (!content) {
            showModalNotification('Validation Error', 'Please enter homepage content', 'error');
            return;
        }
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        if (bannerFile) {
            // Validate file size (max 5MB)
            if (bannerFile.size > 5 * 1024 * 1024) {
                showModalNotification('File Error', 'Image size must be less than 5MB', 'error');
                return;
            }
            
            // Validate file type
            if (!bannerFile.type.startsWith('image/')) {
                showModalNotification('File Error', 'Please upload a valid image file', 'error');
                return;
            }
            
            formData.append('banner_image', bannerFile);
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);
        
        console.log('Submitting form to:', window.baseUrl + 'admin/manage/save_homepage');
        console.log('Form data - Title:', title, 'Content:', content, 'File:', bannerFile ? 'Yes' : 'No');
        
        // Submit via AJAX
        $.ajax({
            url: window.baseUrl + 'admin/manage/save_homepage',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            timeout: 10000,
            success: function(response) {
                console.log('✅ Response received:', response);
                
                if (response.success) {
                    console.log('✅ Save successful!');
                    showModalNotification(
                        'Success!', 
                        'Homepage content has been saved successfully.',
                        'success'
                    );
                    
                    // Reset form
                    $('#homepage-form')[0].reset();
                    $('#banner-preview').html('');
                    
                    // Reload data to show current image
                    setTimeout(() => {
                        loadHomepageData();
                    }, 1500);
                } else {
                    console.log('❌ Save failed:', response.message);
                    showModalNotification(
                        'Error',
                        response.message || 'Failed to save homepage content',
                        'error'
                    );
                }
            },
            error: function(xhr, status, error) {
                console.error('❌ AJAX Error:', error, status);
                console.error('Response:', xhr.responseText);
                
                let errorMsg = 'An error occurred while saving. Please try again.';
                
                try {
                    let errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.message) {
                        errorMsg = errorResponse.message;
                    }
                } catch(e) {
                    console.log('Could not parse error response');
                }
                
                if (xhr.status === 413) {
                    errorMsg = 'File size is too large. Please upload a smaller image.';
                }
                
                console.log('Showing error modal with message:', errorMsg);
                showModalNotification('Error', errorMsg, 'error');
            },
            complete: function() {
                submitBtn.html(originalText).prop('disabled', false);
            }
        });
    });
    
    // Preview selected image
    $('#homepageBanner').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageHtml = `
                    <div class="mt-2">
                        <p class="text-muted small">Preview (New Image):</p>
                        <img src="${e.target.result}" alt="Preview" style="max-width: 300px; max-height: 200px; border-radius: 4px;">
                    </div>
                `;
                $('#banner-preview').html(imageHtml);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Load homepage data on page load
    loadHomepageData();
});
