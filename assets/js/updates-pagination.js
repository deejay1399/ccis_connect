// UPDATES PAGINATION SYSTEM - COMPLETE VERSION WITH WORKING FUNCTIONALITY
$(document).ready(function() {
    // Pagination configuration - 10 ITEMS PER PAGE
    const ITEMS_PER_PAGE = 10;
    
    // State management for each content type
    const paginationState = {
        'announcements': { currentPage: 1, sort: 'latest' },
        'events': { currentPage: 1, sort: 'latest' }
    };

    // Cache for pre-loaded content
    const contentCache = {
        'announcements': null,
        'events': null
    };

    // Initialize pagination system
    function initializePaginationSystem() {
        console.log('🚀 Initializing Updates Pagination System...');
        
        // Pre-load all content
        preloadAllContent();
        
        // Set up event listeners
        setupViewButtons();
        
        // Initialize pagination content
        initializePaginationContent();
        
        console.log('✅ Updates Pagination System Initialized');
    }

    // Pre-load all content to cache
    function preloadAllContent() {
        console.log('📦 Pre-loading all content...');
        
        // Pre-load announcements data
        contentCache.announcements = {
            data: getAnnouncementsData(),
            sorted: sortContent(getAnnouncementsData(), 'latest')
        };
        
        // Pre-load events data
        contentCache.events = {
            data: getEventsData(),
            sorted: sortContent(getEventsData(), 'latest')
        };
        
        console.log('✅ All content pre-loaded to cache');
    }

    // Initialize pagination content
    function initializePaginationContent() {
        console.log('🚀 Initializing pagination content...');
        
        // Load initial content for all sections from cache
        loadAnnouncements(1, 'latest');
        loadEvents(1, 'latest');
        
        console.log('✅ Pagination content initialized');
    }

    // Set up view buttons for sorting
    function setupViewButtons() {
        $('.view-btn').off('click').on('click', function() {
            const $this = $(this);
            const type = $this.data('type');
            const sort = $this.data('sort');
            
            // Update active state
            $this.siblings().removeClass('active');
            $this.addClass('active');
            
            // Update pagination state
            paginationState[type].sort = sort;
            paginationState[type].currentPage = 1;
            
            // Re-sort and reload content with new sort (using cached data)
            contentCache[type].sorted = sortContent(contentCache[type].data, sort);
            loadContent(type);
        });
    }

    // Load section content - INSTANT DISPLAY
    function loadSectionContent(sectionId) {
        console.log('📦 Loading section:', sectionId);
        
        switch(sectionId) {
            case 'announcements-section':
                const announcementsState = paginationState['announcements'];
                displayAnnouncements(getPageItems('announcements', announcementsState.currentPage, announcementsState.sort));
                updateAnnouncementsPaginationUI();
                break;
            case 'events-achievements-section':
                const eventsState = paginationState['events'];
                displayEvents(getPageItems('events', eventsState.currentPage, eventsState.sort));
                updateEventsPaginationUI();
                break;
            case 'deanslist-section':
                console.log('🎓 Dean\'s List section - pagination system skipping');
                break;
        }
    }

    // Get paginated items from cache
    function getPageItems(type, page = 1, sort = 'latest') {
        const sortedContent = contentCache[type].sorted;
        const totalPages = Math.ceil(sortedContent.length / ITEMS_PER_PAGE);
        
        const validPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        return sortedContent.slice(startIndex, endIndex);
    }

    // ========================================
    // ANNOUNCEMENTS PAGINATION - WITH IMAGES AND FUNCTIONAL BUTTONS
    // ========================================

    function loadAnnouncements(page = 1, sort = 'latest') {
        const pageAnnouncements = getPageItems('announcements', page, sort);
        displayAnnouncements(pageAnnouncements);
        updateAnnouncementsPaginationUI();
        
        paginationState['announcements'].currentPage = page;
    }

    function displayAnnouncements(announcements) {
        const container = $('#announcements-container');
        container.empty();
        
        if (announcements.length === 0) {
            container.append(`
                <div class="empty-state">
                    <i class="fas fa-bullhorn"></i>
                    <h5>No Announcements Yet</h5>
                    <p>Check back later for updates</p>
                </div>
            `);
            return;
        }
        
        announcements.forEach((announcement) => {
            const venueText = announcement.venue || 'No venue specified';
            const timeText = announcement.time || '';
            const typeClass = announcement.type || 'general';
            
            // PDF section for exam schedules
            const pdfSection = announcement.hasPdf ? `
                <div class="announcement-pdf mt-3">
                    <div class="button-group-tapad">
                        <button class="btn btn-view-pdf me-2" data-pdf-url="${announcement.pdfUrl}">
                            <i class="fas fa-eye me-1"></i>View PDF
                        </button>
                        <button class="btn btn-download-pdf" data-pdf-url="${announcement.pdfUrl}" data-pdf-title="${announcement.pdfTitle}">
                            <i class="fas fa-download me-1"></i>Download
                        </button>
                    </div>
                    <small class="text-muted d-block mt-1">${announcement.pdfTitle}</small>
                </div>
            ` : '';
            
            // Images gallery
            const imagesGallery = announcement.images && announcement.images.length > 0 ? `
                <div class="announcement-images-gallery">
                    <div class="images-gallery" data-announcement-id="${announcement.id}">
                        ${announcement.images.map((image, index) => `
                            <div class="gallery-image" data-image-index="${index}">
                                <img src="${image.url}" alt="${image.alt || announcement.title}" 
                                     onerror="this.src='https://via.placeholder.com/150/4b0082/ffffff?text=Image+${index + 1}'">
                                ${index === 3 && announcement.images.length > 4 ? `
                                    <div class="image-count-badge">+${announcement.images.length - 4}</div>
                                ` : ''}
                            </div>
                        `).slice(0, 4).join('')}
                    </div>
                    ${announcement.imageCaption ? `<div class="image-caption">${announcement.imageCaption}</div>` : ''}
                </div>
            ` : '';
            
            // Read More functionality for announcements
            const description = announcement.description;
            const details = announcement.details || '';
            const fullContent = description + (details ? '\n\n' + details : '');
            const isLongContent = fullContent.length > 300;
            const shortContent = isLongContent ? fullContent.substring(0, 300) + '...' : fullContent;
            
            const readMoreSection = isLongContent ? `
                <div class="read-more-section mt-2">
                    <button class="btn btn-read-more" data-full-text="${fullContent.replace(/"/g, '&quot;')}">
                        <i class="fas fa-chevron-down me-1"></i>Read More
                    </button>
                </div>
            ` : '';
            
            const announcementHTML = `
                <div class="announcement-card ${typeClass}" data-announcement-id="${announcement.id}">
                    <div class="announcement-header">
                        <h3 class="announcement-title">${announcement.title}</h3>
                        <div class="announcement-meta">
                            <span><i class="fas fa-calendar me-1"></i>${formatDate(announcement.date)}</span>
                            ${timeText ? `<span><i class="fas fa-clock me-1"></i>${timeText}</span>` : ''}
                            <span><i class="fas fa-map-marker-alt me-1"></i>${venueText}</span>
                        </div>
                    </div>
                    
                    ${imagesGallery}
                    
                    <div class="announcement-body">
                        <div class="announcement-content-container">
                            <div class="announcement-content">${shortContent.replace(/\n/g, '<br>')}</div>
                            ${readMoreSection}
                        </div>
                        ${pdfSection}
                    </div>
                </div>
            `;
            
            container.append(announcementHTML);
        });
        
        console.log('✅ Announcements displayed with images and functional buttons');
    }

    function updateAnnouncementsPaginationUI() {
        const sortedAnnouncements = contentCache.announcements.sorted;
        const totalItems = sortedAnnouncements.length;
        const currentPage = paginationState['announcements'].currentPage;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        updatePagination($('#announcements-pagination'), totalItems, currentPage, totalPages, 'announcements');
        updateItemsCount('announcements-count', totalItems, currentPage, ITEMS_PER_PAGE);
    }

    // ========================================
    // EVENTS & ACHIEVEMENTS PAGINATION - WITH IMAGES AND FUNCTIONAL BUTTONS
    // ========================================

    function loadEvents(page = 1, sort = 'latest') {
        const pageEvents = getPageItems('events', page, sort);
        displayEvents(pageEvents);
        updateEventsPaginationUI();
        
        paginationState['events'].currentPage = page;
    }

    function displayEvents(events) {
        const container = $('#events-container');
        container.empty();
        
        if (events.length === 0) {
            container.append(`
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h5>No Events & Achievements</h5>
                    <p>Check back later for upcoming events and achievements</p>
                </div>
            `);
            return;
        }
        
        events.forEach((event) => {
            if (event.type === 'achievement') {
                // Achievement images gallery
                const achievementImagesGallery = event.images && event.images.length > 0 ? `
                    <div class="achievement-images-gallery">
                        <div class="achievement-gallery" data-event-id="${event.id}">
                            ${event.images.map((image, index) => `
                                <div class="achievement-gallery-image" data-image-index="${index}">
                                    <img src="${image.url}" alt="${image.alt || event.title}" 
                                         onerror="this.src='https://via.placeholder.com/150/4b0082/ffffff?text=Image+${index + 1}'">
                                    ${index === 3 && event.images.length > 4 ? `
                                        <div class="image-count-badge">+${event.images.length - 4}</div>
                                    ` : ''}
                                </div>
                            `).slice(0, 4).join('')}
                        </div>
                    </div>
                ` : '';
                
                const description = event.description;
                const isLongDescription = description.length > 300;
                const shortDescription = isLongDescription ? description.substring(0, 300) + '...' : description;
                
                const readMoreSection = isLongDescription ? `
                    <div class="read-more-section mt-2">
                        <button class="btn btn-read-more" data-full-text="${description.replace(/"/g, '&quot;')}">
                            <i class="fas fa-chevron-down me-1"></i>Read More
                        </button>
                    </div>
                ` : '';
                
                container.append(`
                    <div class="achievement-item" data-event-id="${event.id}">
                        <div class="achievement-content">
                            <h4 class="achievement-title">${event.title}</h4>
                            <p class="achievement-details"><strong>Team:</strong> ${event.team}</p>
                            <p class="achievement-details"><strong>Event:</strong> ${event.event}</p>
                            <p class="achievement-details"><strong>Date:</strong> ${formatDate(event.date)}</p>
                            
                            ${achievementImagesGallery}
                            
                            <div class="achievement-description-container">
                                <div class="achievement-description">${shortDescription}</div>
                                ${readMoreSection}
                            </div>
                        </div>
                    </div>
                `);
                
            } else {
                // Event images gallery
                const eventImagesGallery = event.images && event.images.length > 0 ? `
                    <div class="event-images-gallery">
                        <div class="event-gallery" data-event-id="${event.id}">
                            ${event.images.map((image, index) => `
                                <div class="event-gallery-image" data-image-index="${index}">
                                    <img src="${image.url}" alt="${image.alt || event.title}" 
                                         onerror="this.src='https://via.placeholder.com/150/6a0dad/ffffff?text=Image+${index + 1}'">
                                    ${index === 3 && event.images.length > 4 ? `
                                        <div class="image-count-badge">+${event.images.length - 4}</div>
                                    ` : ''}
                                </div>
                            `).slice(0, 4).join('')}
                        </div>
                    </div>
                ` : '';
                
                const description = event.description;
                const isLongDescription = description.length > 300;
                const shortDescription = isLongDescription ? description.substring(0, 300) + '...' : description;
                
                const readMoreSection = isLongDescription ? `
                    <div class="read-more-section mt-2">
                        <button class="btn btn-read-more" data-full-text="${description.replace(/"/g, '&quot;')}">
                            <i class="fas fa-chevron-down me-1"></i>Read More
                        </button>
                    </div>
                ` : '';
                
                container.append(`
                    <div class="event-card" data-event-id="${event.id}">
                        <div class="event-content">
                            <h4 class="event-title">${event.title}</h4>
                            <p class="event-details"><i class="fas fa-clock me-2"></i>${event.time}</p>
                            <p class="event-details"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>
                            
                            ${eventImagesGallery}
                            
                            <div class="event-description-container">
                                <div class="event-description">${shortDescription}</div>
                                ${readMoreSection}
                            </div>
                        </div>
                    </div>
                `);
            }
        });
        
        console.log('✅ Events & Achievements displayed with images and functional buttons');
    }

    function updateEventsPaginationUI() {
        const sortedEvents = contentCache.events.sorted;
        const totalItems = sortedEvents.length;
        const currentPage = paginationState['events'].currentPage;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        updatePagination($('#events-pagination'), totalItems, currentPage, totalPages, 'events');
        updateItemsCount('events-count', totalItems, currentPage, ITEMS_PER_PAGE);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function sortContent(content, sortOrder) {
        const sorted = [...content].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });
        return sorted;
    }

    function updateItemsCount(elementId, totalItems, currentPage, itemsPerPage) {
        const startItem = ((currentPage - 1) * itemsPerPage) + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        let countText = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        if (totalItems > 0) {
            countText = `Showing ${startItem}-${endItem} of ${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        }
        
        $(`#${elementId}`).text(countText);
    }

    function updatePagination(container, totalItems, currentPage, totalPages, type) {
        container.empty();
        
        if (totalPages <= 1) return;
        
        container.append(`
            <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <span class="page-info">Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `);
        
        container.find('.prev-btn').off('click').on('click', function() {
            if (currentPage > 1) {
                loadContent(type, currentPage - 1);
            }
        });
        
        container.find('.next-btn').off('click').on('click', function() {
            if (currentPage < totalPages) {
                loadContent(type, currentPage + 1);
            }
        });
    }

    function loadContent(type, page = 1) {
        const sort = paginationState[type].sort;
        switch(type) {
            case 'announcements':
                loadAnnouncements(page, sort);
                break;
            case 'events':
                loadEvents(page, sort);
                break;
        }
    }

    // ========================================
    // DATA FUNCTIONS
    // ========================================

    function getAnnouncementsData() {
        return [
            {
                id: 1,
                date: "2025-10-25",
                title: "Long Weekend Advisory - Holiday Schedule",
                description: "In observance of the upcoming holidays, Bohol Island State University will implement the following holiday schedule and arrangements from October 31 to November 4, 2025.",
                venue: "Bohol Island State University",
                time: "",
                details: "October 31 - All Saints' Day Eve (Special Non-Working Holiday)\nNovember 1 - All Saints' Day (Special Non-Working Holiday)\nNovember 2 - All Souls' Day (Special Non-Working Holiday)\nNovember 3 - Asynchronous Classes\nNovember 4 - Carlos P. Garcia Day (Bohol Special Non-Working Holiday)\n\nRegular classes will resume on November 5, 2025.\n\nBISUans are all encouraged to maximize the time to rest, reflect, and spend quality moments with their families and loved ones.",
                type: "important",
                hasPdf: false,
                images: [
                    {
                        url: "weekend.jpg",
                        alt: "Long Weekend Advisory",
                        caption: "Holiday schedule from October 31 to November 4, 2025"
                    }
                ]
            },
            {
                id: 2,
                date: "2025-10-05",
                title: "Midterm Examination Schedule - First Semester 2024-2025",
                description: "Official schedule for midterm examinations for all programs. Please check the detailed schedule for your specific program and year level.",
                venue: "Various Classrooms",
                time: "8:00 AM - 5:00 PM",
                details: "Examinations will be conducted from October 05-10, 2025 according to the published schedule. Students must bring their examination permits and valid IDs.",
                type: "urgent",
                hasPdf: true,
                pdfUrl: "Midterm exam.pdf",
                pdfTitle: "Midterm Examination Schedule First Semester 2024-2025",
                images: [] 
            }
        ];
    }

    function getEventsData() {
        return [
            {
                id: 1,
                date: "2025-09-18",
                title: "Top 25 Regional Finalists - Philippine Startup Challenge",
                team: "Team ANDAM (Alalay App)",
                event: "Philippine Startup Challenge",
                description: `✨𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔, 𝑻𝒆𝒂𝒎 𝑨𝑵𝑫𝑨𝑴! ✨\n\nWe're proud to announce that Team ANDAM (Alalay App) has secured a spot among the 𝐓𝐨𝐩 𝟐𝟓 𝐑𝐞𝐠𝐢𝐨𝐧𝐚𝐥 𝐅𝐢𝐧𝐚𝐥𝐢𝐬𝐭𝐬 out of 158 entries in the prestigious 𝐏𝐡𝐢𝐥𝐢𝐩𝐩𝐢𝐧𝐞 𝐒𝐭𝐚𝐫𝐭𝐮𝐩 𝐂𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝐗! 🎉\n\nThe team is composed of:\nMentor: Mrs. Angelica T. Sit\nMembers:\n• James Paul Dacaldacal – BSCS 3A\n• Aga Abarquez – BSCS 3A\n• Floss Carmelli Daquio – BSCS 3A\n\nWe also extend our heartfelt congratulations to Team InnoTap and Team Error 404, who also submitted their entries to the Philippine Startup Challenge X!\n\nTeam InnoTap - TAPS (Track, Assure and Protect System)\nMentor: Dr. Julie O. Bitasolo\nMembers:\n• Karl Jacquin M. Ag-ag – BSCS 2\n• John Reno D. Villapaña – BSCS 2\n• Laira Angela R. Bustillos - BSCS 2\n\nTeam Error 404 - KleanApp\nMentor: Dr. Julie O. Bitasolo\nMembers:\n• McNeal Louise Sinajon – BSIT 3A\n• Ferdinand Roy Lopez – BSIT 3D\n• Christian Pagapong - BSIT 3D\n\nThe CCIS Family is truly proud of you all!💙\n\n✍️ Laira Angela R. Bustillos \n💻 John Reno D. Villapaña`,
                type: "achievement",
                images: [
                    {
                        url: "99.jpg",
                        alt: "Team ANDAM - Top 25 Regional Finalists",
                        caption: "Team ANDAM celebrating their achievement as Top 25 Regional Finalists"
                    },
                    {
                        url: "98.jpg",
                        alt: "Alalay App Presentation",
                        caption: "Team ANDAM presenting their Alalay App in the competition"
                    }
                ]
            },
            {
                id: 2,
                date: "2025-03-15",
                title: "Campus Paugnat and Pasundayag 2025 - Overall 2nd Place Winner",
                team: "CCIS Phantoms",
                event: "Campus Paugnat and Pasundayag 2025",
                description: `🎉 𝗔𝗳𝘁𝗲𝗿 𝘁𝗵𝗿𝗲𝗲 𝗱𝗮𝘆𝘀 𝗼𝗳 𝘁𝗵𝗿𝗶𝗹𝗹, 𝗲𝘅𝗰𝗶𝘁𝗲𝗺𝗲𝗻𝘁, 𝗮𝗻𝗱 𝗳𝘂𝗻-𝗳𝗶𝗹𝗹𝗲𝗱 𝗰𝗼𝗺𝗽𝗲𝘁𝗶𝘁𝗶𝗼𝗻𝘀, 𝗖𝗮𝗺𝗽𝘂𝘀 𝗣𝗮𝘂𝗴𝗻𝗮𝘁 𝗮𝗻𝗱 𝗣𝗮𝘀𝘂𝗻𝗱𝗮𝘆𝗮𝗴 𝟮𝟬𝟮𝟱 𝗵𝗮𝘀 𝗼𝗳𝗳𝗶𝗰𝗶𝗮𝗹𝗹𝘆 𝗰𝗼𝗺𝗲 𝘁𝗼 𝗮 𝗰𝗹𝗼𝘀𝗲!\n\nWe are proud to share that our very own CCIS Phantoms soared high and emerged as the 𝗢𝘃𝗲𝗿𝗮𝗹𝗹 𝟮𝗻𝗱 𝗣𝗹𝗮𝗰𝗲 𝗪𝗶𝗻𝗻𝗲𝗿!🏆🩷\n\nCongratulations to all CCIS participants for showcasing passion, teamwork, and excellence throughout the event, you made our department shine! ✨👏\n\n✍️ Laira Angela R. Bustillos \n💻 John Reno D. Villapaña`,
                type: "achievement",
                images: [
                    {
                        url: "20.jpg",
                        alt: "CCIS Phantoms - Overall 2nd Place Winner",
                        caption: "CCIS Phantoms celebrating their Overall 2nd Place achievement"
                    }
                ]
            }
        ];
    }

    // Format date function
    window.formatDate = function(dateString) {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return 'Invalid date';
        }
    }

    // Make data functions globally available for image modal
    window.getAnnouncementsData = getAnnouncementsData;
    window.getEventsData = getEventsData;

    // ========================================
    // INITIALIZATION
    // ========================================

    function initializeUpdatesPagination() {
        console.log('🚀 Initializing Updates Pagination System...');
        
        preloadAllContent();
        setupViewButtons();
        
        setTimeout(() => {
            initializePaginationContent();
            console.log('✅ Updates Pagination System Fully Initialized');
            
            const currentHash = window.location.hash.substring(1);
            if (currentHash === 'events-achievements' || currentHash === 'events-achievements-section') {
                console.log('🎯 Immediate load for Events & Achievements');
                loadSectionContent('events-achievements-section');
            }
        }, 200);
    }

    // Override the showSection function
    const originalShowSection = window.showSection;
    window.showSection = function(sectionId) {
        if (originalShowSection) {
            originalShowSection(sectionId);
        }
        loadSectionContent(sectionId);
    };

    // Make functions globally available
    window.loadSectionContent = loadSectionContent;

    // Initialize
    setTimeout(() => {
        initializeUpdatesPagination();
    }, 100);
});