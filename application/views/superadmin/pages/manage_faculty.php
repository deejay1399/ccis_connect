<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-chalkboard-teacher me-2"></i>Manage Faculty</h1>
                <p class="card-subtitle">Add, edit, and remove faculty members from the college directory.</p>
                <hr>

                <div class="card p-4 mb-4">
                    <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Add New Faculty Member</h4>
                    <form id="add-faculty-form">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="image-upload-container" id="image-upload-area">
                                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                    <p class="image-upload-text mb-1">Click to upload or drag and drop</p>
                                    <input type="file" id="faculty-image" accept="image/*" class="d-none">
                                </div>
                                <div class="text-center">
                                    <img id="faculty-image-preview" class="faculty-image-preview d-none" src="" alt="Faculty Preview">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label for="faculty-name" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="faculty-name" placeholder="Enter faculty member's full name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="faculty-position" class="form-label">Position</label>
                                    <input type="text" class="form-control" id="faculty-position" placeholder="Enter faculty position" required>
                                </div>
                            </div>
                            <div class="col-12 text-end">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-plus me-2"></i>Save Faculty Member
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="forms-management-section">
                    <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Faculty Members</h4>
                    <div id="faculty-list" class="row g-4">
                        <!-- Faculty members will be loaded here -->
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Edit Faculty Modal -->
<div class="modal fade" id="editFacultyModal" tabindex="-1" aria-labelledby="editFacultyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editFacultyModalLabel">Edit Faculty Member</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="edit-faculty-form">
                    <input type="hidden" id="edit-faculty-index">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="image-upload-container" id="edit-image-upload-area">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="image-upload-text mb-1">Click to upload or drag and drop</p>
                                <input type="file" id="edit-faculty-image" accept="image/*" class="d-none">
                            </div>
                            <div class="text-center">
                                <img id="edit-faculty-image-preview" class="faculty-image-preview" src="" alt="Faculty Preview">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label for="edit-faculty-name" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="edit-faculty-name" placeholder="Enter faculty member's full name" required>
                            </div>
                            <div class="mb-3">
                                <label for="edit-faculty-position" class="form-label">Position</label>
                                <input type="text" class="form-control" id="edit-faculty-position" placeholder="Enter faculty position" required>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="save-faculty-changes">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="confirmationModalLabel">Confirm Action</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <p id="confirmationMessage">Are you sure you want to remove this faculty member?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmActionBtn">Remove</button>
            </div>
        </div>
    </div>
</div>
