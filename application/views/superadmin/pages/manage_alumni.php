<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-user-graduate me-2"></i>Alumni & Submissions Management</h1>
                <p class="card-subtitle">Manage alumni submissions, mentor requests, chatbot inquiries, connection requests, and featured alumni.</p>

                <!-- Tabs Navigation -->
                <ul class="nav nav-tabs" id="alumniTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="mentor-tab" data-bs-toggle="tab" data-bs-target="#mentor-content" type="button" role="tab">
                            <i class="fas fa-handshake me-2"></i>Mentor Volunteers
                            <span class="badge bg-danger ms-2" id="mentor-badge">0</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="chatbot-tab" data-bs-toggle="tab" data-bs-target="#chatbot-content" type="button" role="tab">
                            <i class="fas fa-robot me-2"></i>Chatbot Inquiries
                            <span class="badge bg-danger ms-2" id="chatbot-tab-badge">0</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="connection-tab" data-bs-toggle="tab" data-bs-target="#connection-content" type="button" role="tab">
                            <i class="fas fa-user-friends me-2"></i>Connection Requests
                            <span class="badge bg-danger ms-2" id="connection-badge">0</span>
                        </button>
                    </li>
                    <!-- Temporarily disabled: Alumni Updates tab -->
                    <!--
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="updates-tab" data-bs-toggle="tab" data-bs-target="#updates-content" type="button" role="tab">
                            <i class="fas fa-user-edit me-2"></i>Alumni Updates
                        </button>
                    </li>
                    -->
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="giveback-tab" data-bs-toggle="tab" data-bs-target="#giveback-content" type="button" role="tab">
                            <i class="fas fa-donate me-2"></i>Give Back Submissions
                            <span class="badge bg-danger ms-2" id="giveback-badge">0</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="featured-tab" data-bs-toggle="tab" data-bs-target="#featured-content" type="button" role="tab">
                            <i class="fas fa-star me-2"></i>Featured Alumni
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="directory-tab" data-bs-toggle="tab" data-bs-target="#directory-content" type="button" role="tab">
                            <i class="fas fa-address-book me-2"></i>Alumni Directory
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#events-content" type="button" role="tab">
                            <i class="fas fa-calendar-alt me-2"></i>Events
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="alumniTabContent">
                    <!-- Mentor Volunteers Tab -->
                    <div class="tab-pane fade show active" id="mentor-content" role="tabpanel">
                        <div class="tab-header">
                            <h4><i class="fas fa-handshake me-2"></i>Mentor Volunteer Submissions</h4>
                            <button class="btn btn-sm btn-outline-primary" id="mark-all-mentor-read">
                                <i class="fas fa-check-double me-1"></i>Mark All as Read
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th width="20%">Name</th>
                                        <th width="15%">Batch</th>
                                        <th width="20%">Email</th>
                                        <th width="20%">Area of Interest</th>
                                        <th width="15%">Submitted</th>
                                        <th width="10%">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="mentor-table-body">
                                    <!-- Data will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-mentor-data">
                            <i class="fas fa-handshake fa-3x mb-3"></i>
                            <h5>No Mentor Submissions Yet</h5>
                            <p>When alumni submit mentor volunteer forms, they will appear here.</p>
                        </div>
                    </div>

                    <!-- Chatbot Inquiries Tab -->
                    <div class="tab-pane fade" id="chatbot-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-robot me-2"></i>Chatbot Inquiries</h4>
                            <p class="text-muted">Questions asked through the chatbot</p>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Question</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody id="chatbot-table-body">
                                    <!-- Chatbot records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-chatbot-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No chatbot inquiries yet</p>
                        </div>
                    </div>

                    <!-- Connection Requests Tab -->
                    <div class="tab-pane fade" id="connection-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-user-friends me-2"></i>Connection Requests</h4>
                            <p class="text-muted">Alumni looking to connect with each other</p>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>From</th>
                                        <th>Email</th>
                                        <th>To</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="connection-table-body">
                                    <!-- Connection records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-connection-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No connection requests yet</p>
                        </div>
                    </div>

                    <!-- Temporarily disabled: Alumni Updates tab content -->
                    <!--
                    <div class="tab-pane fade" id="updates-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-newspaper me-2"></i>Alumni Updates</h4>
                            <p class="text-muted">Life updates shared by alumni</p>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Author</th>
                                        <th>Update</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="updates-table-body">
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-updates-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No alumni updates yet</p>
                        </div>
                    </div>
                    -->

                    <!-- Give Back Tab -->
                    <div class="tab-pane fade" id="giveback-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-heart me-2"></i>Give Back Submissions</h4>
                            <p class="text-muted">Alumni giving back to the community</p>
                        </div>

                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title mb-3"><i class="fas fa-wallet me-2"></i>Donation Payment Details</h5>
                                <p class="text-muted mb-3">These details appear in the public Alumni "Make a Donation" modal.</p>
                                <form id="donationSettingsForm">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="donation-bank-name" class="form-label">Bank Name</label>
                                            <input type="text" class="form-control" id="donation-bank-name" maxlength="150">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="donation-bank-account-name" class="form-label">Bank Account Name</label>
                                            <input type="text" class="form-control" id="donation-bank-account-name" maxlength="150">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="donation-bank-account-number" class="form-label">Bank Account Number</label>
                                            <input type="text" class="form-control" id="donation-bank-account-number" maxlength="80">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="donation-bank-branch" class="form-label">Bank Branch</label>
                                            <input type="text" class="form-control" id="donation-bank-branch" maxlength="150">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="donation-gcash-number" class="form-label">GCash Number</label>
                                            <input type="text" class="form-control" id="donation-gcash-number" maxlength="80">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="donation-maya-number" class="form-label">Maya Number</label>
                                            <input type="text" class="form-control" id="donation-maya-number" maxlength="80">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="donation-digital-account-name" class="form-label">Digital Account Name</label>
                                            <input type="text" class="form-control" id="donation-digital-account-name" maxlength="150">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="donation-contact-email" class="form-label">Donation Contact Email</label>
                                            <input type="email" class="form-control" id="donation-contact-email" maxlength="150">
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button type="submit" class="btn btn-primary btn-sm">
                                            <i class="fas fa-save me-1"></i>Save Donation Details
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Author</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="giveback-table-body">
                                    <!-- Give back records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-giveback-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No give back submissions yet</p>
                        </div>
                    </div>

                    <!-- Featured Alumni Tab -->
                    <div class="tab-pane fade" id="featured-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-star me-2"></i>Featured Alumni</h4>
                            <p class="text-muted">Showcase accomplished alumni</p>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addFeaturedModal">
                                <i class="fas fa-plus me-1"></i>Add Featured Alumni
                            </button>
                        </div>
                        <div class="row g-3" id="featured-alumni-grid">
                            <!-- Featured alumni cards will be loaded here -->
                        </div>
                        <div class="no-data" id="no-featured-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No featured alumni yet</p>
                        </div>
                    </div>

                    <!-- Alumni Directory Tab -->
                    <div class="tab-pane fade" id="directory-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-address-book me-2"></i>Alumni Directory</h4>
                            <p class="text-muted">Directory of alumni members</p>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addDirectoryModal">
                                <i class="fas fa-plus me-1"></i>Add Directory Entries
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="directory-table-body">
                                    <!-- Directory records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-directory-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No directory entries yet</p>
                        </div>
                    </div>

                    <!-- Alumni Events Tab -->
                    <div class="tab-pane fade" id="events-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-calendar me-2"></i>Alumni Events</h4>
                            <p class="text-muted">Events organized for alumni</p>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addEventModal">
                                <i class="fas fa-plus me-1"></i>Add Event
                            </button>
                        </div>
                        <div class="row g-3" id="events-grid">
                            <!-- Event cards will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Modals -->
