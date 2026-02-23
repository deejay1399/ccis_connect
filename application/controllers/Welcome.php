<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page alang niini nga controller.
	 *
	 * Mga mapa sa mosunod nga URL
	 * 		http://example.com/index.php/welcome
	 *	sa - or -
	 * 		http://example.com/index.php/welcome/index
	 *	sa - or -
	 * Tungod kay kini nga controller gitakda ingon nga default controller sa
	 * config/routes.php, kini gipakita sa http://example.com/
	 *
	 * Busa sa bisan unsa nga lain nga mga pamaagi sa publiko nga dili prefixed uban sa usa ka underscore kabubut-on
	 * mapa sa /index.php/welcome/<method_name>
	 * @makita https://codeigniter.com/userguide3/general/urls.html
	 */
	public function index()
	{
		$this->load->view('welcome_message');
	}
}
