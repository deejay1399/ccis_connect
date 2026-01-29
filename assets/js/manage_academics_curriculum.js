// MANAGE ACADEMICS PAGE - Curriculum Upload Version
// Uses vanilla JavaScript - no jQuery dependency

// Global upload state
let isUploading = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Curriculum Management Initializing...');
    console.log('🔗 API_BASE_URL:', window.API_BASE_URL);
    
    if (!window.API_BASE_URL) {
        console.error('❌ API_BASE_URL not set! Check footer.php');
    }
    
    // Initialize curriculum upload form
    initializeCurriculumUpload();
    
    // Load initial curriculum list
    loadCurriculumList();
    
    console.log('✅ Curriculum Management Ready');
});

// Initialize Curriculum Upload Form
function initializeCurriculumUpload() {
    const form = document.getElementById('uploadCurriculumForm');
    
    if (!form) {
        console.warn('⚠️ Upload form not found');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        // Prevent double submission
        if (isUploading) {
            console.warn('⚠️ Upload already in progress');
            showNotification('Upload already in progress. Please wait...', 'warning');
            return;
        }
        
        const curriculumName = document.getElementById('curriculumName');
        const fileInput = document.getElementById('curriculumFile');
        
        if (!curriculumName || !fileInput) {
            console.error('❌ Form elements not found');
            showNotification('Form elements missing', 'error');
            return;
        }
        
        const name = curriculumName.value.trim();
        
        if (!name) {
            showNotification('Please enter curriculum name', 'warning');
            return;
        }
        
        if (!fileInput.files || !fileInput.files.length) {
            showNotification('Please select a PDF file', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        console.log('📄 File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Validate file type
        if (file.type !== 'application/pdf') {
            showNotification('Only PDF files are allowed. Got: ' + file.type, 'error');
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('File size must be less than 10MB', 'error');
            return;
        }
        
        uploadCurriculumFile(name, file);
    });
}

// Upload Curriculum File
function uploadCurriculumFile(curriculumName, file) {
    // Set uploading flag
    isUploading = true;
    
    const formData = new FormData();
    formData.append('curriculum_name', curriculumName);
    formData.append('file', file);
    
    // Show loading state and disable form
    const form = document.getElementById('uploadCurriculumForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const curriculumName_ = document.getElementById('curriculumName');
    const fileInput = document.getElementById('curriculumFile');
    
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    curriculumName_.disabled = true;
    fileInput.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    const uploadUrl = window.API_BASE_URL + 'upload_curriculum';
    console.log('🚀 Uploading to:', uploadUrl);
    console.log('📦 FormData keys:', Array.from(formData.entries()));
    
    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('📥 Response received:', response.status, response.statusText);
        console.log('📥 Response headers:', response.headers);
        
        // Always try to parse JSON
        return response.text().then(text => {
            console.log('📄 Raw response text:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('❌ Failed to parse JSON:', e);
                throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
            }
        }).then(data => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
            }
            return data;
        });
    })
    .then(data => {
        console.log('✅ Response data:', data);
        
        if (data.success) {
            console.log('✨ Success! File uploaded');
            showNotification('✅ Curriculum uploaded successfully!', 'success');
            form.reset();
            setTimeout(() => loadCurriculumList(), 500);
        } else {
            const errorMsg = data.message || 'Error uploading curriculum';
            console.error('❌ Upload failed:', errorMsg);
            showNotification('Error: ' + errorMsg, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Upload error:', error.message);
        console.error('Full error:', error);
        showNotification('Error: ' + error.message, 'error');
    })
    .finally(() => {
        // Reset uploading flag and re-enable form
        isUploading = false;
        submitBtn.disabled = false;
        curriculumName_.disabled = false;
        fileInput.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Load Curriculum List
function loadCurriculumList() {
    const listUrl = window.API_BASE_URL + 'get_curriculums';
    console.log('📂 Loading from:', listUrl);
    
    fetch(listUrl, {
        method: 'GET'
    })
    .then(response => {
        console.log('📥 List response:', response.status);
        return response.text().then(text => {
            console.log('📄 Raw response:', text.substring(0, 200));
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('❌ Failed to parse JSON:', e);
                throw new Error(`Invalid JSON: ${text.substring(0, 100)}`);
            }
        }).then(data => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
            }
            return data;
        });
    })
    .then(data => {
        console.log('📚 Curriculums loaded:', data);
        const container = document.getElementById('curriculumList');
        
        if (!container) {
            console.warn('⚠️ Curriculum list container not found');
            return;
        }
        
        if (data.success && data.data && data.data.length > 0) {
            renderCurriculumList(data.data);
        } else {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center py-5">No curriculums uploaded yet</p></div>';
        }
    })
    .catch(error => {
        console.error('❌ Error loading curriculums:', error);
        const container = document.getElementById('curriculumList');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-danger text-center py-5">Error loading curriculums: ' + error.message + '</p></div>';
        }
    });
}

