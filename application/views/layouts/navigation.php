<nav class="navbar navbar-expand-lg navbar-main">
    <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
            aria-label="Toggle navigation menu" aria-controls="mainNav" aria-expanded="false">
            <span class="navbar-toggler-icon"></span>
            <span class="visually-hidden">Menu</span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item"><a class="nav-link active" href="<?php echo site_url('/'); ?>">Home</a></li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="aboutSubDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        About
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="aboutSubDropdown">
                        <li><a class="dropdown-item" href="<?php echo site_url('about'); ?>#history">History</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('about'); ?>#vmgo">VMGO</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('about'); ?>#hymn">Hymn</a></li>
                    </ul>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="<?php echo site_url('faculty'); ?>">Faculty</a>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="academicsDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Academics
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="academicsDropdown">
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('academics'); ?>#programs-section">Programs
                                Offerings</a></li>
                        <?php if ($this->session->userdata('logged_in')): ?>
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('academics'); ?>#curriculum-section">Curriculum</a>
                        </li>
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('academics'); ?>#schedule-section">Class Schedule</a>
                        </li>
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('academics'); ?>#calendar-section">Academic
                                Calendar</a></li>
                        <?php endif; ?>
                    </ul>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="updatesDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        News & Updates
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="updatesDropdown">
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('updates'); ?>#announcements-section">Announcements</a></li>
                        <li><a class="dropdown-item"
                                href="<?php echo site_url('updates'); ?>#events-achievements-section">Events &
                                Achievements</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('updates'); ?>#deanslist-section">Dean's
                                List</a></li>
                    </ul>
                </li>

                <?php if ($this->session->userdata('logged_in')): ?>
                <li class="nav-item">
                    <a class="nav-link" href="<?php echo site_url('forms'); ?>">Forms</a>
                </li>
                <?php endif; ?>

                <?php if ($this->session->userdata('logged_in')): ?>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="organizationDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Organization
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="organizationDropdown">
                        <li><a class="dropdown-item" href="<?php echo site_url('organization'); ?>#the-legion">The
                                Legion</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('organization'); ?>#cs-guild">CS
                                Guild</a></li>
                    </ul>
                </li>
                <?php endif; ?>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="alumniDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Alumni
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="alumniDropdown">
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#featured-section">Featured
                                Alumni</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#directory-section">Alumni
                                Directory</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#success-section">Success
                                Stories</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#events-section">Alumni
                                Events</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#giveback-section">How to
                                Give Back</a></li>
                        <li><a class="dropdown-item" href="<?php echo site_url('alumni'); ?>#update-form-section">Update
                                Your Information</a></li>
                    </ul>
                </li>


                <li class="nav-item" id="user-info-item" style="display: none;">
                    <span class="nav-link user-info-text" style="color: var(--primary-purple);">
                        <i class="fas fa-user me-1"></i><span id="user-name"></span> (<span id="user-role"></span>)
                    </span>
                </li>
            </ul>
        </div>
    </div>
</nav>