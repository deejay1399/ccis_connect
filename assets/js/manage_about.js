// Manage About Us JavaScript - UPDATED WITH MATCHING HEADER/FOOTER AND BUTTON STYLES

$(document).ready(function() {
    console.log('🔐 Manage About Us Page Loading...');
    
    // Enhanced function to remove Return to Dashboard links
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
        
        // Method 5: Hide any remaining elements with CSS
        $('body').append(`
            <style>
                .return-to-dashboard,
                a[href*="index.html"]:contains("Return to Dashboard"),
                a:contains("Return to Dashboard"),
                *:contains("Return to Dashboard") {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    width: 0 !important;
                    overflow: hidden !important;
                    position: absolute !important;
                    left: -9999px !important;
                }
            </style>
        `);
    }
    
    // Session check
    function checkSuperAdminSession() {
        const session = window.checkUserSession();
        
        if (!session.isValid) {
            showNotification('Please login to access Super Admin dashboard', 'error');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 2000);
            return false;
        }
        
        if (session.user.role !== 'superadmin') {
            showNotification('Access denied. Super Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return false;
        }
        
        // Update UI with admin info
        $('#user-name').text(session.user.name);
        $('#user-role').text(session.user.role);
        
        return true;
    }
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        // Setup public site link
        $('#view-public-site-link').on('click', function() {
            localStorage.setItem('admin_return_url', 'super_admin/index.html');
        });
        
        // Initialize date display
        updateCurrentDate();
        
        // Load about us data
        loadAboutUsData();
        
        // Initialize UI components
        initBootstrapTabs();
        initVmgotabs();
        initGoals();
        initCoreValues();
        initFormSubmissions();
        initResponsiveChecks();
        
        // Remove any Return to Dashboard links multiple times to ensure removal
        removeReturnToDashboard();
        
        console.log('🎯 Manage About Us Page initialized successfully');
    }
    
    // Date display
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
    
    // Notification functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        $('.admin-notification').remove();
        
        const notificationClass = type === 'error' ? 'alert-danger' : 
                                 type === 'success' ? 'alert-success' : 
                                 type === 'warning' ? 'alert-warning' :
                                 'alert-info';
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                          type === 'success' ? 'fa-check-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' :
                          'fa-info-circle';
        
        const notification = $(`
            <div class="admin-notification alert ${notificationClass} alert-dismissible fade show" 
                 style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 5000);
    }

    // Load current about us data
    function loadAboutUsData() {
        console.log('Loading about us data...');
        
        // Load from localStorage or initialize with default data
        let aboutData;
        try {
            const storedData = localStorage.getItem('aboutUsData');
            aboutData = storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error('Error parsing stored data:', error);
            aboutData = {};
        }
        
        // Ensure all required properties exist with default values
        const defaultData = {
            history: {
                content: "The College of Computing and Information Sciences (CCIS) is the newest academic department of Bohol Island State University – Balilihan Campus, officially established in 2024.\n\nPreviously, computing-related programs were offered under the College of Technology and Allied Sciences (CTAS). However, due to the growing demand and increasing specialization in the field of computing, CCIS was established as a separate college. It currently offers two degree programs: Bachelor of Science in Computer Science (BSCS) and Bachelor of Science in Information Technology (BSIT), both of which align closely with the department's core focus.\n\nWith innovation, collaboration, and excellence as its foundation, CCIS continues to grow and is committed to producing future-ready graduates equipped to lead in the ever-evolving world of technology."
            },
            vmgo: {
                vision: "A premier Science and Technology university for the formation of world-class and virtuous human resource for sustainable development in Bohol and the Country.",
                mission: "BISU is committed to provide quality higher education in the arts and sciences, as well as in the professional and technological fields; undertake research and development and extension services for the sustainable development of Bohol and the country.",
                goals: [
                    "Pursue faculty and education excellence and strengthen the current viable curricular programs and develop curricular programs that are responsive to the demands of the times both in the industry and the environment",
                    "Promote quality research outputs that respond to the needs of the local and national communities",
                    "Develop Communities through Responsive Extension Programs",
                    "Adopt Efficient and Profitable Income Generating Projects/Enterprise for Self-Sustainability",
                    "Provide adequate, state-of-the-art, and accessible infrastructure support facilities for quality education",
                    "Promote efficient and effective good governance supportive of high-quality education"
                ],
                coreValues: [
                    {
                        name: "BALANCE",
                        description: "Balance refers to the importance of maintaining equilibrium and harmony in all aspects of life. It emphasizes the need to strike a balance between academic pursuits and personal well-being, between work and leisure, between physical and mental health, and between individual and community interests."
                    },
                    {
                        name: "INTEGRITY",
                        description: "Integrity is the foundation of ethical behavior and moral character. It encompasses honesty, transparency, and a strong adherence to principles and values. Upholding integrity means acting with sincerity, fairness, and accountability in all endeavors."
                    },
                    {
                        name: "STEWARDSHIP",
                        description: "Stewardship reflects the university's commitment to responsible management and wise utilization of resources. It emphasizes the need to protect and preserve the environment, promote sustainable practices, and ensure the efficient use of financial, human, and physical resources."
                    },
                    {
                        name: "UPRIGHTNESS",
                        description: "Uprightness embodies the value of moral uprightness, righteousness, and ethical conduct. It emphasizes the importance of upholding high moral standards, practicing fairness, and demonstrating respect for others."
                    }
                ]
            },
            hymn: {
                verse1: "A Dream, a Thought, a reality\nBohol Island State University.\nSail B.I.S.U Sail\nFrom the North to the South\nEast to West",
                chorus: "Fly B.I.S.U fly\nFrom the Island of Bohol\nto the world.\nHappy are we as we go through\nNurtured with Thoughts of Wisdom",
                finale: "A Dream, a Thought, a Reality\nBohol Island State University!",
                audio: null
            }
        };

        // Merge stored data with defaults, ensuring all properties exist
        aboutData = {
            history: { ...defaultData.history, ...aboutData.history },
            vmgo: { ...defaultData.vmgo, ...aboutData.vmgo },
            hymn: { ...defaultData.hymn, ...aboutData.hymn }
        };

        // Populate forms with current data - with null checks
        $('#history-content').val(aboutData.history?.content || '');
        
        // Safely access vmgo properties
        $('#vision-content').val(aboutData.vmgo?.vision || '');
        $('#mission-content').val(aboutData.vmgo?.mission || '');
        
        // Populate goals and core values with fallbacks
        populateGoals(aboutData.vmgo?.goals || []);
        populateCoreValues(aboutData.vmgo?.coreValues || []);
        
        // Populate hymn sections
        $('#verse1-content').val(aboutData.hymn?.verse1 || '');
        $('#chorus-content').val(aboutData.hymn?.chorus || '');
        $('#finale-content').val(aboutData.hymn?.finale || '');
        
        // Display current hymn
        displayCurrentHymn(aboutData.hymn || {});
        
        console.log('About us data loaded successfully');
        return aboutData;
    }

    // Populate goals form
    function populateGoals(goals) {
        const container = $('#goals-container');
        container.empty();
        
        // Ensure goals is an array
        if (!Array.isArray(goals)) {
            goals = [];
        }
        
        goals.forEach((goal, index) => {
            const goalHtml = `
                <div class="goal-item" data-index="${index}">
                    <div class="goal-header">
                        <div class="goal-content">
                            <textarea class="form-control goal-text" rows="2" placeholder="Enter goal">${goal}</textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-goal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            container.append(goalHtml);
        });
        
        // Add event listeners for remove buttons
        $('.remove-goal').off('click').on('click', function() {
            $(this).closest('.goal-item').remove();
        });
    }

    // Populate core values form
    function populateCoreValues(coreValues) {
        const container = $('#core-values-container');
        container.empty();
        
        // Ensure coreValues is an array
        if (!Array.isArray(coreValues)) {
            coreValues = [];
        }
        
        coreValues.forEach((value, index) => {
            const valueHtml = `
                <div class="core-value-horizontal" data-index="${index}">
                    <div class="core-value-header">
                        <div class="core-value-content">
                            <input type="text" class="form-control core-value-name mb-2" value="${value.name || ''}" placeholder="Core value name">
                            <textarea class="form-control core-value-description" rows="3" placeholder="Core value description">${value.description || ''}</textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-core-value">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            container.append(valueHtml);
        });
        
        // Add event listeners for remove buttons
        $('.remove-core-value').off('click').on('click', function() {
            $(this).closest('.core-value-horizontal').remove();
        });
    }

    // Display current hymn
    function displayCurrentHymn(hymn) {
        const currentAudio = $('#current-audio');
        currentAudio.empty();
        
        if (hymn && hymn.audio) {
            currentAudio.html(`
                <p class="mb-1"><strong>Current Audio:</strong></p>
                <div class="audio-controls">
                    <audio controls class="audio-preview">
                        <source src="${hymn.audio}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <button class="btn btn-sm btn-danger delete-audio">
                        <i class="fas fa-trash"></i> Delete Audio
                    </button>
                </div>
            `);
            
            $('.delete-audio').off('click').on('click', function() {
                deleteHymnAudio();
            });
        }
    }

    // Save about us data to localStorage
    function saveAboutUsData(aboutData) {
        try {
            localStorage.setItem('aboutUsData', JSON.stringify(aboutData));
            showNotification('Changes saved successfully!', 'success');
            
            // Update display
            displayCurrentHymn(aboutData.hymn || {});
        } catch (error) {
            console.error('Error saving data:', error);
            showNotification('Error saving changes!', 'error');
        }
    }

    // Initialize Bootstrap tabs properly
    function initBootstrapTabs() {
        console.log('Initializing Bootstrap tabs...');
        
        // This ensures Bootstrap handles the tab switching
        const tabTriggers = [].slice.call(document.querySelectorAll('#aboutTabs button'));
        tabTriggers.forEach(function(tabTriggerEl) {
            tabTriggerEl.addEventListener('click', function(event) {
                event.preventDefault();
                const tab = new bootstrap.Tab(tabTriggerEl);
                tab.show();
            });
        });
        
        // Listen for tab changes to update content
        $('#aboutTabs button').on('shown.bs.tab', function(event) {
            const target = $(event.target).attr('data-bs-target');
            console.log('Tab changed to:', target);
            
            // Hide all content first
            $('.tab-pane').removeClass('show active');
            
            // Show only the active tab content
            $(target).addClass('show active');
        });
    }

    // VMGO Tab functionality
    function initVmgotabs() {
        console.log('Initializing VMGO tabs...');
        
        $('.vmgo-tab-btn').on('click', function() {
            const tabId = $(this).data('tab');
            console.log('Switching to VMGO tab:', tabId);
            
            // Remove active class from all buttons and panes
            $('.vmgo-tab-btn').removeClass('active');
            $('.vmgo-tab-pane').removeClass('active');
            
            // Add active class to clicked button and corresponding pane
            $(this).addClass('active');
            $(`#${tabId}-tab`).addClass('active');
        });
        
        // Initialize first tab as active
        $('.vmgo-tab-btn:first').trigger('click');
    }

    // Initialize goals functionality
    function initGoals() {
        $('#add-goal').on('click', function() {
            const container = $('#goals-container');
            const index = container.children().length;
            
            const goalHtml = `
                <div class="goal-item" data-index="${index}">
                    <div class="goal-header">
                        <div class="goal-content">
                            <textarea class="form-control goal-text" rows="2" placeholder="Enter goal"></textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-goal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            container.append(goalHtml);
            
            // Add event listener for remove button
            container.find('.remove-goal').last().on('click', function() {
                $(this).closest('.goal-item').remove();
            });
        });
    }

    // Initialize core values functionality
    function initCoreValues() {
        $('#add-core-value').on('click', function() {
            const container = $('#core-values-container');
            const index = container.children().length;
            
            const valueHtml = `
                <div class="core-value-horizontal" data-index="${index}">
                    <div class="core-value-header">
                        <div class="core-value-content">
                            <input type="text" class="form-control core-value-name mb-2" placeholder="Core value name">
                            <textarea class="form-control core-value-description" rows="3" placeholder="Core value description"></textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-core-value">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            container.append(valueHtml);
            
            // Add event listener for remove button
            container.find('.remove-core-value').last().on('click', function() {
                $(this).closest('.core-value-horizontal').remove();
            });
        });
    }

    // Delete hymn audio
    function deleteHymnAudio() {
        if (!confirm('Are you sure you want to delete the hymn audio?')) {
            return;
        }
        
        const aboutData = JSON.parse(localStorage.getItem('aboutUsData')) || {};
        if (aboutData.hymn) {
            aboutData.hymn.audio = null;
            saveAboutUsData(aboutData);
        }
    }

    // Initialize form submissions
    function initFormSubmissions() {
        // History form
        $('#history-form').on('submit', function(e) {
            e.preventDefault();
            
            const aboutData = JSON.parse(localStorage.getItem('aboutUsData')) || {};
            aboutData.history = aboutData.history || {};
            aboutData.history.content = $('#history-content').val();
            
            saveAboutUsData(aboutData);
        });
        
        // VMGO form
        $('#vmgo-form').on('submit', function(e) {
            e.preventDefault();
            
            const aboutData = JSON.parse(localStorage.getItem('aboutUsData')) || {};
            aboutData.vmgo = aboutData.vmgo || {};
            
            // Save vision and mission
            aboutData.vmgo.vision = $('#vision-content').val();
            aboutData.vmgo.mission = $('#mission-content').val();
            
            // Save goals
            const goals = [];
            $('.goal-item').each(function() {
                const goalText = $(this).find('.goal-text').val().trim();
                if (goalText) {
                    goals.push(goalText);
                }
            });
            aboutData.vmgo.goals = goals;
            
            // Save core values
            const coreValues = [];
            $('.core-value-horizontal').each(function() {
                const name = $(this).find('.core-value-name').val().trim();
                const description = $(this).find('.core-value-description').val().trim();
                
                if (name && description) {
                    coreValues.push({
                        name: name,
                        description: description
                    });
                }
            });
            aboutData.vmgo.coreValues = coreValues;
            
            saveAboutUsData(aboutData);
        });
        
        // Hymn form
        $('#hymn-form').on('submit', function(e) {
            e.preventDefault();
            
            const aboutData = JSON.parse(localStorage.getItem('aboutUsData')) || {};
            aboutData.hymn = aboutData.hymn || {};
            
            // Save lyrics
            aboutData.hymn.verse1 = $('#verse1-content').val();
            aboutData.hymn.chorus = $('#chorus-content').val();
            aboutData.hymn.finale = $('#finale-content').val();
            
            // Handle audio upload
            const audioFile = $('#hymn-audio')[0].files[0];
            if (audioFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    aboutData.hymn.audio = e.target.result;
                    saveAboutUsData(aboutData);
                };
                reader.readAsDataURL(audioFile);
            } else {
                saveAboutUsData(aboutData);
            }
        });
    }

    // Initialize responsive design checks
    function initResponsiveChecks() {
        console.log('Initializing responsive design checks...');
        
        // Check screen size on load
        checkScreenSize();
        
        // Check screen size on resize
        $(window).on('resize', function() {
            checkScreenSize();
        });
    }
    
    function checkScreenSize() {
        const width = $(window).width();
        console.log(`Screen width: ${width}px`);
        
        if (width < 576) {
            console.log('📱 Mobile view activated');
        } else if (width < 768) {
            console.log('📱 Small tablet view activated');
        } else if (width < 992) {
            console.log('💻 Tablet view activated');
        } else if (width < 1200) {
            console.log('💻 Small desktop view activated');
        } else {
            console.log('🖥️ Large desktop view activated');
        }
    }

    // Initialize the page
    initializePage();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});