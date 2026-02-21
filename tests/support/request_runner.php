<?php
declare(strict_types=1);

chdir(dirname(__DIR__, 2));

$route = $argv[1] ?? '/';
if ($route === '') {
    $route = '/';
}
if ($route[0] !== '/') {
    $route = '/' . $route;
}

$_GET = [];
$_POST = [];
$_COOKIE = [];
$_FILES = [];

$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = $route;
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SERVER_PROTOCOL'] = 'HTTP/1.1';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_HOST'] = 'localhost';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_PORT'] = '80';

$markers = [
    'A PHP Error was encountered',
    'A Database Error Occurred',
    '404 Page Not Found',
    'An uncaught Exception was encountered',
    'Parse error:',
    'Fatal error:',
];

if (function_exists('header_remove')) {
    @header_remove();
}

$finalized = false;
$finalize = static function () use (&$finalized, $route, $markers): void {
    if ($finalized) {
        return;
    }
    $finalized = true;

    $output = '';
    while (ob_get_level() > 0) {
        $output .= (string) ob_get_clean();
    }

    $headers = headers_list();
    $hasErrorMarker = false;
    foreach ($markers as $marker) {
        if (strpos($output, $marker) !== false) {
            $hasErrorMarker = true;
            break;
        }
    }

    $hasRedirect = false;
    foreach ($headers as $header) {
        if (stripos($header, 'Location:') === 0) {
            $hasRedirect = true;
            break;
        }
    }

    echo json_encode(
        [
            'route' => $route,
            'has_error_marker' => $hasErrorMarker,
            'has_redirect' => $hasRedirect,
            'output_length' => strlen($output),
        ],
        JSON_UNESCAPED_SLASHES
    );
};

register_shutdown_function($finalize);
ob_start();
include 'index.php';
$finalize();
