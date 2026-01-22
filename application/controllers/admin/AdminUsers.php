<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminUsers extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		// Add authentication check here if needed
		// $this->load->library('session');
	}

	public function create()
	{
		$data['page_title'] = 'Create User Account';
		$data['page_type'] = 'admin_users';
		$data['action'] = 'create';
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/create_user', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function list_all()
	{
		$data['page_title'] = 'Manage Admins';
		$data['page_type'] = 'admin_users';
		$data['action'] = 'list';
		
		// Optionally load admin users data from model
		// $this->load->model('AdminUserModel');
		// $data['users'] = $this->AdminUserModel->get_all();
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/pages/list_users', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function edit($user_id = null)
	{
		if (!$user_id) {
			show_404();
		}

		$data['page_title'] = 'Edit User Account';
		$data['page_type'] = 'admin_users';
		$data['action'] = 'edit';
		$data['user_id'] = $user_id;
		
		// Optionally load specific user data from model
		// $this->load->model('AdminUserModel');
		// $data['user'] = $this->AdminUserModel->get_by_id($user_id);
		
		$this->load->view('superadmin/layouts/header', $data);
		$this->load->view('superadmin/layouts/navigation');
		$this->load->view('superadmin/users/edit_user', $data);
		$this->load->view('superadmin/layouts/footer');
	}

	public function delete($user_id = null)
	{
		if (!$user_id) {
			show_404();
		}

		// Handle deletion logic here
		// $this->load->model('AdminUserModel');
		// $this->AdminUserModel->delete($user_id);
		
		redirect('admin/users/list');
	}

	/**
	 * Save new user (AJAX handler)
	 */
	public function save()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Invalid request method']);
			return;
		}

		$this->load->library('session');
		$this->load->model('User_model');
		$this->load->model('UserRole_model');

		// Get form data
		$firstName = $this->input->post('first_name', true);
		$lastName = $this->input->post('last_name', true);
		$email = $this->input->post('email', true);
		$roleId = $this->input->post('role_id', true);

		// Validate required fields
		if (empty($firstName) || empty($lastName) || empty($email) || empty($roleId)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Missing required fields']);
			return;
		}

		// Validate email format and domain
		if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/@bisu\.edu\.ph$/', $email)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Must use valid @bisu.edu.ph email']);
			return;
		}

		// Check if email already exists
		$existingUser = $this->User_model->get_by_email($email);
		if ($existingUser) {
			http_response_code(409);
			echo json_encode(['success' => false, 'message' => 'This email is already registered']);
			return;
		}

		try {
			// Use default password
			$password = 'pass1234';

			// Create user - User_model will hash the password
			$userData = [
				'email' => $email,
				'password' => $password,  // Pass plain password, model will hash it
				'first_name' => $firstName,
				'last_name' => $lastName,
				'is_active' => 1,
				'email_verified' => 0,
				'created_at' => date('Y-m-d H:i:s')
			];

			$userId = $this->User_model->create_user($userData);

			if (!$userId) {
				throw new Exception('Failed to create user');
			}

			// Assign role to user
			$this->UserRole_model->assign_role($userId, $roleId);

			// Save role-specific data
			if ($roleId == 2) {
				// Faculty
				$this->_saveFacultyData($userId);
			} elseif ($roleId == 3) {
				// Student
				$this->_saveStudentData($userId);
			} elseif ($roleId == 4) {
				// Organization Admin
				$this->_saveOrgAdminData($userId);
			}

			// Log success
			log_message('info', "New user created: $email (Role: $roleId) - UserID: $userId");

			http_response_code(200);
			echo json_encode([
				'success' => true,
				'message' => 'User created successfully',
				'user_id' => $userId,
				'password' => $password,
				'email' => $email
			]);

		} catch (Exception $e) {
			log_message('error', 'User creation error: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error creating user: ' . $e->getMessage()]);
		}
	}

	/**
	 * Save faculty-specific data
	 */
	private function _saveFacultyData($userId)
	{
		$this->load->model('Faculty_model');
		
		$facultyData = [
			'user_id' => $userId,
			'position' => $this->input->post('position', true),
			'department' => $this->input->post('department', true),
			'bio' => $this->input->post('bio', true),
			'office_location' => $this->input->post('office_location', true)
		];

		if (!$this->Faculty_model->create($facultyData)) {
			throw new Exception('Failed to save faculty data');
		}
		log_message('info', "Faculty data saved for user: $userId");
	}

	/**
	 * Save student-specific data
	 */
	private function _saveStudentData($userId)
	{
		$this->load->model('Student_model');
		
		$studentData = [
			'user_id' => $userId,
			'student_number' => $this->input->post('student_number', true),
			'course' => $this->input->post('course', true),
			'year_level' => $this->input->post('year_level', true),
			'section' => $this->input->post('section', true)
		];

		if (!$this->Student_model->create($studentData)) {
			throw new Exception('Failed to save student data');
		}
		log_message('info', "Student data saved for user: $userId");
	}

	/**
	 * Save organization admin data
	 */
	private function _saveOrgAdminData($userId)
	{
		// Organization assignment (for future implementation)
		$organization = $this->input->post('organization', true);
		log_message('info', "Organization admin assigned to: $organization for user: $userId");
	}
}
?>
