<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LoginController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function index()
	{
		$data['page_type'] = 'login';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/login');
		$this->load->view('layouts/footer');
	}
}
