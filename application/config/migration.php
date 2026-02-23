<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| i-enable/i-disable Migrations
|--------------------------------------------------------------------------
|
| Migrations mao disabled by default para sa security reasons.
| ikaw should i-enable migrations whenever ikaw intend sa do a schema migration
| ug i-disable it back when ikaw're done.
|
*/
$config['migration_enabled'] = TRUE;

/*
|--------------------------------------------------------------------------
| Migration Type
|--------------------------------------------------------------------------
|
| Migration file names may be based on a sequential identifier o on
| a timestamp. Options mao:
|
|   'sequential' = Sequential migration naming (001_add_blog.php)
|   'timestamp'  = Timestamp migration naming (20121031104401_add_blog.php)
|                  Use timestamp format YYYYMMDDHHIISS.
|
| Note: kung kini configuration value mao missing ang Migration library
|       defaults sa 'sequential' para sa backward compatibility uban sa CI2.
|
*/
$config['migration_type'] = 'timestamp';

/*
|--------------------------------------------------------------------------
| Migrations lamesa
|--------------------------------------------------------------------------
|
| kini mao ang ngalan sa ang lamesa nga will store ang current migrations state.
| When migrations runs it will store in a database lamesa which migration
| level ang system mao at. It then compares ang migration level in kini
| lamesa sa ang $config['migration_version'] kung they mao dili ang same it
| will migrate up. kini must be set.
|
*/
$config['migration_table'] = 'migrations';

/*
|--------------------------------------------------------------------------
| Auto Migrate sa Latest
|--------------------------------------------------------------------------
|
| kung kini mao set sa true when ikaw load ang migrations klase ug have
| $config['migration_enabled'] set sa true ang system will auto migrate
| sa imong latest migration (whatever $config['migration_version'] mao
| set sa). kini way ikaw do dili have sa call migrations anywhere else
| in imong code sa have ang latest migration.
|
*/
$config['migration_auto_latest'] = FALSE;

/*
|--------------------------------------------------------------------------
| Migrations version
|--------------------------------------------------------------------------
|
| kini mao gigamit sa set migration version nga ang file system should be on.
| kung ikaw run $kini->migration->current() kini mao ang version nga schema will
| be upgraded / downgraded sa.
|
*/
$config['migration_version'] = 0;

/*
|--------------------------------------------------------------------------
| Migrations Path
|--------------------------------------------------------------------------
|
| path sa imong migrations folder.
| Typically, it will be within imong application path.
| Also, writing permission mao required within ang migrations path.
|
*/
$config['migration_path'] = APPPATH.'migrations/';
