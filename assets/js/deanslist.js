(function($) {
    'use strict';

    const base = (window.BASE_URL || '/').endsWith('/') ? (window.BASE_URL || '/') : (window.BASE_URL + '/');
    const API_URL = base + 'updates/api/deans_list';

    let allRows = [];
    let selectedYear = 'all';

    $(document).ready(function() {
        loadDeansList();
        $(document).on('change', '#deans-year-filter', function() {
            selectedYear = String($(this).val() || 'all');
            render();
        });
    });

    function loadDeansList() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            dataType: 'json'
        }).done(function(res) {
            if (res && res.success) {
                allRows = Array.isArray(res.data) ? res.data : [];
                renderYearFilter();
                render();
                return;
            }
            renderEmpty('Unable to load Dean\'s List at the moment.');
        }).fail(function() {
            renderEmpty('Unable to load Dean\'s List at the moment.');
        });
    }

    function renderYearFilter() {
        const years = [];
        allRows.forEach(function(row) {
            const year = String(row.academic_year || '').trim();
            if (year && years.indexOf(year) === -1) {
                years.push(year);
            }
        });

        years.sort().reverse();
        const options = ['<option value="all">All Academic Years</option>']
            .concat(years.map(function(year) {
                return '<option value="' + escapeHtml(year) + '">' + escapeHtml(year) + '</option>';
            }))
            .join('');

        $('.academic-year-filter').html(
            '<select id="deans-year-filter" class="filter-select">' + options + '</select>'
        );
    }

    function render() {
        const filtered = allRows.filter(function(row) {
            if (selectedYear === 'all') return true;
            return String(row.academic_year || '') === selectedYear;
        });

        if (!filtered.length) {
            renderEmpty('No Dean\'s List achievers found for this filter.');
            return;
        }

        const grouped = {};
        filtered.forEach(function(row) {
            const year = String(row.academic_year || 'Unspecified');
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(row);
        });

        const html = Object.keys(grouped).sort().reverse().map(function(year) {
            const achieverCards = grouped[year].map(function(row) {
                const honorsClass = getHonorsClass(row.honors);
                const img = row.image
                    ? escapeHtml(base + row.image)
                    : (base + 'assets/images/ccis.png');

                const achievementsItems = parseAchievements(row.achievements).map(function(item) {
                    return '<li>' + escapeHtml(item) + '</li>';
                }).join('');

                const achievementsHtml = achievementsItems
                    ? '<div class="achiever-achievements"><h6><i class="fas fa-trophy"></i> Notable Achievements</h6><ul>' + achievementsItems + '</ul></div>'
                    : '';

                return [
                    '<div class="achiever-card ' + honorsClass + '">',
                    '<div class="achiever-header">',
                    '<div class="achiever-image"><img src="' + img + '" alt="' + escapeHtml(row.full_name || 'Achiever') + '" onerror="this.onerror=null;this.src=\'' + escapeHtml(base + 'assets/images/ccis.png') + '\';"></div>',
                    '<div class="achiever-info">',
                    '<h5 class="achiever-name">' + escapeHtml(row.full_name || 'Unnamed Achiever') + '</h5>',
                    '<div class="achiever-year">' + escapeHtml(row.program || '-') + ' | ' + escapeHtml(row.year_level || '-') + '</div>',
                    '<div class="achiever-gwa">GWA: ' + escapeHtml(row.gwa || '-') + '</div>',
                    '</div>',
                    '</div>',
                    '<div class="achiever-honors">' + escapeHtml(row.honors || '-') + '</div>',
                    achievementsHtml,
                    '</div>'
                ].join('');
            }).join('');

            return [
                '<div class="program-section">',
                '<div class="deanslist-header">',
                '<h4>Dean\'s List Achievers</h4>',
                '<div class="academic-year-text">Academic Year ' + escapeHtml(year) + '</div>',
                '</div>',
                '<div class="achievers-grid">' + achieverCards + '</div>',
                '</div>'
            ].join('');
        }).join('');

        $('#deanslist-content').html(html);
    }

    function parseAchievements(raw) {
        const text = String(raw || '').trim();
        if (!text) return [];
        return text.split(',').map(function(item) {
            return item.trim();
        }).filter(Boolean);
    }

    function getHonorsClass(honors) {
        const value = String(honors || '').toLowerCase();
        if (value.indexOf('summa') !== -1) return 'summa';
        if (value.indexOf('magna') !== -1) return 'magna';
        return 'cum-laude';
    }

    function renderEmpty(message) {
        $('#deanslist-content').html(
            '<div class="empty-state"><i class="fas fa-award"></i><h5>No Dean\'s List Data</h5><p>' + escapeHtml(message) + '</p></div>'
        );
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})(jQuery);
