<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LandingController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->model('Programs_model');
		restrict_public_for_admin_roles();
	}

	public function homepage()
	{
		$data['page_type'] = 'homepage';
		
		// Load homepage data from database
		try {
			$this->load->model('Homepage_model');
			$homepage_data = $this->Homepage_model->get_all();
			$data['homepage_records'] = $homepage_data;
		} catch (Exception $e) {
			log_message('error', 'Homepage error: ' . $e->getMessage());
			$data['homepage_records'] = array();
		}
		
		// Load programs from database
		$data['programs'] = $this->Programs_model->get_all_programs();
		
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('homepage', $data);
        $this->load->view('layouts/footer');
	}

}
