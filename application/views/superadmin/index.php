    <div class="container py-4 py-md-5 dashboard-bg">
        <!-- Main Content (Same as before) -->
        <div class="row g-4">
            <main class="col-12">
                <!-- Dashboard Home Section -->
                <div class="dashboard-card content-section active" id="dashboard-home">
                    <h3 class="card-title"><i class="fas fa-home me-2"></i>Dashboard Overview</h3>
                    <p class="card-subtitle">Welcome to the Super Admin Control Panel. Manage all aspects of the CCIS website from here.</p>
                    
                    <!-- Quick Stats Row -->
                    <div class="quick-stats-row mb-4">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="stat-card stat-mentor">
                                    <div class="stat-icon">
                                        <i class="fas fa-handshake"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h4 id="stat-mentor-count">0</h4>
                                        <p>Mentor Requests</p>
                                        <small><i class="fas fa-clock me-1"></i><span id="stat-mentor-new">0 new</span></small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card stat-chatbot">
                                    <div class="stat-icon">
                                        <i class="fas fa-robot"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h4 id="stat-chatbot-count">0</h4>
                                        <p>Chatbot Inquiries</p>
                                        <small><i class="fas fa-clock me-1"></i><span id="stat-chatbot-new">0 new</span></small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card stat-connection">
                                    <div class="stat-icon">
                                        <i class="fas fa-user-friends"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h4 id="stat-connection-count">0</h4>
                                        <p>Connection Requests</p>
                                        <small><i class="fas fa-clock me-1"></i><span id="stat-connection-new">0 new</span></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Management Overview -->
                    <div class="section-overview mb-5">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="overview-title">
                                <i class="fas fa-edit me-2"></i>Content Management
                            </h4>
                            <a href="#" class="btn btn-outline-primary btn-sm" data-section="content-management">
                                View Full Section <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6 col-lg-3">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-camera"></i>
                                    </div>
                                    <h6>Homepage</h6>
                                    <p>Carousel, welcome message, programs</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-bullhorn"></i>
                                    </div>
                                    <h6>Updates</h6>
                                    <p>Announcements, Events & Achievements and Dean's List</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-graduation-cap"></i>
                                    </div>
                                    <h6>Academics</h6>
                                    <p>Programs, curriculum PDFs, class schedules PDFs, and academic calendar PDFs.</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-chalkboard-teacher"></i>
                                    </div>
                                    <h6>Faculty</h6>
                                    <p>Profiles, Positions.</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 additional-overview-card" style="display: none;">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-flag"></i>
                                    </div>
                                    <h6>About Us</h6>
                                    <p>History, VMGO, Hymn</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 additional-overview-card" style="display: none;">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <h6>Forms</h6>
                                    <p>Download PDFs management</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 additional-overview-card" style="display: none;">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-sitemap"></i>
                                    </div>
                                    <h6>Organizations</h6>
                                    <p>CSGuild & The Legion</p>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 additional-overview-card" style="display: none;">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-user-graduate"></i>
                                    </div>
                                    <h6>Alumni</h6>
                                    <p>Alumni management</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- User Accounts Overview -->
                    <div class="section-overview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="overview-title">
                                <i class="fas fa-users-cog me-2"></i>User Account Management
                            </h4>
                            <a href="#" class="btn btn-outline-primary btn-sm" data-section="user-management">
                                View Full Section <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <h6>Create Accounts</h6>
                                    <p>Create new organization admin accounts</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="overview-feature-card">
                                    <div class="overview-feature-icon gold-icon">
                                        <i class="fas fa-list-ul"></i>
                                    </div>
                                    <h6>Manage Admins</h6>
                                    <p>View and manage all organization admins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Management Section -->
                <div class="dashboard-card content-section" id="content-management">
                    <h3 class="card-title"><i class="fas fa-edit me-2"></i>Content Management</h3>
                    <p class="card-subtitle">Update the public website's content.</p>
                    <div class="row g-3">
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-camera"></i>
                                </div>
                                <h5>Homepage</h5>
                                <p>Carousel, welcome message, academic programs.</p>
                                <a href="<?php echo site_url('admin/content/homepage'); ?>" class="btn btn-primary" id="manage-homepage-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-bullhorn"></i>
                                </div>
                                <h5>Updates</h5>
                                <p>Announcements, Events & Achievements and Dean's List.</p>
                                <a href="<?php echo site_url('admin/content/updates'); ?>" class="btn btn-primary" id="manage-updates-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <h5>Academics</h5>
                                <p>Programs, curriculum PDFs, class schedules PDFs, and academic calendar PDFs.</p>
                                <a href="<?php echo site_url('admin/content/academics'); ?>" class="btn btn-primary" id="manage-academics-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-flag"></i>
                                </div>
                                <h5>About Us</h5>
                                <p>Update college history, VMGO, and the BISU Hymn with lyrics and an audio file.</p>
                                <a href="<?php echo site_url('admin/content/about'); ?>" class="btn btn-primary" id="manage-about-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                </div>
                                <h5>Faculty</h5>
                                <p>Profiles, Positions.</p>
                                <a href="<?php echo site_url('admin/content/faculty'); ?>" class="btn btn-primary" id="manage-faculty-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <h5>Forms</h5>
                                <p>Upload and Remove downloadable forms (PDFs).</p>
                                <a href="<?php echo site_url('admin/content/forms'); ?>" class="btn btn-primary" id="manage-forms-btn">Open Editor</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-sitemap"></i>
                                </div>
                                <h5>Organizations</h5>
                                <p>Monitor posts from organization admins (CSGuild, The Legion) for accountability.</p>
                                <a href="<?php echo site_url('admin/content/organizations'); ?>" class="btn btn-primary" id="manage-organizations-btn">Open Manager</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <h5>Alumni Management</h5>
                                <p>Manage alumni submissions, mentor requests, chatbot inquiries, and featured alumni.</p>
                                <a href="<?php echo site_url('admin/content/alumni'); ?>" class="btn btn-primary" id="manage-alumni-btn">Open Manager</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Management Section -->
                <div class="dashboard-card content-section" id="user-management">
                    <h3 class="card-title"><i class="fas fa-users-cog me-2"></i>User Account Management</h3>
                    <p class="card-subtitle">Manage all organization admin accounts for CSGuild and The Legion.</p>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <h5>Create Accounts</h5>
                                <p>Create new organization admin accounts.</p>
                                <a href="<?php echo site_url('admin/users/create'); ?>" class="btn btn-primary" id="create-user-btn">Create Account</a>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="feature-card">
                                <div class="feature-icon gold-icon">
                                    <i class="fas fa-list-ul"></i>
                                </div>
                                <h5>Manage Admins</h5>
                                <p>View and manage all organization admins</p>
                                <a href="<?php echo site_url('admin/users/list'); ?>" class="btn btn-primary" id="list-users-btn">View All Admins</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>