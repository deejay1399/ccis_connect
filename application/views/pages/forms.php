<!-- Forms Page Content -->
<section class="forms-section">
    <div class="container">
        <!-- Forms Grid -->
        <div class="forms-grid">
            <!-- Application Form for Entrance Examination -->
            <div class="form-card" id="application-form-for-entrance-examination">
                <div class="form-content">
                    <h3>Application Form for Entrance Examination</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="application-form-entrance">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="application-form-entrance">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Exit Form -->
            <div class="form-card" id="exit-form">
                <div class="form-content">
                    <h3>Exit Form</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="exit-form">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="exit-form">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Parent's Guardian Consent Form -->
            <div class="form-card" id="parents-guardian-consent-form">
                <div class="form-content">
                    <h3>Parent's/Guardian Consent Form</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="parents-consent-form">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="parents-consent-form">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Internship Agreement BSCS -->
            <div class="form-card" id="internship-agreement-bscs">
                <div class="form-content">
                    <h3>Internship Agreement (BSCS)</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="internship-agreement-bscs">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="internship-agreement-bscs">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Parent Consent OJT -->
            <div class="form-card" id="parent-consent-ojt">
                <div class="form-content">
                    <h3>Parent Consent OJT</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="parent-consent-ojt">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="parent-consent-ojt">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Student Information Form -->
            <div class="form-card" id="student-information-form">
                <div class="form-content">
                    <h3>Student Information Form</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="student-information-form">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="student-information-form">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Shiftee Form -->
            <div class="form-card" id="shiftee-form">
                <div class="form-content">
                    <h3>Shiftee Form</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="shiftee-form">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="shiftee-form">
                        Preview
                    </button>
                </div>
            </div>

            <!-- Adding/Dropping Forms -->
            <div class="form-card" id="adding-dropping-forms">
                <div class="form-content">
                    <h3>Adding/Dropping Forms</h3>
                </div>
                <div class="form-actions">
                    <button class="btn-download-pdf" data-form="adding-dropping-forms">
                        Download PDF
                    </button>
                    <button class="btn-preview" data-form="adding-dropping-forms">
                        Preview
                    </button>
                </div>
            </div>
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
            <div id="pdfPreview">
                <div class="pdf-placeholder">
                    <p>PDF Preview</p>
                    <small>This is a preview of the selected form. Download the PDF for printing.</small>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="downloadFromPreview" class="btn-download-pdf">
                Download PDF
            </button>
        </div>
    </div>
</div>
