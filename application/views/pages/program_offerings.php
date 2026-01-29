<section class="academics-section">
        <div class="container">
            <section id="programs-section" class="content-section active-section">
                <div class="content-card">
                    <h3><i class="fas fa-graduation-cap me-3"></i>Programs Offered</h3>
                    
                    <div class="programs-grid" id="programs-grid">
                        <!-- Programs loaded from database -->
                        <?php if (!empty($programs)): ?>
                            <?php 
                                // Map program names to appropriate icons
                                $iconMap = array(
                                    'BSCS' => 'fas fa-laptop-code',
                                    'BSIT' => 'fas fa-network-wired',
                                    'Computer Science' => 'fas fa-laptop-code',
                                    'Information Technology' => 'fas fa-network-wired'
                                );
                                
                                foreach ($programs as $program): 
                                    // Determine icon
                                    $icon = 'fas fa-graduation-cap';
                                    foreach ($iconMap as $keyword => $iconClass) {
                                        if (stripos($program['program_name'], $keyword) !== false) {
                                            $icon = $iconClass;
                                            break;
                                        }
                                    }
                                    
                                    // Parse career opportunities if it's a comma-separated string
                                    $careers = array();
                                    if (!empty($program['career_opportunities'])) {
                                        $careers = array_map('trim', explode(',', $program['career_opportunities']));
                                    }
                            ?>
                                <div class="program-card detailed">
                                    <div class="program-header">
                                        <i class="<?php echo htmlspecialchars($icon); ?>"></i>
                                        <h4><?php echo htmlspecialchars($program['program_name']); ?></h4>
                                    </div>
                                    <div class="program-details">
                                        <p><strong>Program Description:</strong> <?php echo htmlspecialchars($program['description']); ?></p>
                                        <p class="program-duration"><strong>Duration:</strong> <?php echo htmlspecialchars($program['duration_years']); ?> years</p>
                                        <?php if (!empty($careers)): ?>
                                            <div class="program-features">
                                                <h5>Career Opportunities:</h5>
                                                <ul>
                                                    <?php foreach ($careers as $career): ?>
                                                        <li><?php echo htmlspecialchars(trim($career)); ?></li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="program-card">
                                <p>No programs available at this time.</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>

            <section id="curriculum-section" class="content-section">
                <div class="content-card">
                    <h3><i class="fas fa-book-open me-3"></i>Curriculum</h3>
                    
                    <?php if (!empty($curricula)): ?>
                        <div class="program-tabs">
                            <div class="tab-nav">
                                <?php foreach ($curricula as $index => $curriculum): ?>
                                    <button class="tab-btn <?php echo $index === 0 ? 'active' : ''; ?>" data-tab="curriculum-<?php echo htmlspecialchars($curriculum['program']); ?>">
                                        <?php echo htmlspecialchars($curriculum['program']); ?> Curriculum
                                    </button>
                                <?php endforeach; ?>
                            </div>
                            
                            <div class="tab-content">
                                <?php foreach ($curricula as $index => $curriculum): ?>
                                    <div class="tab-pane <?php echo $index === 0 ? 'active' : ''; ?>" id="curriculum-<?php echo htmlspecialchars($curriculum['program']); ?>-tab">
                                        <div class="pdf-viewer-container">
                                            <div id="<?php echo htmlspecialchars($curriculum['program']); ?>-pdf-placeholder">
                                                <div class="pdf-placeholder">
                                                    <i class="fas fa-file-pdf pdf-icon"></i>
                                                    <h4><?php echo htmlspecialchars($curriculum['program']); ?> Curriculum</h4>
                                                    <p>View the complete <?php echo htmlspecialchars($curriculum['program']); ?> curriculum including all subjects and course requirements.</p>
                                                    <div class="button-group-tapad mt-4">
                                                        <button class="btn btn-view-pdf me-2 view-curriculum-pdf" data-program="<?php echo htmlspecialchars($curriculum['program']); ?>" data-file-url="<?php echo htmlspecialchars($curriculum['file_url']); ?>">
                                                            <i class="fas fa-eye me-1"></i>View PDF
                                                        </button>
                                                        <button class="btn btn-download-pdf curriculum-download" data-file-url="<?php echo htmlspecialchars($curriculum['file_url']); ?>">
                                                            <i class="fas fa-download me-1"></i>Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div id="<?php echo htmlspecialchars($curriculum['program']); ?>-pdfEmbedContainer" style="display: none;">
                                                <div class="pdf-embed-container">
                                                    <div class="pdf-header">
                                                        <h5><?php echo htmlspecialchars($curriculum['program']); ?> Curriculum</h5>
                                                        <button class="btn btn-sm btn-outline-light close-pdf close-curriculum-pdf" data-program="<?php echo htmlspecialchars($curriculum['program']); ?>">
                                                            <i class="fas fa-times me-1"></i>Close
                                                        </button>
                                                    </div>
                                                    <div class="pdf-frame-container">
                                                        <iframe id="<?php echo htmlspecialchars($curriculum['program']); ?>-pdfFrame" src="<?php echo htmlspecialchars($curriculum['file_url']); ?>" width="100%" height="600px" frameborder="0"></iframe>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>No curricula available</strong> at this time.
                        </div>
                    <?php endif; ?>
                </div>
            </section>

            <section id="schedule-section" class="content-section">
                <div class="content-card">
                    <h3><i class="fas fa-calendar-alt me-3"></i>Class Schedule</h3>
                    
                    <div id="schedule-viewer-container" style="min-height: 700px;">
                        <div class="alert alert-info">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            <strong>Loading Class Schedule...</strong> Please wait while we fetch the latest schedule.
                        </div>
                    </div>

                    <div class="schedule-notes mt-4">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Note:</strong> This is the official class schedule for the current academic year. 
                            For any schedule changes or updates, please check announcements regularly.
                        </div>
                    </div>
                </div>
            </section>

            <section id="calendar-section" class="content-section">
                <div class="content-card">
                    <h3><i class="fas fa-calendar me-3"></i>Academic Calendar</h3>
                    
                    <div id="calendar-viewer-container" style="min-height: 700px;">
                        <div class="alert alert-info">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            <strong>Loading Academic Calendar...</strong> Please wait while we fetch the latest calendar.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>