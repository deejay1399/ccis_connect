<section class="academics-section">
        <div class="container">
            <section id="programs-section" class="content-section active-section">
                <div class="content-card">
                    <h3><i class="fas fa-graduation-cap me-3"></i>Programs Offered</h3>
                    
                    <div class="programs-grid" id="programs-grid">
                        <!-- Programs will be loaded dynamically -->
                        <div class="program-card">
                            <div class="program-icon">
                                <i class="fas fa-laptop-code"></i>
                            </div>
                            <h4>Bachelor of Science in Computer Science</h4>
                            <p>Four-year program focusing on software development, algorithms, and computer systems.</p>
                        </div>
                        
                        <div class="program-card">
                            <div class="program-icon">
                                <i class="fas fa-network-wired"></i>
                            </div>
                            <h4>Bachelor of Science in Information Technology</h4>
                            <p>Four-year program emphasizing IT infrastructure, networking, and system administration.</p>
                        </div>
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