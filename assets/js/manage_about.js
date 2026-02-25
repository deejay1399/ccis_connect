(function ($) {
    'use strict';

    const API = {
        load: 'admin/manage/about/load',
        saveHistory: 'admin/manage/about/save_history',
        saveVmgo: 'admin/manage/about/save_vmgo',
        saveHymn: 'admin/manage/about/save_hymn',
        deleteVideo: 'admin/manage/about/delete_video'
    };

    let aboutData = null;

    const defaultData = {
        history: {
            content: "The College of Computing and Information Sciences (CCIS) is the newest academic department of Bohol Island State University - Balilihan Campus, officially established in 2024."
        },
        vmgo: {
            vision: '',
            mission: '',
            goals: [],
            coreValues: []
        },
        hymn: {
            verse1: '',
            chorus: '',
            finale: '',
            jingleVerse1: '',
            jingleChorus: '',
            jingleVerse2: '',
            jingleRepeatChorus: '',
            jingleBridge: '',
            jingleFinalChorus: '',
            hymnVideo: 'assets/sounds/bisu_hymn_lyric_video.mp4',
            jingleVideo: 'assets/sounds/BISU JINGLE.mp4'
        }
    };

    function endpoint(path) {
        const base = window.BASE_URL || '/';
        return base + 'index.php/' + path;
    }

    function showNotification(message, type) {
        const cls = type === 'error' ? 'alert-danger' : 'alert-success';
        $('.admin-notification').remove();

        const html = `
            <div class="admin-notification alert ${cls} alert-dismissible fade show" style="position:fixed;top:20px;right:20px;z-index:9999;min-width:320px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        $('body').append(html);
        setTimeout(() => $('.admin-notification').alert('close'), 3000);
    }

    function normalizeData(payload) {
        const data = payload || {};
        return {
            history: {
                content: data.history && typeof data.history.content === 'string' ? data.history.content : defaultData.history.content
            },
            vmgo: {
                vision: data.vmgo && typeof data.vmgo.vision === 'string' ? data.vmgo.vision : defaultData.vmgo.vision,
                mission: data.vmgo && typeof data.vmgo.mission === 'string' ? data.vmgo.mission : defaultData.vmgo.mission,
                goals: Array.isArray(data.vmgo && data.vmgo.goals) ? data.vmgo.goals : defaultData.vmgo.goals,
                coreValues: Array.isArray(data.vmgo && data.vmgo.coreValues) ? data.vmgo.coreValues : defaultData.vmgo.coreValues
            },
            hymn: {
                verse1: data.hymn && typeof data.hymn.verse1 === 'string' ? data.hymn.verse1 : defaultData.hymn.verse1,
                chorus: data.hymn && typeof data.hymn.chorus === 'string' ? data.hymn.chorus : defaultData.hymn.chorus,
                finale: data.hymn && typeof data.hymn.finale === 'string' ? data.hymn.finale : defaultData.hymn.finale,
                jingleVerse1: data.hymn && typeof data.hymn.jingleVerse1 === 'string' ? data.hymn.jingleVerse1 : defaultData.hymn.jingleVerse1,
                jingleChorus: data.hymn && typeof data.hymn.jingleChorus === 'string' ? data.hymn.jingleChorus : defaultData.hymn.jingleChorus,
                jingleVerse2: data.hymn && typeof data.hymn.jingleVerse2 === 'string' ? data.hymn.jingleVerse2 : defaultData.hymn.jingleVerse2,
                jingleRepeatChorus: data.hymn && typeof data.hymn.jingleRepeatChorus === 'string' ? data.hymn.jingleRepeatChorus : defaultData.hymn.jingleRepeatChorus,
                jingleBridge: data.hymn && typeof data.hymn.jingleBridge === 'string' ? data.hymn.jingleBridge : defaultData.hymn.jingleBridge,
                jingleFinalChorus: data.hymn && typeof data.hymn.jingleFinalChorus === 'string' ? data.hymn.jingleFinalChorus : defaultData.hymn.jingleFinalChorus,
                hymnVideo: data.hymn && data.hymn.hymnVideo ? data.hymn.hymnVideo : defaultData.hymn.hymnVideo,
                jingleVideo: data.hymn && data.hymn.jingleVideo ? data.hymn.jingleVideo : defaultData.hymn.jingleVideo
            }
        };
    }

    function populateGoals(goals) {
        const $container = $('#goals-container');
        $container.empty();

        goals.forEach((goal) => {
            const item = `
                <div class="goal-item mb-2">
                    <div class="d-flex gap-2 align-items-start">
                        <textarea class="form-control goal-text" rows="2" placeholder="Enter goal">${escapeHtml(goal)}</textarea>
                        <button type="button" class="btn btn-sm btn-danger remove-goal"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
            $container.append(item);
        });

        bindGoalDelete();
    }

    function populateCoreValues(coreValues) {
        const $container = $('#core-values-container');
        $container.empty();

        coreValues.forEach((value) => {
            const item = `
                <div class="core-value-horizontal mb-3">
                    <div class="d-flex gap-2 align-items-start">
                        <div class="flex-grow-1">
                            <input type="text" class="form-control core-value-name mb-2" placeholder="Core value name" value="${escapeHtml(value.name || '')}">
                            <textarea class="form-control core-value-description" rows="3" placeholder="Core value description">${escapeHtml(value.description || '')}</textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-core-value"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
            $container.append(item);
        });

        bindCoreValueDelete();
    }

    function renderCurrentVideos(hymn) {
        const hymnUrl = hymn.hymnVideo ? (window.BASE_URL + hymn.hymnVideo) : null;
        const jingleUrl = hymn.jingleVideo ? (window.BASE_URL + hymn.jingleVideo) : null;

        const hymnCard = hymnUrl ? `
            <div class="mb-3">
                <p class="mb-1"><strong>Current Hymn Video:</strong></p>
                <video controls style="width:100%; max-height:240px;" preload="metadata">
                    <source src="${hymnUrl}" type="video/mp4">
                </video>
                <button type="button" class="btn btn-sm btn-outline-danger mt-2 delete-video-btn" data-type="hymn">
                    <i class="fas fa-trash me-1"></i>Remove Hymn Video
                </button>
            </div>
        ` : '<p class="text-muted mb-3">No hymn video uploaded.</p>';

        const jingleCard = jingleUrl ? `
            <div class="mb-2">
                <p class="mb-1"><strong>Current Jingle Video:</strong></p>
                <video controls style="width:100%; max-height:240px;" preload="metadata">
                    <source src="${jingleUrl}" type="video/mp4">
                </video>
                <button type="button" class="btn btn-sm btn-outline-danger mt-2 delete-video-btn" data-type="jingle">
                    <i class="fas fa-trash me-1"></i>Remove Jingle Video
                </button>
            </div>
        ` : '<p class="text-muted">No jingle video uploaded.</p>';

        $('#current-videos').html(hymnCard + jingleCard);

        $('.delete-video-btn').off('click').on('click', function () {
            const type = $(this).data('type');
            deleteVideo(type);
        });
    }

    function populateAll() {
        $('#history-content').val(aboutData.history.content);
        $('#vision-content').val(aboutData.vmgo.vision);
        $('#mission-content').val(aboutData.vmgo.mission);
        $('#verse1-content').val(aboutData.hymn.verse1);
        $('#chorus-content').val(aboutData.hymn.chorus);
        $('#finale-content').val(aboutData.hymn.finale);
        $('#jingle-verse1-content').val(aboutData.hymn.jingleVerse1);
        $('#jingle-chorus-content').val(aboutData.hymn.jingleChorus);
        $('#jingle-verse2-content').val(aboutData.hymn.jingleVerse2);
        $('#jingle-repeat-chorus-content').val(aboutData.hymn.jingleRepeatChorus);
        $('#jingle-bridge-content').val(aboutData.hymn.jingleBridge);
        $('#jingle-final-chorus-content').val(aboutData.hymn.jingleFinalChorus);

        populateGoals(aboutData.vmgo.goals);
        populateCoreValues(aboutData.vmgo.coreValues);
        renderCurrentVideos(aboutData.hymn);
    }

    function loadAboutContent() {
        $.getJSON(endpoint(API.load))
            .done(function (resp) {
                if (!resp || !resp.success) {
                    showNotification('Failed to load About content.', 'error');
                    return;
                }

                aboutData = normalizeData(resp.data);
                populateAll();
            })
            .fail(function () {
                showNotification('Failed to load About content.', 'error');
            });
    }

    function saveHistory() {
        const content = $('#history-content').val();
        $.post(endpoint(API.saveHistory), { content: content })
            .done(function (resp) {
                if (!resp || !resp.success) {
                    showNotification('Unable to save history.', 'error');
                    return;
                }

                showNotification('History saved successfully.', 'success');
                loadAboutContent();
            })
            .fail(function () {
                showNotification('Unable to save history.', 'error');
            });
    }

    function saveVmgo() {
        const goals = [];
        $('.goal-text').each(function () {
            const value = ($(this).val() || '').trim();
            if (value) {
                goals.push(value);
            }
        });

        const coreValues = [];
        $('.core-value-horizontal').each(function () {
            const name = ($(this).find('.core-value-name').val() || '').trim();
            const description = ($(this).find('.core-value-description').val() || '').trim();
            if (name && description) {
                coreValues.push({ name, description });
            }
        });

        $.post(endpoint(API.saveVmgo), {
            vision: $('#vision-content').val(),
            mission: $('#mission-content').val(),
            goals: JSON.stringify(goals),
            core_values: JSON.stringify(coreValues)
        })
            .done(function (resp) {
                if (!resp || !resp.success) {
                    showNotification('Unable to save VMGO.', 'error');
                    return;
                }

                showNotification('VMGO saved successfully.', 'success');
                loadAboutContent();
            })
            .fail(function () {
                showNotification('Unable to save VMGO.', 'error');
            });
    }

    function saveHymn() {
        const formData = new FormData();
        formData.append('verse1', $('#verse1-content').val());
        formData.append('chorus', $('#chorus-content').val());
        formData.append('finale', $('#finale-content').val());
        formData.append('jingle_verse1', $('#jingle-verse1-content').val());
        formData.append('jingle_chorus', $('#jingle-chorus-content').val());
        formData.append('jingle_verse2', $('#jingle-verse2-content').val());
        formData.append('jingle_repeat_chorus', $('#jingle-repeat-chorus-content').val());
        formData.append('jingle_bridge', $('#jingle-bridge-content').val());
        formData.append('jingle_final_chorus', $('#jingle-final-chorus-content').val());

        const hymnVideo = $('#hymn-video')[0].files[0];
        const jingleVideo = $('#jingle-video')[0].files[0];

        if (hymnVideo) {
            formData.append('hymn_video', hymnVideo);
        }

        if (jingleVideo) {
            formData.append('jingle_video', jingleVideo);
        }

        $.ajax({
            url: endpoint(API.saveHymn),
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false
        })
            .done(function (resp) {
                if (!resp || !resp.success) {
                    showNotification('Unable to save hymn section.', 'error');
                    return;
                }

                $('#hymn-video').val('');
                $('#jingle-video').val('');
                showNotification('Hymn section saved successfully.', 'success');
                loadAboutContent();
            })
            .fail(function () {
                showNotification('Unable to save hymn section.', 'error');
            });
    }

    function deleteVideo(type) {
        $.post(endpoint(API.deleteVideo), { type: type })
            .done(function (resp) {
                if (!resp || !resp.success) {
                    showNotification('Unable to remove video.', 'error');
                    return;
                }

                showNotification('Video removed successfully.', 'success');
                loadAboutContent();
            })
            .fail(function () {
                showNotification('Unable to remove video.', 'error');
            });
    }

    function bindGoalDelete() {
        $('.remove-goal').off('click').on('click', function () {
            $(this).closest('.goal-item').remove();
        });
    }

    function bindCoreValueDelete() {
        $('.remove-core-value').off('click').on('click', function () {
            $(this).closest('.core-value-horizontal').remove();
        });
    }

    function bindAddButtons() {
        $('#add-goal').on('click', function () {
            $('#goals-container').append(`
                <div class="goal-item mb-2">
                    <div class="d-flex gap-2 align-items-start">
                        <textarea class="form-control goal-text" rows="2" placeholder="Enter goal"></textarea>
                        <button type="button" class="btn btn-sm btn-danger remove-goal"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `);
            bindGoalDelete();
        });

        $('#add-core-value').on('click', function () {
            $('#core-values-container').append(`
                <div class="core-value-horizontal mb-3">
                    <div class="d-flex gap-2 align-items-start">
                        <div class="flex-grow-1">
                            <input type="text" class="form-control core-value-name mb-2" placeholder="Core value name">
                            <textarea class="form-control core-value-description" rows="3" placeholder="Core value description"></textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-core-value"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `);
            bindCoreValueDelete();
        });
    }

    function bindVmgoTabs() {
        $('.vmgo-tab-btn').on('click', function () {
            const tab = $(this).data('tab');
            $('.vmgo-tab-btn').removeClass('active');
            $('.vmgo-tab-pane').removeClass('active');
            $(this).addClass('active');
            $('#' + tab + '-tab').addClass('active');
        });
    }

    function bindForms() {
        $('#history-form').on('submit', function (e) {
            e.preventDefault();
            saveHistory();
        });

        $('#vmgo-form').on('submit', function (e) {
            e.preventDefault();
            saveVmgo();
        });

        $('#hymn-form').on('submit', function (e) {
            e.preventDefault();
            saveHymn();
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function init() {
        bindVmgoTabs();
        bindAddButtons();
        bindForms();
        loadAboutContent();
    }

    $(init);
})(jQuery);
