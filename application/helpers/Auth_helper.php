<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Authentication Mga Function sa Magtatabang
 */

/**
 * Susihon kung ang tiggamit naka-log in
 */
function is_logged_in()
{
    $CI = &get_instance();
    return $CI->session->userdata('logged_in') === true;
}

/**
 * Kuhaa ang kasamtangan nga user ID
 */
function get_user_id()
{
    $CI = &get_instance();
    return $CI->session->userdata('user_id');
}

/**
 * Get kasamtangan nga user papel ID
 */
function get_user_role()
{
    $CI = &get_instance();
    return $CI->session->userdata('role_id');
}

/**
 * Kuhaa ang kasamtangan nga datos sa tiggamit
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
 * Get user bug-os nga ngalan
 */
function get_user_name()
{
    $CI = &get_instance();
    $first_name = $CI->session->userdata('first_name');
    $last_name = $CI->session->userdata('last_name');
    return trim($first_name . ' ' . $last_name);
}

/**
 * Susihon kung ang tiggamit adunay piho nga papel
 */
function has_role($role_id)
{
    return get_user_role() == $role_id;
}

/**
 * Susiha kon ang kasamtangan nga tiggamit mao ang superadmin.
 */
function is_superadmin()
{
    return has_role(1);
}

/**
 * Get role name pinaagi sa ID
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
 * Gikinahanglan ang pag-login - pag-redirect sa pag-login kung dili gipanghimatuud
 */
function require_login()
{
    if (!is_logged_in()) {
        redirect('login');
    }
}

/**
 * Nanginahanglan piho nga papel
 */
function require_role($role_id)
{
    require_login();
    
    if (!has_role($role_id)) {
        show_error('You do not have permission to access this page', 403);
    }
}

/**
 * Redirect base sa papel
 */
function redirect_by_role($role_id = null)
{
    if (!$role_id) {
        $role_id = get_user_role();
    }

    $redirect_paths = [
        1 => 'admin/dashboard',      // Super Admin
        2 => 'admin/dashboard',      // Faculty - parehas nga pag-access sa superadmin
        3 => 'student/dashboard',    // Estudyante
        4 => 'org/dashboard'         // Organisasyon Admin
    ];

    $redirect_path = isset($redirect_paths[$role_id]) ? $redirect_paths[$role_id] : 'login';
    redirect($redirect_path);
}

/**
 * Gikinahanglan ang usa ka naka-log-in nga superadmin o faculty account.
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
 * Nanginahanglan usa ka naka-log in nga account nga adunay mga pribilehiyo sa superadmin/faculty.
 */
function require_admin_or_faculty()
{
    require_superadmin();
}

/**
 * Ang mga panid sa publiko ma-access sa tanan nga mga tahas nga naka-log in.
 * Gipadayon alang sa backward compatibility diin ang mga controllers nagtawag gihapon niini nga katabang.
 */
function restrict_public_for_admin_roles()
{
    return;
}

/**
 * Kinahanglan nimo ang usa ka naka-log in nga account sa estudyante.
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
