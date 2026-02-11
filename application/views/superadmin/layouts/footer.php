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
        window.CSRF_TOKEN_NAME = '<?php echo $this->security->get_csrf_token_name(); ?>';
        window.CSRF_TOKEN_VALUE = '<?php echo $this->security->get_csrf_hash(); ?>';
        window.sessionData = {
            isValid: <?php echo $this->session->userdata('logged_in') ? 'true' : 'false'; ?>,
            user: <?php 
                if($this->session->userdata('logged_in')) {
                    $roleMap = [
                        1 => 'superadmin',
                        2 => 'faculty',
                        3 => 'student',
                        4 => 'orgadmin',
                    ];
                    $roleId = (int) $this->session->userdata('role_id');
                    $user = [
                        'name' => $this->session->userdata('first_name') . ' ' . $this->session->userdata('last_name'),
                        'email' => $this->session->userdata('email'),
                        'role' => isset($roleMap[$roleId]) ? $roleMap[$roleId] : 'guest',
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
    
    <!-- Page-specific scripts -->
    <?php if(isset($page_type) && $page_type === 'admin_users'): ?>
        <script src="<?php echo base_url('assets/js/create_user.js'); ?>"></script>
    <?php elseif(isset($page_type) && $page_type === 'list_users'): ?>
        <script src="<?php echo base_url('assets/js/list_users.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'homepage'): ?>
        <script src="<?php echo base_url('assets/js/manage_homepage.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'updates'): ?>
        <script src="<?php echo base_url('assets/js/manage_updates.js?v=' . time()); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'faculty'): ?>
        <script src="<?php echo base_url('assets/js/manage_faculty.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'academics'): ?>
        <script src="<?php echo base_url('assets/js/manage_academics.js'); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_curriculum.js?v=' . time()); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_schedule.js?v=' . time()); ?>"></script>
        <script src="<?php echo base_url('assets/js/manage_academics_calendar.js?v=' . time()); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'forms'): ?>
        <script src="<?php echo base_url('assets/js/manage_forms.js'); ?>"></script>
    <?php elseif(isset($content_type) && $content_type === 'alumni'): ?>
        <?php
            $alumni_js_path = FCPATH . 'assets/js/manage_alumni.js';
            $alumni_js_version = file_exists($alumni_js_path) ? filemtime($alumni_js_path) : time();
        ?>
        <script src="<?php echo base_url('assets/js/manage_alumni.js?v=' . $alumni_js_version); ?>"></script>
    <?php else: ?>
        <script src="<?php echo base_url('assets/js/dashboard.js'); ?>"></script>
    <?php endif; ?>

    <!-- Global (superadmin) logout handler: ensures server session logout is called -->
    <script>
        (function() {
            function clearClientAuthState() {
                try {
                    // Admin/legacy keys
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');

                    // Public-site session keys
                    localStorage.removeItem('ccis_user');
                    localStorage.removeItem('ccis_login_time');
                    localStorage.removeItem('ccis_session_id');

                    // Admin return URL (floating return button)
                    localStorage.removeItem('admin_return_url');
                    sessionStorage.removeItem('admin_return_url');
                } catch (e) {
                    // Intentionally ignore storage errors (e.g., private mode / disabled)
                }
            }

            $(function() {
                // Force a single, authoritative handler (some page scripts bind their own logout logic)
                $(document)
                    .off('click', '#logout-icon-link')
                    .on('click', '#logout-icon-link', function(e) {
                        e.preventDefault();
                        clearClientAuthState();
                        window.location.href = window.BASE_URL + 'index.php/logout?logout=true';
                    });
            });
        })();
    </script>
</body>
</html>
