<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FormsController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function index()
	{
		$data['page_type'] = 'forms';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/forms');
		$this->load->view('layouts/footer');
	}
}
