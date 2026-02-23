<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<footer class="admin-footer">
    <div class="container">
        <div class="row align-items-start">
            <div class="col-md-6 footer-section">
                <div class="footer-content-wrapper-left">
                    <div class="footer-logo-text-tapad">
                        <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="footer-logo">
                        <div class="footer-text-group">
                            <h6 class="footer-university-name">BOHOL ISLAND STATE UNIVERSITY - BALILIHAN CAMPUS</h6>
                            <div class="core-values-footer">
                                <span class="value-item">BALANCE</span>
                                <span class="value-separator">&bull;</span>
                                <span class="value-item">INTEGRITY</span>
                                <span class="value-separator">&bull;</span>
                                <span class="value-item">STEWARDSHIP</span>
                                <span class="value-separator">&bull;</span>
                                <span class="value-item">UPRIGHTNESS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 footer-section">
                <div class="footer-contact-social-wrapper">
                    <div class="contact-info-left">
                        <h5 class="contact-title">Contact Us</h5>
                        <div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>Magsija, Balilihan, Bohol - BISU Balilihan Campus</span></div>
                        <div class="contact-item"><i class="fas fa-phone"></i><span>(038) 422-0712</span></div>
                        <div class="contact-item"><i class="fas fa-envelope"></i><span>ccisbalilihan@bisu.edu.ph</span></div>
                    </div>
                    <div class="social-info-left">
                        <h5 class="social-title">Follow Us</h5>
                        <div class="social-links">
                            <a href="https://www.facebook.com/profile.php?id=61564018640316" target="_blank" class="social-link"><i class="fab fa-facebook-f"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row"><div class="col-md-12 text-center"><p class="copyright">&copy; 2025 Bohol Island State University - Balilihan Campus. College of Computing and Information Sciences. All rights reserved.</p></div></div>
    </div>
</footer>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
<script>
window.CSRF_TOKEN_NAME = '<?php echo $this->security->get_csrf_token_name(); ?>';
window.CSRF_TOKEN_VALUE = '<?php echo $this->security->get_csrf_hash(); ?>';

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
})();
</script>

<!-- Global Configuration -->
<script>
    // Itakda ang global base URL alang sa tanan nga mga panid
    window.BASE_URL = '<?php echo base_url(); ?>';
</script>

<!-- Session management and logout modal -->
<script src="<?php echo base_url('assets/js/session-management.js'); ?>"></script>
<script src="<?php echo base_url('assets/js/org_dashboard.js'); ?>"></script>

<!-- Global (org admin) logout handler -->
<script>
    (function() {
        function clearClientAuthState() {
            try {
                // Mga yawi sa admin/panulundon
                localStorage.removeItem('userSession');
                sessionStorage.removeItem('userSession');

                // Public-site nga mga yawe sa sesyon
                localStorage.removeItem('ccis_user');
                localStorage.removeItem('ccis_login_time');
                localStorage.removeItem('ccis_session_id');

                // Admin pagbalik URL (naglutaw pagbalik button)
                localStorage.removeItem('admin_return_url');
                sessionStorage.removeItem('admin_return_url');
            } catch (e) {
                // Tinuyo nga gibaliwala ang mga sayup sa pagtipig (pananglitan, pribado nga mode / baldado)
            }
        }

        $(function() {
            // Padayon nga makita ang affordance sa logout sa mga panid sa admin sa org.
            $('#logout-icon-link').css('display', 'flex');

            // Pagpugos sa usa ka single, authoritative handler (ang pipila nga mga script sa panid nagbugkos sa ilang kaugalingon nga lohika sa pag-logout)
            $(document)
                .off('click', '#logout-icon-link')
                .on('click', '#logout-icon-link', function(e) {
                    e.preventDefault();
                    
                    // Ipakita ang logout modal uban sa admin-piho nga pagpanglimpyo
                    if (typeof showLogoutModalWithAdminCleanup === 'function') {
                        showLogoutModalWithAdminCleanup();
                    } else if (typeof logoutUser === 'function') {
                        // Fallback: paggamit standard logout
                        logoutUser();
                    } else {
                        // Ang katapusan nga fallback kung ang session-management.js wala ma-load
                        clearClientAuthState();
                        window.location.href = window.BASE_URL + 'index.php/logout?logout=true';
                    }
                });
        });
    })();
</script>
</body>
</html>
