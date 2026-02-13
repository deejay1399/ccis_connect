<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$recent_activity = [];
foreach ($officers as $officer) {
    $recent_activity[] = [
        'icon' => 'fa-users',
        'message' => 'Added officer: ' . $officer['full_name'],
        'time' => isset($officer['created_at']) ? $officer['created_at'] : null,
    ];
}
foreach ($advisers as $adviser) {
    $recent_activity[] = [
        'icon' => 'fa-user-tie',
        'message' => 'Added adviser: ' . $adviser['full_name'],
        'time' => isset($adviser['created_at']) ? $adviser['created_at'] : null,
    ];
}
foreach ($announcements as $announcement) {
    $recent_activity[] = [
        'icon' => 'fa-bullhorn',
        'message' => 'Posted announcement: ' . $announcement['title'],
        'time' => isset($announcement['created_at']) ? $announcement['created_at'] : null,
    ];
}
foreach ($happenings as $happening) {
    $recent_activity[] = [
        'icon' => 'fa-images',
        'message' => 'Uploaded happening: ' . $happening['title'],
        'time' => isset($happening['created_at']) ? $happening['created_at'] : null,
    ];
}

usort($recent_activity, function ($a, $b) {
    return strtotime((string) $b['time']) <=> strtotime((string) $a['time']);
});
$recent_activity = array_slice($recent_activity, 0, 6);
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
                    <div class="admin-avatar-small">
                        <div class="admin-avatar-placeholder-small">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div class="admin-info-small">
                        <span class="admin-name-small"><?php echo html_escape($admin_name); ?></span>
                        <span class="admin-role-small"><?php echo html_escape($organization_name); ?> Admin</span>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h4><?php echo (int) $stats['officers']; ?></h4><p>Total Officers</p></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="stat-info"><h4><?php echo (int) $stats['advisers']; ?></h4><p>Advisers</p></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-bullhorn"></i></div>
                        <div class="stat-info"><h4><?php echo (int) $stats['announcements']; ?></h4><p>Announcements</p></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-images"></i></div>
                        <div class="stat-info"><h4><?php echo (int) $stats['happenings']; ?></h4><p>Happenings</p></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="quick-actions">
                        <h5>Quick Actions</h5>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <button type="button" class="action-btn" data-action="add-officer">
                                    <i class="fas fa-user-plus"></i>
                                    <span>Add Officer</span>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button type="button" class="action-btn" data-action="add-adviser">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Add Adviser</span>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button type="button" class="action-btn" data-action="post-announcement">
                                    <i class="fas fa-bullhorn"></i>
                                    <span>Post Announcement</span>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button type="button" class="action-btn" data-action="upload-happening">
                                    <i class="fas fa-camera"></i>
                                    <span>Upload Happening</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12">
                    <div class="activity-card">
                        <h5>Recent Activity</h5>
                        <div id="recentActivity" class="activity-list">
                            <?php if (empty($recent_activity)): ?>
                                <div class="activity-item">
                                    <div class="activity-icon"><i class="fas fa-info-circle"></i></div>
                                    <div class="activity-content">
                                        <p>No recent activity yet.</p>
                                        <small class="text-muted">Start by adding officers, advisers, announcements, or happenings.</small>
                                    </div>
                                </div>
                            <?php else: ?>
                                <?php foreach ($recent_activity as $activity): ?>
                                    <div class="activity-item">
                                        <div class="activity-icon"><i class="fas <?php echo html_escape($activity['icon']); ?>"></i></div>
                                        <div class="activity-content">
                                            <p><?php echo html_escape($activity['message']); ?></p>
                                            <small class="text-muted"><?php echo $activity['time'] ? html_escape(date('M d, Y h:i A', strtotime($activity['time']))) : 'Just now'; ?></small>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="officers" class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-users me-3"></i><?php echo html_escape($organization_name); ?> Officers</h3>
                    <p class="section-subtitle">Manage and view all organization officers.</p>
                </div>
                <button type="button" class="btn btn-primary" id="addOfficerBtn" data-bs-toggle="modal" data-bs-target="#addOfficerModal">
                    <i class="fas fa-user-plus me-2"></i>Add New Officer
                </button>
            </div>
            <div class="officers-grid">
                <?php if (empty($officers)): ?>
                    <div class="empty-state"><p>No officers yet.</p></div>
                <?php else: ?>
                    <?php foreach ($officers as $officer): ?>
                        <div class="officer-card">
                            <div class="officer-header">
                                <div class="officer-avatar">
                                    <?php if (!empty($officer['photo'])): ?>
                                        <img src="<?php echo base_url('uploads/org/officers/' . $officer['photo']); ?>" alt="<?php echo html_escape($officer['full_name']); ?>" loading="lazy" decoding="async">
                                    <?php else: ?>
                                        <i class="fas fa-user"></i>
                                    <?php endif; ?>
                                </div>
                                <div class="officer-info">
                                    <h5><?php echo html_escape($officer['full_name']); ?></h5>
                                    <div class="officer-details"><strong>Position:</strong> <?php echo html_escape($officer['position']); ?></div>
                                </div>
                            </div>
                            <div class="officer-actions">
                                <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewOfficerModal<?php echo (int) $officer['id']; ?>">
                                    <i class="fas fa-eye me-1"></i>View
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editOfficerModal<?php echo (int) $officer['id']; ?>">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <form method="post" action="<?php echo site_url('org/officers/delete/' . (int) $officer['id']); ?>" class="d-inline">
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="advisers" class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-user-tie me-3"></i><?php echo html_escape($organization_name); ?> Advisers</h3>
                    <p class="section-subtitle">Manage and view organization advisers.</p>
                </div>
                <button type="button" class="btn btn-primary" id="addAdviserBtn" data-bs-toggle="modal" data-bs-target="#addAdviserModal">
                    <i class="fas fa-user-plus me-2"></i>Add New Adviser
                </button>
            </div>
            <div class="advisers-grid">
                <?php if (empty($advisers)): ?>
                    <div class="empty-state"><p>No advisers yet.</p></div>
                <?php else: ?>
                    <?php foreach ($advisers as $adviser): ?>
                        <div class="adviser-card">
                            <div class="adviser-header">
                                <div class="adviser-avatar">
                                    <?php if (!empty($adviser['photo'])): ?>
                                        <img src="<?php echo base_url('uploads/org/advisers/' . $adviser['photo']); ?>" alt="<?php echo html_escape($adviser['full_name']); ?>" loading="lazy" decoding="async">
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
                            <div class="adviser-actions">
                                <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewAdviserModal<?php echo (int) $adviser['id']; ?>">
                                    <i class="fas fa-eye me-1"></i>View
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editAdviserModal<?php echo (int) $adviser['id']; ?>">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <form method="post" action="<?php echo site_url('org/advisers/delete/' . (int) $adviser['id']); ?>" class="d-inline">
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="announcements" class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-bullhorn me-3"></i><?php echo html_escape($organization_name); ?> Announcements</h3>
                    <p class="section-subtitle">Post and manage organization announcements.</p>
                </div>
                <button type="button" class="btn btn-primary" id="addAnnouncementBtn" data-bs-toggle="modal" data-bs-target="#addAnnouncementModal">
                    <i class="fas fa-plus me-2"></i>Post Announcement
                </button>
            </div>
            <div class="announcements-grid">
                <?php if (empty($announcements)): ?>
                    <div class="empty-state"><p>No announcements yet.</p></div>
                <?php else: ?>
                    <?php foreach ($announcements as $announcement): ?>
                        <div class="announcement-card">
                            <?php if (!empty($announcement['image'])): ?>
                                <img src="<?php echo base_url('uploads/org/announcements/' . $announcement['image']); ?>" alt="<?php echo html_escape($announcement['title']); ?>" loading="lazy" decoding="async" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
                            <?php endif; ?>
                            <div class="announcement-title-section"><h5><?php echo html_escape($announcement['title']); ?></h5></div>
                            <p><?php echo html_escape($announcement['content']); ?></p>
                            <?php if (!empty($announcement['event_date'])): ?><small><i class="fas fa-calendar me-1"></i><?php echo html_escape($announcement['event_date']); ?></small><?php endif; ?>
                            <div class="announcement-footer">
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewAnnouncementModal<?php echo (int) $announcement['id']; ?>">
                                        <i class="fas fa-eye me-1"></i>View
                                    </button>
                                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editAnnouncementModal<?php echo (int) $announcement['id']; ?>">
                                        <i class="fas fa-edit me-1"></i>Edit
                                    </button>
                                    <form method="post" action="<?php echo site_url('org/announcements/delete/' . (int) $announcement['id']); ?>" class="d-inline">
                                        <button type="submit" class="btn btn-danger btn-sm">
                                            <i class="fas fa-trash me-1"></i>Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <section id="happenings" class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-images me-3"></i><?php echo html_escape($organization_name); ?> Happenings</h3>
                    <p class="section-subtitle">Upload and manage event highlights.</p>
                </div>
                <button type="button" class="btn btn-primary" id="uploadHappeningBtn" data-bs-toggle="modal" data-bs-target="#addHappeningModal">
                    <i class="fas fa-camera me-2"></i>Upload Happening
                </button>
            </div>
            <div class="happenings-grid">
                <?php if (empty($happenings)): ?>
                    <div class="empty-state"><p>No happenings yet.</p></div>
                <?php else: ?>
                    <?php foreach ($happenings as $happening): ?>
                        <div class="happening-card">
                            <?php if (!empty($happening['image'])): ?>
                                <img src="<?php echo base_url('uploads/org/happenings/' . $happening['image']); ?>" alt="<?php echo html_escape($happening['title']); ?>" loading="lazy" decoding="async" style="width:100%;height:180px;object-fit:cover;border-radius:10px;">
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
                            <div class="happening-actions">
                                <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewHappeningModal<?php echo (int) $happening['id']; ?>">
                                    <i class="fas fa-eye me-1"></i>View
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editHappeningModal<?php echo (int) $happening['id']; ?>">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <form method="post" action="<?php echo site_url('org/happenings/delete/' . (int) $happening['id']); ?>" class="d-inline">
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>
    </div>
