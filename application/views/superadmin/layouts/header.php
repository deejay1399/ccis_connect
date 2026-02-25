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
    <?php if(isset($content_type) && $content_type === 'homepage'): ?>
        <?php
            $homepage_css_path = FCPATH . 'assets/css/manage_homepage.css';
            $homepage_css_version = file_exists($homepage_css_path) ? filemtime($homepage_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_homepage.css?v=' . $homepage_css_version); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'organizations'): ?>
        <?php
            $organizations_css_path = FCPATH . 'assets/css/manage_organizations.css';
            $organizations_css_version = file_exists($organizations_css_path) ? filemtime($organizations_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_organizations.css?v=' . $organizations_css_version); ?>">
    <?php endif; ?>
    <?php if(isset($content_type) && $content_type === 'about'): ?>
        <?php
            $about_css_path = FCPATH . 'assets/css/manage_about.css';
            $about_css_version = file_exists($about_css_path) ? filemtime($about_css_path) : time();
        ?>
        <link rel="stylesheet" href="<?php echo base_url('assets/css/manage_about.css?v=' . $about_css_version); ?>">
    <?php endif; ?>
    <style>
        .superadmin-header-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            position: relative;
        }
        .superadmin-header-text {
            flex: 1;
            min-width: 0;
        }
        .superadmin-header-text .college-title,
        .superadmin-header-text .college-subtitle {
            text-align: left !important;
        }
        .superadmin-header-row .header-auth-icon {
            margin-left: auto;
        }
        .superadmin-header-bisu-logo,
        .superadmin-header-ccis-logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
            position: relative;
            z-index: 2;
        }
        @media (min-width: 769px) {
            .superadmin-header-row {
                min-height: 70px;
                justify-content: center;
                padding-right: 64px;
            }
            .superadmin-header-text {
                position: static;
                transform: none;
                width: auto;
                pointer-events: auto;
                flex: 0 1 auto;
                max-width: min(900px, calc(100% - 270px));
            }
            .superadmin-header-row .header-auth-icon {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 0 !important;
            }
        }
        @media (max-width: 768px) {
            .superadmin-header-row { gap: 0.6rem; }
            .superadmin-header-bisu-logo,
            .superadmin-header-ccis-logo {
                width: 48px;
                height: 48px;
            }
            .superadmin-header-row .header-auth-icon {
                justify-content: flex-end !important;
                margin-top: 0 !important;
            }
        }
        @media (max-width: 576px) {
            .superadmin-header-bisu-logo,
            .superadmin-header-ccis-logo {
                width: 40px;
                height: 40px;
            }
        }
    </style>
</head>
<body>
    <header class="university-header">
        <div class="container">
            <div class="superadmin-header-row">
                <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="superadmin-header-bisu-logo">
                <div class="superadmin-header-text">
                    <h1 class="college-title">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</h1>
                    <p class="college-subtitle">Super Admin Control Panel</p>
                </div>
                <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="CCIS Logo" class="superadmin-header-ccis-logo">
                <div class="header-auth-icon">
                    <a href="<?php echo base_url('index.php/logout?logout=true'); ?>" id="logout-icon-link" class="auth-icon-link" title="Logout">
                        <i class="fas fa-user-circle"></i>
                    </a>
                </div>
            </div>
        </div>
    </header>
