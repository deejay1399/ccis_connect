<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UpdatesController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function index()
	{
		$data['page_type'] = 'updates';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/updates');
		$this->load->view('layouts/footer');
	}

	public function announcements()
	{
		$this->index();
	}

	public function events()
	{
		$this->index();
	}

	public function deanslist()
	{
		$this->index();
	}
}
