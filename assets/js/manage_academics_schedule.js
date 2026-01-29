// MANAGE ACADEMICS PAGE - Class Schedules Upload Version
// Uses vanilla JavaScript - no jQuery dependency

// Global upload state
let isScheduleUploading = false;

// Initialize on DOM ready and also when tab becomes visible
document.addEventListener('DOMContentLoaded', function() {
    console.log('📅 Class Schedules Management Initializing...');
    console.log('🔗 API_BASE_URL:', window.API_BASE_URL);
    
    if (!window.API_BASE_URL) {
        console.error('❌ API_BASE_URL not set! Check footer.php');
    }
    
    // Small delay to ensure all DOM elements are ready
    setTimeout(function() {
        initializeScheduleUpload();
        loadScheduleList();
        console.log('✅ Class Schedules Management Ready');
    }, 100);
});

// Also reinitialize when schedule tab is clicked
document.addEventListener('shown.bs.tab', function(e) {
    if (e.target && e.target.id === 'schedule-tab') {
        console.log('📅 Schedule tab shown - reinitializing...');
        initializeScheduleUpload();
        loadScheduleList();
    }
});

// Initialize Schedule Upload Form
function initializeScheduleUpload() {
    console.log('🔧 Setting up schedule form...');
    const form = document.getElementById('uploadScheduleForm');
    
    if (!form) {
        console.error('❌ Upload form not found - waiting...');
        return;
    }
    
    console.log('✓ Form element found:', form);
    
    // Remove old listeners by cloning
    const formClone = form.cloneNode(true);
    form.parentNode.replaceChild(formClone, form);
    
    // Add new listener to cloned form
    const newForm = document.getElementById('uploadScheduleForm');
    if (!newForm) {
        console.error('❌ Form not found after clone');
        return;
    }
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📝 Schedule form submitted - AJAX mode');
        
        // Prevent double submission
        if (isScheduleUploading) {
            console.warn('⚠️ Upload already in progress');
            showNotification('Upload already in progress. Please wait...', 'warning');
            return;
        }
        
        const yearInput = document.getElementById('scheduleYear');
        const semesterInput = document.getElementById('scheduleSemester');
        const fileInput = document.getElementById('scheduleFile');
        
        if (!yearInput || !semesterInput || !fileInput) {
            console.error('❌ Form elements not found');
            showNotification('Form elements missing', 'error');
            return;
        }
        
        const year = yearInput.value.trim();
        const semester = semesterInput.value.trim();
        
        if (!year) {
            showNotification('Please enter academic year', 'warning');
            return;
        }
        
        if (!semester) {
            showNotification('Please select semester', 'warning');
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
        
        // Validate file size (max 50MB)
        const maxFileSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxFileSize) {
            showNotification('File size must be less than 50MB', 'error');
            return;
        }
        
        uploadScheduleFile(year, semester, file);
        return false; // Extra safety
    });
    
    console.log('✓ Schedule form listener attached successfully');
}

// Upload Schedule File
function uploadScheduleFile(academicYear, semester, file) {
    // Set uploading flag
    isScheduleUploading = true;
    
    const formData = new FormData();
    formData.append('academic_year', academicYear);
    formData.append('semester', semester);
    formData.append('file', file);
    
    // Show loading state and disable form
    const form = document.getElementById('uploadScheduleForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const yearInput = document.getElementById('scheduleYear');
    const semesterInput = document.getElementById('scheduleSemester');
    const fileInput = document.getElementById('scheduleFile');
    
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    yearInput.disabled = true;
    semesterInput.disabled = true;
    fileInput.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    const uploadUrl = window.API_BASE_URL + 'upload_schedule';
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
            showNotification('✅ Class schedule uploaded successfully!', 'success');
            form.reset();
            setTimeout(() => loadScheduleList(), 500);
        } else {
            const errorMsg = data.message || 'Error uploading schedule';
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
        isScheduleUploading = false;
        submitBtn.disabled = false;
        yearInput.disabled = false;
        semesterInput.disabled = false;
        fileInput.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Load Schedule List
function loadScheduleList() {
    const listUrl = window.API_BASE_URL + 'get_schedules';
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
        console.log('📅 Schedules loaded:', data);
        const container = document.getElementById('scheduleList');
        
        if (!container) {
            console.warn('⚠️ Schedule list container not found');
            return;
        }
        
        if (data.success && data.data && data.data.length > 0) {
            renderScheduleList(data.data);
        } else {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center py-5">No schedules uploaded yet</p></div>';
        }
    })
    .catch(error => {
        console.error('❌ Error loading schedules:', error);
        const container = document.getElementById('scheduleList');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-danger text-center py-5">Error loading schedules: ' + error.message + '</p></div>';
        }
    });
}

// Render Schedule List
function renderScheduleList(schedules) {
    console.log('🎨 Rendering', schedules.length, 'schedules');
    let html = '';
    
    schedules.forEach((schedule, index) => {
        const createdDate = new Date(schedule.created_at).toLocaleDateString();
        const viewUrl = window.BASE_URL + schedule.file_url;
        
        html += `
            <div class="col-12 col-md-6">
                <div class="schedule-card">
                    <div class="schedule-preview">
                        <div class="pdf-thumbnail">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="schedule-info">
                            <h5 class="schedule-title">
                                <i class="fas fa-calendar text-primary me-2"></i>${schedule.academic_year} - ${schedule.semester}
                            </h5>
                            <p class="schedule-date text-muted">Uploaded: ${createdDate}</p>
                        </div>
                    </div>
                    <div class="schedule-header">
                        <div class="schedule-actions">
                            <button class="btn btn-sm btn-primary" onclick="previewSchedulePDF('${viewUrl}', '${schedule.academic_year} - ${schedule.semester}')" title="Preview PDF">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteScheduleItem(${schedule.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const container = document.getElementById('scheduleList');
    if (container) {
        container.innerHTML = html;
    }
}

// Delete Schedule
function deleteScheduleItem(scheduleId) {
    console.log('🗑️ Delete requested for Schedule ID:', scheduleId);
    
    if (confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
        const deleteUrl = window.API_BASE_URL + 'delete_schedule';
        
        fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: 'id=' + scheduleId
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
                showNotification('✅ Class schedule deleted successfully!', 'success');
                setTimeout(() => loadScheduleList(), 500);
            } else {
                showNotification('❌ ' + (data.message || 'Error deleting schedule'), 'error');
            }
        })
        .catch(error => {
            console.error('❌ Delete error:', error);
            showNotification('❌ Error deleting schedule: ' + error.message, 'error');
        });
    }
}

// Preview Schedule PDF in Modal
function previewSchedulePDF(pdfUrl, title) {
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
