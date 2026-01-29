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
                    
                    <div class="program-tabs">
                        <div class="tab-nav">
                            <button class="tab-btn active" data-tab="bscs-curriculum">BSCS New Curriculum</button>
                            <button class="tab-btn" data-tab="bsit-curriculum">BSIT New Curriculum</button>
                        </div>
                        
                        <div class="tab-content">
                            <div class="tab-pane active" id="bscs-curriculum-tab">
                                <div class="pdf-viewer-container">
                                    <div id="bscs-pdf-placeholder">
                                        <div class="pdf-placeholder">
                                            <i class="fas fa-file-pdf pdf-icon"></i>
                                            <h4>BSCS New Curriculum 2024-2025</h4>
                                            <p>View the complete Bachelor of Science in Computer Science curriculum including all subjects and course requirements.</p>
                                            <div class="button-group-tapad mt-4">
                                                <button class="btn btn-view-pdf me-2 view-curriculum-pdf" data-program="bscs">
                                                    <i class="fas fa-eye me-1"></i>View PDF
                                                </button>
                                                <button class="btn btn-download-pdf curriculum-download" data-program="bscs">
                                                    <i class="fas fa-download me-1"></i>Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="bscs-pdfEmbedContainer" style="display: none;">
                                        <div class="pdf-embed-container">
                                            <div class="pdf-header">
                                                <h5>BSCS New Curriculum 2024-2025</h5>
                                                <button class="btn btn-sm btn-outline-light close-pdf close-curriculum-pdf" data-program="bscs">
                                                    <i class="fas fa-times me-1"></i>Close
                                                </button>
                                            </div>
                                            <div class="pdf-frame-container">
                                                <iframe id="bscs-pdfFrame" src="curriculum-bscs.pdf" width="100%" height="600px" frameborder="0"></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-pane" id="bsit-curriculum-tab">
                                <div class="pdf-viewer-container">
                                    <div id="bsit-pdf-placeholder">
                                        <div class="pdf-placeholder">
                                            <i class="fas fa-file-pdf pdf-icon"></i>
                                            <h4>BSIT New Curriculum 2024-2025</h4>
                                            <p>View the complete Bachelor of Science in Information Technology curriculum including all subjects and course requirements.</p>
                                            <div class="button-group-tapad mt-4">
                                                <button class="btn btn-view-pdf me-2 view-curriculum-pdf" data-program="bsit">
                                                    <i class="fas fa-eye me-1"></i>View PDF
                                                </button>
                                                <button class="btn btn-download-pdf curriculum-download" data-program="bsit">
                                                    <i class="fas fa-download me-1"></i>Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="bsit-pdfEmbedContainer" style="display: none;">
                                        <div class="pdf-embed-container">
                                            <div class="pdf-header">
                                                <h5>BSIT New Curriculum 2024-2025</h5>
                                                <button class="btn btn-sm btn-outline-light close-pdf close-curriculum-pdf" data-program="bsit">
                                                    <i class="fas fa-times me-1"></i>Close
                                                </button>
                                            </div>
                                            <div class="pdf-frame-container">
                                                <iframe id="bsit-pdfFrame" src="curriculum-bsit.pdf" width="100%" height="600px" frameborder="0"></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="schedule-section" class="content-section">
                <div class="content-card">
                    <h3><i class="fas fa-calendar-alt me-3"></i>Class Schedule</h3>
                    
                    <div id="current-schedule">
                        <div class="pdf-viewer-container">
                            <div id="schedule-pdf-placeholder">
                                <div class="pdf-placeholder">
                                    <i class="fas fa-file-pdf pdf-icon"></i>
                                    <h4>Class Schedule 2024-2025</h4>
                                    <p>View the complete class schedule for the current semester including all courses, times, and room assignments.</p>
                                    <div class="button-group-tapad mt-4">
                                        <button class="btn btn-view-pdf me-2 view-schedule-pdf">
                                            <i class="fas fa-eye me-1"></i>View PDF
                                        </button>
                                        <button class="btn btn-download-pdf" onclick="window.open('class-schedule.pdf', '_blank')">
                                            <i class="fas fa-download me-1"></i>Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="schedule-pdfEmbedContainer" style="display: none;">
                                <div class="pdf-embed-container">
                                    <div class="pdf-header">
                                        <h5>Class Schedule 2024-2025</h5>
                                        <button class="btn btn-sm btn-outline-light close-pdf close-schedule-pdf">
                                            <i class="fas fa-times me-1"></i>Close
                                        </button>
                                    </div>
                                    <div class="pdf-frame-container">
                                        <iframe id="schedule-pdfFrame" src="class-schedule.pdf" width="100%" height="600px" frameborder="0"></iframe>
                                    </div>
                                </div>
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
                </div>
            </section>

            <section id="calendar-section" class="content-section">
                <div class="content-card">
                    <h3><i class="fas fa-calendar me-3"></i>Academic Calendar</h3>
                    
                    <div class="pdf-viewer-container">
                        <div id="pdf-placeholder">
                            <div class="pdf-placeholder">
                                <i class="fas fa-file-pdf pdf-icon"></i>
                                <h4>Academic Calendar 2024-2025</h4>
                                <p>View the complete academic calendar for the current school year including important dates, holidays, and academic deadlines.</p>
                                <div class="button-group-tapad mt-4">
                                    <button id="viewPdfBtn" class="btn btn-view-pdf me-2">
                                        <i class="fas fa-eye me-1"></i>View PDF
                                    </button>
                                    <button class="btn btn-download-pdf" onclick="window.open('academic-calendar.pdf', '_blank')">
                                        <i class="fas fa-download me-1"></i>Download
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="pdfEmbedContainer" style="display: none;">
                            <div class="pdf-embed-container">
                                <div class="pdf-header">
                                    <h5>Academic Calendar 2024-2025</h5>
                                    <button id="closePdfBtn" class="btn btn-sm btn-outline-light close-pdf">
                                        <i class="fas fa-times me-1"></i>Close
                                    </button>
                                </div>
                                <div class="pdf-frame-container">
                                    <iframe id="pdfFrame" src="academic-calendar.pdf" width="100%" height="600px" frameborder="0"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>