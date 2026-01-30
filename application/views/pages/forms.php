<!-- Forms Page Content -->
<section class="forms-section">
    <div class="container">
        <!-- Forms Grid -->
        <div class="forms-grid">
            <?php if (!empty($forms)): ?>
                <?php foreach ($forms as $form): ?>
                    <div class="form-card" id="form-<?php echo $form['id']; ?>">
                        <div class="form-content">
                            <h3><?php echo htmlspecialchars($form['title']); ?></h3>
                        </div>
                        <div class="form-actions">
                            <a href="<?php echo base_url($form['file_url']); ?>" class="btn-download-pdf" download>
                                Download PDF
                            </a>
                            <button class="btn-preview" data-form-id="<?php echo $form['id']; ?>" data-form-url="<?php echo base_url($form['file_url']); ?>">
                                Preview
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
        </div>
        <div class="modal-footer">
            <button id="downloadFromPreview" class="btn-download-pdf">
                Download PDF
            </button>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle preview buttons
    document.querySelectorAll('.btn-preview').forEach(btn => {
        btn.addEventListener('click', function() {
            const formUrl = this.getAttribute('data-form-url');
            const formTitle = this.closest('.form-card').querySelector('h3').textContent;
            
            document.getElementById('modalFormTitle').textContent = formTitle + ' Preview';
            document.getElementById('pdfFrame').src = formUrl;
            document.getElementById('pdfPreviewModal').style.display = 'block';
        });
    });

    // Handle modal close
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('pdfPreviewModal').style.display = 'none';
        document.getElementById('pdfFrame').src = '';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('pdfPreviewModal');
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('pdfFrame').src = '';
        }
    });

    // Handle download from preview
    document.getElementById('downloadFromPreview').addEventListener('click', function() {
        const pdfUrl = document.getElementById('pdfFrame').src;
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = true;
        a.click();
    });
});
</script>

