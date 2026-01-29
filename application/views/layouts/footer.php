<footer class="main-footer">
        <div class="container">
            <div class="row align-items-start">
                <!-- University Info - Full width for better alignment -->
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
                
                <!-- Contact Information and Social Media - Combined and aligned left -->
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

    <!-- Back to Top Button -->
    <button id="backToTop" class="back-to-top-btn" aria-label="Back to top">
        <i class="fas fa-chevron-up"></i>
        <span class="visually-hidden">Back to top</span>
    </button>

    <!-- ================ CHATBOT HTML ================ -->
    <div id="ccis-chatbot" class="ccis-chatbot">
        <!-- Chatbot Header -->
        <div class="chatbot-header">
            <div class="chatbot-title">
                <i class="fas fa-robot"></i>
                <span>CCIS Assistant</span>
            </div>
            <button class="chatbot-close" id="chatbot-close">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Chatbot Messages Container -->
        <div class="chatbot-messages" id="chatbot-messages">
            <!-- Initial message -->
            <div class="chatbot-message bot-message">
                <div class="message-content">
                    Hello! I'm CCIS Assistant. How can I help you today? 
                    Here are some quick questions:
                </div>
                <div class="quick-questions">
                    <button class="quick-question" data-question="Where can I find curriculum?">📚 Curriculum</button>
                    <button class="quick-question" data-question="What are the office hours?">⏰ Office Hours</button>
                    <button class="quick-question" data-question="How to contact faculty?">👨‍🏫 Faculty Contact</button>
                    <button class="quick-question" data-question="Where is the alumni section?">🎓 Alumni Info</button>
                </div>
            </div>
        </div>

        <!-- Chatbot Input Area -->
        <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Type your question here..." 
                   aria-label="Type your question for the chatbot">
            <button id="chatbot-send">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>

    <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chatbot">
        <i class="fas fa-robot"></i>
        <span class="chatbot-notification">1</span>
    </button>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Global Configuration -->
    <script>
        // Set global base URL for all pages
        window.BASE_URL = '<?php echo base_url(); ?>';
    </script>
    
    <!-- Session Data Bridge: PHP Session -> JavaScript localStorage -->
    <script>
        // Sync PHP session data to localStorage immediately on page load
        (function() {
            const sessionData = <?php 
                $user_session = array();
                if ($this->session->userdata('logged_in')) {
                    $role_id = $this->session->userdata('role_id');
                    $user_session = array(
                        'user_id' => $this->session->userdata('user_id'),
                        'email' => $this->session->userdata('email'),
                        'name' => $this->session->userdata('first_name') . ' ' . $this->session->userdata('last_name'),
                        'first_name' => $this->session->userdata('first_name'),
                        'last_name' => $this->session->userdata('last_name'),
                        'role_id' => $role_id,
                        'token' => $this->session->userdata('token'),
                        'sessionId' => session_id()
                    );
                }
                echo json_encode($user_session);
            ?>;

            // If user is logged in, sync to localStorage
            if (sessionData && sessionData.user_id) {
                // Map role_id to role name
                const roleMap = {
                    1: 'superadmin',
                    2: 'faculty',
                    3: 'student',
                    4: 'orgadmin'
                };
                sessionData.role = roleMap[sessionData.role_id] || 'student';

                localStorage.setItem('ccis_user', JSON.stringify(sessionData));
                localStorage.setItem('ccis_session_id', sessionData.sessionId);
                localStorage.setItem('ccis_login_time', new Date().getTime());
                console.log('✅ Session synced to localStorage:', sessionData);
            }
        })();
    </script>
    
    <script src="<?php echo base_url('assets/js/session-management.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/chatbot.js'); ?>"></script>
    <?php if (!empty($page_type)): ?>
        <?php if ($page_type === 'homepage'): ?>
            <script src="<?php echo base_url('assets/js/homepage.js'); ?>"></script>
        <?php elseif ($page_type === 'about'): ?>
            <script src="<?php echo base_url('assets/js/about.js'); ?>"></script>
        <?php elseif ($page_type === 'faculty'): ?>
            <script src="<?php echo base_url('assets/js/faculty.js'); ?>"></script>
        <?php elseif ($page_type === 'academics'): ?>
            <script src="<?php echo base_url('assets/js/academics.js'); ?>"></script>
        <?php elseif ($page_type === 'updates'): ?>
            <script src="<?php echo base_url('assets/js/updates.js'); ?>"></script>
            <script src="<?php echo base_url('assets/js/updates-pagination.js'); ?>"></script>
            <script src="<?php echo base_url('assets/js/deanslist.js'); ?>"></script>
        <?php elseif ($page_type === 'forms'): ?>
            <script src="<?php echo base_url('assets/js/forms.js'); ?>"></script>
        <?php elseif ($page_type === 'login'): ?>
            <script src="<?php echo base_url('assets/js/login.js'); ?>"></script>
        <?php elseif ($page_type === 'alumni'): ?>
            <script src="<?php echo base_url('assets/js/alumni.js'); ?>"></script>
        <?php elseif ($page_type === 'organization'): ?>
            <script src="<?php echo base_url('assets/js/organization.js'); ?>"></script>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>