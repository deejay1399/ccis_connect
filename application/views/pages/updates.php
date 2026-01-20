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

        <!-- Dean's List Section -->
        <section id="deanslist-section" class="content-section">
            <div class="content-card">
                <div class="section-header">
                    <h3><i class="fas fa-award me-3"></i>Dean's List Achievers</h3>
                    <div class="content-controls">
                        <!-- Academic Year Filter -->
                        <div class="academic-year-filter">
                            <!-- This will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
                
                <!-- Filter Buttons Container -->
                <div class="deanslist-filters">
                    <!-- Program and Year Level filters will be populated by JavaScript -->
                </div>
                
                <div class="deanslist-content" id="deanslist-content">
                    <!-- Dean's List content will be loaded here -->
                </div>
            </div>
        </section>
    </div>
</section>
