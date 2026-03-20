<?php
$file_ext = strtolower(pathinfo((string) $current_form['file_url'], PATHINFO_EXTENSION));
$is_pdf = $file_ext === 'pdf';
?>
<section class="forms-section">
    <div class="container">
        <div class="forms-grid forms-grid-single">
            <div class="form-card form-card-single" id="form-<?php echo (int) $current_form['id']; ?>">
                <div class="form-content">
                    <div>
                        <p class="form-kicker">Available Form</p>
                        <h3><?php echo htmlspecialchars($current_form['title']); ?></h3>
                        <p class="form-file-name"><?php echo html_escape($current_form['original_filename']); ?></p>
                    </div>
                </div>
                <div class="form-actions">
                    <a href="<?php echo base_url($current_form['file_url']); ?>" class="btn-download-pdf" download="<?php echo html_escape($current_form['original_filename']); ?>">
                        Download File
                    </a>
                    <button class="btn-preview"
                        data-form-id="<?php echo (int) $current_form['id']; ?>"
                        data-form-url="<?php echo base_url($current_form['file_url']); ?>"
                        data-file-ext="<?php echo html_escape($file_ext); ?>"
                        data-is-pdf="<?php echo $is_pdf ? '1' : '0'; ?>"
                        data-download-name="<?php echo html_escape($current_form['original_filename']); ?>">
                        <?php echo $is_pdf ? 'Preview' : 'Open'; ?>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

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
