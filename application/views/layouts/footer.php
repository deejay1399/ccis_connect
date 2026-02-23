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
                    <button class="quick-question" data-question="What programs are offered in CCIS?">Programs Offered</button>
                    <button class="quick-question" data-question="Where can I find the curriculum?">Find Curriculum</button>
                    <button class="quick-question" data-question="Where can I download forms?">Download Forms</button>
                    <button class="quick-question" data-question="What are the office hours?">Office Hours</button>
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
        // Itakda ang global base URL alang sa tanan nga mga panid
        window.BASE_URL = '<?php echo base_url(); ?>';
        window.CSRF_TOKEN_NAME = '<?php echo $this->security->get_csrf_token_name(); ?>';
        window.CSRF_TOKEN_VALUE = '<?php echo $this->security->get_csrf_hash(); ?>';
    </script>
    <script>
        (function attachCsrfHandlers() {
            function injectCsrfIntoForms() {
                document.querySelectorAll('form').forEach(function(form) {
                    const method = (form.getAttribute('method') || 'get').toLowerCase();
                    if (method !== 'post') {
                        return;
                    }
                    let hidden = form.querySelector('input[name="' + window.CSRF_TOKEN_NAME + '"]');
                    if (!hidden) {
                        hidden = document.createElement('input');
                        hidden.type = 'hidden';
                        hidden.name = window.CSRF_TOKEN_NAME;
                        form.appendChild(hidden);
                    }
                    hidden.value = window.CSRF_TOKEN_VALUE;
                });
            }

            injectCsrfIntoForms();
            document.addEventListener('submit', injectCsrfIntoForms, true);

            if (window.jQuery) {
                $.ajaxSetup({
                    beforeSend: function(xhr, settings) {
                        const method = ((settings.type || 'GET') + '').toUpperCase();
                        if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
                            return;
                        }

                        if (settings.data instanceof FormData) {
                            if (!settings.data.has(window.CSRF_TOKEN_NAME)) {
                                settings.data.append(window.CSRF_TOKEN_NAME, window.CSRF_TOKEN_VALUE);
                            }
                            return;
                        }

                        const csrfPair = encodeURIComponent(window.CSRF_TOKEN_NAME) + '=' + encodeURIComponent(window.CSRF_TOKEN_VALUE);
                        if (typeof settings.data === 'string') {
                            if (settings.data.indexOf(window.CSRF_TOKEN_NAME + '=') === -1) {
                                settings.data = settings.data ? settings.data + '&' + csrfPair : csrfPair;
                            }
                        } else if (settings.data && typeof settings.data === 'object') {
                            settings.data[window.CSRF_TOKEN_NAME] = window.CSRF_TOKEN_VALUE;
                        } else if (!settings.data) {
                            settings.data = csrfPair;
                        }
                    }
                });
            }

            if (window.fetch) {
                const nativeFetch = window.fetch.bind(window);
                window.fetch = function(resource, init) {
                    const options = init ? Object.assign({}, init) : {};
                    const method = ((options.method || 'GET') + '').toUpperCase();
                    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
                        return nativeFetch(resource, options);
                    }

                    if (options.body instanceof FormData) {
                        if (!options.body.has(window.CSRF_TOKEN_NAME)) {
                            options.body.append(window.CSRF_TOKEN_NAME, window.CSRF_TOKEN_VALUE);
                        }
                        return nativeFetch(resource, options);
                    }

                    if (typeof options.body === 'string') {
                        const hasToken = options.body.indexOf(window.CSRF_TOKEN_NAME + '=') !== -1;
                        if (!hasToken) {
                            const joiner = options.body.length ? '&' : '';
                            options.body += joiner + encodeURIComponent(window.CSRF_TOKEN_NAME) + '=' + encodeURIComponent(window.CSRF_TOKEN_VALUE);
                        }
                        return nativeFetch(resource, options);
                    }

                    const headers = new Headers(options.headers || {});
                    const contentType = (headers.get('Content-Type') || '').toLowerCase();
                    if (contentType.indexOf('application/json') !== -1) {
                        let payload = {};
                        if (options.body) {
                            try {
                                payload = JSON.parse(options.body);
                            } catch (e) {
                                payload = {};
                            }
                        }
                        payload[window.CSRF_TOKEN_NAME] = window.CSRF_TOKEN_VALUE;
                        options.body = JSON.stringify(payload);
                    } else {
                        headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        options.body = encodeURIComponent(window.CSRF_TOKEN_NAME) + '=' + encodeURIComponent(window.CSRF_TOKEN_VALUE);
                    }
                    options.headers = headers;
                    return nativeFetch(resource, options);
                };
            }
        })();
    </script>
    
    <!-- Session Data Bridge: PHP Session -> JavaScript localStorage -->
    <script>
        // Pag-sync sa datos sa sesyon sa PHP sa localStorage diha-diha dayon sa pagkarga sa panid
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
                        'organization' => $this->session->userdata('organization_name'),
                        'organization_slug' => $this->session->userdata('organization_slug'),
                        'token' => $this->session->userdata('token'),
                        'sessionId' => session_id()
                    );
                }
                echo json_encode($user_session);
            ?>;

            // Kon ang user naka-log in, i-sync sa localStorage
            if (sessionData && sessionData.user_id) {
                // Mapa role_id sa role name
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
    
    <?php
        $session_mgmt_js = FCPATH . 'assets/js/session-management.js';
        $session_mgmt_ver = file_exists($session_mgmt_js) ? filemtime($session_mgmt_js) : time();
    ?>
    <script src="<?php echo base_url('assets/js/session-management.js?v=' . $session_mgmt_ver); ?>"></script>
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
            <script src="<?php echo base_url('assets/js/program_offerings.js?v=' . time()); ?>"></script>
        <?php elseif ($page_type === 'updates'): ?>
            <?php
                $updates_js_path = FCPATH . 'assets/js/updates.js';
                $updates_js_version = file_exists($updates_js_path) ? filemtime($updates_js_path) : time();
                $updates_pagination_js_path = FCPATH . 'assets/js/updates-pagination.js';
                $updates_pagination_js_version = file_exists($updates_pagination_js_path) ? filemtime($updates_pagination_js_path) : time();
            ?>
            <script src="<?php echo base_url('assets/js/updates.js?v=' . $updates_js_version); ?>"></script>
            <script src="<?php echo base_url('assets/js/updates-pagination.js?v=' . $updates_pagination_js_version); ?>"></script>
        <?php elseif ($page_type === 'forms'): ?>
            <script src="<?php echo base_url('assets/js/forms.js'); ?>"></script>
        <?php elseif ($page_type === 'login'): ?>
            <script src="<?php echo base_url('assets/js/login.js'); ?>"></script>
        <?php elseif ($page_type === 'alumni'): ?>
            <script src="<?php echo base_url('assets/js/alumni.js'); ?>"></script>
        <?php elseif ($page_type === 'organization'): ?>
            <script src="<?php echo base_url('assets/js/organization.js'); ?>"></script>
        <?php elseif ($page_type === 'organization_student'): ?>
            <script>
                (function () {
                    var validSections = ['the-legion', 'cs-guild'];

                    function showOnly(sectionId) {
                        var sections = document.querySelectorAll('.organization-section .content-section');
                        sections.forEach(function (section) {
                            var isActive = section.id === sectionId;
                            section.classList.toggle('active-section', isActive);
                            section.style.display = isActive ? 'block' : 'none';
                        });
                    }

                    function resolveSection() {
                        var hash = (window.location.hash || '').replace('#', '');
                        return validSections.indexOf(hash) !== -1 ? hash : 'the-legion';
                    }

                    function syncView() {
                        showOnly(resolveSection());
                    }

                    document.addEventListener('DOMContentLoaded', syncView);
                    window.addEventListener('hashchange', syncView);
                })();
            </script>
        <?php endif; ?>
    <?php endif; ?>
    
    <!-- Super Admin Management Scripts -->
    <?php if (isset($content_type)): ?>
        <?php if ($content_type === 'academics'): ?>
            <script src="<?php echo base_url('assets/js/manage_academics_curriculum.js?v=' . time()); ?>"></script>
            <script src="<?php echo base_url('assets/js/manage_academics_schedule.js?v=' . time()); ?>"></script>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>
