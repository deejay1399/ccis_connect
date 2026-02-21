<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="notification success" id="notification">
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-3" style="font-size: 1.5rem; color: #28a745;"></i>
            <div>
                <strong>Success!</strong>
                <p class="mb-0" id="notification-text">Changes saved successfully.</p>
            </div>
        </div>
    </div>

    <!-- UPDATED: Confirmation Modal with red triangle icon and light gray remove button -->
    <div class="modal fade confirmation-modal" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">
                        Confirm Action
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="confirmation-text" id="confirmationModalBody">
                        Are you sure you want to perform this action?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" id="confirmActionBtn">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="container py-4 py-md-5 dashboard-bg">
        <!-- Highlights Carousel Section -->
        <div class="section-card fade-in-up">
            <h3 class="section-title">
                <i class="fas fa-images"></i>
                Highlights Carousel
            </h3>
            <p class="section-subtitle">Manage the images displayed in the homepage carousel slider</p>
            
            <div class="image-upload-zone" onclick="document.getElementById('carousel-upload').click()">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <h5 class="upload-zone-title">Drop Images Here or Click to Browse</h5>
                <p class="upload-zone-subtext">Create a polished homepage carousel in seconds.</p>
                <div class="upload-zone-meta">
                    <span class="upload-pill"><i class="fas fa-file-image me-1"></i>JPG, PNG, WEBP</span>
                    <span class="upload-pill"><i class="fas fa-weight-hanging me-1"></i>Up to 20MB each</span>
                </div>
                <input type="file" id="carousel-upload" accept="image/*" multiple style="display: none;">
            </div>

            <div class="mt-4">
                <div class="preview-heading">
                    <h5><i class="fas fa-eye me-2"></i>Selected Images</h5>
                    <span class="preview-count-badge"><span id="pending-image-count">0</span> preview</span>
                </div>
                <div class="images-grid" id="pending-images-grid">
                    <!-- Selected images (not yet saved) -->
                </div>
            </div>

            <div class="mt-4">
                <div class="preview-heading">
                    <h5><i class="fas fa-database me-2"></i>Current Highlights</h5>
                    <span class="preview-count-badge"><span id="image-count">0</span> saved</span>
                </div>
                <div class="images-grid" id="carousel-images-grid">
                    <!-- Database images will be loaded here dynamically -->
                </div>
            </div>

            <div class="mt-4 text-end">
                <button type="button" class="btn btn-primary" onclick="saveCarouselChanges()" id="save-carousel-btn">
                    <i class="fas fa-save me-2"></i>Save Changes
                </button>
            </div>
        </div>

        <!-- Welcome Message Section -->
        <div class="section-card fade-in-up">
            <h3 class="section-title">
                <i class="fas fa-comment-dots"></i>
                Welcome Message
            </h3>
            <p class="section-subtitle">Edit the welcome section that appears below the carousel</p>
            
            <form id="welcome-form">
                <div class="form-group">
                    <label for="welcome-title" class="form-label">
                        <i class="fas fa-heading"></i>Welcome Title
                    </label>
                    <input type="text" class="form-control" id="welcome-title" placeholder="Welcome to CCIS" value="Welcome to CCIS">
                </div>
                <div class="form-group">
                    <label for="welcome-text" class="form-label">
                        <i class="fas fa-align-left"></i>Welcome Message
                    </label>
                    <textarea class="form-control" id="welcome-text" rows="5" placeholder="Enter welcome message...">The College of Computing and Information Sciences (CCIS) is committed to providing quality education in the fields of Computer Science and Information Technology. We foster innovation, research, and technological advancement to prepare students for successful careers in the digital age.</textarea>
                </div>
                <div class="btn-group-horizontal">
                    <button type="button" class="btn btn-primary" onclick="saveWelcomeMessage()" id="save-welcome-btn">
                        <i class="fas fa-save me-2"></i>Save Changes
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="showClearWelcomeMessageConfirmation()">
                        <i class="fas fa-trash me-2"></i>Clear All
                    </button>
                </div>
            </form>
        </div>

    </div>
