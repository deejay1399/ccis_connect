<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-bullhorn me-2"></i>Manage Updates</h1>
                <p class="card-subtitle">Control announcements, events, achievements, and Dean's List.</p>
                <hr>

                <ul class="nav nav-tabs nav-updates" id="updatesTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="announcements-tab" data-bs-toggle="tab" data-bs-target="#announcements" type="button" role="tab" aria-controls="announcements" aria-selected="true">
                            <i class="fas fa-megaphone me-2"></i>Announcements
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="events-achievements-tab" data-bs-toggle="tab" data-bs-target="#events-achievements" type="button" role="tab" aria-controls="events-achievements" aria-selected="false">
                            <i class="fas fa-calendar-alt me-2"></i>Events & Achievements
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="deanslist-tab" data-bs-toggle="tab" data-bs-target="#deanslist" type="button" role="tab" aria-controls="deanslist" aria-selected="false">
                            <i class="fas fa-award me-2"></i>Dean's List
                        </button>
                    </li>
                </ul>

                <div class="tab-content mt-4" id="updatesTabContent">
                    <!-- ANNOUNCEMENTS TAB -->
                    <div class="tab-pane fade show active" id="announcements" role="tabpanel" aria-labelledby="announcements-tab">
                        <div class="card p-4 mb-4">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Create New Announcement</h4>
                            <form id="createAnnouncementForm">
                                <div class="mb-3">
                                    <label for="announcementTitle" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="announcementTitle" placeholder="Enter announcement title" required>
                                </div>
                                <div class="mb-3">
                                    <label for="announcementContent" class="form-label">Content</label>
                                    <textarea class="form-control" id="announcementContent" rows="5" placeholder="Enter announcement content" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="announcementDate" class="form-label">Date</label>
                                    <input type="date" class="form-control" id="announcementDate" required>
                                </div>
                                <div class="mb-3">
                                    <label for="announcementImage" class="form-label">Image (optional)</label>
                                    <input type="file" class="form-control" id="announcementImage" accept="image/*">
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Create Announcement
                                </button>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Announcements</h4>
                            <div id="announcements-list" class="row row-cols-1 g-3">
                                <!-- Announcements will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- EVENTS & ACHIEVEMENTS TAB -->
                    <div class="tab-pane fade" id="events-achievements" role="tabpanel" aria-labelledby="events-achievements-tab">
                        <div class="card p-4 mb-4">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Create New Event/Achievement</h4>
                            <form id="createEventForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="eventTitle" class="form-label">Title</label>
                                        <input type="text" class="form-control" id="eventTitle" placeholder="Enter event/achievement title" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="eventType" class="form-label">Type</label>
                                        <select class="form-select" id="eventType" required>
                                            <option value="">Select type...</option>
                                            <option value="Event">Event</option>
                                            <option value="Achievement">Achievement</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="eventDescription" class="form-label">Description</label>
                                    <textarea class="form-control" id="eventDescription" rows="4" placeholder="Enter description" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="eventDate" class="form-label">Date</label>
                                    <input type="date" class="form-control" id="eventDate" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventImage" class="form-label">Image (optional)</label>
                                    <input type="file" class="form-control" id="eventImage" accept="image/*">
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Create Event/Achievement
                                </button>
                            </form>
                        </div>

                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Current Events & Achievements</h4>
                            <div id="events-list" class="row row-cols-1 g-3">
                                <!-- Events will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- DEAN'S LIST TAB -->
                    <div class="tab-pane fade" id="deanslist" role="tabpanel" aria-labelledby="deanslist-tab">
                        <div class="card p-4 mb-4">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Create New Dean's List Entry</h4>
                            <form id="createDeansListForm">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label for="deansListYear" class="form-label">Academic Year</label>
                                        <input type="text" class="form-control" id="deansListYear" placeholder="e.g., 2023-2024" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="deansListSemester" class="form-label">Semester</label>
                                        <select class="form-select" id="deansListSemester" required>
                                            <option value="">Select semester...</option>
                                            <option value="1st Semester">1st Semester</option>
                                            <option value="2nd Semester">2nd Semester</option>
                                            <option value="Summer">Summer</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="deansListFile" class="form-label">Upload PDF</label>
                                        <input type="file" class="form-control" id="deansListFile" accept=".pdf" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary mt-3">
                                    <i class="fas fa-upload me-2"></i>Upload Dean's List
                                </button>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Dean's List Entries</h4>
                            <div id="deanslist-list" class="row row-cols-1 row-cols-md-2 g-3">
                                <!-- Dean's lists will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Edit Announcement Modal -->
<div class="modal fade" id="editAnnouncementModal" tabindex="-1" aria-labelledby="editAnnouncementModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editAnnouncementModalLabel">Edit Announcement</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editAnnouncementForm">
                    <input type="hidden" id="editAnnouncementId">
                    <div class="mb-3">
                        <label for="editAnnouncementTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="editAnnouncementTitle" required>
                    </div>
                    <div class="mb-3">
                        <label for="editAnnouncementContent" class="form-label">Content</label>
                        <textarea class="form-control" id="editAnnouncementContent" rows="5" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="editAnnouncementDate" class="form-label">Date</label>
                        <input type="date" class="form-control" id="editAnnouncementDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="editAnnouncementImage" class="form-label">Replace Image (optional)</label>
                        <input type="file" class="form-control" id="editAnnouncementImage" accept="image/*">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="editAnnouncementForm" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<!-- Edit Event/Achievement Modal -->
<div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="editEventModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editEventModalLabel">Edit Event/Achievement</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editEventForm">
                    <input type="hidden" id="editEventId">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="editEventTitle" class="form-label">Title</label>
                            <input type="text" class="form-control" id="editEventTitle" required>
                        </div>
                        <div class="col-md-6">
                            <label for="editEventType" class="form-label">Type</label>
                            <select class="form-select" id="editEventType" required>
                                <option value="Event">Event</option>
                                <option value="Achievement">Achievement</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="editEventDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="editEventDescription" rows="4" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="editEventDate" class="form-label">Date</label>
                        <input type="date" class="form-control" id="editEventDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="editEventImage" class="form-label">Replace Image (optional)</label>
                        <input type="file" class="form-control" id="editEventImage" accept="image/*">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="editEventForm" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<!-- Status (Success / Failed) Modal -->
<div class="modal fade" id="statusModal" tabindex="-1" aria-labelledby="statusModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header" id="statusModalHeader">
                <h5 class="modal-title" id="statusModalLabel">Status</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="d-flex align-items-start gap-3">
                    <div class="fs-2" id="statusModalIcon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div>
                        <div class="fw-semibold" id="statusModalTitle">Status</div>
                        <div class="text-muted" id="statusModalMessage">...</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
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
                    <p id="confirmationMessage">Are you sure you want to remove this item?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmActionBtn">Remove</button>
            </div>
        </div>
    </div>
</div>
