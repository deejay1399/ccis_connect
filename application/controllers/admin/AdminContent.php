<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AdminContent extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('string');
		$this->load->helper('auth');
		$this->load->model('Faculty_users_model');
		require_superadmin();
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
		// Kontrol sa pag-access - superadmin ra ang puwede mo-manage sa mga porma
		if (!$this->session->userdata('logged_in')) {
			redirect('login');
		}
		
		$user_role = $this->session->userdata('role');
		if ($user_role == 'student') {
			// I-redirect ang walay permiso ngadto sa publiko nga mga porma panid
			redirect('forms');
		}

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

	public function load_organizations_overview()
	{
		header('Content-Type: application/json');
		$this->load->model('OrgAdmin_model');

		try {
			$slugRows = $this->db->query("
				SELECT organization_slug FROM org_announcements
				UNION
				SELECT organization_slug FROM org_happenings
				UNION
				SELECT organization_slug FROM org_officers
				UNION
				SELECT organization_slug FROM org_advisers
				UNION
				SELECT organization_slug FROM org_admin_profiles
			")->result_array();

			$slugs = [];
			foreach ($slugRows as $row) {
				$slug = trim((string) ($row['organization_slug'] ?? ''));
				if ($slug !== '' && $slug !== 'unassigned') {
					$slugs[$slug] = true;
				}
			}

			// Ipakita gihapon ang mga organisasyon sa nailhang bisan wala pa silay kalihokan.
			$slugs['the_legion'] = true;
			$slugs['csguild'] = true;
			$slugs = array_keys($slugs);

			$organizations = [];
			$totalPosts = 0;
			$totalLegionPosts = 0;
			$totalCSGuildPosts = 0;

			foreach ($slugs as $slug) {
				$meta = $this->organization_meta_from_slug($slug);
				$stats = $this->OrgAdmin_model->get_dashboard_stats($slug);
				$announcements = $this->OrgAdmin_model->get_announcements($slug);
				$happenings = $this->OrgAdmin_model->get_happenings($slug);

				$postCount = (int) $stats['announcements'] + (int) $stats['happenings'];
				$totalPosts += $postCount;
				if ($slug === 'the_legion') {
					$totalLegionPosts = $postCount;
				}
				if ($slug === 'csguild') {
					$totalCSGuildPosts = $postCount;
				}

				$lastActivity = null;
				if (!empty($announcements) && !empty($announcements[0]['created_at'])) {
					$lastActivity = $announcements[0]['created_at'];
				}
				if (!empty($happenings) && !empty($happenings[0]['created_at'])) {
					$happeningDate = $happenings[0]['created_at'];
					if ($lastActivity === null || strtotime($happeningDate) > strtotime($lastActivity)) {
						$lastActivity = $happeningDate;
					}
				}

				$organizations[] = [
					'id' => $slug,
					'name' => $meta['name'],
					'shortName' => $meta['short_name'],
					'description' => $meta['description'],
					'logo' => $meta['logo'],
					'program' => $meta['program'],
					'announcement_count' => (int) $stats['announcements'],
					'happening_count' => (int) $stats['happenings'],
					'post_count' => $postCount,
					'member_count' => (int) $stats['officers'],
					'adviser_count' => (int) $stats['advisers'],
					'last_activity' => $lastActivity,
					'announcements' => array_slice($announcements, 0, 2),
					'happenings' => array_slice($happenings, 0, 1),
				];
			}

			$activityRows = $this->db->query("
				SELECT
					a.id,
					a.organization_slug,
					'announcement' AS activity_type,
					a.title,
					a.content AS body,
					a.event_date,
					a.created_at,
					u.first_name,
					u.last_name
				FROM org_announcements a
				LEFT JOIN users u ON u.id = a.created_by
				UNION ALL
				SELECT
					h.id,
					h.organization_slug,
					'happening' AS activity_type,
					h.title,
					h.description AS body,
					h.event_date,
					h.created_at,
					u2.first_name,
					u2.last_name
				FROM org_happenings h
				LEFT JOIN users u2 ON u2.id = h.created_by
				ORDER BY created_at DESC
				LIMIT 150
			")->result_array();

			$activities = [];
			foreach ($activityRows as $row) {
				$slug = trim((string) ($row['organization_slug'] ?? ''));
				$meta = $this->organization_meta_from_slug($slug);
				$postedBy = trim((string) (($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')));
				if ($postedBy === '') {
					$postedBy = 'Organization Admin';
				}

				$activities[] = [
					'id' => (int) $row['id'],
					'organization_slug' => $slug,
					'organization_name' => $meta['name'],
					'activity_type' => $row['activity_type'],
					'title' => (string) $row['title'],
					'body' => (string) $row['body'],
					'event_date' => $row['event_date'],
					'created_at' => $row['created_at'],
					'posted_by' => $postedBy,
				];
			}

			echo json_encode([
				'success' => true,
				'data' => [
					'stats' => [
						'total_legion_posts' => $totalLegionPosts,
						'total_csguild_posts' => $totalCSGuildPosts,
						'total_organizations' => count($organizations),
						'total_posts' => $totalPosts
					],
					'organizations' => $organizations,
					'activities' => $activities
				]
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Failed to load organization overview: ' . $e->getMessage()
			]);
		}
		exit;
	}

	private function organization_meta_from_slug($slug)
	{
		$normalized = strtolower(trim((string) $slug));
		if ($normalized === 'the_legion') {
			return [
				'name' => 'The Legion',
				'short_name' => 'Legion',
				'program' => 'BSIT',
				'logo' => base_url('assets/images/legion.jpg'),
				'description' => 'BSIT student organization focused on technical support and student activities.'
			];
		}
		if ($normalized === 'csguild' || $normalized === 'cs_guild') {
			return [
				'name' => 'CS Guild',
				'short_name' => 'CS Guild',
				'program' => 'BSCS',
				'logo' => base_url('assets/images/csguild.jpg'),
				'description' => 'BSCS student organization focused on coding, peer mentoring, and CS community work.'
			];
		}

		$name = ucwords(str_replace('_', ' ', $normalized));
		return [
			'name' => $name,
			'short_name' => $name,
			'program' => 'Organization',
			'logo' => base_url('assets/images/ccis.png'),
			'description' => 'Student organization'
		];
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

	// ==================== PAGDUMALA SA ALUMNI (AJAX) ====================

	public function load_alumni_mentor_requests()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_mentor_requests();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_alumni_mentor_status()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			$status = trim((string) $this->input->post('status'));
			$source = trim((string) $this->input->post('source'));

			if ($id <= 0 || $status === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID and status are required']);
				exit;
			}

			if ($source === '') {
				$source = 'mentor_requests';
			}

			$result = $this->Alumni_model->update_mentor_status($id, $status, $source);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_chatbot_inquiries()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_chatbot_inquiries();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_connection_requests()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_connection_requests();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_alumni_connection_status()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			$status = trim((string) $this->input->post('status'));

			if ($id <= 0 || $status === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID and status are required']);
				exit;
			}

			$result = $this->Alumni_model->update_connection_status($id, $status);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_updates()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_updates();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_alumni_update_status()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			$status = trim((string) $this->input->post('status'));

			if ($id <= 0 || $status === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID and status are required']);
				exit;
			}

			$result = $this->Alumni_model->update_update_status($id, $status);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_giveback()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_giveback();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_alumni_giveback_status()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			$status = trim((string) $this->input->post('status'));

			if ($id <= 0 || $status === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID and status are required']);
				exit;
			}

			$result = $this->Alumni_model->update_giveback_status($id, $status);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_featured()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_featured();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_alumni_featured()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$name = trim((string) $this->input->post('name'));
			$position = trim((string) $this->input->post('position'));
			$bio = trim((string) $this->input->post('bio'));

			if ($name === '' || $position === '' || $bio === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Name, position, and bio are required']);
				exit;
			}

			$photo = null;
			if (!empty($_FILES['photo']['name'])) {
				$photo = $this->_upload_file_to('uploads/alumni/featured', 'photo', 'gif|jpg|png|jpeg|jpe', 'featured', 5120);
				if ($photo === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload photo.']);
					exit;
				}
			}

			$payload = [
				'name' => $name,
				'position' => $position,
				'bio' => $bio
			];
			if ($photo) {
				$payload['photo'] = $photo;
			}

			$id = $this->Alumni_model->insert_featured($payload);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_alumni_featured()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Alumni_model->delete_featured($id);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_directory()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_directory();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_alumni_directory()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$name = trim((string) $this->input->post('name'));
			$batch = trim((string) $this->input->post('batch'));
			$email = trim((string) $this->input->post('email'));
			$phone = trim((string) $this->input->post('phone'));

			if ($name === '' || $batch === '' || $email === '' || $phone === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Name, batch, email, and phone are required']);
				exit;
			}

			$photo = null;
			if (!empty($_FILES['photo']['name'])) {
				$photo = $this->_upload_file_to('uploads/alumni/directory', 'photo', 'gif|jpg|png|jpeg|jpe', 'directory', 5120);
				if ($photo === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload photo.']);
					exit;
				}
			}

			$payload = [
				'name' => $name,
				'batch' => $batch,
				'email' => $email,
				'phone' => $phone
			];
			if ($photo) {
				$payload['photo'] = $photo;
			}

			$id = $this->Alumni_model->insert_directory($payload);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_alumni_directory()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Alumni_model->delete_directory($id);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_stories()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_stories();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_alumni_story()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$title = trim((string) $this->input->post('title'));
			$author = trim((string) $this->input->post('author'));
			$content = trim((string) $this->input->post('content'));

			if ($title === '' || $author === '' || $content === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Title, author, and content are required']);
				exit;
			}

			$photo = null;
			if (!empty($_FILES['photo']['name'])) {
				$photo = $this->_upload_file_to('uploads/alumni/stories', 'photo', 'gif|jpg|png|jpeg|jpe', 'story', 5120);
				if ($photo === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload photo.']);
					exit;
				}
			}

			$payload = [
				'title' => $title,
				'author' => $author,
				'content' => $content
			];
			if ($photo) {
				$payload['photo'] = $photo;
			}

			$id = $this->Alumni_model->insert_story($payload);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_alumni_story()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Alumni_model->delete_story($id);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_alumni_events()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$data = $this->Alumni_model->get_all_events();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_alumni_event()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$name = trim((string) $this->input->post('name'));
			$event_date = $this->input->post('event_date');
			$location = trim((string) $this->input->post('location'));
			$description = trim((string) $this->input->post('description'));

			if ($name === '' || empty($event_date) || $location === '' || $description === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Name, date, location, and description are required']);
				exit;
			}

			$photo = null;
			if (!empty($_FILES['photo']['name'])) {
				$photo = $this->_upload_file_to('uploads/alumni/events', 'photo', 'gif|jpg|png|jpeg|jpe', 'event', 5120);
				if ($photo === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload photo.']);
					exit;
				}
			}

			$payload = [
				'name' => $name,
				'event_date' => $event_date,
				'location' => $location,
				'description' => $description
			];
			if ($photo) {
				$payload['photo'] = $photo;
			}

			$id = $this->Alumni_model->insert_event($payload);

			echo json_encode(['success' => (bool) $id, 'id' => $id]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_alumni_event()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Alumni_model->delete_event($id);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	// AJAX: I-load ang homepage data
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

	public function update_alumni_chatbot_status()
	{
		header('Content-Type: application/json');
		$this->load->model('Alumni_model');

		try {
			$id = (int) $this->input->post('id');
			$status = trim((string) $this->input->post('status'));

			if ($id <= 0 || $status === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID and status are required']);
				exit;
			}

			$result = $this->Alumni_model->update_chatbot_status($id, $status);
			echo json_encode(['success' => (bool) $result]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	// AJAX: I-load ang tanan nga mga rekord sa homepage (carousel + tinubdan sa welcome)
	public function load_homepage_all()
	{
		header('Content-Type: application/json');

		try {
			$this->load->model('Homepage_model');
			$data = $this->Homepage_model->get_all();

			echo json_encode([
				'success' => true,
				'data' => $data
			]);
		} catch (Exception $e) {
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	// AJAX: I-save ang data sa homepage uban sa usa ka file upload
	public function save_homepage()
	{
		header('Content-Type: application/json');

		try {
			$title = $this->input->post('title');
			$content = $this->input->post('content');

			// Siguroa nga sakto ang mga inputs
			if (empty($title) || empty($content)) {
				echo json_encode([
					'success' => false,
					'message' => 'Title and content are required'
				]);
				exit;
			}

			// I-load ang modelo
			$this->load->model('Homepage_model');

			// Asikasuha ang file upload kung naa
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

			// Andama ang data para i-save
			$save_data = [
				'title' => $title,
				'content' => $content,
			];

			if ($banner_image) {
				$save_data['banner_image'] = $banner_image;
			}

			// I-save sa database
			$result = $this->Homepage_model->save_homepage($save_data);

			// I-log ang resulta para sa debugging
			log_message('info', 'Homepage save result: ' . ($result ? 'TRUE' : 'FALSE'));
			log_message('info', 'Database error: ' . $this->db->error()['message']);

			if ($result !== false) {
				// I-reload ang data aron makumpirma unsay naa sa database
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

	// AJAX: Ilisan ang homepage data sa usa ka ka operasyon (welcome + carousel)
	public function replace_homepage()
	{
		header('Content-Type: application/json');

		try {
			$this->load->model('Homepage_model');

			$title = trim((string) $this->input->post('title'));
			$content = trim((string) $this->input->post('content'));
			$existing_images = $this->input->post('existing_images');
			if (!is_array($existing_images)) {
				$existing_images = [];
			}

			// Tipigi lang ang relatibong mga agianan nga dili bakante ug likayi ang mga duplicate.
			$kept_images = [];
			foreach ($existing_images as $path) {
				$clean = trim((string) $path);
				if ($clean !== '') {
					$kept_images[$clean] = true;
				}
			}
			$kept_images = array_keys($kept_images);

			$new_images = $this->_upload_multiple_banners('banner_images');
			if ($new_images === false) {
				echo json_encode([
					'success' => false,
					'message' => 'Failed to upload one or more images. Check file format/size.'
				]);
				exit;
			}

			$current_records = $this->Homepage_model->get_all();
			$all_images = array_merge($kept_images, $new_images);

			// Tanggala ang daang mga file nga wala na gigamit.
			foreach ($current_records as $record) {
				if (empty($record['banner_image'])) {
					continue;
				}
				if (!in_array($record['banner_image'], $kept_images, true)) {
					$this->Homepage_model->delete_banner_file($record['banner_image']);
				}
			}

			// Tukora pag-usab ang mga laray sa homepage.
			$this->db->empty_table('homepage');

			if (empty($all_images)) {
				// Ibilin ang welcome content bisan wala 'y mga imahe sa carousel.
				$this->Homepage_model->save_homepage([
					'title' => $title,
					'content' => $content
				]);
			} else {
				// Bantayi ang front-end order samtang ang publiko nga homepage mobasa ug mga rekord sa DESC id.
				$insert_images = array_reverse($all_images);
				foreach ($insert_images as $image_path) {
					$this->Homepage_model->save_homepage([
						'title' => $title,
						'content' => $content,
						'banner_image' => $image_path
					]);
				}
			}

			echo json_encode([
				'success' => true,
				'message' => 'Homepage updated successfully',
				'image_count' => count($all_images)
			]);
		} catch (Exception $e) {
			echo json_encode([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			]);
		}
		exit;
	}

	// Tabang nga function: Upload sa banner image
	private function _upload_banner()
	{
		// Himoa ang uploads directory kung wala pa
		$upload_dir = FCPATH . 'uploads/dashboard';
		if (!is_dir($upload_dir)) {
			@mkdir($upload_dir, 0755, true);
		}

		// I-set ang upload settings
		$config = [
			'upload_path' => $upload_dir,
			'allowed_types' => 'gif|jpg|png|jpeg|webp',
			'max_size' => 20480, // 20MB
			'file_name' => 'banner_' . time() . '_' . random_string('alnum', 8),
			'overwrite' => false,
			'encrypt_name' => false
		];

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload('banner_image')) {
			log_message('error', 'Upload Error: ' . $this->upload->display_errors());
			return false;
		}

		// Ibalik ang paryente nga agianan alang sa pagtipig sa database
		$upload_data = $this->upload->data();
		return 'uploads/dashboard/' . $upload_data['file_name'];
	}

	private function _upload_multiple_banners($input_name = 'banner_images')
	{
		if (
			!isset($_FILES[$input_name]) ||
			!isset($_FILES[$input_name]['name']) ||
			empty($_FILES[$input_name]['name'])
		) {
			return [];
		}

		$names = $_FILES[$input_name]['name'];
		if (!is_array($names)) {
			$names = [$names];
			$_FILES[$input_name]['type'] = [$_FILES[$input_name]['type']];
			$_FILES[$input_name]['tmp_name'] = [$_FILES[$input_name]['tmp_name']];
			$_FILES[$input_name]['error'] = [$_FILES[$input_name]['error']];
			$_FILES[$input_name]['size'] = [$_FILES[$input_name]['size']];
		}

		$paths = [];
		$count = count($names);

		for ($i = 0; $i < $count; $i++) {
			if (empty($names[$i])) {
				continue;
			}

			$_FILES['__banner_tmp'] = [
				'name' => $_FILES[$input_name]['name'][$i],
				'type' => $_FILES[$input_name]['type'][$i],
				'tmp_name' => $_FILES[$input_name]['tmp_name'][$i],
				'error' => $_FILES[$input_name]['error'][$i],
				'size' => $_FILES[$input_name]['size'][$i],
			];

			$upload_dir = FCPATH . 'uploads/dashboard';
			if (!is_dir($upload_dir)) {
				@mkdir($upload_dir, 0755, true);
			}

			$config = [
				'upload_path' => $upload_dir,
				'allowed_types' => 'gif|jpg|png|jpeg|webp',
				'max_size' => 20480, // 20MB matag image
				'file_name' => 'banner_' . time() . '_' . random_string('alnum', 8),
				'overwrite' => false,
				'encrypt_name' => false
			];

			$this->load->library('upload');
			$this->upload->initialize($config);

			if (!$this->upload->do_upload('__banner_tmp')) {
				log_message('error', 'Multi Banner Upload Error: ' . $this->upload->display_errors('', ''));
				unset($_FILES['__banner_tmp']);
				return false;
			}

			$upload_data = $this->upload->data();
			$paths[] = 'uploads/dashboard/' . $upload_data['file_name'];
			unset($_FILES['__banner_tmp']);
		}

		return $paths;
	}

	// ==================== PAGDUMALA SA UPDATE (mga pahibalo / panghitabo / DEAN'S LIST) ====================

	private function _ensure_upload_dir($relative_dir)
	{
		$abs_dir = FCPATH . trim($relative_dir, '/\\');
		if (!is_dir($abs_dir)) {
			@mkdir($abs_dir, 0755, true);
		}
		return $abs_dir;
	}

	private function _upload_file_to($relative_dir, $input_name, $allowed_types, $prefix, $max_size_kb)
	{
		$abs_dir = $this->_ensure_upload_dir($relative_dir);
		if (!is_dir($abs_dir) || !is_writable($abs_dir)) {
			log_message('error', 'Upload dir missing/not writable: ' . $abs_dir);
			return false;
		}

		$config = [
			'upload_path' => rtrim($abs_dir, '/\\') . '/',
			'allowed_types' => $allowed_types,
			'max_size' => $max_size_kb,
			'file_name' => $prefix . '_' . time() . '_' . random_string('alnum', 8),
			'overwrite' => false,
			'encrypt_name' => false
		];

		$this->load->library('upload', $config);

		if (!$this->upload->do_upload($input_name)) {
			log_message('error', 'Upload Error: ' . $this->upload->display_errors('', ''));
			return false;
		}

		$upload_data = $this->upload->data();
		return rtrim($relative_dir, '/\\') . '/' . $upload_data['file_name'];
	}

	public function load_announcements()
	{
		header('Content-Type: application/json');
		$this->load->model('Announcements_model');

		try {
			$data = $this->Announcements_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_announcement()
	{
		header('Content-Type: application/json');
		$this->load->model('Announcements_model');

		try {
			$title = trim((string) $this->input->post('title'));
			$content = trim((string) $this->input->post('content'));
			$announcement_date = $this->input->post('announcement_date');

			if ($title === '' || $content === '' || empty($announcement_date)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Title, content, and date are required']);
				exit;
			}

			$image = null;
			if (!empty($_FILES['image']['name'])) {
				$image = $this->_upload_file_to('uploads/announcements', 'image', 'gif|jpg|png|jpeg|jpe', 'announcement', 5120);
				if ($image === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
					exit;
				}
			}

			$id = $this->Announcements_model->insert_announcement([
				'title' => $title,
				'content' => $content,
				'announcement_date' => $announcement_date,
				'image' => $image
			]);

			if ($id) {
				echo json_encode(['success' => true, 'message' => 'Announcement created successfully', 'id' => $id]);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save announcement: ' . $this->db->error()['message']]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_announcement()
	{
		header('Content-Type: application/json');
		$this->load->model('Announcements_model');

		try {
			$announcement_id = (int) $this->input->post('announcement_id');
			$title = trim((string) $this->input->post('title'));
			$content = trim((string) $this->input->post('content'));
			$announcement_date = $this->input->post('announcement_date');

			if ($announcement_id <= 0 || $title === '' || $content === '' || empty($announcement_date)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Announcement ID, title, content, and date are required']);
				exit;
			}

			$update_data = [
				'title' => $title,
				'content' => $content,
				'announcement_date' => $announcement_date,
			];

			if (!empty($_FILES['image']['name'])) {
				$image = $this->_upload_file_to('uploads/announcements', 'image', 'gif|jpg|png|jpeg|jpe', 'announcement', 5120);
				if ($image === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
					exit;
				}
				$update_data['image'] = $image;
			}

			$result = $this->Announcements_model->update_announcement($announcement_id, $update_data);
			if ($result) {
				echo json_encode(['success' => true, 'message' => 'Announcement updated successfully']);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to update announcement']);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_announcement()
	{
		header('Content-Type: application/json');
		$this->load->model('Announcements_model');

		try {
			$announcement_id = (int) $this->input->post('announcement_id');
			if ($announcement_id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Announcement ID required']);
				exit;
			}

			$result = $this->Announcements_model->delete_announcement($announcement_id);
			echo json_encode([
				'success' => (bool) $result,
				'message' => $result ? 'Announcement deleted successfully' : 'Failed to delete announcement'
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_events_achievements()
	{
		header('Content-Type: application/json');
		$this->load->model('Events_achievements_model');

		try {
			$data = $this->Events_achievements_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_event_achievement()
	{
		header('Content-Type: application/json');
		$this->load->model('Events_achievements_model');

		try {
			$title = trim((string) $this->input->post('title'));
			$description = trim((string) $this->input->post('description'));
			$type = $this->input->post('type');
			$event_date = $this->input->post('event_date');

			if ($title === '' || $description === '' || empty($type) || empty($event_date)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Title, description, type, and date are required']);
				exit;
			}

			if ($type !== 'Event' && $type !== 'Achievement') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Invalid type']);
				exit;
			}

			$image = null;
			if (!empty($_FILES['image']['name'])) {
				$image = $this->_upload_file_to('uploads/events_achievements', 'image', 'gif|jpg|png|jpeg|jpe', 'event', 5120);
				if ($image === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
					exit;
				}
			}

			$id = $this->Events_achievements_model->insert_event_achievement([
				'title' => $title,
				'description' => $description,
				'type' => $type,
				'event_date' => $event_date,
				'image' => $image
			]);

			if ($id) {
				echo json_encode(['success' => true, 'message' => 'Event/Achievement created successfully', 'id' => $id]);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save event/achievement: ' . $this->db->error()['message']]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function update_event_achievement()
	{
		header('Content-Type: application/json');
		$this->load->model('Events_achievements_model');

		try {
			$id = (int) $this->input->post('id');
			$title = trim((string) $this->input->post('title'));
			$description = trim((string) $this->input->post('description'));
			$type = $this->input->post('type');
			$event_date = $this->input->post('event_date');

			if ($id <= 0 || $title === '' || $description === '' || empty($type) || empty($event_date)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID, title, description, type, and date are required']);
				exit;
			}

			if ($type !== 'Event' && $type !== 'Achievement') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Invalid type']);
				exit;
			}

			$update_data = [
				'title' => $title,
				'description' => $description,
				'type' => $type,
				'event_date' => $event_date,
			];

			if (!empty($_FILES['image']['name'])) {
				$image = $this->_upload_file_to('uploads/events_achievements', 'image', 'gif|jpg|png|jpeg|jpe', 'event', 5120);
				if ($image === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
					exit;
				}
				$update_data['image'] = $image;
			}

			$result = $this->Events_achievements_model->update_event_achievement($id, $update_data);
			if ($result) {
				echo json_encode(['success' => true, 'message' => 'Event/Achievement updated successfully']);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to update event/achievement']);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_event_achievement()
	{
		header('Content-Type: application/json');
		$this->load->model('Events_achievements_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Events_achievements_model->delete_event_achievement($id);
			echo json_encode([
				'success' => (bool) $result,
				'message' => $result ? 'Event/Achievement deleted successfully' : 'Failed to delete event/achievement'
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function load_deans_list()
	{
		header('Content-Type: application/json');
		$this->load->model('Deans_list_model');

		try {
			$data = $this->Deans_list_model->get_all();
			echo json_encode(['success' => true, 'data' => $data]);
		} catch (Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function create_deans_list()
	{
		header('Content-Type: application/json');
		$this->load->model('Deans_list_model');

		try {
			$academic_year = trim((string) $this->input->post('academic_year'));
			$full_name = trim((string) $this->input->post('full_name'));
			$program = trim((string) $this->input->post('program'));
			$year_level = trim((string) $this->input->post('year_level'));
			$honors = trim((string) $this->input->post('honors'));
			$gwa = trim((string) $this->input->post('gwa'));
			$achievements = trim((string) $this->input->post('achievements'));

			if ($academic_year === '' || $full_name === '' || $program === '' || $year_level === '' || $honors === '' || $gwa === '') {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'Academic year, name, program, year level, honors, and GWA are required']);
				exit;
			}

			if (!is_numeric($gwa)) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'GWA must be a valid number']);
				exit;
			}

			$image = null;
			if (!empty($_FILES['achiever_image']['name'])) {
				$image = $this->_upload_file_to('uploads/deans_list', 'achiever_image', 'gif|jpg|png|jpeg|jpe', 'deans_achiever', 5120);
				if ($image === false) {
					http_response_code(400);
					echo json_encode(['success' => false, 'message' => 'Failed to upload achiever image.']);
					exit;
				}
			}

			$id = $this->Deans_list_model->insert_deans_list([
				'academic_year' => $academic_year,
				'full_name' => $full_name,
				'program' => $program,
				'year_level' => $year_level,
				'honors' => $honors,
				'gwa' => $gwa,
				'achievements' => $achievements !== '' ? $achievements : null,
				'image' => $image,
			]);

			if ($id) {
				echo json_encode(['success' => true, 'message' => "Dean's List achiever added successfully", 'id' => $id]);
			} else {
				http_response_code(500);
				echo json_encode(['success' => false, 'message' => 'Failed to save dean\'s list achiever: ' . $this->db->error()['message']]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	public function delete_deans_list()
	{
		header('Content-Type: application/json');
		$this->load->model('Deans_list_model');

		try {
			$id = (int) $this->input->post('id');
			if ($id <= 0) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => 'ID required']);
				exit;
			}

			$result = $this->Deans_list_model->delete_deans_list($id);
			echo json_encode([
				'success' => (bool) $result,
				'message' => $result ? "Dean's List deleted successfully" : "Failed to delete Dean's List"
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
		}
		exit;
	}

	// ==================== MGA FACULTY API mga endpoint ====================

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

			// Siguroa nga kumpleto ang mga uma sa gikinahanglang
			if (empty($input['firstname']) || empty($input['lastname']) || empty($input['position'])) {
				http_response_code(400);
				echo json_encode(array(
					'success' => false,
					'message' => 'Required fields: firstname, lastname, position'
				));
				return;
			}

			// Asikasuha ang image upload kung gihatag
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

			// Siguroa nga kumpleto ang mga uma sa gikinahanglang
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

			// Asikasuha ang pag-update sa imahe kung gihatag
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

	// Tabang nga function para sa image uploads
	private function handle_image_upload($imageData, $folder = 'faculty') {
		try {
			// Ang Base64 naka-encode nga datos kasagaran ing-ani: datos:imahe/png;base64,iVBORw0KGgo...
			if (strpos($imageData, ',') === false) {
				return null; // Dili sakto nga pormat
			}

			list($type, $data) = explode(',', $imageData);
			$data = base64_decode($data);

			// Himoa ang direktoryo kung wala pa
			$uploadDir = FCPATH . 'uploads/' . $folder;
			if (!is_dir($uploadDir)) {
				mkdir($uploadDir, 0755, true);
			}

			// Himo ug talagsaon nga filename
			$filename = $folder . '_' . time() . '_' . uniqid() . '.png';
			$filepath = $uploadDir . '/' . $filename;

			// I-save ang file
			if (file_put_contents($filepath, $data)) {
				// Ibalik ang paryente URL alang sa tipigan sa database
				return base_url('uploads/' . $folder . '/' . $filename);
			}

			return null;
		} catch (Exception $e) {
			log_message('error', 'Image upload error: ' . $e->getMessage());
			return null;
		}
	}

	private function faculty_position_config()
	{
		return [
			'president' => ['label' => 'President', 'limit' => 1],
			'vice president' => ['label' => 'Vice President', 'limit' => 4],
			'campus director' => ['label' => 'Campus Director', 'limit' => 1],
			'dean' => ['label' => 'Dean', 'limit' => 1],
			'chairperson' => ['label' => 'Chairperson', 'limit' => 2],
			'instructor' => ['label' => 'Instructor', 'limit' => null]
		];
	}

	private function normalize_manage_faculty_input($position, $vpType, $course, $advisory, $excludeId = null)
	{
		$position = trim((string) $position);
		$vpType = trim((string) $vpType);
		$course = trim((string) $course);
		$advisory = trim((string) $advisory);

		if ($position === '') {
			return ['success' => false, 'message' => 'Position is required'];
		}

		$normalized = strtolower(preg_replace('/\s+/', ' ', $position));
		$config = $this->faculty_position_config();
		if (!isset($config[$normalized])) {
			return ['success' => false, 'message' => 'Invalid position selected'];
		}

		$rule = $config[$normalized];
		$this->load->model('Faculty_users_model');

		if ($rule['limit'] !== null) {
			$current = $this->Faculty_users_model->count_by_position($normalized, $excludeId);
			if ($current >= (int) $rule['limit']) {
				return ['success' => false, 'message' => $rule['label'] . ' limit reached (' . $rule['limit'] . ')'];
			}
		}

		$finalAdvisory = $advisory;
		$finalVpType = null;
		$finalCourse = null;

		if ($normalized === 'vice president') {
			$allowedVpTypes = [
				'VP for Academics and Quality Assurance',
				'VP for Research, Development and Extension',
				'VP for Administration and Finance',
				'VP for Student Affairs and Services'
			];
			if (!in_array($vpType, $allowedVpTypes, true)) {
				return ['success' => false, 'message' => 'Please select a valid Vice President type'];
			}
			$vpCount = $this->Faculty_users_model->count_by_position_and_vp_type($normalized, $vpType, $excludeId);
			if ($vpCount >= 1) {
				return ['success' => false, 'message' => $vpType . ' is already assigned'];
			}
			$finalVpType = $vpType;
			$finalAdvisory = '';
		} elseif ($normalized === 'chairperson') {
			$allowedCourses = [
				'Bachelor of Science in Information Technology',
				'Bachelor of Science in Computer Science'
			];
			if (!in_array($course, $allowedCourses, true)) {
				return ['success' => false, 'message' => 'Please select a valid Chairperson course'];
			}
			$courseCount = $this->Faculty_users_model->count_by_position_and_course($normalized, $course, $excludeId);
			if ($courseCount >= 1) {
				return ['success' => false, 'message' => 'Chairperson for ' . $course . ' already exists'];
			}
			$finalCourse = $course;
			$finalAdvisory = '';
		} elseif ($normalized !== 'instructor') {
			$finalAdvisory = '';
		}

		return [
			'success' => true,
			'data' => [
				'position' => $rule['label'],
				'advisory' => $finalAdvisory,
				'vp_type' => $finalVpType,
				'course' => $finalCourse
			]
		];
	}

	/**
	 * AJAX: I-load ang faculty data
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
	 * AJAX: I-update ang faculty
	 */
	public function update_faculty()
	{
		header('Content-Type: application/json');

		try {
			$id = (int) $this->input->post('id');
			$firstname = trim((string) $this->input->post('firstname'));
			$lastname = trim((string) $this->input->post('lastname'));
			$position = trim((string) $this->input->post('position'));
			$advisory = trim((string) $this->input->post('advisory'));
			$vpType = trim((string) $this->input->post('vp_type'));
			$course = trim((string) $this->input->post('course'));

			// Siguroa nga sakto ang mga inputs
			if ($id <= 0 || $firstname === '' || $lastname === '' || $position === '') {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'ID, firstname, lastname, and position are required'
				]);
				exit;
			}

			$normalized = $this->normalize_manage_faculty_input($position, $vpType, $course, $advisory, $id);
			if (!$normalized['success']) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => $normalized['message']]);
				exit;
			}

			// Andama ang data para sa update
			$update_data = [
				'firstname' => $firstname,
				'lastname' => $lastname,
				'position' => $normalized['data']['position'],
				'advisory' => $normalized['data']['advisory'],
				'vp_type' => $normalized['data']['vp_type'],
				'course' => $normalized['data']['course']
			];

			// Asikasuha ang image upload kung gihatag
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

			// I-update sa database
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
	 * AJAX: I-delete ang faculty
	 */
	public function delete_faculty()
	{
		header('Content-Type: application/json');

		try {
			$id = $this->input->post('id');

			// Siguroa nga sakto ang mga inputs
			if (empty($id)) {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Faculty ID is required'
				]);
				exit;
			}

			// I-delete gikan sa database
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
	 * AJAX: I-save ang faculty uban sa sa image upload
	 */
	public function save_faculty()
	{
		header('Content-Type: application/json');

		try {
			$firstname = trim((string) $this->input->post('firstname'));
			$lastname = trim((string) $this->input->post('lastname'));
			$position = trim((string) $this->input->post('position'));
			$advisory = trim((string) $this->input->post('advisory'));
			$vpType = trim((string) $this->input->post('vp_type'));
			$course = trim((string) $this->input->post('course'));

			// Siguroa nga sakto ang mga inputs
			if ($firstname === '' || $lastname === '' || $position === '') {
				http_response_code(400);
				echo json_encode([
					'success' => false,
					'message' => 'Firstname, lastname, and position are required'
				]);
				exit;
			}

			$normalized = $this->normalize_manage_faculty_input($position, $vpType, $course, $advisory, null);
			if (!$normalized['success']) {
				http_response_code(400);
				echo json_encode(['success' => false, 'message' => $normalized['message']]);
				exit;
			}

			// Himoa ang direktoryo alang sa mga upload kung wala pa
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

			// Asikasuha ang file upload
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

			// Andama ang data para i-save
			$save_data = [
				'firstname' => $firstname,
				'lastname' => $lastname,
				'position' => $normalized['data']['position'],
				'advisory' => $normalized['data']['advisory'],
				'vp_type' => $normalized['data']['vp_type'],
				'course' => $normalized['data']['course'],
				'image' => $image_filename
			];

			// I-save sa database - siguroa nga gikarga ang modelo
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
	 * Tabang: Upload faculty image
	 */
	private function _upload_faculty_image()
	{
		// Himoa ang uploads directory kung wala pa
		$upload_dir = FCPATH . 'uploads/faculty';
		if (!is_dir($upload_dir)) {
			if (!@mkdir($upload_dir, 0755, true)) {
				log_message('error', 'Failed to create faculty upload directory');
				return false;
			}
		}

		// Siguroa nga masulatan ang upload directory
		if (!is_writable($upload_dir)) {
			log_message('error', 'Upload directory not writable: ' . $upload_dir);
			return false;
		}

		// I-set ang upload settings
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

		// Ibalik ang filename alang sa pagtipig sa database
		$upload_data = $this->upload->data();
		return $upload_data['file_name'];
	}

	// ============================================
	// MGA API nga pamaagi SA PAGDUMALA SA mga programa
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
		
		// Siguroa nga sakto ang mga inputs
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

	// ==================== Mga kalendaryo sa akademiko API (BISAYA NGA mga nota) ====================
	
	public function api_get_calendars() {
		header('Content-Type: application/json');
		$this->load->model('AcademicCalendars_model');
		
		try {
			// Tan-awa kung naa ba ang lamesa
			if (!$this->db->table_exists('academic_calendars')) {
				error_log('Academic calendars table does not exist - creating it');
				$this->create_academic_calendars_table();
				error_log('Academic calendars table created');
			}
			
			// Kuhaa ang mga kalendaryo
			$calendars = $this->AcademicCalendars_model->get_all();
			error_log('Calendars retrieved: ' . count($calendars));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $calendars,
				'count' => count($calendars)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_calendars: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving calendars: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// ==================== CURRICULUM API (BISAYA nga mga nota sa NGA) ====================
	
	public function api_get_curriculums() {
		header('Content-Type: application/json');
		error_log('=== Get Curriculums Started ===');
		
		try {
			// I-load ang modelo
			$this->load->model('Curriculum_model');
			error_log('Model loaded successfully');
			
			// Tan-awa kung naa ba ang lamesa
			if (!$this->db->table_exists('curriculum')) {
				error_log('Curriculum table does not exist - creating it');
				$this->create_curriculum_table();
				error_log('Curriculum table created');
			}
			
			// Kuhaa ang mga kurikulum
			$curriculums = $this->Curriculum_model->get_all();
			error_log('Curriculums retrieved: ' . count($curriculums));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $curriculums,
				'count' => count($curriculums)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_curriculums: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving curriculums: ' . $e->getMessage()
			]);
			exit;
		}
	}

	// ==================== Mga iskedyul sa klase API (BISAYA NGA Tala) ====================
	
	public function api_get_schedules() {
		header('Content-Type: application/json');
		error_log('=== Get Class Schedules Started ===');
		
		try {
			// I-load ang modelo
			$this->load->model('ClassSchedules_model');
			error_log('Model loaded successfully');
			
			// Tan-awa kung naa ba ang lamesa
			if (!$this->db->table_exists('class_schedules')) {
				error_log('Class schedules table does not exist - creating it');
				$this->create_class_schedules_table();
				error_log('Class schedules table created');
			}
			
			// Kuhaa ang mga eskedyul
			$schedules = $this->ClassSchedules_model->get_all();
			error_log('Schedules retrieved: ' . count($schedules));
			
			http_response_code(200);
			echo json_encode([
				'success' => true,
				'data' => $schedules,
				'count' => count($schedules)
			]);
			exit;
		} catch (Exception $e) {
			error_log('Error in get_schedules: ' . $e->getMessage());
			http_response_code(500);
			echo json_encode([
				'success' => false,
				'message' => 'Error retrieving schedules: ' . $e->getMessage()
			]);
			exit;
		}
	}
}
?>
