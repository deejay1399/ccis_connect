<nav class="navbar navbar-expand-lg navbar-main">
        <div class="container">
            <!-- Notification Bell on LEFT SIDE of navbar -->
            <div class="notification-wrapper me-2" id="notification-wrapper">
                <a href="javascript:void(0)" class="nav-link auth-icon-link" id="notification-bell" title="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge" id="dashboard-notification-badge" style="display: none;">0</span>
                </a>
                <div class="notification-dropdown" id="notification-dropdown">
                    <div class="notification-header">
                        <h6><i class="fas fa-bell me-2"></i>Notifications</h6>
                        <button class="btn btn-sm btn-outline-primary" id="mark-all-notifications">Mark All Read</button>
                    </div>
                    <div class="notification-list" id="notification-list">
                        <!-- Notifications will be loaded here -->
                        <div class="notification-empty">
                            <i class="fas fa-bell-slash"></i>
                            <p>No new notifications</p>
                        </div>
                    </div>
                    <div class="notification-footer">
                        <a href="<?php echo site_url('admin'); ?>" class="view-all-link">View All Notifications</a>
                    </div>
                </div>
            </div>
            
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
                        <a class="nav-link" href="<?php echo site_url('/'); ?>" id="view-public-site-link">
                            <i class="fas fa-external-link-alt me-1"></i>View Public Site
                        </a>
                    </li>
                    <li class="nav-item" id="user-info-item">
                        <span class="nav-link user-info-text" style="color: var(--primary-purple);">
                            <i class="fas fa-user me-1"></i><span id="user-name"></span>
                        </span>
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