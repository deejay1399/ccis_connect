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
	 * Ensure the forms table exists and has all required columns
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
			
			// Now update the created_at and updated_at columns to use CURRENT_TIMESTAMP
			$this->db->query("ALTER TABLE `forms` MODIFY `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
			$this->db->query("ALTER TABLE `forms` MODIFY `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
			
			log_message('error', 'Forms table created successfully');
		} else {
			// Table exists, check for missing columns
			$fields = $this->db->list_fields('forms');
			$missing_columns = array();
			
			// Check which columns are missing
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

		// Fallback to extension check for environments reporting unexpected MIME types.
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
	 * API: Get all forms
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
	 * API: Upload new form
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

			// Handle file upload
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

			// Validate file signature/MIME from the uploaded bytes.
			if (!$this->_is_allowed_document_file($file['tmp_name'], $file['name'])) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
				return;
			}

			// Validate file size
			if ($file['size'] > $max_size) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'File size exceeds 10MB limit']);
				return;
			}

			// Create upload directory if it doesn't exist
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

			// Generate unique filename
			$filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
			$file_path = $upload_dir . '/' . $filename;
			log_message('debug', 'File path: ' . $file_path);

			// Move uploaded file
			if (!move_uploaded_file($file['tmp_name'], $file_path)) {
				log_message('error', 'Failed to move uploaded file from ' . $file['tmp_name'] . ' to ' . $file_path);
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save file to: ' . $file_path]);
				return;
			}

			log_message('debug', 'File moved successfully');

			// Save to database
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
				// Delete the uploaded file if DB insert fails
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
	 * API: Update form
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

			// Handle file update if new file is provided
			if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
				$file = $_FILES['file'];
				$max_size = 10 * 1024 * 1024; // 10MB

				// Validate file signature/MIME from the uploaded bytes.
				if (!$this->_is_allowed_document_file($file['tmp_name'], $file['name'])) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, and DOCX files are allowed']);
					return;
				}

				// Validate file size
				if ($file['size'] > $max_size) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'File size exceeds 10MB limit']);
					return;
				}

				// Get old form to delete old file
				$old_form = $this->Forms_model->get_form_by_id($form_id);
				
				// Create upload directory if it doesn't exist
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

				// Generate unique filename
				$filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
				$file_path = $upload_dir . '/' . $filename;

				// Move uploaded file
				if (!move_uploaded_file($file['tmp_name'], $file_path)) {
					http_response_code(500);
					echo json_encode(['success' => false, 'message' => 'Failed to save file']);
					return;
				}

				// Delete old file if it exists
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
	 * API: Delete form
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

			// Get form to delete file
			$form = $this->Forms_model->get_form_by_id($form_id);
			
			if (!$form) {
				http_response_code(404);
				echo json_encode(['success' => false, 'message' => 'Form not found']);
				return;
			}

			// Delete file from uploads directory
			$upload_dir = dirname(__FILE__) . '/../../uploads/forms';
			$file_path = $upload_dir . '/' . basename($form['file_url']);
			
			if (file_exists($file_path)) {
				@unlink($file_path);
			}

			// Soft delete from database
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
	 * Public view to display all forms
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
