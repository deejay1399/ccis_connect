<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<!-- Floating Notification -->
<div class="floating-notification" id="success-notification">
    <div class="notification-content">
        <div class="notification-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="notification-text">
            <h6 id="notification-title">Success!</h6>
            <p id="notification-message">Operation completed successfully.</p>
        </div>
        <button class="notification-close" id="close-notification">
            <i class="fas fa-times"></i>
        </button>
    </div>
</div>

<!-- Edit User Modal -->
<div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem;">
                <h5 class="modal-title" id="editUserModalLabel" style="color: white; font-weight: 800; font-size: 1.3rem; margin: 0;">
                    <i class="fas fa-edit me-2"></i>Edit User
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="edit-user-form">
                    <input type="hidden" id="edit-user-id">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="edit-fullName" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="edit-fullName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="edit-userEmail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="edit-userEmail" required>
                        </div>
                    </div>

                    <!-- Student Details Section -->
                    <div id="student-details-section" style="display: none;">
                        <div class="border-top pt-3 mt-3">
                            <h6 class="mb-3"><i class="fas fa-graduation-cap me-2"></i>Student Information</h6>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="edit-studentNumber" class="form-label">Student Number</label>
                                    <input type="text" class="form-control" id="edit-studentNumber" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="edit-course" class="form-label">Course</label>
                                    <input type="text" class="form-control" id="edit-course" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="edit-yearLevel" class="form-label">Year Level</label>
                                    <input type="text" class="form-control" id="edit-yearLevel" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="edit-section" class="form-label">Section</label>
                                    <input type="text" class="form-control" id="edit-section" readonly>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Faculty Details Section -->
                    <div id="faculty-details-section" style="display: none;">
                        <div class="border-top pt-3 mt-3">
                            <h6 class="mb-3"><i class="fas fa-chalkboard-user me-2"></i>Faculty Information</h6>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="edit-position" class="form-label">Position</label>
                                    <input type="text" class="form-control" id="edit-position" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="edit-department" class="form-label">Department</label>
                                    <input type="text" class="form-control" id="edit-department" readonly>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label for="edit-officeLocation" class="form-label">Office Location</label>
                                    <input type="text" class="form-control" id="edit-officeLocation" readonly>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label for="edit-bio" class="form-label">Bio</label>
                                    <textarea class="form-control" id="edit-bio" readonly style="resize: vertical; min-height: 80px;"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="save-user-changes">
                    <i class="fas fa-save me-2"></i>Save Changes
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="confirmationModalLabel">
                    <i class="fas fa-exclamation-triangle me-2"></i>Confirm Action
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h6 id="confirmation-message">Are you sure you want to perform this action?</h6>
                    <p id="confirmation-details" class="text-muted mb-0"></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirm-action-btn">
                    <i class="fas fa-check me-2"></i>Confirm
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Main Content Area -->
<div class="users-main">
    <!-- Page Header -->
    <div class="users-page-header">
        <h1><i class="fas fa-users"></i> User Management</h1>
        <p>Overview of all system users by role</p>
    </div>

    <!-- Role Statistics -->
    <div class="role-stats-grid">
        <!-- Admin -->
        <div class="role-stat-box role-stat-admin">
            <div class="role-stat-icon"><i class="fas fa-crown"></i></div>
            <h3>System Admin</h3>
            <div class="role-stat-count" id="admin-count">0/0</div>
            <div class="role-stat-label">Active / Total</div>
            <div class="role-stat-bar"><div class="role-stat-bar-fill" id="admin-bar" style="width: 0%; background: #e74c3c;"></div></div>
        </div>

        <!-- Faculty -->
        <div class="role-stat-box role-stat-faculty">
            <div class="role-stat-icon"><i class="fas fa-chalkboard-user"></i></div>
            <h3>Faculty</h3>
            <div class="role-stat-count" id="faculty-count">0/0</div>
            <div class="role-stat-label">Active / Total</div>
            <div class="role-stat-bar"><div class="role-stat-bar-fill" id="faculty-bar" style="width: 0%; background: #3498db;"></div></div>
        </div>

        <!-- Student -->
        <div class="role-stat-box role-stat-student">
            <div class="role-stat-icon"><i class="fas fa-graduation-cap"></i></div>
            <h3>Student</h3>
            <div class="role-stat-count" id="student-count">0/0</div>
            <div class="role-stat-label">Active / Total</div>
            <div class="role-stat-bar"><div class="role-stat-bar-fill" id="student-bar" style="width: 0%; background: #2ecc71;"></div></div>
        </div>

        <!-- Organization -->
        <div class="role-stat-box role-stat-org">
            <div class="role-stat-icon"><i class="fas fa-sitemap"></i></div>
            <h3>Org Admin</h3>
            <div class="role-stat-count" id="org-count">0/0</div>
            <div class="role-stat-label">Active / Total</div>
            <div class="role-stat-bar"><div class="role-stat-bar-fill" id="org-bar" style="width: 0%; background: #f39c12;"></div></div>
        </div>
    </div>

    <!-- Users Section -->
    <div class="users-section-box">
        <div class="users-section-header">
            <h2><i class="fas fa-list"></i> All Users</h2>
            <div class="users-search">
                <i class="fas fa-search"></i>
                <input type="text" id="user-search" placeholder="Search users...">
            </div>
        </div>

        <!-- Table -->
        <div class="users-table-container">
            <table class="users-data-table" id="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody id="users-table-body">
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div class="users-empty-state" id="empty-state" style="display: none;">
            <i class="fas fa-inbox"></i>
            <h3>No Users Found</h3>
            <p>There are no users in the system yet.</p>
        </div>
    </div>
</div>
