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
                <p>Your donation helps support scholarships, equipment, and learning resources for CCIS students.</p>
                <p>Please contact the CCIS Alumni Office for donation details.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Okay</button>
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
