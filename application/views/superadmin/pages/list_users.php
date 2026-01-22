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
            <div class="modal-header">
                <h5 class="modal-title" id="editUserModalLabel">
                    <i class="fas fa-edit me-2"></i>Edit Organization Admin
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="edit-orgName" class="form-label">Organization</label>
                            <select class="form-select" id="edit-orgName" required>
                                <option value="csguild">CSGuild</option>
                                <option value="the_legion">The Legion</option>
                            </select>
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

<!-- Set Password Modal -->
<div class="modal fade" id="setPasswordModal" tabindex="-1" aria-labelledby="setPasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="setPasswordModalLabel">
                    <i class="fas fa-key me-2"></i>
                    Set Password for <span id="password-user-name"></span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Password Setup:</strong> User will be able to login with this temporary password and will be prompted to set their own password.
                </div>
                <form id="set-password-form">
                    <input type="hidden" id="password-user-id">
                    <div class="mb-3">
                        <label for="new-password" class="form-label">Temporary Password *</label>
                        <input type="password" class="form-control" id="new-password" required 
                               placeholder="Enter temporary password">
                        <div class="form-text">
                            <i class="fas fa-shield-alt me-1"></i>
                            Must be at least 8 characters long
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="confirm-password" class="form-label">Confirm Temporary Password *</label>
                        <input type="password" class="form-control" id="confirm-password" required 
                               placeholder="Confirm temporary password">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="save-password">
                    <i class="fas fa-save me-2"></i>Set Password
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

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row">
        <div class="col-12">
            <div class="dashboard-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="card-title mb-0"><i class="fas fa-users-cog me-2"></i>Manage Organization Admins</h3>
                </div>
                
                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-md-3 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon total-users">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <h4 id="total-users">0</h4>
                                <p>Total Admins</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon active-users">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div class="stat-info">
                                <h4 id="active-users">0</h4>
                                <p>Active</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon pending-users">
                                <i class="fas fa-user-clock"></i>
                            </div>
                            <div class="stat-info">
                                <h4 id="pending-users">0</h4>
                                <p>Pending</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon inactive-users">
                                <i class="fas fa-user-slash"></i>
                            </div>
                            <div class="stat-info">
                                <h4 id="inactive-users">0</h4>
                                <p>Inactive</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Users Table -->
                <div class="table-responsive">
                    <table class="table table-hover" id="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Organization</th>
                                <th>Status</th>
                                <th>Date Created</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-table-body">
                            <!-- Users will be loaded here by JavaScript -->
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div class="text-center py-5" id="empty-state">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h4>No Organization Admins Found</h4>
                    <p class="text-muted">There are currently no organization admin accounts in the system.</p>
                </div>
            </div>
        </div>
    </div>
</div>
