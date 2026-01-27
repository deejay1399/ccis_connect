// MANAGE HOMEPAGE - SUPER ADMIN JAVASCRIPT - COMPLETE VERSION

$(document).ready(function() {
    console.log('🔐 Manage Homepage Loading...');
    
    // Enhanced session check for Super Admin
    function checkSuperAdminSession() {
        const session = window.checkUserSession(); // Use global checkUserSession
        
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
        
        // Session is valid and user is superadmin
        console.log('✅ Super Admin session confirmed:', session.user.name);
        
        // Update UI with admin info
        updateAdminUI(session.user);
        
        return true;
    }
    
    function updateAdminUI(user) {
        // Update user name and role
        $('#user-name').text(user.name);
        $('#user-role').text(user.role);
        
        console.log('👤 UI updated for:', user.name);
    }
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        // Setup logout handler (now in header)
        setupLogoutHandler();
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        
        // Initialize homepage management
        initializeHomepageManagement();
        
        console.log('🎯 Manage Homepage Page initialized successfully');
    }
    
    // Function to setup logout handler (header icon)
    function setupLogoutHandler() {
        $('#logout-icon-link').on('click', function(e) {
            e.preventDefault();
            showConfirmationDialog(
                'Confirm Logout',
                'Are you sure you want to logout?',
                function() {
                    // Clear session and redirect to login
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');
                    showNotification('Logged out successfully', 'success');
                    setTimeout(() => {
                        window.location.href = '../login.html';
                    }, 1500);
                }
            );
        });
    }

    // Function to handle the "View Public Site" link
    function setupPublicSiteLink() {
        const publicSiteLink = $('#view-public-site-link');
        if (publicSiteLink.length) {
            // Determine the relative path to the admin dashboard for the return button
            const dashboardUrl = 'super_admin/index.html';
                                 
            publicSiteLink.on('click', function(e) {
                // Store the current dashboard URL in local storage
                localStorage.setItem('admin_return_url', dashboardUrl);
                sessionStorage.setItem('admin_return_url', dashboardUrl); // Use both for redundancy
                console.log(`🔗 Storing return URL: ${dashboardUrl}`);
                // Continue with navigation
            });
        }
    }
    
    // FUNCTION TO REMOVE RETURN TO DASHBOARD LINKS
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

    // --- Data Stores ---
    let programs = JSON.parse(localStorage.getItem('academicPrograms')) || [
        { 
            id: 1, 
            title: "BS Computer Science", 
            description: "Focuses on the fundamentals of computing and theoretical science.", 
            features: ["Software Development", "Algorithm Design", "Artificial Intelligence"] 
        },
        { 
            id: 2, 
            title: "BS Information Technology", 
            description: "Emphasizes practical application of technology to solve business problems.", 
            features: ["Network Administration", "Web Development", "Database Management"] 
        }
    ];
    
    let carouselImages = JSON.parse(localStorage.getItem('carouselImages')) || [
        { id: 101, url: 'https://via.placeholder.com/320x180?text=Highlight+1', caption: 'Sample Image 1' },
        { id: 102, url: 'https://via.placeholder.com/320x180?text=Highlight+2', caption: 'Sample Image 2' }
    ];
    
    const welcomeMessageKey = 'homepageWelcomeMessage';
    let welcomeMessage = JSON.parse(localStorage.getItem(welcomeMessageKey)) || {
        title: "Welcome to CCIS",
        text: "The College of Computing and Information Sciences (CCIS) is dedicated to fostering excellence in the digital realm. Join us in shaping the future of technology!"
    };

    // --- Core Helper Function: Notification (Refined) ---
    function showCustomNotification(message, type) {
        const icon = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle';
        const className = type === 'success' ? 'alert-success' : type === 'warning' ? 'alert-warning' : 'alert-danger';
        
        // Remove any previous alerts to prevent stacking/visual clutter
        $('.custom-alert-notification').remove(); 

        const alertHtml = `
            <div class="alert ${className} alert-dismissible fade show fixed-top m-3 shadow custom-alert-notification" 
                 role="alert" style="z-index: 1060; max-width: 400px; left: auto;">
                <i class="fas ${icon} me-2"></i>
                <span class="fw-bold text-capitalize">${type}!</span> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        $('body').append(alertHtml);
        
        // Auto-close after 4 seconds
        setTimeout(() => {
            $('.custom-alert-notification').alert('close');
        }, 4000);
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

    // --- UPDATED: Enhanced Confirmation Dialog - No icons, text-only buttons ---
    function showConfirmationDialog(title, message, confirmCallback) {
        // Update modal content
        $('#confirmationModalLabel').text(title);
        $('#confirmationModalBody').text(message);
        
        // Remove any icons from buttons
        const confirmBtn = $('#confirmActionBtn');
        confirmBtn.html('Remove'); // Just text, no icon
        confirmBtn.removeClass('btn-warning').addClass('btn-danger');
        
        const cancelBtn = $('.modal-footer .btn-secondary');
        cancelBtn.html('Cancel'); // Just text, no icon
        
        // Clear previous handlers and set new one
        confirmBtn.off('click').on('click', function() {
            confirmCallback();
            bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
        });
        
        // Show modal
        new bootstrap.Modal(document.getElementById('confirmationModal')).show();
    }

    // =====================================
    // 1. HIGHLIGHTS CAROUSEL MANAGEMENT
    // =====================================

    const renderCarouselImageCard = (image) => `
        <div class="image-card" data-id="${image.id}">
            <img src="${image.url}" alt="${image.caption || 'Carousel Image'}">
            <div class="image-overlay">
                <p class="mb-0 text-truncate">${image.caption || 'No Caption'}</p>
            </div>
            <div class="image-actions">
                <button class="btn btn-action btn-remove remove-carousel-image-btn" data-id="${image.id}" title="Remove Image">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    function loadCarouselImages() {
        const container = $('#carousel-images-grid');
        container.empty();
        if (carouselImages.length === 0) {
            container.append(`<div class="col-12 text-center text-muted py-2">No images uploaded yet.</div>`);
        } else {
            carouselImages.forEach(image => container.append(renderCarouselImageCard(image)));
        }
        $('#image-count').text(carouselImages.length);
    }
    
    $('#carousel-upload').on('change', handleCarouselUpload);

    function handleCarouselUpload(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        let filesProcessed = 0;
        Array.from(files).forEach(file => {
            if (file.size > 5 * 1024 * 1024) { 
                showCustomNotification(`File "${file.name}" is too large (Max 5MB).`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = {
                    id: Date.now() + filesProcessed++, 
                    url: e.target.result, 
                    caption: file.name.split('.')[0]
                };
                carouselImages.push(newImage);
                loadCarouselImages();
                showCustomNotification(`Image "${newImage.caption}" uploaded temporarily. Click "Save" to finalize.`, 'warning');
            };
            reader.readAsDataURL(file);
        });
        e.target.value = null; 
    }

    // Handle drag and drop for image upload
    $('.image-upload-zone').on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('hover');
    }).on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('hover');
    }).on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('hover');
        const files = e.originalEvent.dataTransfer.files;
        if (files.length) {
            $('#carousel-upload')[0].files = files;
            handleCarouselUpload({ target: $('#carousel-upload')[0] });
        }
    });

    $(document).on('click', '.remove-carousel-image-btn', function() {
        const id = parseInt($(this).data('id'));
        showRemoveImageConfirmation(id);
    });

    function showRemoveImageConfirmation(id) {
        showConfirmationDialog(
            'Remove Image', 
            'Are you sure you want to remove this image?',
            function() { removeCarouselImage(id); }
        );
    }

    function removeCarouselImage(id) {
        carouselImages = carouselImages.filter(img => img.id !== id);
        loadCarouselImages();
        showCustomNotification('Image removed from grid. Click Save to make it permanent.', 'warning');
    }

    // FIXED: Global function called by the button in HTML - NOW WORKING PROPERLY
    window.saveCarouselChanges = function() {
        console.log('🖼️ Save Carousel Changes button clicked');
        
        // Validate that there are images to save
        if (carouselImages.length === 0) {
            showCustomNotification('Please upload at least one image before saving.', 'error');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
        
        // Show success notification
        showCustomNotification('Highlights carousel updated successfully!', 'success');
        
        console.log('✅ Carousel images saved:', carouselImages);
        
        // Reset button to light gray after save
        setTimeout(() => {
            $('#save-carousel-btn').blur();
        }, 500);
        
        return false; // Prevent default form submission
    }

    // =====================================
    // 2. WELCOME MESSAGE MANAGEMENT
    // =====================================

    function loadWelcomeMessage() {
        $('#welcome-title').val(welcomeMessage.title);
        $('#welcome-text').val(welcomeMessage.text);
    }

    // Global function called by the Save button in HTML
    window.saveWelcomeMessage = function() {
        console.log('💬 Save Welcome Message button clicked');
        
        // Validate inputs
        const title = $('#welcome-title').val().trim();
        const text = $('#welcome-text').val().trim();
        
        if (!title || !text) {
            showCustomNotification('Please fill in both title and message fields.', 'error');
            return;
        }
        
        welcomeMessage.title = title;
        welcomeMessage.text = text;
        localStorage.setItem(welcomeMessageKey, JSON.stringify(welcomeMessage));
        showCustomNotification('Welcome Message updated successfully!', 'success');
        
        // Reset button to light gray after save
        setTimeout(() => {
            $('#save-welcome-btn').blur();
        }, 500);
        
        return false; // Prevent default form submission
    }

    // Global function called by the Clear button in HTML
    window.showClearWelcomeMessageConfirmation = function() {
        showConfirmationDialog(
            'Clear Welcome Message', 
            'Are you sure you want to clear the Welcome Message content? This will reset the title and text to blank.',
            clearWelcomeMessage
        );
    }
    
    function clearWelcomeMessage() {
        welcomeMessage.title = "";
        welcomeMessage.text = "";
        localStorage.setItem(welcomeMessageKey, JSON.stringify(welcomeMessage));
        loadWelcomeMessage();
        showCustomNotification('Welcome Message cleared successfully!', 'success');
    }

    // =====================================
    // 3. ACADEMIC PROGRAMS MANAGEMENT
    // =====================================

    const renderProgramCard = (program) => {
        let featuresHtml = program.features.map((feature, index) => `
            <div class="feature-input-group" data-index="${index}">
                <input type="text" class="form-control feature-input" value="${feature}" placeholder="Program feature" data-program-id="${program.id}">
                <button type="button" class="btn btn-sm btn-remove-feature" onclick="removeFeature(${program.id}, ${index})">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        `).join('');

        return `
            <div class="program-card fade-in-up" data-id="${program.id}">
                <div class="program-header">
                    <h4 class="program-title">${program.title || 'New Program'}</h4>
                    <div class="actions">
                        <button class="btn btn-sm remove-program-btn" data-id="${program.id}" title="Remove Program">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-tag"></i> Program Title</label>
                    <input type="text" class="form-control program-title-input" value="${program.title}" data-program-id="${program.id}" required>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-file-alt"></i> Description</label>
                    <textarea class="form-control program-description-input" rows="2" data-program-id="${program.id}">${program.description}</textarea>
                </div>
                <label class="form-label mt-3"><i class="fas fa-list-ul"></i> Key Features</label>
                <div class="features-container" id="features-container-${program.id}">
                    ${featuresHtml}
                </div>
                <button type="button" class="btn btn-sm btn-outline mt-2" onclick="addFeature(${program.id})">
                    <i class="fas fa-plus me-2"></i>Add Feature
                </button>
            </div>
        `;
    };
    
    function renderPrograms() {
        const container = $('#programs-container');
        container.empty();
        if (programs.length === 0) {
            container.append(`<p class="text-center text-muted py-4">No academic programs have been added yet.</p>`);
        } else {
            programs.forEach(program => container.append(renderProgramCard(program)));
        }
    }

    // Global function to add a new program card
    window.addNewProgram = function() {
        console.log('➕ Add New Program button clicked');
        
        const newProgram = {
            id: Date.now(),
            title: "New Academic Program",
            description: "A brief description of the program.",
            features: ["Feature 1"]
        };
        programs.push(newProgram);
        renderPrograms();
        showCustomNotification('New program card added. Remember to save changes.', 'warning');
        
        // Reset button to light gray after click
        setTimeout(() => {
            $('#add-program-btn').blur();
        }, 500);
    }

    // Global function to add a feature to a program
    window.addFeature = function(programId) {
        console.log('➕ Add Feature button clicked for program:', programId);
        
        const program = programs.find(p => p.id === programId);
        if (program) {
            program.features.push("New Feature");
            renderPrograms(); 
            showCustomNotification('Feature added. Click "Save" to finalize.', 'warning');
        }
    }

    // Global function to remove a feature
    window.removeFeature = function(programId, featureIndex) {
        console.log('➖ Remove Feature button clicked');
        
        const program = programs.find(p => p.id === programId);
        if (program && program.features[featureIndex] !== undefined) {
            showConfirmationDialog(
                'Remove Feature',
                'Are you sure you want to remove this feature?',
                function() {
                    program.features.splice(featureIndex, 1);
                    renderPrograms(); 
                    showCustomNotification('Feature removed. Click "Save" to finalize.', 'warning');
                }
            );
        }
    }

    $(document).on('click', '.remove-program-btn', function() {
        const id = parseInt($(this).data('id'));
        showRemoveProgramConfirmation(id);
    });

    function showRemoveProgramConfirmation(id) {
        const program = programs.find(p => p.id === id);
        const programName = program ? program.title : 'this program';
        
        showConfirmationDialog(
            'Delete Program',
            `Are you sure you want to delete the "${programName}" program? This action cannot be undone.`,
            function() { removeProgram(id); }
        );
    }

    function removeProgram(id) {
        programs = programs.filter(p => p.id !== id);
        renderPrograms();
        showCustomNotification('Program removed. Click Save to make this permanent.', 'warning');
    }

    // Global function to save all program data
    window.saveAllPrograms = function() {
        console.log('💾 Save All Programs button clicked');
        
        let isValid = true;
        let updatedPrograms = [];

        $('.program-card').each(function() {
            const card = $(this);
            const programId = parseInt(card.data('id'));
            
            const title = card.find('.program-title-input').val().trim();
            const description = card.find('.program-description-input').val().trim();
            let features = [];

            card.find('.feature-input').each(function() {
                const featureValue = $(this).val().trim();
                if (featureValue) {
                    features.push(featureValue);
                }
            });

            if (!title || !description || features.length === 0) {
                isValid = false;
                card.css('border-color', 'var(--danger)');
                return false; 
            }

            updatedPrograms.push({
                id: programId,
                title: title,
                description: description,
                features: features
            });
            card.css('border-color', '#e9ecef'); 
        });

        if (!isValid) {
            showCustomNotification('Please fill in ALL required fields (Title, Description, and at least one Feature) for every program card.', 'error');
            return;
        }
        
        programs = updatedPrograms;
        localStorage.setItem('academicPrograms', JSON.stringify(programs));
        renderPrograms(); 
        showCustomNotification('Academic Programs updated successfully!', 'success');
        
        // Reset button to light gray after save
        setTimeout(() => {
            $('#save-programs-btn').blur();
        }, 500);
        
        return false; // Prevent default form submission
    }

    // --- Initialize Homepage Management ---

    function initializeHomepageManagement() {
        loadWelcomeMessage();
        loadCarouselImages();
        renderPrograms();
        
        // Initialize Homepage Form Handler
        setupHomepageFormHandler();
        
        console.log('✅ Homepage Management Initialized with full functionality.');
    }

    // =====================================
    // HOMEPAGE FORM MANAGEMENT
    // =====================================

    const baseURL = window.location.origin + '/ccis_connect/';

    function setupHomepageFormHandler() {
        console.log('📝 Initializing homepage form handler...');
        
        // Form starts empty for fresh uploads - no auto-load
        
        // Handle form submission
        $('#homepage-form').off('submit').on('submit', function(e) {
            console.log('📝 Form submit event triggered');
            e.preventDefault();
            e.stopPropagation();
            
            const title = $('#homepageTitle').val().trim();
            const content = $('#homepageContent').val().trim();
            const fileInput = document.getElementById('homepageBanner');
            const file = fileInput ? fileInput.files[0] : null;
            
            // Validation
            if (!title) {
                showModalNotification('Validation Error', 'Please enter a homepage title', 'error');
                return false;
            }
            
            if (!content) {
                showModalNotification('Validation Error', 'Please enter homepage content', 'error');
                return false;
            }
            
            console.log('✅ Form validation passed');
            
            // Submit form
            submitHomepageForm(title, content, file);
            return false;
        });
        
        // Handle file input change for preview
        $('#homepageBanner').on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = `<img src="${event.target.result}" style="max-width: 300px; margin-top: 10px; border-radius: 5px;">`;
                    $('#banner-preview').html(preview);
                };
                reader.readAsDataURL(file);
            }
        });
        
        console.log('✅ Homepage form handler initialized');
    }

    function loadHomepageData() {
        console.log('📥 Loading homepage data from database...');
        
        $.ajax({
            url: baseURL + 'admin/manage/load_homepage',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('✅ Data loaded successfully:', response);
                
                if (response.success && response.data) {
                    $('#homepageTitle').val(response.data.title || '');
                    $('#homepageContent').val(response.data.content || '');
                    
                    if (response.data.banner_image) {
                        const preview = `<img src="${baseURL}${response.data.banner_image}" style="max-width: 300px; margin-top: 10px; border-radius: 5px;">`;
                        $('#banner-preview').html(preview);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.warn('⚠️ Could not load homepage data (expected on first use):', error);
            }
        });
    }

    function submitHomepageForm(title, content, file) {
        console.log('📤 Submitting homepage form...');
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        if (file) {
            console.log('📎 File attached:', file.name);
            formData.append('banner_image', file);
        }
        
        $.ajax({
            url: baseURL + 'admin/manage/save_homepage',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('✅ Response received:', response);
                
                if (response.success) {
                    showModalNotification('Success!', 'Homepage content has been saved successfully.', 'success');
                    
                    // Clear form fields after 1 second
                    setTimeout(function() {
                        $('#homepageTitle').val('');
                        $('#homepageContent').val('');
                        $('#homepageBanner').val('');
                        $('#banner-preview').html('');
                        console.log('🧹 Form fields cleared');
                    }, 1000);
                } else {
                    showModalNotification('Error', response.message || 'Failed to save homepage', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('❌ AJAX Error:', error);
                let errorMsg = 'Failed to save homepage: ' + error;
                
                // Try to parse error response
                if (xhr.responseText) {
                    try {
                        let jsonResponse = JSON.parse(xhr.responseText);
                        if (jsonResponse.message) {
                            errorMsg = jsonResponse.message;
                        }
                    } catch(e) {
                        console.log('Could not parse error response');
                    }
                }
                
                showModalNotification('Error', errorMsg, 'error');
            }
        });
    }

    function showModalNotification(title, message, type = 'info') {
        console.log('📢 Showing modal: ' + title);
        
        const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        const modalHTML = `
            <div id="notificationModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; border-radius: 10px; padding: 30px; max-width: 400px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <i class="fas ${icon}" style="font-size: 40px; color: ${bgColor}; margin-bottom: 15px;"></i>
                    <h4 style="color: #333; margin-bottom: 10px;">${title}</h4>
                    <p style="color: #666; margin-bottom: 20px;">${message}</p>
                    <button onclick="window.closeNotificationModal()" style="background: ${bgColor}; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">OK</button>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        $('#notificationModal').remove();
        
        // Add new modal to body
        $('body').append(modalHTML);
        
        // Auto close after 5 seconds
        setTimeout(function() {
            window.closeNotificationModal();
        }, 5000);
    }

    window.closeNotificationModal = function() {
        console.log('🔒 Closing notification modal');
        $('#notificationModal').fadeOut(300, function() {
            $(this).remove();
        });
    }

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        if (this.pathname === window.location.pathname) {
            e.preventDefault();
            const target = $($(this).attr('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 800);
            }
        }
    });
    
    // Initialize the page
    initializePage();
    
    // Update date every minute (in case day changes)
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});