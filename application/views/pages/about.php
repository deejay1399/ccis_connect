<?php
$about = isset($about_content) && is_array($about_content) ? $about_content : [];

$history = isset($about['history']['content']) ? $about['history']['content'] : '';
$vision = isset($about['vmgo']['vision']) ? $about['vmgo']['vision'] : '';
$mission = isset($about['vmgo']['mission']) ? $about['vmgo']['mission'] : '';
$goals = isset($about['vmgo']['goals']) && is_array($about['vmgo']['goals']) ? $about['vmgo']['goals'] : [];
$core_values = isset($about['vmgo']['coreValues']) && is_array($about['vmgo']['coreValues']) ? $about['vmgo']['coreValues'] : [];

$hymn_verse1 = isset($about['hymn']['verse1']) ? $about['hymn']['verse1'] : '';
$hymn_chorus = isset($about['hymn']['chorus']) ? $about['hymn']['chorus'] : '';
$hymn_finale = isset($about['hymn']['finale']) ? $about['hymn']['finale'] : '';
$jingle_verse1 = isset($about['hymn']['jingleVerse1']) ? $about['hymn']['jingleVerse1'] : '';
$jingle_chorus = isset($about['hymn']['jingleChorus']) ? $about['hymn']['jingleChorus'] : '';
$jingle_verse2 = isset($about['hymn']['jingleVerse2']) ? $about['hymn']['jingleVerse2'] : '';
$jingle_repeat_chorus = isset($about['hymn']['jingleRepeatChorus']) ? $about['hymn']['jingleRepeatChorus'] : '';
$jingle_bridge = isset($about['hymn']['jingleBridge']) ? $about['hymn']['jingleBridge'] : '';
$jingle_final_chorus = isset($about['hymn']['jingleFinalChorus']) ? $about['hymn']['jingleFinalChorus'] : '';

$hymn_video = isset($about['hymn']['hymnVideo']) && $about['hymn']['hymnVideo'] !== ''
    ? $about['hymn']['hymnVideo']
    : 'assets/sounds/bisu_hymn_lyric_video.mp4';

$jingle_video = isset($about['hymn']['jingleVideo']) && $about['hymn']['jingleVideo'] !== ''
    ? $about['hymn']['jingleVideo']
    : 'assets/sounds/BISU JINGLE.mp4';
?>

