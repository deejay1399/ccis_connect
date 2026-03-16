<section class="faculty-section">
    <div class="container">
        <div class="content-card">
            <h3><i class="fas fa-sitemap me-3"></i>CCIS Organizational Chart</h3>
            <p class="lead mb-4">Leadership structure of the College of Computing and Information Sciences.</p>

            <?php if (isset($faculty_members) && !empty($faculty_members)): ?>
                <?php
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

                    $fullNameOf = function($member) {
                        $name = trim(($member['firstname'] ?? '') . ' ' . ($member['lastname'] ?? ''));
                        return $name !== '' ? $name : 'Vacant';
                    };

                    $findFirst = function($position, $matcher = null) use ($faculty_members) {
                        foreach ($faculty_members as $member) {
                            $memberPosition = strtolower(trim((string) ($member['position'] ?? '')));
                            if ($memberPosition !== strtolower($position)) {
                                continue;
                            }
                            if ($matcher !== null && !$matcher($member)) {
                                continue;
                            }
                            return $member;
                        }
                        return null;
                    };

                    $collect = function($position, $matcher = null) use ($faculty_members) {
                        $matches = [];
                        foreach ($faculty_members as $member) {
                            $memberPosition = strtolower(trim((string) ($member['position'] ?? '')));
                            if ($memberPosition !== strtolower($position)) {
                                continue;
                            }
                            if ($matcher !== null && !$matcher($member)) {
                                continue;
                            }
                            $matches[] = $member;
                        }
                        return $matches;
                    };

                    $containsText = function($value, array $needles) {
                        $value = strtolower(trim((string) $value));
                        foreach ($needles as $needle) {
                            if ($needle !== '' && strpos($value, strtolower($needle)) !== false) {
                                return true;
                            }
                        }
                        return false;
                    };

                    $president = $findFirst('university president') ?: $findFirst('president');
                    $vpAqa = $findFirst('vp for academics and quality assurance') ?: $findFirst('vice president', function($member) use ($containsText) {
                        return $containsText($member['vp_type'] ?? '', ['academics and quality assurance', 'aqa']);
                    });
                    $campusDirector = $findFirst('campus director');
                    $dean = $findFirst('dean');
                    $officeDirectorInstruction = $findFirst('office director, instruction');
                    $nstpHead = $findFirst('department head');
                    $departmentChair = $findFirst('department chairperson') ?: $findFirst('chairperson', function($member) use ($containsText) {
                        return $containsText($member['course'] ?? '', ['computing and information science', 'ccis']);
                    });
                    $chairBsit = $findFirst('program chairperson - bsit') ?: $findFirst('chairperson', function($member) use ($containsText, $departmentChair) {
                        if ($departmentChair !== null && (int) ($member['id'] ?? 0) === (int) ($departmentChair['id'] ?? 0)) {
                            return false;
                        }
                        return $containsText($member['course'] ?? '', ['information technology', 'bsit']);
                    });
                    $chairBscs = $findFirst('program chairperson - bscs') ?: $findFirst('chairperson', function($member) use ($containsText, $departmentChair) {
                        if ($departmentChair !== null && (int) ($member['id'] ?? 0) === (int) ($departmentChair['id'] ?? 0)) {
                            return false;
                        }
                        return $containsText($member['course'] ?? '', ['computer science', 'bscs']);
                    });

                    $facultyList = [];
                    foreach ($faculty_members as $member) {
                        $position = strtolower(trim((string) ($member['position'] ?? '')));
                        if (in_array($position, ['instructor', 'instuctor', 'professor', 'prof'], true)) {
                            $facultyList[] = $member;
                        }
                    }

                    $renderNode = function($member, $title, $subtitle = '', $className = '') use ($buildImagePath, $defaultFacultyImage, $fullNameOf) {
                        $isVacant = !is_array($member);
                        $name = $isVacant ? 'Vacant' : $fullNameOf($member);
                        $imageSrc = $isVacant ? $defaultFacultyImage : $buildImagePath($member);
                        ?>
                        <article class="org-fixed-node <?php echo trim($className . ($isVacant ? ' is-vacant' : '')); ?>">
                            <div class="org-fixed-avatar">
                                <img src="<?php echo htmlspecialchars($imageSrc, ENT_QUOTES, 'UTF-8'); ?>"
                                     alt="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>"
                                     onerror="this.onerror=null;this.src='<?php echo htmlspecialchars($defaultFacultyImage, ENT_QUOTES, 'UTF-8'); ?>';">
                            </div>
                            <div class="org-fixed-body">
                                <h4><?php echo htmlspecialchars($name); ?></h4>
                                <p class="org-fixed-role"><?php echo htmlspecialchars($title); ?></p>
                                <?php if (trim($subtitle) !== ''): ?>
                                    <p class="org-fixed-subrole"><?php echo htmlspecialchars($subtitle); ?></p>
                                <?php endif; ?>
                            </div>
                        </article>
                        <?php
                    };
                ?>

                <div class="org-fixed-chart">
                    <div class="org-fixed-top-tag">Board of Regents</div>

                    <div class="org-fixed-spine"></div>

                    <div class="org-fixed-stage org-fixed-stage-president">
                        <?php $renderNode($president, 'University President', '', 'org-fixed-node-lg'); ?>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-vp">
                        <?php $renderNode($vpAqa, 'VP for Academics and Quality Assurance', '', 'org-fixed-node-md'); ?>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-campus">
                        <?php $renderNode($campusDirector, 'Campus Director', '', 'org-fixed-node-md'); ?>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-main">
                        <div class="org-fixed-main-left">
                            <?php $renderNode($dean, 'Dean', 'College of Computing and Information Sciences', 'org-fixed-node-lg'); ?>
                        </div>

                        <div class="org-fixed-main-right">
                            <?php $renderNode($officeDirectorInstruction, 'Office Director, Instruction', '', 'org-fixed-node-sm'); ?>
                            <?php $renderNode($nstpHead, 'Department Head', 'National Service Training Program', 'org-fixed-node-sm'); ?>
                        </div>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-department">
                        <?php $renderNode($departmentChair, 'Department Chairperson', 'Computing and Information Science', 'org-fixed-node-md'); ?>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-chairs">
                        <div class="org-fixed-branch-line"></div>
                        <div class="org-fixed-chair-grid">
                            <?php $renderNode($chairBsit, 'Program Chairperson', 'Bachelor of Science in Information Technology', 'org-fixed-node-md'); ?>
                            <?php $renderNode($chairBscs, 'Program Chairperson', 'Bachelor of Science in Computer Science', 'org-fixed-node-md'); ?>
                        </div>
                    </div>

                    <div class="org-fixed-stage org-fixed-stage-faculty">
                        <div class="org-fixed-faculty-tag">Faculty</div>
                        <div class="org-fixed-faculty-grid">
                            <?php if (!empty($facultyList)): ?>
                                <?php foreach ($facultyList as $member): ?>
                                    <?php
                                        $subtitle = trim((string) ($member['advisory'] ?? ''));
                                        $renderNode($member, 'Instructor', $subtitle, 'org-fixed-node-xs');
                                    ?>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <?php $renderNode(null, 'Instructor', '', 'org-fixed-node-xs'); ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php else: ?>
                <p class="text-center col-12">No faculty members available at this time.</p>
            <?php endif; ?>
        </div>
    </div>
</section>
