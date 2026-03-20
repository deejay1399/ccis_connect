<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LandingController extends CI_Controller {

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
			$this->load->model('Programs_model');
		}
		restrict_public_for_admin_roles();
	}

	public function homepage()
	{
		$data['page_type'] = 'homepage';
		$data['homepage_records'] = array();
		$data['programs'] = array();
		
		if (!$this->use_local_fallback) {
			// I-load ang datos sa homepage gikan sa database
			try {
				$this->load->model('Homepage_model');
				$homepage_data = $this->Homepage_model->get_all();
				$data['homepage_records'] = $homepage_data;
			} catch (Exception $e) {
				log_message('error', 'Homepage error: ' . $e->getMessage());
				$data['homepage_records'] = array();
			}
			
			// I-load ang mga programa gikan sa database
			$data['programs'] = $this->Programs_model->get_all_programs();
		}
		
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('homepage', $data);
        $this->load->view('layouts/footer');
	}

}
