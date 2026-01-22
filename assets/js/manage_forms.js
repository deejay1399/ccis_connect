// MANAGE FORMS - SUPER ADMIN JAVASCRIPT - UPDATED VERSION

$(document).ready(function() {
    console.log('🔐 Manage Forms Page Loading...');
    
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
        
        // Load forms data
        loadFormsData();
        
        // Initialize form handlers
        initializeFormHandlers();
        
        // Remove any Return to Dashboard links multiple times to ensure removal
        removeReturnToDashboard();
        
        console.log('🎯 Manage Forms Page initialized successfully');
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
    
    // Initial forms data matching user_side forms
    const initialForms = [
        { id: 'form-1', title: 'Application Form for Entrance Examination' },
        { id: 'form-2', title: 'Exit Form' },
        { id: 'form-3', title: 'Parent\'s/Guardian Consent Form' },
        { id: 'form-4', title: 'Internship Agreement (BSCS)' },
        { id: 'form-5', title: 'Parent Consent OJT' },
        { id: 'form-6', title: 'Student Information Form' },
        { id: 'form-7', title: 'Shiftee Form' },
        { id: 'form-8', title: 'Adding/Dropping Forms' }
    ];

    // Load forms from local storage or use initial data
    let forms = JSON.parse(localStorage.getItem('forms')) || initialForms;
    localStorage.setItem('forms', JSON.stringify(forms));

    // Render forms to the page
    function renderForms() {
        const formsList = $('#forms-list');
        formsList.empty();

        if (forms.length === 0) {
            formsList.append('<div class="col-12 empty-state">No forms available. Please upload a new form.</div>');
            return;
        }

        forms.forEach(form => {
            const formCard = `
                <div class="col">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column">
                            <i class="form-card-icon fas fa-file-pdf"></i>
                            <h5 class="card-title fw-bold">${form.title}</h5>
                            <div class="form-actions mt-auto">
                                <button class="btn btn-primary edit-btn" data-id="${form.id}">
                                    Edit
                                </button>
                                <button class="btn btn-danger remove-btn" data-id="${form.id}">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            formsList.append(formCard);
        });

        // Attach event handlers after rendering
        $('.edit-btn').on('click', handleEdit);
        $('.remove-btn').on('click', handleRemove);
    }

    // Handle form upload
    $('#uploadForm').on('submit', function(e) {
        e.preventDefault();
        
        const formTitle = $('#formTitle').val();
        const formFile = $('#formFile')[0].files[0];
        
        if (!formFile) {
            showNotification('Please select a PDF file', 'error');
            return;
        }
        
        if (formFile.type !== 'application/pdf') {
            showNotification('Please select a PDF file only', 'error');
            return;
        }

        const newForm = {
            id: 'form-' + Date.now(),
            title: formTitle
        };

        // For demo purposes, we'll just store the form details
        // In real implementation, you would upload the file to server
        forms.push(newForm);
        localStorage.setItem('forms', JSON.stringify(forms));
        renderForms();
        showNotification('Form uploaded successfully!', 'success');
        this.reset();
    });

    // Handle edit button click
    function handleEdit() {
        const formId = $(this).data('id');
        const formToEdit = forms.find(form => form.id === formId);
        
        if (formToEdit) {
            $('#editFormId').val(formId);
            $('#editFormTitle').val(formToEdit.title);
            $('#editFormFile').val(''); // Reset file input
            
            const editModal = new bootstrap.Modal(document.getElementById('editFormModal'));
            editModal.show();
        }
    }

    // Handle save changes button in modal
    $('#editFormDetails').on('submit', function(e) {
        e.preventDefault();
        
        const formId = $('#editFormId').val();
        const updatedTitle = $('#editFormTitle').val();
        const updatedFile = $('#editFormFile')[0].files[0];
        
        // Check if a new file was selected
        if (updatedFile && updatedFile.type !== 'application/pdf') {
            showNotification('Please select a PDF file only', 'error');
            return;
        }

        const updatedForms = forms.map(form => {
            if (form.id === formId) {
                return {
                    ...form,
                    title: updatedTitle
                    // In a real implementation, you would update the file here
                };
            }
            return form;
        });

        forms = updatedForms;
        localStorage.setItem('forms', JSON.stringify(forms));
        renderForms();
        
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editFormModal'));
        editModal.hide();
        showNotification('Form updated successfully!', 'success');
    });

    // Handle remove button click
    function handleRemove() {
        const formId = $(this).data('id');
        $('#confirmRemoveBtn').data('id', formId);
        
        const removeModal = new bootstrap.Modal(document.getElementById('removeFormModal'));
        removeModal.show();
    }

    // Handle confirm remove button in modal
    $('#confirmRemoveBtn').on('click', function() {
        const formId = $(this).data('id');
        forms = forms.filter(form => form.id !== formId);
        localStorage.setItem('forms', JSON.stringify(forms));
        renderForms();
        
        const removeModal = bootstrap.Modal.getInstance(document.getElementById('removeFormModal'));
        removeModal.hide();
        showNotification('Form removed successfully!', 'success');
    });

    // Notification function
    function showNotification(message, type) {
        $('.alert').alert('close');
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const className = type === 'success' ? 'alert-success' : 'alert-danger';
        
        const alertHtml = `
            <div class="alert ${className} alert-dismissible fade show fixed-top m-3 shadow" role="alert" style="z-index: 1060; max-width: 400px; left: auto; right: 20px; top: 20px;">
                <i class="fas ${icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $('body').append(alertHtml);
        
        setTimeout(() => {
            $('.alert').alert('close');
        }, 4000);
    }

    function loadFormsData() {
        renderForms();
    }

    function initializeFormHandlers() {
        // Handlers are attached in renderForms()
    }

    // Initialize when document is ready
    initializePage();
    
    // Update date every minute
    setInterval(updateCurrentDate, 60000);
    
    // Run cleanup multiple times to ensure removal
    setTimeout(removeReturnToDashboard, 500);
    setTimeout(removeReturnToDashboard, 1000);
    setTimeout(removeReturnToDashboard, 2000);
});