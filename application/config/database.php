<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'config/env_loader.php';

$active_group = ccis_env('DB_ACTIVE_GROUP', 'default');
$query_builder = true;

$db['default'] = array(
	'dsn'      => ccis_env('DB_DSN', ''),
	'hostname' => ccis_env('DB_HOST', '127.0.0.1'),
	'username' => ccis_env('DB_USER', 'root'),
	'password' => ccis_env('DB_PASS', ''),
	'database' => ccis_env('DB_NAME', 'ccis_condb'),
	'dbdriver' => ccis_env('DB_DRIVER', 'mysqli'),
	'dbprefix' => ccis_env('DB_PREFIX', ''),
	'pconnect' => false,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => false,
	'cachedir' => '',
	'char_set' => ccis_env('DB_CHARSET', 'utf8'),
	'dbcollat' => ccis_env('DB_COLLATION', 'utf8_general_ci'),
	'swap_pre' => '',
	'encrypt' => false,
	'compress' => false,
	'stricton' => false,
	'failover' => array(),
	'save_queries' => true,
);
