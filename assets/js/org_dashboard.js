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

    $(function () {
        $('.admin-nav .nav-link[href^="#"]').on('click', function (e) {
            e.preventDefault();
            var target = ($(this).attr('href') || '').replace('#', '');
            if (!target) return;
            setActiveSection(target);
            window.location.hash = target;
        });

        resolveInitialSection();
    });
})();

