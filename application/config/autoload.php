<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| AUTO-LOADER
| -------------------------------------------------------------------
| Gitino sa kini nga file kung unsang mga sistema ang kinahanglan nga ma-load pinaagi sa default.
|
| Aron sa pagpadayon sa gambalay nga ingon sa kahayag-timbang kutob sa mahimo lamang
| hingpit nga minimum nga mga kapanguhaan gikarga pinaagi sa default. pananglitan,
| ang database dili konektado sa awtomatikong tungod kay walay asumsyon
| mao ang gihimo mahitungod sa kon ikaw nagtinguha sa paggamit niini.  Kini nga file lets
| gihubit nimo sa tibuuk kalibutan kung unsang mga sistema ang gusto nimo nga ma-load sa matag
| offset
|
| -------------------------------------------------------------------
| Mga Panudlo.
| -------------------------------------------------------------------
|
| Kini ang mga butang nga mahimo nimo awtomatikong ma-load:
|
| 1.Ang mga pakete
| 2.Ang mga librarya
| 3.Mga drayber
| 4.Ang mga file sa katabang
| 5.Ang mga file sa custom config
| 6.Ang mga file sa sinultian
| 7. Mga Modelo
|
*/

/*
| -------------------------------------------------------------------
|  Mga Pakete sa Auto-load
| -------------------------------------------------------------------
| Prototype:
|
|  $autoload['packages'] = array(APPPATH.'third_party', '/usr/local/shared');
|
*/
$autoload['packages'] = array();

/*
| -------------------------------------------------------------------
|  Auto-load Mga Librarya
| -------------------------------------------------------------------
| Kini mao ang mga klase nga nahimutang sa sistema/librarya/ o sa imong
| application/libraries/ directory, uban sa pagdugang sa sa
| 'database' librarya, nga mao ang usa ka gamay sa usa ka espesyal nga kaso.
|
| Prototype:
|
|	$autoload['libraries'] = array('database', 'email', 'sesyon');
|
| Mahimo ka usab maghatag usa ka alternatibo nga ngalan sa librarya nga itudlo
| sa Controller:
|
|	$autoload['libraries'] = array('user_agent' => 'ua');
*/
$autoload['libraries'] = array('session');

/*
| -------------------------------------------------------------------
|  Mga Driver sa Auto-load
| -------------------------------------------------------------------
| Kini nga mga klase nahimutang sa sistema/mga librarya/sa imong
| application/libraries/ directory, but are also placed inside their
| own subdirectory and they extend the CI_Driver_Library class. They
| offer multiple interchangeable driver options.
|
| Prototype:
|
|	$autoload['drivers'] = array('cache');
|
| You can also supply an alternative property name to be assigned in
| the controller:
|
|	$autoload['drivers'] = array('cache' => 'cch');
|
*/
$autoload['drivers'] = array();

/*
| -------------------------------------------------------------------
|  Auto-load Helper Files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['helper'] = array('url', 'file');
*/
$autoload['helper'] = array();

/*
| -------------------------------------------------------------------
|  Auto-load Config files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['config'] = array('config1', 'config2');
|
| NOTE: This item is intended for use ONLY if you have created custom
| config files.  Otherwise, leave it blank.
|
*/
$autoload['config'] = array();

/*
| -------------------------------------------------------------------
|  Auto-load Language files
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['language'] = array('lang1', 'lang2');
|
| NOTE: Do not include the "_lang" part of your file.  For example
| "codeigniter_lang.php" would be referenced as array('codeigniter');
|
*/
$autoload['language'] = array();

/*
| -------------------------------------------------------------------
|  Auto-load Models
| -------------------------------------------------------------------
| Prototype:
|
|	$autoload['model'] = array('first_model', 'second_model');
|
| You can also supply an alternative model name to be assigned
| sa Controller:
|
|	$autoload['model'] = array('first_model' => 'first');
*/
$autoload['model'] = array();
