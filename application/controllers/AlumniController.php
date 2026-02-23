<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AlumniController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->model('Alumni_model');
		restrict_public_for_admin_roles();
	}

	public function index()
	{
		$data['page_type'] = 'alumni';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/alumni');
		$this->load->view('layouts/footer');
	}

	// ==================== Pampublikong API ====================

	public function api_featured()
	{
		header('Content-Type: application/json');
		try {
			$data = $this->Alumni_model->get_all_featured();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function api_directory()
	{
		header('Content-Type: application/json');
		try {
			$data = $this->Alumni_model->get_all_directory();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function api_stories()
	{
		header('Content-Type: application/json');
		try {
			$data = $this->Alumni_model->get_all_stories();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function api_events()
	{
		header('Content-Type: application/json');
		try {
			$data = $this->Alumni_model->get_all_events();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function submit_update()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$name = trim((string) $this->input->post('name'));
			$email = trim((string) $this->input->post('email'));
			$batch = trim((string) $this->input->post('batch'));
			$program = trim((string) $this->input->post('program'));
			$position = trim((string) $this->input->post('position'));
			$company = trim((string) $this->input->post('company'));
			$achievements = trim((string) $this->input->post('achievements'));
			$mentor = $this->input->post('mentor') ? 1 : 0;
			$speaker = $this->input->post('speaker') ? 1 : 0;
			$internship = $this->input->post('internship') ? 1 : 0;
			$donation = $this->input->post('donation') ? 1 : 0;

			if ($name === '' || $email === '' || $batch === '' || $program === '' || $position === '' || $company === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Please complete all required fields']);
				return;
			}

			$photo = null;
			if (!empty($_FILES['photo']['name'])) {
				$photo = $this->_upload_public_image('updates', 'photo');
				if ($photo === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload photo']);
					return;
				}
			}

			$payload = [
				'author' => $name,
				'email' => $email,
				'batch' => $batch,
				'program' => $program,
				'position' => $position,
				'company' => $company,
				'content' => $achievements,
				'giveback_mentor' => $mentor,
				'giveback_speaker' => $speaker,
				'giveback_internship' => $internship,
				'giveback_donation' => $donation,
				'update_date' => date('Y-m-d'),
				'status' => 'pending'
			];
			if ($photo) {
				$payload['photo'] = $photo;
			}

			$id = $this->Alumni_model->insert_update($payload);

			// Kung gisusi ang checkbox sa mentor, idugang ang hangyo sa mentor
			if ($mentor) {
				$this->Alumni_model->insert_mentor_request([
					'name' => $name,
					'email' => $email,
					'expertise' => $position,
					'status' => 'pending'
				]);
			}

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function submit_giveback()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$type = trim((string) $this->input->post('type'));
			$name = trim((string) $this->input->post('name'));
			$email = trim((string) $this->input->post('email'));
			$batch = trim((string) $this->input->post('batch'));
			$details = trim((string) $this->input->post('details'));

			if ($type === '' || $name === '' || $email === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Type, name, and email are required']);
				return;
			}

			$id = $this->Alumni_model->insert_giveback([
				'author' => $name,
				'email' => $email,
				'batch' => $batch,
				'title' => $type,
				'description' => $details,
				'submission_date' => date('Y-m-d'),
				'status' => 'pending'
			]);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	public function submit_connection()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$alumni_name = trim((string) $this->input->post('alumni_name'));
			$user_name = trim((string) $this->input->post('user_name'));
			$user_email = trim((string) $this->input->post('user_email'));
			$purpose = trim((string) $this->input->post('purpose'));
			$message = trim((string) $this->input->post('message'));
			$batch = trim((string) $this->input->post('batch'));

			if ($alumni_name === '' || $user_name === '' || $user_email === '' || $message === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Please complete all required fields']);
				return;
			}

			$id = $this->Alumni_model->insert_connection_request([
				'from_name' => $user_name,
				'from_email' => $user_email,
				'to_name' => $alumni_name,
				'purpose' => $purpose,
				'message' => $message,
				'batch' => $batch,
				'request_date' => date('Y-m-d'),
				'status' => 'pending'
			]);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
	}

	private function _upload_public_image($folder, $input_name)
	{
		$upload_dir = FCPATH . 'uploads/alumni/' . $folder;
		if (!is_dir($upload_dir)) {
			if (!@mkdir($upload_dir, 0755, true)) {
				return false;
			}
		}

		$config = [
			'upload_path' => $upload_dir . '/',
			'allowed_types' => 'gif|jpg|png|jpeg|jpe',
			'max_size' => 5120,
			'file_name' => $folder . '_' . time() . '_' . uniqid(),
			'overwrite' => false,
			'encrypt_name' => false
		];

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload($input_name)) {
			log_message('error', 'Alumni upload error: ' . $this->upload->display_errors('', ''));
			return false;
		}

		$upload_data = $this->upload->data();
		return 'uploads/alumni/' . $folder . '/' . $upload_data['file_name'];
	}
}
