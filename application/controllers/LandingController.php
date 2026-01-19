<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LandingController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function homepage()
	{
		$this->load->view('layouts/header');
        $this->load->view('layouts/navigation');
        $this->load->view('homepage');
        $this->load->view('layouts/footer');
	}

}
