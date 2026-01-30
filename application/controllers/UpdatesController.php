<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UpdatesController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
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

	// ==================== PUBLIC JSON API (DB-backed) ====================

	public function api_announcements()
	{
		header('Content-Type: application/json');
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
