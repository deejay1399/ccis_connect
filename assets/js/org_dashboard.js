(function () {
    var happeningSelectedFiles = {};

    function setActiveSection(sectionId) {
        $('.admin-section').removeClass('active-section');
        $('#' + sectionId).addClass('active-section');
        $('.admin-nav .nav-link').removeClass('active');
        $('.admin-nav .nav-link[href="#' + sectionId + '"]').addClass('active');
    }

    function resolveInitialSection() {
        var hash = window.location.hash ? window.location.hash.replace('#', '') : 'dashboard';
        if (!document.getElementById(hash)) {
            hash = 'dashboard';
        }
        setActiveSection(hash);
    }

    function openModalById(modalId) {
        var modalElement = document.getElementById(modalId);
        if (!modalElement) {
            return;
        }
        var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }

    $(function () {
        $('.admin-nav .nav-link[href^="#"]').on('click', function (e) {
            e.preventDefault();
            var target = ($(this).attr('href') || '').replace('#', '');
            if (!target) return;
            setActiveSection(target);
            window.location.hash = target;
        });

        $('.action-btn[data-action="add-officer"]').on('click', function () {
            setActiveSection('officers');
            window.location.hash = 'officers';
            openModalById('addOfficerModal');
        });

        $('.action-btn[data-action="add-adviser"]').on('click', function () {
            setActiveSection('advisers');
            window.location.hash = 'advisers';
            openModalById('addAdviserModal');
        });

        $('.action-btn[data-action="post-announcement"]').on('click', function () {
            setActiveSection('announcements');
            window.location.hash = 'announcements';
            openModalById('addAnnouncementModal');
        });

        $('.action-btn[data-action="upload-happening"]').on('click', function () {
            setActiveSection('happenings');
            window.location.hash = 'happenings';
            openModalById('addHappeningModal');
        });

        $('#addOfficerBtn').on('click', function () {
            openModalById('addOfficerModal');
        });

        $('#addAdviserBtn').on('click', function () {
            openModalById('addAdviserModal');
        });

        $('#addAnnouncementBtn').on('click', function () {
            openModalById('addAnnouncementModal');
        });

        $('#uploadHappeningBtn').on('click', function () {
            openModalById('addHappeningModal');
        });

        bindHappeningImagePreview();

        resolveInitialSection();
    });

    function bindHappeningImagePreview() {
        $(document).on('change', 'input[name="happening_images[]"]', function () {
            var targetId = $(this).data('preview-target');
            if (!targetId) {
                return;
            }

            var $preview = $('#' + targetId);
            if ($preview.length === 0) {
                return;
            }

            var files = (this.files && this.files.length) ? Array.from(this.files) : [];
            var inputKey = targetId;
            var existingFiles = Array.isArray(happeningSelectedFiles[inputKey]) ? happeningSelectedFiles[inputKey] : [];

            if (!files.length && existingFiles.length === 0) {
                $preview.empty();
                return;
            }

            // Additive selection: preserve previously selected files and append new picks.
            var mergedFiles = existingFiles.slice();
            files.forEach(function (file) {
                var duplicate = mergedFiles.some(function (f) {
                    return f.name === file.name && f.size === file.size && f.lastModified === file.lastModified;
                });
                if (!duplicate) {
                    mergedFiles.push(file);
                }
            });

            happeningSelectedFiles[inputKey] = mergedFiles;

            // Rebuild the native FileList so form submit includes all selected images.
            var dataTransfer = new DataTransfer();
            mergedFiles.forEach(function (file) {
                dataTransfer.items.add(file);
            });
            this.files = dataTransfer.files;

            $preview.empty();
            $preview.append('<small class="text-muted d-block mb-2">Selected image preview:</small>');
            var $grid = $('<div class="selected-preview-grid"></div>');

            mergedFiles.forEach(function (file) {
                if (!file.type || file.type.indexOf('image/') !== 0) {
                    return;
                }

                var objectUrl = URL.createObjectURL(file);
                var $item = $(
                    '<div class="selected-preview-item">' +
                        '<img alt="Selected image preview">' +
                        '<small></small>' +
                    '</div>'
                );

                $item.find('img').attr('src', objectUrl);
                $item.find('small').text(file.name);
                $item.find('img').on('load', function () {
                    URL.revokeObjectURL(objectUrl);
                });

                $grid.append($item);
            });

            if ($grid.children().length > 0) {
                $preview.append($grid);
                $preview.append('<small class="text-muted d-block mt-2">Total selected: ' + mergedFiles.length + ' image(s)</small>');
            }
        });
    }
})();
