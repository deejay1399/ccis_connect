<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Authentication Helper Functions
 */

/**
 * Check if user is logged in
 */
function is_logged_in()
{
    $CI = &get_instance();
    return $CI->session->userdata('logged_in') === true;
}

/**
 * Get current user ID
 */
function get_user_id()
{
    $CI = &get_instance();
    return $CI->session->userdata('user_id');
}

/**
 * Get current user role ID
 */
function get_user_role()
{
    $CI = &get_instance();
    return $CI->session->userdata('role_id');
}

/**
 * Get current user data
 */
function get_user_data()
{
    $CI = &get_instance();
    return [
        'user_id' => $CI->session->userdata('user_id'),
        'email' => $CI->session->userdata('email'),
        'first_name' => $CI->session->userdata('first_name'),
        'last_name' => $CI->session->userdata('last_name'),
        'role_id' => $CI->session->userdata('role_id')
    ];
}

/**
 * Get user full name
 */
function get_user_name()
{
    $CI = &get_instance();
    $first_name = $CI->session->userdata('first_name');
    $last_name = $CI->session->userdata('last_name');
    return trim($first_name . ' ' . $last_name);
}

/**
 * Check if user has specific role
 */
function has_role($role_id)
{
    return get_user_role() == $role_id;
}

/**
 * Get role name by ID
 */
function get_role_name($role_id)
{
    $roles = [
        1 => 'Super Admin',
        2 => 'Faculty',
        3 => 'Student',
        4 => 'Organization Admin'
    ];
    
    return isset($roles[$role_id]) ? $roles[$role_id] : 'Unknown Role';
}

/**
 * Require login - redirect to login if not authenticated
 */
function require_login()
{
    if (!is_logged_in()) {
        redirect('login');
    }
}

/**
 * Require specific role
 */
function require_role($role_id)
{
    require_login();
    
    if (!has_role($role_id)) {
        show_error('You do not have permission to access this page', 403);
    }
}

/**
 * Redirect based on role
 */
function redirect_by_role($role_id = null)
{
    if (!$role_id) {
        $role_id = get_user_role();
    }

    $redirect_paths = [
        1 => 'admin/dashboard',      // Super Admin
        2 => 'faculty/dashboard',    // Faculty
        3 => 'student/dashboard',    // Student
        4 => 'org/dashboard'         // Organization Admin
    ];

    $redirect_path = isset($redirect_paths[$role_id]) ? $redirect_paths[$role_id] : 'login';
    redirect($redirect_path);
}
?>
