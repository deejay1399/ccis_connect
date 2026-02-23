<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FormsController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('auth');
		$this->load->model('Forms_model');
		$this->_ensure_table_exists();
		restrict_public_for_admin_roles();
	}

	/**
	 * Siguruha nga ang lamesa sa mga porma anaa ug adunay tanan nga gikinahanglan nga mga kolum
	 */
	private function _ensure_table_exists()
	{
		$this->load->dbforge();
		
		if (!$this->db->table_exists('forms')) {
			log_message('error', 'Forms table does not exist, creating it...');
			
			$this->dbforge->add_field(array(
				'id' => array('type' => 'INT', 'constraint' => 11, 'auto_increment' => TRUE),
				'title' => array('type' => 'VARCHAR', 'constraint' => 255, 'null' => FALSE),
				'file_url' => array('type' => 'VARCHAR', 'constraint' => 255, 'null' => FALSE),
				'original_filename' => array('type' => 'VARCHAR', 'constraint' => 255, 'null' => FALSE),
				'file_size' => array('type' => 'INT', 'null' => TRUE),
				'is_active' => array('type' => 'TINYINT', 'constraint' => 1, 'default' => 1),
				'created_at' => array('type' => 'TIMESTAMP', 'null' => TRUE, 'default' => NULL),
				'updated_at' => array('type' => 'TIMESTAMP', 'null' => TRUE, 'default' => NULL)
			));
			$this->dbforge->add_key('id', TRUE);
			$this->dbforge->create_table('forms', TRUE);
			
			// Karon i-update ang gilalang_at ug gi-update_sa mga haligi aron magamit ang karon_TIMESTAMP
			$this->db->query("ALTER TABLE `forms` MODIFY `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
			$this->db->query("ALTER TABLE `forms` MODIFY `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
			
			log_message('error', 'Forms table created successfully');
		} else {
			// Naglungtad ang lamesa, susihon ang nawala nga mga kolum
			$fields = $this->db->list_fields('forms');
			$missing_columns = array();
			
			// Susihon kung unsang mga haligi ang nawala
			if (!in_array('original_filename', $fields)) {
				$this->dbforge->add_column('forms', array('original_filename' => array('type' => 'VARCHAR', 'constraint' => 255, 'null' => FALSE, 'after' => 'file_url')));
				log_message('error', 'Added missing column to forms table: original_filename');
			}
			if (!in_array('file_size', $fields)) {
				$this->dbforge->add_column('forms', array('file_size' => array('type' => 'INT', 'null' => TRUE, 'after' => 'original_filename')));
				log_message('error', 'Added missing column to forms table: file_size');
			}
			if (!in_array('updated_at', $fields)) {
				$this->db->query("ALTER TABLE `forms` ADD `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER `created_at`");
				log_message('error', 'Added missing column to forms table: updated_at');
			}
		}
	}

	private function _require_superadmin_json()
	{
		$roleId = (int) $this->session->userdata('role_id');
		if (!$this->session->userdata('logged_in') || !in_array($roleId, [1, 2], true)) {
			http_response_code(403);
			echo json_encode(['success' => false, 'message' => 'Forbidden']);
			return false;
		}

		return true;
	}

	private function _is_allowed_document_file($tmpPath, $originalName = '')
	{
		if (empty($tmpPath) || !is_file($tmpPath)) {
			return false;
		}

		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		if (!$finfo) {
			return false;
		}

		$mime = (string) finfo_file($finfo, $tmpPath);
		finfo_close($finfo);

		$allowedMimes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-word',
			'application/octet-stream'
		];

		if (in_array($mime, $allowedMimes, true)) {
			return true;
		}

		// Fallback sa extension check alang sa mga palibot nga nagtaho sa wala damha nga mga tipo sa MIME.
		$ext = strtolower(pathinfo((string) $originalName, PATHINFO_EXTENSION));
		return in_array($ext, ['pdf', 'doc', 'docx'], true);
	}

	public function index()
	{
		$data['page_type'] = 'forms';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/forms');
		$this->load->view('layouts/footer');
	}

	/**
	 * API: Kuhaa ang tanan nga mga porma
	 */
	public function get_forms()
	{
		header('Content-Type: application/json');
		
		try {
			$forms = $this->Forms_model->get_all_forms();
			echo json_encode([
				'success' => true,
				'data' => $forms,
				'count' => count($forms)
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving forms: ' . $e->getMessage()
			]);
		}
	}

	/**
	 * API: Pag-upload sa bag-ong porma
	 */
	public function upload_form()
	{
		header('Content-Type: application/json');
		if (!$this->_require_superadmin_json()) {
			return;
		}
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$title = $this->input->post('title');
			log_message('debug', 'Form upload attempt - Title: ' . $title);
			
			if (empty($title)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Form title is required']);
				return;
			}

			// Hupti ang pag-upload sa file
			if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
				$error_code = isset($_FILES['file']) ? $_FILES['file']['error'] : 'No file provided';
				log_message('debug', 'File upload error: ' . $error_code);
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'File upload failed: ' . $error_code]);
				return;
			}

			$file = $_FILES['file'];
			$max_size = 10 * 1024 * 1024; // 10MB

			log_message('debug', 'File details - Name: ' . $file['name'] . ', Type: ' . $file['type'] . ', Size: ' . $file['size']);

			// I-validate ang pirma sa file/MIME gikan sa gi-upload nga mga byte.
			if (!$this->_is_allowed_document_file($file['tmp_name'], $file['name'])) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
				return;
			}

			// I-validate ang gidak-on sa file
			if ($file['size'] > $max_size) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'File size exceeds 10MB limit']);
				return;
			}

			// Paghimo usa ka direktoryo sa pag-upload kung wala kini
			$upload_dir = dirname(__FILE__) . '/../../uploads/forms';
			log_message('debug', 'Upload directory: ' . $upload_dir);
			
			if (!is_dir($upload_dir)) {
				if (!@mkdir($upload_dir, 0755, true)) {
					log_message('error', 'Failed to create directory: ' . $upload_dir);
					http_response_code(500);
					echo json_encode(['success' => false, 'message' => 'Failed to create upload directory: ' . $upload_dir]);
					return;
				}
			}

			// Paghimo talagsaon nga filename
			$filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
			$file_path = $upload_dir . '/' . $filename;
			log_message('debug', 'File path: ' . $file_path);

			// Pagbalhin sa gi-upload nga file
			if (!move_uploaded_file($file['tmp_name'], $file_path)) {
				log_message('error', 'Failed to move uploaded file from ' . $file['tmp_name'] . ' to ' . $file_path);
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save file to: ' . $file_path]);
				return;
			}

			log_message('debug', 'File moved successfully');

			// I-save sa database
			$form_data = array(
				'title' => $title,
				'file_url' => 'uploads/forms/' . $filename,
				'original_filename' => $file['name'],
				'file_size' => $file['size']
			);

			log_message('debug', 'Inserting into database: ' . json_encode($form_data));
			$form_id = $this->Forms_model->insert_form($form_data);
			log_message('debug', 'Insert result: ' . ($form_id ? 'Success (ID: ' . $form_id . ')' : 'Failed'));

			if ($form_id) {
				echo json_encode([
					'success' => true,
					'message' => 'Form uploaded successfully',
					'form_id' => $form_id,
					'file_url' => $form_data['file_url']
				]);
			} else {
				// I-delete ang gi-upload nga file kung napakyas ang pagsulud sa DB
				@unlink($file_path);
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save form to database']);
			}

		} catch (Exception $e) {
			log_message('error', 'Exception in upload_form: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error uploading form: ' . $e->getMessage(),
				'error_file' => $e->getFile(),
				'error_line' => $e->getLine()
			]);
		}
	}

	/**
	 * API: Porma sa pag-update
	 */
	public function update_form()
	{
		header('Content-Type: application/json');
		if (!$this->_require_superadmin_json()) {
			return;
		}
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$form_id = $this->input->post('form_id');
			$title = $this->input->post('title');

			if (empty($form_id) || empty($title)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Form ID and title are required']);
				return;
			}

			$update_data = array('title' => $title);

			// Pagdumala sa pag-update sa file kung gihatag ang bag-ong file
			if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
				$file = $_FILES['file'];
				$max_size = 10 * 1024 * 1024; // 10MB

				// I-validate ang pirma sa file/MIME gikan sa gi-upload nga mga byte.
				if (!$this->_is_allowed_document_file($file['tmp_name'], $file['name'])) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
					return;
				}

				// I-validate ang gidak-on sa file
				if ($file['size'] > $max_size) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'File size exceeds 10MB limit']);
					return;
				}

				// Pagkuha daan nga porma aron mapapas ang daan nga file
				$old_form = $this->Forms_model->get_form_by_id($form_id);
				
				// Paghimo usa ka direktoryo sa pag-upload kung wala kini
				$upload_dir = realpath(dirname(__FILE__) . '/../../uploads/forms');
				if (!$upload_dir) {
					$upload_dir = dirname(__FILE__) . '/../../uploads/forms';
				}
				
				if (!is_dir($upload_dir)) {
					if (!@mkdir($upload_dir, 0755, true)) {
						http_response_code(500);
						echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
						return;
					}
				}

				// Paghimo talagsaon nga filename
				$filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
				$file_path = $upload_dir . '/' . $filename;

				// Pagbalhin sa gi-upload nga file
				if (!move_uploaded_file($file['tmp_name'], $file_path)) {
					http_response_code(500);
					echo json_encode(['success' => false, 'message' => 'Failed to save file']);
					return;
				}

				// I-delete ang daan nga file kung adunay kini
				if ($old_form && file_exists($upload_dir . '/' . basename($old_form['file_url']))) {
					@unlink($upload_dir . '/' . basename($old_form['file_url']));
				}

				$update_data['file_url'] = 'uploads/forms/' . $filename;
				$update_data['original_filename'] = $file['name'];
				$update_data['file_size'] = $file['size'];
			}

			$this->Forms_model->update_form($form_id, $update_data);

			echo json_encode([
				'success' => true,
				'message' => 'Form updated successfully'
			]);

		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error updating form: ' . $e->getMessage()
			]);
			log_message('error', 'Form update error: ' . $e->getMessage());
		}
	}

	/**
	 * API: I-delete ang porma
	 */
	public function delete_form()
	{
		header('Content-Type: application/json');
		if (!$this->_require_superadmin_json()) {
			return;
		}
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			return;
		}

		try {
			$form_id = $this->input->post('form_id');

			if (empty($form_id)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Form ID is required']);
				return;
			}

			// Get porma sa pagtangtang file
			$form = $this->Forms_model->get_form_by_id($form_id);
			
			if (!$form) {
				http_response_code(404);
				echo json_encode(['success' => false, 'message' => 'Form not found']);
				return;
			}

			// I-delete ang file gikan sa direktoryo sa mga upload
			$upload_dir = dirname(__FILE__) . '/../../uploads/forms';
			$file_path = $upload_dir . '/' . basename($form['file_url']);
			
			if (file_exists($file_path)) {
				@unlink($file_path);
			}

			// Soft delete gikan sa database
			$this->Forms_model->delete_form($form_id);

			echo json_encode([
				'success' => true,
				'message' => 'Form deleted successfully'
			]);

	} catch (Exception $e) {
		http_response_code(500);
		echo json_encode([
			'success' => false,
			'message' => 'Error deleting form: ' . $e->getMessage()
		]);
		log_message('error', 'Form delete error: ' . $e->getMessage());
	}
}

	/**
	 * Public panglantaw sa pagpakita sa tanan nga mga porma
	 */
	public function view_forms()
	{
		$data['forms'] = $this->Forms_model->get_all_forms();
		$data['page_title'] = 'Forms';
		$data['page_type'] = 'forms';
		$data['content_type'] = 'forms';
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/forms', $data);
		$this->load->view('layouts/footer', $data);
	}
}
