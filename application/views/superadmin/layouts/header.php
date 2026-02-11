<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Dashboard - CCIS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/dashboard.css'); ?>">
    <!-- Page-specific CSS -->
    <?php if(isset($page_type) && $page_type === 'admin_users'): ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/create_user.css'); ?>">
    <?php endif; ?>
    <?php if(isset($page_type) && $page_type === 'list_users'): ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/list_users_new.css'); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'faculty'): ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_faculty.css'); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'academics'): ?>
        <?php
            $academics_css_path = FCPATH . 'assets/css/manage_academics.css';
            $academics_css_version = file_exists($academics_css_path) ? filemtime($academics_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_academics.css?v=' . $academics_css_version); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'alumni'): ?>
        <?php
            $alumni_css_path = FCPATH . 'assets/css/manage_alumni.css';
            $alumni_css_version = file_exists($alumni_css_path) ? filemtime($alumni_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_alumni.css?v=' . $alumni_css_version); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'updates'): ?>
        <?php
            $updates_css_path = FCPATH . 'assets/css/manage_updates.css';
            $updates_css_version = file_exists($updates_css_path) ? filemtime($updates_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_updates.css?v=' . $updates_css_version); ?>">
    <?php endif; ?>
</head>
<body>
    <!-- Updated Header without BISU logo and notification -->
    <header class="university-header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-1 text-center">
                    <!-- BISU Logo removed as requested -->
                </div>
                <div class="col-md-1 text-center">
                    <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="CCIS Logo" class="college-logo">
                </div>
                <div class="col-md-9">
                    <h1 class="college-title">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</h1>
                    <p class="college-subtitle">Super Admin Control Panel</p>
                </div>
                <div class="col-md-1">
                    <div class="header-auth-icon">
                        <!-- LOGOUT BUTTON ONLY in header -->
                        <a href="<?php echo base_url('index.php/logout?logout=true'); ?>" id="logout-icon-link" class="auth-icon-link" title="Logout">
                            <i class="fas fa-user-circle"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
