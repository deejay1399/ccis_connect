<!-- Organization Page Content -->
<section class="organization-section">
    <div class="container">
        <?php
            $org_panels = isset($organizations) && is_array($organizations) ? $organizations : [];
        ?>
        <?php $panel_index = 0; ?>
        <?php foreach ($org_panels as $panel): ?>
            <?php
                $advisers = isset($panel['advisers']) && is_array($panel['advisers']) ? $panel['advisers'] : [];
                $officers = isset($panel['officers']) && is_array($panel['officers']) ? $panel['officers'] : [];
                $announcements = isset($panel['announcements']) && is_array($panel['announcements']) ? $panel['announcements'] : [];
                $happenings = isset($panel['happenings']) && is_array($panel['happenings']) ? $panel['happenings'] : [];
                $is_member = !empty($panel['is_member']);
                $ann_count = count($announcements);
                $hap_count = count($happenings);
                $section_class = $panel_index === 0 ? 'content-section active-section' : 'content-section';
            ?>
            <section id="<?php echo html_escape($panel['section_id']); ?>" class="<?php echo $section_class; ?>">
                <div class="content-card mb-4">
                    <div class="organization-header">
                        <div class="org-logo-container">
                            <img src="<?php echo html_escape($panel['logo']); ?>" alt="<?php echo html_escape($panel['organization_name']); ?> Logo" class="org-logo">
                        </div>
                        <div class="org-title-container">
                            <h3><i class="fas <?php echo html_escape($panel['icon_class']); ?> me-3"></i><?php echo html_escape($panel['title']); ?></h3>
                        </div>
                    </div>

                    <div class="organization-content">
                        <div class="org-description">
                            <h4><?php echo html_escape($panel['about_heading']); ?></h4>
                            <p><?php echo html_escape($panel['about_text']); ?></p>
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
                            <div class="officers-grid">
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

                        <?php if ($is_member): ?>
                            <div class="org-announcements mt-5">
                                <h4><i class="fas fa-bullhorn me-2"></i><?php echo html_escape($panel['organization_name']); ?> Announcements</h4>
                                <div class="content-controls">
                                    <div class="items-count"><?php echo $ann_count; ?> announcement<?php echo $ann_count !== 1 ? 's' : ''; ?></div>
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
                                <h4><i class="fas fa-camera me-2"></i><?php echo html_escape($panel['organization_name']); ?> Happenings</h4>
                                <div class="content-controls">
                                    <div class="items-count"><?php echo $hap_count; ?> happening<?php echo $hap_count !== 1 ? 's' : ''; ?></div>
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
                        <?php endif; ?>
                    </div>
                </div>
            </section>
            <?php $panel_index++; ?>
        <?php endforeach; ?>
    </div>
</section>
