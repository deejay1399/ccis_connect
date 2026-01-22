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
                            <i class="fas fa-handshake me-2"></i>Mentor Requests
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="chatbot-tab" data-bs-toggle="tab" data-bs-target="#chatbot-content" type="button" role="tab">
                            <i class="fas fa-robot me-2"></i>Chatbot Inquiries
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="connection-tab" data-bs-toggle="tab" data-bs-target="#connection-content" type="button" role="tab">
                            <i class="fas fa-user-friends me-2"></i>Connection Requests
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="updates-tab" data-bs-toggle="tab" data-bs-target="#updates-content" type="button" role="tab">
                            <i class="fas fa-newspaper me-2"></i>Alumni Updates
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="giveback-tab" data-bs-toggle="tab" data-bs-target="#giveback-content" type="button" role="tab">
                            <i class="fas fa-heart me-2"></i>Give Back
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="featured-tab" data-bs-toggle="tab" data-bs-target="#featured-content" type="button" role="tab">
                            <i class="fas fa-star me-2"></i>Featured Alumni
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="directory-tab" data-bs-toggle="tab" data-bs-target="#directory-content" type="button" role="tab">
                            <i class="fas fa-address-book me-2"></i>Directory
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="stories-tab" data-bs-toggle="tab" data-bs-target="#stories-content" type="button" role="tab">
                            <i class="fas fa-book me-2"></i>Success Stories
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#events-content" type="button" role="tab">
                            <i class="fas fa-calendar me-2"></i>Events
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="alumniTabContent">
                    <!-- Mentor Requests Tab -->
                    <div class="tab-pane fade show active" id="mentor-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-handshake me-2"></i>Mentor Volunteers</h4>
                            <p class="text-muted">Alumni willing to mentor current students</p>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Field of Expertise</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="mentor-table-body">
                                    <!-- Mentor records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-mentor-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No mentor requests yet</p>
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
                                        <th>Status</th>
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
                                        <th>To</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                        <th>Status</th>
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

                    <!-- Alumni Updates Tab -->
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
                                    <!-- Update records will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="no-data" id="no-updates-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No alumni updates yet</p>
                        </div>
                    </div>

                    <!-- Give Back Tab -->
                    <div class="tab-pane fade" id="giveback-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-heart me-2"></i>Give Back Submissions</h4>
                            <p class="text-muted">Alumni giving back to the community</p>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Author</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
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
                                <i class="fas fa-plus me-1"></i>Add Directory Entry
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

                    <!-- Success Stories Tab -->
                    <div class="tab-pane fade" id="stories-content" role="tabpanel">
                        <div class="tab-header mt-4 mb-4">
                            <h4><i class="fas fa-book me-2"></i>Success Stories</h4>
                            <p class="text-muted">Inspiring stories from alumni</p>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addStoryModal">
                                <i class="fas fa-plus me-1"></i>Add Success Story
                            </button>
                        </div>
                        <div class="row g-3" id="stories-grid">
                            <!-- Success story cards will be loaded here -->
                        </div>
                        <div class="no-data" id="no-stories-data">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p>No success stories yet</p>
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
<!-- Add Featured Alumni Modal -->
<div class="modal fade" id="addFeaturedModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-star me-2"></i>Add Featured Alumni</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addFeaturedForm">
                    <div class="mb-3">
                        <label for="featuredName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="featuredName" required>
                    </div>
                    <div class="mb-3">
                        <label for="featuredPosition" class="form-label">Position/Achievement</label>
                        <input type="text" class="form-control" id="featuredPosition" required>
                    </div>
                    <div class="mb-3">
                        <label for="featuredBio" class="form-label">Biography</label>
                        <textarea class="form-control" id="featuredBio" rows="3" required></textarea>
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

<!-- Add Directory Entry Modal -->
<div class="modal fade" id="addDirectoryModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Add Directory Entry</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addDirectoryForm">
                    <div class="mb-3">
                        <label for="dirName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="dirName" required>
                    </div>
                    <div class="mb-3">
                        <label for="dirBatch" class="form-label">Batch/Year</label>
                        <input type="text" class="form-control" id="dirBatch" required>
                    </div>
                    <div class="mb-3">
                        <label for="dirEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="dirEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="dirPhone" class="form-label">Phone</label>
                        <input type="tel" class="form-control" id="dirPhone" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addDirectoryForm" class="btn btn-primary">Add Entry</button>
            </div>
        </div>
    </div>
</div>

<!-- Add Success Story Modal -->
<div class="modal fade" id="addStoryModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-book me-2"></i>Add Success Story</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addStoryForm">
                    <div class="mb-3">
                        <label for="storyTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="storyTitle" required>
                    </div>
                    <div class="mb-3">
                        <label for="storyAuthor" class="form-label">Author</label>
                        <input type="text" class="form-control" id="storyAuthor" required>
                    </div>
                    <div class="mb-3">
                        <label for="storyContent" class="form-label">Story</label>
                        <textarea class="form-control" id="storyContent" rows="5" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addStoryForm" class="btn btn-primary">Add Story</button>
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