<!-- Submission Details + Decision Modal -->
<div class="modal fade" id="submissionDetailsModal" tabindex="-1" aria-labelledby="submissionDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="submissionDetailsModalLabel">Submission Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="submission-details-content">
                <!-- Details rendered by JS -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" id="submission-disapprove-btn">Disapprove & Open Gmail</button>
                <button type="button" class="btn btn-success" id="submission-approve-btn">Approve & Open Gmail</button>
            </div>
        </div>
    </div>
</div>

<!-- Modals -->
<!-- Add Featured Alumni Modal -->
<div class="modal fade" id="addFeaturedModal" tabindex="-1" aria-labelledby="addFeaturedModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content featured-form-modal">
            <div class="modal-header">
                <div>
                    <h5 class="modal-title" id="addFeaturedModalLabel"><i class="fas fa-star me-2"></i>Add Featured Alumni</h5>
                    <p class="featured-modal-subtitle mb-0">Highlight a graduate with either a polished photo or a public-facing video.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addFeaturedForm">
                    <div class="row g-4 align-items-start">
                        <div class="col-lg-7">
                            <div class="mb-3">
                                <label for="featuredName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="featuredName" required>
                            </div>
                            <div class="mb-3">
                                <label for="featuredPosition" class="form-label">Position/Achievement</label>
                                <input type="text" class="form-control" id="featuredPosition" required>
                            </div>
                            <div class="mb-0">
                                <label for="featuredBio" class="form-label">Biography</label>
                                <textarea class="form-control" id="featuredBio" rows="6" required></textarea>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            <div class="featured-media-picker">
                                <div class="featured-media-picker-head">
                                    <h6 class="mb-1">Feature Media</h6>
                                    <p class="mb-0">Choose one optional media type. Video is recommended for story-driven highlights.</p>
                                </div>

                                <label for="featuredPhoto" class="featured-media-option">
                                    <span class="featured-media-option-icon"><i class="fas fa-image"></i></span>
                                    <span class="featured-media-option-copy">
                                        <strong>Upload Photo</strong>
                                        <small>JPG, PNG, WEBP up to 5 MB</small>
                                    </span>
                                </label>
                                <input type="file" class="form-control featured-media-input" id="featuredPhoto" accept="image/*">

                                <label for="featuredVideo" class="featured-media-option featured-media-option-video">
                                    <span class="featured-media-option-icon"><i class="fas fa-video"></i></span>
                                    <span class="featured-media-option-copy">
                                        <strong>Upload Video</strong>
                                        <small>MP4, WebM, Ogg, MOV, or M4V up to 100 MB</small>
                                    </span>
                                </label>
                                <input type="file" class="form-control featured-media-input" id="featuredVideo" accept="video/mp4,video/webm,video/ogg,.mov,.m4v">

                                <div class="featured-media-preview" id="featuredMediaPreview">
                                    <div class="featured-media-preview-empty">
                                        <i class="fas fa-sparkles"></i>
                                        <span>No media selected yet. The entry can still be saved without media.</span>
                                    </div>
                                </div>

                                <div class="featured-media-note">
                                    <i class="fas fa-circle-info me-2"></i>
                                    Leaving while a file is uploading will cancel the upload and clean up unfinished media.
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addFeaturedForm" class="btn btn-primary">Add Alumni</button>
            </div>
        </div>
    </div>
