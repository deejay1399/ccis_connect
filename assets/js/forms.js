// FORMS PAGE JAVASCRIPT - Updated with homepage functionality

$(document).ready(function() {
    // Global notification function - SAME AS HOMEPAGE
    window.showNotification = function(message, type = 'info') {
        try {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());
            
            const notificationClass = type === 'error' ? 'alert-danger alert-error' : 
                                     type === 'success' ? 'alert-success' : 
                                     type === 'warning' ? 'alert-warning' :
                                     'alert-info';
            
            const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                             type === 'success' ? 'fa-check-circle' : 
                             type === 'warning' ? 'fa-exclamation-triangle' :
                             'fa-info-circle';
            
            const notification = document.createElement('div');
            notification.className = `notification alert ${notificationClass} alert-dismissible fade show`;
            
            // 🎯 CONSISTENT Top-Right positioning across all pages
            notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas ${iconClass} me-2"></i>
                    <span class="flex-grow-1">${message}</span>
                    <button type="button" class="btn-close btn-close-sm" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        } catch (error) {
            console.error('Notification error:', error);
        }
    };

    // PDF Files Configuration - Frontend Demo
    const pdfFiles = {
        'application-form-entrance': {
            filename: 'Application-Form-Entrance-Examination.pdf',
            title: 'Application Form for Entrance Examination',
            url: 'pdf/application-form-entrance.pdf'
        },
        'exit-form': {
            filename: 'Exit-Form.pdf',
            title: 'Exit Form',
            url: 'pdf/exit-form.pdf'
        },
        'parents-consent-form': {
            filename: 'Parents-Guardian-Consent-Form.pdf',
            title: 'Parent\'s/Guardian Consent Form',
            url: 'pdf/parents-consent-form.pdf'
        },
        'internship-agreement-bscs': {
            filename: 'Internship-Agreement-BSCS.pdf',
            title: 'Internship Agreement (BSCS)',
            url: 'pdf/internship-agreement-bscs.pdf'
        },
        'parent-consent-ojt': {
            filename: 'Parent-Consent-OJT.pdf',
            title: 'Parent Consent OJT',
            url: 'pdf/parent-consent-ojt.pdf'
        },
        'student-information-form': {
            filename: 'Student-Information-Form.pdf',
            title: 'Student Information Form',
            url: 'pdf/student-information-form.pdf'
        },
        'shiftee-form': {
            filename: 'Shiftee-Form.pdf',
            title: 'Shiftee Form',
            url: 'pdf/shiftee-form.pdf'
        },
        'adding-dropping-forms': {
            filename: 'Adding-Dropping-Forms.pdf',
            title: 'Adding/Dropping Forms',
            url: 'pdf/adding-dropping-forms.pdf'
        }
    };

    // Enhanced Mobile Menu Functionality - SAME AS HOMEPAGE
    function enhanceMobileMenu() {
        try {
            const $navbarToggler = $('.navbar-toggler');
            const $navbarMain = $('.navbar-main');
            const $navbarCollapse = $('#mainNav');
            
            if (!$navbarToggler.length) return;
            
            // Handle mobile menu toggle
            $navbarToggler.off('click').on('click', function() {
                $navbarMain.toggleClass('mobile-open');
                
                // Update ARIA attributes for accessibility
                const isExpanded = $navbarCollapse.hasClass('show');
                $navbarToggler.attr('aria-expanded', isExpanded ? 'false' : 'true');
            });
            
            // Close mobile menu when clicking outside
            $(document).off('click.menu').on('click.menu', function(e) {
                if ($(window).width() < 992) {
                    if (!$navbarMain.is(e.target) && $navbarMain.has(e.target).length === 0 && 
                        !$navbarToggler.is(e.target)) {
                        $navbarCollapse.collapse('hide');
                        $navbarMain.removeClass('mobile-open');
                        $navbarToggler.attr('aria-expanded', 'false');
                    }
                }
            });
            
            // Close mobile menu when a link is clicked
            $('.navbar-nav .nav-link, .dropdown-item').off('click.menu').on('click.menu', function() {
                if ($(window).width() < 992) {
                    $navbarCollapse.collapse('hide');
                    $navbarMain.removeClass('mobile-open');
                    $navbarToggler.attr('aria-expanded', 'false');
                }
            });
            
            // Handle dropdown behavior on mobile
            $('.dropdown-toggle').off('click.menu').on('click.menu', function(e) {
                if ($(window).width() < 992) {
                    e.preventDefault();
                    const $thisDropdown = $(this).closest('.dropdown');
                    const $dropdownMenu = $thisDropdown.find('.dropdown-menu');
                    
                    // Close other dropdowns
                    $('.dropdown').not($thisDropdown).removeClass('show');
                    $('.dropdown-menu').not($dropdownMenu).removeClass('show');
                    
                    // Toggle current dropdown
                    $thisDropdown.toggleClass('show');
                    $dropdownMenu.toggleClass('show');
                }
            });
            
            // Close dropdowns when clicking outside on mobile
            $(document).off('click.dropdown').on('click.dropdown', function(e) {
                if ($(window).width() < 992) {
                    if (!$(e.target).closest('.dropdown').length) {
                        $('.dropdown').removeClass('show');
                        $('.dropdown-menu').removeClass('show');
                    }
                }
            });
        } catch (error) {
            console.error('Mobile menu error:', error);
        }
    }

    // Handle URL hash on page load for direct form access
    function handleHashOnLoad() {
        try {
            const hash = window.location.hash.substring(1);
            const validForms = [
                'application-form-for-entrance-examination',
                'exit-form',
                'parents-guardian-consent-form',
                'internship-agreement-bscs',
                'parent-consent-ojt',
                'student-information-form',
                'shiftee-form',
                'adding-dropping-forms'
            ];
            
            if (hash && validForms.includes(hash)) {
                setTimeout(() => {
                    const targetElement = $(`#${hash}`);
                    if (targetElement.length) {
                        $('html, body').animate({
                            scrollTop: targetElement.offset().top - 100
                        }, 800);
                        
                        targetElement.addClass('form-highlight');
                        setTimeout(() => {
                            targetElement.removeClass('form-highlight');
                        }, 2000);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Hash handling error:', error);
        }
    }

    // PDF Download Functionality
    function initPDFDownloads() {
        try {
            $('.btn-download-pdf').off('click.pdf').on('click.pdf', function(e) {
                // Check if it's a direct link (has href attribute)
                if ($(this).is('a')) {
                    return true; // Let the browser handle the download
                }
                
                // Otherwise it's a preview download button from the modal
                e.preventDefault();
                const downloadUrl = $('#downloadFromPreview').data('download-url') || $('#pdfFrame').attr('src');
                const downloadName = $('#downloadFromPreview').data('download-name') || '';
                
                if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = downloadName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showSuccess('Download started!');
                } else {
                    showError('Unable to download. PDF URL not found.');
                }
            });
        } catch (error) {
            console.error('PDF downloads init error:', error);
        }
    }

    // PDF Preview Functionality
    function initPDFPreviews() {
        try {
            $('.btn-preview').off('click.preview').on('click.preview', function() {
                const formUrl = $(this).data('form-url');
                const isPdf = String($(this).data('is-pdf')) === '1';
                const fileExt = String($(this).data('file-ext') || '').toLowerCase();
                const formTitle = $(this).closest('.form-card').find('h3').text();
                const downloadName = String($(this).data('download-name') || '').trim();
                
                if (formUrl) {
                    const absoluteUrl = getAbsoluteUrl(formUrl);
                    if (isPdf) {
                        showIframePreview(formTitle, absoluteUrl, absoluteUrl, downloadName);
                        return;
                    }

                    if (fileExt === 'docx') {
                        showDocxPreview(formTitle, absoluteUrl, downloadName);
                        return;
                    }

                    if (fileExt === 'doc') {
                        // Try online Office viewer for legacy DOC files.
                        if (canUseOnlineDocPreview()) {
                            const officePreviewUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(absoluteUrl);
                            showIframePreview(formTitle, officePreviewUrl, absoluteUrl, downloadName);
                        } else {
                            showError('DOC preview is not supported on localhost. Please use DOCX or PDF for in-page viewing.');
                        }
                        return;
                    }

                    showError('Preview is only available for PDF and DOCX files.');
                } else {
                    showError('Preview not available for this form.');
                }
            });
        } catch (error) {
            console.error('PDF previews init error:', error);
        }
    }

    function showIframePreview(title, iframeUrl, downloadUrl, downloadName) {
        $('#modalFormTitle').text(title + ' Preview');
        $('#docxPreviewContainer').hide().empty();
        $('#pdfFrame').show().attr('src', iframeUrl);
        $('#downloadFromPreview').data('download-url', downloadUrl);
        $('#downloadFromPreview').data('download-name', downloadName || '');
        $('#pdfPreviewModal').fadeIn(300);
        $('body').addClass('modal-open');
    }

    async function showDocxPreview(title, fileUrl, downloadName) {
        try {
            await ensureDocxPreviewLibrary();

            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to load file (${response.status})`);
            }

            const arrayBuffer = await response.arrayBuffer();
            if (!isZipBasedDocx(arrayBuffer)) {
                throw new Error('Invalid DOCX file format');
            }
            const container = document.getElementById('docxPreviewContainer');
            if (!container) {
                throw new Error('DOCX preview container not found');
            }

            container.innerHTML = '';
            await window.docx.renderAsync(arrayBuffer, container, null, {
                className: 'docx-preview',
                inWrapper: true,
                breakPages: true
            });

            $('#modalFormTitle').text(title + ' Preview');
            $('#pdfFrame').hide().attr('src', '');
            $('#docxPreviewContainer').show();
            $('#downloadFromPreview').data('download-url', fileUrl);
            $('#downloadFromPreview').data('download-name', downloadName || '');
            $('#pdfPreviewModal').fadeIn(300);
            $('body').addClass('modal-open');
        } catch (error) {
            console.error('DOCX preview error:', error);
            showError('Unable to preview DOCX file. Ensure it is a valid .docx, or download it.');
        }
    }

    // Download PDF Function - Frontend Demo Version
    function downloadPDF(pdfConfig, button) {
        try {
            // Show loading state
            const originalText = button.html();
            button.html('<i class="fas fa-spinner fa-spin me-2"></i>Downloading...');
            button.prop('disabled', true);
            
            // Simulate download process (1.5 seconds)
            setTimeout(() => {
                try {
                    // Frontend demo - show success message
                    showSuccess(`"${pdfConfig.title}" download started!`);
                    
                    // In a real implementation with backend, you would use:
                    // const link = document.createElement('a');
                    // link.href = pdfConfig.url;
                    // link.download = pdfConfig.filename;
                    // document.body.appendChild(link);
                    // link.click();
                    // document.body.removeChild(link);
                    
                } catch (error) {
                    console.error('Download failed:', error);
                    showError('Download failed. Please try again or contact support.');
                } finally {
                    // Restore button state
                    button.html(originalText);
                    button.prop('disabled', false);
                }
            }, 1500);
        } catch (error) {
            console.error('Download PDF error:', error);
            showError('Download failed. Please try again.');
            button.html(originalText);
            button.prop('disabled', false);
        }
    }

    // Show PDF Preview Modal
    function showPDFPreview(pdfConfig) {
        try {
            $('#modalFormTitle').text(pdfConfig.title);
            
            $('#downloadFromPreview')
                .data('form', getKeyByValue(pdfFiles, pdfConfig))
                .off('click.preview')
                .on('click.preview', function() {
                    downloadPDF(pdfConfig, $(this));
                    closeModal();
                });
            
            $('#pdfPreviewModal').fadeIn(300);
            $('body').addClass('modal-open');
            
            $(document).off('keydown.modal').on('keydown.modal', function(event) {
                if (event.key === 'Escape') {
                    closeModal();
                }
            });
        } catch (error) {
            console.error('PDF preview error:', error);
            showError('Could not open preview. Please try again.');
        }
    }

    // Modal Controls
    function initModalControls() {
        try {
            $('.close-modal').off('click.modal').on('click.modal', closeModal);
            
            $(window).off('click.modal').on('click.modal', function(event) {
                if ($(event.target).hasClass('modal')) {
                    closeModal();
                }
            });
        } catch (error) {
            console.error('Modal controls error:', error);
        }
    }

    function closeModal() {
        try {
            $('#pdfPreviewModal').fadeOut(300);
            $('body').removeClass('modal-open');
            $('#pdfFrame').attr('src', '');
            $('#docxPreviewContainer').hide().empty();
            $('#downloadFromPreview').removeData('download-url');
            $('#downloadFromPreview').removeData('download-name');
            $(document).off('keydown.modal');
        } catch (error) {
            console.error('Close modal error:', error);
        }
    }

    function getAbsoluteUrl(url) {
        try {
            return new URL(url, window.location.origin).href;
        } catch (error) {
            return url;
        }
    }

    function canUseOnlineDocPreview() {
        const host = (window.location.hostname || '').toLowerCase();
        return host !== 'localhost' && host !== '127.0.0.1';
    }

    function ensureDocxPreviewLibrary() {
        return new Promise((resolve, reject) => {
            if (window.JSZip && window.docx && typeof window.docx.renderAsync === 'function') {
                resolve();
                return;
            }

            loadScriptOnce('jszip-lib', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
                .then(() => loadScriptOnce('docx-preview-lib', 'https://unpkg.com/docx-preview@0.3.3/dist/docx-preview.min.js'))
                .then(() => {
                    if (window.JSZip && window.docx && typeof window.docx.renderAsync === 'function') {
                        resolve();
                    } else {
                        reject(new Error('DOCX preview dependencies did not initialize correctly'));
                    }
                })
                .catch(reject);
        });
    }

    function loadScriptOnce(id, src) {
        return new Promise((resolve, reject) => {
            const existing = document.getElementById(id);
            if (existing) {
                if (existing.getAttribute('data-loaded') === '1') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = true;
            script.onload = () => {
                script.setAttribute('data-loaded', '1');
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    function isZipBasedDocx(arrayBuffer) {
        if (!arrayBuffer || arrayBuffer.byteLength < 4) {
            return false;
        }
        const header = new Uint8Array(arrayBuffer, 0, 4);
        // DOCX files are ZIP containers starting with PK\x03\x04.
        return header[0] === 0x50 && header[1] === 0x4B && header[2] === 0x03 && header[3] === 0x04;
    }

    // Utility function to get key by value
    function getKeyByValue(object, value) {
        try {
            return Object.keys(object).find(key => object[key] === value);
        } catch (error) {
            console.error('Get key by value error:', error);
            return null;
        }
    }

    // Notification Functions
    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    // Form Card Animations
    function initFormAnimations() {
        try {
            $('.form-card').off('hover.animation').hover(
                function() {
                    $(this).addClass('card-hover');
                },
                function() {
                    $(this).removeClass('card-hover');
                }
            );
            
            $(window).off('scroll.animation').on('scroll.animation', function() {
                $('.form-card').each(function() {
                    const elementTop = $(this).offset().top;
                    const windowBottom = $(window).scrollTop() + $(window).height();
                    
                    if (elementTop < windowBottom - 100) {
                        $(this).addClass('animate-in');
                    }
                });
            });
            
            $(window).trigger('scroll.animation');
        } catch (error) {
            console.error('Form animations error:', error);
        }
    }

    // Back to Top Button Functionality - SAME AS HOMEPAGE
    function initBackToTop() {
        try {
            const $backToTop = $('#backToTop');
            if (!$backToTop.length) return;
            
            function toggleBackToTop() {
                if ($(window).scrollTop() > 300) {
                    $backToTop.fadeIn();
                } else {
                    $backToTop.fadeOut();
                }
            }
            
            $backToTop.off('click.top').on('click.top', function() {
                $('html, body').animate({ scrollTop: 0 }, 800);
            });
            
            toggleBackToTop();
            $(window).off('scroll.top').on('scroll.top', toggleBackToTop);
        } catch (error) {
            console.error('Back to top error:', error);
        }
    }

    // Smooth scrolling for anchor links - SAME AS HOMEPAGE
    function initSmoothScrolling() {
        try {
            $('a[href^="#"]').off('click.smooth').on('click.smooth', function(e) {
                // Only prevent default if it's a same-page anchor
                if (this.pathname === window.location.pathname && this.hash) {
                    e.preventDefault();
                    const target = $(this.hash);
                    if (target.length) {
                        $('html, body').animate({
                            scrollTop: target.offset().top - 80
                        }, 1000);
                    }
                }
            });
        } catch (error) {
            console.error('Smooth scrolling error:', error);
        }
    }

    // Enhanced navbar toggler accessibility - SAME AS HOMEPAGE
    function initNavbarAccessibility() {
        try {
            $('#mainNav').off('show.bs.collapse hide.bs.collapse').on('show.bs.collapse', function () {
                $('.navbar-toggler').attr('aria-expanded', 'true');
            }).on('hide.bs.collapse', function () {
                $('.navbar-toggler').attr('aria-expanded', 'false');
            });
        } catch (error) {
            console.error('Navbar accessibility error:', error);
        }
    }

    // Safe initialization with error handling
    function safeInit(initFunction, functionName) {
        try {
            initFunction();
        } catch (error) {
            console.error(`Error in ${functionName}:`, error);
        }
    }

    // Initialize all functions
    function initializeAll() {
        // Safe initialization of all components
        safeInit(enhanceMobileMenu, 'enhanceMobileMenu');
        safeInit(initSmoothScrolling, 'initSmoothScrolling');
        safeInit(initNavbarAccessibility, 'initNavbarAccessibility');
        safeInit(handleHashOnLoad, 'handleHashOnLoad');
        safeInit(initPDFDownloads, 'initPDFDownloads');
        safeInit(initPDFPreviews, 'initPDFPreviews');
        safeInit(initModalControls, 'initModalControls');
        safeInit(initFormAnimations, 'initFormAnimations');
        safeInit(initBackToTop, 'initBackToTop');
        
        console.log('✅ CCIS Forms Page Loaded Successfully');
        console.log('🎯 All homepage functionality integrated');
        console.log('📄 PDF download and preview system ready');
        console.log('📱 Mobile navigation menu initialized');
    }

    // Initialize everything
    initializeAll();

    // Error boundary for unhandled errors
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        // Don't show notification for navigation errors to prevent spam
        if (!e.error?.message?.includes('navigation')) {
            showError('An unexpected error occurred. Please refresh the page.');
        }
    });

    // Handle promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // Don't show notification for navigation errors
        if (!e.reason?.message?.includes('navigation')) {
            showError('An unexpected error occurred. Please refresh the page.');
        }
    });
});
