// Program Management
const baseUrl = window.baseUrl || '/ccis_connect/';

document.addEventListener('DOMContentLoaded', function() {
    loadPrograms();
    setupAddProgramForm();
    setupEditProgramForm();
    setupOpportunityHandlers();
});

// Load all programs
function loadPrograms() {
    fetch(baseUrl + 'admin/content/api_get_programs')
        .then(response => response.json())
        .then(data => {
            displayPrograms(data);
        })
        .catch(error => {
            console.error('Error loading programs:', error);
            showNotification('Error loading programs', 'error');
        });
}

// Display programs
function displayPrograms(programs) {
    const container = document.getElementById('programs-list');
    
    if (!Array.isArray(programs) || programs.length === 0) {
        container.innerHTML = '<p class="text-center col-12">No programs available.</p>';
        return;
    }
    
    container.innerHTML = programs.map(program => `
        <div class="col-lg-6 col-md-12">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${program.program_name}</h5>
                    <p class="card-text text-muted mb-2">
                        <i class="fas fa-clock me-2"></i>${program.duration_years} Year(s)
                    </p>
                    <p class="card-text mb-3">${program.description}</p>
                    <div class="mb-3">
                        <strong>Career Opportunities:</strong>
                        <ul class="small mt-2">
                            ${program.career_opportunities.split(',').map(opp => `
                                <li>${opp.trim()}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <button class="btn btn-sm btn-warning" onclick="editProgram(${program.program_id})">
                        <i class="fas fa-edit me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProgram(${program.program_id})">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show notification
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Setup add program form
function setupAddProgramForm() {
    const form = document.getElementById('add-program-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const opportunities = Array.from(document.querySelectorAll('#add-opportunities-container .opportunity-input'))
            .map(input => input.value.trim())
            .filter(val => val);
        
        if (opportunities.length === 0) {
            showNotification('Please add at least one career opportunity', 'error');
            return;
        }
        
        const formData = new FormData();
        formData.append('program_name', document.getElementById('add-program-name').value);
        formData.append('description', document.getElementById('add-description').value);
        formData.append('duration_years', document.getElementById('add-duration-years').value);
        formData.append('career_opportunities', opportunities.join(','));
        
        fetch(baseUrl + 'admin/content/api_save_program', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Program added successfully', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addProgramModal')).hide();
                form.reset();
                resetOpportunitiesAdd();
                loadPrograms();
            } else {
                showNotification(data.message || 'Error adding program', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error adding program', 'error');
        });
    });
}

// Setup edit program form
function setupEditProgramForm() {
    const form = document.getElementById('edit-program-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const opportunities = Array.from(document.querySelectorAll('#edit-opportunities-container .opportunity-input'))
            .map(input => input.value.trim())
            .filter(val => val);
        
        if (opportunities.length === 0) {
            showNotification('Please add at least one career opportunity', 'error');
            return;
        }
        
        const formData = new FormData();
        formData.append('program_id', document.getElementById('edit-program-id').value);
        formData.append('program_name', document.getElementById('edit-program-name').value);
        formData.append('description', document.getElementById('edit-description').value);
        formData.append('duration_years', document.getElementById('edit-duration-years').value);
        formData.append('career_opportunities', opportunities.join(','));
        
        fetch(baseUrl + 'admin/content/api_update_program', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Program updated successfully', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editProgramModal')).hide();
                loadPrograms();
            } else {
                showNotification(data.message || 'Error updating program', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error updating program', 'error');
        });
    });
}

// Edit program
function editProgram(programId) {
    fetch(baseUrl + 'admin/content/api_load_program?id=' + programId)
        .then(response => response.json())
        .then(program => {
            document.getElementById('edit-program-id').value = program.program_id;
            document.getElementById('edit-program-name').value = program.program_name;
            document.getElementById('edit-description').value = program.description;
            document.getElementById('edit-duration-years').value = program.duration_years;
            
            resetOpportunitiesEdit();
            const opportunities = program.career_opportunities.split(',').map(o => o.trim());
            opportunities.forEach((opp, index) => {
                if (index > 0) {
                    addOpportunityFieldEdit();
                }
                const inputs = document.querySelectorAll('#edit-opportunities-container .opportunity-input');
                inputs[index].value = opp;
            });
            
            new bootstrap.Modal(document.getElementById('editProgramModal')).show();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error loading program', 'error');
        });
}

// Delete program
function deleteProgram(programId) {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    const formData = new FormData();
    formData.append('id', programId);
    
    fetch(baseUrl + 'admin/content/api_delete_program', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Program deleted successfully', 'success');
            loadPrograms();
        } else {
            showNotification(data.message || 'Error deleting program', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error deleting program', 'error');
    });
}

// Setup opportunity handlers
function setupOpportunityHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'add-opportunity-btn') {
            addOpportunityFieldAdd();
        }
        if (e.target.id === 'edit-opportunity-btn') {
            addOpportunityFieldEdit();
        }
        if (e.target.closest('.remove-opportunity')) {
            e.target.closest('.opportunity-input-group').remove();
        }
    });
}

// Add opportunity field (Add Modal)
function addOpportunityFieldAdd() {
    const container = document.getElementById('add-opportunities-container');
    const newInput = document.createElement('div');
    newInput.className = 'opportunity-input-group mb-2';
    newInput.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
            <button class="btn btn-outline-danger remove-opportunity" type="button">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(newInput);
}

// Add opportunity field (Edit Modal)
function addOpportunityFieldEdit() {
    const container = document.getElementById('edit-opportunities-container');
    const newInput = document.createElement('div');
    newInput.className = 'opportunity-input-group mb-2';
    newInput.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
            <button class="btn btn-outline-danger remove-opportunity" type="button">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(newInput);
}

// Reset opportunities (Add Modal)
function resetOpportunitiesAdd() {
    const container = document.getElementById('add-opportunities-container');
    container.innerHTML = `
        <div class="opportunity-input-group mb-2">
            <div class="input-group">
                <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
                <button class="btn btn-outline-secondary remove-opportunity" type="button" style="display:none;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// Reset opportunities (Edit Modal)
function resetOpportunitiesEdit() {
    const container = document.getElementById('edit-opportunities-container');
    container.innerHTML = `
        <div class="opportunity-input-group mb-2">
            <div class="input-group">
                <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
                <button class="btn btn-outline-danger remove-opportunity" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}