<main class="about-page">
    <div class="container">
        <section id="history-section" class="content-section active-section" style="display: block;">
            <div class="content-card">
                <h3><i class="fas fa-history me-3"></i>History of CCIS</h3>
                <div class="history-content">
                    <?php foreach (preg_split('/\r\n|\r|\n/', (string) $history) as $line): ?>
                        <?php if (trim($line) !== ''): ?>
                            <p><?php echo html_escape($line); ?></p>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section id="vmgo-section" class="content-section" style="display: none;">
            <div class="content-card">
                <h3><i class="fas fa-bullseye me-3"></i>Vision, Mission, Goals, and Core Values</h3>

                <div class="vmgo-tabs">
                    <div class="vmgo-tab-content">
                        <div class="vmgo-tab-pane active" id="vision-tab">
                            <div class="vmgo-horizontal-card">
                                <div class="vmgo-icon-horizontal">
                                    <i class="fas fa-eye"></i>
                                </div>
                                <div class="vmgo-text-horizontal">
                                    <h4 class="mb-3">Vision</h4>
                                    <p><?php echo nl2br(html_escape($vision)); ?></p>
                                </div>
                            </div>
                        </div>

                        <div class="vmgo-tab-pane active" id="mission-tab">
                            <div class="vmgo-horizontal-card">
                                <div class="vmgo-icon-horizontal">
                                    <i class="fas fa-rocket"></i>
                                </div>
                                <div class="vmgo-text-horizontal">
                                    <h4 class="mb-3">Mission</h4>
                                    <p><?php echo nl2br(html_escape($mission)); ?></p>
                                </div>
                            </div>
                        </div>

                        <div class="vmgo-tab-pane active" id="goals-tab">
                            <div class="vmgo-horizontal-card">
                                <div class="vmgo-icon-horizontal">
                                    <i class="fas fa-flag"></i>
                                </div>
                                <div class="vmgo-text-horizontal">
                                    <h4 class="mb-3">Goals</h4>
                                    <ul class="goals-list">
                                        <?php foreach ($goals as $goal): ?>
                                            <li><?php echo html_escape($goal); ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="vmgo-tab-pane active" id="core-values-tab">
                            <div class="vmgo-horizontal-card">
                                <div class="vmgo-icon-horizontal">
                                    <i class="fas fa-heart"></i>
                                </div>
                                <div class="vmgo-content-horizontal">
                                    <h4>Core Values</h4>
                                    <p class="lead">The foundation of our educational philosophy and institutional culture.</p>
                                    <div class="core-values-horizontal">
                                        <?php foreach ($core_values as $value): ?>
                                            <div class="core-value-horizontal">
                                                <strong><?php echo html_escape(isset($value['name']) ? $value['name'] : ''); ?>.</strong>
                                                <?php echo html_escape(isset($value['description']) ? $value['description'] : ''); ?>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="hymn-section" class="content-section" style="display: none;">
            <div class="content-card">
                <h3><i class="fas fa-music me-3"></i>BISU Hymn</h3>
                <div class="hymn-content">
                    <div class="hymn-header text-center mb-4">
                        <h4 class="text-primary">Bohol Island State University Hymn</h4>
                        <p class="hymn-subtitle">Official University Anthem</p>
                    </div>

                    <div class="hymn-audio mb-5">
                        <div class="audio-player">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title text-center">
                                        <i class="fas fa-video text-primary me-2"></i>
                                        Watch BISU Hymn Lyric Video
                                    </h5>
                                    <video controls style="width: 100%" class="mt-2" preload="metadata">
                                        <source src="<?php echo base_url($hymn_video); ?>" type="video/mp4">
                                        Your browser does not support the video element.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hymn-lyrics">
                        <div class="verse mb-4">
                            <p class="text-center fw-bold mb-3">[Verse 1]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $hymn_verse1) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="chorus mb-4">
                            <p class="text-center fw-bold mb-3">[Chorus]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $hymn_chorus) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="verse">
                            <p class="text-center fw-bold mb-3">[Finale]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $hymn_finale) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="hymn-header text-center mt-5 mb-4">
                        <h4 class="text-primary">Bohol Island State University Jingle</h4>
                        <p class="hymn-subtitle">Official BISU Jingle</p>
                    </div>

                    <div class="hymn-audio mb-5">
                        <div class="audio-player">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title text-center">
                                        <i class="fas fa-video text-primary me-2"></i>
                                        Watch BISU Jingle Video
                                    </h5>
                                    <video controls style="width: 100%" class="mt-2" preload="metadata">
                                        <source src="<?php echo base_url($jingle_video); ?>" type="video/mp4">
                                        Your browser does not support the video element.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hymn-lyrics">
                        <div class="verse mb-4">
                            <p class="text-center fw-bold mb-3">[Verse 1]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_verse1) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="chorus mb-4">
                            <p class="text-center fw-bold mb-3">[Chorus]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_chorus) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="verse mb-4">
                            <p class="text-center fw-bold mb-3">[Verse 2]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_verse2) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="chorus mb-4">
                            <p class="text-center fw-bold mb-3">[Repeat Chorus]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_repeat_chorus) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="verse mb-4">
                            <p class="text-center fw-bold mb-3">[Bridge]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_bridge) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>

                        <div class="chorus">
                            <p class="text-center fw-bold mb-3">[Final Chorus]</p>
                            <?php foreach (preg_split('/\r\n|\r|\n/', (string) $jingle_final_chorus) as $line): ?>
                                <?php if (trim($line) !== ''): ?>
                                    <p><?php echo html_escape($line); ?></p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>
