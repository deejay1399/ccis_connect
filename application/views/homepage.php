    <section class="highlights-section">
        <div class="container">
            <div class="highlights-carousel">
                <?php 
                if (!empty($homepage_records)): 
                    foreach ($homepage_records as $index => $record):
                ?>
                <div class="highlight-slide <?php echo $index === 0 ? 'active' : ''; ?>" id="slide-<?php echo $index; ?>">
                    <div class="highlight-image">
                        <?php if (!empty($record['banner_image'])): ?>
                            <img src="<?php echo base_url($record['banner_image']); ?>" alt="<?php echo htmlspecialchars($record['title']); ?>">
                        <?php else: ?>
                            <div style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 400px; color: #999;">
                                <p>No image available</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php 
                    endforeach; 
                else: 
                ?>
                <div class="highlight-slide active" id="slide-0">
                    <div class="highlight-image">
                        <div style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 400px; color: #999;">
                            <p>No carousel items uploaded yet</p>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
            </div>
            
            <div class="highlight-dots" role="tablist" aria-label="Carousel navigation dots">
                <?php 
                if (!empty($homepage_records)):
                    foreach ($homepage_records as $index => $record):
                ?>
                <button class="dot <?php echo $index === 0 ? 'active' : ''; ?>" role="tab" aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>" aria-controls="slide-<?php echo $index; ?>" data-slide="<?php echo $index; ?>" aria-label="Show slide <?php echo $index + 1; ?> of <?php echo count($homepage_records); ?>">
                    <span class="visually-hidden">Slide <?php echo $index + 1; ?></span>
                </button>
                <?php 
                    endforeach; 
                else:
                ?>
                <button class="dot active" role="tab" aria-selected="true" aria-controls="slide-0" data-slide="0" aria-label="Show slide 1 of 1">
                    <span class="visually-hidden">Slide 1</span>
                </button>
                <?php endif; ?>
            </div>
            
            <button class="highlight-prev" aria-label="Previous image">
                <i class="fas fa-chevron-left"></i>
                <span class="visually-hidden">Previous image</span>
            </button>
            <button class="highlight-next" aria-label="Next image">
                <i class="fas fa-chevron-right"></i>
                <span class="visually-hidden">Next image</span>
            </button>
        </div>
    </section>

    <section class="welcome-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h3 class="welcome-title"><?php echo !empty($homepage_records) && !empty($homepage_records[0]['title']) ? htmlspecialchars($homepage_records[0]['title']) : 'Welcome to CCIS'; ?></h3>
                    <p class="welcome-text">
                        <?php 
                        if (!empty($homepage_records) && !empty($homepage_records[0]['content'])) {
                            echo nl2br(htmlspecialchars($homepage_records[0]['content']));
                        } else {
                            echo 'The College of Computing and Information Sciences (CCIS) is committed to providing 
                        quality education in the fields of Computer Science and Information Technology. 
                        We foster innovation, research, and technological advancement to prepare students 
                        for successful careers in the digital age.';
                        }
                        ?>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section class="programs-section">
        <div class="container">
            <h3 class="programs-title">Academic Programs</h3>
            
            <div class="programs-container" id="programs-container">
                <div class="program-card">
                    <div class="program-header">
                        <i class="fas fa-laptop-code"></i>
                        <h5>Bachelor of Science in Computer Science</h5>
                    </div>
                    <p>A comprehensive program focusing on software development, algorithms, and computer systems.</p>
                    <ul class="career-list">
                        <li> Software Engineering</li>
                        <li> Data Structures and Algorithms</li>
                        <li> Artificial Intelligence</li>
                        <li> Web and Mobile Development</li>
                        <li> Computer Networks</li>
                        <li> Database Systems</li>
                    </ul>
                </div>
                
                <div class="program-card">
                    <div class="program-header">
                        <i class="fas fa-network-wired"></i>
                        <h5>Bachelor of Science in Information Technology</h5>
                    </div>
                    <p>Focuses on IT infrastructure, networking, and information systems management.</p>
                    <ul class="career-list">
                        <li> Network Administration</li>
                        <li> Web Development</li>
                        <li> Cybersecurity</li>
                        <li> System Administration</li>
                    </ul>
                </div>
                
                <div class="program-card">
                    <div class="program-header">
                        <i class="fas fa-database"></i>
                        <h5>Bachelor of Science in Information Systems</h5>
                    </div>
                    <p>Bridges business needs with technology solutions through information systems.</p>
                    <ul class="career-list">
                        <li> Business Analytics</li>
                        <li> Enterprise Systems</li>
                        <li> Project Management</li>
                        <li> Data Analytics</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>