<!-- Organization Page Content -->
<section class="organization-section">
    <div class="container">
        <?php
            $section_id = ($organization_slug === 'csguild') ? 'cs-guild' : 'the-legion';
            $is_legion = ($organization_slug === 'the_legion');
            $is_csguild = ($organization_slug === 'csguild');
            $title_text = $is_legion
                ? 'The Legion - BSIT Student Organization'
                : ($is_csguild ? 'CS Guild - BSCS Student Organization' : $organization_name);
            $icon_class = $is_legion ? 'fa-users' : 'fa-code';
            $ann_count = is_array($announcements) ? count($announcements) : 0;
            $hap_count = is_array($happenings) ? count($happenings) : 0;
        ?>

        <section id="<?php echo $section_id; ?>" class="content-section active-section">
            <div class="content-card">
                <div class="organization-header">
                    <div class="org-logo-container">
                        <?php if ($is_legion): ?>
                            <img src="<?php echo base_url('assets/images/legion.jpg'); ?>" alt="The Legion Logo" class="org-logo" onerror="this.src='https://via.placeholder.com/200x200/5b21b6/ffffff?text=THE+LEGION'">
                        <?php elseif ($is_csguild): ?>
                            <img src="<?php echo base_url('assets/images/cs.jpg'); ?>" alt="CS Guild Logo" class="org-logo" onerror="this.src='https://via.placeholder.com/200x200/0369a1/ffffff?text=CS+GUILD'">
                        <?php else: ?>
                            <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="Organization Logo" class="org-logo">
                        <?php endif; ?>
                    </div>
                    <div class="org-title-container">
                        <h3><i class="fas <?php echo $icon_class; ?> me-3"></i><?php echo html_escape($title_text); ?></h3>
                    </div>
                </div>

                <div class="organization-content">
                    <div class="org-description">
                        <?php if ($is_legion): ?>
                            <h4>About The Legion</h4>
                            <p>The Legion is the leading organization for IT enthusiasts on campus. Dedicated to supporting both academic and extracurricular activities, they are responsible for providing technical assistance during events. From managing sounds, lights, and equipment at acquaintance parties, programs, and gatherings, to organizing exciting mobile game tournaments during school activities. The Legion ensures that every event runs smoothly and is more enjoyable for students. They also handle creative setups like the movie booth, making them a vital part of bringing innovation, fun, and technical expertise to campus life.</p>
                        <?php elseif ($is_csguild): ?>
                            <h4>About CS Guild</h4>
                            <p>The CS Guild is the newest organization for computer science students. It is a student-led group that focuses on learning, collaboration, and knowledge-sharing in programming. The organization provides peer tutoring, coding assistance, and activities designed to support students in their computer science subjects. By fostering a culture of teamwork and continuous learning, the CS Guild helps members strengthen their skills and gain confidence in both academic and real-world programming challenges.</p>
                        <?php else: ?>
                            <h4>About Organization</h4>
                            <p>This page shows your assigned organization updates.</p>
                        <?php endif; ?>
                    </div>

                    <div class="org-adviser">
                        <h4>Organization Adviser<?php echo (count($advisers) > 1) ? 's' : ''; ?></h4>
                        <?php if (empty($advisers)): ?>
                            <p class="text-muted">No adviser information available.</p>
                        <?php else: ?>
                            <div class="d-grid gap-3">
                                <?php foreach ($advisers as $adviser): ?>
                                    <div class="adviser-card">
                                        <div class="adviser-image">
                                            <?php if (!empty($adviser['photo'])): ?>
                                                <img src="<?php echo base_url('uploads/org/advisers/' . $adviser['photo']); ?>" alt="<?php echo html_escape($adviser['full_name']); ?>">
                                            <?php else: ?>
                                                <img src="https://via.placeholder.com/150x150/5b21b6/ffffff?text=ADVISER" alt="Adviser">
                                            <?php endif; ?>
                                        </div>
                                        <div class="adviser-info">
                                            <h5><?php echo html_escape($adviser['full_name']); ?></h5>
                                            <p class="adviser-position"><?php echo html_escape($adviser['position']); ?></p>
                                            <?php if (!empty($adviser['email'])): ?>
                                                <p class="adviser-contact"><i class="fas fa-envelope me-2"></i><?php echo html_escape($adviser['email']); ?></p>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="org-officers mt-5">
                        <h4>Officers AY <?php echo date('Y'); ?>-<?php echo date('Y') + 1; ?></h4>
                        <div class="officers-grid" id="<?php echo $is_csguild ? 'csguild-officers-grid' : 'legion-officers-grid'; ?>">
                            <?php if (empty($officers)): ?>
                                <p class="text-muted">No officers available.</p>
                            <?php else: ?>
                                <?php foreach ($officers as $officer): ?>
                                    <div class="officer-card">
                                        <div class="officer-image">
                                            <?php if (!empty($officer['photo'])): ?>
                                                <img src="<?php echo base_url('uploads/org/officers/' . $officer['photo']); ?>" alt="<?php echo html_escape($officer['full_name']); ?>">
                                            <?php else: ?>
                                                <img src="https://via.placeholder.com/200x200/5b21b6/ffffff?text=OFFICER" alt="Officer">
                                            <?php endif; ?>
                                        </div>
                                        <div class="officer-info">
                                            <h5><?php echo html_escape($officer['full_name']); ?></h5>
                                            <p class="officer-position"><?php echo html_escape($officer['position']); ?></p>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="org-announcements mt-5">
                        <h4><i class="fas fa-bullhorn me-2"></i><?php echo html_escape($organization_name); ?> Announcements</h4>
                        <div class="content-controls">
                            <div class="items-count"><?php echo $ann_count; ?> announcement<?php echo $ann_count !== 1 ? 's' : ''; ?></div>
                            <div class="view-options">
                                <button class="view-btn active" type="button"><i class="fas fa-sort-amount-down me-1"></i>Latest</button>
                                <button class="view-btn" type="button"><i class="fas fa-sort-amount-up me-1"></i>Oldest</button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <?php if (empty($announcements)): ?>
                                <p class="text-muted">No announcements yet.</p>
                            <?php else: ?>
                                <?php foreach ($announcements as $announcement): ?>
                                    <div class="legion-announcement-card mb-3">
                                        <?php if (!empty($announcement['image'])): ?>
                                            <img src="<?php echo base_url('uploads/org/announcements/' . $announcement['image']); ?>" alt="<?php echo html_escape($announcement['title']); ?>" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
                                        <?php endif; ?>
                                        <h5><?php echo html_escape($announcement['title']); ?></h5>
                                        <p><?php echo html_escape($announcement['content']); ?></p>
                                        <?php if (!empty($announcement['event_date'])): ?>
                                            <small><i class="fas fa-calendar me-1"></i><?php echo html_escape($announcement['event_date']); ?></small>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="org-happenings mt-5">
                        <h4><i class="fas fa-camera me-2"></i><?php echo html_escape($organization_name); ?> Happenings</h4>
                        <div class="content-controls">
                            <div class="items-count"><?php echo $hap_count; ?> happening<?php echo $hap_count !== 1 ? 's' : ''; ?></div>
                            <div class="view-options">
                                <button class="view-btn active" type="button"><i class="fas fa-sort-amount-down me-1"></i>Latest</button>
                                <button class="view-btn" type="button"><i class="fas fa-sort-amount-up me-1"></i>Oldest</button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <?php if (empty($happenings)): ?>
                                <p class="text-muted">No happenings yet.</p>
                            <?php else: ?>
                                <?php foreach ($happenings as $happening): ?>
                                    <div class="legion-happening-card mb-3">
                                        <?php if (!empty($happening['image'])): ?>
                                            <img src="<?php echo base_url('uploads/org/happenings/' . $happening['image']); ?>" alt="<?php echo html_escape($happening['title']); ?>" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
                                        <?php endif; ?>
                                        <h5><?php echo html_escape($happening['title']); ?></h5>
                                        <p><?php echo html_escape($happening['description']); ?></p>
                                        <?php if (!empty($happening['event_date'])): ?>
                                            <small><i class="fas fa-calendar me-1"></i><?php echo html_escape($happening['event_date']); ?></small>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</section>
