<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UpdatesController extends CI_Controller {

	private $use_local_fallback = false;

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->helper('local_test');
		$this->use_local_fallback = ccis_should_use_local_fallback();
		restrict_public_for_admin_roles();
	}

	public function index()
	{
		$data['page_type'] = 'updates';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/updates');
		$this->load->view('layouts/footer');
	}

	public function announcements()
	{
		$this->index();
	}

	public function events()
	{
		$this->index();
	}

	public function deanslist()
	{
		$this->index();
	}

	// ==================== PUBLIC JSON API (gisuportahan sa DB) ====================

	public function api_announcements()
	{
		header('Content-Type: application/json');
		if ($this->use_local_fallback) {
			echo json_encode(['success' => true, 'data' => []]);
			exit;
		}
		$this->load->model('Announcements_model');

		try {
			$data = $this->Announcements_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function api_events_achievements()
	{
		header('Content-Type: application/json');
		if ($this->use_local_fallback) {
			echo json_encode(['success' => true, 'data' => []]);
			exit;
		}
		$this->load->model('Events_achievements_model');

		try {
			$data = $this->Events_achievements_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function api_deans_list()
	{
		header('Content-Type: application/json');
		if ($this->use_local_fallback) {
			echo json_encode(['success' => true, 'data' => []]);
			exit;
		}
		$this->load->model('Deans_list_model');

		try {
			$data = $this->Deans_list_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}
}
