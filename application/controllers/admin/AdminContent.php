<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminContent extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('string');
		$this->load->model('Faculty_users_model');
		// Add authentication check here if needed
		// $this->load->library('session');
	}

	public function homepage()
	{
		$data['page_title'] = 'Manage Homepage';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'homepage';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_homepage', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function updates()
	{
		$data['page_title'] = 'Manage Updates';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'updates';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_updates', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function academics()
	{
		$data['page_title'] = 'Manage Academics';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'academics';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_academics', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function about()
	{
		$data['page_title'] = 'Manage About';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'about';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_about', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function faculty()
	{
		$data['page_title'] = 'Manage Faculty';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'faculty';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_faculty', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function forms()
	{
		$data['page_title'] = 'Manage Forms';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'forms';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_forms', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function organizations()
	{
		$data['page_title'] = 'Manage Organizations';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'organizations';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_organizations', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function alumni()
	{
		$data['page_title'] = 'Manage Alumni';
		$data['page_type'] = 'admin_content';
		$data['content_type'] = 'alumni';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/manage_alumni', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	// AJAX: Load homepage data
	public function load_homepage()
	{
		header('Content-Type: application/json');
		
		try {
			$this->load->model('Homepage_model');
			
			$data = $this->Homepage_model->get_latest();
			
			if ($data) {
				echo json_encode([
					'success' => true,
					'data' => $data
				]);
			} else {
				echo json_encode([
					'success' => false,
					'message' => 'No homepage data found'
				]);
			}
		} catch (Exception $e) {
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	// AJAX: Save homepage data with file upload
	public function save_homepage()
	{
		header('Content-Type: application/json');

		try {
			$title = $this->input->post('title');
			$content = $this->input->post('content');

			// Validate inputs
			if (empty($title) || empty($content)) {
				echo json_encode([
					'success' => false,
					'message' => 'Title and content are required'
				]);
				exit;
			}

			// Load the model
			$this->load->model('Homepage_model');

			// Handle file upload if present
			$banner_image = null;
			if (!empty($_FILES['banner_image']['name'])) {
				$banner_image = $this->_upload_banner();
				
				if ($banner_image === false) {
					echo json_encode([
						'success' => false,
						'message' => 'Failed to upload image. Please check file size and format.'
					]);
					exit;
				}
			}

			// Prepare save data
			$save_data = [
				'title' => $title,
				'content' => $content,
			];

			if ($banner_image) {
				$save_data['banner_image'] = $banner_image;
			}

			// Save to database
			$result = $this->Homepage_model->save_homepage($save_data);

			// Log the result for debugging
			log_message('info', 'Homepage save result: ' . ($result ? 'TRUE' : 'FALSE'));
			log_message('info', 'Database error: ' . $this->db->error()['message']);

			if ($result !== false) {
				// Reload the data to confirm what's in database
				$reload_data = $this->Homepage_model->get_latest();
				
				echo json_encode([
					'success' => true,
					'message' => 'Homepage content saved successfully',
					'data' => $save_data,
					'reload_data' => $reload_data
				]);
			} else {
				echo json_encode([
					'success' => false,
					'message' => 'Failed to save homepage content',
					'db_error' => $this->db->error()['message']
				]);
			}
		} catch (Exception $e) {
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	// Helper: Upload banner image
	private function _upload_banner()
	{
		// Create uploads directory if doesn't exist
		$upload_dir = FCPATH . 'uploads/dashboard';
		if (!is_dir($upload_dir)) {
			@mkdir($upload_dir, 0755, true);
		}

		// Configure upload settings
		$config = [
			'upload_path' => $upload_dir,
			'allowed_types' => 'gif|jpg|png|jpeg',
			'max_size' => 5120, // 5MB
			'file_name' => 'banner_' . time() . '_' . random_string('alnum', 8),
			'overwrite' => false,
			'encrypt_name' => false
		];

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload('banner_image')) {
			log_message('error', 'Upload Error: ' . $this->upload->display_errors());
			return false;
		}

		// Return relative path for database storage
		$upload_data = $this->upload->data();
		return 'uploads/dashboard/' . $upload_data['file_name'];
	}

	// ==================== FACULTY API ENDPOINTS ====================

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
				// Return relative URL for storing in database
				return base_url('uploads/' . $folder . '/' . $filename);
			}

			return null;
		} catch (Exception $e) {
			log_message('error', 'Image upload error: ' . $e->getMessage());
			return null;
		}
	}

	/**
	 * AJAX: Load faculty data
	 */
	public function load_faculty()
	{
		header('Content-Type: application/json');
		
		try {
			$faculty = $this->Faculty_users_model->get_all_faculty();
			
			if ($faculty) {
				echo json_encode([
					'success' => true,
					'data' => $faculty
				]);
			} else {
				echo json_encode([
					'success' => true,
					'data' => []
				]);
			}
		} catch (Exception $e) {
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	/**
	 * AJAX: Update faculty
	 */
	public function update_faculty()
	{
		header('Content-Type: application/json');

		try {
			$id = $this->input->post('id');
			$firstname = $this->input->post('firstname');
			$lastname = $this->input->post('lastname');
			$position = $this->input->post('position');
			$advisory = $this->input->post('advisory');

			// Validate inputs
			if (empty($id) || empty($firstname) || empty($lastname) || empty($position)) {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'ID, firstname, lastname, and position are required'
				]);
				exit;
			}

			// Prepare update data
			$update_data = [
				'firstname' => $firstname,
				'lastname' => $lastname,
				'position' => $position,
				'advisory' => $advisory
			];

			// Handle image upload if provided
			if (!empty($_FILES['image']['name'])) {
				$upload_dir = FCPATH . 'uploads/faculty';
				if (!is_dir($upload_dir)) {
					if (!@mkdir($upload_dir, 0755, true)) {
						http_response_code(500);
						echo json_encode([
							'success' => false,
							'message' => 'Failed to create upload directory'
						]);
						exit;
					}
				}

				$image_filename = $this->_upload_faculty_image();
				if ($image_filename === false) {
					http_response_code(400);
					echo json_encode([
						'success' => false,
						'message' => 'Failed to upload image'
					]);
					exit;
				}
				$update_data['image'] = $image_filename;
			}

			// Update in database
			if (!$this->Faculty_users_model) {
				$this->load->model('Faculty_users_model');
			}
			
			$result = $this->Faculty_users_model->update_faculty($id, $update_data);

			if ($result) {
				http_response_code(200);
				echo json_encode([
					'success' => true,
					'message' => 'Faculty member updated successfully'
				]);
			} else {
				http_response_code(500);
				echo json_encode([
					'success' => false,
					'message' => 'Failed to update faculty'
				]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	/**
	 * AJAX: Delete faculty
	 */
	public function delete_faculty()
	{
		header('Content-Type: application/json');

		try {
			$id = $this->input->post('id');

			// Validate inputs
			if (empty($id)) {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Faculty ID is required'
				]);
				exit;
			}

			// Delete from database
			if (!$this->Faculty_users_model) {
				$this->load->model('Faculty_users_model');
			}
			
			$result = $this->Faculty_users_model->delete_faculty($id);

			if ($result) {
				http_response_code(200);
				echo json_encode([
					'success' => true,
					'message' => 'Faculty member deleted successfully'
				]);
			} else {
				http_response_code(500);
				echo json_encode([
					'success' => false,
					'message' => 'Failed to delete faculty'
				]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	/**
	 * AJAX: Save faculty with image upload
	 */
	public function save_faculty()
	{
		header('Content-Type: application/json');

		try {
			$firstname = $this->input->post('firstname');
			$lastname = $this->input->post('lastname');
			$position = $this->input->post('position');
			$advisory = $this->input->post('advisory');

			// Validate inputs
			if (empty($firstname) || empty($lastname) || empty($position)) {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Firstname, lastname, and position are required'
				]);
				exit;
			}

			// Create directory for uploads if doesn't exist
			$upload_dir = FCPATH . 'uploads/faculty';
			if (!is_dir($upload_dir)) {
				if (!@mkdir($upload_dir, 0755, true)) {
					http_response_code(500);
					echo json_encode([
						'success' => false,
						'message' => 'Failed to create upload directory'
					]);
					exit;
				}
			}

			// Handle file upload
			$image_filename = null;
			if (!empty($_FILES['image']['name'])) {
				$image_filename = $this->_upload_faculty_image();
				
				if ($image_filename === false) {
					http_response_code(400);
					echo json_encode([
						'success' => false,
						'message' => 'Failed to upload image. Please check file size and format.'
					]);
					exit;
				}
			}

			// Prepare save data
			$save_data = [
				'firstname' => $firstname,
				'lastname' => $lastname,
				'position' => $position,
				'advisory' => $advisory,
				'image' => $image_filename
			];

			// Save to database - make sure model is loaded
			if (!$this->Faculty_users_model) {
				$this->load->model('Faculty_users_model');
			}
			
			$result = $this->Faculty_users_model->insert_faculty($save_data);

			if ($result) {
				http_response_code(200);
				echo json_encode([
					'success' => true,
					'message' => 'Faculty member added successfully',
					'id' => $result
				]);
			} else {
				http_response_code(500);
				echo json_encode([
					'success' => false,
					'message' => 'Failed to save faculty to database: ' . $this->db->error()['message']
				]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	/**
	 * Helper: Upload faculty image
	 */
	private function _upload_faculty_image()
	{
		// Create uploads directory if doesn't exist
		$upload_dir = FCPATH . 'uploads/faculty';
		if (!is_dir($upload_dir)) {
			if (!@mkdir($upload_dir, 0755, true)) {
				log_message('error', 'Failed to create faculty upload directory');
				return false;
			}
		}

		// Make sure upload directory is writable
		if (!is_writable($upload_dir)) {
			log_message('error', 'Upload directory not writable: ' . $upload_dir);
			return false;
		}

		// Configure upload settings
		$config = [
			'upload_path' => $upload_dir . '/',
			'allowed_types' => 'gif|jpg|png|jpeg|jpe',
			'max_size' => 5120, // 5MB
			'file_name' => 'faculty_' . time() . '_' . random_string('alnum', 8),
			'overwrite' => false,
			'encrypt_name' => false
		];

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload('image')) {
			$error = $this->upload->display_errors('', '');
			log_message('error', 'Faculty Upload Error: ' . $error);
			return false;
		}

		// Return filename for database storage
		$upload_data = $this->upload->data();
		return $upload_data['file_name'];
	}

	// ============================================
	// PROGRAMS MANAGEMENT API METHODS
	// ============================================

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
}
?>
