// academics.js - Complete JavaScript for Academics Page (User Side Only)
document.addEventListener('DOMContentLoaded', function() {
    
    // Global notification function
    window.showNotification = function(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notificationClass = type === 'error' ? 'alert-danger' : 
                                 type === 'success' ? 'alert-success' : 
                                 type === 'warning' ? 'alert-warning' :
                                 'alert-info';
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'success' ? 'fa-check-circle' : 
                         type === 'warning' ? 'fa-exclamation-triangle' :
                         'fa-info-circle';
        
        const notification = document.createElement('div');
        notification.className = `notification alert ${notificationClass} alert-dismissible fade show`;
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `<i class="fas ${iconClass} me-2"></i>${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    };

    // Hash mapping for URL navigation
    const hashMapping = {
        'programs': 'programs-section',
        'curriculum': 'curriculum-section',
        'schedule': 'schedule-section',
        'calendar': 'calendar-section'
    };

    // Show specific section - ENHANCED VERSION
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            targetSection.style.display = 'block';
            
            // Scroll to section with offset for header
            const universityHeader = document.querySelector('.university-header');
            const navbarMain = document.querySelector('.navbar-main');
            
            const headerHeight = (universityHeader ? universityHeader.offsetHeight : 0) + 
                               (navbarMain ? navbarMain.offsetHeight : 0) + 20;
            
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
            
            // Update URL hash - ONLY if it's different
            const currentHash = window.location.hash.substring(1);
            const mappedHash = Object.keys(hashMapping).find(key => hashMapping[key] === sectionId) || sectionId;
            
            if (currentHash !== mappedHash) {
                if (window.history.pushState) {
                    window.history.pushState(null, null, `#${mappedHash}`);
                } else {
                    window.location.hash = mappedHash;
                }
            }
            
            // Initialize section-specific components
            initializeSectionComponents(sectionId);
        } else {
            // Fallback to programs section
            console.warn('Section not found, defaulting to programs-section');
            showSection('programs-section');
        }
    }

    // Initialize section-specific components
    function initializeSectionComponents(sectionId) {
        switch(sectionId) {
            case 'programs-section':
                initAcademicsPrograms();
                break;
            case 'curriculum-section':
                initCurriculumTabs();
                break;
            case 'schedule-section':
                // Schedule manager is already initialized
                // Re-run display in case it was hidden/cleared
                if (window.scheduleManager) {
                    window.scheduleManager.displayCurrentSchedule();
                }
                break;
            case 'calendar-section':
                initCalendarViewer();
                break;
        }
    }

    // Academic Programs Management
    let academicsPrograms = [];

    function initAcademicsPrograms() {
        loadAcademicsPrograms();
        setupAcademicsProgramsAutoRefresh();
    }

    function loadAcademicsPrograms() {
        // Fetch programs from database via AJAX
        const baseUrl = window.location.origin + '/ccis_connect/index.php/academics/get_programs_json';
        console.log('Fetching programs from:', baseUrl);
        
        fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Programs fetched from database:', data);
            if (data && Array.isArray(data) && data.length > 0) {
                academicsPrograms = data;
                console.log('Successfully loaded', data.length, 'programs from database');
            } else {
                console.warn('No programs returned from database, using defaults');
                academicsPrograms = getAcademicsDefaultPrograms();
            }
            renderAcademicsPrograms();
        })
        .catch(error => {
            console.error('Error fetching programs from database:', error);
            console.log('Falling back to default programs');
            // Fallback to default programs if fetch fails
            academicsPrograms = getAcademicsDefaultPrograms();
            renderAcademicsPrograms();
        });
    }

    function getAcademicsDefaultPrograms() {
        return [
            {
                id: 1,
                name: "Bachelor of Science in Computer Science (BSCS)",
                icon: "fas fa-laptop-code",
                description: "A four-year degree program that focuses on the study of computer algorithms, software development, and computer systems design. Students learn programming, data structures, algorithms, software engineering, and computer architecture.",
                courses: [
                    "Software Developer/Engineer",
                    "Systems Analyst",
                    "Web Developer",
                    "Mobile App Developer",
                    "Data Scientist",
                    "AI/Machine Learning Engineer",
                    "Game Developer",
                    "Research and Development Specialist"
                ],
                isDefault: true,
                visible: true
            },
            {
                id: 2,
                name: "Bachelor of Science in Information Technology (BSIT)",
                icon: "fas fa-network-wired",
                description: "A four-year degree program that emphasizes information technology infrastructure, networking, system administration, and enterprise solutions. Students gain skills in network management, database administration, and IT project management.",
                courses: [
                    "Network Administrator",
                    "IT Support Specialist",
                    "Database Administrator",
                    "System Administrator",
                    "IT Project Manager",
                    "Cyber Security Specialist",
                    "Web Administrator",
                    "Technical Support Engineer"
                ],
                isDefault: true,
                visible: true
            }
        ];
    }

    function renderAcademicsPrograms() {
        const programsGrid = document.getElementById('programs-grid');
        if (!programsGrid) return;
        
        const visiblePrograms = academicsPrograms.filter(program => program.visible !== false);
        
        if (visiblePrograms.length === 0) {
            programsGrid.innerHTML = '<div class="col-12 text-center py-5"><i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i><h4 class="text-muted">No Academic Programs Available</h4><p class="text-muted">Program information will be displayed here once available.</p></div>';
            return;
        }
        
        programsGrid.innerHTML = '';
        
        const gridClass = getOptimalGridClass(visiblePrograms.length);
        programsGrid.className = `programs-grid ${gridClass}`;
        
        visiblePrograms.forEach((program, index) => {
            const programHtml = createAcademicsProgramHtml(program, index);
            programsGrid.innerHTML += programHtml;
        });
    }

    function getOptimalGridClass(programCount) {
        if (programCount === 1) return 'programs-single';
        if (programCount === 2) return 'programs-double';
        if (programCount === 3) return 'programs-triple';
        if (programCount === 4) return 'programs-quad';
        if (programCount <= 6) return 'programs-multiple';
        return 'programs-multiple';
    }

    function createAcademicsProgramHtml(program, index) {
        const coursesList = program.courses.map(course => `<li>${course}</li>`).join('');
        const adminBadge = program.isDefault ? '' : '<span class="admin-badge">New Program</span>';
        const animationDelay = index * 0.1;
        
        return `
            <div class="program-card detailed" style="animation-delay: ${animationDelay}s">
                ${adminBadge}
                <div class="program-header">
                    <i class="${program.icon}"></i>
                    <h4>${program.name}</h4>
                </div>
                <div class="program-details">
                    <p><strong>Program Description:</strong> ${program.description}</p>
                    <div class="program-features">
                        <h5>Career Opportunities:</h5>
                        <ul>${coursesList}</ul>
                    </div>
                </div>
            </div>
        `;
    }

    function setupAcademicsProgramsAutoRefresh() {
        // Check for updates daily (86400000 ms = 24 hours)
        setInterval(() => {
            checkForAcademicsProgramUpdates();
        }, 86400000);
    }

    function checkForAcademicsProgramUpdates() {
        // Fetch latest programs from database
        const baseUrl = window.location.origin + '/ccis_connect/index.php/academics/get_programs_json';
        
        fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(newPrograms => {
            if (!newPrograms || newPrograms.length === 0) {
                return;
            }
            
            const currentIds = academicsPrograms.map(p => p.id).join(',');
            const newIds = newPrograms.map(p => p.id).join(',');
            
            if (currentIds !== newIds) {
                console.log('Program updates detected, refreshing...');
                academicsPrograms = newPrograms;
                renderAcademicsPrograms();
                
                showNotification('Academic programs updated!', 'success');
            }
        })
        .catch(error => {
            console.warn('Error checking for program updates:', error);
        });
    }

    // Curriculum Management
    function initCurriculumViewers() {
        // Add event listeners for curriculum PDF viewing
        document.querySelectorAll('.view-curriculum-pdf').forEach(button => {
            button.addEventListener('click', (e) => {
                const program = e.target.getAttribute('data-program');
                viewCurriculumPDF(program);
            });
        });

        // Add event listeners for curriculum download
        document.querySelectorAll('.curriculum-download').forEach(button => {
            button.addEventListener('click', (e) => {
                const program = e.target.getAttribute('data-program');
                downloadCurriculumPDF(program);
            });
        });

        // Add event listeners for closing curriculum PDF
        document.querySelectorAll('.close-curriculum-pdf').forEach(button => {
            button.addEventListener('click', (e) => {
                const program = e.target.getAttribute('data-program');
                closeCurriculumPDF(program);
            });
        });

        // Setup auto-refresh for curriculum updates
        setupCurriculumAutoRefresh();
    }

    function viewCurriculumPDF(program) {
        // Hide placeholder and show PDF embed
        const pdfPlaceholder = document.getElementById(`${program}-pdf-placeholder`);
        const pdfEmbedContainer = document.getElementById(`${program}-pdfEmbedContainer`);
        
        if (pdfPlaceholder && pdfEmbedContainer) {
            pdfPlaceholder.style.display = 'none';
            pdfEmbedContainer.style.display = 'block';
            
            // Scroll to the PDF viewer
            const curriculumSection = document.getElementById('curriculum-section');
            if (curriculumSection) {
                window.scrollTo({
                    top: curriculumSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    }

    function closeCurriculumPDF(program) {
        const pdfPlaceholder = document.getElementById(`${program}-pdf-placeholder`);
        const pdfEmbedContainer = document.getElementById(`${program}-pdfEmbedContainer`);
        
        if (pdfPlaceholder && pdfEmbedContainer) {
            pdfEmbedContainer.style.display = 'none';
            pdfPlaceholder.style.display = 'block';
        }
    }

    function downloadCurriculumPDF(program) {
        showNotification(`Preparing ${program.toUpperCase()} Curriculum download...`, 'info');
        
        const filename = program === 'bscs' ? 'BSCS-CURRICULUM.pdf' : 'BSIT-CURRICULUM.pdf';
        const downloadName = program === 'bscs' ? 'bscs_new_curriculum_2024_2025.pdf' : 'bsit_new_curriculum_2024_2025.pdf';
        
        // Create temporary download link
        const link = document.createElement('a');
        link.href = filename;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`${program.toUpperCase()} Curriculum download started!`, 'success');
    }

    function setupCurriculumAutoRefresh() {
        // Check for curriculum updates every 3 seconds
        setInterval(() => {
            checkForCurriculumUpdates();
        }, 3000);
    }

    function checkForCurriculumUpdates() {
        const storedData = localStorage.getItem('ccis_curriculum_data');
        
        if (storedData) {
            try {
                const newData = JSON.parse(storedData);
                
                // Update curriculum data if new data is available
                // You can add update logic here if needed
                
            } catch (error) {
                console.error('Error checking for curriculum updates:', error);
            }
        }
    }

    // Initialize curriculum tabs
    function initCurriculumTabs() {
        const tabButtons = document.querySelectorAll('#curriculum-section .tab-nav .tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab pane
                document.querySelectorAll('#curriculum-section .tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });

        // Initialize curriculum viewers
        initCurriculumViewers();
    }

    // Class Schedule Management
    class ScheduleManager {
        constructor() {
            this.currentSchedule = this.loadScheduleData();
            this.init();
        }

        loadScheduleData() {
            const storedData = localStorage.getItem('ccis_schedule_data');
            
            if (storedData) {
                try {
                    return JSON.parse(storedData);
                } catch (error) {
                    console.error('Error parsing schedule data:', error);
                }
            }
            
            // Default schedule data with CLASS-SCHEDULE.pdf
            return {
                title: "Academic Year 2024-2025 First Semester",
                filename: "CLASS-SCHEDULE.pdf",
                filePath: "CLASS-SCHEDULE.pdf",
                fileSize: "2.3 MB",
                uploadDate: "2024-01-15",
                uploadedBy: "Admin",
                hasFile: true
            };
        }

        displayCurrentSchedule() {
            const schedulePlaceholder = document.getElementById('schedule-pdf-placeholder');
            
            if (this.currentSchedule.hasFile && schedulePlaceholder) {
                schedulePlaceholder.innerHTML = `
                    <div class="pdf-placeholder">
                        <i class="fas fa-file-pdf pdf-icon"></i>
                        <h4>Class Schedule 2024-2025</h4>
                        <p>View the complete class schedule for the current semester including all courses, times, and room assignments.</p>
                        <div class="button-group-tapad mt-4">
                            <button class="btn btn-view-pdf me-2 view-schedule-pdf">
                                <i class="fas fa-eye me-1"></i>View PDF
                            </button>
                            <button class="btn btn-download-pdf" onclick="scheduleManager.downloadPDF()">
                                <i class="fas fa-download me-1"></i>Download
                            </button>
                        </div>
                    </div>
                `;
                
                // Add event listener for the view button
                const viewButton = schedulePlaceholder.querySelector('.view-schedule-pdf');
                if (viewButton) {
                    viewButton.addEventListener('click', () => {
                        this.viewPDF();
                    });
                }
            } else if (!this.currentSchedule.hasFile && schedulePlaceholder) {
                schedulePlaceholder.innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i>No official schedule file has been uploaded yet.</div>';
            }
        }

        viewPDF() {
            if (!this.currentSchedule.hasFile) {
                showNotification('No schedule PDF available to view.', 'error');
                return;
            }
            
            // Hide placeholder and show PDF embed
            const pdfPlaceholder = document.getElementById('schedule-pdf-placeholder');
            const pdfEmbedContainer = document.getElementById('schedule-pdfEmbedContainer');
            
            if (pdfPlaceholder && pdfEmbedContainer) {
                pdfPlaceholder.style.display = 'none';
                pdfEmbedContainer.style.display = 'block';
                
                // Scroll to the PDF viewer
                const scheduleSection = document.getElementById('schedule-section');
                if (scheduleSection) {
                    window.scrollTo({
                        top: scheduleSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
                
                showNotification('Opening class schedule PDF...', 'info');
            }
        }

        closePDF() {
            const pdfPlaceholder = document.getElementById('schedule-pdf-placeholder');
            const pdfEmbedContainer = document.getElementById('schedule-pdfEmbedContainer');
            
            if (pdfPlaceholder && pdfEmbedContainer) {
                pdfEmbedContainer.style.display = 'none';
                pdfPlaceholder.style.display = 'block';
            }
        }

        downloadPDF() {
            if (!this.currentSchedule.hasFile) {
                showNotification('No schedule PDF available for download.', 'error');
                return;
            }
            
            showNotification('Preparing class schedule PDF download...', 'info');
            
            // Create temporary download link for CLASS-SCHEDULE.pdf
            const link = document.createElement('a');
            link.href = 'CLASS-SCHEDULE.pdf';
            link.download = 'class_schedule_2024_2025.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Class schedule PDF download started!', 'success');
        }

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }

        setupAutoRefresh() {
            setInterval(() => {
                this.checkForScheduleUpdates();
            }, 3000);
        }

        checkForScheduleUpdates() {
            const storedData = localStorage.getItem('ccis_schedule_data');
            
            if (storedData) {
                try {
                    const newData = JSON.parse(storedData);
                    const currentData = JSON.stringify(this.currentSchedule);
                    const newDataStr = JSON.stringify(newData);
                    
                    if (currentData !== newDataStr) {
                        this.currentSchedule = newData;
                        this.displayCurrentSchedule();
                        showNotification('Class schedule has been updated!', 'info');
                    }
                } catch (error) {
                    console.error('Error checking for schedule updates:', error);
                }
            }
        }

        init() {
            this.displayCurrentSchedule();
            this.setupAutoRefresh();
            
            // Add event listener for closing schedule PDF
            const closeButton = document.querySelector('.close-schedule-pdf');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.closePDF();
                });
            }
        }
    }

    // Academic Calendar Management
    function initCalendarViewer() {
        console.log('Initializing Academic Calendar Viewer...');
        
        // View PDF button click
        const viewPdfBtn = document.getElementById('viewPdfBtn');
        if (viewPdfBtn) {
            viewPdfBtn.addEventListener('click', function() {
                console.log('Opening PDF viewer...');
                
                // Hide placeholder and show PDF embed
                const pdfPlaceholder = document.getElementById('pdf-placeholder');
                const pdfEmbedContainer = document.getElementById('pdfEmbedContainer');
                
                if (pdfPlaceholder && pdfEmbedContainer) {
                    pdfPlaceholder.style.display = 'none';
                    pdfEmbedContainer.style.display = 'block';
                    
                    // Scroll to PDF viewer smoothly
                    const calendarSection = document.getElementById('calendar-section');
                    if (calendarSection) {
                        window.scrollTo({
                            top: calendarSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }
        
        // Close PDF button click
        const closePdfBtn = document.getElementById('closePdfBtn');
        if (closePdfBtn) {
            closePdfBtn.addEventListener('click', function() {
                console.log('Closing PDF viewer...');
                
                // Hide PDF embed and show placeholder
                const pdfPlaceholder = document.getElementById('pdf-placeholder');
                const pdfEmbedContainer = document.getElementById('pdfEmbedContainer');
                
                if (pdfPlaceholder && pdfEmbedContainer) {
                    pdfEmbedContainer.style.display = 'none';
                    pdfPlaceholder.style.display = 'block';
                    
                    // Scroll back to top of calendar section
                    const calendarSection = document.getElementById('calendar-section');
                    if (calendarSection) {
                        window.scrollTo({
                            top: calendarSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }

        // Setup auto-refresh for calendar updates
        setupCalendarAutoRefresh();
    }

    // Academic Calendar Download Function
    window.downloadAcademicCalendar = function() {
        showNotification('Preparing Academic Calendar download...', 'info');
        
        // Create temporary download link
        const link = document.createElement('a');
        link.href = 'ACADEMIC-CALENDAR.pdf';
        link.download = 'academic_calendar_2024_2025.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Academic Calendar download started!', 'success');
    }

    function setupCalendarAutoRefresh() {
        // Check for calendar updates every 3 seconds
        setInterval(() => {
            checkForCalendarUpdates();
        }, 3000);
    }

    function checkForCalendarUpdates() {
        const storedData = localStorage.getItem('ccis_calendar_data');
        
        if (storedData) {
            try {
                const newData = JSON.parse(storedData);
                
                // Update calendar data if new data is available
                // You can add update logic here if needed
                
            } catch (error) {
                console.error('Error checking for calendar updates:', error);
            }
        }
    }

    // Back to Top functionality
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop);
    }

    // Update active navigation states
    function updateActiveStates() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (currentPage === 'academics.html') {
            const academicsDropdown = document.getElementById('academicsDropdown');
            if (academicsDropdown) {
                academicsDropdown.classList.add('active');
            }
        }
    }

    // Handle navigation from dropdown menu - ENHANCED VERSION
    function setupDropdownNavigation() {
        // Handle dropdown item clicks for Academics page sections
        document.querySelectorAll('.dropdown-item[href^="#"]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Dropdown item clicked:', this.getAttribute('href'));
                
                // Check if the link is blocked first (logic handled by session-management.js filter)
                if (this.classList.contains('blocked-nav-item')) {
                     console.log('Item is blocked, skipping navigation');
                     return;
                }
                const targetId = this.getAttribute('href').substring(1);
                console.log('Target section:', targetId);
                showSection(targetId);
            });
        });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const validSections = ['programs-section', 'curriculum-section', 'schedule-section', 'calendar-section'];
        
        let mappedHash = hashMapping[hash] || hash;
        
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    });

    // Handle hash changes (e.g. clicking nav links like /academics#calendar-section while already on /academics)
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const validSections = ['programs-section', 'curriculum-section', 'schedule-section', 'calendar-section'];

        const mappedHash = hashMapping[hash] || hash;
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    // Handle hash on page load - FIXED VERSION
    function handleHashOnLoad() {
        // Only run this on the Academics page - check if academics content sections exist
        const academicsPageSections = document.querySelectorAll('.content-section');
        if (academicsPageSections.length === 0) {
            // Not on the academics page, don't modify the URL
            return;
        }
        
        let hash = window.location.hash.substring(1);
        const validSections = ['programs-section', 'curriculum-section', 'schedule-section', 'calendar-section'];
        
        // Map hash to actual section IDs
        if (hashMapping[hash]) {
            hash = hashMapping[hash];
            window.location.hash = hash;
        }
        
        // Determine which section to show
        let targetSection;
        if (hash && validSections.includes(hash)) {
            targetSection = hash;
        } else if (hash) {
            // If there's a hash but it's not valid, show programs section
            targetSection = 'programs-section';
        } else {
            // No hash at all - just show programs section without modifying URL
            targetSection = 'programs-section';
            // Don't add hash to URL when coming from other pages
            showSection(targetSection);
            return;
        }
        
        showSection(targetSection);
    }

    // Fix mobile dropdown positioning
    function fixMobileDropdowns() {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.position = 'static';
                menu.style.float = 'none';
                menu.style.transform = 'none';
            });
        }
    }

    // Initialize everything - ENHANCED VERSION
    function initializeAll() {
        console.log('Initializing Academics Page...');
        
        // Initialize managers
        window.scheduleManager = new ScheduleManager();
        
        // Set up navigation
        handleHashOnLoad();
        setupDropdownNavigation();
        initBackToTop();
        updateActiveStates();
        
        // Fix mobile dropdown positioning
        fixMobileDropdowns();
        window.addEventListener('resize', fixMobileDropdowns);
        
        // Force re-apply role filter
        if (typeof window.filterContentByRole === 'function') {
            window.filterContentByRole(); 
            console.log('✅ Role-based blocking re-applied.');
        }
        
        // Double-check that only the correct section is visible
        setTimeout(() => {
            const currentHash = window.location.hash.substring(1);
            const targetSection = hashMapping[currentHash] || currentHash;
            const validSections = ['programs-section', 'curriculum-section', 'schedule-section', 'calendar-section'];
            
            if (targetSection && validSections.includes(targetSection)) {
                // Hide all other sections
                document.querySelectorAll('.content-section').forEach(section => {
                    if (section.id !== targetSection) {
                        section.style.display = 'none';
                        section.classList.remove('active-section');
                    }
                });
            }
        }, 100);
        
        console.log('✅ Academics Page Loaded Successfully');
        console.log('📚 Programs, Curriculum, Schedule, and Calendar systems initialized');
        console.log('📄 PDF files ready for: BSCS-CURRICULUM.pdf, BSIT-CURRICULUM.pdf, CLASS-SCHEDULE.pdf, ACADEMIC-CALENDAR.pdf');
        console.log('🎯 Tapad buttons implemented for all PDF sections');
        console.log('📱 Mobile dropdowns fixed to appear on left side');
    }

    // Start the application
    initializeAll();
});