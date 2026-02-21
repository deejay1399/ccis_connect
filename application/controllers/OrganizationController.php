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
			$organizations = [$this->build_organization_panel($org_slug, $org_slug)];
		} else {
			$student = $this->Student_model->get_by_user_id($user_id);
			$resolved_org = $this->resolve_student_organization($student);
			$org_slug = $resolved_org['organization_slug'];
			$org_name = $resolved_org['organization_name'];
			$organizations = [
				$this->build_organization_panel('the_legion', $org_slug),
				$this->build_organization_panel('csguild', $org_slug),
			];
		}

		$data['page_type'] = 'organization_student';
		$data['organization_slug'] = $org_slug;
		$data['organization_name'] = $org_name;
		$data['organizations'] = $organizations;
		$data['officers'] = $this->OrgAdmin_model->get_officers($org_slug);
		$data['advisers'] = $this->OrgAdmin_model->get_advisers($org_slug);
		$data['announcements'] = $this->OrgAdmin_model->get_announcements($org_slug);
		$data['happenings'] = $this->OrgAdmin_model->get_happenings($org_slug);

		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/navigation');
		$this->load->view('pages/organization', $data);
		$this->load->view('layouts/footer');
	}

	private function build_organization_panel($organization_slug, $member_slug)
	{
		$slug = (string) $organization_slug;
		$is_member = ($slug === (string) $member_slug);
		$meta = $this->get_organization_meta($slug);

		return [
			'organization_slug' => $slug,
			'organization_name' => $meta['name'],
			'section_id' => $meta['section_id'],
			'title' => $meta['title'],
			'icon_class' => $meta['icon_class'],
			'logo' => $meta['logo'],
			'about_heading' => $meta['about_heading'],
			'about_text' => $meta['about_text'],
			'is_member' => $is_member,
			'officers' => $this->OrgAdmin_model->get_officers($slug),
			'advisers' => $this->OrgAdmin_model->get_advisers($slug),
			'announcements' => $is_member ? $this->OrgAdmin_model->get_announcements($slug) : [],
			'happenings' => $is_member ? $this->OrgAdmin_model->get_happenings($slug) : [],
		];
	}

	private function get_organization_meta($organization_slug)
	{
		if ($organization_slug === 'the_legion') {
			return [
				'name' => 'The Legion',
				'section_id' => 'the-legion',
				'title' => 'The Legion',
				'icon_class' => 'fa-users',
				'logo' => base_url('assets/images/legion.jpg'),
				'about_heading' => 'About The Legion',
				'about_text' => 'The Legion is the leading organization for IT enthusiasts on campus. Dedicated to supporting both academic and extracurricular activities, they are responsible for providing technical assistance during events. From managing sounds, lights, and equipment at acquaintance parties, programs, and gatherings, to organizing exciting mobile game tournaments during school activities. The Legion ensures that every event runs smoothly and is more enjoyable for students. They also handle creative setups like the movie booth, making them a vital part of bringing innovation, fun, and technical expertise to campus life.',
			];
		}

		if ($organization_slug === 'csguild') {
			return [
				'name' => 'CS Guild',
				'section_id' => 'cs-guild',
				'title' => 'CS Guild',
				'icon_class' => 'fa-code',
				'logo' => base_url('assets/images/csguild.jpg'),
				'about_heading' => 'About CS Guild',
				'about_text' => 'The CS Guild is the newest organization for computer science students. It is a student-led group that focuses on learning, collaboration, and knowledge-sharing in programming. The organization provides peer tutoring, coding assistance, and activities designed to support students in their computer science subjects. By fostering a culture of teamwork and continuous learning, the CS Guild helps members strengthen their skills and gain confidence in both academic and real-world programming challenges.',
			];
		}

		return [
			'name' => 'Unassigned Organization',
			'section_id' => 'organization',
			'title' => 'Unassigned Organization',
			'icon_class' => 'fa-users',
			'logo' => base_url('assets/images/ccis.png'),
			'about_heading' => 'About Organization',
			'about_text' => 'This page shows your assigned organization updates.',
		];
	}

	private function resolve_student_organization($student)
	{
		if ($student && (!empty($student->organization_slug) || !empty($student->organization_name))) {
			return [
				'organization_slug' => !empty($student->organization_slug) ? $student->organization_slug : 'unassigned',
				'organization_name' => !empty($student->organization_name) ? $student->organization_name : 'Unassigned Organization',
			];
		}

		$session_slug = (string) $this->session->userdata('organization_slug');
		$session_name = (string) $this->session->userdata('organization_name');
		if ($session_slug !== '' && $session_slug !== 'unassigned') {
			return [
				'organization_slug' => $session_slug,
				'organization_name' => $session_name !== '' ? $session_name : 'Unassigned Organization',
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

	public function legion()
	{
		redirect('organization');
	}

	public function csguild()
	{
		redirect('organization');
	}
}
