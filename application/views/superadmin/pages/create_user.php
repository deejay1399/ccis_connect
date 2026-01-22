<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<!-- Notification Modal Backdrop -->
<div class="notification-backdrop" id="notification-backdrop"></div>

<!-- Notification Modal -->
<div class="notification-modal" id="notification-modal">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-icon-title">
                <div class="modal-icon" id="modal-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h5 id="modal-title">Success!</h5>
            </div>
            <button type="button" class="btn-close" id="close-modal-btn" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <p id="modal-message">User account created successfully!</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modal-close-btn">Close</button>
        </div>
    </div>
</div>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="dashboard-card">
                <h3 class="card-title text-center mb-4"><i class="fas fa-user-plus me-2"></i>Create New User Account</h3>
                <p class="text-center text-muted mb-4">Create a new user account. Select the user type and fill in the appropriate information.</p>
                
                <hr>
                <form id="create-user-form">
                    <!-- Basic Information -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="firstName" placeholder="Juan" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="lastName" placeholder="Dela Cruz" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                        <input type="email" class="form-control" id="email" placeholder="juan.delacruz@bisu.edu.ph" required>
                    </div>

                    <!-- User Type Selection -->
                    <div class="mb-4">
                        <label class="form-label d-block mb-3">User Type <span class="text-danger">*</span></label>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-check mb-2">
                                    <input class="form-check-input user-type-radio" type="radio" name="userType" id="studentRadio" value="3" data-role="student">
                                    <label class="form-check-label" for="studentRadio">
                                        <i class="fas fa-graduation-cap me-1"></i>Student
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input user-type-radio" type="radio" name="userType" id="facultyRadio" value="2" data-role="faculty">
                                    <label class="form-check-label" for="facultyRadio">
                                        <i class="fas fa-chalkboard-teacher me-1"></i>Faculty
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check mb-2">
                                    <input class="form-check-input user-type-radio" type="radio" name="userType" id="orgAdminRadio" value="4" data-role="orgadmin">
                                    <label class="form-check-label" for="orgAdminRadio">
                                        <i class="fas fa-sitemap me-1"></i>Organization Admin
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input user-type-radio" type="radio" name="userType" id="superAdminRadio" value="1" data-role="superadmin">
                                    <label class="form-check-label" for="superAdminRadio">
                                        <i class="fas fa-crown me-1"></i>Super Admin
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- STUDENT FIELDS - Hidden by default -->
                    <div id="studentFields" style="display: none;">
                        <div class="card card-light mb-4">
                            <div class="card-body">
                                <h6 class="card-title"><i class="fas fa-graduation-cap me-2"></i>Student Information</h6>
                                <hr>
                                <div class="mb-3">
                                    <label for="studentNumber" class="form-label">Student Number <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="studentNumber" placeholder="e.g. 20-00123">
                                </div>
                                <div class="mb-3">
                                    <label for="course" class="form-label">Course <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="course" placeholder="e.g. Bachelor of Science in Computer Science">
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="yearLevel" class="form-label">Year Level <span class="text-danger">*</span></label>
                                        <select class="form-select" id="yearLevel">
                                            <option value="" selected disabled>Select year...</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="section" class="form-label">Section <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="section" placeholder="e.g. A, B, C">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FACULTY FIELDS - Hidden by default -->
                    <div id="facultyFields" style="display: none;">
                        <div class="card card-light mb-4">
                            <div class="card-body">
                                <h6 class="card-title"><i class="fas fa-chalkboard-teacher me-2"></i>Faculty Information</h6>
                                <hr>
                                <div class="mb-3">
                                    <label for="position" class="form-label">Position <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="position" placeholder="e.g. Associate Professor, Instructor">
                                </div>
                                <div class="mb-3">
                                    <label for="department" class="form-label">Department <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="department" placeholder="e.g. College of Computer Science">
                                </div>
                                <div class="mb-3">
                                    <label for="bio" class="form-label">Bio <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="bio" rows="3" placeholder="Brief bio or credentials..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="officeLocation" class="form-label">Office Location <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="officeLocation" placeholder="e.g. Building A, Room 201">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ORGANIZATION ADMIN FIELDS - Hidden by default -->
                    <div id="orgAdminFields" style="display: none;">
                        <div class="card card-light mb-4">
                            <div class="card-body">
                                <h6 class="card-title"><i class="fas fa-sitemap me-2"></i>Organization Assignment</h6>
                                <hr>
                                <div class="mb-3">
                                    <label for="organization" class="form-label">Select Organization <span class="text-danger">*</span></label>
                                    <select class="form-select" id="organization">
                                        <option value="" selected disabled>Select an organization...</option>
                                        <option value="csguild">CSGuild</option>
                                        <option value="the_legion">The Legion</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-user-plus me-2"></i>Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
