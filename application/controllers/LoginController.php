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
		$this->load->model('OrgAdmin_model');
		$this->load->model('Student_model');
		$this->load->helper('url');
	}

	/**
	 * Ipakita ang panid sa pag-login
	 */
	public function index()
	{
		// Susihon kung naka-log in na
		if ($this->_is_logged_in()) {
			$this->_redirect_by_role();
		}

		// Susiha ang mga mensahe sa flashdata
		$data['page_type'] = 'login';
		$data['error'] = $this->session->flashdata('error');
		$data['success'] = $this->session->flashdata('success');
		
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/login', $data);
		$this->load->view('layouts/footer');
	}

	/**
	 * Pagdumala sa pagsumite sa porma sa pag-login
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

    // NORMAL Database LOGIN Stream
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

    $role_name = $this->_get_role_name($role_id);
    $token = $this->_generate_token();

    $this->Session_model->create_session($user->id, $token);
    $this->User_model->update_last_activity($user->id);

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

    if ((int) $role_id === 4) {
        $session_data = array_merge($session_data, $this->_get_org_session_data((int) $user->id));
    } elseif ((int) $role_id === 3) {
        $session_data = array_merge($session_data, $this->_get_student_org_session_data((int) $user->id));
    }

    $this->session->set_userdata($session_data);

    $this->_redirect_by_role($role_id);
}

	/**
	 * API Endpoint alang sa AJAX login (JSON tubag)
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

		if (empty($email) || empty($password)) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'Email and password are required']);
			exit;
		}

		// NORMAL Database LOGIN Stream
		$user = $this->User_model->get_by_email($email);

		if (!$user) {
			http_response_code(401);
			echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
			exit;
		}

		if (!$this->User_model->verify_password($password, $user->password_hash)) {
			http_response_code(401);
			echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
			exit;
		}

		$role_id = $this->UserRole_model->get_role_id($user->id);

		if (!$role_id) {
			http_response_code(400);
			echo json_encode(['success' => false, 'message' => 'User role not assigned']);
			exit;
		}

		// Mapa role_id sa role name
		$role_name = $this->_get_role_name($role_id);

		$token = $this->_generate_token();

		// Luwasa ang sesyon
		$this->Session_model->create_session($user->id, $token);
		$this->User_model->update_last_activity($user->id);

		// Itakda ang sesyon sa CodeIgniter
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

		if ((int) $role_id === 4) {
			$session_data = array_merge($session_data, $this->_get_org_session_data((int) $user->id));
		} elseif ((int) $role_id === 3) {
			$session_data = array_merge($session_data, $this->_get_student_org_session_data((int) $user->id));
		}

		$this->session->set_userdata($session_data);

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
				'name'       => $user->first_name . ' ' . $user->last_name,
				'organization' => isset($session_data['organization_name']) ? $session_data['organization_name'] : null,
				'organization_slug' => isset($session_data['organization_slug']) ? $session_data['organization_slug'] : null
			]
		]);
		exit;
	}

	/**
	 * Mapa papel ID sa ngalan sa papel
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

		// Tin-aw nga datos sa sesyon sa CodeIgniter nga wala gubaa sa bug-os ang sesyon,
		// mahimo pa nga magamit ang flashdata alang sa pag-logout sa pagmemensahe.
		$this->session->unset_userdata([
			'user_id',
			'email',
			'first_name',
			'last_name',
			'role_id',
			'role',
			'organization_name',
			'organization_slug',
			'token',
			'logged_in'
		]);

		$this->session->set_flashdata('success', 'You have been logged out successfully');
		$this->session->sess_regenerate(true);

		// Kung ang kliyente tin-aw nga naghangyo usa ka post-logout login screen (gigamit sa JS), pasidunggi kini.
		if ($this->input->get('logout') === 'true') {
			redirect('login?logout=true');
		}

		redirect('homepage');
	}

	/**
	 * Susihon kung ang tiggamit naka-log in
	 */
	private function _is_logged_in()
	{
		$user_id = $this->session->userdata('user_id');
		$token = $this->session->userdata('token');

		if (!$user_id || !$token) {
			return false;
		}

		// Validate sesyon sa database
		return $this->Session_model->validate_session($user_id, $token);
	}

	/**
	 * I-redirect ang tiggamit base sa papel
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
				// Faculty - parehas nga pag-access sa superadmin
				redirect('admin/dashboard');
				break;
			case 3:
				// Estudyante - pag-redirect sa homepage nga adunay bug-os nga mga dagway nga wala ma-lock
				redirect('homepage');
				break;
			case 4:
				// Organisasyon Admin
				redirect('org/dashboard');
				break;
			default:
				redirect('login');
		}
	}

	/**
	 * Makamugna og luwas nga token
	 */
	private function _generate_token()
	{
		return bin2hex(random_bytes(32));
	}

	private function _get_org_session_data($user_id)
	{
		$org = $this->OrgAdmin_model->get_user_organization((int) $user_id);

		return [
			'organization_name' => isset($org['organization_name']) ? $org['organization_name'] : 'Unassigned Organization',
			'organization_slug' => isset($org['organization_slug']) ? $org['organization_slug'] : 'unassigned',
		];
	}

	private function _get_student_org_session_data($user_id)
	{
		$student = $this->Student_model->get_by_user_id((int) $user_id);
		if ($student && (!empty($student->organization_slug) || !empty($student->organization_name))) {
			return [
				'organization_name' => !empty($student->organization_name) ? $student->organization_name : 'Unassigned Organization',
				'organization_slug' => !empty($student->organization_slug) ? $student->organization_slug : 'unassigned',
			];
		}

		if ($student && !empty($student->course)) {
			$course_upper = strtoupper((string) $student->course);
			if (strpos($course_upper, 'BSIT') !== false || strpos($course_upper, 'INFORMATION TECHNOLOGY') !== false) {
				return ['organization_name' => 'The Legion', 'organization_slug' => 'the_legion'];
			}
			if (strpos($course_upper, 'BSCS') !== false || strpos($course_upper, 'COMPUTER SCIENCE') !== false) {
				return ['organization_name' => 'CS Guild', 'organization_slug' => 'csguild'];
			}
		}

		return [
			'organization_name' => 'Unassigned Organization',
			'organization_slug' => 'unassigned',
		];
	}
}
