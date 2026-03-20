<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'config/env_loader.php';

if (!function_exists('ccis_local_test_mode')) {
	/**
	 * Enable guarded local fallbacks only when explicitly requested.
	 */
	function ccis_local_test_mode()
	{
		return ccis_env_bool('CCIS_LOCAL_TEST_MODE', false);
	}
}

if (!function_exists('ccis_db_available')) {
	/**
	 * Perform a lightweight connectivity check for local testing only.
	 */
	function ccis_db_available()
	{
		static $resolved = false;
		static $available = false;

		if ($resolved) {
			return $available;
		}

		$resolved = true;

		if (!ccis_local_test_mode()) {
			$available = true;
			return $available;
		}

		$driver = strtolower((string) ccis_env('DB_DRIVER', 'mysqli'));
		if ($driver !== 'mysqli' || !function_exists('mysqli_init')) {
			$available = false;
			return $available;
		}

		$host = (string) ccis_env('DB_HOST', '127.0.0.1');
		$user = (string) ccis_env('DB_USER', 'root');
		$pass = (string) ccis_env('DB_PASS', '');
		$name = (string) ccis_env('DB_NAME', '');
		$port = (int) ccis_env('DB_PORT', 3306);
		$socket = (string) ccis_env('DB_SOCKET', '');

		$link = @mysqli_init();
		if (!$link) {
			$available = false;
			return $available;
		}

		if (defined('MYSQLI_OPT_CONNECT_TIMEOUT')) {
			@mysqli_options($link, MYSQLI_OPT_CONNECT_TIMEOUT, 1);
		}

		$connected = @mysqli_real_connect(
			$link,
			$host,
			$user,
			$pass,
			$name !== '' ? $name : null,
			$port > 0 ? $port : 3306,
			$socket !== '' ? $socket : null
		);

		$available = (bool) $connected;
		if ($connected) {
			@mysqli_close($link);
		}

		return $available;
	}
}

if (!function_exists('ccis_should_use_local_fallback')) {
	/**
	 * True only for explicit local testing when the database is offline.
	 */
	function ccis_should_use_local_fallback()
	{
		return ccis_local_test_mode() && !ccis_db_available();
	}
}
