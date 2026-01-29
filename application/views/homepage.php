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
            
            <div class="programs-grid" id="programs-grid">
                <?php if (!empty($programs)): ?>
                    <?php 
                        // Map program names to appropriate icons
                        $iconMap = array(
                            'BSCS' => 'fas fa-laptop-code',
                            'BSIT' => 'fas fa-network-wired',
                            'Computer Science' => 'fas fa-laptop-code',
                            'Information Technology' => 'fas fa-network-wired'
                        );
                        
                        foreach ($programs as $program): 
                            // Determine icon
                            $icon = 'fas fa-graduation-cap';
                            foreach ($iconMap as $keyword => $iconClass) {
                                if (stripos($program['program_name'], $keyword) !== false) {
                                    $icon = $iconClass;
                                    break;
                                }
                            }
                            
                            // Parse career opportunities if it's a comma-separated string
                            $careers = array();
                            if (!empty($program['career_opportunities'])) {
                                $careers = array_map('trim', explode(',', $program['career_opportunities']));
                            }
                    ?>
                        <div class="program-card detailed">
                            <div class="program-header">
                                <i class="<?php echo htmlspecialchars($icon); ?>"></i>
                                <h4><?php echo htmlspecialchars($program['program_name']); ?></h4>
                            </div>
                            <div class="program-details">
                                <p><strong>Program Description:</strong> <?php echo htmlspecialchars($program['description']); ?></p>
                                <p class="program-duration"><strong>Duration:</strong> <?php echo htmlspecialchars($program['duration_years']); ?> years</p>
                                <?php if (!empty($careers)): ?>
                                    <div class="program-features">
                                        <h5>Career Opportunities:</h5>
                                        <ul>
                                            <?php foreach ($careers as $career): ?>
                                                <li><?php echo htmlspecialchars(trim($career)); ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="program-card">
                        <p>No programs available at this time.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>