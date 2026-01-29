<section class="faculty-section">
        <div class="container">
            <div class="content-card">
                <h3><i class="fas fa-chalkboard-teacher me-3"></i>Faculty Members</h3>
                <p class="lead mb-4">Meet our dedicated team of educators and researchers committed to excellence in computing education.</p>
                
                <div class="faculty-grid <?php echo (isset($faculty_count) && $faculty_count === 1) ? 'single-card' : ''; ?>">
                    <?php if (isset($faculty_members) && !empty($faculty_members)): ?>
                        <?php foreach ($faculty_members as $faculty): ?>
                            <div class="faculty-card">
                                <div class="faculty-image">
                                    <?php 
                                        $firstname = $faculty['firstname'];
                                        $lastname = $faculty['lastname'];
                                        $image_path = '';
                                        
                                        if (!empty($faculty['image'])) {
                                            if (strpos($faculty['image'], 'http') === 0) {
                                                $image_path = $faculty['image'];
                                            } else {
                                                $image_path = base_url('uploads/faculty/' . $faculty['image']);
                                            }
                                        } else {
                                            // Set placeholder immediately if no image
                                            $image_path = 'https://via.placeholder.com/300x300/6a0dad/ffffff?text=' . urlencode($firstname . '+' . $lastname);
                                        }
                                    ?>
                                    <img src="<?php echo $image_path; ?>" 
                                         alt="<?php echo htmlspecialchars($firstname . ' ' . $lastname); ?>" 
                                         onerror="this.src='https://via.placeholder.com/300x300/6a0dad/ffffff?text=<?php echo urlencode($firstname . '+' . $lastname); ?>'"
                                         style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="faculty-info">
                                    <h4><?php echo htmlspecialchars($faculty['firstname'] . ' ' . $faculty['lastname']); ?></h4>
                                    <p class="faculty-position">
                                        <?php 
                                            $position = htmlspecialchars($faculty['position']);
                                            // Check position type and display accordingly
                                            if (stripos($position, 'dean') !== false) {
                                                echo $position . '<br><span style="font-size: 0.85em; color: #6a0dad; font-weight: 500;">College of Computing and Information Sciences</span>';
                                            } else {
                                                // Display advisory from database for non-dean positions
                                                $advisory = !empty($faculty['advisory']) ? htmlspecialchars($faculty['advisory']) : '';
                                                if ($advisory) {
                                                    echo $advisory . ' - Adviser';
                                                } else {
                                                    echo $position;
                                                }
                                            }
                                        ?>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-center col-12">No faculty members available at this time.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>