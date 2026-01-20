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

// ==================== ACADEMICS ====================
$route['academics'] = 'AcademicsController/index';
$route['academics/programs'] = 'AcademicsController/programs';
$route['academics/curriculum'] = 'AcademicsController/curriculum';
$route['academics/schedule'] = 'AcademicsController/schedule';
$route['academics/calendar'] = 'AcademicsController/calendar';

// ==================== UPDATES ====================
$route['updates'] = 'UpdatesController/index';
$route['updates/announcements'] = 'UpdatesController/announcements';
$route['updates/events'] = 'UpdatesController/events';
$route['updates/deanslist'] = 'UpdatesController/deanslist';

// ==================== FORMS ====================
$route['forms'] = 'FormsController/index';

// ==================== LOGIN ====================
$route['login'] = 'LoginController/index';

// ==================== ALUMNI ====================
$route['alumni'] = 'AlumniController/index';

// ==================== ORGANIZATION ====================
$route['organization'] = 'OrganizationController/index';
$route['organization/legion'] = 'OrganizationController/legion';
$route['organization/csguild'] = 'OrganizationController/csguild';
