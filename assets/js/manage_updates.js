// MANAGE UPDATES - SUPER ADMIN JAVASCRIPT - WITH IMPROVED DEAN'S LIST

$(document).ready(function() {
    console.log('🔐 Manage Updates Page Loading...');
    
    // Enhanced session check
    function checkSuperAdminSession() {
        const session = window.checkUserSession();
        
        console.log('Session check result:', session);
        
        if (!session.isValid) {
            console.warn('❌ No valid session found, redirecting to login');
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 2000);
            return false;
        }
        
        if (session.user.role !== 'superadmin') {
            console.warn('🚫 Unauthorized access attempt by:', session.user.role);
            showNotification('Access denied. Super Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return false;
        }
        
        console.log('✅ Super Admin session confirmed:', session.user.name);
        updateAdminUI(session.user);
        return true;
    }
    
    function updateAdminUI(user) {
        $('#user-name').text(user.name);
        $('#user-role').text(user.role);
        console.log('👤 UI updated for:', user.name);
    }
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        setupPublicSiteLink();
        updateCurrentDate();
        initializeTabSystem();
        loadAllData();
        initializeFormHandlers();
        
        // Remove Return to Dashboard links
        removeReturnToDashboard();
        
        console.log('🎯 Manage Updates Page initialized successfully');
    }
    
    // Function to handle the "View Public Site" link
    function setupPublicSiteLink() {
        const publicSiteLink = $('#view-public-site-link');
        if (publicSiteLink.length) {
            const dashboardUrl = 'super_admin/index.html';
                                 
            publicSiteLink.on('click', function(e) {
                localStorage.setItem('admin_return_url', dashboardUrl);
                sessionStorage.setItem('admin_return_url', dashboardUrl);
                console.log(`🔗 Storing return URL: ${dashboardUrl}`);
            });
        }
    }
    
    // Function to remove Return to Dashboard links
    function removeReturnToDashboard() {
        console.log('🔍 Searching for Return to Dashboard links...');
        
        // Method 1: Remove by exact text content
        $('a').each(function() {
            const text = $(this).text().trim();
            if (text === 'Return to Dashboard') {
                console.log('🚫 Removing Return to Dashboard link:', text);
                $(this).remove();
            }
        });
        
        // Method 2: Remove by partial text match
        $('a:contains("Return to Dashboard")').each(function() {
            console.log('🚫 Removing Return to Dashboard element');
            $(this).remove();
        });
        
        // Method 3: Remove any quick-links or footer-links containers
        $('.quick-links, .footer-links').each(function() {
            console.log('🚫 Removing quick-links/footer-links container');
            $(this).remove();
        });
        
        // Method 4: Remove any elements containing the text
        $('*:contains("Return to Dashboard")').each(function() {
            if ($(this).children().length === 0) {
                const text = $(this).text().trim();
                if (text.includes('Return to Dashboard')) {
                    console.log('🚫 Removing element with text:', text);
                    $(this).remove();
                }
            }
        });
    }
    
    // Date Display Function
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
    
    // DATA STRUCTURES FOR ALL SECTIONS
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [
        {
            id: 1,
            date: "2025-03-12",
            title: "Midterm Examination Schedule - Second Semester 2024-2025",
            description: "Official schedule for midterm examinations for all programs. Please check the detailed schedule for your specific program and year level.",
            venue: "Various Classrooms",
            time: "8:00 AM - 5:00 PM",
            details: "Examinations will be conducted according to the published schedule. Students must bring their examination permits and valid IDs.",
            type: "urgent",
            hasPdf: true,
            pdfUrl: "assets/exams/midterm_schedule_2025.pdf",
            pdfTitle: "Midterm Examination Schedule 2024-2025",
            hasImage: false
        }
    ];

    let eventsAchievements = JSON.parse(localStorage.getItem('eventsAchievements')) || [
        {
            id: 1,
            date: "2025-03-25",
            title: "CCIS Tech Week 2025",
            time: "8:00 AM - 5:00 PM",
            location: "CCIS Building & University Gym",
            description: "Annual technology week featuring coding competitions, tech talks, and project exhibitions.",
            image: "https://via.placeholder.com/400x200/6a0dad/ffffff?text=Tech+Week+2025"
        },
        {
            id: 2,
            date: "2025-02-15",
            title: "1st Place - Regional Programming Competition",
            time: "Competition Day",
            location: "Visayas Programming Cup 2025",
            team: "Code Warriors (BSCS 4th Year)",
            description: "Team developed an innovative AI solution for environmental monitoring that impressed the judges with its technical complexity and practical application.",
            image: "https://via.placeholder.com/400x200/4b0082/ffffff?text=Achievement+1"
        }
    ];

    let deansListRecords = JSON.parse(localStorage.getItem('deansList')) || [
        {
            year: "2024-2025",
            achievers: [
                {
                    id: 1,
                    name: "Juan Dela Cruz",
                    program: "BSCS",
                    year: "4",
                    honors: "Summa Cum Laude",
                    gwa: "1.15",
                    achievements: ["President of CS Guild", "Research Paper Presenter", "Coding Competition Winner"],
                    image: "https://via.placeholder.com/150x150/6a0dad/ffffff?text=Juan"
                },
                {
                    id: 2,
                    name: "Maria Santos",
                    program: "BSIT",
                    year: "3",
                    honors: "Magna Cum Laude",
                    gwa: "1.25",
                    achievements: ["Dean's Lister for 3 consecutive semesters", "Thesis Excellence Award"],
                    image: "https://via.placeholder.com/150x150/9229f5/ffffff?text=Maria"
                }
            ]
        }
    ];

    // Confirmation modal functionality
    let pendingAction = null;

    function showConfirmation(message, confirmCallback) {
        $('#confirmationMessage').text(message);
        pendingAction = confirmCallback;
        $('#confirmationModal').modal('show');
    }

    function initializeConfirmationModal() {
        $('#confirmActionBtn').on('click', function() {
            if (pendingAction) {
                pendingAction();
                pendingAction = null;
            }
            $('#confirmationModal').modal('hide');
        });
    }

    // Helper function to render a list of items
    function renderList(listId, data, templateFn) {
        const container = $(`#${listId}`);
        container.empty();
        if (data.length === 0) {
            container.append(`<div class="col-12 text-center text-muted py-5">No records found.</div>`);
        } else {
            data.forEach(item => container.append(templateFn(item)));
        }
    }

    // =====================================
    // ANNOUNCEMENTS - WITH FILE UPLOAD SUPPORT IN EDIT
    // =====================================

    const renderAnnouncementCard = (announcement) => `
        <div class="col-md-6 col-lg-4">
            <div class="updates-list-card">
                ${announcement.hasImage && announcement.imageUrl ? `
                    <img src="${announcement.imageUrl}" class="announcement-image-preview" alt="${announcement.title}">
                ` : ''}
                <div class="card-body">
                    <h5 class="card-title">${announcement.title}</h5>
                    <div class="meta-info">
                        <i class="fas fa-calendar me-1"></i> ${new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        ${announcement.time ? `<span><i class="fas fa-clock me-1"></i> ${announcement.time}</span>` : ''}
                        ${announcement.venue ? `<span><i class="fas fa-map-marker-alt me-1"></i> ${announcement.venue}</span>` : ''}
                        ${announcement.hasPdf ? `<span><i class="fas fa-file-pdf text-danger me-1"></i> PDF Attached</span>` : ''}
                        ${announcement.hasImage ? `<span><i class="fas fa-image text-success me-1"></i> Has Image</span>` : ''}
                    </div>
                    <p class="card-text">${announcement.description}</p>
                    ${announcement.details ? `<p class="card-text"><small>${announcement.details}</small></p>` : ''}
                    <div class="actions">
                        <button class="btn btn-sm btn-info edit-announcement-btn" data-id="${announcement.id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-announcement-btn" data-id="${announcement.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    function loadAnnouncements() {
        renderList('announcementsList', announcements, renderAnnouncementCard);
    }

    function initializeAnnouncements() {
        $('#addAnnouncementForm').on('submit', function(e) {
            e.preventDefault();
            
            const pdfFile = $('#announcementPdfFile')[0].files[0];
            const imageFile = $('#announcementImage')[0].files[0];
            const hasPdf = pdfFile !== undefined;
            const hasImage = imageFile !== undefined;
            
            const newAnnouncement = {
                id: Date.now(),
                title: $('#announcementTitle').val(),
                date: $('#announcementDate').val(),
                description: $('#announcementDescription').val(),
                venue: $('#announcementVenue').val(),
                time: $('#announcementTime').val(),
                hasPdf: hasPdf,
                pdfUrl: hasPdf ? 'assets/announcements/' + pdfFile.name : null,
                hasImage: hasImage,
                imageUrl: hasImage ? URL.createObjectURL(imageFile) : null,
                type: "general"
            };
            
            announcements.push(newAnnouncement);
            localStorage.setItem('announcements', JSON.stringify(announcements));
            loadAnnouncements();
            showNotification('Announcement added successfully!', 'success');
            this.reset();
        });

        // Handle edit modal show with file previews
        $(document).on('click', '.edit-announcement-btn', function() {
            const id = $(this).data('id');
            const announcement = announcements.find(a => a.id === id);
            if (announcement) {
                $('#editAnnouncementId').val(id);
                $('#editAnnouncementTitle').val(announcement.title);
                $('#editAnnouncementDate').val(announcement.date);
                $('#editAnnouncementDescription').val(announcement.description);
                $('#editAnnouncementVenue').val(announcement.venue);
                $('#editAnnouncementTime').val(announcement.time);
                
                // Clear previous file previews
                $('#editAnnouncementPdfPreview').empty();
                $('#editAnnouncementImagePreview').empty();
                
                // Show existing PDF if available
                if (announcement.hasPdf) {
                    $('#editAnnouncementPdfPreview').html(`
                        <div class="file-upload-preview">
                            <div class="file-info">
                                <i class="fas fa-file-pdf text-danger"></i>
                                <span>Current PDF: ${announcement.pdfTitle || 'Document'}</span>
                            </div>
                        </div>
                    `);
                }
                
                // Show existing image if available
                if (announcement.hasImage && announcement.imageUrl) {
                    $('#editAnnouncementImagePreview').html(`
                        <div class="file-upload-preview">
                            <img src="${announcement.imageUrl}" alt="Current announcement image">
                            <div class="file-info">
                                <i class="fas fa-image text-success"></i>
                                <span>Current image</span>
                            </div>
                        </div>
                    `);
                }
                
                $('#editAnnouncementModal').modal('show');
            }
        });

        // Handle edit form submit with file handling
        $('#editAnnouncementForm').on('submit', function(e) {
            e.preventDefault();
            const id = parseInt($('#editAnnouncementId').val());
            const index = announcements.findIndex(a => a.id === id);
            if (index > -1) {
                const pdfFile = $('#editAnnouncementPdfFile')[0].files[0];
                const imageFile = $('#editAnnouncementImage')[0].files[0];
                
                announcements[index] = {
                    ...announcements[index],
                    title: $('#editAnnouncementTitle').val(),
                    date: $('#editAnnouncementDate').val(),
                    description: $('#editAnnouncementDescription').val(),
                    venue: $('#editAnnouncementVenue').val(),
                    time: $('#editAnnouncementTime').val(),
                    hasPdf: pdfFile ? true : announcements[index].hasPdf,
                    pdfUrl: pdfFile ? URL.createObjectURL(pdfFile) : announcements[index].pdfUrl,
                    hasImage: imageFile ? true : announcements[index].hasImage,
                    imageUrl: imageFile ? URL.createObjectURL(imageFile) : announcements[index].imageUrl
                };
                
                localStorage.setItem('announcements', JSON.stringify(announcements));
                loadAnnouncements();
                $('#editAnnouncementModal').modal('hide');
                showNotification('Announcement updated successfully!', 'success');
            }
        });

        // Handle delete
        $(document).on('click', '.delete-announcement-btn', function() {
            const id = $(this).data('id');
            const announcement = announcements.find(a => a.id === id);
            
            showConfirmation(
                `Are you sure you want to remove the announcement "${announcement.title}"?`,
                function() {
                    announcements = announcements.filter(a => a.id !== id);
                    localStorage.setItem('announcements', JSON.stringify(announcements));
                    loadAnnouncements();
                    showNotification('Announcement removed successfully!', 'success');
                }
            );
        });
    }

    // =====================================
    // EVENTS & ACHIEVEMENTS - WITH FILE UPLOAD SUPPORT IN EDIT
    // =====================================

    const renderEventAchievementCard = (item) => `
        <div class="col-md-6 col-lg-4">
            <div class="updates-list-card">
                ${item.image ? `<img src="${item.image}" class="event-image-preview" alt="${item.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <div class="meta-info">
                        <span><i class="fas fa-calendar me-1"></i> ${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span><i class="fas fa-clock me-1"></i> ${item.time}</span>
                        <span><i class="fas fa-map-marker-alt me-1"></i> ${item.location}</span>
                        ${item.team ? `<span><i class="fas fa-users me-1"></i> ${item.team}</span>` : ''}
                    </div>
                    <p class="card-text">${item.description}</p>
                    <div class="actions">
                        <button class="btn btn-sm btn-info edit-event-btn" data-id="${item.id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-event-btn" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    function loadEventsAchievements() {
        renderList('eventsAchievementsList', eventsAchievements, renderEventAchievementCard);
    }

    function initializeEventsAchievements() {
        $('#addEventAchievementForm').on('submit', function(e) {
            e.preventDefault();
            const imageFile = $('#eventImage')[0].files[0];
            
            const newItem = {
                id: Date.now(),
                title: $('#eventTitle').val(),
                date: $('#eventDate').val(),
                time: $('#eventTime').val(),
                location: $('#eventLocation').val(),
                team: $('#eventTeam').val() || null,
                description: $('#eventDescription').val(),
                image: imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/400x200/6a0dad/ffffff?text=Event+Image"
            };
            
            eventsAchievements.push(newItem);
            localStorage.setItem('eventsAchievements', JSON.stringify(eventsAchievements));
            loadEventsAchievements();
            showNotification('Event/Achievement added successfully!', 'success');
            this.reset();
        });

        // Edit event/achievement functionality with image preview
        $(document).on('click', '.edit-event-btn', function() {
            const id = $(this).data('id');
            const item = eventsAchievements.find(e => e.id === id);
            if (item) {
                // Populate edit form
                $('#editEventId').val(id);
                $('#editEventTitle').val(item.title);
                $('#editEventDate').val(item.date);
                $('#editEventTime').val(item.time);
                $('#editEventLocation').val(item.location);
                $('#editEventTeam').val(item.team || '');
                $('#editEventDescription').val(item.description);
                
                // Clear previous image preview
                $('#editEventImagePreview').empty();
                
                // Show existing image if available
                if (item.image) {
                    $('#editEventImagePreview').html(`
                        <div class="file-upload-preview">
                            <img src="${item.image}" alt="Current event image">
                            <div class="file-info">
                                <i class="fas fa-image text-success"></i>
                                <span>Current image</span>
                            </div>
                        </div>
                    `);
                }
                
                $('#editEventModal').modal('show');
            }
        });

        // Submit edit event/achievement with image handling
        $('#editEventForm').on('submit', function(e) {
            e.preventDefault();
            const id = parseInt($('#editEventId').val());
            const index = eventsAchievements.findIndex(e => e.id === id);
            if (index > -1) {
                const imageFile = $('#editEventImage')[0].files[0];
                
                eventsAchievements[index] = {
                    ...eventsAchievements[index],
                    title: $('#editEventTitle').val(),
                    date: $('#editEventDate').val(),
                    time: $('#editEventTime').val(),
                    location: $('#editEventLocation').val(),
                    team: $('#editEventTeam').val() || null,
                    description: $('#editEventDescription').val(),
                    image: imageFile ? URL.createObjectURL(imageFile) : eventsAchievements[index].image
                };
                
                localStorage.setItem('eventsAchievements', JSON.stringify(eventsAchievements));
                loadEventsAchievements();
                $('#editEventModal').modal('hide');
                showNotification('Event/Achievement updated successfully!', 'success');
            }
        });

        // Delete event/achievement
        $(document).on('click', '.delete-event-btn', function() {
            const id = $(this).data('id');
            const item = eventsAchievements.find(e => e.id === id);
            
            showConfirmation(
                `Are you sure you want to remove "${item.title}"?`,
                function() {
                    eventsAchievements = eventsAchievements.filter(e => e.id !== id);
                    localStorage.setItem('eventsAchievements', JSON.stringify(eventsAchievements));
                    loadEventsAchievements();
                    showNotification('Event/Achievement removed successfully!', 'success');
                }
            );
        });
    }

    // =====================================
    // DEAN'S LIST - WITH EDIT & PREVIEW FUNCTIONALITY
    // =====================================

    const renderAcademicYearCard = (yearData) => {
        const achieversCount = yearData.achievers ? yearData.achievers.length : 0;
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="year-card">
                    <h5>Academic Year ${yearData.year}</h5>
                    <p class="text-muted">${achieversCount} achiever${achieversCount !== 1 ? 's' : ''}</p>
                    <div class="achievers-list">
                        ${yearData.achievers && yearData.achievers.length > 0 ? 
                            yearData.achievers.map(achiever => `
                                <div class="achiever-item">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="d-flex align-items-start">
                                            ${achiever.image ? `
                                                <img src="${achiever.image}" class="achiever-image-preview me-3" alt="${achiever.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                                            ` : `
                                                <div class="achiever-image-placeholder me-3" style="width: 60px; height: 60px; background: var(--light-purple); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user text-muted"></i>
                                                </div>
                                            `}
                                            <div>
                                                <strong>${achiever.name}</strong>
                                                <br>
                                                <small class="text-muted">${achiever.program} - Year ${achiever.year}</small>
                                                <br>
                                                <span class="badge bg-${getHonorsBadgeColor(achiever.honors)}">${achiever.honors}</span>
                                                <br>
                                                <small class="text-muted">GWA: ${achiever.gwa}</small>
                                            </div>
                                        </div>
                                        <!-- REMOVED: Individual achiever action buttons -->
                                    </div>
                                    ${achiever.achievements && achiever.achievements.length > 0 ? `
                                        <div class="achiever-achievements mt-2">
                                            <ul>
                                                ${achiever.achievements.map(achievement => `
                                                    <li>${achievement}</li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('') 
                            : '<p class="text-muted text-center py-3">No achievers yet</p>'
                        }
                    </div>
                    <div class="year-actions mt-3">
                        <button class="btn btn-sm btn-primary edit-deanslist-btn" data-year="${yearData.year}">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-info preview-deanslist-btn" data-year="${yearData.year}">
                            <i class="fas fa-eye me-1"></i>Preview
                        </button>
                        <button class="btn btn-sm btn-danger remove-deanslist-btn" data-year="${yearData.year}">
                            <i class="fas fa-trash me-1"></i>Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    function loadAcademicYears() {
        renderList('academicYearsList', deansListRecords, renderAcademicYearCard);
    }

    function getHonorsBadgeColor(honors) {
        switch(honors) {
            case 'Summa Cum Laude': return 'warning';
            case 'Magna Cum Laude': return 'secondary';
            case 'Cum Laude': return 'info';
            default: return 'primary';
        }
    }

    function getHonorsBadgeClass(honors) {
        switch(honors) {
            case 'Summa Cum Laude': return 'badge-summa';
            case 'Magna Cum Laude': return 'badge-magna';
            case 'Cum Laude': return 'badge-cum';
            default: return '';
        }
    }

    function initializeDeansList() {
        // Add new Dean's List achiever
        $('#addAchieverForm').on('submit', function(e) {
            e.preventDefault();
            const year = $('#deanlistAcademicYear').val();

            if (!year) {
                showNotification('Please enter academic year.', 'error');
                return;
            }

            let record = deansListRecords.find(r => r.year === year);
            if (!record) {
                record = { year: year, achievers: [] };
                deansListRecords.push(record);
            }

            const imageFile = $('#achieverImage')[0].files[0];
            
            const newAchiever = {
                id: Date.now(),
                name: $('#achieverName').val(),
                program: $('#achieverProgram').val(),
                year: $('#achieverYear').val(),
                honors: $('#achieverHonors').val(),
                gwa: $('#achieverGWA').val(),
                achievements: $('#achieverAchievements').val().split(',').map(a => a.trim()).filter(a => a),
                image: imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/150x150/6a0dad/ffffff?text=Student"
            };
            
            record.achievers.push(newAchiever);
            localStorage.setItem('deansList', JSON.stringify(deansListRecords));
            loadAcademicYears();
            showNotification('Achiever added successfully!', 'success');
            this.reset();
        });

        // Edit Dean's List Year
        $(document).on('click', '.edit-deanslist-btn', function() {
            const year = $(this).data('year');
            const record = deansListRecords.find(r => r.year === year);
            
            if (record) {
                $('#editDeansListYear').text(year);
                loadEditDeansListContent(record);
                $('#editDeansListModal').modal('show');
            }
        });

        // Preview Dean's List
        $(document).on('click', '.preview-deanslist-btn', function() {
            const year = $(this).data('year');
            const record = deansListRecords.find(r => r.year === year);
            
            if (record) {
                $('#previewDeansListYear').text(year);
                loadPreviewDeansListContent(record);
                $('#previewDeansListModal').modal('show');
            }
        });

        // Remove entire Dean's List year
        $(document).on('click', '.remove-deanslist-btn', function() {
            const year = $(this).data('year');
            
            showConfirmation(
                `Are you sure you want to remove the entire Dean's List for Academic Year ${year}?`,
                function() {
                    deansListRecords = deansListRecords.filter(r => r.year !== year);
                    localStorage.setItem('deansList', JSON.stringify(deansListRecords));
                    loadAcademicYears();
                    showNotification('Dean\'s List removed successfully!', 'success');
                }
            );
        });

        // Save changes in edit modal
        $('#saveDeansListChanges').on('click', function() {
            const year = $('#editDeansListYear').text();
            const record = deansListRecords.find(r => r.year === year);
            
            if (record) {
                // Collect all achiever data from the edit form
                const updatedAchievers = [];
                $('.edit-achiever-item').each(function() {
                    const id = parseInt($(this).find('.edit-achiever-id').val());
                    const name = $(this).find('.edit-achiever-name').val();
                    const program = $(this).find('.edit-achiever-program').val();
                    const yearLevel = $(this).find('.edit-achiever-year').val();
                    const honors = $(this).find('.edit-achiever-honors').val();
                    const gwa = $(this).find('.edit-achiever-gwa').val();
                    const achievements = $(this).find('.edit-achiever-achievements').val().split(',').map(a => a.trim()).filter(a => a);
                    
                    updatedAchievers.push({
                        id: id,
                        name: name,
                        program: program,
                        year: yearLevel,
                        honors: honors,
                        gwa: gwa,
                        achievements: achievements
                    });
                });
                
                record.achievers = updatedAchievers;
                localStorage.setItem('deansList', JSON.stringify(deansListRecords));
                loadAcademicYears();
                $('#editDeansListModal').modal('hide');
                showNotification('Dean\'s List updated successfully!', 'success');
            }
        });
    }

    function loadEditDeansListContent(record) {
        const content = `
            <div class="edit-deanslist-content">
                <h6 class="mb-3">Edit Achievers for Academic Year ${record.year}</h6>
                <div id="editAchieversList">
                    ${record.achievers && record.achievers.length > 0 ? 
                        record.achievers.map(achiever => `
                            <div class="edit-achiever-item">
                                <input type="hidden" class="edit-achiever-id" value="${achiever.id}">
                                <div class="row g-2">
                                    <div class="col-md-4">
                                        <label class="form-label">Name</label>
                                        <input type="text" class="form-control edit-achiever-name" value="${achiever.name}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Program</label>
                                        <select class="form-select edit-achiever-program" required>
                                            <option value="BSCS" ${achiever.program === 'BSCS' ? 'selected' : ''}>BSCS</option>
                                            <option value="BSIT" ${achiever.program === 'BSIT' ? 'selected' : ''}>BSIT</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label">Year</label>
                                        <select class="form-select edit-achiever-year" required>
                                            <option value="1" ${achiever.year === '1' ? 'selected' : ''}>1</option>
                                            <option value="2" ${achiever.year === '2' ? 'selected' : ''}>2</option>
                                            <option value="3" ${achiever.year === '3' ? 'selected' : ''}>3</option>
                                            <option value="4" ${achiever.year === '4' ? 'selected' : ''}>4</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Honors</label>
                                        <select class="form-select edit-achiever-honors" required>
                                            <option value="Cum Laude" ${achiever.honors === 'Cum Laude' ? 'selected' : ''}>Cum Laude</option>
                                            <option value="Magna Cum Laude" ${achiever.honors === 'Magna Cum Laude' ? 'selected' : ''}>Magna Cum Laude</option>
                                            <option value="Summa Cum Laude" ${achiever.honors === 'Summa Cum Laude' ? 'selected' : ''}>Summa Cum Laude</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">GWA</label>
                                        <input type="number" step="0.01" class="form-control edit-achiever-gwa" value="${achiever.gwa}" required>
                                    </div>
                                    <div class="col-md-9">
                                        <label class="form-label">Achievements</label>
                                        <input type="text" class="form-control edit-achiever-achievements" value="${achiever.achievements.join(', ')}" placeholder="Separate with commas">
                                    </div>
                                </div>
                            </div>
                        `).join('')
                        : '<p class="text-muted">No achievers to edit</p>'
                    }
                </div>
            </div>
        `;
        $('#editDeansListContent').html(content);
    }

    function loadPreviewDeansListContent(record) {
        const content = `
            <div class="preview-deanslist-content">
                <div class="preview-deanslist-header">
                    <div class="college-name">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</div>
                    <h3>DEAN'S LIST HONOREES</h3>
                    <div class="academic-year">Academic Year ${record.year}</div>
                </div>
                
                <div class="mt-4">
                    <table class="achievers-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Program</th>
                                <th>Year Level</th>
                                <th>Honors</th>
                                <th>GWA</th>
                                <th>Achievements</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${record.achievers && record.achievers.length > 0 ? 
                                record.achievers.map(achiever => `
                                    <tr>
                                        <td>
                                            ${achiever.image ? `
                                                <img src="${achiever.image}" alt="${achiever.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                            ` : `
                                                <div style="width: 50px; height: 50px; background: var(--light-purple); border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user text-muted"></i>
                                                </div>
                                            `}
                                        </td>
                                        <td><strong>${achiever.name}</strong></td>
                                        <td>${achiever.program}</td>
                                        <td>Year ${achiever.year}</td>
                                        <td>
                                            <span class="honors-badge ${getHonorsBadgeClass(achiever.honors)}">
                                                ${achiever.honors}
                                            </span>
                                        </td>
                                        <td>${achiever.gwa}</td>
                                        <td>
                                            ${achiever.achievements && achiever.achievements.length > 0 ? 
                                                `<ul style="margin: 0; padding-left: 1rem;">
                                                    ${achiever.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                                </ul>`
                                                : '<em>No additional achievements</em>'
                                            }
                                        </td>
                                    </tr>
                                `).join('')
                                : `
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-3">
                                        No achievers found for this academic year
                                    </td>
                                </tr>
                                `
                            }
                        </tbody>
                    </table>
                </div>
                
                <div class="mt-4 text-center text-muted">
                    <small>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                </div>
            </div>
        `;
        $('#previewDeansListContent').html(content);
    }

    // =====================================
    // INITIALIZATION & HELPER FUNCTIONS
    // =====================================

    function showNotification(message, type) {
        // Remove any existing notifications first
        $('.alert').alert('close');
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const className = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHtml = `
            <div class="alert ${className} alert-dismissible fade show fixed-top m-3 shadow" role="alert" style="z-index: 1060; max-width: 400px; left: auto; right: 20px; top: 20px;">
                <i class="fas ${icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $('body').append(alertHtml);
        
        // Auto close after 4 seconds
        setTimeout(() => {
            $('.alert').alert('close');
        }, 4000);
    }

    // Prevent tab content flash and ensure proper initialization
    function initializeTabSystem() {
        // Hide all tab panes first
        $('.tab-pane').removeClass('show active');
        
        // Show only the active tab
        $('#announcements').addClass('show active');
        
        // Initialize Bootstrap tabs properly
        $('#updatesTab button').on('click', function(e) {
            e.preventDefault();
            const target = $(this).data('bs-target');
            
            // Hide all tab panes
            $('.tab-pane').removeClass('show active');
            
            // Show the target tab pane
            $(target).addClass('show active');
            
            // Update active nav link
            $('#updatesTab button').removeClass('active');
            $(this).addClass('active');
        });
    }

    function initializeFormHandlers() {
        initializeConfirmationModal();
        initializeAnnouncements();
        initializeEventsAchievements();
        initializeDeansList();
    }

    function loadAllData() {
        loadAnnouncements();
        loadEventsAchievements();
        loadAcademicYears();
    }

    // Initialize when document is ready
    initializePage();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});