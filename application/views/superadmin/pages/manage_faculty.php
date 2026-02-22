<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-chalkboard-teacher me-2"></i>Manage Faculty</h1>
                <p class="card-subtitle">Add, edit, and remove faculty members from the college directory.</p>
                <hr>

                <div class="mb-4 text-end">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addFacultyModal">
                        <i class="fas fa-plus me-2"></i>Add New Faculty Member
                    </button>
                </div>

                <div class="forms-management-section">
                    <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Faculty Members</h4>
                    <div class="row g-4" id="faculty-list">
                        <!-- Faculty cards injected here -->
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- ================= ADD FACULTY MODAL ================= -->
<div class="modal fade" id="addFacultyModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Add Faculty</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="add-faculty-form">
                <div class="modal-body">
                    <div class="row g-4">
                        <!-- Image Section -->
                        <div class="col-md-4 text-center">
                            <div class="image-upload-container" id="add-upload-area" style="cursor: pointer; min-height: 220px;">
                                <input type="file" id="add-image-input" accept="image/*" style="display: none;">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="image-upload-text">Click or Drag Image</p>
                                <p class="image-upload-text-small">Click image to change</p>
                            </div>
                            <img id="add-image-preview" class="faculty-image-preview-modal" style="cursor: pointer; width: 100%; max-width: 250px;" title="Click to change image">
                        </div>

                        <!-- Form Section -->
                        <div class="col-md-8">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">First Name <span class="text-danger">*</span></label>
                                    <input type="text" id="add-firstname" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Last Name <span class="text-danger">*</span></label>
                                    <input type="text" id="add-lastname" class="form-control" required>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Position <span class="text-danger">*</span></label>
                                    <select id="add-position" class="form-control" required>
                                        <option value="">-- Select Position --</option>
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Campus Director">Campus Director</option>
                                        <option value="Dean">Dean</option>
                                        <option value="Chairperson">Chairperson</option>
                                        <option value="Instructor">Instructor</option>
                                    </select>
                                </div>
                                <div class="col-md-12" id="add-vp-type-wrapper" style="display: none;">
                                    <label class="form-label">Vice President Type <span class="text-danger">*</span></label>
                                    <select id="add-vp-type" class="form-control">
                                        <option value="">-- Select VP Type --</option>
                                        <option value="VP for Academics and Quality Assurance">VP for Academics and Quality Assurance</option>
                                        <option value="VP for Research, Development and Extension">VP for Research, Development and Extension</option>
                                        <option value="VP for Administration and Finance">VP for Administration and Finance</option>
                                        <option value="VP for Student Affairs and Services">VP for Student Affairs and Services</option>
                                    </select>
                                </div>
                                <div class="col-md-12" id="add-course-wrapper" style="display: none;">
                                    <label class="form-label">Course <span class="text-danger">*</span></label>
                                    <select id="add-course" class="form-control">
                                        <option value="">-- Select Course --</option>
                                        <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                    </select>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="add-advisory-check">
                                        <label class="form-check-label" for="add-advisory-check">
                                            Advisory <span class="text-muted">(Optional)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6 add-advisory-section" style="display: none;">
                                    <label class="form-label">Year</label>
                                    <select id="add-year" class="form-control">
                                        <option value="">-- Select Year --</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                                <div class="col-md-6 add-advisory-section" style="display: none;">
                                    <label class="form-label">Section</label>
                                    <select id="add-section" class="form-control">
                                        <option value="">-- Select Section --</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save</button>
                </div>
            </form>

        </div>
    </div>
</div>

<!-- ================= EDIT FACULTY MODAL ================= -->
<div class="modal fade" id="editFacultyModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Edit Faculty</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="edit-faculty-form">
                <div class="modal-body">
                    <div class="row g-4">
                        <!-- Image Section -->
                        <div class="col-md-4 text-center">
                            <div class="image-upload-container" id="edit-upload-area" style="cursor: pointer; min-height: 220px;">
                                <input type="file" id="edit-image-input" accept="image/*" style="display: none;">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="image-upload-text">Click or Drag Image</p>
                                <p class="image-upload-text-small">Click image to change</p>
                            </div>
                            <img id="edit-image-preview" class="faculty-image-preview-modal" style="cursor: pointer; width: 100%; max-width: 250px;" title="Click to change image">
                        </div>

                        <!-- Form Section -->
                        <div class="col-md-8">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">First Name <span class="text-danger">*</span></label>
                                    <input type="text" id="edit-firstname" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Last Name <span class="text-danger">*</span></label>
                                    <input type="text" id="edit-lastname" class="form-control" required>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Position <span class="text-danger">*</span></label>
                                    <select id="edit-position" class="form-control" required>
                                        <option value="">-- Select Position --</option>
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Campus Director">Campus Director</option>
                                        <option value="Dean">Dean</option>
                                        <option value="Chairperson">Chairperson</option>
                                        <option value="Instructor">Instructor</option>
                                    </select>
                                </div>
                                <div class="col-md-12" id="edit-vp-type-wrapper" style="display: none;">
                                    <label class="form-label">Vice President Type <span class="text-danger">*</span></label>
                                    <select id="edit-vp-type" class="form-control">
                                        <option value="">-- Select VP Type --</option>
                                        <option value="VP for Academics and Quality Assurance">VP for Academics and Quality Assurance</option>
                                        <option value="VP for Research, Development and Extension">VP for Research, Development and Extension</option>
                                        <option value="VP for Administration and Finance">VP for Administration and Finance</option>
                                        <option value="VP for Student Affairs and Services">VP for Student Affairs and Services</option>
                                    </select>
                                </div>
                                <div class="col-md-12" id="edit-course-wrapper" style="display: none;">
                                    <label class="form-label">Course <span class="text-danger">*</span></label>
                                    <select id="edit-course" class="form-control">
                                        <option value="">-- Select Course --</option>
                                        <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                    </select>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="edit-advisory-check">
                                        <label class="form-check-label" for="edit-advisory-check">
                                            Advisory <span class="text-muted">(Optional)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6 edit-advisory-section" style="display: none;">
                                    <label class="form-label">Year</label>
                                    <select id="edit-year" class="form-control">
                                        <option value="">-- Select Year --</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                                <div class="col-md-6 edit-advisory-section" style="display: none;">
                                    <label class="form-label">Section</label>
                                    <select id="edit-section" class="form-control">
                                        <option value="">-- Select Section --</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                </div>
                            </div>
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
