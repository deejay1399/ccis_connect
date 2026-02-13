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

// Updates - Public JSON API (DB-backed)
$route['updates/api/announcements'] = 'UpdatesController/api_announcements';
$route['updates/api/events_achievements'] = 'UpdatesController/api_events_achievements';
$route['updates/api/deans_list'] = 'UpdatesController/api_deans_list';

// ==================== CHATBOT ====================
$route['chatbot/api/faq'] = 'ChatbotController/faq';
$route['chatbot/api/ask'] = 'ChatbotController/ask';

// ==================== FORMS ====================
$route['forms'] = 'FormsController/view_forms';

// ==================== LOGIN ====================
$route['login'] = 'LoginController/index';
$route['login/authenticate'] = 'LoginController/authenticate';
$route['login/api_authenticate'] = 'LoginController/api_authenticate';
$route['logout'] = 'LoginController/logout';

// ==================== ALUMNI ====================
$route['alumni'] = 'AlumniController/index';
$route['alumni/api/featured'] = 'AlumniController/api_featured';
$route['alumni/api/directory'] = 'AlumniController/api_directory';
$route['alumni/api/stories'] = 'AlumniController/api_stories';
$route['alumni/api/events'] = 'AlumniController/api_events';
$route['alumni/api/submit_update'] = 'AlumniController/submit_update';
$route['alumni/api/submit_giveback'] = 'AlumniController/submit_giveback';
$route['alumni/api/submit_connection'] = 'AlumniController/submit_connection';

// ==================== ORGANIZATION ====================
$route['organization'] = 'OrganizationController/index';
$route['organization/legion'] = 'OrganizationController/legion';
$route['organization/csguild'] = 'OrganizationController/csguild';

// ==================== ORG ADMIN ====================
$route['org/dashboard'] = 'Org/dashboard';
$route['org/officers/create'] = 'Org/add_officer';
$route['org/officers/update/(:num)'] = 'Org/update_officer/$1';
$route['org/officers/delete/(:num)'] = 'Org/delete_officer/$1';
$route['org/advisers/create'] = 'Org/add_adviser';
$route['org/advisers/update/(:num)'] = 'Org/update_adviser/$1';
$route['org/advisers/delete/(:num)'] = 'Org/delete_adviser/$1';
$route['org/announcements/create'] = 'Org/add_announcement';
$route['org/announcements/update/(:num)'] = 'Org/update_announcement/$1';
$route['org/announcements/delete/(:num)'] = 'Org/delete_announcement/$1';
$route['org/happenings/create'] = 'Org/add_happening';
$route['org/happenings/update/(:num)'] = 'Org/update_happening/$1';
$route['org/happenings/delete/(:num)'] = 'Org/delete_happening/$1';
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

// Admin Content Management - UPDATES (Announcements / Events & Achievements / Dean's List)
$route['admin/manage/load_announcements'] = 'admin/AdminContent/load_announcements';
$route['admin/manage/create_announcement'] = 'admin/AdminContent/create_announcement';
$route['admin/manage/update_announcement'] = 'admin/AdminContent/update_announcement';
$route['admin/manage/delete_announcement'] = 'admin/AdminContent/delete_announcement';

$route['admin/manage/load_events_achievements'] = 'admin/AdminContent/load_events_achievements';
$route['admin/manage/create_event_achievement'] = 'admin/AdminContent/create_event_achievement';
$route['admin/manage/update_event_achievement'] = 'admin/AdminContent/update_event_achievement';
$route['admin/manage/delete_event_achievement'] = 'admin/AdminContent/delete_event_achievement';

$route['admin/manage/load_deans_list'] = 'admin/AdminContent/load_deans_list';
$route['admin/manage/create_deans_list'] = 'admin/AdminContent/create_deans_list';
$route['admin/manage/delete_deans_list'] = 'admin/AdminContent/delete_deans_list';

// Admin Content Management - ALUMNI
$route['admin/manage/alumni/mentor_requests'] = 'admin/AdminContent/load_alumni_mentor_requests';
$route['admin/manage/alumni/mentor_status'] = 'admin/AdminContent/update_alumni_mentor_status';
$route['admin/manage/alumni/chatbot_inquiries'] = 'admin/AdminContent/load_alumni_chatbot_inquiries';
$route['admin/manage/alumni/connection_requests'] = 'admin/AdminContent/load_alumni_connection_requests';
$route['admin/manage/alumni/connection_status'] = 'admin/AdminContent/update_alumni_connection_status';
$route['admin/manage/alumni/updates'] = 'admin/AdminContent/load_alumni_updates';
$route['admin/manage/alumni/update_status'] = 'admin/AdminContent/update_alumni_update_status';
$route['admin/manage/alumni/giveback'] = 'admin/AdminContent/load_alumni_giveback';
$route['admin/manage/alumni/giveback_status'] = 'admin/AdminContent/update_alumni_giveback_status';
$route['admin/manage/alumni/featured'] = 'admin/AdminContent/load_alumni_featured';
$route['admin/manage/alumni/featured/create'] = 'admin/AdminContent/create_alumni_featured';
$route['admin/manage/alumni/featured/delete'] = 'admin/AdminContent/delete_alumni_featured';
$route['admin/manage/alumni/directory'] = 'admin/AdminContent/load_alumni_directory';
$route['admin/manage/alumni/directory/create'] = 'admin/AdminContent/create_alumni_directory';
$route['admin/manage/alumni/directory/delete'] = 'admin/AdminContent/delete_alumni_directory';
$route['admin/manage/alumni/stories'] = 'admin/AdminContent/load_alumni_stories';
$route['admin/manage/alumni/stories/create'] = 'admin/AdminContent/create_alumni_story';
$route['admin/manage/alumni/stories/delete'] = 'admin/AdminContent/delete_alumni_story';
$route['admin/manage/alumni/events'] = 'admin/AdminContent/load_alumni_events';
$route['admin/manage/alumni/events/create'] = 'admin/AdminContent/create_alumni_event';
$route['admin/manage/alumni/events/delete'] = 'admin/AdminContent/delete_alumni_event';

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
$route['admin/content/api_upload_curriculum'] = 'admin/AdminContent/api_upload_curriculum';
$route['admin/content/api_get_curriculums'] = 'admin/AdminContent/api_get_curriculums';
$route['admin/content/api_delete_curriculum'] = 'admin/AdminContent/api_delete_curriculum';

// Class Schedules Management API Endpoints
$route['admin/content/api_upload_schedule'] = 'admin/AdminContent/api_upload_schedule';
$route['admin/content/api_get_schedules'] = 'admin/AdminContent/api_get_schedules';
$route['admin/content/api_delete_schedule'] = 'admin/AdminContent/api_delete_schedule';

// Academic Calendars Management API Endpoints
$route['admin/content/api_upload_calendar'] = 'admin/AdminContent/api_upload_calendar';
$route['admin/content/api_get_calendars'] = 'admin/AdminContent/api_get_calendars';
$route['admin/content/api_delete_calendar'] = 'admin/AdminContent/api_delete_calendar';

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
