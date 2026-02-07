<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<nav class="admin-nav">
    <div class="container">
        <ul class="nav nav-pills">
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
            <li class="nav-item ms-auto">
                <a class="nav-link return-btn" href="<?php echo site_url('organization#' . str_replace('_', '-', $organization_slug)); ?>">
                    <i class="fas fa-globe me-2"></i>View Public Site
                </a>
            </li>
        </ul>
    </div>
</nav>

