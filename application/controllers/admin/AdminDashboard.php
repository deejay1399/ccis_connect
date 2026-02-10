<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminDashboard extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		require_superadmin();
	}

	public function index()
	{
		$data['page_title'] = 'Dashboard';
		$data['page_type'] = 'admin_dashboard';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/index', $data);
		$this->load->view('superadmin/layouts/footer');
	}
}
?>
