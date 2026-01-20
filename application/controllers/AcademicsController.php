<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AcademicsController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function index()
	{
		$data['page_type'] = 'academics';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/program_offerings');
		$this->load->view('layouts/footer');
	}

	public function programs()
	{
		$this->index();
	}

	public function curriculum()
	{
		$this->index();
	}

	public function schedule()
	{
		$this->index();
	}

	public function calendar()
	{
		$this->index();
	}
}
