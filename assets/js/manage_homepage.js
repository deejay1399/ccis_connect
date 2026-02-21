// Manage Homepage (DB-backed)
(function($) {
    'use strict';

    var MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

    var dbCarouselImages = [];
    var pendingCarouselImages = [];

    function baseUrl() {
        if (window.baseUrl) {
            return window.baseUrl;
        }
        return window.location.origin + '/ccis_connect/';
    }

    function toAbsolutePath(relativePath) {
        if (!relativePath) {
            return '';
        }
        if (/^https?:\/\//i.test(relativePath)) {
            return relativePath;
        }
        return baseUrl() + String(relativePath).replace(/^\/+/, '');
    }

    function showToast(message, type) {
        var css = 'alert-info';
        var icon = 'fa-info-circle';

        if (type === 'success') {
            css = 'alert-success';
            icon = 'fa-check-circle';
        } else if (type === 'warning') {
            css = 'alert-warning';
            icon = 'fa-exclamation-triangle';
        } else if (type === 'error') {
            css = 'alert-danger';
            icon = 'fa-exclamation-circle';
        }

        $('.admin-notification').remove();
        var html = [
            '<div class="admin-notification alert ', css, ' alert-dismissible fade show" ',
            'style="position:fixed;top:20px;right:20px;z-index:9999;min-width:320px;">',
            '<i class="fas ', icon, ' me-2"></i>',
            $('<div>').text(message).html(),
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>',
            '</div>'
        ].join('');

        $('body').append(html);
        setTimeout(function() {
            $('.admin-notification').alert('close');
        }, 4500);
    }

    function confirmAction(title, message, cb) {
        $('#confirmationModalLabel').text(title);
        $('#confirmationModalBody').text(message);

        var confirmBtn = $('#confirmActionBtn');
        confirmBtn.off('click').on('click', function() {
            cb();
            var modalEl = document.getElementById('confirmationModal');
            var modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
        });

        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmationModal'));
        modal.show();
    }

    function updateCurrentDate() {
        var now = new Date();
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        $('#current-date').text(now.toLocaleDateString('en-US', options));
    }

    function renderCarouselImages() {
        var $dbGrid = $('#carousel-images-grid');
        var $pendingGrid = $('#pending-images-grid');
        $dbGrid.empty();
        $pendingGrid.empty();

        if (!pendingCarouselImages.length) {
            $pendingGrid.append('<div class="preview-empty"><i class="fas fa-image"></i><span>No selected images yet.</span></div>');
        }

        if (!dbCarouselImages.length) {
            $dbGrid.append('<div class="preview-empty"><i class="fas fa-database"></i><span>No saved highlights yet.</span></div>');
        }

        pendingCarouselImages.forEach(function(item) {
            var caption = item.caption || 'New Image';
            var card = [
                '<div class="image-card" data-id="', item.id, '">',
                '<img src="', item.url, '" alt="', $('<div>').text(caption).html(), '">',
                '<div class="image-overlay"><p class="mb-0 text-truncate">', $('<div>').text(caption).html(), '</p></div>',
                '<div class="image-actions">',
                '<button class="btn btn-action btn-remove remove-pending-image-btn" data-id="', item.id, '" title="Remove Selected Image">',
                '<i class="fas fa-times"></i></button></div></div>'
            ].join('');
            $pendingGrid.append(card);
        });

        dbCarouselImages.forEach(function(item) {
            var caption = item.caption || 'Homepage Slide';
            var card = [
                '<div class="image-card" data-id="', item.id, '">',
                '<img src="', item.url, '" alt="', $('<div>').text(caption).html(), '">',
                '<div class="image-overlay"><p class="mb-0 text-truncate">', $('<div>').text(caption).html(), '</p></div>',
                '<div class="image-actions">',
                '<button class="btn btn-action btn-remove remove-db-image-btn" data-id="', item.id, '" title="Remove Saved Image">',
                '<i class="fas fa-times"></i></button></div></div>'
            ].join('');
            $dbGrid.append(card);
        });

        $('#pending-image-count').text(pendingCarouselImages.length);
        $('#image-count').text(dbCarouselImages.length);
    }

    function addSelectedFiles(fileList) {
        if (!fileList || !fileList.length) {
            return;
        }

        Array.prototype.forEach.call(fileList, function(file) {
            if (!file || !file.type.match(/^image\//i)) {
                return;
            }
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                showToast('"' + file.name + '" exceeds 20MB.', 'error');
                return;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                pendingCarouselImages.push({
                    id: 'new-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                    url: e.target.result,
                    caption: file.name.replace(/\.[^.]+$/, ''),
                    file: file,
                    existingPath: null
                });
                renderCarouselImages();
            };
            reader.readAsDataURL(file);
        });
    }


    function loadHomepageData() {
        $.ajax({
            url: baseUrl() + 'admin/manage/load_homepage_all',
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            var records = (response && response.success && Array.isArray(response.data)) ? response.data : [];
            var first = records.length ? records[0] : {};

            $('#welcome-title').val(first.title || '');
            $('#welcome-text').val(first.content || '');

            dbCarouselImages = records
                .filter(function(rec) { return !!rec.banner_image; })
                .map(function(rec) {
                    return {
                        id: 'db-' + rec.id,
                        url: toAbsolutePath(rec.banner_image),
                        caption: rec.title || 'Homepage Slide',
                        existingPath: rec.banner_image,
                        file: null
                    };
                });
            pendingCarouselImages = [];

            renderCarouselImages();
        }).fail(function(xhr) {
            var msg = 'Failed to load homepage data.';
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }
            showToast(msg, 'error');
        });
    }


    function saveHomepageBundle(successMessage) {
        var title = $.trim($('#welcome-title').val() || '');
        var content = $.trim($('#welcome-text').val() || '');

        var formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        dbCarouselImages.forEach(function(item) {
            if (item.existingPath) {
                formData.append('existing_images[]', item.existingPath);
            }
        });

        pendingCarouselImages.forEach(function(item) {
            if (item.file) {
                formData.append('banner_images[]', item.file);
            }
        });

        $.ajax({
            url: baseUrl() + 'admin/manage/replace_homepage',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function(response) {
            if (!response || !response.success) {
                showToast((response && response.message) ? response.message : 'Failed to save homepage.', 'error');
                return;
            }
            showToast(successMessage || 'Homepage saved successfully.', 'success');
            loadHomepageData();
        }).fail(function(xhr) {
            var msg = 'Failed to save homepage.';
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }
            showToast(msg, 'error');
        });
    }


    // Global handlers used by inline onclick in homepage view.
    window.saveCarouselChanges = function() {
        saveHomepageBundle('Carousel updated successfully.');
    };

    window.saveWelcomeMessage = function() {
        saveHomepageBundle('Welcome message updated successfully.');
    };

    window.showClearWelcomeMessageConfirmation = function() {
        confirmAction('Clear Welcome Message', 'Clear welcome title and message?', function() {
            $('#welcome-title').val('');
            $('#welcome-text').val('');
            saveHomepageBundle('Welcome message cleared.');
        });
    };


    $(document).on('click', '.remove-pending-image-btn', function() {
        var id = $(this).data('id');
        confirmAction('Remove Image', 'Remove this selected image from preview?', function() {
            pendingCarouselImages = pendingCarouselImages.filter(function(item) { return item.id !== id; });
            renderCarouselImages();
        });
    });

    $(document).on('click', '.remove-db-image-btn', function() {
        var id = $(this).data('id');
        confirmAction('Remove Image', 'Remove this saved image from Current Highlights?', function() {
            dbCarouselImages = dbCarouselImages.filter(function(item) { return item.id !== id; });
            renderCarouselImages();
        });
    });


    $('#carousel-upload').on('change', function(e) {
        addSelectedFiles(e.target.files);
        e.target.value = '';
    });

    $('.image-upload-zone').on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('hover');
    }).on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('hover');
    }).on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('hover');
        var files = e.originalEvent.dataTransfer.files;
        addSelectedFiles(files);
    });

    $(function() {
        updateCurrentDate();
        setInterval(updateCurrentDate, 60000);

        loadHomepageData();
    });
})(jQuery);
