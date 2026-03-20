<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AboutController extends CI_Controller {

	private $use_local_fallback = false;

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->helper('rich_text');
		$this->load->helper('local_test');
		$this->use_local_fallback = ccis_should_use_local_fallback();
		if (!$this->use_local_fallback) {
			$this->load->model('About_content_model');
		}
		restrict_public_for_admin_roles();
	}

	public function index()
	{
		$data['page_type'] = 'about';
		$data['about_content'] = $this->use_local_fallback ? array() : $this->About_content_model->get_content();
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/about', $data);
		$this->load->view('layouts/footer');
	}
}
