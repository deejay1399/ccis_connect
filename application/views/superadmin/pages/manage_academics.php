<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-graduation-cap me-2"></i>Manage Academics</h1>
                <p class="card-subtitle">Edit programs, upload curriculum PDFs, class schedules, and academic calendar.</p>
                <hr>

                <ul class="nav nav-tabs nav-academics" id="academicsTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="programs-tab" data-bs-toggle="tab" data-bs-target="#programs" type="button" role="tab" aria-controls="programs" aria-selected="true">
                            <i class="fas fa-book me-2"></i>Programs
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="curriculum-tab" data-bs-toggle="tab" data-bs-target="#curriculum" type="button" role="tab" aria-controls="curriculum" aria-selected="false">
                            <i class="fas fa-file-pdf me-2"></i>Curriculum
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="schedule-tab" data-bs-toggle="tab" data-bs-target="#schedule" type="button" role="tab" aria-controls="schedule" aria-selected="false">
                            <i class="fas fa-table me-2"></i>Class Schedule
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="calendar-tab" data-bs-toggle="tab" data-bs-target="#calendar" type="button" role="tab" aria-controls="calendar" aria-selected="false">
                            <i class="fas fa-calendar me-2"></i>Academic Calendar
                        </button>
                    </li>
                </ul>

                <div class="tab-content mt-4" id="academicsTabContent">
                    <!-- PROGRAMS TAB -->
                    <div class="tab-pane fade show active" id="programs" role="tabpanel" aria-labelledby="programs-tab">
                        <div class="mb-4 text-end">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProgramModal">
                                <i class="fas fa-plus me-2"></i>Add New Program
                            </button>
                        </div>
                        <div id="programsList" class="row g-4">
                            <!-- Programs will be loaded here -->
                        </div>
                    </div>

                    <!-- CURRICULUM TAB -->
                    <div class="tab-pane fade" id="curriculum" role="tabpanel" aria-labelledby="curriculum-tab">
                        <div class="section-card">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Upload Curriculum PDF</h4>
                            <form id="uploadCurriculumForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="curriculumName" class="form-label">Curriculum Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="curriculumName" placeholder="e.g., BS Computer Science" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="curriculumFile" class="form-label">PDF File <span class="text-danger">*</span></label>
                                        <input type="file" class="form-control" id="curriculumFile" accept=".pdf" required>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-upload me-2"></i>Upload Curriculum
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Curriculums</h4>
                            <div id="curriculumList" class="row row-cols-1 row-cols-md-2 g-4">
                                <!-- Curriculums will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- CLASS SCHEDULES TAB -->
                    <div class="tab-pane fade" id="schedule" role="tabpanel" aria-labelledby="schedule-tab">
                        <div class="section-card">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Upload Class Schedule</h4>
                            <form id="uploadScheduleForm">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label for="scheduleYear" class="form-label">Academic Year</label>
                                        <input type="text" class="form-control" id="scheduleYear" placeholder="e.g., 2023-2024" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="scheduleSemester" class="form-label">Semester</label>
                                        <select class="form-select" id="scheduleSemester" required>
                                            <option value="">Select semester...</option>
                                            <option value="1st">1st Semester</option>
                                            <option value="2nd">2nd Semester</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="scheduleFile" class="form-label">PDF File</label>
                                        <input type="file" class="form-control" id="scheduleFile" accept=".pdf" required>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-upload me-2"></i>Upload Schedule
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Schedules</h4>
                            <div id="scheduleList" class="row row-cols-1 row-cols-md-2 g-4">
                                <!-- Schedules will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- ACADEMIC CALENDAR TAB -->
                    <div class="tab-pane fade" id="calendar" role="tabpanel" aria-labelledby="calendar-tab">
                        <div class="section-card">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Upload Academic Calendar</h4>
                            <form id="uploadCalendarForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="calendarYear" class="form-label">Academic Year</label>
                                        <input type="text" class="form-control" id="calendarYear" placeholder="e.g., 2023-2024" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="calendarFile" class="form-label">PDF File</label>
                                        <input type="file" class="form-control" id="calendarFile" accept=".pdf" required>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-upload me-2"></i>Upload Calendar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Calendars</h4>
                            <div id="calendarList" class="row row-cols-1 row-cols-md-2 g-4">
                                <!-- Calendars will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Add Program Modal -->
<div class="modal fade" id="addProgramModal" tabindex="-1" aria-labelledby="addProgramModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addProgramModalLabel">Add New Program</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="addProgramForm">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="programName" class="form-label">Program Name</label>
                        <input type="text" class="form-control" id="programName" placeholder="e.g., BS Computer Science" required>
                    </div>
                    <div class="mb-3">
                        <label for="programDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="programDescription" rows="3" placeholder="Program description" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="programDuration" class="form-label">Duration (years)</label>
                        <input type="number" class="form-control" id="programDuration" placeholder="e.g., 4" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Career Opportunities <span class="text-danger">*</span></label>
                        <div id="add-opportunities-container">
                            <div class="opportunity-input-group mb-2">
                                <div class="input-group">
                                    <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
                                    <button class="btn btn-outline-danger remove-opportunity" type="button" style="display:none;">
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Program</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Program Modal -->
<div class="modal fade" id="editProgramModal" tabindex="-1" aria-labelledby="editProgramModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editProgramModalLabel">Edit Program</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="editProgramForm">
                <input type="hidden" id="editProgramKey">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="editProgramName" class="form-label">Program Name</label>
                        <input type="text" class="form-control" id="editProgramName" placeholder="e.g., BS Computer Science" required>
                    </div>
                    <div class="mb-3">
                        <label for="editProgramDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="editProgramDescription" rows="3" placeholder="Program description" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="editProgramDuration" class="form-label">Duration (years)</label>
                        <input type="number" class="form-control" id="editProgramDuration" placeholder="e.g., 4" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Career Opportunities <span class="text-danger">*</span></label>
                        <div id="edit-opportunities-container">
                            <div class="opportunity-input-group mb-2">
                                <div class="input-group">
                                    <input type="text" class="form-control opportunity-input" placeholder="Enter career opportunity">
                                    <button class="btn btn-outline-danger remove-opportunity" type="button" style="display:none;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="edit-opportunity-btn">
                            + Add Opportunity
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="confirmationModalLabel">Confirm Removal</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <p id="confirmationMessage">Are you sure you want to remove this item? This action cannot be undone.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmActionBtn">Remove</button>
            </div>
        </div>
    </div>
</div>
<!-- PDF Preview Modal -->
<div class="modal fade" id="pdfPreviewModal" tabindex="-1" aria-labelledby="pdfPreviewLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="pdfPreviewLabel">
                    <i class="fas fa-file-pdf me-2"></i>Curriculum Preview
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0" style="background: #f5f5f5;">
                <iframe id="pdfViewer" style="width: 100%; height: 100%; border: none;" src=""></iframe>
            </div>
            <div class="modal-footer">
                <a id="pdfDownloadBtn" href="#" download class="btn btn-primary me-auto">
                    <i class="fas fa-download me-2"></i>Download PDF
                </a>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>