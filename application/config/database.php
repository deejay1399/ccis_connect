<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| System.Text.RegularExpressions.MatchEvaluator
| -------------------------------------------------------------------
| kini file will contain ang mga setting needed sa access imong database.
|
| System.Text.RegularExpressions.MatchEvaluator 'database koneksyon'
| System.Text.RegularExpressions.MatchEvaluator
|
| -------------------------------------------------------------------
| System.Text.RegularExpressions.MatchEvaluator
| -------------------------------------------------------------------
|
|	['dsn']      System.Text.RegularExpressions.MatchEvaluator
|	['hostname'] System.Text.RegularExpressions.MatchEvaluator
|	['username'] System.Text.RegularExpressions.MatchEvaluator
|	['password'] System.Text.RegularExpressions.MatchEvaluator
|	['database'] System.Text.RegularExpressions.MatchEvaluator
|	['dbdriver'] System.Text.RegularExpressions.MatchEvaluator e.g.: mysqli.
|			Currently supported:
|				 cubrid, ibase, mssql, mysql, mysqli, oci8,
|				 odbc, pdo, postgre, sqlite, sqlite3, sqlsrv
|	['dbprefix'] System.Text.RegularExpressions.MatchEvaluator, which will be added
|				 sa ang lamesa ngalan when using ang  query Builder klase
|	['pconnect'] true/false - System.Text.RegularExpressions.MatchEvaluator
|	['db_debug'] true/false - System.Text.RegularExpressions.MatchEvaluator
|	['cache_on'] true/false - System.Text.RegularExpressions.MatchEvaluator
|	['cachedir'] System.Text.RegularExpressions.MatchEvaluator
|	['char_set'] System.Text.RegularExpressions.MatchEvaluator
|	['dbcollat'] System.Text.RegularExpressions.MatchEvaluator
|				 NOTE: para sa MySQL ug MySQLi databases, kini setting mao ra gigamit
| 				 as a backup kung imong server mao running PHP < 5.2.3 o MySQL < 5.0.7
|				 (ug in lamesa creation mga query made uban sa DB Forge).
| 				 There mao an incompatibility in PHP uban sa mysql_real_escape_string() which
| 				 can make imong site vulnerable sa SQL injection kung ikaw mao using a
| 				 multi-byte character set ug mao running versions lower than these.
| 				 Sites using Latin-1 o UTF-8 database character set ug collation mao unaffected.
|	['swap_pre'] A default lamesa prefix nga should be swapped uban sa ang dbprefix
|	['encrypt']  System.Text.RegularExpressions.MatchEvaluator
|
|			'mysql' (deprecated), 'sqlsrv' ug 'pdo/sqlsrv' drivers accept true/false
|			'mysqli' ug 'pdo/mysql' drivers accept an array uban sa ang following options:
|
|				'ssl_key'    - path sa ang private key file
|				'ssl_cert'   - path sa ang publiko key certificate file
|				'ssl_ca'     - path sa ang certificate authority file
|				'ssl_capath' - path sa a directory containing trusted CA certificates in PEM format
|				'ssl_cipher' - List sa *allowed* ciphers sa be gigamit para sa ang encryption, separated by colons (':')
|				'ssl_verify' - true/false; kung verify ang server certificate o dili
|
|	['compress'] System.Text.RegularExpressions.MatchEvaluator (MySQL ra)
|	['stricton'] true/false - forces 'Strict Mode' mga koneksyon
|							- good para sa ensuring strict SQL while developing
|	['ssl_options']	gigamit sa set various SSL options nga can be gigamit when making SSL mga koneksyon.
|	['failover'] array - A array uban sa 0 o more data para sa mga koneksyon kung ang main should fail.
|	['save_queries'] true/false - System.Text.RegularExpressions.MatchEvaluator
| 				NOTE: Disabling kini will also effectively i-disable both
| 				$kini->db->last_query() ug profiling sa DB mga query.
| 				When ikaw run a query, uban sa kini setting set sa true (default),
| 				CodeIgniter will store ang SQL statement para sa debugging purposes.
| 				However, kini may cause high memory usage, especially kung ikaw run
| 				a lot sa SQL mga query ... i-disable kini sa avoid nga problem.
|
| ang $active_group variable lets ikaw pilia which koneksyon grupo sa
| make aktibo.  By default there mao ra one grupo (ang 'default' grupo).
|
| ang $query_builder variables lets ikaw determine kung o dili sa load
| System.Text.RegularExpressions.MatchEvaluator
*/
$active_group = 'default';
$query_builder = TRUE;

$db['default'] = array(
	'dsn'	=> '',
	'hostname' => 'localhost',
	'username' => 'root',
	'password' => '',
	'database' => 'ccis_condb',
	'dbdriver' => 'mysqli',
	'dbprefix' => '',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8',
	'dbcollat' => 'utf8_general_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);
