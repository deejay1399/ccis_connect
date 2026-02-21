<?php
declare(strict_types=1);

// Minimal constants for including CodeIgniter config files in isolation.
if (!defined('BASEPATH')) {
    define('BASEPATH', __DIR__ . '/../system/');
}

if (!defined('APPPATH')) {
    define('APPPATH', __DIR__ . '/../application/');
}

if (!defined('ENVIRONMENT')) {
    define('ENVIRONMENT', 'testing');
}

// Lightweight CI stubs so static checks can include app files safely if needed.
if (!class_exists('CI_Controller')) {
    class CI_Controller
    {
    }
}

if (!class_exists('CI_Model')) {
    class CI_Model
    {
    }
}
