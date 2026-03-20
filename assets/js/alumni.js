// GET SECTION FROM URL HASH - DEFINED OUTSIDE READY
function getCurrentSection() {
    // Get hash from URL
    let hash = window.location.hash;
    
    // Remove the # if it exists
    if (hash.startsWith('#')) {
        hash = hash.substring(1);
    }
    
    // If hash exists and is valid, use it
    if (hash && sectionTemplates[hash]) {
        return hash;
    }
    
    // Otherwise use default
    return 'featured-section';
}

const baseUrl = window.BASE_URL || '/';
const alumniApiBase = baseUrl + 'alumni/api/';
let currentSection = null;
const alumniPublicData = {
    featured: [],
    directory: [],
    events: [],
    loaded: {
        featured: false,
        directory: false,
        events: false
    }
};

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatTextBlock(value) {
    return escapeHtml(String(value ?? '')).replace(/\r?\n/g, '<br>');
}

function normalizeAlumniImages(alumni) {
    const images = [];
    const addImage = (value) => {
        const path = String(value ?? '').trim();
        if (path) {
            images.push(path);
        }
    };

    if (Array.isArray(alumni?.images)) {
        alumni.images.forEach(addImage);
    }

    if (!images.length && alumni?.images_json) {
        try {
            const decoded = JSON.parse(alumni.images_json);
            if (Array.isArray(decoded)) {
                decoded.forEach(addImage);
            }
        } catch (error) {
            console.warn('Failed to parse alumni images_json', error);
        }
    }

    if (!images.length && alumni?.photo) {
        addImage(alumni.photo);
    }

    return [...new Set(images)];
}

function getFeaturedMedia(alumni) {
    const photo = String(alumni?.photo ?? '').trim();
    const video = String(alumni?.video ?? '').trim();
    const mediaType = String(alumni?.media_type ?? '').trim().toLowerCase();

    if (mediaType === 'video' || video) {
        return { type: 'video', path: video };
    }

    if (mediaType === 'photo' || photo) {
        return { type: 'photo', path: photo };
    }

    return { type: 'none', path: '' };
}

function renderDirectoryPhotoThumb(alumni) {
    const images = normalizeAlumniImages(alumni);
    const photoCount = images.length;
    const safeName = escapeHtml(alumni?.name || 'Alumni');

    if (!images.length) {
        return `<div class="directory-photo-stack">
            <div class="directory-photo-thumb directory-photo-placeholder"><i class="fas fa-user"></i></div>
        </div>`;
    }

    return `<div class="directory-photo-stack">
        <img src="${baseUrl + images[0]}" alt="${safeName}" class="directory-photo-thumb">
        ${photoCount > 1 ? `<span class="directory-photo-count">+${photoCount - 1}</span>` : ''}
    </div>`;
}


// ALUMNI PAGE JAVASCRIPT - WITH HASH-BASED NAVIGATION
$(document).ready(function() {
    
    // LOAD THE SECTION on initial page load
    currentSection = getCurrentSection();
    loadAlumniSection(currentSection);
    prefetchPublicAlumniData();
    
    // Setup hash change listener for dropdown clicks
    window.addEventListener('hashchange', function() {
        const newSection = getCurrentSection();
        loadAlumniSection(newSection);
    });
    
    // Setup click handlers for navigation links to ensure sections load
    $(document).on('click', '.alumni-content-area a[href*="#"], .dropdown-menu a[href*="alumni"]', function(e) {
        const href = $(this).attr('href');
        if (href && href.includes('#')) {
            const hash = href.substring(href.indexOf('#'));
            
            // If already on alumni page, directly load section instead of waiting for hash change
            if (window.location.pathname.includes('alumni')) {
                const sectionId = hash.substring(1); // Remove the #
                if (sectionTemplates[sectionId]) {
                    loadAlumniSection(sectionId);
                    e.preventDefault();
                    // Update hash for history
                    window.location.hash = hash;
                }
            }
        }
    });
    
    // Setup modal events
    setupModalEvents();
    
    // Setup button effects (ripple and pressed effects)
    setupButtonEffects();
    
    // Initialize chatbot responses
    setTimeout(setupAlumniChatbotResponses, 1000);
    
});

function prefetchPublicAlumniData() {
    const refreshIfActive = (sectionId) => {
        if (currentSection === sectionId) {
            loadAlumniSection(sectionId);
        }
    };

    $.getJSON(alumniApiBase + 'featured', function(response) {
        if (response.success) {
            alumniPublicData.featured = response.data || [];
            alumniPublicData.loaded.featured = true;
            refreshIfActive('featured-section');
        }
    });

    $.getJSON(alumniApiBase + 'directory', function(response) {
        if (response.success) {
            alumniPublicData.directory = response.data || [];
            alumniPublicData.loaded.directory = true;
            refreshIfActive('directory-section');
        }
    });

    $.getJSON(alumniApiBase + 'events', function(response) {
        if (response.success) {
            alumniPublicData.events = response.data || [];
            alumniPublicData.loaded.events = true;
            refreshIfActive('events-section');
        }
    });
}

