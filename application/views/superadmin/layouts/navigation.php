<?php
$seg1 = strtolower((string) $this->uri->segment(1));
$seg2 = strtolower((string) $this->uri->segment(2));
$seg3 = strtolower((string) $this->uri->segment(3));

$activeSection = 'dashboard-home';
if ($seg1 === 'admin' && $seg2 === 'content') {
    $activeSection = 'content-management';
} elseif ($seg1 === 'admin' && $seg2 === 'users') {
    $activeSection = 'user-management';
} elseif ($seg1 === 'admin' && $seg2 === 'dashboard') {
    $activeSection = 'dashboard-home';
}
?>
<nav class="navbar navbar-expand-lg navbar-main">
        <div class="container">
            <div class="notification-wrapper" id="notification-wrapper">
                <a href="#" class="auth-icon-link" id="notification-bell" title="Notifications" aria-label="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge" id="dashboard-notification-badge" style="display: none;">0</span>
                </a>
                <div class="notification-dropdown" id="notification-dropdown">
                    <div class="notification-header">
                        <h6><i class="fas fa-bell me-1"></i>Notifications</h6>
                        <button class="btn btn-sm btn-outline-secondary" id="mark-all-notifications" type="button">
                            Mark all read
                        </button>
                    </div>
                    <div class="notification-list" id="notification-list">
                        <div class="notification-empty">
                            <i class="fas fa-bell-slash"></i>
                            <p>No new notifications</p>
                        </div>
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
                        <a class="nav-link <?php echo $activeSection === 'dashboard-home' ? 'active' : ''; ?>" href="<?php echo site_url('admin'); ?>#dashboard-home" data-section="dashboard-home">
                            <i class="fas fa-home me-1"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $activeSection === 'content-management' ? 'active' : ''; ?>" href="<?php echo site_url('admin'); ?>#content-management" data-section="content-management">
                            <i class="fas fa-edit me-1"></i>Content Management
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $activeSection === 'user-management' ? 'active' : ''; ?>" href="<?php echo site_url('admin'); ?>#user-management" data-section="user-management">
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
