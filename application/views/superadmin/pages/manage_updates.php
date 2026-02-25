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
                            <i class="fas fa-bullhorn me-2"></i>Announcements
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
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Add New Announcement</h4>
                            <form id="addAnnouncementForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="announcementTitle" class="form-label">Title</label>
                                        <input type="text" class="form-control" id="announcementTitle" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="announcementDate" class="form-label">Date</label>
                                        <input type="date" class="form-control" id="announcementDate" required>
                                    </div>
                                    <div class="col-12">
                                        <label for="announcementDescription" class="form-label">Description</label>
                                        <textarea class="form-control" id="announcementDescription" rows="3" required></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="announcementVenue" class="form-label">Venue (Optional)</label>
                                        <input type="text" class="form-control" id="announcementVenue">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="announcementTime" class="form-label">Time (Optional)</label>
                                        <input type="text" class="form-control" id="announcementTime" placeholder="e.g., 8:00 AM - 5:00 PM">
                                    </div>
                                    <div class="col-12">
                                        <label for="announcementPdfFile" class="form-label">PDF File (Optional)</label>
                                        <input type="file" class="form-control" id="announcementPdfFile" accept=".pdf">
                                    </div>
                                    <div class="col-12">
                                        <label for="announcementImage" class="form-label">Image (Optional)</label>
                                        <input type="file" class="form-control" id="announcementImage" accept="image/*" multiple>
                                        <div id="addAnnouncementImagePreview" class="mt-2"></div>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">Add Announcement</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Existing Announcements</h4>
                            <div id="announcementsList" class="row g-4">
                                <!-- Announcements will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- EVENTS & ACHIEVEMENTS TAB -->
                    <div class="tab-pane fade" id="events-achievements" role="tabpanel" aria-labelledby="events-achievements-tab">
                        <div class="card p-4 mb-4">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Add New Event/Achievement</h4>
                            <form id="addEventAchievementForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="eventTitle" class="form-label">Title</label>
                                        <input type="text" class="form-control" id="eventTitle" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="eventDate" class="form-label">Date</label>
                                        <input type="date" class="form-control" id="eventDate" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="eventTime" class="form-label">Time</label>
                                        <input type="text" class="form-control" id="eventTime" placeholder="e.g., 8:00 AM - 5:00 PM" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="eventLocation" class="form-label">Location/Event</label>
                                        <input type="text" class="form-control" id="eventLocation" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="eventTeam" class="form-label">Team/Student (Optional)</label>
                                        <input type="text" class="form-control" id="eventTeam" placeholder="e.g., Code Warriors Team">
                                    </div>
                                    <div class="col-12">
                                        <label for="eventDescription" class="form-label">Description</label>
                                        <textarea class="form-control" id="eventDescription" rows="3" required></textarea>
                                    </div>
                                    <div class="col-12">
                                        <label for="eventImage" class="form-label">Upload Image</label>
                                        <input type="file" class="form-control" id="eventImage" accept="image/*" multiple>
                                        <div id="addEventImagePreview" class="mt-2"></div>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">Add Event/Achievement</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Existing Events & Achievements</h4>
                            <div id="eventsAchievementsList" class="row g-4">
                                <!-- Events will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- DEAN'S LIST TAB -->
                    <div class="tab-pane fade" id="deanslist" role="tabpanel" aria-labelledby="deanslist-tab">
                        <div class="card p-4 mb-4">
                            <h4 class="mb-3"><i class="fas fa-plus-circle me-2"></i>Add Dean's List Achiever</h4>
                            <form id="addAchieverForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="deanlistAcademicYear" class="form-label">Academic Year</label>
                                        <input type="text" class="form-control" id="deanlistAcademicYear" placeholder="e.g., 2024-2025" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="achieverName" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="achieverName" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="achieverProgram" class="form-label">Program</label>
                                        <select class="form-select" id="achieverProgram" required>
                                            <option value="BSCS">BSCS</option>
                                            <option value="BSIT">BSIT</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="achieverYear" class="form-label">Year Level</label>
                                        <select class="form-select" id="achieverYear" required>
                                            <option value="1">First Year</option>
                                            <option value="2">Second Year</option>
                                            <option value="3">Third Year</option>
                                            <option value="4">Fourth Year</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="achieverHonors" class="form-label">Honors</label>
                                        <select class="form-select" id="achieverHonors" required>
                                            <option value="Cum Laude">Cum Laude</option>
                                            <option value="Magna Cum Laude">Magna Cum Laude</option>
                                            <option value="Summa Cum Laude">Summa Cum Laude</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="achieverGWA" class="form-label">GWA (General Weighted Average)</label>
                                        <input type="number" step="0.01" class="form-control" id="achieverGWA" required>
                                    </div>
                                    <div class="col-12">
                                        <label for="achieverAchievements" class="form-label">Notable Achievements (Separate with commas)</label>
                                        <textarea class="form-control" id="achieverAchievements" rows="3" placeholder="e.g., President of CS Guild, Research Paper Presenter, Coding Competition Winner"></textarea>
                                    </div>
                                    <div class="col-12">
                                        <label for="achieverImage" class="form-label">Upload Image</label>
                                        <input type="file" class="form-control" id="achieverImage" accept="image/*">
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn btn-primary">Add Achiever</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="forms-management-section">
                            <h4 class="mb-3"><i class="fas fa-list-ul me-2"></i>Dean's List</h4>
                            <div id="academicYearsList" class="row g-4">
                                <!-- Dean's list achievers will be loaded here -->
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
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="editAnnouncementTitle" class="form-label">Title</label>
                            <input type="text" class="form-control" id="editAnnouncementTitle" required>
                        </div>
                        <div class="col-md-6">
                            <label for="editAnnouncementDate" class="form-label">Date</label>
                            <input type="date" class="form-control" id="editAnnouncementDate" required>
                        </div>
                        <div class="col-12">
                            <label for="editAnnouncementDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="editAnnouncementDescription" rows="3" required></textarea>
                        </div>
                        <div class="col-md-6">
                            <label for="editAnnouncementVenue" class="form-label">Venue (Optional)</label>
                            <input type="text" class="form-control" id="editAnnouncementVenue">
                        </div>
                        <div class="col-md-6">
                            <label for="editAnnouncementTime" class="form-label">Time (Optional)</label>
                            <input type="text" class="form-control" id="editAnnouncementTime" placeholder="e.g., 8:00 AM - 5:00 PM">
                        </div>
                        <div class="col-12">
                            <label for="editAnnouncementPdfFile" class="form-label">Update PDF File (Optional)</label>
                            <input type="file" class="form-control" id="editAnnouncementPdfFile" accept=".pdf">
                            <div id="editAnnouncementPdfPreview"></div>
                        </div>
                        <div class="col-12">
                            <label for="editAnnouncementImage" class="form-label">Update Image (Optional)</label>
                            <input type="file" class="form-control" id="editAnnouncementImage" accept="image/*" multiple>
                            <div id="editAnnouncementImagePreview"></div>
                            <div id="editAnnouncementSelectedImagesPreview" class="mt-2"></div>
                        </div>
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
                            <label for="editEventDate" class="form-label">Date</label>
                            <input type="date" class="form-control" id="editEventDate" required>
                        </div>
                        <div class="col-md-6">
                            <label for="editEventTime" class="form-label">Time</label>
                            <input type="text" class="form-control" id="editEventTime" placeholder="e.g., 8:00 AM - 5:00 PM" required>
                        </div>
                        <div class="col-md-6">
                            <label for="editEventLocation" class="form-label">Location/Event</label>
                            <input type="text" class="form-control" id="editEventLocation" required>
                        </div>
                        <div class="col-md-6">
                            <label for="editEventTeam" class="form-label">Team/Student (Optional)</label>
                            <input type="text" class="form-control" id="editEventTeam" placeholder="e.g., Code Warriors Team">
                        </div>
                        <div class="col-12">
                            <label for="editEventDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="editEventDescription" rows="3" required></textarea>
                        </div>
                        <div class="col-12">
                            <label for="editEventImage" class="form-label">Update Image (Optional)</label>
                            <input type="file" class="form-control" id="editEventImage" accept="image/*" multiple>
                            <div id="editEventImagePreview"></div>
                            <div id="editEventSelectedImagesPreview" class="mt-2"></div>
                        </div>
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

<!-- Notification Modal -->
<div class="modal fade" id="noticeModal" tabindex="-1" aria-labelledby="noticeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="noticeModalLabel">Notice</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0" id="noticeModalMessage">Message</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal fade confirmation-modal" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">Confirm Action</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle confirmation-icon"></i>
                <p id="confirmationMessage">Are you sure you want to remove this item?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmActionBtn">Remove</button>
            </div>
        </div>
    </div>
</div>
