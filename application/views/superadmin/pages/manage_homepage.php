<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-home me-2"></i>Manage Homepage</h1>
                <p class="card-subtitle">Edit and manage the homepage content and banners</p>
                <hr>
                
                <div class="card p-4">
                    <h4 class="mb-3"><i class="fas fa-edit me-2"></i>Homepage Content</h4>
                    <form id="homepage-form">
                        <div class="mb-3">
                            <label for="homepageTitle" class="form-label">Homepage Title</label>
                            <input type="text" class="form-control" id="homepageTitle" placeholder="Enter homepage title" required>
                        </div>
                        <div class="mb-3">
                            <label for="homepageContent" class="form-label">Homepage Content</label>
                            <textarea class="form-control" id="homepageContent" rows="6" placeholder="Enter homepage content" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="homepageBanner" class="form-label">Banner Image</label>
                            <input type="file" class="form-control" id="homepageBanner" accept="image/*">
                            <small class="form-text text-muted">Upload a banner image for the homepage (Max 5MB)</small>
                            <div id="banner-preview"></div>
                        </div>
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</div>