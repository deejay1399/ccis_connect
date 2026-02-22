<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CCIS - College of Computing and Information Sciences</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/chatbot.css'); ?>">
    <style>
        .global-header-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            position: relative;
        }
        .global-header-text {
            flex: 1;
            min-width: 0;
        }
        .global-header-text .college-title,
        .global-header-text .college-subtitle {
            text-align: left !important;
        }
        .global-header-row .header-auth-icon {
            margin-left: auto;
        }
        .global-header-bisu-logo,
        .global-header-ccis-logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
        }
        @media (min-width: 769px) {
            .global-header-row {
                min-height: 70px;
                justify-content: center;
                padding-right: 64px;
            }
            .global-header-text {
                position: static;
                transform: none;
                width: auto;
                pointer-events: auto;
                flex: 0 1 auto;
                max-width: min(900px, calc(100% - 270px));
            }
            .global-header-row .header-auth-icon {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 0 !important;
            }
        }
        @media (max-width: 768px) {
            .global-header-row { gap: 0.6rem; }
            .global-header-bisu-logo,
            .global-header-ccis-logo {
                width: 48px;
                height: 48px;
            }
            .global-header-row .header-auth-icon {
                justify-content: flex-end !important;
                margin-top: 0 !important;
            }
        }
        @media (max-width: 576px) {
            .global-header-bisu-logo,
            .global-header-ccis-logo {
                width: 40px;
                height: 40px;
            }
        }
    </style>
    <?php if (!empty($page_type)): ?>
        <?php if ($page_type === 'homepage'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/homepage.css'); ?>">
        <?php elseif ($page_type === 'about'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/about.css'); ?>">
        <?php elseif ($page_type === 'faculty'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/faculty.css'); ?>">
        <?php elseif ($page_type === 'academics'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/academics.css'); ?>">
        <?php elseif ($page_type === 'updates'): ?>
            <?php
                $updates_css_path = FCPATH . 'assets/css/updates.css';
                $updates_css_version = file_exists($updates_css_path) ? filemtime($updates_css_path) : time();
            ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/updates.css?v=' . $updates_css_version); ?>">
        <?php elseif ($page_type === 'forms'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/forms.css'); ?>">
        <?php elseif ($page_type === 'login'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/login.css'); ?>">
        <?php elseif ($page_type === 'alumni'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/alumni.css'); ?>">
        <?php elseif ($page_type === 'organization' || $page_type === 'organization_student'): ?>
            <link rel="stylesheet" href="<?php echo base_url('assets/css/organization.css'); ?>">
        <?php endif; ?>
    <?php endif; ?>
    <style>
        .global-header-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
        }
        .global-header-text .college-title,
        .global-header-text .college-subtitle {
            text-align: left !important;
        }
    </style>
</head>
<body>
    <header class="university-header">
        <div class="container">
            <div class="global-header-row">
                <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="global-header-bisu-logo">
                <div class="global-header-text">
                    <h1 class="college-title">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</h1>
                    <p class="college-subtitle">Excellence in Technology Education and Innovation</p>
                </div>
                <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="CCIS Logo" class="global-header-ccis-logo">
                <div class="header-auth-icon">
                    <a href="<?php echo base_url('index.php/login'); ?>" id="login-icon-link" class="auth-icon-link" title="Login">
                        <i class="fas fa-user-circle"></i>
                    </a>
                    <a href="<?php echo base_url('index.php/logout'); ?>" id="logout-icon-link" class="auth-icon-link" style="display: none;" title="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    </header>
