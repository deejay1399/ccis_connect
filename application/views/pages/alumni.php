<!-- Alumni Main Content -->
<main class="alumni-main">
    <div class="alumni-content-area">
        <!-- Content will be loaded here by JavaScript -->
    </div>
</main>

<!-- Alumni Details Modal -->
<div class="modal fade" id="alumniDetailsModal" tabindex="-1" aria-labelledby="alumniDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="alumniDetailsModalLabel">Alumni Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="alumniModalContent">
                <!-- Content will be filled by JavaScript -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="connectAlumniBtn">Connect with Alumni</button>
            </div>
        </div>
    </div>
</div>

<!-- Give Back Form Modal -->
<div class="modal fade" id="givebackFormModal" tabindex="-1" aria-labelledby="givebackFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="givebackFormModalLabel">Give Back to CCIS</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="givebackFormContent">
                <!-- Give back form injected by JS -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="givebackForm" class="btn btn-primary">Submit</button>
            </div>
        </div>
    </div>
</div>

<!-- Donation Modal -->
<div class="modal fade" id="donationModal" tabindex="-1" aria-labelledby="donationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="donationModalLabel">Support CCIS</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6>Bank Transfer Details:</h6>
                <div class="bank-details">
                    <p><strong>Bank:</strong> Bank of the Philippine Islands (BPI)</p>
                    <p><strong>Account Name:</strong> BISU-CCIS Alumni Fund</p>
                    <p><strong>Account Number:</strong> 1234-5678-90</p>
                    <p><strong>Branch:</strong> Tagbilaran City, Bohol</p>
                </div>
                <hr>
                <h6>GCash/Maya:</h6>
                <div class="digital-payment">
                    <p><strong>GCash Number:</strong> 0917-123-4567</p>
                    <p><strong>Maya Number:</strong> 0918-765-4321</p>
                    <p><strong>Account Name:</strong> BISU CCIS Alumni</p>
                </div>
                <hr>
                <div class="important-notes">
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>Please take a screenshot of your transaction</li>
                        <li>Email the screenshot to: <strong>ccis.donations@bisu.edu.ph</strong></li>
                        <li>Include your name and contact information</li>
                        <li>Official receipt will be issued within 3 working days</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
            </div>
        </div>
    </div>
</div>

<!-- Connection Modal -->
<div class="modal fade" id="connectionModal" tabindex="-1" aria-labelledby="connectionModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="connectionModalLabel">Connect with Alumni</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="connectionForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="connName" class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="connName" required>
                        </div>
                        <div class="col-md-6">
                            <label for="connEmail" class="form-label">Email *</label>
                            <input type="email" class="form-control" id="connEmail" required>
                        </div>
                        <div class="col-md-6">
                            <label for="connBatch" class="form-label">Batch (optional)</label>
                            <input type="text" class="form-control" id="connBatch">
                        </div>
                        <div class="col-md-6">
                            <label for="connPurpose" class="form-label">Purpose *</label>
                            <select id="connPurpose" class="form-select" required>
                                <option value="">Select purpose</option>
                                <option value="Mentorship">Mentorship</option>
                                <option value="Career Advice">Career Advice</option>
                                <option value="Networking">Networking</option>
                                <option value="Collaboration">Collaboration</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="connMessage" class="form-label">Message *</label>
                            <textarea class="form-control" id="connMessage" rows="4" required></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="connectionForm" class="btn btn-primary">Send Request</button>
            </div>
        </div>
    </div>
</div>
