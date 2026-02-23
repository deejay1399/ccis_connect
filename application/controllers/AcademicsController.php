<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AcademicsController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->model('Programs_model');
		$this->load->model('Curriculum_model');
		restrict_public_for_admin_roles();
	}

	public function index()
	{
		$data['page_type'] = 'academics';
		$data['programs'] = $this->Programs_model->get_all_programs();
		$data['curricula'] = $this->Curriculum_model->get_all();
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/program_offerings', $data);
		$this->load->view('layouts/footer');
	}

	public function programs()
	{
		$this->index();
	}

	public function curriculum()
	{
		$this->index();
	}

	public function schedule()
	{
		$this->index();
	}

	public function calendar()
	{
		$this->index();
	}

	/**
	 * API endpoint sa pagbalik sa mga programa sama sa JSON
	 */
	public function get_programs_json()
	{
		header('Content-Type: application/json');
		$programs = $this->Programs_model->get_all_programs();
		
		// Pagbag-o sa datos sa database aron magkatugma sa format sa JavaScript
		$formatted_programs = array();
		foreach ($programs as $program) {
			// Pag-parse sa mga oportunidad sa karera ngadto sa han-ay
			$careers = array();
			if (!empty($program['career_opportunities'])) {
				$careers = array_map('trim', explode(',', $program['career_opportunities']));
			}
			
			// Tinoa ang icon nga gibase sa ngalan sa programa
			$icon = 'fas fa-graduation-cap';
			if (stripos($program['program_name'], 'BSCS') !== false || stripos($program['program_name'], 'Computer Science') !== false) {
				$icon = 'fas fa-laptop-code';
			} elseif (stripos($program['program_name'], 'BSIT') !== false || stripos($program['program_name'], 'Information Technology') !== false) {
				$icon = 'fas fa-network-wired';
			}
			
			$formatted_programs[] = array(
				'id' => $program['program_id'],
				'name' => $program['program_name'],
				'icon' => $icon,
				'description' => $program['description'],
				'courses' => $careers,
				'isDefault' => false,
				'visible' => true,
				'duration' => $program['duration_years']
			);
		}
		
		echo json_encode($formatted_programs);
	}
}
