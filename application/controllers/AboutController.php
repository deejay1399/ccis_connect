<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AboutController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		restrict_public_for_admin_roles();
	}

	public function index()
	{
		$data['page_type'] = 'about';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/about');
		$this->load->view('layouts/footer');
	}
}
