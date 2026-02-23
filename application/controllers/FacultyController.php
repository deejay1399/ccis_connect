<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacultyController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->library('session');
	}

	/**
	 * Faculty Dashboard - Panguna nga dashboard alang sa mga ninggamit sa faculty
	 */
	public function dashboard()
	{
		require_role(2);

		$data['page_title'] = 'Dashboard';
		$data['page_type'] = 'faculty_dashboard';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/index', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function faculty()
	{
		restrict_public_for_admin_roles();
		$this->load->model('Faculty_users_model');

		// Panguna nga gigikanan: Pagdumala sa mga entry sa Faculty.
		$allFaculty = $this->Faculty_users_model->get_all_faculty();
		
		$data['page_type'] = 'faculty';
		$data['faculty_members'] = $allFaculty;
		$data['faculty_count'] = count($allFaculty);
		
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('pages/faculty', $data);
        $this->load->view('layouts/footer');
	}

}
