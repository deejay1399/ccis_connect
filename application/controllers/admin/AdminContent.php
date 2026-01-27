<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminContent extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('string');
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
}
?>
