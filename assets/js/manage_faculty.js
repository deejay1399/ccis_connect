// Manage Faculty JavaScript

$(document).ready(function() {
    console.log('Manage Faculty page loading...');
    
    // Delete functionality variables
    let currentDeleteIndex = null;
    
    // Enhanced session check matching list_users.js
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
    
    // Initialize page
    function initializePage() {
        if (!checkSuperAdminSession()) {
            return;
        }
        
        // Setup public site link
        setupPublicSiteLink();
        
        // Initialize date display
        updateCurrentDate();
        
        // Load faculty data
        loadFacultyData();
        
        // Initialize UI components
        initImageUpload();
        initEditImageUpload();
        initAddFacultyForm();
        initResponsiveChecks();
        
        // Remove any Return to Dashboard links
        removeReturnToDashboard();
        
        console.log('🎯 Manage Faculty Page initialized successfully');
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
    
    // Date Display Function - Same as list_users.js
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

    // Load current faculty data
    function loadFacultyData() {
        console.log('Loading faculty data...');
        
        // Load from localStorage or initialize with default data
        let facultyData;
        try {
            const storedData = localStorage.getItem('facultyData');
            facultyData = storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            console.error('Error parsing stored data:', error);
            facultyData = [];
        }
        
        // Ensure faculty data exists with default values
        if (!Array.isArray(facultyData) || facultyData.length === 0) {
            facultyData = [
                {
                    name: "Dr. Shella C. Olaguir",
                    position: "Dean, College of Computing and Information Sciences",
                    image: null
                }
            ];
        }
        
        // Display faculty list
        displayFacultyList(facultyData);
        
        console.log('Faculty data loaded successfully');
        return facultyData;
    }

    // Display faculty list
    function displayFacultyList(faculty) {
        const facultyList = $('#faculty-list');
        facultyList.empty();
        
        // Ensure faculty is an array
        if (!Array.isArray(faculty)) {
            faculty = [];
        }
        
        if (faculty.length === 0) {
            facultyList.html('<p class="text-muted text-center py-3">No faculty members added yet.</p>');
            return;
        }
        
        faculty.forEach((member, index) => {
            const facultyCard = `
                <div class="col-md-6 col-lg-4">
                    <div class="faculty-card" data-index="${index}">
                        <div class="faculty-image">
                            <img src="${member.image || 'https://via.placeholder.com/300x300/4b0082/ffffff?text=NO+IMAGE'}" alt="${member.name || 'Faculty Member'}" onerror="this.src='https://via.placeholder.com/300x300/4b0082/ffffff?text=NO+IMAGE'">
                        </div>
                        <div class="faculty-info">
                            <h4>${member.name || 'Unknown Name'}</h4>
                            <p class="faculty-position">${member.position || 'No Position'}</p>
                            <div class="faculty-actions">
                                <button class="btn btn-sm edit-faculty-btn edit-faculty" data-index="${index}">
                                    Edit
                                </button>
                                <button class="btn btn-sm delete-faculty-btn delete-faculty" data-index="${index}">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            facultyList.append(facultyCard);
        });
        
        // Add event listeners for edit and delete buttons
        $('.edit-faculty').off('click').on('click', function() {
            const index = $(this).data('index');
            editFacultyMember(index);
        });
        
        $('.delete-faculty').off('click').on('click', function() {
            const index = $(this).data('index');
            deleteFacultyMember(index);
        });
    }

    // Save faculty data to localStorage
    function saveFacultyData(facultyData) {
        try {
            localStorage.setItem('facultyData', JSON.stringify(facultyData));
            showNotification('Faculty member saved successfully!', 'success');
            
            // Update display
            displayFacultyList(facultyData);
        } catch (error) {
            console.error('Error saving data:', error);
            showNotification('Error saving changes!', 'error');
        }
    }

    // Initialize image upload functionality
    function initImageUpload() {
        console.log('Initializing image upload...');
        
        const uploadArea = $('#image-upload-area');
        const fileInput = $('#faculty-image');
        const preview = $('#faculty-image-preview');
        
        // Create a proper file input wrapper
        const fileInputWrapper = $('<div class="image-upload-wrapper position-relative"></div>');
        fileInput.wrap(fileInputWrapper);
        
        // Proper click handling for upload area
        uploadArea.on('click', function(e) {
            console.log('Upload area clicked - opening file dialog');
            fileInput.trigger('click');
        });
        
        // File input change handler
        fileInput.on('change', function(e) {
            const file = e.target.files[0];
            console.log('File selected:', file);
            
            if (file) {
                handleImageFile(file, preview, uploadArea);
            }
        });
        
        // Drag and drop functionality
        uploadArea.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.addClass('dragover');
        });
        
        uploadArea.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.removeClass('dragover');
        });
        
        uploadArea.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.removeClass('dragover');
            
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                console.log('File dropped:', file);
                
                if (file && file.type.match('image.*')) {
                    handleImageFile(file, preview, uploadArea);
                    
                    // Update the file input
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput[0].files = dt.files;
                } else {
                    showNotification('Please drop a valid image file (JPG, PNG).', 'error');
                }
            }
        });
    }

    // Initialize edit image upload functionality
    function initEditImageUpload() {
        console.log('Initializing edit image upload...');
        
        const uploadArea = $('#edit-image-upload-area');
        const fileInput = $('#edit-faculty-image');
        const preview = $('#edit-faculty-image-preview');
        
        // Create a proper file input wrapper
        const fileInputWrapper = $('<div class="image-upload-wrapper position-relative"></div>');
        fileInput.wrap(fileInputWrapper);
        
        // Proper click handling
        uploadArea.on('click', function(e) {
            console.log('Edit upload area clicked');
            fileInput.trigger('click');
        });
        
        // File selection
        fileInput.on('change', function(e) {
            const file = e.target.files[0];
            console.log('Edit file selected:', file);
            
            if (file) {
                handleImageFile(file, preview, uploadArea);
            }
        });
        
        // Drag and drop functionality
        uploadArea.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.addClass('dragover');
        });
        
        uploadArea.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.removeClass('dragover');
        });
        
        uploadArea.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.removeClass('dragover');
            
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                console.log('Edit file dropped:', file);
                
                if (file && file.type.match('image.*')) {
                    handleImageFile(file, preview, uploadArea);
                    
                    // Update the file input
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput[0].files = dt.files;
                } else {
                    showNotification('Please drop a valid image file (JPG, PNG).', 'error');
                }
            }
        });
    }

    // Helper function to handle image files
    function handleImageFile(file, preview, uploadArea) {
        // Validate file type and size
        if (!file.type.match('image.*')) {
            showNotification('Please select a valid image file (JPG, PNG).', 'error');
            return false;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image size must be less than 2MB.', 'error');
            return false;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.attr('src', e.target.result);
            preview.removeClass('d-none');
            uploadArea.addClass('d-none');
            console.log('Image preview updated');
        };
        reader.onerror = function() {
            showNotification('Error reading the image file.', 'error');
        };
        reader.readAsDataURL(file);
        return true;
    }

    // Initialize add faculty form
    function initAddFacultyForm() {
        console.log('Initializing add faculty form...');
        
        $('#add-faculty-form').on('submit', function(e) {
            e.preventDefault();
            console.log('Add faculty form submitted');
            
            const name = $('#faculty-name').val().trim();
            const position = $('#faculty-position').val().trim();
            const imageFile = $('#faculty-image')[0].files[0];
            
            console.log('Form data:', { name, position, hasImage: !!imageFile });
            
            if (!name || !position) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Get current data
            const facultyData = JSON.parse(localStorage.getItem('facultyData')) || [];
            
            // Create new faculty member
            const newFaculty = {
                name: name,
                position: position,
                image: null
            };
            
            console.log('New faculty object created:', newFaculty);
            
            // Handle image if uploaded
            if (imageFile) {
                console.log('Processing image file...');
                const reader = new FileReader();
                reader.onload = function(e) {
                    newFaculty.image = e.target.result;
                    console.log('Image processed, adding faculty member...');
                    
                    // Add to faculty list
                    facultyData.push(newFaculty);
                    
                    // Save data
                    saveFacultyData(facultyData);
                    
                    // Reset form
                    resetFacultyForm();
                    console.log('Faculty member added successfully with image');
                };
                reader.onerror = function() {
                    showNotification('Error reading the image file.', 'error');
                };
                reader.readAsDataURL(imageFile);
            } else {
                console.log('No image, adding faculty member directly...');
                // Add to faculty list
                facultyData.push(newFaculty);
                
                // Save data
                saveFacultyData(facultyData);
                
                // Reset form
                resetFacultyForm();
                console.log('Faculty member added successfully without image');
            }
        });
    }

    // Helper function to reset faculty form
    function resetFacultyForm() {
        $('#faculty-name').val('');
        $('#faculty-position').val('');
        $('#faculty-image').val('');
        $('#faculty-image-preview').addClass('d-none');
        $('#image-upload-area').removeClass('d-none');
    }

    // Edit faculty member
    function editFacultyMember(index) {
        const facultyData = JSON.parse(localStorage.getItem('facultyData')) || [];
        const member = facultyData[index];
        
        if (!member) {
            showNotification('Faculty member not found.', 'error');
            return;
        }
        
        // Populate modal
        $('#edit-faculty-index').val(index);
        $('#edit-faculty-name').val(member.name || '');
        $('#edit-faculty-position').val(member.position || '');
        
        // Handle image
        if (member.image) {
            $('#edit-faculty-image-preview').attr('src', member.image);
            $('#edit-faculty-image-preview').removeClass('d-none');
            $('#edit-image-upload-area').addClass('d-none');
        } else {
            $('#edit-faculty-image-preview').addClass('d-none');
            $('#edit-image-upload-area').removeClass('d-none');
        }
        
        // Show modal
        $('#editFacultyModal').modal('show');
    }

    // Save faculty changes
    $('#save-faculty-changes').on('click', function() {
        const index = $('#edit-faculty-index').val();
        const name = $('#edit-faculty-name').val().trim();
        const position = $('#edit-faculty-position').val().trim();
        const imageFile = $('#edit-faculty-image')[0].files[0];
        
        if (!name || !position) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Get current data
        const facultyData = JSON.parse(localStorage.getItem('facultyData')) || [];
        
        if (!facultyData[index]) {
            showNotification('Faculty member not found.', 'error');
            return;
        }
        
        // Update faculty member
        facultyData[index].name = name;
        facultyData[index].position = position;
        
        // Handle image if uploaded
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                facultyData[index].image = e.target.result;
                saveFacultyData(facultyData);
                $('#editFacultyModal').modal('hide');
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveFacultyData(facultyData);
            $('#editFacultyModal').modal('hide');
        }
    });

    // Delete faculty member with enhanced confirmation
    function deleteFacultyMember(index) {
        const facultyData = JSON.parse(localStorage.getItem('facultyData')) || [];
        const member = facultyData[index];
        
        if (!member) {
            showNotification('Faculty member not found.', 'error');
            return;
        }
        
        // Store the index for deletion
        currentDeleteIndex = index;
        
        // Show the confirmation modal
        $('#confirmationModal').modal('show');
    }

    // Handle the actual deletion when confirmed
    $('#confirmActionBtn').on('click', function() {
        if (currentDeleteIndex === null) return;
        
        const facultyData = JSON.parse(localStorage.getItem('facultyData')) || [];
        const memberName = facultyData[currentDeleteIndex]?.name || 'Faculty Member';
        
        if (facultyData[currentDeleteIndex]) {
            // Remove the faculty member
            facultyData.splice(currentDeleteIndex, 1);
            
            // Save the updated data
            saveFacultyData(facultyData);
            
            // Show success message
            showNotification(`Faculty member "${memberName}" has been removed successfully.`, 'success');
            
            // Close the modal
            $('#confirmationModal').modal('hide');
            
            // Reset the index
            currentDeleteIndex = null;
        }
    });

    // Reset the delete index when modal is closed
    $('#confirmationModal').on('hidden.bs.modal', function() {
        currentDeleteIndex = null;
    });

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