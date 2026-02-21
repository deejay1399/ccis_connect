<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminUsers extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper(['auth', 'string']);
		require_superadmin();
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
		$data['page_title'] = 'Manage Users';
		$data['page_type'] = 'list_users';
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
		$this->load->view('superadmin/pages/list_users', $data);
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
		$this->load->model('OrgAdmin_model');
		$this->load->model('Student_model');

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
			// Default password for all newly created accounts.
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
		$course = trim((string) $this->input->post('course', true));
		$mapped = $this->_mapCourseToOrganization($course);
		if ($mapped === null) {
			throw new Exception('Invalid course. Please select BSIT or BSCS.');
		}

		$studentData = [
			'user_id' => $userId,
			'student_number' => $this->input->post('student_number', true),
			'course' => $mapped['course'],
			'year_level' => $this->input->post('year_level', true),
			'section' => $this->input->post('section', true),
			'organization_slug' => $mapped['organization_slug'],
			'organization_name' => $mapped['organization_name']
		];

		if (!$this->Student_model->create($studentData)) {
			throw new Exception('Failed to save student data');
		}
		log_message('info', "Student data saved for user: $userId");
	}

	private function _mapCourseToOrganization($course)
	{
		$normalized = strtoupper(trim((string) $course));
		if ($normalized === 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY' || $normalized === 'BSIT') {
			return [
				'course' => 'Bachelor of Science in Information Technology',
				'organization_slug' => 'the_legion',
				'organization_name' => 'The Legion'
			];
		}

		if ($normalized === 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE' || $normalized === 'BSCS') {
			return [
				'course' => 'Bachelor of Science in Computer Science',
				'organization_slug' => 'csguild',
				'organization_name' => 'CS Guild'
			];
		}

		return null;
	}

	/**
	 * Save organization admin data
	 */
	private function _saveOrgAdminData($userId)
	{
		$organization = $this->input->post('organization', true);
		$organizationCustom = $this->input->post('organization_custom', true);
		$this->OrgAdmin_model->set_user_organization($userId, $organization, $organizationCustom);
		log_message('info', "Organization admin assigned to: $organization for user: $userId");
	}

	/**
	 * Get all users (AJAX handler)
	 */
	public function get_all_users()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'get') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Invalid request method']);
			return;
		}

		$this->load->model('User_model');
		$this->load->model('UserRole_model');
		$this->load->model('Student_model');
		$this->load->model('Faculty_model');
		$this->load->model('OrgAdmin_model');

		try {
			$users = $this->User_model->get_all();
			$usersData = [];

			foreach ($users as $user) {
				$roles = $this->UserRole_model->get_roles_by_user($user->id);
				$roleNames = [];
				if ($roles) {
					foreach ($roles as $role) {
						$roleNames[] = $role->role_name;
					}
				}
				
				// Fetch additional details based on role
				$additionalDetails = [];
				if ($roles) {
					foreach ($roles as $role) {
						if (strtolower($role->role_name) === 'student') {
							$student = $this->db->where('user_id', $user->id)->get('students')->row();
							if ($student) {
								$additionalDetails = [
									'student_number' => $student->student_number,
									'course' => $student->course,
									'year_level' => $student->year_level,
									'section' => $student->section,
									'organization' => isset($student->organization_name) ? $student->organization_name : null,
									'organization_slug' => isset($student->organization_slug) ? $student->organization_slug : null
								];
							}
						} elseif (strtolower($role->role_name) === 'faculty') {
							$faculty = $this->db->where('user_id', $user->id)->get('faculty')->row();
							if ($faculty) {
								$additionalDetails = [
									'position' => $faculty->position,
									'department' => $faculty->department,
									'office_location' => $faculty->office_location,
									'bio' => $faculty->bio
								];
							}
						} elseif (strtolower($role->role_name) === 'orgadmin') {
							$org = $this->OrgAdmin_model->get_user_organization($user->id);
							$additionalDetails = [
								'organization' => isset($org['organization_name']) ? $org['organization_name'] : null,
								'organization_slug' => isset($org['organization_slug']) ? $org['organization_slug'] : null
							];
						}
					}
				}
				
				$userData = [
					'id' => $user->id,
					'name' => $user->first_name . ' ' . $user->last_name,
					'email' => $user->email,
					'roles' => $roleNames,
					'is_active' => (int)$user->is_active,
					'email_verified' => (int)$user->email_verified,
					'created_at' => $user->created_at
				];
				
				// Merge additional details if they exist
				if (!empty($additionalDetails)) {
					$userData = array_merge($userData, $additionalDetails);
				}
				
				$usersData[] = $userData;
			}

			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $usersData,
				'count' => count($usersData)
			]);

		} catch (Exception $e) {
			log_message('error', 'Error fetching users: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error fetching users']);
		}
	}

	/**
	 * Update user (AJAX handler)
	 */
	public function update_user()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Invalid request method']);
			return;
		}

		$this->load->model('User_model');

		$userId = $this->input->post('user_id', true);
		$firstName = $this->input->post('first_name', true);
		$lastName = $this->input->post('last_name', true);
		$email = $this->input->post('email', true);

		if (empty($userId) || empty($firstName) || empty($lastName) || empty($email)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Missing required fields']);
			return;
		}

		try {
			$data = [
				'first_name' => $firstName,
				'last_name' => $lastName,
				'email' => $email,
				'updated_at' => date('Y-m-d H:i:s')
			];

			if ($this->User_model->update_user($userId, $data)) {
				http_response_code(200);
				echo json_encode(['success' => true, 'message' => 'User updated successfully']);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to update user']);
			}

		} catch (Exception $e) {
			log_message('error', 'Error updating user: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error updating user']);
		}
	}

	/**
	 * Delete user (AJAX handler)
	 */
	public function delete_user()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Invalid request method']);
			return;
		}

		$this->load->model('User_model');

		$userId = $this->input->post('user_id', true);

		if (empty($userId)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Missing user ID']);
			return;
		}

		try {
			if ($this->User_model->delete_user($userId)) {
				http_response_code(200);
				echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
			}

		} catch (Exception $e) {
			log_message('error', 'Error deleting user: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error deleting user']);
		}
	}

	/**
	 * Get user details (AJAX handler)
	 */
	public function get_user_details($user_id = null)
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'get') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Invalid request method']);
			return;
		}

		$this->load->model('User_model');
		$this->load->model('UserRole_model');
		$this->load->model('OrgAdmin_model');

		if (empty($user_id)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Missing user ID']);
			return;
		}

		try {
			$user = $this->User_model->get_by_id($user_id);
			
			if (!$user) {
				http_response_code(404);
				echo json_encode(['success' => false, 'message' => 'User not found']);
				return;
			}

			// Get user roles
			$roles = $this->UserRole_model->get_roles_by_user($user->id);
			$roleNames = [];
			if ($roles) {
				foreach ($roles as $role) {
					$roleNames[] = $role->role_name;
				}
			}

			// Fetch additional details based on role
			$additionalDetails = [];
			if ($roles) {
				foreach ($roles as $role) {
					if (strtolower($role->role_name) === 'student') {
						$student = $this->db->where('user_id', $user->id)->get('students')->row();
						if ($student) {
							$additionalDetails = [
								'student_number' => $student->student_number,
								'course' => $student->course,
								'year_level' => $student->year_level,
								'section' => $student->section,
								'organization' => isset($student->organization_name) ? $student->organization_name : null,
								'organization_slug' => isset($student->organization_slug) ? $student->organization_slug : null
							];
						}
					} elseif (strtolower($role->role_name) === 'faculty') {
						$faculty = $this->db->where('user_id', $user->id)->get('faculty')->row();
						if ($faculty) {
							$additionalDetails = [
								'position' => $faculty->position,
								'department' => $faculty->department,
								'office_location' => $faculty->office_location,
								'bio' => $faculty->bio
							];
						}
					} elseif (strtolower($role->role_name) === 'orgadmin') {
						$org = $this->OrgAdmin_model->get_user_organization($user->id);
						$additionalDetails = [
							'organization' => isset($org['organization_name']) ? $org['organization_name'] : null,
							'organization_slug' => isset($org['organization_slug']) ? $org['organization_slug'] : null
						];
					}
				}
			}

			$userData = [
				'id' => $user->id,
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'email' => $user->email,
				'is_active' => (int)$user->is_active,
				'roles' => $roleNames,
				'created_at' => $user->created_at
			];

			// Merge additional details if they exist
			if (!empty($additionalDetails)) {
				$userData = array_merge($userData, $additionalDetails);
			}

			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $userData
			]);

		} catch (Exception $e) {
			log_message('error', 'Error fetching user details: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error fetching user details']);
		}
	}
}
