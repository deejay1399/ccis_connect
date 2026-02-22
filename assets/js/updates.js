// UPDATES PAGE JAVASCRIPT - COMPLETE FUNCTIONALITY WITH FLOATING BUTTON

document.addEventListener('DOMContentLoaded', function() {
    console.log('ðŸ”„ Initializing Updates Page...');
    
    // Global variables for image gallery navigation
    let currentGalleryImages = [];
    let currentImageIndex = 0;
    let currentGalleryId = '';
    
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
        'announcements': 'announcements-section',
        'events-achievements': 'events-achievements-section', 
        'deanslist': 'deanslist-section'
    };

    // Show specific section - FIXED VERSION
    function showSection(sectionId) {
        console.log('ðŸŽ¬ Showing section:', sectionId);
        
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
            
            // Update URL hash
            const currentHash = window.location.hash.substring(1);
            const mappedHash = Object.keys(hashMapping).find(key => hashMapping[key] === sectionId) || sectionId;
            
            if (currentHash !== mappedHash) {
                if (window.history.pushState) {
                    window.history.pushState(null, null, `#${mappedHash}`);
                } else {
                    window.location.hash = mappedHash;
                }
            }
            
            // Load section-specific content with better timing
            console.log('ðŸ•’ Loading content for:', sectionId);
            setTimeout(() => {
                loadSectionContent(sectionId);
            }, 150);
        } else {
            console.warn('âŒ Section not found:', sectionId);
            showSection('announcements-section');
        }
    }

    // Load section-specific content - IMPROVED VERSION
    function loadSectionContent(sectionId) {
        console.log('ðŸ“¦ Loading content for section:', sectionId);
        
        switch(sectionId) {
            case 'announcements-section':
                initializeAnnouncementsContent();
                break;
                
            case 'events-achievements-section':
                initializeEventsContent();
                break;
                
            case 'deanslist-section':
                console.log('ðŸ† Loading Dean\'s List section');
                initializeDeansListContent();
                break;
                
            default:
                console.warn('âŒ Unknown section:', sectionId);
        }
    }

    // Initialize Announcements Content
    function initializeAnnouncementsContent() {
        console.log('ðŸ“¢ Initializing announcements content...');
        
        // Initialize Read More buttons for announcements
        initializeReadMoreButtons();
        
        // Initialize PDF button functionality
        initializePDFButtons();
        
        // Initialize view buttons for sorting
        initializeViewButtons();
        
        // Initialize image gallery functionality
        initializeImageGallery();
        
        console.log('âœ… Announcements content initialized');
    }

    // Initialize Events & Achievements Content
    function initializeEventsContent() {
        console.log('ðŸŽ‰ Initializing events content...');
        
        // Initialize Read More buttons for events
        initializeReadMoreButtons();
        
        // Initialize view buttons for sorting
        initializeViewButtons();
        
        // Initialize image gallery functionality
        initializeImageGallery();
        
        console.log('âœ… Events content initialized');
    }

    // Initialize Dean's List Content
    function initializeDeansListContent() {
        console.log('ðŸ† Initializing Dean\'s List content...');
        
        // Remove semester filter if it exists
        const semesterFilter = document.querySelector('.semester-filter');
        if (semesterFilter) {
            semesterFilter.remove();
        }
        
        // Initialize academic year filter
        initializeAcademicYearFilter();
        
        // Load Dean's List data
        loadDeansListData();
        
        console.log('âœ… Dean\'s List content initialized');
    }

    // Initialize Read More buttons with light gray to purple styling
    function initializeReadMoreButtons() {
        console.log('ðŸ“– Initializing Read More buttons...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.readMore');
        
        // Add event delegation for Read More buttons
        $(document).on('click.readMore', '.btn-read-more', function(e) {
            e.preventDefault();
            console.log('ðŸ“– Read More button clicked!');
            
            const $btn = $(this);
            const $container = $btn.closest('.announcement-content-container, .event-description-container, .achievement-description-container');
            const $content = $container.find('.announcement-content, .event-description, .achievement-description');
            const fullText = $btn.data('full-text') || $content.data('full-text');
            
            if (!$btn.data('full-text') && !$content.data('full-text')) {
                // Store the full text if not already stored
                const currentText = $content.text();
                $content.data('full-text', currentText);
                
                // Create shortened version (first 300 characters)
                if (currentText.length > 300) {
                    const shortText = currentText.substring(0, 300) + '...';
                    $content.text(shortText);
                    $btn.data('full-text', currentText);
                } else {
                    // Text is already short, no need for Read More
                    $btn.hide();
                    return;
                }
            }
            
            const storedFullText = $btn.data('full-text') || $content.data('full-text');
            
            if ($btn.hasClass('expanded')) {
                // Collapse - show shortened text
                const shortText = storedFullText.substring(0, 300) + '...';
                $content.text(shortText);
                $btn.html('<i class="fas fa-chevron-down me-1"></i>Read More');
                $btn.removeClass('expanded');
                
                // Remove purple styling (back to light gray)
                $btn.css({
                    'background': '#f8f9fa',
                    'color': '#6c757d',
                    'border': '2px solid #dee2e6'
                });
            } else {
                // Expand - show full text
                $content.text(storedFullText);
                $btn.html('<i class="fas fa-chevron-up me-1"></i>Show Less');
                $btn.addClass('expanded');
                
                // Apply purple styling temporarily, then back to light gray
                $btn.css({
                    'background': 'linear-gradient(135deg, #4b0082 0%, #6a0dad 100%)',
                    'color': 'white',
                    'border': '2px solid #4b0082'
                });
                
                // After animation, revert to light gray for Show Less
                setTimeout(() => {
                    if ($btn.hasClass('expanded')) {
                        $btn.css({
                            'background': '#f8f9fa',
                            'color': '#6c757d',
                            'border': '2px solid #dee2e6'
                        });
                    }
                }, 300);
            }
        });
        
        console.log('âœ… Read More buttons initialized');
    }

    // Initialize PDF buttons with light gray to purple styling
    function initializePDFButtons() {
        console.log('ðŸ“„ Initializing PDF buttons...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.pdfButtons');
        
        // Add event delegation for PDF buttons
        $(document).on('click.pdfButtons', '.btn-view-pdf, .btn-download-pdf', function(e) {
            e.preventDefault();
            console.log('ðŸ“„ PDF button clicked!');
            
            const $btn = $(this);
            const isViewBtn = $btn.hasClass('btn-view-pdf');
            const pdfUrl = $btn.data('pdf-url') || $btn.closest('.announcement-pdf').find('a').attr('href') || '#';
            
            // Show appropriate notification
            if (isViewBtn) {
                showNotification('Opening PDF viewer...', 'info');
                // Open PDF in new tab
                window.open(pdfUrl, '_blank');
            } else {
                showNotification('Preparing PDF download...', 'info');
                // Trigger download
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = $btn.data('pdf-title') || pdfUrl.split('/').pop() || 'document.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            // Add temporary active state (purple during click)
            $btn.css({
                'background': 'linear-gradient(135deg, #6a0dad 0%, #4b0082 100%)',
                'transform': 'translateY(0)',
                'box-shadow': '0 2px 8px rgba(75, 0, 130, 0.4)'
            });
            
            // Reset after animation (back to light gray)
            setTimeout(() => {
                $btn.css({
                    'background': '#f8f9fa',
                    'color': '#6c757d',
                    'border': '2px solid #dee2e6',
                    'transform': '',
                    'box-shadow': ''
                });
            }, 300);
        });
        
        console.log('âœ… PDF buttons initialized');
    }

    // Initialize view buttons for sorting
    function initializeViewButtons() {
        console.log('ðŸ” Initializing view buttons...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.viewButtons');
        
        // Add event delegation for view buttons
        $(document).on('click.viewButtons', '.view-btn', function(e) {
            e.preventDefault();
            console.log('ðŸ” View button clicked!');
            
            const $btn = $(this);
            const type = $btn.data('type');
            const sort = $btn.data('sort');
            
            // Update active state
            $btn.siblings().removeClass('active');
            $btn.addClass('active');
            
            // Show notification
            showNotification(`Sorting ${type} by ${sort === 'latest' ? 'latest first' : 'oldest first'}`, 'info');
            
            // Add your sorting logic here
            console.log(`Sorting ${type} by ${sort}`);
            
            // Update the view buttons to have light gray to purple styling
            updateViewButtonsStyling();
        });
        
        console.log('âœ… View buttons initialized');
    }

    // Update view buttons styling
    function updateViewButtonsStyling() {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                btn.style.background = 'linear-gradient(135deg, #4b0082 0%, #6a0dad 100%)';
                btn.style.color = 'white';
                btn.style.borderColor = '#4b0082';
            } else {
                btn.style.background = '#f8f9fa';
                btn.style.color = '#6c757d';
                btn.style.borderColor = '#dee2e6';
            }
        });
    }

    // Initialize image gallery functionality with navigation - FIXED VERSION
    function initializeImageGallery() {
        console.log('ðŸ–¼ï¸ Initializing image gallery...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.imageGallery');
        
        // Add event delegation for image gallery
        $(document).on('click.imageGallery', '.gallery-image, .achievement-gallery-image, .event-gallery-image', function(e) {
            e.preventDefault();
            console.log('ðŸ–¼ï¸ Image clicked!');
            
            const $clickedImage = $(this);
            const galleryContainer = $clickedImage.closest('.images-gallery, .achievement-gallery, .event-gallery');
            const announcementId = galleryContainer.data('announcement-id');
            const eventId = galleryContainer.data('event-id');
            
            // Get all images in this gallery
            const images = [];
            galleryContainer.find('.gallery-image, .achievement-gallery-image, .event-gallery-image').each(function(index) {
                const $img = $(this).find('img');
                images.push({
                    src: $img.attr('src'),
                    alt: $img.attr('alt'),
                    caption: $img.attr('alt') || 'Image'
                });
            });
            
            // Get the clicked image index
            const imageIndex = parseInt($clickedImage.data('image-index') || 0);
            
            // Set global variables for navigation
            currentGalleryImages = images;
            currentImageIndex = imageIndex;
            currentGalleryId = announcementId || eventId || 'default';
            
            // Show modal with the clicked image
            showImageInModal(images[imageIndex].src, images[imageIndex].caption);
        });
        
        // Initialize modal navigation buttons
        initializeModalNavigation();
        
        console.log('âœ… Image gallery initialized');
    }

    // Show image in modal - FIXED VERSION
    function showImageInModal(src, caption) {
        $('#modalImage').attr('src', src).attr('alt', caption);
        $('#modalCaption').text(caption);
        
        // Show/hide navigation buttons based on number of images
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');
        
        if (currentGalleryImages.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        // Show modal
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
        
        // Add keyboard event listener when modal opens
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Remove event listener when modal closes
        $('#imageModal').on('hidden.bs.modal', function() {
            document.removeEventListener('keydown', handleKeyboardNavigation);
        });
    }

    // Handle keyboard navigation - FIXED VERSION
    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            navigateImage(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
            e.preventDefault();
        } else if (e.key === 'Escape') {
            const imageModal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
            if (imageModal) {
                imageModal.hide();
            }
        }
    }

    // Initialize modal navigation - FIXED VERSION
    function initializeModalNavigation() {
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');
        
        if (prevBtn && nextBtn) {
            // Remove existing event listeners
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            
            // Get fresh references
            const freshPrevBtn = document.getElementById('prevImageBtn');
            const freshNextBtn = document.getElementById('nextImageBtn');
            
            freshPrevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateImage(-1);
            });
            
            freshNextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateImage(1);
            });
        }
    }

    // Navigate between images - FIXED VERSION
    function navigateImage(direction) {
        if (currentGalleryImages.length === 0) return;
        
        currentImageIndex += direction;
        
        // Handle wrap-around
        if (currentImageIndex < 0) {
            currentImageIndex = currentGalleryImages.length - 1;
        } else if (currentImageIndex >= currentGalleryImages.length) {
            currentImageIndex = 0;
        }
        
        // Update modal with new image
        const image = currentGalleryImages[currentImageIndex];
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        
        if (modalImage && modalCaption) {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalCaption.textContent = image.caption;
        }
    }
    // ===============================
    // Dean's List (Achiever list, DB-backed)
    // ===============================

    let cachedDeansListRows = [];
    let selectedAcademicYear = 'all';
    let selectedProgram = 'all';
    let selectedYearLevel = 'all';

    function getBaseURL() {
        const b = window.baseUrl || window.BASE_URL;
        if (b) return b.endsWith('/') ? b : (b + '/');
        return window.location.origin + '/ccis_connect/';
    }

    function toYearLevelDisplay(value) {
        const v = String(value || '').trim().toLowerCase();
        if (v === 'first year' || v === '1st year') return '1st Year';
        if (v === 'second year' || v === '2nd year') return '2nd Year';
        if (v === 'third year' || v === '3rd year') return '3rd Year';
        if (v === 'fourth year' || v === '4th year') return '4th Year';
        return value || 'Unknown';
    }

    function toProgramDisplay(value) {
        const p = String(value || '').trim();
        if (p === '') return 'Unknown Program';
        if (p.toLowerCase().includes('program')) return p;
        return `${p} Program`;
    }

    function getUniqueAcademicYears(rows) {
        const set = new Set();
        rows.forEach(r => {
            if (r && r.academic_year) set.add(r.academic_year);
        });
        return Array.from(set).sort().reverse();
    }

    function getUniquePrograms(rows) {
        const set = new Set();
        rows.forEach(r => {
            if (r && r.program) set.add(r.program);
        });
        return Array.from(set).sort();
    }

    function getUniqueYearLevels(rows) {
        const set = new Set();
        rows.forEach(r => {
            if (r && r.year_level) set.add(r.year_level);
        });

        return Array.from(set).sort((a, b) => {
            const map = {
                'First Year': 1, '1st Year': 1,
                'Second Year': 2, '2nd Year': 2,
                'Third Year': 3, '3rd Year': 3,
                'Fourth Year': 4, '4th Year': 4
            };
            return (map[a] || 99) - (map[b] || 99);
        });
    }

    function renderDeansFilters(years, programs, yearLevels) {
        const filtersContainer = document.querySelector('.deanslist-filters') || document.querySelector('.academic-year-filter');
        if (!filtersContainer) return;

        const academicYearOptions = ['<option value="all">All</option>']
            .concat(years.map(y => `<option value="${y}">Academic Year ${y}</option>`))
            .join('');

        const programOptions = ['<option value="all">All</option>']
            .concat(programs.map(p => `<option value="${p}">${toProgramDisplay(p)}</option>`))
            .join('');

        const yearOptions = ['<option value="all">All</option>']
            .concat(yearLevels.map(y => `<option value="${y}">${toYearLevelDisplay(y)}</option>`))
            .join('');

        filtersContainer.style.display = 'block';
        filtersContainer.innerHTML = `
            <div class="deanslist-filters-container">
                <div class="filter-group-dropdown">
                    <label class="filter-label" for="academicYearSelect"><i class="fas fa-calendar-alt me-1"></i>Academic Year</label>
                    <select id="academicYearSelect" class="filter-select">${academicYearOptions}</select>
                </div>
                <div class="filter-group-dropdown">
                    <label class="filter-label" for="programSelect"><i class="fas fa-graduation-cap me-1"></i>Program</label>
                    <select id="programSelect" class="filter-select">${programOptions}</select>
                </div>
                <div class="filter-group-dropdown">
                    <label class="filter-label" for="yearLevelSelect"><i class="fas fa-user-graduate me-1"></i>Year Level</label>
                    <select id="yearLevelSelect" class="filter-select">${yearOptions}</select>
                </div>
            </div>
        `;

        const academicYearSelect = document.getElementById('academicYearSelect');
        const programSelect = document.getElementById('programSelect');
        const yearLevelSelect = document.getElementById('yearLevelSelect');

        if (academicYearSelect) {
            academicYearSelect.addEventListener('change', function() {
                selectedAcademicYear = this.value;
                updateDeansListContent();
            });
        }

        if (programSelect) {
            programSelect.addEventListener('change', function() {
                selectedProgram = this.value;
                updateDeansListContent();
            });
        }

        if (yearLevelSelect) {
            yearLevelSelect.addEventListener('change', function() {
                selectedYearLevel = this.value;
                updateDeansListContent();
            });
        }
    }

    async function loadDeansListFromDB() {
        const baseURL = getBaseURL();
        const url = baseURL + 'updates/api/deans_list';

        try {
            const res = await fetch(url, { method: 'GET' });
            const json = await res.json();
            if (!json || !json.success) {
                throw new Error(json?.message || 'Failed to load Dean\'s List');
            }

            cachedDeansListRows = Array.isArray(json.data) ? json.data : [];
        } catch (e) {
            console.error('Failed to load deans list', e);
            cachedDeansListRows = [];
        }
    }

    function parseAchievements(raw) {
        const text = String(raw || '').trim();
        if (!text) return [];
        return text.split(',').map(x => x.trim()).filter(Boolean);
    }

    function getHonorsClass(honors) {
        const v = String(honors || '').toLowerCase();
        if (v.indexOf('summa') !== -1) return 'summa';
        if (v.indexOf('magna') !== -1) return 'magna';
        return 'cum-laude';
    }

    function updateDeansListContent() {
        const deansListContent = document.getElementById('deanslist-content');
        if (!deansListContent) return;

        const baseURL = getBaseURL();
        const rows = cachedDeansListRows.filter(r => {
            if (selectedAcademicYear !== 'all' && r.academic_year !== selectedAcademicYear) return false;
            if (selectedProgram !== 'all' && r.program !== selectedProgram) return false;
            if (selectedYearLevel !== 'all' && r.year_level !== selectedYearLevel) return false;
            return true;
        });

        const subtitle = (selectedAcademicYear && selectedAcademicYear !== 'all')
            ? `Academic Year ${selectedAcademicYear}`
            : 'All Academic Years';

        deansListContent.innerHTML = `
            <div class="deanslist-header">
                <h4>Dean's List Achievers</h4>
                <p class="text-muted">${subtitle}</p>
            </div>
        `;

        if (!rows.length) {
            deansListContent.innerHTML += `
                <div class="empty-state">
                    <i class="fas fa-award fa-3x mb-3"></i>
                    <h5>No Dean's List Entries</h5>
                    <p>No Dean's List data found for this selection.</p>
                </div>
            `;
            return;
        }

        const groupedByProgram = {};
        rows.forEach(r => {
            const key = r.program || 'Unspecified Program';
            if (!groupedByProgram[key]) groupedByProgram[key] = [];
            groupedByProgram[key].push(r);
        });

        const sectionsHtml = Object.keys(groupedByProgram).sort().map(program => {
            const achievers = groupedByProgram[program];

            const achieversHtml = achievers.map(r => {
                const honorsClass = getHonorsClass(r.honors);
                const imageUrl = r.image ? (baseURL + r.image) : (baseURL + 'assets/images/ccis.png');
                const achievements = parseAchievements(r.achievements);

                return `
                    <div class="achiever-card ${honorsClass}">
                        <div class="achiever-header">
                            <div class="achiever-image">
                                <img src="${imageUrl}" alt="${r.full_name || 'Achiever'}" onerror="this.onerror=null;this.src='${baseURL + 'assets/images/ccis.png'}';">
                            </div>
                            <div class="achiever-info">
                                <h6 class="achiever-name">${r.full_name || 'Unnamed Achiever'}</h6>
                                <span class="achiever-year">${toYearLevelDisplay(r.year_level || '-')}</span>
                                <div class="achiever-gwa">GWA: ${r.gwa || '-'}</div>
                            </div>
                        </div>
                        <div class="achiever-honors">
                            <span class="honors-badge ${honorsClass}">${r.honors || '-'}</span>
                        </div>
                        ${achievements.length ? `
                            <div class="achiever-achievements">
                                <h6><i class="fas fa-trophy me-2"></i>Notable Achievements:</h6>
                                <ul>${achievements.map(item => `<li>${item}</li>`).join('')}</ul>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');

            return `
                <div class="program-section">
                    <div class="program-header">
                        <h5>
                            <i class="fas fa-graduation-cap me-2"></i>${toProgramDisplay(program)}
                            <span class="badge bg-primary">${achievers.length} Achiever${achievers.length > 1 ? 's' : ''}</span>
                        </h5>
                    </div>
                    <div class="achievers-grid">${achieversHtml}</div>
                </div>
            `;
        }).join('');

        deansListContent.innerHTML += sectionsHtml + `
            <div class="congratulations-message">
                <i class="fas fa-trophy"></i>
                <h5>Congratulations to All Dean's List Achievers!</h5>
                <p>Your hard work, dedication, and academic excellence inspire the entire CCIS community. Continue to strive for excellence and make us proud!</p>
            </div>
        `;
    }

    async function initializeDeansListContent() {
        console.log('🏆 Initializing Dean\'s List content...');

        await loadDeansListFromDB();

        const years = getUniqueAcademicYears(cachedDeansListRows);
        const programs = getUniquePrograms(cachedDeansListRows);
        const yearLevels = getUniqueYearLevels(cachedDeansListRows);

        const academicYearHost = document.querySelector('.academic-year-filter');
        const hasDedicatedFiltersHost = !!document.querySelector('.deanslist-filters');
        if (academicYearHost) {
            academicYearHost.style.display = hasDedicatedFiltersHost ? 'none' : 'block';
        }
        renderDeansFilters(years, programs, yearLevels);

        selectedAcademicYear = years[0] || 'all';
        selectedProgram = 'all';
        selectedYearLevel = 'all';

        const academicYearSelect = document.getElementById('academicYearSelect');
        if (academicYearSelect && selectedAcademicYear !== 'all') {
            academicYearSelect.value = selectedAcademicYear;
        }
        const programSelect = document.getElementById('programSelect');
        if (programSelect) {
            programSelect.value = selectedProgram;
        }
        const yearLevelSelect = document.getElementById('yearLevelSelect');
        if (yearLevelSelect) {
            yearLevelSelect.value = selectedYearLevel;
        }

        updateDeansListContent();
        console.log('✅ Dean\'s List content initialized');
    }
    // Initialize dropdown hover functionality
    function initializeDropdownHover() {
        console.log('ðŸ”„ Initializing dropdown hover functionality...');
        
        // Desktop hover functionality
        if (window.innerWidth >= 992) {
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    this.classList.add('show');
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.add('show');
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    this.classList.remove('show');
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                });
            });
        }
        
        console.log('âœ… Dropdown hover functionality initialized');
    }

    // Handle navigation from dropdown menu - FIXED VERSION
    function setupDropdownNavigation() {
        console.log('ðŸ”— Setting up dropdown navigation...');
        
        document.querySelectorAll('.section-link').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-section');
                console.log('ðŸ”— Navigation clicked:', targetId);
                
                if (this.classList.contains('blocked-nav-item')) {
                    console.log('ðŸš« Item is blocked, skipping navigation');
                    return;
                }
                
                console.log('ðŸŽ¯ Showing section:', targetId);
                showSection(targetId);
                
                if (window.innerWidth < 992) {
                    const dropdownMenu = this.closest('.dropdown-menu');
                    const dropdown = this.closest('.dropdown');
                    if (dropdownMenu) dropdownMenu.classList.remove('show');
                    if (dropdown) dropdown.classList.remove('show');
                }
            });
        });
        
        console.log('âœ… Dropdown navigation setup completed');
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const validSections = ['announcements-section', 'events-achievements-section', 'deanslist-section'];
        
        let mappedHash = hashMapping[hash] || hash;
        
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    });

    // Handle hash changes (e.g. clicking nav links like /updates#deanslist-section while already on /updates)
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const validSections = ['announcements-section', 'events-achievements-section', 'deanslist-section'];

        const mappedHash = hashMapping[hash] || hash;
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    // Handle hash on load - IMPROVED VERSION
    function handleHashOnLoad() {
        // Only run this on the Updates page - check if updates content sections exist
        const updatesPageSections = document.querySelectorAll('.updates-section .content-section');
        if (updatesPageSections.length === 0) {
            // Not on the updates page, don't modify the URL
            console.log('ðŸš« Not on updates page, skipping hash navigation');
            return;
        }
        
        let hash = window.location.hash.substring(1);
        const validSections = ['announcements-section', 'events-achievements-section', 'deanslist-section'];
        
        console.log('ðŸ”— Initial hash:', hash);
        
        // Map hash to actual section IDs
        if (hashMapping[hash]) {
            hash = hashMapping[hash];
            console.log('ðŸ”— Mapped hash to:', hash);
        }
        
        // Determine which section to show
        let targetSection;
        if (hash && validSections.includes(hash)) {
            targetSection = hash;
        } else if (hash) {
            // If there's a hash but it's not valid, show announcements
            targetSection = 'announcements-section';
            console.log('ðŸ”— Invalid hash, defaulting to:', targetSection);
        } else {
            // No hash at all - just show announcements without modifying URL
            targetSection = 'announcements-section';
            console.log('ðŸ”— No hash, showing default section');
            // Don't add hash to URL when coming from other pages
            setTimeout(() => {
                showSection(targetSection);
            }, 100);
            return;
        }
        
        console.log('ðŸŽ¯ Final target section:', targetSection);
        
        // Show the target section with a small delay to ensure DOM is ready
        setTimeout(() => {
            showSection(targetSection);
        }, 100);
    }
    // Create and manage floating return to dashboard button
    function initializeFloatingReturnButton() {
        const sharedBtn = document.getElementById('floating-return-btn');
        if (sharedBtn) return sharedBtn;

        const legacyBtn = document.getElementById('floatingReturnBtn');
        if (legacyBtn) legacyBtn.remove();

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('ccis_user') || 'null');
        } catch (e) {
            user = null;
        }

        if (!user || !['superadmin', 'faculty', 'orgadmin'].includes(user.role)) {
            return null;
        }

        const base = (window.BASE_URL || (window.location.origin + '/'));
        const routeMap = {
            superadmin: 'index.php/admin/dashboard',
            faculty: 'index.php/admin/dashboard',
            orgadmin: 'index.php/org/dashboard'
        };

        const floatingBtn = document.createElement('a');
        floatingBtn.className = 'floating-return-btn';
        floatingBtn.href = base + routeMap[user.role];
        floatingBtn.id = 'floating-return-btn';
        floatingBtn.innerHTML = '<i class="fas fa-tachometer-alt me-1"></i>Return to Dashboard';
        document.body.appendChild(floatingBtn);

        setTimeout(() => {
            floatingBtn.classList.add('show');
            floatingBtn.style.display = 'flex';
        }, 300);

        return floatingBtn;
    }

    // Function to update floating button based on session changes
    function updateFloatingButtonVisibility() {
        const floatingBtn = document.getElementById('floating-return-btn');
        if (!floatingBtn) return;

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('ccis_user') || 'null');
        } catch (e) {
            user = null;
        }

        if (user && ['superadmin', 'faculty', 'orgadmin'].includes(user.role)) {
            setTimeout(() => {
                floatingBtn.classList.add('show');
                floatingBtn.style.display = 'flex';
            }, 300);
        } else {
            floatingBtn.classList.remove('show');
            floatingBtn.style.display = 'none';
        }
    }
    // Back to Top functionality
    function initBackToTop() {
        console.log('â¬†ï¸ Initializing back to top button...');
        
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
        
        console.log('âœ… Back to top button initialized');
    }

    // Create back to top button if not exists
    function createBackToTopButton() {
        if (!document.getElementById('backToTop')) {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'backToTop';
            backToTopBtn.className = 'back-to-top-btn';
            backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(backToTopBtn);
        }
    }

    // Add animation to elements on scroll
    function animateOnScroll() {
        const contentCards = document.querySelectorAll('.content-card');
        contentCards.forEach(card => {
            const elementTop = card.getBoundingClientRect().top;
            const windowBottom = window.scrollY + window.innerHeight;
            
            if (elementTop < windowBottom - 100) {
                card.classList.add('fade-in');
            }
        });
    }

    // Image error handling
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                const altText = this.getAttribute('alt') || 'Image';
                const parent = this.parentNode;
                if (!parent.querySelector('.image-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.textContent = altText;
                    parent.appendChild(placeholder);
                }
                this.style.display = 'none';
            });
        });
    }

    // Mobile menu enhancement
    function enhanceMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarMain = document.querySelector('.navbar-main');
        
        if (navbarToggler && navbarMain) {
            navbarToggler.addEventListener('click', function() {
                navbarMain.classList.toggle('mobile-open');
            });
        }
    }

    // Setup blocked navigation notifications
    function setupBlockedNavigationNotifications() {
        console.log('ðŸš« Setting up blocked navigation notifications...');
        
        // Block specific dropdown items from Academics
        const blockedItems = [
            '.dropdown-item[href="academics.html#curriculum-section"]',
            '.dropdown-item[href="academics.html#schedule-section"]',
            '.dropdown-item[href="academics.html#calendar-section"]',
            '.nav-link[href="forms.html"]',
            '.nav-link[href="organization.html"]',
            '.dropdown-item[href^="organization.html"]'
        ];
        
        blockedItems.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('blocked-nav-item');
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const href = this.getAttribute('href');
                    let message = '';
                    
                    // Determine specific message based on what was clicked
                    if (href.includes('curriculum-section')) {
                        message = 'You need to login as a student to view Curriculum.';
                    } else if (href.includes('schedule-section')) {
                        message = 'You need to login as a student to view Class Schedules.';
                    } else if (href.includes('calendar-section')) {
                        message = 'You need to login as a student to view the Academic Calendar.';
                    } else if (href.includes('forms.html')) {
                        message = 'You need to login as a student to access Forms.';
                    } else if (href.includes('organization.html')) {
                        message = 'You need to login as a student to view Organizations.';
                    } else {
                        const itemText = this.textContent.trim() || 'This section';
                        message = `You need to login as a student to view ${itemText}.`;
                    }
                    
                    showNotification(message, 'warning');
                });
            });
        });
        
        console.log('âœ… Navigation blocking setup completed');
    }

    // Initialize everything - COMPLETE VERSION
    function initializeAll() {
        console.log('ðŸš€ Initializing Updates Page Complete System...');
        
        // Create back to top button
        createBackToTopButton();
        
        // Create floating return to dashboard button
        initializeFloatingReturnButton();
        
        // Set up navigation
        handleHashOnLoad();
        setupDropdownNavigation();
        initBackToTop();
        
        // Initialize components
        initializeDropdownHover();
        handleImageErrors();
        enhanceMobileMenu();
        
        // Setup notification system for blocked navigation
        setupBlockedNavigationNotifications();
        
        // Initialize view buttons styling
        updateViewButtonsStyling();
        
        // Force re-apply role filter
        if (typeof window.filterContentByRole === 'function') {
            window.filterContentByRole(); 
            console.log('âœ… Role-based blocking re-applied.');
        }
        
        // Double-check that only the correct section is visible
        setTimeout(() => {
            const currentHash = window.location.hash.substring(1);
            const targetSection = hashMapping[currentHash] || currentHash;
            const validSections = ['announcements-section', 'events-achievements-section', 'deanslist-section'];
            
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
        
        console.log('âœ… Updates Page Fully Initialized');
        console.log('ðŸ“¢ All features loaded: Section switching, Read More buttons, PDF buttons, Dropdown hover, Floating button');
    }

    // Scroll event listener
    window.addEventListener('scroll', function() {
        animateOnScroll();
        if (typeof initBackToTop === 'function') {
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            }
        }
    });

    // Make functions globally available for session management
    window.updateUIOnLogin = function() {
        updateFloatingButtonVisibility();
        // ... other UI updates ...
    };

    window.updateUIOnLogout = function() {
        updateFloatingButtonVisibility();
        // ... other UI updates ...
    };

    // Make functions globally available
    window.showSection = showSection;
    window.loadSectionContent = loadSectionContent;
    window.showNotification = showNotification;

    // Start the application
    initializeAll();

    console.log('ðŸŽ‰ Updates Page JavaScript Loaded Successfully!');
});
