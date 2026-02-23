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
		
		// Opsyonal nga load admin tiggamit data gikan sa modelo
		// $ni->load->model('AdminUserModel');
		// $data['users'] = $kini->AdminUserModel->get_all();
		
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
		
		// Opsyonal nga pag-load sa piho nga datos sa gumagamit gikan sa modelo
		// $ni->load->model('AdminUserModel');
		// $data['user'] = $kini->AdminUserModel->get_by_id($user_id);
		
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

		// Pagdumala sa pagtangtang lohika dinhi
		// $ni->load->model('AdminUserModel');
		// $ni->AdminUserModel->delete($user_id);
		
		redirect('admin/users/list');
	}

	/**
	 * Luwasa ang bag-ong tiggamit (AJAX handler)
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

		// Kuhaa ang datos sa porma
		$firstName = $this->input->post('first_name', true);
		$lastName = $this->input->post('last_name', true);
		$email = $this->input->post('email', true);
		$roleId = $this->input->post('role_id', true);

		// I-validate ang gikinahanglan nga mga natad
		if (empty($firstName) || empty($lastName) || empty($email) || empty($roleId)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Missing required fields']);
			return;
		}

		// I-validate ang format sa email ug domain
		if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/@bisu\.edu\.ph$/', $email)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Must use valid @bisu.edu.ph email']);
			return;
		}

		// Susihon kung adunay na ang email
		$existingUser = $this->User_model->get_by_email($email);
		if ($existingUser) {
			http_response_code(409);
			echo json_encode(['success' => false, 'message' => 'This email is already registered']);
			return;
		}

		$facultyData = null;
		if ((int) $roleId === 2) {
			$facultyValidation = $this->_validateFacultyInputAndLimits();
			if (!$facultyValidation['success']) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => $facultyValidation['message']]);
				return;
			}
			$facultyData = $facultyValidation['data'];
		}

		try {
			// Default nga password alang sa tanan nga bag-ong gihimo nga mga account.
			$password = 'pass1234';

			// Create User - User_model ang hash ang password
			$userData = [
				'email' => $email,
				'password' => $password,  // Ipasa ang yano nga password, modelo ang hash niini
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

			// I-assign ang papel sa tiggamit
			$this->UserRole_model->assign_role($userId, $roleId);

			// I-save ang datos nga piho sa papel
			if ($roleId == 2) {
				// Pundok sa mga magtutudlo
				$this->_saveFacultyData($userId, $facultyData);
			} elseif ($roleId == 3) {
				// Estudyante
				$this->_saveStudentData($userId);
			} elseif ($roleId == 4) {
				// Organisasyon Admin
				$this->_saveOrgAdminData($userId);
			}

			// Log kalampusan
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
	 * I-save ang datos nga piho sa mga magtutudlo
	 */
	private function _saveFacultyData($userId, $facultyData = null)
	{
		$this->load->model('Faculty_model');

		if ($facultyData === null) {
			$facultyData = [
				'position' => $this->input->post('position', true),
				'department' => $this->input->post('department', true),
				'vp_type' => $this->input->post('vp_type', true),
				'course' => $this->input->post('chair_course', true),
				'bio' => $this->input->post('bio', true),
				'office_location' => $this->input->post('office_location', true)
			];
		}

		$facultyData['user_id'] = $userId;

		if (!$this->Faculty_model->create($facultyData)) {
			throw new Exception('Failed to save faculty data');
		}
		log_message('info', "Faculty data saved for user: $userId");
	}

	private function _validateFacultyInputAndLimits()
	{
		$position = trim((string) $this->input->post('position', true));

		return [
			'success' => true,
			'data' => [
				'position' => $position,
				'department' => '',
				'vp_type' => null,
				'course' => null,
				'bio' => '',
				'office_location' => ''
			]
		];
	}

	/**
	 * I-save ang datos nga piho sa estudyante
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
	 * I-save ang datos sa admin sa organisasyon
	 */
	private function _saveOrgAdminData($userId)
	{
		$organization = $this->input->post('organization', true);
		$organizationCustom = $this->input->post('organization_custom', true);
		$this->OrgAdmin_model->set_user_organization($userId, $organization, $organizationCustom);
		log_message('info', "Organization admin assigned to: $organization for user: $userId");
	}

	/**
	 * Kuhaa ang tanan nga mga tiggamit (AJAX handler)
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
				
				// Pagkuha dugang nga mga detalye pinasukad sa papel
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
									'vp_type' => isset($faculty->vp_type) ? $faculty->vp_type : null,
									'course' => isset($faculty->course) ? $faculty->course : null,
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
				
				// Paghiusa sa dugang nga mga detalye kung adunay sila
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
	 * Update nga tiggamit (AJAX handler)
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
	 * Hapus User (AJAX handler)
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
	 * Kuhaa ang mga detalye sa gumagamit (AJAX handler)
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

			// Kuhaa ang mga tahas sa tiggamit
			$roles = $this->UserRole_model->get_roles_by_user($user->id);
			$roleNames = [];
			if ($roles) {
				foreach ($roles as $role) {
					$roleNames[] = $role->role_name;
				}
			}

			// Pagkuha dugang nga mga detalye pinasukad sa papel
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
								'vp_type' => isset($faculty->vp_type) ? $faculty->vp_type : null,
								'course' => isset($faculty->course) ? $faculty->course : null,
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

			// Paghiusa sa dugang nga mga detalye kung adunay sila
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
