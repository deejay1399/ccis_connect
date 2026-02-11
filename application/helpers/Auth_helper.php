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
 * Check if current user is superadmin.
 */
function is_superadmin()
{
    return has_role(1);
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

/**
 * Require a logged-in superadmin or faculty account.
 */
function require_superadmin()
{
    require_login();

    $role_id = (int) get_user_role();
    if ($role_id !== 1 && $role_id !== 2) {
        show_error('You do not have permission to access this page', 403);
    }
}

/**
 * Require a logged-in account with superadmin/faculty privileges.
 */
function require_admin_or_faculty()
{
    require_superadmin();
}

/**
 * Restrict public-side access for roles that must stay in dashboards.
 * Currently: superadmin (1), faculty (2)
 */
function restrict_public_for_admin_roles()
{
    $CI = &get_instance();

    if (!$CI->session->userdata('logged_in')) {
        return;
    }

    $role_id = (int) $CI->session->userdata('role_id');
    if ($role_id === 1) {
        redirect('admin/dashboard');
    }
    if ($role_id === 2) {
        redirect('faculty/dashboard');
    }
}

/**
 * Require a logged-in student account.
 */
function require_student_only()
{
    $CI = &get_instance();

    if (!$CI->session->userdata('logged_in')) {
        redirect('login');
    }

    if ((int) $CI->session->userdata('role_id') !== 3) {
        redirect_by_role((int) $CI->session->userdata('role_id'));
    }
}
?>
