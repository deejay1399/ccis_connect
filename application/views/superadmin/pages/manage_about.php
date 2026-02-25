<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div class="container py-4 py-md-5 dashboard-bg">
    <div class="row g-4">
        <main class="col-12">
            <div class="dashboard-card">
                <h1 class="card-title"><i class="fas fa-flag me-2"></i>Manage About Us</h1>
                <p class="card-subtitle">Edit and manage content for the About Us section</p>
                <hr>

                <ul class="nav nav-tabs" id="aboutTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="history" aria-selected="true">
                            <i class="fas fa-history me-2"></i>College History
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="vmgo-tab" data-bs-toggle="tab" data-bs-target="#vmgo" type="button" role="tab" aria-controls="vmgo" aria-selected="false">
                            <i class="fas fa-bullseye me-2"></i>VMGO
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="hymn-tab" data-bs-toggle="tab" data-bs-target="#hymn" type="button" role="tab" aria-controls="hymn" aria-selected="false">
                            <i class="fas fa-music me-2"></i>BISU Hymn
                        </button>
                    </li>
                </ul>
                
                <div class="tab-content" id="aboutTabsContent">
                    <!-- History Tab -->
                    <div class="tab-pane fade show active" id="history" role="tabpanel" aria-labelledby="history-tab">
                        <div class="section-card mt-4">
                            <h3 class="section-title"><i class="fas fa-history me-3"></i>History of CCIS</h3>
                            <form id="history-form">
                                <div class="history-content">
                                    <textarea class="form-control" id="history-content" rows="12" placeholder="Enter college history content"></textarea>
                                </div>
                                <div class="d-flex justify-content-end mt-3">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save me-2"></i>Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- VMGO Tab -->
                    <div class="tab-pane fade" id="vmgo" role="tabpanel" aria-labelledby="vmgo-tab">
                        <div class="section-card mt-4">
                            <h3 class="section-title"><i class="fas fa-bullseye me-3"></i>Vision, Mission, Goals, and Core Values</h3>
                            
                            <form id="vmgo-form">
                                <div class="vmgo-tabs">
                                    <div class="vmgo-tab-nav">
                                        <button type="button" class="vmgo-tab-btn active" data-tab="vision">
                                            <i class="fas fa-eye me-2"></i>Vision
                                        </button>
                                        <button type="button" class="vmgo-tab-btn" data-tab="mission">
                                            <i class="fas fa-rocket me-2"></i>Mission
                                        </button>
                                        <button type="button" class="vmgo-tab-btn" data-tab="goals">
                                            <i class="fas fa-flag me-2"></i>Goals
                                        </button>
                                        <button type="button" class="vmgo-tab-btn" data-tab="core-values">
                                            <i class="fas fa-heart me-2"></i>Core Values
                                        </button>
                                    </div>
                                    
                                    <div class="vmgo-tab-content">
                                        <div class="vmgo-tab-pane active" id="vision-tab">
                                            <div class="vmgo-horizontal-card">
                                                <div class="vmgo-icon-horizontal">
                                                    <i class="fas fa-eye"></i>
                                                </div>
                                                <div class="vmgo-content-horizontal">
                                                    <h4>Vision</h4>
                                                    <textarea class="form-control" id="vision-content" rows="3" placeholder="Enter college vision"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="vmgo-tab-pane" id="mission-tab">
                                            <div class="vmgo-horizontal-card">
                                                <div class="vmgo-icon-horizontal">
                                                    <i class="fas fa-rocket"></i>
                                                </div>
                                                <div class="vmgo-content-horizontal">
                                                    <h4>Mission</h4>
                                                    <textarea class="form-control" id="mission-content" rows="3" placeholder="Enter college mission"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="vmgo-tab-pane" id="goals-tab">
                                            <div class="vmgo-horizontal-card">
                                                <div class="vmgo-icon-horizontal">
                                                    <i class="fas fa-flag"></i>
                                                </div>
                                                <div class="vmgo-content-horizontal">
                                                    <h4>Goals</h4>
                                                    <div id="goals-container" class="mb-3">
                                                        <!-- Goals will be populated here -->
                                                    </div>
                                                    <button type="button" class="btn btn-sm btn-primary" id="add-goal">
                                                        <i class="fas fa-plus me-1"></i>Add Goal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="vmgo-tab-pane" id="core-values-tab">
                                            <div class="vmgo-horizontal-card">
                                                <div class="vmgo-icon-horizontal">
                                                    <i class="fas fa-heart"></i>
                                                </div>
                                                <div class="vmgo-content-horizontal">
                                                    <h4>Core Values</h4>
                                                    <div id="core-values-container" class="core-values-horizontal">
                                                        <!-- Core values will be populated here -->
                                                    </div>
                                                    <button type="button" class="btn btn-sm btn-primary mt-2" id="add-core-value">
                                                        <i class="fas fa-plus me-1"></i>Add Core Value
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-end mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save me-2"></i>Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Hymn Tab -->
                    <div class="tab-pane fade" id="hymn" role="tabpanel" aria-labelledby="hymn-tab">
                        <div class="section-card mt-4">
                            <h3 class="section-title"><i class="fas fa-music me-3"></i>BISU Hymn</h3>
                            
                            <form id="hymn-form">
                                <div class="hymn-content">
                                    <!-- Video Upload Section -->
                                    <div class="hymn-audio mb-4">
                                        <div class="audio-player">
                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title text-center mb-3">
                                                        <i class="fas fa-video text-primary me-2"></i>
                                                        BISU Hymn and Jingle Videos
                                                    </h5>
                                                    <div class="mb-3">
                                                        <label for="hymn-video" class="form-label">Upload Hymn Video (MP4)</label>
                                                        <input type="file" class="form-control" id="hymn-video" accept="video/mp4">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="jingle-video" class="form-label">Upload Jingle Video (MP4)</label>
                                                        <input type="file" class="form-control" id="jingle-video" accept="video/mp4">
                                                    </div>
                                                    <div id="current-videos">
                                                        <!-- Current videos will be displayed here -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Lyrics Section -->
                                    <div class="hymn-lyrics">
                                        <div class="verse mb-4">
                                            <p class="text-center fw-bold mb-3">[Verse 1]</p>
                                            <textarea class="form-control" id="verse1-content" rows="3" placeholder="Enter Verse 1 lyrics"></textarea>
                                        </div>
                                        
                                        <div class="chorus mb-4">
                                            <p class="text-center fw-bold mb-3">[Chorus]</p>
                                            <textarea class="form-control" id="chorus-content" rows="3" placeholder="Enter Chorus lyrics"></textarea>
                                        </div>
                                        
                                        <div class="verse">
                                            <p class="text-center fw-bold mb-3">[Finale]</p>
                                            <textarea class="form-control" id="finale-content" rows="3" placeholder="Enter Finale lyrics"></textarea>
                                        </div>
                                    </div>

                                    <hr class="my-4">
                                    <div class="hymn-lyrics">
                                        <h5 class="mb-3"><i class="fas fa-music me-2"></i>BISU Jingle Lyrics</h5>
                                        <div class="verse mb-4">
                                            <p class="text-center fw-bold mb-3">[Verse 1]</p>
                                            <textarea class="form-control" id="jingle-verse1-content" rows="3" placeholder="Enter Jingle Verse 1 lyrics"></textarea>
                                        </div>

                                        <div class="chorus mb-4">
                                            <p class="text-center fw-bold mb-3">[Chorus]</p>
                                            <textarea class="form-control" id="jingle-chorus-content" rows="3" placeholder="Enter Jingle Chorus lyrics"></textarea>
                                        </div>

                                        <div class="verse mb-4">
                                            <p class="text-center fw-bold mb-3">[Verse 2]</p>
                                            <textarea class="form-control" id="jingle-verse2-content" rows="3" placeholder="Enter Jingle Verse 2 lyrics"></textarea>
                                        </div>

                                        <div class="chorus mb-4">
                                            <p class="text-center fw-bold mb-3">[Repeat Chorus]</p>
                                            <textarea class="form-control" id="jingle-repeat-chorus-content" rows="3" placeholder="Enter repeated chorus lyrics"></textarea>
                                        </div>

                                        <div class="verse mb-4">
                                            <p class="text-center fw-bold mb-3">[Bridge]</p>
                                            <textarea class="form-control" id="jingle-bridge-content" rows="3" placeholder="Enter jingle bridge lyrics"></textarea>
                                        </div>

                                        <div class="chorus">
                                            <p class="text-center fw-bold mb-3">[Final Chorus]</p>
                                            <textarea class="form-control" id="jingle-final-chorus-content" rows="3" placeholder="Enter final chorus lyrics"></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-end mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save me-2"></i>Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
