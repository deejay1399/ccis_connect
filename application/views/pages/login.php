<!-- Login Page Content -->
<section class="login-section">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="login-card">
                    <div class="login-header text-center">
                        <h3><i class="fas fa-lock me-2"></i>Login to CCIS Portal</h3>
                        <p class="login-subtitle">Access your account based on your role</p>
                    </div>
                    
                    <!-- Error Message -->
                    <?php if (isset($error) && $error): ?>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            <?php echo $error; ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <!-- Success Message -->
                    <?php if (isset($success) && $success): ?>
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fas fa-check-circle me-2"></i>
                            <?php echo $success; ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" action="<?php echo base_url('login/authenticate'); ?>" class="login-form">
                        <div class="form-group">
                            <label for="email" class="form-label">Email Address</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                <input type="email" class="form-control" id="email" name="email" 
                                       placeholder="Enter your email address" required>
                            </div>
                            <div class="validation-message" id="emailValidation">
                                <i class="fas fa-exclamation-circle"></i>
                                <span id="emailValidationText"></span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-key"></i></span>
                                <input type="password" class="form-control" id="password" name="password" 
                                       placeholder="Enter your password" required>
                                <button type="button" class="input-group-text password-toggle" id="togglePassword"
                                        aria-label="Show password" title="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                    <span class="visually-hidden">Show password</span>
                                </button>
                            </div>
                            <div class="validation-message" id="passwordValidation">
                                <i class="fas fa-exclamation-circle"></i>
                                <span id="passwordValidationText"></span>
                            </div>
                        </div>
                        
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="rememberMe" name="rememberMe">
                            <label class="form-check-label" for="rememberMe">Remember me</label>
                        </div>
                        
                        <button type="submit" class="btn btn-login w-100" id="loginBtn">
                            <i class="fas fa-sign-in-alt me-2"></i>Login
                        </button>
                        
                        <div class="login-footer text-center mt-3">
                            <p class="mb-2">Forgot your password? <a href="#" id="forgotPassword">Contact Admin</a></p>
                            <div class="access-info">
                                <p class="text-muted"><small>Different roles have different access levels</small></p>
                                <p class="text-muted"><small>1: Super Admin | 2: Faculty | 3: Student | 4: Org Admin</small></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
