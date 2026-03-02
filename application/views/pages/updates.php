<!-- News & Updates Page Content -->
<section class="updates-section">
    <div class="container">
        <!-- Announcements Section -->
        <section id="announcements-section" class="content-section active-section">
            <div class="content-card">
                <div class="section-header">
                    <h3><i class="fas fa-bullhorn me-3"></i>Announcements</h3>
                    <div class="content-controls">
                        <div class="items-count" id="announcements-count">2 announcements</div>
                        <div class="view-options">
                            <button class="view-btn active" data-type="announcements" data-sort="latest">
                                <i class="fas fa-sort-amount-down me-1"></i>Latest
                            </button>
                            <button class="view-btn" data-type="announcements" data-sort="oldest">
                                <i class="fas fa-sort-amount-up me-1"></i>Oldest
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="announcements-container" id="announcements-container">
                    <!-- Announcements will be loaded dynamically -->
                </div>
                
                <!-- Pagination -->
                <div class="pagination-container" id="announcements-pagination">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </section>

        <!-- Events & Achievements Section -->
        <section id="events-achievements-section" class="content-section">
            <div class="content-card">
                <div class="section-header">
                    <h3><i class="fas fa-calendar-alt me-3"></i>Events & Achievements</h3>
                    <div class="content-controls">
                        <div class="items-count" id="events-count">2 events</div>
                        <div class="view-options">
                            <button class="view-btn active" data-type="events" data-sort="latest">
                                <i class="fas fa-sort-amount-down me-1"></i>Latest
                            </button>
                            <button class="view-btn" data-type="events" data-sort="oldest">
                                <i class="fas fa-sort-amount-up me-1"></i>Oldest
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="events-container" id="events-container">
                    <!-- Events & Achievements will be loaded dynamically -->
                </div>
                
                <!-- Pagination -->
                <div class="pagination-container" id="events-pagination">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </section>

        <!-- Dean's List Section (PDF list) -->
        <section id="deanslist-section" class="content-section">
            <div class="content-card">
                <div class="section-header">
                    <h3><i class="fas fa-award me-3"></i>Dean's List</h3>
                    <div class="content-controls">
                        <!-- Academic Year Filter (populated by JS) -->
                        <div class="academic-year-filter"></div>
                    </div>
                </div>

                <div class="deanslist-filters">
                    <!-- Program and Year Level filters will be populated by JS -->
                </div>

                <div class="deanslist-content" id="deanslist-content">
                    <!-- Dean's List PDFs will be loaded here -->
                </div>
            </div>
        </section>
    </div>
</section>

<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">Image Preview</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <div class="image-modal-container">
                    <button class="image-nav-btn prev-btn" id="prevImageBtn" type="button" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img id="modalImage" src="" alt="" class="img-fluid">
                    <button class="image-nav-btn next-btn" id="nextImageBtn" type="button" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <p id="modalCaption" class="mt-3 text-muted"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
