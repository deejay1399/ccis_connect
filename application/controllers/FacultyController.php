<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacultyController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->library('session');
		// Add authentication check here if needed
		// $this->load->helper('auth');
	}

	/**
	 * Faculty Dashboard - Main dashboard for faculty users
	 */
	public function dashboard()
	{
		$data['page_title'] = 'Dashboard';
		$data['page_type'] = 'faculty_dashboard';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/index', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function faculty()
	{
		$data['page_type'] = 'faculty';
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('pages/faculty');
        $this->load->view('layouts/footer');
	}

}
