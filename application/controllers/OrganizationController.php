<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class OrganizationController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper(['url', 'auth']);
		$this->load->model('Student_model');
		$this->load->model('OrgAdmin_model');

		if (!$this->session->userdata('logged_in')) {
			redirect('login');
		}

		$role_id = (int) $this->session->userdata('role_id');
		if (!in_array($role_id, [3, 4], true)) {
			redirect_by_role($role_id);
		}
	}

	public function index()
	{
		$user_id = (int) $this->session->userdata('user_id');
		$role_id = (int) $this->session->userdata('role_id');

		if ($role_id === 4) {
			$org = $this->OrgAdmin_model->get_user_organization($user_id);
			$org_slug = !empty($org['organization_slug']) ? $org['organization_slug'] : 'unassigned';
			$org_name = !empty($org['organization_name']) ? $org['organization_name'] : 'Unassigned Organization';
		} else {
			$student = $this->Student_model->get_by_user_id($user_id);
			$org_slug = $student && !empty($student->organization_slug) ? $student->organization_slug : 'unassigned';
			$org_name = $student && !empty($student->organization_name) ? $student->organization_name : 'Unassigned Organization';
		}

		$data['page_type'] = 'organization_student';
		$data['organization_slug'] = $org_slug;
		$data['organization_name'] = $org_name;
		$data['officers'] = $this->OrgAdmin_model->get_officers($org_slug);
		$data['advisers'] = $this->OrgAdmin_model->get_advisers($org_slug);
		$data['announcements'] = $this->OrgAdmin_model->get_announcements($org_slug);
		$data['happenings'] = $this->OrgAdmin_model->get_happenings($org_slug);

		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/organization', $data);
		$this->load->view('layouts/footer');
	}

	public function legion()
	{
		redirect('organization');
	}

	public function csguild()
	{
		redirect('organization');
	}
}