// Render Curriculum List
function renderCurriculumList(curriculums) {
    console.log('🎨 Rendering', curriculums.length, 'curriculums');
    let html = '';
    
    curriculums.forEach((curriculum, index) => {
        const createdDate = new Date(curriculum.created_at).toLocaleDateString();
        const viewUrl = window.BASE_URL + curriculum.file_url;
        
        html += `
            <div class="col-12 col-md-6">
                <div class="curriculum-card">
                    <div class="curriculum-preview">
                        <div class="pdf-thumbnail">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="curriculum-info">
                            <h5 class="curriculum-title">
                                <i class="fas fa-file-pdf text-danger me-2"></i>${curriculum.program}
                            </h5>
                            <p class="curriculum-date text-muted">Uploaded: ${createdDate}</p>
                        </div>
                    </div>
                    <div class="curriculum-header">
                        <div class="curriculum-actions">
                            <button class="btn btn-sm btn-primary" onclick="previewPDF('${viewUrl}', '${curriculum.program}')" title="Preview PDF">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteCurriculumItem(${curriculum.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const container = document.getElementById('curriculumList');
    if (container) {
        container.innerHTML = html;
    }
}

// Delete Curriculum
function deleteCurriculumItem(curriculumId) {
    console.log('🗑️ Delete requested for ID:', curriculumId);
    
    if (confirm('Are you sure you want to delete this curriculum? This action cannot be undone.')) {
        const deleteUrl = window.API_BASE_URL + 'delete_curriculum';
        
        fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: 'id=' + curriculumId
        })
        .then(response => {
            console.log('📥 Delete response:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Delete response data:', data);
            if (data.success) {
                showNotification('✅ Curriculum deleted successfully!', 'success');
                setTimeout(() => loadCurriculumList(), 500);
            } else {
                showNotification('❌ ' + (data.message || 'Error deleting curriculum'), 'error');
            }
        })
        .catch(error => {
            console.error('❌ Delete error:', error);
            showNotification('❌ Error deleting curriculum: ' + error.message, 'error');
        });
    }
}

// Preview PDF in Modal
function previewPDF(pdfUrl, title) {
    console.log('👀 Opening PDF preview:', title);
    const modal = new bootstrap.Modal(document.getElementById('pdfPreviewModal'));
    const pdfViewer = document.getElementById('pdfViewer');
    const downloadBtn = document.getElementById('pdfDownloadBtn');
    
    // Set the iframe source to display the PDF
    pdfViewer.src = pdfUrl;
    
    // Set download link
    downloadBtn.href = pdfUrl;
    downloadBtn.download = title + '.pdf';
    
    // Update modal title
    document.getElementById('pdfPreviewLabel').innerHTML = '<i class="fas fa-file-pdf me-2"></i>' + title;
    
    // Show modal
    modal.show();
}

// Global notification function
function showNotification(message, type = 'info') {
    console.log('🔔 Notification:', type, message);
    
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const iconClass = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    notification.innerHTML = `
        <i class="fas ${iconClass} me-2"></i>
        <strong>${type.toUpperCase()}:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    console.log('✅ Notification displayed');
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        notification.remove();
    }, 6000);
}
