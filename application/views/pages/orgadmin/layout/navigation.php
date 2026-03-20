<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<nav class="admin-nav navbar navbar-expand-lg">
    <div class="container">
        <button class="navbar-toggler admin-nav-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#orgAdminNavMenu" aria-controls="orgAdminNavMenu" aria-expanded="false" aria-label="Toggle organization admin navigation">
            <span class="admin-nav-toggler-icon"><i class="fas fa-bars"></i></span>
            <span class="admin-nav-toggler-label">Sections</span>
        </button>
        <div class="collapse navbar-collapse" id="orgAdminNavMenu">
            <ul class="nav nav-pills navbar-nav admin-nav-list">
                <li class="nav-item">
                    <a class="nav-link active" href="#dashboard"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#officers"><i class="fas fa-users me-2"></i>Officers</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#advisers"><i class="fas fa-user-tie me-2"></i>Advisers</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#announcements"><i class="fas fa-bullhorn me-2"></i>Announcements</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#happenings"><i class="fas fa-images me-2"></i>Happenings</a>
                </li>
                <li class="nav-item ms-lg-auto">
                    <a class="nav-link return-btn" href="<?php echo site_url('organization#' . str_replace('_', '-', $organization_slug)); ?>">
                        <i class="fas fa-globe me-2"></i>View Public Site
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
