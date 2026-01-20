// GET SECTION FROM URL HASH - DEFINED OUTSIDE READY
function getCurrentSection() {
    // Get hash from URL
    let hash = window.location.hash;
    console.log('📌 Raw hash from URL:', hash);
    
    // Remove the # if it exists
    if (hash.startsWith('#')) {
        hash = hash.substring(1);
    }
    console.log('📌 Cleaned hash:', hash);
    
    // If hash exists and is valid, use it
    if (hash && sectionTemplates[hash]) {
        console.log('✅ Valid hash found:', hash);
        return hash;
    }
    
    // Otherwise use default
    console.log('📌 Using default: featured-section');
    return 'featured-section';
}

// ALUMNI PAGE JAVASCRIPT - WITH HASH-BASED NAVIGATION
$(document).ready(function() {
    console.log('🎓 Alumni page initialized');
    
    // LOAD THE SECTION on initial page load
    const currentSection = getCurrentSection();
    console.log('📍 Initial loading section:', currentSection);
    loadAlumniSection(currentSection);
    
    // Setup hash change listener for dropdown clicks
    window.addEventListener('hashchange', function() {
        console.log('🔄 Hash changed event fired!');
        const newSection = getCurrentSection();
        console.log('🔄 Hash changed! New section:', newSection);
        loadAlumniSection(newSection);
    });
    
    // Setup click handlers for navigation links to ensure sections load
    $(document).on('click', '.alumni-content-area a[href*="#"], .dropdown-menu a[href*="alumni"]', function(e) {
        const href = $(this).attr('href');
        if (href && href.includes('#')) {
            const hash = href.substring(href.indexOf('#'));
            console.log('🔗 Navigation link clicked, hash:', hash);
            
            // If already on alumni page, directly load section instead of waiting for hash change
            if (window.location.pathname.includes('alumni')) {
                const sectionId = hash.substring(1); // Remove the #
                if (sectionTemplates[sectionId]) {
                    console.log('📂 Directly loading section:', sectionId);
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
    
    console.log('✅ Alumni page ready');
});

// ===== SECTION TEMPLATES =====
const sectionTemplates = {
    // Featured Alumni Template
    'featured-section': function() {
        return `
            <section class="featured-alumni-section">
                <div class="container">
                    <h2 class="section-title">Featured Alumni</h2>
                    <p class="section-subtitle">Our outstanding graduates making waves in the tech industry</p>
                    
                    <div class="featured-alumni-container">
                        <!-- Alumni Card 1 -->
                        <div class="featured-alumni-card" data-alumni-id="1">
                            <div class="alumni-image">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Juan Delacruz">
                                <div class="featured-badge">
                                    <i class="fas fa-star"></i> Featured
                                </div>
                            </div>
                            <div class="alumni-info">
                                <h3>Juan Delacruz</h3>
                                <p class="alumni-batch">BSCS Batch 2015</p>
                                <p class="alumni-position">Senior Software Engineer at Google</p>
                                <p class="alumni-achievement">Led development of Google's AI-powered search algorithms</p>
                                <div class="alumni-actions">
                                    <button class="alumni-view-details" data-alumni-id="1">
                                        <i class="fas fa-eye me-1"></i> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Alumni Card 2 -->
                        <div class="featured-alumni-card" data-alumni-id="2">
                            <div class="alumni-image">
                                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Maria Santos">
                                <div class="featured-badge">
                                    <i class="fas fa-star"></i> Featured
                                </div>
                            </div>
                            <div class="alumni-info">
                                <h3>Maria Santos</h3>
                                <p class="alumni-batch">BSIT Batch 2018</p>
                                <p class="alumni-position">Cybersecurity Director at Bank of the Philippines</p>
                                <p class="alumni-achievement">Awarded "Top IT Professional 2023" by DICT</p>
                                <div class="alumni-actions">
                                    <button class="alumni-view-details" data-alumni-id="2">
                                        <i class="fas fa-eye me-1"></i> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Alumni Card 3 -->
                        <div class="featured-alumni-card" data-alumni-id="3">
                            <div class="alumni-image">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Pedro Garcia">
                                <div class="featured-badge">
                                    <i class="fas fa-star"></i> Featured
                                </div>
                            </div>
                            <div class="alumni-info">
                                <h3>Pedro Garcia</h3>
                                <p class="alumni-batch">BSIS Batch 2016</p>
                                <p class="alumni-position">CEO & Founder of TechSolutions PH</p>
                                <p class="alumni-achievement">Startup recognized as "Top Tech Startup 2022"</p>
                                <div class="alumni-actions">
                                    <button class="alumni-view-details" data-alumni-id="3">
                                        <i class="fas fa-eye me-1"></i> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    // Directory Template
    'directory-section': function() {
        const alumniData = [
            { id: 1, name: "Juan Delacruz", program: "BSCS", batch: "2015", company: "Google Philippines", position: "Senior Software Engineer" },
            { id: 2, name: "Maria Santos", program: "BSIT", batch: "2018", company: "Bank of the Philippines", position: "Cybersecurity Director" },
            { id: 3, name: "Pedro Garcia", program: "BSIS", batch: "2016", company: "TechSolutions PH", position: "CEO & Founder" },
            { id: 4, name: "Anna Lopez", program: "BSCS", batch: "2017", company: "Meta", position: "AI Research Lead" },
            { id: 5, name: "Michael Tan", program: "BSIT", batch: "2015", company: "PinoyTech Solutions", position: "CEO" },
            { id: 6, name: "Sarah Lim", program: "BSIS", batch: "2016", company: "BDO", position: "Head of Cybersecurity" }
        ];
        
        let directoryCards = '';
        alumniData.forEach(alumni => {
            directoryCards += `
                <div class="directory-card" data-id="${alumni.id}" data-program="${alumni.program}" data-batch="${alumni.batch}">
                    <h4>${alumni.name}</h4>
                    <p class="directory-program">${alumni.program} Graduate</p>
                    <p class="directory-company">${alumni.company}</p>
                    <p class="directory-position">${alumni.position}</p>
                    <p class="directory-batch">Batch ${alumni.batch}</p>
                </div>
            `;
        });
        
        return `
            <section class="directory-section">
                <div class="container">
                    <h2 class="section-title">Alumni Directory</h2>
                    <p class="section-subtitle">Connect with CCIS graduates from different batches and programs</p>
                    
                    <div class="directory-filters">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="search-alumni" placeholder="Search by name, company, or position...">
                        </div>
                        
                        <select id="filter-batch" class="filter-select">
                            <option value="">All Batches</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                        </select>
                        
                        <select id="filter-program" class="filter-select">
                            <option value="">All Programs</option>
                            <option value="BSCS">BSCS</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSIS">BSIS</option>
                        </select>
                    </div>
                    
                    <div id="alumni-directory" class="alumni-directory">
                        ${directoryCards}
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
    
    // Success Stories Template
    'success-section': function() {
        return `
            <section class="success-stories-section">
                <div class="container">
                    <h2 class="section-title">Success Stories</h2>
                    <p class="section-subtitle">Inspiring journeys of CCIS graduates who made it big</p>
                    
                    <div class="success-stories">
                        <div class="story-card">
                            <div class="story-image">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Anna Lopez">
                            </div>
                            <div class="story-content">
                                <h3>From CCIS Student to Silicon Valley Engineer</h3>
                                <p class="story-text">"My journey at CCIS taught me not just coding, but problem-solving. The late nights in the computer lab, the group projects, and the guidance from professors prepared me for the challenges at Facebook. Today, I lead a team working on AI research, and I owe my foundation to CCIS."</p>
                                <div class="story-author-info">
                                    <p class="story-author">Anna Lopez</p>
                                    <p class="story-author-details">BSCS Batch 2017 • AI Research Lead at Meta</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="story-card">
                            <div class="story-image">
                                <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Michael Tan">
                            </div>
                            <div class="story-content">
                                <h3>Building a Tech Startup from Scratch</h3>
                                <p class="story-text">"The entrepreneurship course at CCIS sparked my interest in startups. After graduation, I founded 'PinoyTech Solutions' with two classmates. Today, we employ 50+ people and serve clients globally. CCIS didn't just teach me technology; it taught me how to build something meaningful."</p>
                                <div class="story-author-info">
                                    <p class="story-author">Michael Tan</p>
                                    <p class="story-author-details">BSIT Batch 2015 • CEO, PinoyTech Solutions</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="story-card">
                            <div class="story-image">
                                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Sarah Lim">
                            </div>
                            <div class="story-content">
                                <h3>Cybersecurity Expert Protecting National Banks</h3>
                                <p class="story-text">"The cybersecurity track at CCIS was challenging but rewarding. The hands-on experience with network security tools gave me the confidence to apply for positions at major banks. Now, I protect financial systems worth billions. Every day, I use skills I learned at CCIS to prevent cyber attacks."</p>
                                <div class="story-author-info">
                                    <p class="story-author">Sarah Lim</p>
                                    <p class="story-author-details">BSIS Batch 2016 • Head of Cybersecurity, BDO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    // Events Template
    'events-section': function() {
        return `
            <section class="events-section">
                <div class="container">
                    <h2 class="section-title">Alumni Events</h2>
                    <p class="section-subtitle">Join our upcoming gatherings and networking opportunities</p>
                    
                    <div class="events-container">
                        <div class="event-card">
                            <div class="event-date">
                                <div class="event-month">DEC</div>
                                <div class="event-day">15</div>
                                <div class="event-year">2024</div>
                            </div>
                            <div class="event-details">
                                <h3>Annual CCIS Homecoming</h3>
                                <p class="event-time"><i class="fas fa-clock"></i> 5:00 PM - 10:00 PM</p>
                                <p class="event-location"><i class="fas fa-map-marker-alt"></i> BISU Balilihan Campus</p>
                                <p class="event-description">Reconnect with batchmates, meet current students, and celebrate CCIS achievements. Dinner and program included.</p>
                            </div>
                        </div>
                        
                        <div class="event-card">
                            <div class="event-date">
                                <div class="event-month">JAN</div>
                                <div class="event-day">25</div>
                                <div class="event-year">2025</div>
                            </div>
                            <div class="event-details">
                                <h3>Alumni Career Fair 2025</h3>
                                <p class="event-time"><i class="fas fa-clock"></i> 9:00 AM - 4:00 PM</p>
                                <p class="event-location"><i class="fas fa-map-marker-alt"></i> BISU Gymnasium</p>
                                <p class="event-description">Connect with alumni employers, explore job opportunities, and network with industry professionals.</p>
                            </div>
                        </div>
                        
                        <div class="event-card">
                            <div class="event-date">
                                <div class="event-month">FEB</div>
                                <div class="event-day">10</div>
                                <div class="event-year">2025</div>
                            </div>
                            <div class="event-details">
                                <h3>Tech Talk: AI in Business</h3>
                                <p class="event-time"><i class="fas fa-clock"></i> 6:00 PM - 8:00 PM (Online)</p>
                                <p class="event-location"><i class="fas fa-video"></i> Zoom Webinar</p>
                                <p class="event-description">Learn how AI is transforming businesses from successful alumni. Q&A session included.</p>
                            </div>
                        </div>
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
    
    // Update Form Template
    'update-form-section': function() {
        return `
            <section class="update-form-section">
                <div class="container">
                    <h2 class="section-title">Update Your Information</h2>
                    <p class="section-subtitle">Help us keep our alumni database current</p>
                    
                    <div class="update-form-container">
                        <form id="alumni-update-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="update-name">Full Name *</label>
                                    <input type="text" id="update-name" required placeholder="Juan Delacruz">
                                </div>
                                
                                <div class="form-group">
                                    <label for="update-email">Email Address *</label>
                                    <input type="email" id="update-email" required placeholder="juan.delacruz@example.com">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="update-batch">Graduation Year *</label>
                                    <select id="update-batch" required>
                                        <option value="">Select Year</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="2019">2019</option>
                                        <option value="2018">2018</option>
                                        <option value="2017">2017</option>
                                        <option value="2016">2016</option>
                                        <option value="2015">2015</option>
                                        <option value="2014">2014</option>
                                        <option value="2013">2013</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="update-program">Program *</label>
                                    <select id="update-program" required>
                                        <option value="">Select Program</option>
                                        <option value="BSCS">Bachelor of Science in Computer Science</option>
                                        <option value="BSIT">Bachelor of Science in Information Technology</option>
                                        <option value="BSIS">Bachelor of Science in Information Systems</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="update-current-position">Current Position</label>
                                    <input type="text" id="update-current-position" placeholder="Senior Software Engineer">
                                </div>
                                
                                <div class="form-group">
                                    <label for="update-company">Current Company/Organization</label>
                                    <input type="text" id="update-company" placeholder="Google Philippines">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="update-achievements">Recent Achievements or Updates</label>
                                <textarea id="update-achievements" rows="4" placeholder="Share your recent promotions, awards, publications, or other accomplishments..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>How would you like to give back?</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="update-willing-mentor">
                                        <span>I'm willing to mentor current students</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="update-willing-speaker">
                                        <span>I'm available as a guest speaker</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="update-willing-internship">
                                        <span>My company offers internship opportunities</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="update-willing-donate">
                                        <span>I'm interested in making a donation</span>
                                    </label>
                                </div>
                            </div>
                            
                            <button type="submit" class="submit-update-btn">
                                <i class="fas fa-paper-plane me-2"></i> Submit Update
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        `;
    }
};

// ===== LOAD SECTION =====
function loadAlumniSection(sectionId) {
    console.log(`📂 Loading section: ${sectionId}`);
    
    // Get template function
    const templateFunction = sectionTemplates[sectionId];
    
    if (!templateFunction) {
        console.error(`❌ Template not found for: ${sectionId}`);
        console.log('Available templates:', Object.keys(sectionTemplates));
        return;
    }
    
    // Get content area
    const contentArea = $('.alumni-content-area');
    console.log(`📦 Content area found:`, contentArea.length > 0);
    
    if (contentArea.length === 0) {
        console.error('❌ Content area element not found!');
        return;
    }
    
    // Add exit animation
    contentArea.addClass('alumni-content-exit');
    
    // Wait for exit animation, then load new content
    setTimeout(() => {
        // Clear and load new content
        contentArea.empty();
        console.log(`🗑️ Content cleared`);
        
        // Generate HTML from template
        const sectionHtml = templateFunction();
        console.log(`📝 Template generated for: ${sectionId}`);
        
        // Append new content
        contentArea.html(sectionHtml);
        console.log(`✅ Content appended to page`);
        
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
                console.log('✨ Scroll complete');
            });
        }, 100);
        
        console.log(`✨ Section ${sectionId} loaded and displayed`);
    }, 300);
}

// ===== SETUP SECTION FUNCTIONALITY =====
function setupSectionFunctionality(sectionId) {
    console.log(`⚙️ Setting up functionality for: ${sectionId}`);
    
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
        case 'update-form-section':
            setupUpdateForm();
            break;
        case 'giveback-section':
            setupGiveBackButtons();
            break;
    }
}

// ===== BUTTON EFFECTS =====
function setupButtonEffects() {
    console.log('🔘 Setting up button effects...');
    
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
    $(document).on('mousedown touchstart', '.featured-alumni-card, .directory-card, .story-card, .event-card, .giveback-card', function() {
        $(this).addClass('card-pressed');
    });
    
    $(document).on('mouseup touchend', '.featured-alumni-card, .directory-card, .story-card, .event-card, .giveback-card', function() {
        setTimeout(() => {
            $(this).removeClass('card-pressed');
        }, 150);
    });
    
    console.log('✅ Button effects setup complete');
}

// ===== FEATURED ALUMNI =====
function setupFeaturedAlumni() {
    console.log('👤 Setting up featured alumni...');
    
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
    
    console.log('✅ Featured alumni setup complete');
}

function showAlumniDetails(alumniId) {
    console.log(`👁️ Showing alumni details for ID: ${alumniId}`);
    
    const alumniData = {
        1: {
            name: "Juan Delacruz",
            batch: "BSCS 2015",
            position: "Senior Software Engineer",
            company: "Google Philippines",
            bio: "Juan graduated from CCIS in 2015 with honors. His passion for artificial intelligence led him to Google, where he now leads a team of engineers developing cutting-edge search algorithms.",
            achievements: [
                "Led development of Google's AI-powered search algorithms",
                "Published 5 research papers in top-tier AI conferences",
                "Mentored 15+ junior engineers at Google"
            ]
        },
        2: {
            name: "Maria Santos",
            batch: "BSIT 2018",
            position: "Cybersecurity Director",
            company: "Bank of the Philippines",
            bio: "Maria's interest in cybersecurity began during her BSIT capstone project at CCIS. She now oversees cybersecurity for one of the country's largest banks.",
            achievements: [
                "Awarded 'Top IT Professional 2023' by DICT",
                "Implemented bank-wide cybersecurity protocol",
                "Led digital transformation of banking security systems"
            ]
        },
        3: {
            name: "Pedro Garcia",
            batch: "BSIS 2016",
            position: "CEO & Founder",
            company: "TechSolutions PH",
            bio: "Pedro started TechSolutions PH right after graduation with two classmates. What began as a small web development service is now a full-scale tech solutions company.",
            achievements: [
                "Startup recognized as 'Top Tech Startup 2022'",
                "Created 50+ jobs in Bohol and Cebu",
                "Developed software solutions for 100+ SMEs"
            ]
        }
    };
    
    const alumni = alumniData[alumniId];
    if (!alumni) {
        showNotification('Alumni information not found.', 'error');
        return;
    }
    
    const achievementsList = alumni.achievements.map(ach => `<li><i class="fas fa-check text-success me-2"></i>${ach}</li>`).join('');
    
    const modalContent = `
        <div class="alumni-modal-content">
            <div class="alumni-modal-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="${alumni.name}">
            </div>
            <div class="alumni-modal-details">
                <div class="alumni-modal-header">
                    <h2>${alumni.name}</h2>
                    <p class="alumni-modal-batch">${alumni.batch}</p>
                </div>
                
                <div class="alumni-modal-position">
                    <h4>${alumni.position}</h4>
                    <p class="alumni-modal-company">${alumni.company}</p>
                </div>
                
                <div class="alumni-modal-section">
                    <h4><i class="fas fa-user-graduate"></i> Bio</h4>
                    <p>${alumni.bio}</p>
                </div>
                
                <div class="alumni-modal-section alumni-modal-achievements">
                    <h4><i class="fas fa-trophy"></i> Key Achievements</h4>
                    <ul>${achievementsList}</ul>
                </div>
            </div>
        </div>
    `;
    
    $('#alumniModalContent').html(modalContent);
    $('#alumniDetailsModalLabel').text(`Alumni Details - ${alumni.name}`);
    
    // Store alumni name in modal for connection button
    $('#alumniDetailsModal').data('alumni-name', alumni.name);
    
    const alumniModal = new bootstrap.Modal(document.getElementById('alumniDetailsModal'));
    alumniModal.show();
    
    console.log(`✅ Alumni details modal shown for: ${alumni.name}`);
}

// ===== SEARCH AND FILTER =====
function setupSearchAndFilter() {
    console.log('🔍 Setting up search and filter...');
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        const searchInput = $('#search-alumni');
        const batchFilter = $('#filter-batch');
        const programFilter = $('#filter-program');
        
        if (!searchInput.length) {
            console.warn('⚠️ Search elements not found');
            return;
        }
        
        function filterAlumni() {
            const searchTerm = searchInput.val().toLowerCase();
            const selectedBatch = batchFilter.val();
            const selectedProgram = programFilter.val();
            
            let visibleCount = 0;
            
            $('.directory-card').each(function() {
                const $card = $(this);
                const name = $card.find('h4').text().toLowerCase();
                const program = $card.data('program');
                const batch = $card.data('batch');
                const company = $card.find('.directory-company').text().toLowerCase();
                const position = $card.find('.directory-position').text().toLowerCase();
                
                let matches = true;
                
                if (searchTerm && !name.includes(searchTerm) && !company.includes(searchTerm) && !position.includes(searchTerm)) {
                    matches = false;
                }
                
                if (selectedBatch && batch !== selectedBatch) {
                    matches = false;
                }
                
                if (selectedProgram && program !== selectedProgram) {
                    matches = false;
                }
                
                if (matches) {
                    $card.show();
                    visibleCount++;
                } else {
                    $card.hide();
                }
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
        programFilter.on('change', filterAlumni);
        
        // Setup clear filters button
        $(document).on('click', '#clear-filters', function() {
            searchInput.val('');
            batchFilter.val('');
            programFilter.val('');
            filterAlumni();
            showNotification('Filters cleared', 'info');
        });
        
        // Setup directory card click
        $(document).on('click', '.directory-card', function() {
            const alumniId = $(this).data('id');
            showAlumniDetails(alumniId);
        });
        
        console.log('✅ Search and filter setup complete');
    }, 100);
}

// ===== EVENT CARDS =====
function setupEventCards() {
    console.log('📅 Setting up event cards...');
    
    $(document).on('click', '.event-card', function() {
        const eventTitle = $(this).find('h3').text();
        showNotification(`Event: ${eventTitle} - More details will be announced soon.`, 'info');
    });
    
    console.log('✅ Event cards setup complete');
}

// ===== UPDATE FORM =====
function setupUpdateForm() {
    console.log('📝 Setting up update form...');
    
    $(document).on('submit', '#alumni-update-form', function(e) {
        e.preventDefault(); // PREVENT PAGE RELOAD
        
        console.log('📨 Submitting alumni update form...');
        
        // Validate form
        if (!validateForm('alumni-update-form')) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('.submit-update-btn');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Processing...');
        submitBtn.prop('disabled', true);
        
        // Collect form data
        const formData = {
            name: $('#update-name').val().trim(),
            email: $('#update-email').val().trim(),
            batch: $('#update-batch').val(),
            program: $('#update-program').val(),
            position: $('#update-current-position').val().trim(),
            company: $('#update-company').val().trim(),
            achievements: $('#update-achievements').val().trim(),
            giveback: {
                mentor: $('#update-willing-mentor').is(':checked'),
                speaker: $('#update-willing-speaker').is(':checked'),
                internship: $('#update-willing-internship').is(':checked'),
                donation: $('#update-willing-donate').is(':checked')
            },
            timestamp: new Date().toISOString()
        };
        
        // Simulate API call (for demo)
        setTimeout(() => {
            // Store update
            const success = storeAlumniUpdate(formData);
            
            if (success) {
                // Show success message
                showNotification('Thank you for updating your information! CCIS Alumni Office will verify and update your records.', 'success');
                
                // Reset form
                $(this)[0].reset();
                
                // Remove validation classes
                $(this).find('.form-control, .form-select').removeClass('is-invalid is-valid');
                
                console.log('✅ Alumni update submitted successfully');
            } else {
                showNotification('There was an error submitting your information. Please try again.', 'error');
                console.error('❌ Failed to store alumni update');
            }
            
            // Restore button
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            
        }, 1500);
    });
    
    console.log('✅ Update form setup complete');
}

// ===== GIVE BACK BUTTONS =====
function setupGiveBackButtons() {
    console.log('🤝 Setting up give back buttons...');
    
    $(document).on('click', '.giveback-btn', function(e) {
        e.stopPropagation();
        const givebackType = $(this).data('giveback-type');
        
        console.log(`🎯 Give back button clicked: ${givebackType}`);
        
        if (givebackType === 'Donation') {
            // Show donation information modal
            $('#donationModal').modal('show');
        } else {
            // Show form for other giveback types
            showGivebackForm(givebackType);
        }
    });
    
    console.log('✅ Give back buttons setup complete');
}

function showGivebackForm(givebackType) {
    console.log(`📋 Showing giveback form for: ${givebackType}`);
    
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
    
    const givebackModal = new bootstrap.Modal(document.getElementById('givebackFormModal'));
    givebackModal.show();
    
    console.log(`✅ Giveback form modal shown for: ${givebackType}`);
}

// ===== MODAL FUNCTIONS =====
function setupModalEvents() {
    console.log('🔧 Setting up modal events...');
    
    // Connection form submission
    $(document).on('submit', '#connectionForm', function(e) {
        e.preventDefault();
        
        const alumniName = $('#connectionModalLabel').text().replace('Connect with ', '');
        const submitBtn = $(this).find('.btn-primary');
        const originalText = submitBtn.html();
        
        console.log(`🔗 Submitting connection request for: ${alumniName}`);
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');
        submitBtn.prop('disabled', true);
        
        // Validate form
        if (!validateConnectionForm()) {
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            return;
        }
        
        // Store connection request
        storeConnectionRequest({
            alumniName: alumniName,
            userName: $('#connName').val(),
            userEmail: $('#connEmail').val(),
            purpose: $('#connPurpose').val(),
            message: $('#connMessage').val(),
            batch: $('#connBatch').val(),
            timestamp: new Date().toISOString()
        });
        
        // Simulate API delay
        setTimeout(() => {
            showNotification(`Your connection request for ${alumniName} has been sent to CCIS Alumni Office. We'll contact you soon.`, 'success');
            
            $('#connectionModal').modal('hide');
            $(this)[0].reset();
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            
            console.log(`✅ Connection request sent for: ${alumniName}`);
        }, 1500);
    });
    
    // Giveback form submission
    $(document).on('submit', '#givebackForm', function(e) {
        e.preventDefault();
        
        const givebackType = $('#givebackFormModalLabel').text().replace('Give Back to CCIS - ', '');
        const submitBtn = $('#givebackFormModal').find('.btn-primary');
        const originalText = submitBtn.html();
        
        console.log(`📤 Submitting giveback form for: ${givebackType}`);
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');
        submitBtn.prop('disabled', true);
        
        // Validate form
        if (!validateGivebackForm()) {
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            return;
        }
        
        const formData = {
            type: givebackType,
            name: $('#gbName').val(),
            email: $('#gbEmail').val(),
            batch: $('#gbBatch').val(),
            details: $('#gbDetails').val(),
            timestamp: new Date().toISOString()
        };
        
        // Simulate API delay
        setTimeout(() => {
            storeGivebackInterest(formData);
            showNotification(`Thank you for your interest! Your ${formData.type} submission has been received. CCIS Admin will contact you within 3 working days.`, 'success');
            
            $('#givebackFormModal').modal('hide');
            $(this)[0].reset();
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            
            console.log(`✅ Giveback form submitted for: ${givebackType}`);
        }, 1500);
    });
    
    // Connect with Alumni button
    $(document).on('click', '#connectAlumniBtn', function() {
        const alumniName = $('#alumniDetailsModal').data('alumni-name');
        
        if (alumniName) {
            console.log(`🤝 Connecting with alumni: ${alumniName}`);
            
            $('#alumniDetailsModal').modal('hide');
            setTimeout(() => {
                $('#connectionModalLabel').text(`Connect with ${alumniName}`);
                $('#connectionModal').modal('show');
            }, 200);
        }
    });
    
    console.log('✅ Modal events setup complete');
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
        console.log('📝 Alumni update stored:', data);
        return true;
    } catch (error) {
        console.error('❌ Error storing alumni update:', error);
        return false;
    }
}

function storeGivebackInterest(data) {
    try {
        let interests = JSON.parse(localStorage.getItem('giveback_interests') || '[]');
        interests.push(data);
        localStorage.setItem('giveback_interests', JSON.stringify(interests));
        console.log('🤝 Giveback interest stored:', data);
        return true;
    } catch (error) {
        console.error('❌ Error storing giveback interest:', error);
        return false;
    }
}

function storeConnectionRequest(data) {
    try {
        let requests = JSON.parse(localStorage.getItem('connection_requests') || '[]');
        requests.push(data);
        localStorage.setItem('connection_requests', JSON.stringify(requests));
        console.log('🔗 Connection request stored:', data);
        return true;
    } catch (error) {
        console.error('❌ Error storing connection request:', error);
        return false;
    }
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'info', duration = 5000) {
    console.log(`📢 Notification: ${type} - ${message}`);
    
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
                "You can find alumni information by clicking the 'Alumni' dropdown menu. Choose from Featured Alumni, Alumni Directory, Success Stories, Alumni Events, How to Give Back, or Update Your Information.",
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
        
        window.addChatbotResponse('success_stories',
            ['success stories', 'inspirational stories', 'alumni achievements'],
            [
                "Read inspiring Success Stories of our alumni in the 'Success Stories' section.",
                "Our alumni have amazing journeys! Check the Success Stories section for their inspiring stories."
            ]
        );
        
        window.addChatbotResponse('give_back',
            ['give back', 'donation', 'mentor', 'volunteer', 'speaker'],
            [
                "You can give back to CCIS by visiting the 'How to Give Back' section. Options include becoming a mentor, volunteering as speaker, making donations, or offering internships.",
                "Check the How to Give Back section to see different ways you can support current CCIS students."
            ]
        );
        
        console.log('✅ Alumni chatbot responses added');
    } else {
        console.log('⚠️ Chatbot response system not available');
    }
}

// ===== NAVIGATION HELPER =====
// This allows navigation from other pages
if (typeof window.alumniNav !== 'undefined') {
    $(document).ready(function() {
        if (window.alumniNav.section) {
            console.log(`🔗 Navigation requested to: ${window.alumniNav.section}`);
            loadAlumniSection(window.alumniNav.section);
        }
    });
}