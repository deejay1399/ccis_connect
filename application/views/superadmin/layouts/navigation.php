<nav class="navbar navbar-expand-lg navbar-main">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" 
                    aria-label="Toggle navigation menu" aria-controls="mainNav" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
                <span class="visually-hidden">Menu</span>
            </button>
            
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="<?php echo site_url('admin'); ?>#dashboard-home" data-section="dashboard-home">
                            <i class="fas fa-home me-1"></i>Dashboard Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo site_url('admin'); ?>#content-management" data-section="content-management">
                            <i class="fas fa-edit me-1"></i>Content Management
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo site_url('admin'); ?>#user-management" data-section="user-management">
                            <i class="fas fa-users-cog me-1"></i>User Accounts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo site_url('home'); ?>" id="view-public-site-link">
                            <i class="fas fa-external-link-alt me-1"></i>View Public Site
                        </a>
                    </li>
                </ul>
                <!-- Date Display in Navigation -->
                <div class="nav-date" id="nav-date">
                    <i class="fas fa-calendar-alt me-1"></i>
                    <span id="current-date"></span>
                </div>
            </div>
        </div>
    </nav>
