document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Program Offerings Page Ready');
    
    // Load schedules and calendars
    loadSchedules();
    loadCalendars();
    
    // Attach event listeners for curriculum
    attachCurriculumListeners();
});

// ============================================
// SCHEDULES SECTION
// ============================================

function loadSchedules() {
    console.log('📅 Loading class schedules...');
    
    const apiUrl = window.BASE_URL + 'index.php/admin/content/api_get_schedules';
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('📊 Schedules loaded:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                renderScheduleList(data.data);
            } else {
                console.log('⚠️ No schedules found');
                renderNoScheduleViewer();
            }
        })
        .catch(error => {
            console.log('❌ Error loading schedules:', error);
            renderNoScheduleViewer();
        });
}

function renderScheduleList(schedules) {
    console.log('🎨 Rendering schedule list:', schedules.length, 'items');
    
    const container = document.getElementById('schedule-viewer-container');
    if (!container) {
        console.log('⚠️ Schedule viewer container not found');
        return;
    }
    
    // Create tabs for multiple schedules
    let html = '<div class="schedule-tabs">';
    html += '<div class="schedule-tab-nav">';
    
    schedules.forEach((schedule, index) => {
        const activeClass = index === 0 ? 'active' : '';
        html += `<button class="schedule-tab-btn ${activeClass}" data-schedule-id="${schedule.id}">
                    ${schedule.academic_year} - ${schedule.semester}
                </button>`;
    });
    
    html += '</div><div class="schedule-tab-content">';
    
    schedules.forEach((schedule, index) => {
        const activeStyle = index === 0 ? '' : 'display: none;';
        html += `
            <div class="schedule-tab-pane" data-schedule-id="${schedule.id}" style="${activeStyle}">
                <div class="schedule-info-bar">
                    <div class="schedule-info">
                        <h5>Academic Year: <strong>${schedule.academic_year}</strong></h5>
                        <p>Semester: <strong>${schedule.semester}</strong> | Uploaded: ${new Date(schedule.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="schedule-actions">
                        <a href="${window.BASE_URL}${schedule.file_url}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-eye me-1"></i>View Full Screen
                        </a>
                        <a href="${window.BASE_URL}${schedule.file_url}" download class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-download me-1"></i>Download
                        </a>
                    </div>
                </div>
                <div class="pdf-viewer-embedded">
                    <iframe src="${window.BASE_URL}${schedule.file_url}" width="100%" height="600px" frameborder="0"></iframe>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    // Attach tab click listeners
    const tabButtons = container.querySelectorAll('.schedule-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const scheduleId = this.getAttribute('data-schedule-id');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(b => b.classList.remove('active'));
            container.querySelectorAll('.schedule-tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding pane
            const pane = container.querySelector(`.schedule-tab-pane[data-schedule-id="${scheduleId}"]`);
            if (pane) {
                pane.style.display = 'block';
            }
        });
    });
    
    console.log('✅ Schedule list rendered successfully');
}

function renderNoScheduleViewer() {
    const container = document.getElementById('schedule-viewer-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>No schedules available</strong> at this time. Please check back later.
            </div>
        `;
    }
}

// ============================================
// CALENDAR SECTION
// ============================================

function loadCalendars() {
    console.log('📅 Loading academic calendars...');
    
    const apiUrl = window.BASE_URL + 'index.php/admin/content/api_get_calendars';
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('📊 Calendars loaded:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                renderCalendarList(data.data);
            } else {
                console.log('⚠️ No calendars found');
                renderNoCalendarViewer();
            }
        })
        .catch(error => {
            console.log('❌ Error loading calendars:', error);
            renderNoCalendarViewer();
        });
}

function renderCalendarList(calendars) {
    console.log('🎨 Rendering calendar list:', calendars.length, 'items');
    
    const container = document.getElementById('calendar-viewer-container');
    if (!container) {
        console.log('⚠️ Calendar viewer container not found');
        return;
    }
    
    // Create tabs for multiple calendars
    let html = '<div class="calendar-tabs">';
    html += '<div class="calendar-tab-nav">';
    
    calendars.forEach((calendar, index) => {
        const activeClass = index === 0 ? 'active' : '';
        html += `<button class="calendar-tab-btn ${activeClass}" data-calendar-id="${calendar.id}">
                    ${calendar.academic_year}
                </button>`;
    });
    
    html += '</div><div class="calendar-tab-content">';
    
    calendars.forEach((calendar, index) => {
        const activeStyle = index === 0 ? '' : 'display: none;';
        html += `
            <div class="calendar-tab-pane" data-calendar-id="${calendar.id}" style="${activeStyle}">
                <div class="calendar-info-bar">
                    <div class="calendar-info">
                        <h5>Academic Year: <strong>${calendar.academic_year}</strong></h5>
                        <p>Uploaded: ${new Date(calendar.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="calendar-actions">
                        <a href="${window.BASE_URL}${calendar.file_url}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-eye me-1"></i>View Full Screen
                        </a>
                        <a href="${window.BASE_URL}${calendar.file_url}" download class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-download me-1"></i>Download
                        </a>
                    </div>
                </div>
                <div class="pdf-viewer-embedded">
                    <iframe src="${window.BASE_URL}${calendar.file_url}" width="100%" height="600px" frameborder="0"></iframe>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    // Attach tab click listeners
    const tabButtons = container.querySelectorAll('.calendar-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const calendarId = this.getAttribute('data-calendar-id');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(b => b.classList.remove('active'));
            container.querySelectorAll('.calendar-tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding pane
            const pane = container.querySelector(`.calendar-tab-pane[data-calendar-id="${calendarId}"]`);
            if (pane) {
                pane.style.display = 'block';
            }
        });
    });
    
    console.log('✅ Calendar list rendered successfully');
}

function renderNoCalendarViewer() {
    const container = document.getElementById('calendar-viewer-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>No calendars available</strong> at this time. Please check back later.
            </div>
        `;
    }
}

// ============================================
// CURRICULUM SECTION
// ============================================

function attachCurriculumListeners() {
    console.log('📖 Attaching curriculum listeners');
    
    // View curriculum PDF buttons
    const viewCurriculumBtns = document.querySelectorAll('.view-curriculum-pdf');
    viewCurriculumBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const program = this.getAttribute('data-program');
            const fileUrl = this.getAttribute('data-file-url');
            
            const placeholderId = program + '-pdf-placeholder';
            const containerId = program + '-pdfEmbedContainer';
            const frameId = program + '-pdfFrame';
            
            const placeholder = document.getElementById(placeholderId);
            const container = document.getElementById(containerId);
            const frame = document.getElementById(frameId);
            
            if (frame) {
                frame.src = window.BASE_URL + fileUrl;
            }
            
            if (placeholder && container) {
                placeholder.style.display = 'none';
                container.style.display = 'block';
            }
        });
    });
    
    // Download curriculum buttons
    const downloadBtns = document.querySelectorAll('.curriculum-download');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileUrl = this.getAttribute('data-file-url');
            window.open(window.BASE_URL + fileUrl, '_blank');
        });
    });
    
    // Close curriculum PDF buttons
    const closeBtns = document.querySelectorAll('.close-curriculum-pdf');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const program = this.getAttribute('data-program');
            const placeholderId = program + '-pdf-placeholder';
            const containerId = program + '-pdfEmbedContainer';
            
            const placeholder = document.getElementById(placeholderId);
            const container = document.getElementById(containerId);
            
            if (placeholder && container) {
                placeholder.style.display = 'block';
                container.style.display = 'none';
            }
        });
    });
}
