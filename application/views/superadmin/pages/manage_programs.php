<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="container-fluid dashboard-bg py-4">
    <div class="container">
        <div class="dashboard-card">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="card-title">Manage Programs</h3>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProgramModal">
                    + Add Program
                </button>
            </div>

            <div class="row g-4" id="programs-list">
                <!-- Programs cards injected here -->
            </div>

        </div>
    </div>
</div>

<!-- ================= ADD PROGRAM MODAL ================= -->
<div class="modal fade" id="addProgramModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Add Program</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="add-program-form">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Program Name <span class="text-danger">*</span></label>
                            <input type="text" id="add-program-name" class="form-control" placeholder="e.g., BS Computer Science" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Duration (years) <span class="text-danger">*</span></label>
                            <input type="number" id="add-duration-years" class="form-control" placeholder="e.g., 4" min="1" required>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Description <span class="text-danger">*</span></label>
                            <textarea id="add-description" class="form-control" rows="3" placeholder="Program description" required></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Career Opportunities <span class="text-danger">*</span></label>
                            <div id="add-opportunities-container">
                                <div class="opportunity-input-group mb-2">
                                    <div class="input-group">
                                        <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
                                        <button class="btn btn-outline-secondary remove-opportunity" type="button" style="display:none;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="add-opportunity-btn">
                                + Add Opportunity
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Add Program</button>
                </div>
            </form>

        </div>
    </div>
</div>

<!-- ================= EDIT PROGRAM MODAL ================= -->
<div class="modal fade" id="editProgramModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Edit Program</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="edit-program-form">
                <input type="hidden" id="edit-program-id">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Program Name <span class="text-danger">*</span></label>
                            <input type="text" id="edit-program-name" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Duration (Years) <span class="text-danger">*</span></label>
                            <input type="number" id="edit-duration-years" class="form-control" min="1" required>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Description <span class="text-danger">*</span></label>
                            <textarea id="edit-description" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Career Opportunities <span class="text-danger">*</span></label>
                            <div id="edit-opportunities-container">
                                <!-- Opportunities injected here -->
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="edit-opportunity-btn">
                                + Add Opportunity
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Update</button>
                </div>
            </form>

        </div>
    </div>
</div>

<script src="<?php echo base_url('assets/js/manage_programs.js'); ?>"></script>
