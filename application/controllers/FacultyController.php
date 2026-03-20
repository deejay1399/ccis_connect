<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacultyController extends CI_Controller {

	private $use_local_fallback = false;

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->helper('local_test');
		$this->load->library('session');
		$this->use_local_fallback = ccis_should_use_local_fallback();
	}

	/**
	 * Faculty Dashboard - Panguna nga dashboard alang sa mga ninggamit sa faculty
	 */
	public function dashboard()
	{
		require_login();
		redirect_by_role((int) $this->session->userdata('role_id'));
	}

	public function faculty()
	{
		restrict_public_for_admin_roles();
		$allFaculty = array();
		if (!$this->use_local_fallback) {
			$this->load->model('Faculty_users_model');

			// Panguna nga gigikanan: Pagdumala sa mga entry sa Faculty.
			$allFaculty = $this->Faculty_users_model->get_all_faculty();
		}
		
		$data['page_type'] = 'faculty';
		$data['faculty_members'] = $allFaculty;
		$data['faculty_count'] = count($allFaculty);
		
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('pages/faculty', $data);
        $this->load->view('layouts/footer');
	}

}
