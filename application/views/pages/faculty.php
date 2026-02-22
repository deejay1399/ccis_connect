<section class="faculty-section">
    <div class="container">
        <div class="content-card">
            <h3><i class="fas fa-sitemap me-3"></i>CCIS Organizational Chart</h3>
            <p class="lead mb-4">Leadership structure of the College of Computing and Information Sciences.</p>

            <?php if (isset($faculty_members) && !empty($faculty_members)): ?>
                <?php
                    $presidents = [];
                    $vicePresidents = [];
                    $deans = [];
                    $chairpersons = [];
                    $instructors = [];
                    $others = [];

                    $defaultFacultyImage = base_url('assets/images/ccis.png');
                    $buildImagePath = function($member) use ($defaultFacultyImage) {
                        $rawImage = trim((string) ($member['image'] ?? ''));
                        if ($rawImage === '') {
                            return $defaultFacultyImage;
                        }

                        if (preg_match('/^https?:\/\//i', $rawImage)) {
                            return $rawImage;
                        }

                        if (strpos($rawImage, 'uploads/faculty/') === 0) {
                            return base_url($rawImage);
                        }

                        return base_url('uploads/faculty/' . ltrim($rawImage, '/'));
                    };

                    $vpOrder = [
                        'academics and quality assurance' => 1,
                        'research, development and extension' => 2,
                        'administration and finance' => 3,
                        'student affairs and services' => 4
                    ];

                    foreach ($faculty_members as $member) {
                        $position = strtolower(trim((string) ($member['position'] ?? '')));
                        if ($position === 'president') {
                            $presidents[] = $member;
                        } elseif ($position === 'vice president') {
                            $vicePresidents[] = $member;
                        } elseif ($position === 'dean') {
                            $deans[] = $member;
                        } elseif ($position === 'chairperson') {
                            $chairpersons[] = $member;
                        } elseif (in_array($position, ['instructor', 'instuctor', 'prof', 'professor'], true)) {
                            $instructors[] = $member;
                        } else {
                            $others[] = $member;
                        }
                    }

                    usort($vicePresidents, function($a, $b) use ($vpOrder) {
                        $aLabel = strtolower((string) ($a['vp_type'] ?? $a['advisory'] ?? $a['department'] ?? ''));
                        $bLabel = strtolower((string) ($b['vp_type'] ?? $b['advisory'] ?? $b['department'] ?? ''));
                        $aRank = 99;
                        $bRank = 99;
                        foreach ($vpOrder as $key => $rank) {
                            if (strpos($aLabel, $key) !== false) {
                                $aRank = $rank;
                            }
                            if (strpos($bLabel, $key) !== false) {
                                $bRank = $rank;
                            }
                        }
                        return $aRank <=> $bRank;
                    });

                    usort($chairpersons, function($a, $b) {
                        $aCourse = strtolower((string) ($a['course'] ?? $a['advisory'] ?? $a['department'] ?? ''));
                        $bCourse = strtolower((string) ($b['course'] ?? $b['advisory'] ?? $b['department'] ?? ''));
                        return strcmp($aCourse, $bCourse);
                    });

                    $renderCards = function($list, $roleLabel, $sizeClass = '') use ($buildImagePath, $defaultFacultyImage) {
                        foreach ($list as $member) {
                            $fullName = trim(($member['firstname'] ?? '') . ' ' . ($member['lastname'] ?? ''));
                            $fullName = $fullName !== '' ? $fullName : 'Faculty Member';
                            $position = strtolower(trim((string) ($member['position'] ?? '')));
                            $subtitle = '';
                            $displayRole = $roleLabel;
                            $imageSrc = $buildImagePath($member);
                            $fallbackSrc = $defaultFacultyImage;

                            if ($position === 'vice president') {
                                $subtitle = (string) ($member['vp_type'] ?? $member['advisory'] ?? $member['department'] ?? '');
                            } elseif ($position === 'chairperson') {
                                $subtitle = (string) ($member['course'] ?? $member['advisory'] ?? $member['department'] ?? '');
                            } elseif ($position === 'dean') {
                                $subtitle = 'College of Computing and Information Sciences';
                            } elseif (in_array($position, ['instructor', 'instuctor', 'prof', 'professor'], true)) {
                                $subtitle = trim((string) ($member['advisory'] ?? ''));
                                if ($subtitle !== '' && stripos($subtitle, 'adviser') === false) {
                                    $subtitle .= ' Adviser';
                                }
                                if ($subtitle !== '') {
                                    $displayRole = '';
                                }
                            }
                            ?>
                            <article class="org-node <?php echo $sizeClass; ?>">
                                <div class="org-avatar">
                                    <img src="<?php echo htmlspecialchars($imageSrc, ENT_QUOTES, 'UTF-8'); ?>"
                                         alt="<?php echo htmlspecialchars($fullName); ?>"
                                         onerror="this.onerror=null;this.src='<?php echo htmlspecialchars($fallbackSrc, ENT_QUOTES, 'UTF-8'); ?>';">
                                </div>
                                <h4><?php echo htmlspecialchars($fullName); ?></h4>
                                <?php if ($displayRole !== ''): ?>
                                    <p class="org-role"><?php echo htmlspecialchars($displayRole); ?></p>
                                <?php endif; ?>
                                <?php if ($subtitle !== ''): ?>
                                    <p class="org-subrole"><?php echo htmlspecialchars($subtitle); ?></p>
                                <?php endif; ?>
                            </article>
                            <?php
                        }
                    };
                ?>

                <div class="org-chart">
                    <div class="org-level">
                        <h5 class="org-level-title">President</h5>
                        <div class="org-row org-row-center">
                            <?php $renderCards($presidents, 'President', 'org-node-lg'); ?>
                        </div>
                    </div>

                    <div class="org-level">
                        <h5 class="org-level-title">Vice Presidents</h5>
                        <div class="org-row org-row-four">
                            <?php $renderCards($vicePresidents, 'Vice President'); ?>
                        </div>
                    </div>

                    <div class="org-level">
                        <h5 class="org-level-title">Dean</h5>
                        <div class="org-row org-row-center">
                            <?php $renderCards($deans, 'Dean', 'org-node-lg'); ?>
                        </div>
                    </div>

                    <div class="org-level">
                        <h5 class="org-level-title">Chairpersons</h5>
                        <div class="org-row org-row-two">
                            <?php $renderCards($chairpersons, 'Chairperson'); ?>
                        </div>
                    </div>

                    <div class="org-level">
                        <h5 class="org-level-title">Instructors</h5>
                        <div class="org-row org-row-many">
                            <?php $renderCards($instructors, 'Instructor'); ?>
                            <?php $renderCards($others, 'Faculty'); ?>
                        </div>
                    </div>
                </div>
            <?php else: ?>
                <p class="text-center col-12">No faculty members available at this time.</p>
            <?php endif; ?>
        </div>
    </div>
</section>
