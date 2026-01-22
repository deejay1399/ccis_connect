<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-sitemap me-2"></i>Organization Management</h1>
                <p class="card-subtitle">Monitor organization activities and manage organization settings</p>
                <hr>
                
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="stats-card legion-stats">
                            <h3 id="totalLegionPosts">0</h3>
                            <p>The Legion Posts</p>
                            <i class="fas fa-users stats-icon"></i>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card csguild-stats">
                            <h3 id="totalCSGuildPosts">0</h3>
                            <p>CS Guild Posts</p>
                            <i class="fas fa-code stats-icon"></i>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card total-orgs-stats">
                            <h3 id="totalOrganizations">0</h3>
                            <p>Total Organizations</p>
                            <i class="fas fa-sitemap stats-icon"></i>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card total-posts-stats">
                            <h3 id="totalPosts">0</h3>
                            <p>Total Posts</p>
                            <i class="fas fa-file-alt stats-icon"></i>
                        </div>
                    </div>
                </div>

                <div class="row" id="organizationsContainer">
                    <!-- Organizations will be loaded here -->
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <div class="dashboard-card">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="recent-activity-title">
                                    <h4 style="color: var(--primary-purple) !important;"><i class="fas fa-history me-2" style="color: var(--primary-purple) !important;"></i>Recent Activity Log</h4>
                                    <p class="card-subtitle">Organization activities in chronological order</p>
                                </div>
                                <button class="btn btn-outline-primary btn-sm" id="refreshActivities">
                                    <i class="fas fa-sync-alt me-1"></i>Refresh
                                </button>
                            </div>
                            
                            <div class="activity-filters mb-3">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-primary active" data-filter="all">All Organizations</button>
                                    <button type="button" class="btn btn-outline-primary" data-filter="legion">The Legion</button>
                                    <button type="button" class="btn btn-outline-primary" data-filter="csguild">CS Guild</button>
                                </div>
                            </div>
                            
                            <div id="recentActivityLog" class="activity-log">
                                <!-- Activities will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Remove Confirmation Modal -->
<div class="modal fade" id="removeOrganizationModal" tabindex="-1" aria-labelledby="removeOrganizationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="removeOrganizationModalLabel">Confirm Removal</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <p id="removeConfirmationText">Are you sure you want to remove this organization? This action cannot be undone.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmRemoveBtn">Remove</button>
            </div>
        </div>
    </div>
</div>

<div id="modalContainer"></div>
