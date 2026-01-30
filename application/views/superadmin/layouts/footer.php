 <footer class="main-footer">
        <div class="container">
            <div class="row align-items-start">
                <div class="col-md-6 footer-section">
                    <div class="footer-content-wrapper-left"> 
                        <div class="footer-logo-text-tapad">
                            <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="footer-logo">
                            <div class="footer-text-group"> 
                                <h6 class="footer-university-name">
                                    BOHOL ISLAND STATE UNIVERSITY - BALILIHAN CAMPUS
                                </h6>
                                
                                <div class="core-values-footer">
                                    <span class="value-item">BALANCE</span>
                                    <span class="value-separator">•</span>
                                    <span class="value-item">INTEGRITY</span>
                                    <span class="value-separator">•</span>
                                    <span class="value-item">STEWARDSHIP</span>
                                    <span class="value-separator">•</span>
                                    <span class="value-item">UPRIGHTNESS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 footer-section">
                    <div class="footer-contact-social-wrapper">
                        <!-- Contact Information -->
                        <div class="contact-info-left">
                            <h5 class="contact-title">Contact Us</h5>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Magsija, Balilihan, Bohol - BISU Balilihan Campus</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>(038) 422-0712</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>ccisbalilihan@bisu.edu.ph</span>
                            </div>
                        </div>
                        
                        <!-- Follow Us -->
                        <div class="social-info-left">
                            <h5 class="social-title">Follow Us</h5>
                            <div class="social-links">
                                <a href="https://www.facebook.com/profile.php?id=61564018640316" target="_blank" class="social-link">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr>
            
            <div class="row">
                <div class="col-md-12 text-center">
                    <p class="copyright">
                        &copy; 2025 Bohol Island State University - Balilihan Campus. College of Computing and Information Sciences. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Initialize PHP session data for JavaScript -->
    <script>
        window.baseUrl = '<?php echo base_url(); ?>';
        window.sessionData = {
            isValid: <?php echo $this->session->userdata('logged_in') ? 'true' : 'false'; ?>,
            user: <?php 
                if($this->session->userdata('logged_in')) {
                    $user = [
                        'name' => $this->session->userdata('first_name') . ' ' . $this->session->userdata('last_name'),
                        'email' => $this->session->userdata('email'),
                        'role' => 'superadmin',
                        'sessionId' => session_id()
                    ];
                    echo json_encode($user);
                } else {
                    echo 'null';
                }
            ?>
        };
    </script>
    
    <!-- Session check function -->
    <script src="<?php echo base_url('assets/js/check-session.js'); ?>"></script>
    
    <!-- Global base URL for AJAX calls -->
    <script>
        if (typeof baseUrl === 'undefined') {
            const baseUrl = '<?php echo base_url(); ?>';
        }
        // API Base URL for admin controllers
        window.API_BASE_URL = '<?php echo base_url('index.php/admin/content/api_'); ?>';
        // Base URL for file access
        window.BASE_URL = '<?php echo base_url(); ?>';
    </script>
    
    <!-- Page-specific scripts -->
    <?php if(isset($page_type) && $page_type === 'admin_users'): ?>
        <script src="<?php echo base_url('assets/js/create_user.js'); ?>"></script>
    <?php elseif(isset($page_type) && $page_type === 'list_users'): ?>
        <script src="<?php echo base_url('assets/js/list_users.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'homepage'): ?>
        <script src="<?php echo base_url('assets/js/manage_homepage.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'faculty'): ?>
        <script src="<?php echo base_url('assets/js/manage_faculty.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'academics'): ?>
        <script src="<?php echo base_url('assets/js/manage_academics.js'); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_curriculum.js?v=' . time()); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_schedule.js?v=' . time()); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_calendar.js?v=' . time()); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'forms'): ?>
        <script src="<?php echo base_url('assets/js/manage_forms.js'); ?>"></script>
    <?php else: ?>
        <script src="<?php echo base_url('assets/js/dashboard.js'); ?>"></script>
    <?php endif; ?>
</body>
</html>