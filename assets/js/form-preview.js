(function (window, document) {
    'use strict';

    var state = {
        downloadUrl: '',
        downloadName: ''
    };

    function getElements() {
        return {
            modal: document.getElementById('globalFormPreviewModal'),
            title: document.getElementById('globalFormPreviewTitle'),
            frame: document.getElementById('globalFormPreviewFrame'),
            docx: document.getElementById('globalFormPreviewDocx'),
            download: document.getElementById('globalFormPreviewDownload')
        };
    }

    function showMessage(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type || 'info');
            return;
        }

        window.alert(message);
    }

    function getAbsoluteUrl(url) {
        try {
            return new URL(String(url || ''), window.location.href).href;
        } catch (error) {
            return String(url || '');
        }
    }

    function normalizeExt(value) {
        return String(value || '').toLowerCase().replace(/^\./, '');
    }

    function canUseOnlineDocPreview() {
        var host = String(window.location.hostname || '').toLowerCase();
        return host !== 'localhost' && host !== '127.0.0.1';
    }

    function openModal() {
        var elements = getElements();
        if (!elements.modal) {
            return;
        }

        elements.modal.classList.add('is-open');
        elements.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('form-preview-open');
    }

    function closeModal() {
        var elements = getElements();
        if (!elements.modal) {
            return;
        }

        elements.modal.classList.remove('is-open');
        elements.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('form-preview-open');

        if (elements.frame) {
            elements.frame.src = '';
            elements.frame.style.display = 'block';
        }

        if (elements.docx) {
            elements.docx.style.display = 'none';
            elements.docx.innerHTML = '';
        }

        state.downloadUrl = '';
        state.downloadName = '';
    }

    function startDownload(url, fileName) {
        if (!url) {
            showMessage('Download is unavailable for this form.', 'warning');
            return;
        }

        var link = document.createElement('a');
        link.href = url;
        if (fileName) {
            link.download = fileName;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showIframePreview(title, iframeUrl, downloadUrl, downloadName) {
        var elements = getElements();
        if (!elements.modal || !elements.title || !elements.frame || !elements.docx) {
            return;
        }

        elements.title.textContent = String(title || 'Form') + ' Preview';
        elements.docx.style.display = 'none';
        elements.docx.innerHTML = '';
        elements.frame.style.display = 'block';
        elements.frame.src = iframeUrl;

        state.downloadUrl = downloadUrl || '';
        state.downloadName = downloadName || '';
        openModal();
    }

    function loadScriptOnce(id, src) {
        return new Promise(function (resolve, reject) {
            var existing = document.getElementById(id);
            if (existing) {
                if (existing.getAttribute('data-loaded') === '1') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', function () { resolve(); }, { once: true });
                existing.addEventListener('error', function () {
                    reject(new Error('Failed to load script: ' + src));
                }, { once: true });
                return;
            }

            var script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = true;
            script.onload = function () {
                script.setAttribute('data-loaded', '1');
                resolve();
            };
            script.onerror = function () {
                reject(new Error('Failed to load script: ' + src));
            };
            document.head.appendChild(script);
        });
    }

    function ensureDocxPreviewLibrary() {
        return new Promise(function (resolve, reject) {
            if (window.JSZip && window.docx && typeof window.docx.renderAsync === 'function') {
                resolve();
                return;
            }

            loadScriptOnce('jszip-lib', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
                .then(function () {
                    return loadScriptOnce('docx-preview-lib', 'https://unpkg.com/docx-preview@0.3.3/dist/docx-preview.min.js');
                })
                .then(function () {
                    if (window.JSZip && window.docx && typeof window.docx.renderAsync === 'function') {
                        resolve();
                    } else {
                        reject(new Error('DOCX preview dependencies did not initialize correctly'));
                    }
                })
                .catch(reject);
        });
    }

    function isZipBasedDocx(arrayBuffer) {
        if (!arrayBuffer || arrayBuffer.byteLength < 4) {
            return false;
        }

        var header = new Uint8Array(arrayBuffer, 0, 4);
        return header[0] === 0x50 && header[1] === 0x4B && header[2] === 0x03 && header[3] === 0x04;
    }

    async function showDocxPreview(title, fileUrl, downloadName) {
        var elements = getElements();
        if (!elements.modal || !elements.title || !elements.frame || !elements.docx) {
            return;
        }

        try {
            await ensureDocxPreviewLibrary();

            var response = await window.fetch(fileUrl, {
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to load file (' + response.status + ')');
            }

            var arrayBuffer = await response.arrayBuffer();
            if (!isZipBasedDocx(arrayBuffer)) {
                throw new Error('Invalid DOCX file format');
            }

            elements.docx.innerHTML = '';
            await window.docx.renderAsync(arrayBuffer, elements.docx, null, {
                className: 'docx-preview',
                inWrapper: true,
                breakPages: true
            });

            elements.title.textContent = String(title || 'Form') + ' Preview';
            elements.frame.style.display = 'none';
            elements.frame.src = '';
            elements.docx.style.display = 'block';

            state.downloadUrl = fileUrl || '';
            state.downloadName = downloadName || '';
            openModal();
        } catch (error) {
            console.error('DOCX preview error:', error);
            showMessage('Unable to preview DOCX file. Please download it instead.', 'error');
        }
    }

    function openPreview(config) {
        var title = String(config && config.title ? config.title : 'Form');
        var fileUrl = getAbsoluteUrl(config && config.formUrl ? config.formUrl : '');
        var fileExt = normalizeExt(config && config.fileExt ? config.fileExt : '');
        var isPdf = String(config && config.isPdf ? config.isPdf : '') === '1' || fileExt === 'pdf';
        var downloadName = String(config && config.downloadName ? config.downloadName : '').trim();

        if (!fileUrl) {
            showMessage('Preview is not available for this form.', 'warning');
            return;
        }

        if (isPdf) {
            showIframePreview(title, fileUrl, fileUrl, downloadName);
            return;
        }

        if (fileExt === 'docx') {
            showDocxPreview(title, fileUrl, downloadName);
            return;
        }

        if (fileExt === 'doc') {
            if (canUseOnlineDocPreview()) {
                showIframePreview(
                    title,
                    'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(fileUrl),
                    fileUrl,
                    downloadName
                );
            } else {
                window.open(fileUrl, '_blank', 'noopener');
                showMessage('DOC preview opened in a new tab because in-page preview is not supported on localhost.', 'info');
            }
            return;
        }

        window.open(fileUrl, '_blank', 'noopener');
    }

    function openPreviewFromElement(trigger) {
        if (!trigger) {
            return;
        }

        openPreview({
            title: trigger.getAttribute('data-form-title') || trigger.textContent,
            formUrl: trigger.getAttribute('data-form-url'),
            fileExt: trigger.getAttribute('data-file-ext'),
            isPdf: trigger.getAttribute('data-is-pdf'),
            downloadName: trigger.getAttribute('data-download-name')
        });
    }

    function handleDocumentClick(event) {
        var trigger = event.target.closest('[data-form-preview-trigger="1"]');
        if (trigger) {
            event.preventDefault();
            openPreviewFromElement(trigger);
            return;
        }

        if (event.target.closest('[data-form-preview-close]')) {
            closeModal();
            return;
        }

        var elements = getElements();
        if (elements.modal && event.target === elements.modal) {
            closeModal();
        }
    }

    function bindStaticControls() {
        var elements = getElements();
        if (!elements.download) {
            return;
        }

        elements.download.addEventListener('click', function () {
            startDownload(state.downloadUrl, state.downloadName);
        });

        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('keydown', function (event) {
            var elements = getElements();
            if (event.key === 'Escape' && elements.modal && elements.modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindStaticControls, { once: true });
    } else {
        bindStaticControls();
    }

    window.CCISFormPreview = {
        close: closeModal,
        open: openPreview,
        openFromElement: openPreviewFromElement
    };
})(window, document);
