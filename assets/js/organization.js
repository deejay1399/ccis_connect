// ORGANIZATION PAGE JAVASCRIPT - Complete functionality with Floating Button

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Initializing Organization Page...');
    
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
        'the-legion': 'the-legion',
        'cs-guild': 'cs-guild'
    };
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
    // Show specific section - FIXED VERSION
    function showSection(sectionId) {
        console.log('🎬 Showing section:', sectionId);
        
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
            console.log('🕒 Loading content for:', sectionId);
            setTimeout(() => {
                loadSectionContent(sectionId);
            }, 150);
        } else {
            console.warn('❌ Section not found:', sectionId);
            showSection('the-legion');
        }
    }

    // Load section-specific content - IMPROVED VERSION
    function loadSectionContent(sectionId) {
        console.log('📦 Loading content for section:', sectionId);
        
        switch(sectionId) {
            case 'the-legion':
                initializeLegionContent();
                break;
                
            case 'cs-guild':
                initializeCSGuildContent();
                break;
                
            default:
                console.warn('❌ Unknown section:', sectionId);
        }
    }

    // Initialize Legion Content
    function initializeLegionContent() {
        console.log('👥 Initializing Legion content...');
        
        // Initialize view buttons for sorting
        initializeViewButtons();
        
        // Initialize image gallery functionality
        initializeImageGallery();
        
        // Load Legion data
        loadLegionContent();
        
        console.log('✅ Legion content initialized');
    }

    // Initialize CS Guild Content
    function initializeCSGuildContent() {
        console.log('👥 Initializing CS Guild content...');
        
        // Initialize view buttons for sorting
        initializeViewButtons();
        
        // Initialize image gallery functionality
        initializeImageGallery();
        
        // Load CS Guild data
        loadCSGuildContent();
        
        console.log('✅ CS Guild content initialized');
    }

    // Initialize view buttons for sorting
    function initializeViewButtons() {
        console.log('🔍 Initializing view buttons...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.viewButtons');
        
        // Add event delegation for view buttons
        $(document).on('click.viewButtons', '.view-btn', function(e) {
            e.preventDefault();
            console.log('🔍 View button clicked!');
            
            const $btn = $(this);
            const type = $btn.data('type');
            const org = $btn.data('org');
            const sort = $btn.data('sort');
            
            // Update active state
            $btn.siblings().removeClass('active');
            $btn.addClass('active');
            
            // Show notification
            showNotification(`Sorting ${org} ${type} by ${sort === 'latest' ? 'latest first' : 'oldest first'}`, 'info');
            
            // Add your sorting logic here
            console.log(`Sorting ${org} ${type} by ${sort}`);
            
            // Update the view buttons to have light gray to purple styling
            updateViewButtonsStyling();
            
            // Apply sorting
            sortContent(org, type, sort);
        });
        
        console.log('✅ View buttons initialized');
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
        console.log('🖼️ Initializing image gallery...');
        
        // Remove existing listeners to prevent duplicates
        $(document).off('click.imageGallery');
        
        // Add event delegation for image gallery
        $(document).on('click.imageGallery', '.legion-image-item, .csguild-image-item', function(e) {
            e.preventDefault();
            console.log('🖼️ Image clicked!');
            
            const $clickedImage = $(this);
            const galleryContainer = $clickedImage.closest('.legion-image-gallery, .csguild-image-gallery');
            const happeningId = galleryContainer.data('happening-id');
            const org = galleryContainer.data('org');
            
            // Get all images in this gallery
            const images = [];
            galleryContainer.find('.legion-image-item, .csguild-image-item').each(function(index) {
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
            currentGalleryId = happeningId || org || 'default';
            
            // Show modal with the clicked image
            showImageInModal(images[imageIndex].src, images[imageIndex].caption);
        });
        
        // Initialize modal navigation buttons
        initializeModalNavigation();
        
        console.log('✅ Image gallery initialized');
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

    // Initialize dropdown hover functionality
    function initializeDropdownHover() {
        console.log('🔄 Initializing dropdown hover functionality...');
        
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
        
        console.log('✅ Dropdown hover functionality initialized');
    }

    // Handle navigation from dropdown menu - FIXED VERSION
    function setupDropdownNavigation() {
        console.log('🔗 Setting up dropdown navigation...');
        
        document.querySelectorAll('.section-link').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-section');
                console.log('🔗 Navigation clicked:', targetId);
                
                if (this.classList.contains('blocked-nav-item')) {
                    console.log('🚫 Item is blocked, skipping navigation');
                    return;
                }
                
                console.log('🎯 Showing section:', targetId);
                showSection(targetId);
                
                if (window.innerWidth < 992) {
                    const dropdownMenu = this.closest('.dropdown-menu');
                    const dropdown = this.closest('.dropdown');
                    if (dropdownMenu) dropdownMenu.classList.remove('show');
                    if (dropdown) dropdown.classList.remove('show');
                }
            });
        });
        
        console.log('✅ Dropdown navigation setup completed');
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const validSections = ['the-legion', 'cs-guild'];
        
        let mappedHash = hashMapping[hash] || hash;
        
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    });

    // Handle hash changes (e.g. clicking nav links like /organization#cs-guild while already on /organization)
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const validSections = ['the-legion', 'cs-guild'];

        const mappedHash = hashMapping[hash] || hash;
        if (mappedHash && validSections.includes(mappedHash)) {
            showSection(mappedHash);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    // Handle hash on load - IMPROVED VERSION
    function handleHashOnLoad() {
        let hash = window.location.hash.substring(1);
        const validSections = ['the-legion', 'cs-guild'];
        
        console.log('🔗 Initial hash:', hash);
        
        // Map hash to actual section IDs
        if (hashMapping[hash]) {
            hash = hashMapping[hash];
            console.log('🔗 Mapped hash to:', hash);
        }
        
        // Determine which section to show
        let targetSection;
        if (hash && validSections.includes(hash)) {
            targetSection = hash;
        } else {
            // Default to the-legion section
            targetSection = 'the-legion';
            console.log('🔗 No valid hash, defaulting to:', targetSection);
        }
        
        console.log('🎯 Final target section:', targetSection);
        
        // Show the target section with a small delay to ensure DOM is ready
        setTimeout(() => {
            showSection(targetSection);
        }, 100);
    }

    // Back to Top functionality
    function initBackToTop() {
        console.log('⬆️ Initializing back to top button...');
        
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
        
        console.log('✅ Back to top button initialized');
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
        console.log('🚫 Setting up blocked navigation notifications...');
        
        // Block specific dropdown items from Academics
        const blockedItems = [
            '.dropdown-item[href="academics.html#curriculum-section"]',
            '.dropdown-item[href="academics.html#schedule-section"]',
            '.dropdown-item[href="academics.html#calendar-section"]',
            '.nav-link[href="forms.html"]',
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
                    } else {
                        const itemText = this.textContent.trim() || 'This section';
                        message = `You need to login as a student to view ${itemText}.`;
                    }
                    
                    showNotification(message, 'warning');
                });
            });
        });
        
        console.log('✅ Navigation blocking setup completed');
    }

    // SORTING FUNCTIONALITY
    function sortContent(org, type, sortOrder) {
        console.log(`🔄 Sorting ${org} ${type} in ${sortOrder} order`);
        
        let items = [];
        
        // Get the appropriate data based on org and type
        if (org === 'legion') {
            if (type === 'announcements') {
                items = getLegionAnnouncements();
            } else if (type === 'happenings') {
                items = getLegionHappenings();
            }
        } else if (org === 'csguild') {
            if (type === 'announcements') {
                items = getCSGuildAnnouncements();
            } else if (type === 'happenings') {
                items = getCSGuildHappenings();
            }
        }
        
        // Sort the items
        const sortedItems = sortByDate(items, sortOrder);
        
        // Re-display the sorted items
        if (org === 'legion') {
            if (type === 'announcements') {
                displayLegionAnnouncements(sortedItems);
            } else if (type === 'happenings') {
                displayLegionHappenings(sortedItems);
            }
        } else if (org === 'csguild') {
            if (type === 'announcements') {
                displayCSGuildAnnouncements(sortedItems);
            } else if (type === 'happenings') {
                displayCSGuildHappenings(sortedItems);
            }
        }
    }

    // Load Legion data
    function loadLegionContent() {
        console.log('👥 Loading Legion content...');
        
        // Load officers
        const officers = getLegionOfficers();
        displayLegionOfficers(officers);
        
        // Load announcements (sorted by latest first)
        const announcements = sortByDate(getLegionAnnouncements(), 'desc');
        displayLegionAnnouncements(announcements);
        
        // Load happenings (sorted by latest first)
        const happenings = sortByDate(getLegionHappenings(), 'desc');
        displayLegionHappenings(happenings);
    }

    // Display Legion Officers
    function displayLegionOfficers(officers) {
        const container = $('#legion-officers-grid');
        if (!container.length) return;
        
        container.empty();
        
        if (!officers || officers.length === 0) {
            container.html(`
                <div class="col-12 text-center py-4">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Officers Available</h5>
                    <p class="text-muted">Officer information will be updated soon</p>
                </div>
            `);
            return;
        }
        
        const studentOfficers = officers.filter(officer => officer.type === 'student');
        
        studentOfficers.forEach(officer => {
            const imageUrl = officer.image || `https://via.placeholder.com/200x200/5b21b6/ffffff?text=${encodeURIComponent(officer.position.split(' ')[0])}`;
            
            container.append(`
                <div class="officer-card">
                    <div class="officer-image">
                        <img src="${imageUrl}" alt="${officer.name}" 
                              onerror="this.src='https://via.placeholder.com/200x200/5b21b6/ffffff?text=OFFICER'">
                    </div>
                    <div class="officer-info">
                        <h5>${officer.name}</h5>
                        <p class="officer-position">${officer.position}</p>
                    </div>
                </div>
            `);
        });
    }

    // Display Legion Announcements
    function displayLegionAnnouncements(announcements) {
        const container = $('#legion-announcements-container');
        if (!container.length) return;
        
        container.empty();
        
        if (!announcements || announcements.length === 0) {
            container.html(`
                <div class="legion-empty-state">
                    <i class="fas fa-bullhorn fa-3x mb-3"></i>
                    <h5>No Announcements Yet</h5>
                    <p>Check back later for updates from The Legion</p>
                </div>
            `);
            $('#legion-announcements-count').text('0 announcements');
            return;
        }
        
        announcements.forEach(announcement => {
            const dateDisplay = formatDateWithTime(announcement.date, announcement.time);
            
            container.append(`
                <div class="legion-announcement-card">
                    <div class="legion-announcement-header">
                        <h3 class="legion-announcement-title">${announcement.title}</h3>
                        <div class="legion-announcement-meta">
                            <span><i class="fas fa-calendar me-1"></i>${dateDisplay}</span>
                            <span><i class="fas fa-map-marker-alt me-1"></i>${announcement.venue || 'TBA'}</span>
                        </div>
                    </div>
                    <div class="legion-announcement-body">
                        <p class="legion-announcement-description">${announcement.description}</p>
                    </div>
                </div>
            `);
        });
        
        $('#legion-announcements-count').text(`${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`);
    }

    function displayLegionHappenings(happenings) {
        const container = $('#legion-happenings-container');
        if (!container.length) return;
        
        container.empty();
        
        if (!happenings || happenings.length === 0) {
            container.html(`
                <div class="legion-empty-state">
                    <i class="fas fa-camera fa-3x mb-3"></i>
                    <h5>No Happenings Yet</h5>
                    <p>No recent activities documented</p>
                </div>
            `);
            $('#legion-happenings-count').text('0 happenings');
            return;
        }
        
        happenings.forEach(happening => {
            // Image gallery with same structure as updates page
            const imagesHTML = happening.images && happening.images.length > 0 ? `
                <div class="legion-happening-images mt-3">
                    <h6><i class="fas fa-images me-1"></i>Event Photos (${happening.images.length})</h6>
                    <div class="legion-image-gallery" data-happening-id="${happening.id}" data-org="legion">
                        ${happening.images.slice(0, 4).map((img, index) => `
                            <div class="legion-image-item" data-image-index="${index}">
                                <img src="${img}" alt="Event photo ${index + 1}" 
                                      onerror="this.src='https://via.placeholder.com/150x150/5b21b6/ffffff?text=PHOTO'">
                                ${index === 3 && happening.images.length > 4 ? `
                                    <div class="legion-image-count-badge">+${happening.images.length - 4}</div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : '';
            
            container.append(`
                <div class="legion-happening-card">
                    <div class="legion-happening-header">
                        <h3 class="legion-happening-title">${happening.title}</h3>
                        <div class="legion-happening-meta">
                            <span><i class="fas fa-calendar me-1"></i>${formatDate(happening.date)}</span>
                        </div>
                    </div>
                    <div class="legion-happening-body">
                        <p class="legion-happening-description">${happening.description}</p>
                        ${imagesHTML}
                    </div>
                </div>
            `);
        });
        
        $('#legion-happenings-count').text(`${happenings.length} happening${happenings.length !== 1 ? 's' : ''}`);
    }

    // Load CS Guild data
    function loadCSGuildContent() {
        console.log('👥 Loading CS Guild content...');
        
        // Load officers
        const officers = getCSGuildOfficers();
        displayCSGuildOfficers(officers);
        
        // Load announcements (sorted by latest first)
        const announcements = sortByDate(getCSGuildAnnouncements(), 'desc');
        displayCSGuildAnnouncements(announcements);
        
        // Load happenings (sorted by latest first)
        const happenings = sortByDate(getCSGuildHappenings(), 'desc');
        displayCSGuildHappenings(happenings);
    }

    // Display CS Guild Officers
    function displayCSGuildOfficers(officers) {
        const container = $('#csguild-officers-grid');
        if (!container.length) return;
        
        container.empty();
        
        if (!officers || officers.length === 0) {
            container.html(`
                <div class="col-12 text-center py-4">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Officers Available</h5>
                    <p class="text-muted">Officer information will be updated soon</p>
                </div>
            `);
            return;
        }
        
        const studentOfficers = officers.filter(officer => officer.type === 'student');
        
        studentOfficers.forEach(officer => {
            const imageUrl = officer.image || `https://via.placeholder.com/200x200/5b21b6/ffffff?text=${encodeURIComponent(officer.position.split(' ')[0])}`;
            
            container.append(`
                <div class="officer-card">
                    <div class="officer-image">
                        <img src="${imageUrl}" alt="${officer.name}" 
                              onerror="this.src='https://via.placeholder.com/200x200/5b21b6/ffffff?text=OFFICER'">
                    </div>
                    <div class="officer-info">
                        <h5>${officer.name}</h5>
                        <p class="officer-position">${officer.position}</p>
                    </div>
                </div>
            `);
        });
    }

    // Display CS Guild Announcements
    function displayCSGuildAnnouncements(announcements) {
        const container = $('#csguild-announcements-container');
        if (!container.length) return;
        
        container.empty();
        
        if (!announcements || announcements.length === 0) {
            container.html(`
                <div class="csguild-empty-state">
                    <i class="fas fa-bullhorn fa-3x mb-3"></i>
                    <h5>No Announcements Yet</h5>
                    <p>Check back later for updates from CS Guild</p>
                </div>
            `);
            $('#csguild-announcements-count').text('0 announcements');
            return;
        }
        
        announcements.forEach(announcement => {
            const dateDisplay = formatDateWithTime(announcement.date, announcement.time);
            
            container.append(`
                <div class="csguild-announcement-card">
                    <div class="csguild-announcement-header">
                        <h3 class="csguild-announcement-title">${announcement.title}</h3>
                        <div class="csguild-announcement-meta">
                            <span><i class="fas fa-calendar me-1"></i>${dateDisplay}</span>
                            <span><i class="fas fa-map-marker-alt me-1"></i>${announcement.venue || 'TBA'}</span>
                        </div>
                    </div>
                    <div class="csguild-announcement-body">
                        <p class="csguild-announcement-description">${announcement.description}</p>
                    </div>
                </div>
            `);
        });
        
        $('#csguild-announcements-count').text(`${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`);
    }

    function displayCSGuildHappenings(happenings) {
        const container = $('#csguild-happenings-container');
        if (!container.length) return;
        
        container.empty();
        
        if (!happenings || happenings.length === 0) {
            container.html(`
                <div class="csguild-empty-state">
                    <i class="fas fa-camera fa-3x mb-3"></i>
                    <h5>No Happenings Yet</h5>
                    <p>No recent activities documented</p>
                </div>
            `);
            $('#csguild-happenings-count').text('0 happenings');
            return;
        }
        
        happenings.forEach(happening => {
            // Image gallery with same structure as updates page
            const imagesHTML = happening.images && happening.images.length > 0 ? `
                <div class="csguild-happening-images mt-3">
                    <h6><i class="fas fa-images me-1"></i>Event Photos (${happening.images.length})</h6>
                    <div class="csguild-image-gallery" data-happening-id="${happening.id}" data-org="csguild">
                        ${happening.images.slice(0, 4).map((img, index) => `
                            <div class="csguild-image-item" data-image-index="${index}">
                                <img src="${img}" alt="Event photo ${index + 1}" 
                                      onerror="this.src='https://via.placeholder.com/150x150/5b21b6/ffffff?text=PHOTO'">
                                ${index === 3 && happening.images.length > 4 ? `
                                    <div class="csguild-image-count-badge">+${happening.images.length - 4}</div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : '';
            
            container.append(`
                <div class="csguild-happening-card">
                    <div class="csguild-happening-header">
                        <h3 class="csguild-happening-title">${happening.title}</h3>
                        <div class="csguild-happening-meta">
                            <span><i class="fas fa-calendar me-1"></i>${formatDate(happening.date)}</span>
                        </div>
                    </div>
                    <div class="csguild-happening-body">
                        <p class="csguild-happening-description">${happening.description}</p>
                        ${imagesHTML}
                    </div>
                </div>
            `);
        });
        
        $('#csguild-happenings-count').text(`${happenings.length} happening${happenings.length !== 1 ? 's' : ''}`);
    }

    // Initialize everything - COMPLETE VERSION
    function initializeAll() {
        console.log('🚀 Initializing Organization Page Complete System...');
        
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
        
        // Double-check that only the correct section is visible
        setTimeout(() => {
            const currentHash = window.location.hash.substring(1);
            const targetSection = hashMapping[currentHash] || currentHash;
            const validSections = ['the-legion', 'cs-guild'];
            
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
        
        console.log('✅ Organization Page Fully Initialized');
        console.log('👥 All features loaded: Section switching, Image galleries, Sorting, Dropdown hover, Floating button');
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

    console.log('🎉 Organization Page JavaScript Loaded Successfully!');
});

// DATA GETTER FUNCTIONS
function getLegionOfficers() {
    return window.organizationData?.legionOfficers || [];
}

function getLegionAnnouncements() {
    return window.organizationData?.legionAnnouncements || [];
}

function getLegionHappenings() {
    return window.organizationData?.legionHappenings || [];
}

function getCSGuildOfficers() {
    return window.organizationData?.csguildOfficers || [];
}

function getCSGuildAnnouncements() {
    return window.organizationData?.csguildAnnouncements || [];
}

function getCSGuildHappenings() {
    return window.organizationData?.csguildHappenings || [];
}

// UTILITY FUNCTIONS
function sortByDate(items, order = 'desc') {
    if (!items || items.length === 0) return [];
    
    return items.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (order === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });
}

// Format date with optional time
function formatDateWithTime(dateString, timeString = null) {
    if (!dateString) return 'Date not specified';
    
    try {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (timeString) {
            return `${formattedDate} at ${timeString}`;
        }
        
        return formattedDate;
    } catch (error) {
        return dateString + (timeString ? ` at ${timeString}` : '');
    }
}

// Format date only
function formatDate(dateString) {
    if (!dateString) return 'Date not specified';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}
