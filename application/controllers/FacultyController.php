<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacultyController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
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
		restrict_public_for_admin_roles();
		$this->load->model('Faculty_users_model');
		
		// Get all faculty members from database
		$allFaculty = $this->Faculty_users_model->get_all_faculty();
		
		// Sort: Deans first, then alphabetically by name
		usort($allFaculty, function($a, $b) {
			// Check if position contains "Dean"
			$aIsDean = stripos($a['position'], 'dean') !== false ? 1 : 0;
			$bIsDean = stripos($b['position'], 'dean') !== false ? 1 : 0;
			
			// If both are deans or both are not, sort alphabetically
			if ($aIsDean === $bIsDean) {
				return strcmp($a['firstname'] . ' ' . $a['lastname'], $b['firstname'] . ' ' . $b['lastname']);
			}
			
			// Deans come first
			return $bIsDean - $aIsDean;
		});
		
		$data['page_type'] = 'faculty';
		$data['faculty_members'] = $allFaculty;
		$data['faculty_count'] = count($allFaculty);
		
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('pages/faculty', $data);
        $this->load->view('layouts/footer');
	}

}
