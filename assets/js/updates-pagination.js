// UPDATES PAGINATION SYSTEM - DB-BACKED (ANNOUNCEMENTS + EVENTS)
$(document).ready(function() {
    const ITEMS_PER_PAGE = 10;

    function getBaseURL() {
        const b = window.baseUrl || window.BASE_URL;
        if (b) return b.endsWith('/') ? b : (b + '/');
        // Fallback (repo is under /ccis_connect/ in this environment)
        return window.location.origin + '/ccis_connect/';
    }

    const baseURL = getBaseURL();

    const API = {
        announcements: baseURL + 'updates/api/announcements',
        events: baseURL + 'updates/api/events_achievements'
    };
    
    // State management for each content type
    const paginationState = {
        'announcements': { currentPage: 1, sort: 'latest' },
        'events': { currentPage: 1, sort: 'latest' }
    };

    // Cache for loaded content
    const contentCache = {
        'announcements': null,
        'events': null
    };

    function notify(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type || 'info');
        } else {
            console.log('[notify]', type || 'info', message);
        }
    }

    function extractImageList(row) {
        const paths = [];
        if (row && row.images_json) {
            try {
                const parsed = JSON.parse(row.images_json);
                if (Array.isArray(parsed)) {
                    parsed.forEach((p) => {
                        if (typeof p === 'string' && p.trim() !== '') {
                            paths.push(p);
                        }
                    });
                }
            } catch (e) {
                // ignore malformed JSON
            }
        }
        if (row && row.image && paths.indexOf(row.image) === -1) {
            paths.unshift(row.image);
        }
        return paths;
    }

    function mapAnnouncementRow(row) {
        const images = extractImageList(row).map((imgPath) => ({
            url: baseURL + imgPath,
            alt: row.title || 'Announcement'
        }));

        return {
            id: row.announcement_id,
            date: row.announcement_date,
            title: row.title || '',
            description: row.content || '',
            details: '',
            venue: row.announcement_venue || '',
            time: row.announcement_time || '',
            type: 'general',
            hasPdf: !!row.pdf_file,
            pdfUrl: row.pdf_file ? (baseURL + row.pdf_file) : '',
            pdfTitle: row.pdf_file ? row.pdf_file.split('/').pop() : '',
            images
        };
    }

    function mapEventRow(row) {
        const images = extractImageList(row).map((imgPath) => ({
            url: baseURL + imgPath,
            alt: row.title || 'Event'
        }));

        const type = (row.type === 'Achievement') ? 'achievement' : 'event';

        return {
            id: row.id,
            date: row.event_date,
            title: row.title || '',
            description: row.description || '',
            type,
            // optional fields used by existing UI
            team: row.event_team || '',
            event: row.event_location || '',
            time: row.event_time || '',
            location: row.event_location || '',
            images
        };
    }

    function fetchAnnouncements() {
        return $.ajax({
            url: API.announcements,
            method: 'GET',
            dataType: 'json'
        });
    }

    function fetchEvents() {
        return $.ajax({
            url: API.events,
            method: 'GET',
            dataType: 'json'
        });
    }

    function preloadAllContent() {
        console.log('📦 Loading announcements + events from DB...');

        return $.when(fetchAnnouncements(), fetchEvents())
            .then((annRes, evRes) => {
                // jQuery returns [data, statusText, jqXHR]
                const announcementsPayload = annRes?.[0];
                const eventsPayload = evRes?.[0];

                const announcementsRows = (announcementsPayload && announcementsPayload.success) ? (announcementsPayload.data || []) : [];
                const eventsRows = (eventsPayload && eventsPayload.success) ? (eventsPayload.data || []) : [];

                const announcements = announcementsRows.map(mapAnnouncementRow);
                const events = eventsRows.map(mapEventRow);

                contentCache.announcements = {
                    data: announcements,
                    sorted: sortContent(announcements, 'latest')
                };

                contentCache.events = {
                    data: events,
                    sorted: sortContent(events, 'latest')
                };

                console.log('✅ DB content loaded', { announcements: announcements.length, events: events.length });
            })
            .catch((xhr) => {
                notify('Failed to load updates from database. Please try again later.', 'error');
                console.error('Failed to preload updates content', xhr);
                // Ensure cache is still usable
                contentCache.announcements = { data: [], sorted: [] };
                contentCache.events = { data: [], sorted: [] };
            });
    }

    // Initialize pagination system
    function initializePaginationSystem() {
        console.log('🚀 Initializing Updates Pagination System...');

        preloadAllContent().then(() => {
            setupViewButtons();
            initializePaginationContent();
            console.log('✅ Updates Pagination System Initialized');
        });
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
            const venueText = announcement.venue || '';
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
            
            const metaParts = [
                `<span><i class="fas fa-calendar me-1"></i>${formatDate(announcement.date)}</span>`
            ];
            if (timeText) {
                metaParts.push(`<span><i class="fas fa-clock me-1"></i>${timeText}</span>`);
            }
            if (venueText) {
                metaParts.push(`<span><i class="fas fa-map-marker-alt me-1"></i>${venueText}</span>`);
            }

            const announcementHTML = `
                <div class="announcement-card ${typeClass}" data-announcement-id="${announcement.id}">
                    <div class="announcement-header">
                        <h3 class="announcement-title">${announcement.title}</h3>
                        <div class="announcement-meta">
                            ${metaParts.join('')}
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
                            ${event.team ? `<p class="achievement-details"><strong>Team:</strong> ${event.team}</p>` : ''}
                            ${event.event ? `<p class="achievement-details"><strong>Event:</strong> ${event.event}</p>` : ''}
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
                            ${event.time ? `<p class="event-details"><i class="fas fa-clock me-2"></i>${event.time}</p>` : ''}
                            ${event.location ? `<p class="event-details"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>` : ''}
                            
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