</main>

<div id="modalContainer"></div>

<?php foreach ($officers as $officer): ?>
<div class="modal fade" id="viewOfficerModal<?php echo (int) $officer['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Officer Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <?php if (!empty($officer['photo'])): ?>
                    <img src="<?php echo base_url('uploads/org/officers/' . $officer['photo']); ?>" alt="<?php echo html_escape($officer['full_name']); ?>" class="img-fluid rounded mb-3">
                <?php endif; ?>
                <p><strong>Name:</strong> <?php echo html_escape($officer['full_name']); ?></p>
                <p><strong>Position:</strong> <?php echo html_escape($officer['position']); ?></p>
                <p><strong>Added:</strong> <?php echo !empty($officer['created_at']) ? html_escape(date('M d, Y h:i A', strtotime($officer['created_at']))) : 'N/A'; ?></p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editOfficerModal<?php echo (int) $officer['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/officers/update/' . (int) $officer['id']); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Officer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Officer name</label>
                        <input type="text" class="form-control" name="full_name" value="<?php echo html_escape($officer['full_name']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="position" value="<?php echo html_escape($officer['position']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <?php if (!empty($officer['photo'])): ?>
                            <div class="mb-2">
                                <img src="<?php echo base_url('uploads/org/officers/' . $officer['photo']); ?>" alt="<?php echo html_escape($officer['full_name']); ?>" class="img-fluid rounded" style="max-height: 140px;">
                                <small class="d-block text-muted mt-1">Current photo: <?php echo html_escape($officer['photo']); ?></small>
                            </div>
                        <?php else: ?>
                            <small class="d-block text-muted mb-2">Current photo: none</small>
                        <?php endif; ?>
                        <label class="form-label">Replace photo (optional)</label>
                        <input type="file" class="form-control" name="officer_photo" accept="image/*">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php endforeach; ?>

<?php foreach ($advisers as $adviser): ?>
<div class="modal fade" id="viewAdviserModal<?php echo (int) $adviser['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adviser Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <?php if (!empty($adviser['photo'])): ?>
                    <img src="<?php echo base_url('uploads/org/advisers/' . $adviser['photo']); ?>" alt="<?php echo html_escape($adviser['full_name']); ?>" class="img-fluid rounded mb-3">
                <?php endif; ?>
                <p><strong>Name:</strong> <?php echo html_escape($adviser['full_name']); ?></p>
                <p><strong>Position:</strong> <?php echo html_escape($adviser['position']); ?></p>
                <p><strong>Email:</strong> <?php echo !empty($adviser['email']) ? html_escape($adviser['email']) : 'N/A'; ?></p>
                <p><strong>Added:</strong> <?php echo !empty($adviser['created_at']) ? html_escape(date('M d, Y h:i A', strtotime($adviser['created_at']))) : 'N/A'; ?></p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editAdviserModal<?php echo (int) $adviser['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/advisers/update/' . (int) $adviser['id']); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Adviser</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Adviser name</label>
                        <input type="text" class="form-control" name="full_name" value="<?php echo html_escape($adviser['full_name']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" value="<?php echo html_escape($adviser['email']); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="position" value="<?php echo html_escape($adviser['position']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <?php if (!empty($adviser['photo'])): ?>
                            <div class="mb-2">
                                <img src="<?php echo base_url('uploads/org/advisers/' . $adviser['photo']); ?>" alt="<?php echo html_escape($adviser['full_name']); ?>" class="img-fluid rounded" style="max-height: 140px;">
                                <small class="d-block text-muted mt-1">Current photo: <?php echo html_escape($adviser['photo']); ?></small>
                            </div>
                        <?php else: ?>
                            <small class="d-block text-muted mb-2">Current photo: none</small>
                        <?php endif; ?>
                        <label class="form-label">Replace photo (optional)</label>
                        <input type="file" class="form-control" name="adviser_photo" accept="image/*">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php endforeach; ?>

<?php foreach ($announcements as $announcement): ?>
<div class="modal fade" id="viewAnnouncementModal<?php echo (int) $announcement['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Announcement Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <?php if (!empty($announcement['image'])): ?>
                    <img src="<?php echo base_url('uploads/org/announcements/' . $announcement['image']); ?>" alt="<?php echo html_escape($announcement['title']); ?>" class="img-fluid rounded mb-3">
                <?php endif; ?>
                <p><strong>Title:</strong> <?php echo html_escape($announcement['title']); ?></p>
                <p><strong>Event date:</strong> <?php echo !empty($announcement['event_date']) ? html_escape($announcement['event_date']) : 'N/A'; ?></p>
                <p><strong>Content:</strong></p>
                <p><?php echo nl2br(html_escape($announcement['content'])); ?></p>
                <p><strong>Posted:</strong> <?php echo !empty($announcement['created_at']) ? html_escape(date('M d, Y h:i A', strtotime($announcement['created_at']))) : 'N/A'; ?></p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editAnnouncementModal<?php echo (int) $announcement['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/announcements/update/' . (int) $announcement['id']); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Announcement</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="<?php echo html_escape($announcement['title']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Event date</label>
                        <input type="date" class="form-control" name="event_date" value="<?php echo html_escape($announcement['event_date']); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Content</label>
                        <textarea class="form-control" name="content" rows="4" required><?php echo html_escape($announcement['content']); ?></textarea>
                    </div>
                    <div class="mb-3">
                        <?php if (!empty($announcement['image'])): ?>
                            <div class="mb-2">
                                <img src="<?php echo base_url('uploads/org/announcements/' . $announcement['image']); ?>" alt="<?php echo html_escape($announcement['title']); ?>" class="img-fluid rounded" style="max-height: 180px;">
                                <small class="d-block text-muted mt-1">Current image: <?php echo html_escape($announcement['image']); ?></small>
                            </div>
                        <?php else: ?>
                            <small class="d-block text-muted mb-2">Current image: none</small>
                        <?php endif; ?>
                        <label class="form-label">Replace image (optional)</label>
                        <input type="file" class="form-control" name="announcement_image" accept="image/*">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php endforeach; ?>

<?php foreach ($happenings as $happening): ?>
<div class="modal fade" id="viewHappeningModal<?php echo (int) $happening['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Happening Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <?php if (!empty($happening['image'])): ?>
                    <img src="<?php echo base_url('uploads/org/happenings/' . $happening['image']); ?>" alt="<?php echo html_escape($happening['title']); ?>" class="img-fluid rounded mb-3">
                <?php endif; ?>
                <p><strong>Title:</strong> <?php echo html_escape($happening['title']); ?></p>
                <p><strong>Event date:</strong> <?php echo !empty($happening['event_date']) ? html_escape($happening['event_date']) : 'N/A'; ?></p>
                <p><strong>Description:</strong></p>
                <p><?php echo nl2br(html_escape($happening['description'])); ?></p>
                <p><strong>Posted:</strong> <?php echo !empty($happening['created_at']) ? html_escape(date('M d, Y h:i A', strtotime($happening['created_at']))) : 'N/A'; ?></p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editHappeningModal<?php echo (int) $happening['id']; ?>" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/happenings/update/' . (int) $happening['id']); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Happening</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="<?php echo html_escape($happening['title']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Event date</label>
                        <input type="date" class="form-control" name="event_date" value="<?php echo html_escape($happening['event_date']); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" rows="4" required><?php echo html_escape($happening['description']); ?></textarea>
                    </div>
                    <div class="mb-3">
                        <?php if (!empty($happening['image'])): ?>
                            <div class="mb-2">
                                <img src="<?php echo base_url('uploads/org/happenings/' . $happening['image']); ?>" alt="<?php echo html_escape($happening['title']); ?>" class="img-fluid rounded" style="max-height: 180px;">
                                <small class="d-block text-muted mt-1">Current image: <?php echo html_escape($happening['image']); ?></small>
                            </div>
                        <?php else: ?>
                            <small class="d-block text-muted mb-2">Current image: none</small>
                        <?php endif; ?>
                        <label class="form-label">Replace image (optional)</label>
                        <input type="file" class="form-control" name="happening_image" accept="image/*">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php endforeach; ?>

<div class="modal fade" id="addOfficerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/officers/create'); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Officer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Officer name</label>
                        <input type="text" class="form-control" name="full_name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="position" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Photo</label>
                        <input type="file" class="form-control" name="officer_photo" accept="image/*" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Add Officer</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="addAdviserModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/advisers/create'); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Adviser</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Adviser name</label>
                        <input type="text" class="form-control" name="full_name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="position" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Photo</label>
                        <input type="file" class="form-control" name="adviser_photo" accept="image/*" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Add Adviser</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="addAnnouncementModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/announcements/create'); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Post Announcement</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Event date</label>
                        <input type="date" class="form-control" name="event_date">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Content</label>
                        <textarea class="form-control" name="content" rows="4" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image</label>
                        <input type="file" class="form-control" name="announcement_image" accept="image/*" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Post Announcement</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="addHappeningModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="post" action="<?php echo site_url('org/happenings/create'); ?>" enctype="multipart/form-data">
                <div class="modal-header">
                    <h5 class="modal-title">Upload Happening</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Event date</label>
                        <input type="date" class="form-control" name="event_date">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" rows="4" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image</label>
                        <input type="file" class="form-control" name="happening_image" accept="image/*" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" type="submit">Save Happening</button>
                </div>
            </form>
        </div>
    </div>
</div>
