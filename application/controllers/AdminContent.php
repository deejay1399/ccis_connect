<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminContent extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('Faculty_users_model');
		$this->load->helper('url');
		
		// Skip session check for API endpoints
		$current_method = $this->router->fetch_method();
		if (strpos($current_method, 'api_') === 0) {
			return; // Allow API endpoints without session check
		}
		
		// Check if user is logged in and is superadmin
		if (!$this->session->userdata('logged_in') || $this->session->userdata('role') !== 'superadmin') {
			redirect('login');
		}
	}

	// Faculty Management

	public function manage_faculty() {
		$data = array(
			'content_type' => 'faculty'
		);
		$this->load->view('superadmin/pages/manage_faculty', $data);
	}

	// API Endpoints for AJAX

	public function api_get_faculty() {
		header('Content-Type: application/json');
		
		try {
			$faculty = $this->Faculty_users_model->get_all_faculty();
			echo json_encode(array(
				'success' => true,
				'data' => $faculty,
				'message' => 'Faculty data retrieved successfully'
			));
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(array(
				'success' => false,
				'message' => 'Error retrieving faculty data: ' . $e->getMessage()
			));
		}
	}

	public function api_add_faculty() {
		header('Content-Type: application/json');
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
			return;
		}

		try {
			$input = json_decode($this->input->raw_input_stream, true);

			// Validate required fields
			if (empty($input['firstname']) || empty($input['lastname']) || empty($input['position'])) {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Required fields: firstname, lastname, position'
				));
				return;
			}

			// Handle image upload if provided
			$imageData = null;
			if (!empty($input['image'])) {
				$imageData = $this->handle_image_upload($input['image'], 'faculty');
			}

			$data = array(
				'firstname' => $input['firstname'],
				'lastname' => $input['lastname'],
				'position' => $input['position'],
				'advisory' => isset($input['advisory']) ? $input['advisory'] : null,
				'image' => $imageData
			);

			$result = $this->Faculty_users_model->insert_faculty($data);

			if ($result) {
				echo json_encode(array(
					'success' => true,
					'message' => 'Faculty member added successfully',
					'id' => $result
				));
			} else {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Error adding faculty member'
				));
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(array(
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			));
		}
	}

	public function api_update_faculty() {
		header('Content-Type: application/json');
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
			return;
		}

		try {
			$input = json_decode($this->input->raw_input_stream, true);

			if (empty($input['id'])) {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Faculty ID required'
				));
				return;
			}

			// Validate required fields
			if (empty($input['firstname']) || empty($input['lastname']) || empty($input['position'])) {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Required fields: firstname, lastname, position'
				));
				return;
			}

			$data = array(
				'firstname' => $input['firstname'],
				'lastname' => $input['lastname'],
				'position' => $input['position'],
				'advisory' => isset($input['advisory']) ? $input['advisory'] : null
			);

			// Handle image update if provided
			if (!empty($input['image'])) {
				$imageData = $this->handle_image_upload($input['image'], 'faculty');
				$data['image'] = $imageData;
			}

			$result = $this->Faculty_users_model->update_faculty($input['id'], $data);

			if ($result) {
				echo json_encode(array(
					'success' => true,
					'message' => 'Faculty member updated successfully'
				));
			} else {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Error updating faculty member'
				));
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(array(
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			));
		}
	}

	public function api_delete_faculty() {
		header('Content-Type: application/json');
		
		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
			return;
		}

		try {
			$input = json_decode($this->input->raw_input_stream, true);

			if (empty($input['id'])) {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Faculty ID required'
				));
				return;
			}

			$result = $this->Faculty_users_model->delete_faculty($input['id']);

			if ($result) {
				echo json_encode(array(
					'success' => true,
					'message' => 'Faculty member deleted successfully'
				));
			} else {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Error deleting faculty member'
				));
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(array(
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			));
		}
	}

	// Helper function to handle image uploads
	private function handle_image_upload($imageData, $folder = 'faculty') {
		try {
			// Base64 encoded data comes as: data:image/png;base64,iVBORw0KGgo...
			if (strpos($imageData, ',') === false) {
				return null; // Invalid format
			}

			list($type, $data) = explode(',', $imageData);
			$data = base64_decode($data);

			// Create directory if it doesn't exist
			$uploadDir = FCPATH . 'uploads/' . $folder;
			if (!is_dir($uploadDir)) {
				mkdir($uploadDir, 0755, true);
			}

			// Generate unique filename
			$filename = $folder . '_' . time() . '_' . uniqid() . '.png';
			$filepath = $uploadDir . '/' . $filename;

			// Save file
			if (file_put_contents($filepath, $data)) {
				return 'uploads/' . $folder . '/' . $filename;
			}
			return null;
		} catch (Exception $e) {
			error_log('Image upload error: ' . $e->getMessage());
			return null;
		}
	}

	// Programs Management

	public function programs() {
		$this->load->model('Programs_model');
		
		$data = array(
			'content_type' => 'programs',
			'programs' => $this->Programs_model->get_all_programs()
		);
		$this->load->view('superadmin/pages/manage_programs', $data);
	}

	public function api_get_programs() {
		header('Content-Type: application/json');
		$this->load->model('Programs_model');
		
		$programs = $this->Programs_model->get_all_programs();
		echo json_encode($programs);
	}

	public function api_save_program() {
		header('Content-Type: application/json');
		$this->load->model('Programs_model');
		
		$program_name = $this->input->post('program_name');
		$description = $this->input->post('description');
		$duration_years = $this->input->post('duration_years');
		$career_opportunities = $this->input->post('career_opportunities');
		
		// Validate inputs
		if (empty($program_name) || empty($description) || empty($duration_years) || empty($career_opportunities)) {
			echo json_encode([
				'success' => false,
				'message' => 'All fields are required'
			]);
			return;
		}
		
		// Convert array to comma-separated string if needed
		if (is_array($career_opportunities)) {
			$career_opportunities = implode(', ', array_filter($career_opportunities));
		}
		
		$data = [
			'program_name' => $program_name,
			'description' => $description,
			'duration_years' => $duration_years,
			'career_opportunities' => $career_opportunities
		];
		
		$result = $this->Programs_model->insert_program($data);
		
		echo json_encode([
			'success' => $result !== false,
			'id' => $result,
			'message' => $result ? 'Program added successfully' : 'Error adding program'
		]);
	}

	public function api_load_program() {
		header('Content-Type: application/json');
		$this->load->model('Programs_model');
		
		$program_id = $this->input->get('id');
		$program = $this->Programs_model->get_program_by_id($program_id);
		
		echo json_encode($program);
	}

	public function api_update_program() {
		header('Content-Type: application/json');
		$this->load->model('Programs_model');
		
		$program_id = $this->input->post('program_id');
		$program_name = $this->input->post('program_name');
		$description = $this->input->post('description');
		$duration_years = $this->input->post('duration_years');
		$career_opportunities = $this->input->post('career_opportunities');
		
		// Convert array to comma-separated string
		if (is_array($career_opportunities)) {
			$career_opportunities = implode(', ', array_filter($career_opportunities));
		}
		
		$data = [
			'program_name' => $program_name,
			'description' => $description,
			'duration_years' => $duration_years,
			'career_opportunities' => $career_opportunities
		];
		
		$result = $this->Programs_model->update_program($program_id, $data);
		
		echo json_encode([
			'success' => $result,
			'message' => $result ? 'Program updated successfully' : 'Error updating program'
		]);
	}

	public function api_delete_program() {
		header('Content-Type: application/json');
		$this->load->model('Programs_model');
		
		$program_id = $this->input->post('id');
		$result = $this->Programs_model->delete_program($program_id);
		
		echo json_encode([
			'success' => $result,
			'message' => $result ? 'Program deleted successfully' : 'Error deleting program'
		]);
	}

	// Curriculum Upload Handler
	public function api_upload_curriculum() {
		header('Content-Type: application/json');
		error_log('=== Curriculum Upload Started ===');
		
		try {
			// Load model
			$this->load->model('Curriculum_model');
			error_log('Model loaded');
			
			// Create table if it doesn't exist
			if (!$this->db->table_exists('curriculum')) {
				error_log('Creating curriculum table');
				$this->create_curriculum_table();
			}
			
			// Check for file
			if (!isset($_FILES['file'])) {
				error_log('No file in $_FILES');
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'No file uploaded'
				]);
				return;
			}

			$curriculum_name = $this->input->post('curriculum_name');
			$file = $_FILES['file'];
			
			error_log('Curriculum Name: ' . $curriculum_name);
			error_log('File Name: ' . $file['name']);
			error_log('File Type: ' . $file['type']);
			error_log('File Size: ' . $file['size']);
			error_log('File Error: ' . $file['error']);

			// Validate inputs
			if (empty($curriculum_name)) {
				error_log('Curriculum name is empty');
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Curriculum name is required'
				]);
				return;
			}

			// Validate file upload error
			if ($file['error'] !== UPLOAD_ERR_OK) {
				error_log('File upload error: ' . $file['error']);
				http_response_code(400);
				$errorMessages = [
					UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize in php.ini',
					UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE in form',
					UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
					UPLOAD_ERR_NO_FILE => 'No file was uploaded',
					UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
					UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
					UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
				];
				$errorMessage = $errorMessages[$file['error']] ?? 'Unknown upload error';
				echo json_encode([
					'success' => false,
					'message' => 'File upload error: ' . $errorMessage
				]);
				return;
			}

			// Validate file is PDF
			if ($file['type'] !== 'application/pdf') {
				error_log('Invalid file type: ' . $file['type']);
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Only PDF files are allowed. Got: ' . $file['type']
				]);
				return;
			}

			// Create curriculum directory
			$uploadDir = FCPATH . 'uploads/curriculum';
			error_log('Upload directory: ' . $uploadDir);
			
			if (!is_dir($uploadDir)) {
				error_log('Creating directory: ' . $uploadDir);
				if (!mkdir($uploadDir, 0755, true)) {
					error_log('Failed to create directory');
					http_response_code(500);
					echo json_encode([
						'success' => false,
						'message' => 'Failed to create upload directory'
					]);
					return;
				}
			}

			// Generate filename
			$filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $curriculum_name) . '_' . time() . '.pdf';
			$filepath = $uploadDir . '/' . $filename;
			error_log('Generated filepath: ' . $filepath);

			// Move uploaded file
			if (move_uploaded_file($file['tmp_name'], $filepath)) {
				error_log('File moved successfully');
				
				// Save to database
				$data = [
					'program' => $curriculum_name,
					'file_url' => 'uploads/curriculum/' . $filename
				];
				
				error_log('Attempting to insert into database');
				error_log('Data: ' . json_encode($data));

				$result = $this->Curriculum_model->insert_curriculum($data);
				
				error_log('Insert result: ' . ($result ? 'Success' : 'Failed'));

				if ($result) {
					error_log('Curriculum uploaded successfully');
					http_response_code(200);
					echo json_encode([
						'success' => true,
						'message' => 'Curriculum uploaded successfully',
						'file_url' => base_url('uploads/curriculum/' . $filename),
						'data' => $data
					]);
					exit;
				} else {
					// Delete file if database insert failed
					error_log('Database insert failed, deleting file');
					unlink($filepath);
					http_response_code(500);
					echo json_encode([
						'success' => false,
						'message' => 'Error saving curriculum to database: ' . $this->db->error()['message']
					]);
					exit;
				}
			} else {
				error_log('Failed to move uploaded file');
				http_response_code(500);
				echo json_encode([
					'success' => false,
					'message' => 'Error uploading file'
				]);
				exit;
			}
		} catch (Exception $e) {
			error_log('Exception in upload_curriculum: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// Get all curriculums
	public function api_get_curriculums() {
		header('Content-Type: application/json');
		error_log('=== Get Curriculums Started ===');
		
		try {
			// Load model
			$this->load->model('Curriculum_model');
			error_log('Model loaded successfully');
			
			// Check if table exists
			if (!$this->db->table_exists('curriculum')) {
				error_log('Curriculum table does not exist - creating it');
				$this->create_curriculum_table();
				error_log('Curriculum table created');
			}
			
			// Get curriculums
			$curriculums = $this->Curriculum_model->get_all();
			error_log('Curriculums retrieved: ' . count($curriculums));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $curriculums,
				'count' => count($curriculums)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_curriculums: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving curriculums: ' . $e->getMessage()
			]);
			exit;
		}
	}
	
	// Helper function to create curriculum table if it doesn't exist
	private function create_curriculum_table() {
		try {
			$this->load->dbforge();
			
			$this->dbforge->add_field(array(
				'id' => array(
					'type' => 'INT',
					'constraint' => 11,
					'auto_increment' => TRUE
				),
				'program' => array(
					'type' => 'VARCHAR',
					'constraint' => '255',
					'null' => FALSE
				),
				'file_url' => array(
					'type' => 'VARCHAR',
					'constraint' => '255',
					'null' => FALSE
				),
				'created_at' => array(
					'type' => 'TIMESTAMP',
					'default' => 'CURRENT_TIMESTAMP'
				)
			));
			
			$this->dbforge->add_key('id', TRUE);
			$this->dbforge->create_table('curriculum');
			error_log('✅ Curriculum table created successfully');
		} catch (Exception $e) {
			error_log('⚠️ Error creating table: ' . $e->getMessage());
		}
	}

	// Delete curriculum
	public function api_delete_curriculum() {
		header('Content-Type: application/json');
		$this->load->model('Curriculum_model');
		
		$id = $this->input->post('id');
		
		if (empty($id)) {
			echo json_encode([
				'success' => false,
				'message' => 'Curriculum ID is required'
			]);
			return;
		}

		// Get curriculum file path for deletion
		$curriculum = $this->Curriculum_model->get_by_id($id);
		
		if ($curriculum && !empty($curriculum['file_url'])) {
			$filepath = FCPATH . $curriculum['file_url'];
			if (file_exists($filepath)) {
				unlink($filepath);
			}
		}

		$result = $this->Curriculum_model->delete_curriculum($id);
		echo json_encode([
			'success' => $result,
			'message' => $result ? 'Curriculum deleted successfully' : 'Error deleting curriculum'
		]);
	}

	// ==================== CLASS SCHEDULES ====================

	// Upload class schedule
	public function api_upload_schedule() {
		header('Content-Type: application/json');
		error_log('=== Class Schedule Upload Started ===');
		
		try {
			// Load model
			$this->load->model('ClassSchedules_model');
			error_log('Model loaded');
			
			// Create table if it doesn't exist
			if (!$this->db->table_exists('class_schedules')) {
				error_log('Creating class_schedules table');
				$this->create_class_schedules_table();
			}
			
			// Check for file
			if (!isset($_FILES['file'])) {
				error_log('No file in $_FILES');
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'No file uploaded'
				]);
				return;
			}

			$academic_year = $this->input->post('academic_year');
			$semester = $this->input->post('semester');
			$file = $_FILES['file'];
			
			error_log('Academic Year: ' . $academic_year);
			error_log('Semester: ' . $semester);
			error_log('File Name: ' . $file['name']);
			error_log('File Type: ' . $file['type']);
			error_log('File Size: ' . $file['size']);
			error_log('File Error: ' . $file['error']);

			// Validate inputs
			if (empty($academic_year)) {
				error_log('Academic year is empty');
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Academic year is required'
				]);
				return;
			}

			if (empty($semester)) {
				error_log('Semester is empty');
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Semester is required'
				]);
				return;
			}

			// Validate file upload error
			if ($file['error'] !== UPLOAD_ERR_OK) {
				error_log('File upload error: ' . $file['error']);
				http_response_code(400);
				$errorMessages = [
					UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize in php.ini',
					UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE in form',
					UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
					UPLOAD_ERR_NO_FILE => 'No file was uploaded',
					UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
					UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
					UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
				];
				$errorMessage = $errorMessages[$file['error']] ?? 'Unknown upload error';
				echo json_encode([
					'success' => false,
					'message' => 'File upload error: ' . $errorMessage
				]);
				return;
			}

			// Validate file is PDF
			if ($file['type'] !== 'application/pdf') {
				error_log('Invalid file type: ' . $file['type']);
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Only PDF files are allowed. Got: ' . $file['type']
				]);
				return;
			}

			// Create schedules directory
			$uploadDir = FCPATH . 'uploads/schedules';
			error_log('Upload directory: ' . $uploadDir);
			
			if (!is_dir($uploadDir)) {
				error_log('Creating directory: ' . $uploadDir);
				if (!mkdir($uploadDir, 0755, true)) {
					error_log('Failed to create directory');
					http_response_code(500);
					echo json_encode([
						'success' => false,
						'message' => 'Failed to create upload directory'
					]);
					return;
				}
			}

			// Generate filename
			$filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $academic_year . '_' . $semester) . '_' . time() . '.pdf';
			$filepath = $uploadDir . '/' . $filename;
			error_log('Generated filepath: ' . $filepath);

			// Move uploaded file
			if (move_uploaded_file($file['tmp_name'], $filepath)) {
				error_log('File moved successfully');
				
				// Save to database
				$data = [
					'academic_year' => $academic_year,
					'semester' => $semester,
					'file_url' => 'uploads/schedules/' . $filename
				];
				
				error_log('Attempting to insert into database');
				error_log('Data: ' . json_encode($data));

				// Verify model is loaded and ready
				if (!isset($this->ClassSchedules_model)) {
					error_log('ERROR: ClassSchedules_model not loaded!');
					throw new Exception('Model not loaded');
				}

				$result = $this->ClassSchedules_model->insert_schedule($data);
				
				error_log('Insert result: ' . ($result ? 'Success (ID: ' . $this->db->insert_id() . ')' : 'Failed'));
				
				// Check for database errors
				$db_error = $this->db->error();
				if (!empty($db_error['message'])) {
					error_log('Database Error: ' . json_encode($db_error));
				}

				if ($result) {
					error_log('Class schedule uploaded successfully');
					http_response_code(200);
					echo json_encode([
						'success' => true,
						'message' => 'Class schedule uploaded successfully',
						'file_url' => base_url('uploads/schedules/' . $filename),
						'data' => $data,
						'insert_id' => $this->db->insert_id()
					]);
					exit;
				} else {
					// Delete file if database insert failed
					error_log('Database insert failed, deleting file');
					unlink($filepath);
					http_response_code(500);
					echo json_encode([
						'success' => false,
						'message' => 'Error saving schedule to database: ' . $this->db->error()['message']
					]);
					exit;
				}
			} else {
				error_log('Failed to move uploaded file');
				http_response_code(500);
				echo json_encode([
					'success' => false,
					'message' => 'Error uploading file'
				]);
				exit;
			}
		} catch (Exception $e) {
			error_log('Exception in upload_schedule: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// Get all class schedules
	public function api_get_schedules() {
		header('Content-Type: application/json');
		error_log('=== Get Class Schedules Started ===');
		
		try {
			// Load model
			$this->load->model('ClassSchedules_model');
			error_log('Model loaded successfully');
			
			// Check if table exists
			if (!$this->db->table_exists('class_schedules')) {
				error_log('Class schedules table does not exist - creating it');
				$this->create_class_schedules_table();
				error_log('Class schedules table created');
			}
			
			// Get schedules
			$schedules = $this->ClassSchedules_model->get_all();
			error_log('Schedules retrieved: ' . count($schedules));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $schedules,
				'count' => count($schedules)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_schedules: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving schedules: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// Delete class schedule
	public function api_delete_schedule() {
		header('Content-Type: application/json');
		$this->load->model('ClassSchedules_model');
		
		$id = $this->input->post('id');
		
		if (empty($id)) {
			echo json_encode([
				'success' => false,
				'message' => 'Schedule ID is required'
			]);
			return;
		}

		// Get schedule file path for deletion
		$schedule = $this->ClassSchedules_model->get_by_id($id);
		
		if ($schedule && !empty($schedule['file_url'])) {
			$filepath = FCPATH . $schedule['file_url'];
			if (file_exists($filepath)) {
				unlink($filepath);
			}
		}

		$result = $this->ClassSchedules_model->delete_schedule($id);
		echo json_encode([
			'success' => $result,
			'message' => $result ? 'Class schedule deleted successfully' : 'Error deleting class schedule'
		]);
	}

	// Academic Calendar Upload
	public function api_upload_calendar() {
		header('Content-Type: application/json');
		$this->load->model('AcademicCalendars_model');
		
		// Validate inputs
		$academic_year = $this->input->post('academic_year');
		$file = $_FILES['calendar_file'] ?? null;
		
		if (empty($academic_year)) {
			echo json_encode(['success' => false, 'message' => 'Academic year is required']);
			return;
		}
		
		if (!$file) {
			echo json_encode(['success' => false, 'message' => 'File is required']);
			return;
		}
		
		// Validate file type and size
		$allowed_types = ['application/pdf'];
		$max_size = 52428800; // 50MB
		
		if (!in_array($file['type'], $allowed_types)) {
			echo json_encode(['success' => false, 'message' => 'Only PDF files are allowed']);
			return;
		}
		
		if ($file['size'] > $max_size) {
			echo json_encode(['success' => false, 'message' => 'File size exceeds 50MB limit']);
			return;
		}
		
		// Create upload directory if it doesn't exist
		$upload_dir = FCPATH . 'uploads/academic_calendars/';
		if (!is_dir($upload_dir)) {
			mkdir($upload_dir, 0755, true);
		}
		
		// Generate unique filename
		$filename = 'calendar_' . time() . '_' . uniqid() . '.pdf';
		$filepath = $upload_dir . $filename;
		
		if (!move_uploaded_file($file['tmp_name'], $filepath)) {
			echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
			return;
		}
		
		// Save to database
		$data = [
			'academic_year' => $academic_year,
			'file_url' => 'uploads/academic_calendars/' . $filename
		];
		
		$insert_id = null;
		if ($this->AcademicCalendars_model->insert_calendar($data)) {
			$insert_id = $this->db->insert_id();
		}
		
		echo json_encode([
			'success' => true,
			'message' => 'Calendar uploaded successfully',
			'file_url' => $data['file_url'],
			'insert_id' => $insert_id
		]);
	}

	// Get all academic calendars
	public function api_get_calendars() {
		header('Content-Type: application/json');
		$this->load->model('AcademicCalendars_model');
		
		try {
			// Check if table exists
			if (!$this->db->table_exists('academic_calendars')) {
				error_log('Academic calendars table does not exist - creating it');
				$this->create_academic_calendars_table();
				error_log('Academic calendars table created');
			}
			
			// Get calendars
			$calendars = $this->AcademicCalendars_model->get_all();
			error_log('Calendars retrieved: ' . count($calendars));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $calendars,
				'count' => count($calendars)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_calendars: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving calendars: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// Delete academic calendar
	public function api_delete_calendar() {
		header('Content-Type: application/json');
		$this->load->model('AcademicCalendars_model');
		
		$id = $this->input->post('id');
		
		if (empty($id)) {
			echo json_encode([
				'success' => false,
				'message' => 'Calendar ID is required'
			]);
			return;
		}

		// Get calendar file path for deletion
		$calendar = $this->AcademicCalendars_model->get_by_id($id);
		
		if ($calendar && !empty($calendar['file_url'])) {
			$filepath = FCPATH . $calendar['file_url'];
			if (file_exists($filepath)) {
				unlink($filepath);
			}
		}

		$result = $this->AcademicCalendars_model->delete_calendar($id);
		echo json_encode([
			'success' => $result,
			'message' => $result ? 'Academic calendar deleted successfully' : 'Error deleting academic calendar'
		]);
	}

	// Helper function to create class_schedules table if it doesn't exist
	private function create_class_schedules_table() {
		try {
			// Check if table already exists
			if ($this->db->table_exists('class_schedules')) {
				error_log('⚠️ Class schedules table already exists');
				return TRUE;
			}
			
			$this->load->dbforge();
			
			$this->dbforge->add_field(array(
				'id' => array(
					'type' => 'INT',
					'constraint' => 11,
					'auto_increment' => TRUE
				),
				'academic_year' => array(
					'type' => 'VARCHAR',
					'constraint' => '20',
					'null' => FALSE
				),
				'semester' => array(
					'type' => 'VARCHAR',
					'constraint' => '50',
					'null' => FALSE
				),
				'file_url' => array(
					'type' => 'VARCHAR',
					'constraint' => '255',
					'null' => FALSE
				),
				'created_at' => array(
					'type' => 'TIMESTAMP',
					'default' => 'CURRENT_TIMESTAMP'
				)
			));
			
			$this->dbforge->add_key('id', TRUE);
			$this->dbforge->create_table('class_schedules');
			error_log('✅ Class schedules table created successfully');
			return TRUE;
		} catch (Exception $e) {
			error_log('⚠️ Error creating table: ' . $e->getMessage());
			error_log('Database Error: ' . json_encode($this->db->error()));
			return FALSE;
		}
	}

	// Helper function to create academic_calendars table if it doesn't exist
	private function create_academic_calendars_table() {
		try {
			// Check if table already exists
			if ($this->db->table_exists('academic_calendars')) {
				error_log('⚠️ Academic calendars table already exists');
				return TRUE;
			}
			
			$this->load->dbforge();
			
			$this->dbforge->add_field(array(
				'calendar_id' => array(
					'type' => 'INT',
					'constraint' => 11,
					'auto_increment' => TRUE
				),
				'academic_year' => array(
					'type' => 'VARCHAR',
					'constraint' => '20',
					'null' => FALSE
				),
				'pdf_file' => array(
					'type' => 'VARCHAR',
					'constraint' => '255',
					'null' => FALSE
				),
				'uploaded_at' => array(
					'type' => 'TIMESTAMP',
					'default' => 'CURRENT_TIMESTAMP'
				)
			));
			
			$this->dbforge->add_key('calendar_id', TRUE);
			$this->dbforge->create_table('academic_calendars');
			error_log('✅ Academic calendars table created successfully');
			return TRUE;
		} catch (Exception $e) {
			error_log('⚠️ Error creating calendar table: ' . $e->getMessage());
			error_log('Database Error: ' . json_encode($this->db->error()));
			return FALSE;
		}
	}
}
