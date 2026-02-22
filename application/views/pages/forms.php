<!-- Forms Page Content -->
<section class="forms-section">
    <div class="container">
        <!-- Forms Grid -->
        <div class="forms-grid">
            <?php if (!empty($forms)): ?>
                <?php foreach ($forms as $form): ?>
                    <?php
                        $file_ext = strtolower(pathinfo((string) $form['file_url'], PATHINFO_EXTENSION));
                        $is_pdf = $file_ext === 'pdf';
                    ?>
                    <div class="form-card" id="form-<?php echo $form['id']; ?>">
                        <div class="form-content">
                            <h3><?php echo htmlspecialchars($form['title']); ?></h3>
                        </div>
                        <div class="form-actions">
                            <a href="<?php echo base_url($form['file_url']); ?>" class="btn-download-pdf" download="<?php echo html_escape($form['original_filename']); ?>">
                                Download File
                            </a>
                            <button class="btn-preview"
                                data-form-id="<?php echo $form['id']; ?>"
                                data-form-url="<?php echo base_url($form['file_url']); ?>"
                                data-file-ext="<?php echo html_escape($file_ext); ?>"
                                data-is-pdf="<?php echo $is_pdf ? '1' : '0'; ?>"
                                data-download-name="<?php echo html_escape($form['original_filename']); ?>">
                                <?php echo $is_pdf ? 'Preview' : 'Open'; ?>
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="alert alert-info" style="grid-column: 1/-1;">
                    <p>No forms available at this time.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- PDF Preview Modal -->
<div id="pdfPreviewModal" class="modal">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-header">
            <h3 id="modalFormTitle">Form Preview</h3>
        </div>
        <div class="modal-body">
            <iframe id="pdfFrame" style="width: 100%; height: 600px; border: none;"></iframe>
            <div id="docxPreviewContainer" style="display:none; width:100%; height:600px; overflow:auto; background:#fff; border:1px solid #eee; border-radius:6px; padding:16px;"></div>
        </div>
        <div class="modal-footer">
            <button id="downloadFromPreview" class="btn-download-pdf">
                Download File
            </button>
        </div>
    </div>
</div>


