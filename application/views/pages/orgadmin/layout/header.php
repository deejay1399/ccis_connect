<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? html_escape($page_title) : 'Organization Admin Dashboard'; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <?php $legion_css_version = file_exists(FCPATH . 'assets/css/legion.css') ? filemtime(FCPATH . 'assets/css/legion.css') : time(); ?>
    <link rel="stylesheet" href="<?php echo base_url('assets/css/legion.css?v=' . $legion_css_version); ?>">
    <style>
        .org-header-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            gap: 1rem;
            position: relative;
            z-index: 2;
        }
        .org-header-text .college-title,
        .org-header-text .college-subtitle {
            text-align: left !important;
        }
        @media (min-width: 769px) {
            .org-header-row {
                min-height: 70px;
                justify-content: center;
                padding-right: 64px;
            }
            .org-header-text {
                position: static;
                transform: none;
                width: auto;
                pointer-events: auto;
                flex: 0 1 auto;
                max-width: min(900px, calc(100% - 270px));
            }
            .org-header-row .header-auth-icon {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 0 !important;
            }
        }
        @media (max-width: 768px) {
            .org-header-row .college-logo {
                width: 48px;
                height: 48px;
            }
            .org-header-row .header-auth-icon {
                margin-top: 0 !important;
            }
        }
    </style>
</head>
<body>
    <header class="university-header">
        <div class="container">
            <div class="org-header-row">
                <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="college-logo">
                <div class="org-header-text">
                    <h1 class="college-title">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</h1>
                    <p class="college-subtitle"><?php echo html_escape($organization_name); ?> Admin Dashboard</p>
                </div>
                <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="CCIS Logo" class="college-logo">
                <div class="header-auth-icon">
                    <a href="<?php echo site_url('logout?logout=true'); ?>" id="logout-icon-link" class="auth-icon-link" title="Logout">
                        <i class="fas fa-user-circle"></i>
                    </a>
                </div>
            </div>
        </div>
    </header>