function showModalById(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl || !window.bootstrap || !bootstrap.Modal) {
        return;
    }
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function hideModalById(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl || !window.bootstrap || !bootstrap.Modal) {
        return;
    }
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
}

function cleanupModalArtifacts() {
    // If no modal is open, clear any stale backdrop/body lock left by interrupted transitions.
    if (document.querySelectorAll('.modal.show').length === 0) {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        $('.modal-backdrop').remove();
    }
}
// ===== SECTION TEMPLATES =====
const sectionTemplates = {
    // Featured Alumni Template
    'featured-section': function() {
        if (!alumniPublicData.loaded.featured) {
            return `
                <section class="featured-alumni-section">
                    <div class="container">
                        <h2 class="section-title">Featured Alumni</h2>
                        <p class="section-subtitle">Loading featured alumni...</p>
                    </div>
                </section>
            `;
        }

        const featured = alumniPublicData.featured || [];
        let cards = '';

        if (featured.length === 0) {
            cards = `<p class="text-muted text-center">No featured alumni yet.</p>`;
        } else {
            featured.forEach(alumni => {
                const featuredMedia = getFeaturedMedia(alumni);
                let photoHtml = `<div class="alumni-photo-placeholder"><i class="fas fa-user"></i></div>`;
                let badgeHtml = `
                    <div class="featured-badge">
                        <i class="fas fa-star"></i> Featured
                    </div>
                `;

                if (featuredMedia.type === 'photo' && featuredMedia.path) {
                    photoHtml = `<img src="${baseUrl + featuredMedia.path}" alt="${alumni.name}">`;
                } else if (featuredMedia.type === 'video' && featuredMedia.path) {
                    photoHtml = `
                        <video class="featured-alumni-video" src="${baseUrl + featuredMedia.path}" autoplay muted loop playsinline preload="metadata"></video>
                        <div class="featured-video-indicator">
                            <i class="fas fa-play-circle"></i>
                            <span>Play story</span>
                        </div>
                    `;
                    badgeHtml = `
                        <div class="featured-badge featured-badge-video">
                            <i class="fas fa-video"></i> Video Feature
                        </div>
                    `;
                }

                cards += `
                    <div class="featured-alumni-card" data-alumni-id="${alumni.id}" data-alumni-name="${alumni.name}">
                        <div class="alumni-image">
                            ${photoHtml}
                            ${badgeHtml}
                        </div>
                        <div class="alumni-info">
                            <h3>${alumni.name}</h3>
                            ${alumni.batch ? `<p class="alumni-batch">${alumni.batch}</p>` : ''}
                            <p class="alumni-position">${alumni.position}</p>
                            <p class="alumni-achievement">${alumni.bio}</p>
                            <div class="alumni-actions">
                                <button class="alumni-view-details" data-alumni-id="${alumni.id}">
                                    <i class="fas fa-eye me-1"></i> View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        return `
            <section class="featured-alumni-section">
                <div class="container">
                    <h2 class="section-title">Featured Alumni</h2>
                    <p class="section-subtitle">Our outstanding graduates making waves in the tech industry</p>
                    
                    <div class="featured-alumni-container">
                        ${cards}
                    </div>
                </div>
            </section>
        `;
    },
    
    // Directory Template
    'directory-section': function() {
        if (!alumniPublicData.loaded.directory) {
            return `
                <section class="directory-section">
                    <div class="container">
                        <h2 class="section-title">Alumni Directory</h2>
                        <p class="section-subtitle">Loading alumni directory...</p>
                    </div>
                </section>
            `;
        }

        const alumniData = alumniPublicData.directory || [];
        let directoryRows = '';
        const batchSet = new Set();

        if (alumniData.length === 0) {
            directoryRows = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No alumni directory entries yet.</td>
                </tr>
            `;
        } else {
            alumniData.forEach(alumni => {
                const program = alumni.program || '';
                const company = alumni.company || '';
                const position = alumni.position || '';
                const phone = alumni.phone || '';
                const email = alumni.email || '';
                const batch = alumni.batch || '';
                const imageCount = normalizeAlumniImages(alumni).length;
                const searchable = `${alumni.name || ''} ${email} ${phone} ${company} ${position}`.toLowerCase();
                const photoHtml = renderDirectoryPhotoThumb(alumni);

                if (batch) batchSet.add(batch);
                directoryRows += `
                    <tr class="directory-row" data-id="${alumni.id}" data-program="${escapeHtml(program)}" data-batch="${escapeHtml(batch)}" data-search="${escapeHtml(searchable)}">
                        <td class="directory-name-cell">
                            <div class="directory-name-wrap">
                                ${photoHtml}
                                <div class="directory-name-meta">
                                    <span class="directory-name-text">${escapeHtml(alumni.name || '-')}</span>
                                    ${imageCount > 1 ? `<span class="directory-photo-meta">${imageCount} photos</span>` : ''}
                                </div>
                            </div>
                        </td>
                        <td>${escapeHtml(batch || '-')}</td>
                        <td>${escapeHtml(email || '-')}</td>
                        <td>${escapeHtml(phone || '-')}</td>
                        <td class="directory-actions-cell">
                            <button type="button" class="btn btn-sm btn-outline-primary directory-view-btn" data-id="${alumni.id}">
                                <i class="fas fa-eye me-1"></i>View
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        const batchOptions = Array.from(batchSet)
            .sort((a, b) => String(b).localeCompare(String(a), undefined, { numeric: true }))
            .map(batch => `<option value="${batch}">${batch}</option>`)
            .join('');

        return `
            <section class="directory-section">
                <div class="container">
                    <h2 class="section-title">Alumni Directory</h2>
                    <p class="section-subtitle">Connect with CCIS graduates from different batches and programs</p>
                    
                    <div class="directory-filters">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="search-alumni" placeholder="Search by name, email, or phone...">
                        </div>
                        
                        <select id="filter-batch" class="filter-select">
                            <option value="">All Batches</option>
                            ${batchOptions}
                        </select>
                    </div>
                    
                    <div class="alumni-directory-table-wrapper" id="alumni-directory-wrapper">
                        <table id="alumni-directory" class="alumni-directory-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Batch</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${directoryRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="no-results-message" class="no-results" style="display: none;">
                        <i class="fas fa-search"></i>
                        <p>No alumni found matching your criteria.</p>
                        <button id="clear-filters" class="btn btn-sm btn-outline-primary mt-2">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </section>
        `;
    },
    
    // Events Template
    'events-section': function() {
        if (!alumniPublicData.loaded.events) {
            return `
                <section class="events-section">
                    <div class="container">
                        <h2 class="section-title">Alumni Events</h2>
                        <p class="section-subtitle">Loading events...</p>
                    </div>
                </section>
            `;
        }

        const events = alumniPublicData.events || [];
        let eventCards = '';

        if (events.length === 0) {
            eventCards = `<p class="text-muted text-center">No alumni events yet.</p>`;
        } else {
            events.forEach(event => {
                const eventTitle = event.name || event.title || 'Alumni Event';
                const eventLocation = event.location || event.venue || '';
                const eventDescription = event.description || event.details || '';
                const photoHtml = event.photo
                    ? `<img src="${baseUrl + event.photo}" alt="${eventTitle}">`
                    : '';
                const dateObj = event.event_date ? new Date(event.event_date) : null;
                const month = dateObj ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '';
                const day = dateObj ? String(dateObj.getDate()).padStart(2, '0') : '';
                const year = dateObj ? dateObj.getFullYear() : '';

                eventCards += `
                    <div class="event-card">
                        ${photoHtml ? `<div class=\"event-image\">${photoHtml}</div>` : ''}
                        <div class="event-date">
                            <div class="event-month">${month}</div>
                            <div class="event-day">${day}</div>
                            <div class="event-year">${year}</div>
                        </div>
                        <div class="event-details">
                            <h3>${eventTitle}</h3>
                            ${eventLocation ? `<p class="event-location"><i class="fas fa-map-marker-alt"></i> ${eventLocation}</p>` : ''}
                            ${eventDescription ? `<p class="event-description">${eventDescription}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        return `
            <section class="events-section">
                <div class="container">
                    <h2 class="section-title">Alumni Events</h2>
                    <p class="section-subtitle">Join our upcoming gatherings and networking opportunities</p>
                    
                    <div class="events-container">
                        ${eventCards}
                    </div>
                </div>
            </section>
        `;
    },
    
    // Give Back Template
    'giveback-section': function() {
        return `
            <section class="giveback-section">
                <div class="container">
                    <h2 class="section-title">How to Give Back</h2>
                    <p class="section-subtitle">Support the next generation of CCIS students</p>
                    
                    <div class="giveback-options">
                        <div class="giveback-card">
                            <div class="giveback-icon">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <h3>Become a Mentor</h3>
                            <p>Guide current students in their career paths. Share your experience and help them navigate the tech industry.</p>
                            <button class="giveback-btn" data-giveback-type="Mentor">
                                Become a Mentor
                            </button>
                        </div>
                        
                        <div class="giveback-card">
                            <div class="giveback-icon">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                            <h3>Volunteer as Speaker</h3>
                            <p>Share your expertise by speaking at seminars, workshops, or classes. Inspire students with your journey.</p>
                            <button class="giveback-btn" data-giveback-type="Speaker">
                                Volunteer as Speaker
                            </button>
                        </div>
                        
                        <div class="giveback-card">
                            <div class="giveback-icon">
                                <i class="fas fa-donate"></i>
                            </div>
                            <h3>Make a Donation</h3>
                            <p>Support student scholarships, laboratory equipment, or research projects. Every contribution makes a difference.</p>
                            <button class="giveback-btn" data-giveback-type="Donation">
                                Make a Donation
                            </button>
                        </div>
                        
                        <div class="giveback-card">
                            <div class="giveback-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <h3>Offer Internships</h3>
                            <p>Provide valuable industry experience to CCIS students through internship opportunities at your company.</p>
                            <button class="giveback-btn" data-giveback-type="Internship">
                                Offer Internships
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    // Update Form Template (temporarily disabled)
    'update-form-section': function() {
        return `
            <section class="update-form-section">
                <div class="container">
                    <h2 class="section-title">Update Information</h2>
                    <p class="section-subtitle">This section is temporarily unavailable.</p>
                    <div class="update-form-container">
                        <p class="text-center mb-0">Please check back later.</p>
                    </div>
                </div>
            </section>
        `;
    }
};

// ===== LOAD SECTION =====
function loadAlumniSection(sectionId) {
    
    // Get template function
    const templateFunction = sectionTemplates[sectionId];
    
    if (!templateFunction) {
        console.error(`? Template not found for: ${sectionId}`);
        return;
    }
    
    // Get content area
    const contentArea = $('.alumni-content-area');
    
    if (contentArea.length === 0) {
        console.error('? Content area element not found!');
        return;
    }
    
    // Add exit animation
    contentArea.addClass('alumni-content-exit');
    
    // Wait for exit animation, then load new content
    setTimeout(() => {
        // Clear and load new content
        contentArea.empty();
        
        // Generate HTML from template
        const sectionHtml = templateFunction();
        
        // Append new content
        contentArea.html(sectionHtml);
        
        // Remove exit class, add enter class
        contentArea.removeClass('alumni-content-exit');
        contentArea.addClass('alumni-content-enter');
        
        // Setup section-specific functionality
        setupSectionFunctionality(sectionId);
        
        // Scroll to top of content area
        setTimeout(() => {
            $('html, body').animate({
                scrollTop: contentArea.offset().top - 100
            }, 500, function() {
            });
        }, 100);
        
    }, 300);
}

// ===== SETUP SECTION FUNCTIONALITY =====
function setupSectionFunctionality(sectionId) {
    
    switch(sectionId) {
        case 'featured-section':
            setupFeaturedAlumni();
            break;
        case 'directory-section':
            setupSearchAndFilter();
            break;
        case 'events-section':
            setupEventCards();
            break;
        // Temporarily disabled:
        // case 'update-form-section':
        //     setupUpdateForm();
        //     break;
        case 'giveback-section':
            setupGiveBackButtons();
            break;
    }
}

// ===== BUTTON EFFECTS =====
function setupButtonEffects() {
    
    // Add pressed class on button click
    $(document).on('mousedown touchstart', '.alumni-view-details, .giveback-btn, .submit-update-btn, .btn-primary, .btn-secondary, .btn-outline-primary, #clear-filters', function() {
        $(this).addClass('button-pressed');
    });
    
    $(document).on('mouseup touchend', '.alumni-view-details, .giveback-btn, .submit-update-btn, .btn-primary, .btn-secondary, .btn-outline-primary, #clear-filters', function() {
        setTimeout(() => {
            $(this).removeClass('button-pressed');
        }, 150);
    });
    
    // Add ripple effect to buttons
    $(document).on('click', '.alumni-view-details, .giveback-btn, .submit-update-btn, .btn-primary:not(.btn-secondary), .btn-outline-primary, #clear-filters', function(e) {
        // Check if ripple effect should be applied
        if ($(this).hasClass('btn-secondary') || $(this).prop('disabled')) {
            return;
        }
        
        const $button = $(this);
        const $ripple = $('<span class="button-ripple"></span>');
        
        // Get click position relative to button
        const offset = $button.offset();
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        
        // Position the ripple
        $ripple.css({
            left: x + 'px',
            top: y + 'px',
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            width: '100px',
            height: '100px',
            marginTop: '-50px',
            marginLeft: '-50px',
            pointerEvents: 'none'
        });
        
        // Add ripple to button
        $button.css('position', 'relative').append($ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            $ripple.remove();
        }, 600);
    });
    
    // Card click effects
    $(document).on('mousedown touchstart', '.featured-alumni-card, .directory-row, .story-card, .event-card, .giveback-card', function() {
        $(this).addClass('card-pressed');
    });
    
    $(document).on('mouseup touchend', '.featured-alumni-card, .directory-row, .story-card, .event-card, .giveback-card', function() {
        setTimeout(() => {
            $(this).removeClass('card-pressed');
        }, 150);
    });
    
}

// ===== FEATURED ALUMNI =====
function setupFeaturedAlumni() {
    
    // Setup alumni card click
    $(document).on('click', '.alumni-view-details', function(e) {
        e.stopPropagation();
        const alumniId = $(this).data('alumni-id');
        showAlumniDetails(alumniId);
    });
    
    $(document).on('click', '.featured-alumni-card', function(e) {
        if (!$(e.target).closest('.alumni-view-details').length) {
            const alumniId = $(this).data('alumni-id');
            showAlumniDetails(alumniId);
        }
    });
    
}

function showAlumniDetails(alumniId) {

    const featuredAlumni = (alumniPublicData.featured || []).find(a => String(a.id) === String(alumniId));
    const directoryAlumni = (alumniPublicData.directory || []).find(a => String(a.id) === String(alumniId));
    const alumni = featuredAlumni || directoryAlumni;

    if (!alumni) {
        $('#alumniModalContent').html('<p class="text-muted">Alumni details not available.</p>');
        showModalById('alumniDetailsModal');
        return;
    }

    const safeName = escapeHtml(alumni.name || 'Alumni');
    const images = normalizeAlumniImages(alumni);
    const featuredMedia = getFeaturedMedia(alumni);
    const title = alumni.position || alumni.company || alumni.program || '';
    const details = [];
    if (alumni.program) details.push(`<p class="mb-1"><strong>Program:</strong> ${escapeHtml(alumni.program)}</p>`);
    if (alumni.batch) details.push(`<p class="mb-1"><strong>Batch:</strong> ${escapeHtml(alumni.batch)}</p>`);
    if (alumni.company) details.push(`<p class="mb-1"><strong>Company:</strong> ${escapeHtml(alumni.company)}</p>`);
    if (alumni.position && alumni.company !== alumni.position) details.push(`<p class="mb-1"><strong>Position:</strong> ${escapeHtml(alumni.position)}</p>`);
    if (alumni.email) details.push(`<p class="mb-1"><strong>Email:</strong> ${escapeHtml(alumni.email)}</p>`);
    if (alumni.phone) details.push(`<p class="mb-1"><strong>Phone:</strong> ${escapeHtml(alumni.phone)}</p>`);
    const description = alumni.bio || alumni.achievement || alumni.position || '';
    const galleryHtml = featuredMedia.type === 'video' && featuredMedia.path
        ? `
            <div class="alumni-modal-image alumni-modal-video-shell">
                <div class="alumni-modal-video-frame">
                    <video class="alumni-modal-video" src="${baseUrl + featuredMedia.path}" controls playsinline preload="metadata"></video>
                </div>
                <div class="alumni-modal-video-caption">
                    <i class="fas fa-video"></i>
                    <span>Featured alumni video</span>
                </div>
            </div>
        `
        : images.length
        ? `
            <div class="alumni-modal-image">
                <div class="alumni-modal-primary-image">
                    <img src="${baseUrl + images[0]}" alt="${safeName}" class="alumni-modal-primary-photo">
                </div>
                ${images.length > 1 ? `
                    <div class="alumni-modal-image-count">${images.length} photos</div>
                    <div class="alumni-modal-gallery">
                        ${images.map((image, index) => `
                            <button
                                type="button"
                                class="alumni-modal-thumb ${index === 0 ? 'is-active' : ''}"
                                data-image-src="${escapeHtml(baseUrl + image)}"
                                data-image-alt="${safeName} photo ${index + 1}"
                                aria-label="View photo ${index + 1} of ${safeName}"
                            >
                                <img src="${baseUrl + image}" alt="${safeName} photo ${index + 1}">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `
        : `
            <div class="alumni-modal-image alumni-modal-image-placeholder">
                <div class="alumni-modal-placeholder-icon">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;

    const modalContent = `
        <div class="alumni-modal-content">
            ${galleryHtml}
            <div class="alumni-modal-details">
                <div class="alumni-modal-header">
                    <h2>${safeName}</h2>
                    ${alumni.batch ? `<p class="alumni-modal-batch">Batch ${escapeHtml(alumni.batch)}</p>` : ''}
                    ${title ? `<p class="alumni-modal-company">${escapeHtml(title)}</p>` : ''}
                </div>
                ${details.length ? `
                    <div class="alumni-modal-section">
                        <h4><i class="fas fa-id-card"></i> Directory Details</h4>
                        ${details.join('')}
                    </div>
                ` : ''}
                ${description ? `
                    <div class="alumni-modal-section">
                        <h4><i class="fas fa-align-left"></i> About</h4>
                        <p>${formatTextBlock(description)}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    $('#alumniModalContent').html(modalContent);
    $('#alumniDetailsModal').data('alumni-name', alumni.name);
    showModalById('alumniDetailsModal');
}

// ===== SEARCH AND FILTER =====
function setupSearchAndFilter() {
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        const searchInput = $('#search-alumni');
        const batchFilter = $('#filter-batch');
        
        if (!searchInput.length) {
            console.warn('?? Search elements not found');
            return;
        }
        
        function filterAlumni() {
            const searchTerm = searchInput.val().toLowerCase();
            const selectedBatch = batchFilter.val();
            
            let visibleCount = 0;
            
            $('.directory-row').each(function() {
                const $row = $(this);
                const searchable = String($row.data('search') || '').toLowerCase();
                const batch = String($row.data('batch') || '');
                
                let matches = true;
                
                if (searchTerm && !searchable.includes(searchTerm)) {
                    matches = false;
                }
                
                if (selectedBatch && batch !== selectedBatch) {
                    matches = false;
                }
                
                $row.toggle(matches);
                if (matches) visibleCount++;
            });
            
            const noResultsMsg = $('#no-results-message');
            if (visibleCount === 0) {
                if (noResultsMsg.length) {
                    noResultsMsg.show();
                }
            } else {
                if (noResultsMsg.length) {
                    noResultsMsg.hide();
                }
            }
        }
        
        // Event listeners for filtering
        searchInput.on('input', filterAlumni);
        batchFilter.on('change', filterAlumni);
        
        // Setup clear filters button
        $(document).off('click.directoryFilters', '#clear-filters');
        $(document).on('click.directoryFilters', '#clear-filters', function() {
            searchInput.val('');
            batchFilter.val('');
            filterAlumni();
            showNotification('Filters cleared', 'info');
        });
        
        // Setup directory row click
        $(document).off('click.directoryRow', '.directory-row');
        $(document).on('click.directoryRow', '.directory-row', function(e) {
            if ($(e.target).closest('.directory-view-btn').length) {
                return;
            }
            const alumniId = $(this).data('id');
            showAlumniDetails(alumniId);
        });

        $(document).off('click.directoryViewBtn', '.directory-view-btn');
        $(document).on('click.directoryViewBtn', '.directory-view-btn', function(e) {
            e.stopPropagation();
            const alumniId = $(this).data('id');
            showAlumniDetails(alumniId);
        });
        
    }, 100);
}

// ===== EVENT CARDS =====
function setupEventCards() {
    
    $(document).on('click', '.event-card', function() {
        const eventTitle = $(this).find('h3').text();
        showNotification(`Event: ${eventTitle} - More details will be announced soon.`, 'info');
    });
    
}

// ===== UPDATE FORM =====
function setupUpdateForm() {

    $(document).on('submit', '#alumni-update-form', function(e) {
        e.preventDefault();

        if (!validateForm('alumni-update-form')) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        const submitBtn = $(this).find('.submit-update-btn');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Processing...');
        submitBtn.prop('disabled', true);

        const formData = new FormData();
        formData.append('name', $('#update-name').val().trim());
        formData.append('email', $('#update-email').val().trim());
        formData.append('batch', $('#update-batch').val());
        formData.append('program', $('#update-program').val());
        formData.append('position', $('#update-current-position').val().trim());
        formData.append('company', $('#update-company').val().trim());
        formData.append('achievements', $('#update-achievements').val().trim());
        formData.append('mentor', $('#update-willing-mentor').is(':checked') ? 1 : 0);
        formData.append('speaker', $('#update-willing-speaker').is(':checked') ? 1 : 0);
        formData.append('internship', $('#update-willing-internship').is(':checked') ? 1 : 0);
        formData.append('donation', $('#update-willing-donate').is(':checked') ? 1 : 0);

        const photoFile = $('#update-photo')[0]?.files?.[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        $.ajax({
            url: alumniApiBase + 'submit_update',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showNotification('Thank you for updating your information! CCIS Alumni Office will verify and update your records.', 'success');
                    $('#alumni-update-form')[0].reset();
                    $('#alumni-update-form').find('.form-control, .form-select').removeClass('is-invalid is-valid');
                } else {
                    showNotification(response.message || 'There was an error submitting your information. Please try again.', 'error');
                }
            },
            error: function(xhr) {
                const msg = xhr.responseJSON?.message || 'There was an error submitting your information. Please try again.';
                showNotification(msg, 'error');
            },
            complete: function() {
                submitBtn.html(originalText);
                submitBtn.prop('disabled', false);
            }
        });
    });

}

// ===== GIVE BACK BUTTONS =====
function setupGiveBackButtons() {
    
    $(document).on('click', '.giveback-btn', function(e) {
        e.stopPropagation();
        const givebackType = $(this).data('giveback-type');
        
        
        if (givebackType === 'Donation') {
            // Show donation information modal
            showModalById('donationModal');
        } else {
            // Show form for other giveback types
            showGivebackForm(givebackType);
        }
    });
    
}

function showGivebackForm(givebackType) {

    const modalEl = document.getElementById('givebackFormModal');
    if (!modalEl) {
        showNotification('Give back form modal is missing on the page.', 'error');
        return;
    }
    
    const formContent = `
        <h5>${givebackType} Interest Form</h5>
        <p>Please provide your details so we can contact you:</p>
        <form id="givebackForm">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-control" id="gbName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Email Address *</label>
                    <input type="email" class="form-control" id="gbEmail" required>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">CCIS Batch (if applicable)</label>
                <input type="text" class="form-control" id="gbBatch" placeholder="e.g., 2018">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Additional Details</label>
                <textarea class="form-control" id="gbDetails" rows="3" placeholder="Tell us more about your interest in ${givebackType.toLowerCase()}..."></textarea>
            </div>
            
            <div class="form-text">
                Your information will be forwarded to the CCIS Alumni Office. They will contact you within 3 working days.
            </div>
        </form>
    `;
    
    $('#givebackFormContent').html(formContent);
    $('#givebackFormModalLabel').text(`Give Back to CCIS - ${givebackType}`);
    
    showModalById('givebackFormModal');
    
}

// ===== MODAL FUNCTIONS =====
function setupModalEvents() {

    // Keep modal state clean to prevent frozen screen after submit/close.
    $('.modal').on('hidden.bs.modal', function() {
        setTimeout(cleanupModalArtifacts, 0);
    });

    $(document).on('click', '.alumni-modal-thumb', function() {
        const nextImage = $(this).data('image-src');
        const nextAlt = $(this).data('image-alt') || 'Alumni photo';
        const primaryImage = $('#alumniModalContent .alumni-modal-primary-photo');

        if (!primaryImage.length || !nextImage) {
            return;
        }

        primaryImage.attr('src', nextImage);
        primaryImage.attr('alt', nextAlt);
        $('.alumni-modal-thumb').removeClass('is-active');
        $(this).addClass('is-active');
    });
    
    // Connection form submission
    $(document).on('submit', '#connectionForm', function(e) {
        e.preventDefault();

        const alumniName = $('#connectionModalLabel').text().replace('Connect with ', '');
        const submitBtn = $('#connectionModal').find('button[form="connectionForm"].btn-primary');
        const originalText = submitBtn.html();

        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');
        submitBtn.prop('disabled', true);

        if (!validateConnectionForm()) {
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            return;
        }

        $.post(alumniApiBase + 'submit_connection', {
            alumni_name: alumniName,
            user_name: $('#connName').val(),
            user_email: $('#connEmail').val(),
            purpose: $('#connPurpose').val(),
            message: $('#connMessage').val(),
            batch: $('#connBatch').val()
        }, function(response) {
            if (response.success) {
                showNotification(`Your connection request for ${alumniName} has been sent to CCIS Alumni Office. We'll contact you soon.`, 'success');
                hideModalById('connectionModal');
                $('#connectionForm')[0].reset();
            } else {
                showNotification(response.message || 'Failed to send connection request.', 'error');
            }
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        }, 'json').fail(function(xhr) {
            const msg = xhr.responseJSON?.message || 'Failed to send connection request.';
            showNotification(msg, 'error');
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        });
    });
    
    // Giveback form submission
    $(document).on('submit', '#givebackForm', function(e) {
        e.preventDefault();

        const givebackType = $('#givebackFormModalLabel').text().replace('Give Back to CCIS - ', '');
        const submitBtn = $('#givebackFormModal').find('.btn-primary');
        const originalText = submitBtn.html();

        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');
        submitBtn.prop('disabled', true);

        if (!validateGivebackForm()) {
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            return;
        }

        $.post(alumniApiBase + 'submit_giveback', {
            type: givebackType,
            name: $('#gbName').val(),
            email: $('#gbEmail').val(),
            batch: $('#gbBatch').val(),
            details: $('#gbDetails').val()
        }, function(response) {
            if (response.success) {
                showNotification(`Thank you for your interest! Your ${givebackType} submission has been received. CCIS Admin will contact you within 3 working days.`, 'success');
                hideModalById('givebackFormModal');
                $('#givebackForm')[0].reset();
            } else {
                showNotification(response.message || 'There was an error submitting your request.', 'error');
            }
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        }, 'json').fail(function(xhr) {
            const msg = xhr.responseJSON?.message || 'There was an error submitting your request.';
            showNotification(msg, 'error');
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        });
    });
    
    // Connect with Alumni button
    $(document).on('click', '#connectAlumniBtn', function() {
        const alumniName = $('#alumniDetailsModal').data('alumni-name');
        
        if (alumniName) {

            $('#alumniDetailsModal')
                .off('hidden.bs.modal.alumniConnectFlow')
                .one('hidden.bs.modal.alumniConnectFlow', function() {
                    $('#connectionModalLabel').text(`Connect with ${alumniName}`);
                    showModalById('connectionModal');
                });

            hideModalById('alumniDetailsModal');
        }
    });
    
}

// ===== FORM VALIDATION HELPERS =====
function validateConnectionForm() {
    const name = $('#connName').val().trim();
    const email = $('#connEmail').val().trim();
    const purpose = $('#connPurpose').val();
    const message = $('#connMessage').val().trim();
    
    if (!name) {
        showNotification('Please enter your full name.', 'error');
        $('#connName').addClass('is-invalid');
        return false;
    }
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        $('#connEmail').addClass('is-invalid');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        $('#connEmail').addClass('is-invalid');
        return false;
    }
    
    if (!purpose) {
        showNotification('Please select a purpose.', 'error');
        $('#connPurpose').addClass('is-invalid');
        return false;
    }
    
    if (!message) {
        showNotification('Please enter a message.', 'error');
        $('#connMessage').addClass('is-invalid');
        return false;
    }
    
    return true;
}

function validateGivebackForm() {
    const name = $('#gbName').val().trim();
    const email = $('#gbEmail').val().trim();
    
    if (!name) {
        showNotification('Please enter your full name.', 'error');
        $('#gbName').addClass('is-invalid');
        return false;
    }
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        $('#gbEmail').addClass('is-invalid');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        $('#gbEmail').addClass('is-invalid');
        return false;
    }
    
    return true;
}

// ===== STORAGE FUNCTIONS =====
function storeAlumniUpdate(data) {
    try {
        let updates = JSON.parse(localStorage.getItem('alumni_updates') || '[]');
        updates.push(data);
        localStorage.setItem('alumni_updates', JSON.stringify(updates));
        return true;
    } catch (error) {
        console.error('? Error storing alumni update:', error);
        return false;
    }
}

function storeGivebackInterest(data) {
    try {
        let interests = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        interests.push(data);
        localStorage.setItem('giveback_interests', JSON.stringify(interests));
        return true;
    } catch (error) {
        console.error('? Error storing giveback interest:', error);
        return false;
    }
}

function storeConnectionRequest(data) {
    try {
        let requests = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        requests.push(data);
        localStorage.setItem('connection_requests', JSON.stringify(requests));
        return true;
    } catch (error) {
        console.error('? Error storing connection request:', error);
        return false;
    }
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'info', duration = 5000) {
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    // Remove existing notifications
    $('.custom-notification').remove();
    
    const notification = $(`
        <div class="custom-notification ${type}" 
             style="animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close ms-auto" 
                    style="background: none; border: none; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Close button functionality
    notification.find('.notification-close').click(function() {
        notification.addClass('slide-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.is(':visible')) {
            notification.addClass('slide-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

// ===== FORM VALIDATION =====
function validateForm(formId) {
    const form = $(`#${formId}`);
    let isValid = true;
    
    form.find('[required]').each(function() {
        const field = $(this);
        const value = field.val().trim();
        
        if (!value) {
            field.addClass('is-invalid');
            isValid = false;
        } else {
            field.removeClass('is-invalid');
        }
        
        // Email validation
        if (field.attr('type') === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.addClass('is-invalid');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ===== INITIALIZE FORM VALIDATION =====
$(document).on('blur', '[required]', function() {
    const field = $(this);
    const value = field.val().trim();
    
    if (!value) {
        field.addClass('is-invalid');
    } else {
        field.removeClass('is-invalid');
        
        // Email validation
        if (field.attr('type') === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.addClass('is-invalid');
            }
        }
    }
});

// Remove invalid class on input
$(document).on('input', '.form-control, .form-select', function() {
    $(this).removeClass('is-invalid');
});

// ===== CHATBOT RESPONSES =====
function setupAlumniChatbotResponses() {
    if (window.addChatbotResponse) {
        window.addChatbotResponse('alumni_info', 
            ['alumni', 'graduates', 'featured alumni', 'alumni directory'],
            [
                "You can find alumni information by clicking the 'Alumni' dropdown menu. Choose from Featured Alumni, Alumni Directory, Alumni Events, or How to Give Back.",
                "Use the Alumni dropdown menu to navigate between different alumni sections. Each section shows only one type of content at a time.",
                "Select a section from the Alumni dropdown menu to view specific alumni information."
            ]
        );
        
        window.addChatbotResponse('alumni_events',
            ['alumni events', 'homecoming', 'career fair', 'networking events'],
            [
                "Check the 'Alumni Events' section for upcoming gatherings like the Annual Homecoming (Dec 15), Alumni Career Fair 2025 (Jan 25), and Tech Talks.",
                "You can find all upcoming alumni events in the Alumni Events section."
            ]
        );
        
        window.addChatbotResponse('alumni_network',
            ['connect with alumni', 'alumni network', 'mentorship', 'connect'],
            [
                "To connect with alumni, view their details from Featured Alumni or Directory, then click 'Connect with Alumni' button.",
                "Use the Alumni Directory to search for specific alumni by name, batch, or program, then connect with them through our system."
            ]
        );
        
        window.addChatbotResponse('give_back',
            ['give back', 'donation', 'mentor', 'volunteer', 'speaker'],
            [
                "You can give back to CCIS by visiting the 'How to Give Back' section. Options include becoming a mentor, volunteering as speaker, making donations, or offering internships.",
                "Check the How to Give Back section to see different ways you can support current CCIS students."
            ]
        );
        
    } else {
    }
}

// ===== NAVIGATION HELPER =====
// This allows navigation from other pages
if (typeof window.alumniNav !== 'undefined') {
    $(document).ready(function() {
        if (window.alumniNav.section) {
            loadAlumniSection(window.alumniNav.section);
        }
    });
}

