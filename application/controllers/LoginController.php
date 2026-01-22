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
    | TEMPORARY SUPER ADMIN BYPASS
    | REMOVE THIS BLOCK AFTER SETUP
    |--------------------------------------------------
    */
    if ($email === 'admin@email.com' && $password === 'pass1234') {

        $token = bin2hex(random_bytes(32));

        $session_data = [
            'user_id'    => 0, // virtual user
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
    /* ---------- END BYPASS ---------- */

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
		redirect('login');
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
				// Student
				redirect('student/dashboard');
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