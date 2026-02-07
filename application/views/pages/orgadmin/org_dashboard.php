<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<main class="admin-main">
    <div class="container">
        <?php if ($this->session->flashdata('success')): ?>
            <div class="alert alert-success"><?php echo html_escape($this->session->flashdata('success')); ?></div>
        <?php endif; ?>
        <?php if ($this->session->flashdata('error')): ?>
            <div class="alert alert-danger"><?php echo html_escape($this->session->flashdata('error')); ?></div>
        <?php endif; ?>

        <section id="dashboard" class="admin-section active-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-tachometer-alt me-3"></i><?php echo html_escape($organization_name); ?> Dashboard</h3>
                    <p class="section-subtitle">Manage organization officers, advisers, announcements, and happenings.</p>
                </div>
                <div class="admin-profile-small">
                    <div class="admin-info-small">
                        <span class="admin-name-small"><?php echo html_escape($admin_name); ?></span>
                        <span class="admin-role-small"><?php echo html_escape($organization_name); ?> Admin</span>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-info"><h4><?php echo (int) $stats['officers']; ?></h4><p>Total Officers</p></div></div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-user-tie"></i></div><div class="stat-info"><h4><?php echo (int) $stats['advisers']; ?></h4><p>Advisers</p></div></div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-bullhorn"></i></div><div class="stat-info"><h4><?php echo (int) $stats['announcements']; ?></h4><p>Announcements</p></div></div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card"><div class="stat-icon"><i class="fas fa-images"></i></div><div class="stat-info"><h4><?php echo (int) $stats['happenings']; ?></h4><p>Happenings</p></div></div>
                </div>
            </div>
        </section>

        <section id="officers" class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-users me-3"></i><?php echo html_escape($organization_name); ?> Officers</h3>
                </div>
            </div>
            <form class="row g-3 mb-4" method="post" action="<?php echo site_url('org/officers/create'); ?>" enctype="multipart/form-data">
                <div class="col-md-4"><input type="text" class="form-control" name="full_name" placeholder="Officer name" required></div>
                <div class="col-md-3"><input type="text" class="form-control" name="position" placeholder="Position" required></div>
                <div class="col-md-3"><input type="file" class="form-control" name="officer_photo" accept="image/*"></div>
                <div class="col-md-2"><button class="btn btn-primary w-100" type="submit">Add Officer</button></div>
            </form>
            <div class="officers-grid">
                <?php if (empty($officers)): ?>
                    <div class="empty-state"><p>No officers yet.</p></div>
                <?php else: ?>
                    <?php foreach ($officers as $officer): ?>
                        <div class="officer-card">
                            <div class="officer-header">
                                <div class="officer-avatar">
                                    <?php if (!empty($officer['photo'])): ?>
                                        <img src="<?php echo base_url('uploads/org/officers/' . $officer['photo']); ?>" alt="<?php echo html_escape($officer['full_name']); ?>">
                                    <?php else: ?>
                                        <i class="fas fa-user"></i>
                                    <?php endif; ?>
                                </div>
                                <div class="officer-info">
                                    <h5><?php echo html_escape($officer['full_name']); ?></h5>
                                    <div class="officer-details"><strong>Position:</strong> <?php echo html_escape($officer['position']); ?></div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="advisers" class="admin-section">
            <div class="section-header">
                <div><h3><i class="fas fa-user-tie me-3"></i><?php echo html_escape($organization_name); ?> Advisers</h3></div>
            </div>
            <form class="row g-3 mb-4" method="post" action="<?php echo site_url('org/advisers/create'); ?>" enctype="multipart/form-data">
                <div class="col-md-3"><input type="text" class="form-control" name="full_name" placeholder="Adviser name" required></div>
                <div class="col-md-3"><input type="email" class="form-control" name="email" placeholder="Email"></div>
                <div class="col-md-3"><input type="text" class="form-control" name="position" placeholder="Position" required></div>
                <div class="col-md-2"><input type="file" class="form-control" name="adviser_photo" accept="image/*"></div>
                <div class="col-md-1"><button class="btn btn-primary w-100" type="submit">Add</button></div>
            </form>
            <div class="advisers-grid">
                <?php if (empty($advisers)): ?>
                    <div class="empty-state"><p>No advisers yet.</p></div>
                <?php else: ?>
                    <?php foreach ($advisers as $adviser): ?>
                        <div class="adviser-card">
                            <div class="adviser-header">
                                <div class="adviser-avatar">
                                    <?php if (!empty($adviser['photo'])): ?>
                                        <img src="<?php echo base_url('uploads/org/advisers/' . $adviser['photo']); ?>" alt="<?php echo html_escape($adviser['full_name']); ?>">
                                    <?php else: ?>
                                        <i class="fas fa-user-tie"></i>
                                    <?php endif; ?>
                                </div>
                                <div class="adviser-info">
                                    <h5><?php echo html_escape($adviser['full_name']); ?></h5>
                                    <div class="adviser-details"><strong>Position:</strong> <?php echo html_escape($adviser['position']); ?></div>
                                    <?php if (!empty($adviser['email'])): ?><div class="adviser-details"><strong>Email:</strong> <?php echo html_escape($adviser['email']); ?></div><?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="announcements" class="admin-section">
            <div class="section-header">
                <div><h3><i class="fas fa-bullhorn me-3"></i><?php echo html_escape($organization_name); ?> Announcements</h3></div>
            </div>
            <form class="row g-3 mb-4" method="post" action="<?php echo site_url('org/announcements/create'); ?>" enctype="multipart/form-data">
                <div class="col-md-3"><input type="text" class="form-control" name="title" placeholder="Title" required></div>
                <div class="col-md-2"><input type="date" class="form-control" name="event_date"></div>
                <div class="col-md-4"><input type="text" class="form-control" name="content" placeholder="Announcement content" required></div>
                <div class="col-md-3"><input type="file" class="form-control" name="announcement_image" accept="image/*"></div>
                <div class="col-12"><button class="btn btn-primary" type="submit">Post Announcement</button></div>
            </form>
            <div class="announcements-grid">
                <?php if (empty($announcements)): ?>
                    <div class="empty-state"><p>No announcements yet.</p></div>
                <?php else: ?>
                    <?php foreach ($announcements as $announcement): ?>
                        <div class="announcement-card">
                            <?php if (!empty($announcement['image'])): ?>
                                <img src="<?php echo base_url('uploads/org/announcements/' . $announcement['image']); ?>" alt="<?php echo html_escape($announcement['title']); ?>" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
                            <?php endif; ?>
                            <div class="announcement-title-section"><h5><?php echo html_escape($announcement['title']); ?></h5></div>
                            <p><?php echo html_escape($announcement['content']); ?></p>
                            <?php if (!empty($announcement['event_date'])): ?><small><i class="fas fa-calendar me-1"></i><?php echo html_escape($announcement['event_date']); ?></small><?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="happenings" class="admin-section">
            <div class="section-header">
                <div><h3><i class="fas fa-images me-3"></i><?php echo html_escape($organization_name); ?> Happenings</h3></div>
            </div>
            <form class="row g-3 mb-4" method="post" action="<?php echo site_url('org/happenings/create'); ?>" enctype="multipart/form-data">
                <div class="col-md-3"><input type="text" class="form-control" name="title" placeholder="Title" required></div>
                <div class="col-md-3"><input type="date" class="form-control" name="event_date"></div>
                <div class="col-md-4"><input type="text" class="form-control" name="description" placeholder="Description" required></div>
                <div class="col-md-2"><input type="file" class="form-control" name="happening_image" accept="image/*"></div>
                <div class="col-12"><button class="btn btn-primary" type="submit">Save Happening</button></div>
            </form>
            <div class="happenings-grid">
                <?php if (empty($happenings)): ?>
                    <div class="empty-state"><p>No happenings yet.</p></div>
                <?php else: ?>
                    <?php foreach ($happenings as $happening): ?>
                        <div class="happening-card">
                            <?php if (!empty($happening['image'])): ?>
                                <img src="<?php echo base_url('uploads/org/happenings/' . $happening['image']); ?>" alt="<?php echo html_escape($happening['title']); ?>" style="width:100%;height:180px;object-fit:cover;border-radius:10px;">
                            <?php else: ?>
                                <div class="happening-image-placeholder" style="height:180px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#f3f4f6;">
                                    <i class="fas fa-images"></i>
                                </div>
                            <?php endif; ?>
                            <div class="happening-content">
                                <h6><?php echo html_escape($happening['title']); ?></h6>
                                <p class="happening-description"><?php echo html_escape($happening['description']); ?></p>
                                <?php if (!empty($happening['event_date'])): ?><small class="happening-date"><i class="fas fa-calendar me-1"></i><?php echo html_escape($happening['event_date']); ?></small><?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>
    </div>
</main>

