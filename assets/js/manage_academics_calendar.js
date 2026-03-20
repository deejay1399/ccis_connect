document.addEventListener('DOMContentLoaded', function() {
    
    // Watch for tab changes
    const calendarTabButton = document.getElementById('calendar-tab');
    if (calendarTabButton) {
        calendarTabButton.addEventListener('shown.bs.tab', function() {
            attachCalendarFormListener();
            loadCalendars();
        });
    }
    
    // Initialize on page load
    attachCalendarFormListener();
    loadCalendars();
});

function attachCalendarFormListener() {
    const form = document.getElementById('uploadCalendarForm');
    if (!form) {
        return;
    }
    
    // Clone the form to remove old listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Attach listener to new form
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        submitCalendarForm();
        return false;
    }, true);
    
}

function submitCalendarForm() {
    
    const form = document.getElementById('uploadCalendarForm');
    const year = document.getElementById('calendarYear').value;
    const file = document.getElementById('calendarFile').files[0];
    
    // Validation
    if (!year) {
        showCalendarMessage('Academic year is required', 'danger');
        return;
    }
    
    if (!file) {
        showCalendarMessage('Please select a PDF file', 'danger');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        showCalendarMessage('Only PDF files are allowed', 'danger');
        return;
    }
    
    if (file.size > 52428800) { // 50MB
        showCalendarMessage('File size exceeds 50MB limit', 'danger');
        return;
    }
    
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('academic_year', year);
    formData.append('calendar_file', file);
    
    
    // Submit via AJAX
    fetch(window.API_BASE_URL + 'upload_calendar', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showCalendarMessage('Academic calendar uploaded successfully!', 'success');
            form.reset();
            loadCalendars();
        } else {
            showCalendarMessage(data.message || 'Failed to upload calendar', 'danger');
        }
    })
    .catch(error => {
        showCalendarMessage('Error uploading calendar: ' + error.message, 'danger');
    });
}

function loadCalendars() {
    
    fetch(window.API_BASE_URL + 'get_calendars')
        .then(response => response.json())
        .then(data => {
            
            if (data.success && data.data) {
                renderCalendars(data.data);
            } else {
                document.getElementById('calendarList').innerHTML = '<p class="text-muted">No calendars uploaded yet</p>';
            }
        })
        .catch(error => {
            document.getElementById('calendarList').innerHTML = '<p class="text-danger">Error loading calendars</p>';
        });
}

function renderCalendars(calendars) {
    const container = document.getElementById('calendarList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (calendars.length === 0) {
        container.innerHTML = '<p class="text-muted">No calendars uploaded yet</p>';
        return;
    }
    
    calendars.forEach(calendar => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas fa-calendar-alt me-2 text-primary"></i>${calendar.academic_year}
                    </h5>
                    <p class="card-text text-muted small">
                        <i class="fas fa-clock me-1"></i>${new Date(calendar.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div class="card-footer bg-white border-top">
                    <div class="d-flex gap-2">
                        <a href="${window.BASE_URL}${calendar.file_url}" 
                           target="_blank" 
                           class="btn btn-sm btn-outline-primary flex-grow-1">
                            <i class="fas fa-download me-1"></i>Download
                        </a>
                        <button type="button" 
                                class="btn btn-sm btn-outline-danger" 
                                onclick="deleteCalendar(${calendar.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function deleteCalendar(id) {
    if (!confirm('Are you sure you want to delete this calendar?')) return;
    
    
    fetch(window.API_BASE_URL + 'delete_calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'id=' + id
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showCalendarMessage('Calendar deleted successfully', 'success');
            loadCalendars();
        } else {
            showCalendarMessage(data.message || 'Failed to delete calendar', 'danger');
        }
    })
    .catch(error => {
        showCalendarMessage('Error deleting calendar: ' + error.message, 'danger');
    });
}

function showCalendarMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const form = document.getElementById('uploadCalendarForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
