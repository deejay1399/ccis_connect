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
    <link rel="stylesheet" href="<?php echo base_url('assets/css/homepage.css'); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/chatbot.css'); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/about.css'); ?>">
</head>
<body>
    <header class="university-header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-1 text-center">
                    <img src="<?php echo base_url('assets/images/bisu1.png'); ?>" alt="BISU Logo" class="university-logo">
                </div>
                <div class="col-md-1 text-center">
                    <img src="<?php echo base_url('assets/images/ccis.png'); ?>" alt="CCIS Logo" class="college-logo">
                </div>
                <div class="col-md-9">
                    <h1 class="college-title">COLLEGE OF COMPUTING AND INFORMATION SCIENCES</h1>
                    <p class="college-subtitle">Excellence in Technology Education and Innovation</p>
                </div>
                <div class="col-md-1">
                    <div class="header-auth-icon">
                        <a href="login.html" id="login-icon-link" class="auth-icon-link" title="Login">
                            <i class="fas fa-user-circle"></i>
                        </a>
                        <a href="javascript:void(0)" id="logout-icon-link" class="auth-icon-link" style="display: none;" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>