</div>

<div class="featured-upload-overlay" id="featuredUploadOverlay" hidden aria-hidden="true">
    <div class="featured-upload-dialog" role="dialog" aria-modal="true" aria-labelledby="featuredUploadTitle">
        <div class="featured-upload-orbit" aria-hidden="true">
            <span class="featured-upload-ring ring-one"></span>
            <span class="featured-upload-ring ring-two"></span>
            <span class="featured-upload-ring ring-three"></span>
            <div class="featured-upload-core">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
        </div>

        <p class="featured-upload-eyebrow">Upload lock active</p>
        <h5 id="featuredUploadTitle">Saving Featured Alumni Media</h5>
        <p class="featured-upload-copy" id="featuredUploadDescription">Please keep this page open while we upload and secure the file.</p>

        <div class="featured-upload-file-card">
            <span class="featured-upload-badge" id="featuredUploadMediaBadge">Media</span>
            <div class="featured-upload-file-meta">
                <strong id="featuredUploadFileName">Preparing upload...</strong>
                <small id="featuredUploadFileSize">0 MB</small>
            </div>
        </div>

        <div class="featured-upload-progress-track" aria-hidden="true">
            <div class="featured-upload-progress-bar" id="featuredUploadProgressBar"></div>
        </div>
        <div class="featured-upload-progress-meta">
            <span id="featuredUploadStage">Preparing upload...</span>
            <span id="featuredUploadPercent">0%</span>
        </div>

        <div class="featured-upload-status-card">
            <i class="fas fa-shield-alt"></i>
            <p id="featuredUploadStatus">Navigation is temporarily blocked so unfinished uploads can be cancelled and cleaned up safely.</p>
        </div>
    </div>
</div>

<!-- Add Directory Entry Modal -->
<div class="modal fade" id="addDirectoryModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Add Directory Entries</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addDirectoryForm">
                    <div class="directory-modal-toolbar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                        <div class="directory-modal-copy">
                            <h6 class="mb-1">Directory Entries</h6>
                            <p class="text-muted small mb-0">Add multiple alumni entries in one submit. Each entry can also have its own photos.</p>
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-sm" id="addDirectoryEntryRow">
                            <i class="fas fa-plus me-1"></i>Add Another Entry
                        </button>
                    </div>
                    <div id="directoryEntryList" class="directory-entry-list"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addDirectoryForm" class="btn btn-primary">Save Entries</button>
            </div>
        </div>
    </div>
</div>

<!-- Add Event Modal -->
<div class="modal fade" id="addEventModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-calendar-plus me-2"></i>Add Alumni Event</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addEventForm">
                    <div class="mb-3">
                        <label for="eventName" class="form-label">Event Name</label>
                        <input type="text" class="form-control" id="eventName" required>
                    </div>
                    <div class="mb-3">
                        <label for="eventDate" class="form-label">Date</label>
                        <input type="date" class="form-control" id="eventDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="eventPhoto" class="form-label">Photo (optional)</label>
                        <input type="file" class="form-control" id="eventPhoto" accept="image/*">
                    </div>
                    <div class="mb-3">
                        <label for="eventLocation" class="form-label">Location</label>
                        <input type="text" class="form-control" id="eventLocation" required>
                    </div>
                    <div class="mb-3">
                        <label for="eventDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="eventDescription" rows="3" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addEventForm" class="btn btn-primary">Add Event</button>
            </div>
        </div>
    </div>
</div>
