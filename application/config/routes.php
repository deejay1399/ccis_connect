<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// Default route
$route['default_controller'] = 'LandingController/homepage';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// ==================== HOMEPAGE ====================
$route[''] = 'LandingController/homepage';
$route['home'] = 'LandingController/homepage';
$route['homepage'] = 'LandingController/homepage';
$route['landing'] = 'LandingController/homepage';

// ==================== ABOUT ====================
$route['about'] = 'AboutController/index';

// ==================== FACULTY ====================
$route['faculty'] = 'FacultyController/faculty';
$route['faculty/dashboard'] = 'FacultyController/dashboard';

// ==================== ACADEMICS ====================
$route['academics'] = 'AcademicsController/index';
$route['academics/programs'] = 'AcademicsController/programs';
$route['academics/curriculum'] = 'AcademicsController/curriculum';
$route['academics/schedule'] = 'AcademicsController/schedule';
$route['academics/calendar'] = 'AcademicsController/calendar';
$route['academics/get_programs_json'] = 'AcademicsController/get_programs_json';

// ==================== UPDATES ====================
$route['updates'] = 'UpdatesController/index';
$route['updates/announcements'] = 'UpdatesController/announcements';
$route['updates/events'] = 'UpdatesController/events';
$route['updates/deanslist'] = 'UpdatesController/deanslist';

// ==================== FORMS ====================
$route['forms'] = 'FormsController/index';

// ==================== LOGIN ====================
$route['login'] = 'LoginController/index';
$route['login/authenticate'] = 'LoginController/authenticate';
$route['login/api_authenticate'] = 'LoginController/api_authenticate';
$route['logout'] = 'LoginController/logout';

// ==================== ALUMNI ====================
$route['alumni'] = 'AlumniController/index';

// ==================== ORGANIZATION ====================
$route['organization'] = 'OrganizationController/index';
$route['organization/legion'] = 'OrganizationController/legion';
$route['organization/csguild'] = 'OrganizationController/csguild';
// ==================== SUPER ADMIN ====================
$route['admin'] = 'admin/AdminDashboard/index';
$route['admin/dashboard'] = 'admin/AdminDashboard/index';

// Admin Content Management
$route['admin/content/homepage'] = 'admin/AdminContent/homepage';
$route['admin/content/updates'] = 'admin/AdminContent/updates';
$route['admin/content/academics'] = 'admin/AdminContent/academics';
$route['admin/content/about'] = 'admin/AdminContent/about';
$route['admin/content/faculty'] = 'admin/AdminContent/faculty';
$route['admin/content/forms'] = 'admin/AdminContent/forms';
$route['admin/content/organizations'] = 'admin/AdminContent/organizations';
$route['admin/content/alumni'] = 'admin/AdminContent/alumni';

// Admin Content Management - AJAX
$route['admin/manage/load_homepage'] = 'admin/AdminContent/load_homepage';
$route['admin/manage/save_homepage'] = 'admin/AdminContent/save_homepage';

// Faculty Management API Endpoints
$route['admin/api/get_faculty'] = 'admin/AdminContent/api_get_faculty';
$route['admin/api/add_faculty'] = 'admin/AdminContent/api_add_faculty';
$route['admin/api/update_faculty'] = 'admin/AdminContent/api_update_faculty';
$route['admin/api/delete_faculty'] = 'admin/AdminContent/api_delete_faculty';

// Programs Management API Endpoints
$route['admin/content/api_get_programs'] = 'admin/AdminContent/api_get_programs';
$route['admin/content/api_save_program'] = 'admin/AdminContent/api_save_program';
$route['admin/content/api_load_program'] = 'admin/AdminContent/api_load_program';
$route['admin/content/api_update_program'] = 'admin/AdminContent/api_update_program';
$route['admin/content/api_delete_program'] = 'admin/AdminContent/api_delete_program';

// Curriculum Management API Endpoints
$route['admin/content/api_upload_curriculum'] = 'AdminContent/api_upload_curriculum';
$route['admin/content/api_get_curriculums'] = 'AdminContent/api_get_curriculums';
$route['admin/content/api_delete_curriculum'] = 'AdminContent/api_delete_curriculum';

// Admin User Management
$route['admin/users/create'] = 'admin/AdminUsers/create';
$route['admin/users/save'] = 'admin/AdminUsers/save';
$route['admin/users/list'] = 'admin/AdminUsers/list_all';
$route['admin/users/edit/(:num)'] = 'admin/AdminUsers/edit/$1';
$route['admin/users/delete/(:num)'] = 'admin/AdminUsers/delete/$1';
$route['admin/users/get_all'] = 'admin/AdminUsers/get_all_users';
$route['admin/users/get_details/(:num)'] = 'admin/AdminUsers/get_user_details/$1';
$route['admin/users/update'] = 'admin/AdminUsers/update_user';
$route['admin/users/remove'] = 'admin/AdminUsers/delete_user';
