<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-file-alt me-2"></i>Manage Downloadable Forms</h1>
                <p class="card-subtitle">Upload and manage forms available on the public site</p>
                <hr>

                <!-- Simple Upload Form -->
                <div class="card p-4 mb-4">
                    <h4 class="mb-3 upload-form-title"><i class="fas fa-plus-circle me-2"></i>Upload New Form</h4>
                    <form id="uploadForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="formTitle" class="form-label">Form Name</label>
                                <input type="text" class="form-control" id="formTitle" placeholder="Enter form name" required>
                            </div>
                            <div class="col-md-6">
                                <label for="formFile" class="form-label">Select File (PDF, DOC, DOCX)</label>
                                <input type="file" class="form-control" id="formFile" accept=".pdf,.doc,.docx" required>
                            </div>
                            <div class="col-12 text-end">
                                <button type="submit" class="btn btn-primary" id="uploadFormBtn">
                                    <i class="fas fa-upload me-2"></i>Upload Form
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Forms List -->
                <div class="forms-management-section">
                    <h4 class="mb-3 current-forms-title"><i class="fas fa-list-ul me-2"></i>Current Forms</h4>
                    <div id="forms-list" class="row row-cols-1 row-cols-md-2 g-4">
                        <!-- Forms will be dynamically loaded here -->
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Edit Form Modal -->
<div class="modal fade" id="editFormModal" tabindex="-1" aria-labelledby="editFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editFormModalLabel">Edit Form</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editFormDetails">
                    <input type="hidden" id="editFormId">
                    <div class="mb-3">
                        <label for="editFormTitle" class="form-label">Form Name</label>
                        <input type="text" class="form-control" id="editFormTitle" required>
                    </div>
                    <div class="mb-3">
                        <label for="editFormFile" class="form-label">Replace File (PDF, DOC, DOCX) (Optional)</label>
                        <input type="file" class="form-control" id="editFormFile" accept=".pdf,.doc,.docx">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="saveChangesBtn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Remove Confirmation Modal -->
<div class="modal fade" id="removeFormModal" tabindex="-1" aria-labelledby="removeFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="removeFormModalLabel">Confirm Removal</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <p>Are you sure you want to remove this form? This action cannot be undone.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmRemoveBtn">Remove</button>
            </div>
        </div>
    </div>
</div>
