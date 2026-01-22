<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminContent extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		// Add authentication check here if needed
		// $this->load->library('session');
	}

	public function homepage()
	{
		$data['page_title'] = 'Manage Homepage';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'homepage';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_homepage', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function updates()
	{
		$data['page_title'] = 'Manage Updates';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'updates';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_updates', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function academics()
	{
		$data['page_title'] = 'Manage Academics';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'academics';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_academics', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function about()
	{
		$data['page_title'] = 'Manage About';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'about';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_about', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function faculty()
	{
		$data['page_title'] = 'Manage Faculty';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'faculty';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_faculty', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function forms()
	{
		$data['page_title'] = 'Manage Forms';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'forms';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_forms', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function organizations()
	{
		$data['page_title'] = 'Manage Organizations';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'organizations';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_organizations', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function alumni()
	{
		$data['page_title'] = 'Manage Alumni';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'alumni';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_alumni', $data);
		$this->load->view('superadmin/layouts/footer');
	}
}
?>
