<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LoginController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library('session');
		$this->load->model('User_model');
		$this->load->model('UserRole_model');
		$this->load->model('Session_model');
		$this->load->helper('url');
	}

	/**
	 * Display login page
	 */
	public function index()
	{
		// Check if already logged in
		if ($this->_is_logged_in()) {
			$this->_redirect_by_role();
		}

		// Check for flashdata messages
		$data['page_type'] = 'login';
		$data['error'] = $this->session->flashdata('error');
		$data['success'] = $this->session->flashdata('success');
		
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/login', $data);
		$this->load->view('layouts/footer');
	}

	/**
	 * Handle login form submission
	 */
	public function authenticate()
{
    if ($this->input->method() !== 'post') {
        show_error('Invalid request method', 405);
    }

    $email = $this->input->post('email', true);
    $password = $this->input->post('password', true);

    if (empty($email) || empty($password)) {
        $this->session->set_flashdata('error', 'Email and password are required');
        redirect('login');
    }

    /*
    |--------------------------------------------------
    | TEMPORARY TEST ACCOUNTS (REMOVE AFTER SETUP)
    |--------------------------------------------------
    */
    // SUPER ADMIN
    if ($email === 'admin@email.com' && $password === 'pass1234') {
        $token = bin2hex(random_bytes(32));
        $session_data = [
            'user_id'    => 0,
            'email'      => $email,
            'first_name' => 'Super',
            'last_name'  => 'Admin',
            'role_id'    => 1, // SUPER ADMIN
            'token'      => $token,
            'logged_in'  => true
        ];
        $this->session->set_userdata($session_data);
        redirect('admin/dashboard');
    }

    // STUDENT TEST ACCOUNT
    if ($email === 'student@email.com' && $password === 'pass1234') {
        $token = bin2hex(random_bytes(32));
        $session_data = [
            'user_id'    => 1,
            'email'      => $email,
            'first_name' => 'John',
            'last_name'  => 'Student',
            'role_id'    => 3, // STUDENT
            'token'      => $token,
            'logged_in'  => true
        ];
        $this->session->set_userdata($session_data);
        redirect('homepage');
    }
    /* ---------- END TEST ACCOUNTS ---------- */

    // NORMAL DATABASE LOGIN FLOW
    $user = $this->User_model->get_by_email($email);

    if (!$user) {
        $this->session->set_flashdata('error', 'Invalid email or password');
        redirect('login');
    }

    if (!$this->User_model->verify_password($password, $user->password_hash)) {
        $this->session->set_flashdata('error', 'Invalid email or password');
        redirect('login');
    }

    $role_id = $this->UserRole_model->get_role_id($user->id);

    if (!$role_id) {
        $this->session->set_flashdata('error', 'User role not assigned');
        redirect('login');
    }

    $token = bin2hex(random_bytes(32));

    $this->Session_model->create_session($user->id, $token);
    $this->User_model->update_last_activity($user->id);

    $session_data = [
        'user_id'    => $user->id,
        'email'      => $user->email,
        'first_name' => $user->first_name,
        'last_name'  => $user->last_name,
        'role_id'    => $role_id,
        'token'      => $token,
        'logged_in'  => true
    ];

    $this->session->set_userdata($session_data);

    $this->_redirect_by_role($role_id);
}

	/**
	 * API Endpoint for AJAX login (JSON response)
	 */
	public function api_authenticate()
	{
		header('Content-Type: application/json');

		if ($this->input->method() !== 'post') {
			http_response_code(405);
			echo json_encode(['success' => false, 'message' => 'Method not allowed']);
			exit;
		}

		$email = $this->input->post('email', true);
		$password = $this->input->post('password', true);

		error_log('API Auth attempt - Email: ' . $email);

		if (empty($email) || empty($password)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Email and password are required']);
			exit;
		}

		// Check super admin hardcoded account
		if ($email === 'admin@email.com' && $password === 'pass1234') {
			error_log('Super admin login successful: ' . $email);
			$user_data = [
				'user_id'    => 0,
				'email'      => $email,
				'first_name' => 'Super',
				'last_name'  => 'Admin',
				'role_id'    => 1,
				'role'       => 'superadmin',
				'name'       => 'Super Admin'
			];

			http_response_code(200);
			echo json_encode([
				'success' => true,
				'message' => 'Login successful',
				'user' => $user_data
			]);
			exit;
		}

		// NORMAL DATABASE LOGIN FLOW
		error_log('Checking database for user: ' . $email);
		$user = $this->User_model->get_by_email($email);

		if (!$user) {
			error_log('User not found: ' . $email);
			http_response_code(401);
			echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
			exit;
		}

		error_log('User found: ' . $user->email . ', checking password');
		
		if (!$this->User_model->verify_password($password, $user->password_hash)) {
			error_log('Password verification failed for: ' . $email);
			error_log('Provided password: ' . $password);
			error_log('Stored hash: ' . substr($user->password_hash, 0, 20) . '...');
			http_response_code(401);
			echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
			exit;
		}

		error_log('Password verified for: ' . $email);

		$role_id = $this->UserRole_model->get_role_id($user->id);

		if (!$role_id) {
			error_log('No role assigned for user: ' . $email);
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'User role not assigned']);
			exit;
		}

		// Map role_id to role name
		$role_name = $this->_get_role_name($role_id);

		$token = bin2hex(random_bytes(32));

		// Save session
		$this->Session_model->create_session($user->id, $token);
		$this->User_model->update_last_activity($user->id);

		// Set CodeIgniter session
		$session_data = [
			'user_id'    => $user->id,
			'email'      => $user->email,
			'first_name' => $user->first_name,
			'last_name'  => $user->last_name,
			'role_id'    => $role_id,
			'role'       => $role_name,
			'token'      => $token,
			'logged_in'  => true
		];

		$this->session->set_userdata($session_data);

		error_log('Login successful for: ' . $email . ' (Role: ' . $role_name . ')');

		http_response_code(200);
		echo json_encode([
			'success' => true,
			'message' => 'Login successful',
			'user' => [
				'user_id'    => $user->id,
				'email'      => $user->email,
				'first_name' => $user->first_name,
				'last_name'  => $user->last_name,
				'role_id'    => $role_id,
				'role'       => $role_name,
				'name'       => $user->first_name . ' ' . $user->last_name
			]
		]);
		exit;
	}

	/**
	 * Map role ID to role name
	 */
	private function _get_role_name($role_id)
	{
		$roles = [
			1 => 'superadmin',
			2 => 'faculty',
			3 => 'student',
			4 => 'orgadmin'
		];
		return isset($roles[$role_id]) ? $roles[$role_id] : 'guest';
	}

	/**
	 * Handle logout
	 */
	public function logout()
	{
		$token = $this->session->userdata('token');
		
		if ($token) {
			$this->Session_model->delete_session($token);
		}

		$this->session->sess_destroy();
		$this->session->set_flashdata('success', 'You have been logged out successfully');
		redirect('homepage');
	}

	/**
	 * Check if user is logged in
	 */
	private function _is_logged_in()
	{
		$user_id = $this->session->userdata('user_id');
		$token = $this->session->userdata('token');

		if (!$user_id || !$token) {
			return false;
		}

		// Validate session in database
		return $this->Session_model->validate_session($user_id, $token);
	}

	/**
	 * Redirect user based on role
	 */
	private function _redirect_by_role($role_id = null)
	{
		if (!$role_id) {
			$role_id = $this->session->userdata('role_id');
		}

		switch ($role_id) {
			case 1:
				// Super Admin
				redirect('admin/dashboard');
				break;
			case 2:
				// Faculty
				redirect('faculty/dashboard');
				break;
			case 3:
				// Student - redirect to homepage with full features unlocked
				redirect('homepage');
				break;
			case 4:
				// Organization Admin
				redirect('org/dashboard');
				break;
			default:
				redirect('login');
		}
	}

	/**
	 * Generate secure token
	 */
	private function _generate_token()
	{
		return bin2hex(random_bytes(32));
	}
}