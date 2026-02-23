<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('ccis_env')) {
	/**
	 * Resolve environment variables with this precedence:
	 * 1) Server/OS environment
	 * 2) Project .env file in FCPATH
	 * 3) Provided default value
	 *
	 * .env format:
	 * KEY=value
	 * QUOTED_KEY="value with spaces"
	 */
	function ccis_env($key, $default = null)
	{
		static $loaded = false;
		static $envMap = array();

		if (!$loaded) {
			$loaded = true;
			$envPath = defined('FCPATH') ? FCPATH . '.env' : null;

			if ($envPath && is_file($envPath) && is_readable($envPath)) {
				$lines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
				if (is_array($lines)) {
					foreach ($lines as $line) {
						$line = trim($line);
						if ($line === '' || strpos($line, '#') === 0) {
							continue;
						}

						$parts = explode('=', $line, 2);
						if (count($parts) !== 2) {
							continue;
						}

						$name = trim($parts[0]);
						$value = trim($parts[1]);
						if ($name === '') {
							continue;
						}

						$isQuoted = strlen($value) >= 2 && (
							($value[0] === '"' && substr($value, -1) === '"') ||
							($value[0] === "'" && substr($value, -1) === "'")
						);
						if ($isQuoted) {
							$value = substr($value, 1, -1);
						}

						$envMap[$name] = $value;
					}
				}
			}
		}

		$value = getenv($key);
		if ($value !== false && $value !== '') {
			return $value;
		}

		if (array_key_exists($key, $envMap)) {
			return $envMap[$key];
		}

		return $default;
	}
}

if (!function_exists('ccis_env_bool')) {
	/**
	 * Parse a boolean-like env value.
	 */
	function ccis_env_bool($key, $default = false)
	{
		$value = ccis_env($key, null);
		if ($value === null) {
			return (bool) $default;
		}

		$normalized = strtolower(trim((string) $value));
		if (in_array($normalized, array('1', 'true', 'yes', 'on'), true)) {
			return true;
		}
		if (in_array($normalized, array('0', 'false', 'no', 'off', ''), true)) {
			return false;
		}

		return (bool) $default;
	}
}
