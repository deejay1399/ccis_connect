(function () {
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

        resolveInitialSection();
    });
})();