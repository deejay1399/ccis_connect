<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Org extends CI_Controller {

    private $org;

    public function __construct()
    {
        parent::__construct();
        $this->load->helper(['url', 'string']);
        $this->load->library(['session', 'upload']);
        $this->load->model('OrgAdmin_model');

        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }

        if ((int) $this->session->userdata('role_id') !== 4) {
            redirect('login');
        }

        $this->org = $this->OrgAdmin_model->get_user_organization((int) $this->session->userdata('user_id'));
        $this->session->set_userdata([
            'organization_slug' => $this->org['organization_slug'],
            'organization_name' => $this->org['organization_name'],
        ]);

        $this->ensure_upload_directories();
    }

    public function dashboard()
    {
        $slug = $this->org['organization_slug'];
        $data = [
            'page_title' => $this->org['organization_name'] . ' Admin Dashboard',
            'organization_name' => $this->org['organization_name'],
            'organization_slug' => $slug,
            'admin_name' => trim($this->session->userdata('first_name') . ' ' . $this->session->userdata('last_name')),
            'stats' => $this->OrgAdmin_model->get_dashboard_stats($slug),
            'officers' => $this->OrgAdmin_model->get_officers($slug),
            'advisers' => $this->OrgAdmin_model->get_advisers($slug),
            'announcements' => $this->OrgAdmin_model->get_announcements($slug),
            'happenings' => $this->OrgAdmin_model->get_happenings($slug),
        ];

        $this->load->view('pages/orgadmin/layout/header', $data);
        $this->load->view('pages/orgadmin/layout/navigation', $data);
        $this->load->view('pages/orgadmin/org_dashboard', $data);
        $this->load->view('pages/orgadmin/layout/footer', $data);
    }

    public function add_officer()
    {
        if ($this->input->method() !== 'post') {
            redirect('org/dashboard');
        }

        $name = trim((string) $this->input->post('full_name', true));
        $position = trim((string) $this->input->post('position', true));

        if ($name === '' || $position === '') {
            $this->session->set_flashdata('error', 'Officer name and position are required.');
            redirect('org/dashboard#officers');
        }

        $photo = $this->upload_image('officer_photo', 'uploads/org/officers');

        if ($photo === false) {
            redirect('org/dashboard#officers');
        }

        $this->OrgAdmin_model->add_officer($this->org['organization_slug'], [
            'full_name' => $name,
            'position' => $position,
            'photo' => $photo,
            'created_by' => (int) $this->session->userdata('user_id'),
        ]);

        $this->session->set_flashdata('success', 'Officer added successfully.');
        redirect('org/dashboard#officers');
    }

    public function update_officer($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#officers');
        }

        $name = trim((string) $this->input->post('full_name', true));
        $position = trim((string) $this->input->post('position', true));

        if ($name === '' || $position === '') {
            $this->session->set_flashdata('error', 'Officer name and position are required.');
            redirect('org/dashboard#officers');
        }

        $photo = null;
        if (!empty($_FILES['officer_photo']['name'])) {
            $photo = $this->upload_image('officer_photo', 'uploads/org/officers');
            if ($photo === null) {
                redirect('org/dashboard#officers');
            }
        }

        $this->OrgAdmin_model->update_officer((int) $id, $this->org['organization_slug'], [
            'full_name' => $name,
            'position' => $position,
            'photo' => $photo,
        ]);

        $this->session->set_flashdata('success', 'Officer updated successfully.');
        redirect('org/dashboard#officers');
    }

    public function delete_officer($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#officers');
        }

        $this->OrgAdmin_model->delete_officer((int) $id, $this->org['organization_slug']);
        $this->session->set_flashdata('success', 'Officer deleted successfully.');
        redirect('org/dashboard#officers');
    }

    public function add_adviser()
    {
        if ($this->input->method() !== 'post') {
            redirect('org/dashboard');
        }

        $name = trim((string) $this->input->post('full_name', true));
        $email = trim((string) $this->input->post('email', true));
        $position = trim((string) $this->input->post('position', true));

        if ($name === '' || $position === '') {
            $this->session->set_flashdata('error', 'Adviser name and position are required.');
            redirect('org/dashboard#advisers');
        }

        $photo = $this->upload_image('adviser_photo', 'uploads/org/advisers');

        if ($photo === false) {
            redirect('org/dashboard#advisers');
        }

        $this->OrgAdmin_model->add_adviser($this->org['organization_slug'], [
            'full_name' => $name,
            'email' => $email,
            'position' => $position,
            'photo' => $photo,
            'created_by' => (int) $this->session->userdata('user_id'),
        ]);

        $this->session->set_flashdata('success', 'Adviser added successfully.');
        redirect('org/dashboard#advisers');
    }

    public function update_adviser($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#advisers');
        }

        $name = trim((string) $this->input->post('full_name', true));
        $email = trim((string) $this->input->post('email', true));
        $position = trim((string) $this->input->post('position', true));

        if ($name === '' || $position === '') {
            $this->session->set_flashdata('error', 'Adviser name and position are required.');
            redirect('org/dashboard#advisers');
        }

        $photo = null;
        if (!empty($_FILES['adviser_photo']['name'])) {
            $photo = $this->upload_image('adviser_photo', 'uploads/org/advisers');
            if ($photo === null) {
                redirect('org/dashboard#advisers');
            }
        }

        $this->OrgAdmin_model->update_adviser((int) $id, $this->org['organization_slug'], [
            'full_name' => $name,
            'email' => $email,
            'position' => $position,
            'photo' => $photo,
        ]);

        $this->session->set_flashdata('success', 'Adviser updated successfully.');
        redirect('org/dashboard#advisers');
    }

    public function delete_adviser($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#advisers');
        }

        $this->OrgAdmin_model->delete_adviser((int) $id, $this->org['organization_slug']);
        $this->session->set_flashdata('success', 'Adviser deleted successfully.');
        redirect('org/dashboard#advisers');
    }

    public function add_announcement()
    {
        if ($this->input->method() !== 'post') {
            redirect('org/dashboard');
        }

        $title = trim((string) $this->input->post('title', true));
        $content = trim((string) $this->input->post('content', true));
        $event_date = $this->input->post('event_date', true);

        if ($title === '' || $content === '') {
            $this->session->set_flashdata('error', 'Announcement title and content are required.');
            redirect('org/dashboard#announcements');
        }

        $image = $this->upload_image('announcement_image', 'uploads/org/announcements');
        if ($image === false) {
            redirect('org/dashboard#announcements');
        }

        $this->OrgAdmin_model->add_announcement($this->org['organization_slug'], [
            'title' => $title,
            'content' => $content,
            'event_date' => $event_date,
            'image' => $image,
            'created_by' => (int) $this->session->userdata('user_id'),
        ]);

        $this->session->set_flashdata('success', 'Announcement posted successfully.');
        redirect('org/dashboard#announcements');
    }

    public function update_announcement($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#announcements');
        }

        $title = trim((string) $this->input->post('title', true));
        $content = trim((string) $this->input->post('content', true));
        $event_date = $this->input->post('event_date', true);

        if ($title === '' || $content === '') {
            $this->session->set_flashdata('error', 'Announcement title and content are required.');
            redirect('org/dashboard#announcements');
        }

        $image = null;
        if (!empty($_FILES['announcement_image']['name'])) {
            $image = $this->upload_image('announcement_image', 'uploads/org/announcements');
            if ($image === null) {
                redirect('org/dashboard#announcements');
            }
        }

        $this->OrgAdmin_model->update_announcement((int) $id, $this->org['organization_slug'], [
            'title' => $title,
            'content' => $content,
            'event_date' => $event_date,
            'image' => $image,
        ]);

        $this->session->set_flashdata('success', 'Announcement updated successfully.');
        redirect('org/dashboard#announcements');
    }

    public function delete_announcement($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#announcements');
        }

        $this->OrgAdmin_model->delete_announcement((int) $id, $this->org['organization_slug']);
        $this->session->set_flashdata('success', 'Announcement deleted successfully.');
        redirect('org/dashboard#announcements');
    }

    public function add_happening()
    {
        if ($this->input->method() !== 'post') {
            redirect('org/dashboard');
        }

        $title = trim((string) $this->input->post('title', true));
        $description = trim((string) $this->input->post('description', true));
        $event_date = $this->input->post('event_date', true);

        if ($title === '' || $description === '') {
            $this->session->set_flashdata('error', 'Happening title and description are required.');
            redirect('org/dashboard#happenings');
        }

        $images = $this->upload_multiple_images('happening_images', 'uploads/org/happenings');
        if ($images === null) {
            redirect('org/dashboard#happenings');
        }

        // Paatras pagkaangay: modawat daan nga single uma kon anaa.
        if (empty($images)) {
            $singleImage = $this->upload_image('happening_image', 'uploads/org/happenings');
            if ($singleImage === null) {
                redirect('org/dashboard#happenings');
            }
            if ($singleImage !== false) {
                $images[] = $singleImage;
            }
        }

        if (empty($images)) {
            $this->session->set_flashdata('error', 'Please upload at least one happening image.');
            redirect('org/dashboard#happenings');
        }

        $happening_id = $this->OrgAdmin_model->add_happening($this->org['organization_slug'], [
            'title' => $title,
            'description' => $description,
            'event_date' => $event_date,
            'image' => $images[0],
            'created_by' => (int) $this->session->userdata('user_id'),
        ]);

        if (!$happening_id) {
            $this->session->set_flashdata('error', 'Failed to save happening.');
            redirect('org/dashboard#happenings');
        }

        $this->OrgAdmin_model->set_happening_images($happening_id, $this->org['organization_slug'], $images);

        $this->session->set_flashdata('success', 'Happening saved successfully.');
        redirect('org/dashboard#happenings');
    }

    public function update_happening($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#happenings');
        }

        $title = trim((string) $this->input->post('title', true));
        $description = trim((string) $this->input->post('description', true));
        $event_date = $this->input->post('event_date', true);

        if ($title === '' || $description === '') {
            $this->session->set_flashdata('error', 'Happening title and description are required.');
            redirect('org/dashboard#happenings');
        }

        $images = $this->upload_multiple_images('happening_images', 'uploads/org/happenings');
        if ($images === null) {
            redirect('org/dashboard#happenings');
        }

        // Balik nga pagkaangay: daan nga nag-inusara nga natad.
        if (empty($images) && !empty($_FILES['happening_image']['name'])) {
            $singleImage = $this->upload_image('happening_image', 'uploads/org/happenings');
            if ($singleImage === null) {
                redirect('org/dashboard#happenings');
            }
            if ($singleImage !== false) {
                $images[] = $singleImage;
            }
        }

        $this->OrgAdmin_model->update_happening((int) $id, $this->org['organization_slug'], [
            'title' => $title,
            'description' => $description,
            'event_date' => $event_date,
            'image' => !empty($images) ? $images[0] : null,
        ]);

        if (!empty($images)) {
            $this->OrgAdmin_model->set_happening_images((int) $id, $this->org['organization_slug'], $images);
        }

        $this->session->set_flashdata('success', 'Happening updated successfully.');
        redirect('org/dashboard#happenings');
    }

    public function delete_happening($id = null)
    {
        if ($this->input->method() !== 'post' || !$id) {
            redirect('org/dashboard#happenings');
        }

        $this->OrgAdmin_model->delete_happening((int) $id, $this->org['organization_slug']);
        $this->session->set_flashdata('success', 'Happening deleted successfully.');
        redirect('org/dashboard#happenings');
    }

    private function upload_image($field_name, $relative_dir)
    {
        if (empty($_FILES[$field_name]['name'])) {
            return false;
        }

        $upload_dir = FCPATH . trim($relative_dir, '/');
        if (!is_dir($upload_dir)) {
            @mkdir($upload_dir, 0755, true);
        }

        $config = [
            'upload_path' => $upload_dir,
            'allowed_types' => 'gif|jpg|jpeg|png|webp',
            'max_size' => 5120,
            'file_name' => strtolower($field_name . '_' . time() . '_' . random_string('alnum', 8)),
            'overwrite' => false,
            'encrypt_name' => false,
        ];

        $this->upload->initialize($config);

        if (!$this->upload->do_upload($field_name)) {
            $this->session->set_flashdata('error', strip_tags($this->upload->display_errors()));
            return null;
        }

        $data = $this->upload->data();
        return $data['file_name'];
    }

    private function upload_multiple_images($field_name, $relative_dir)
    {
        if (
            !isset($_FILES[$field_name]) ||
            !isset($_FILES[$field_name]['name']) ||
            !is_array($_FILES[$field_name]['name']) ||
            count(array_filter($_FILES[$field_name]['name'])) === 0
        ) {
            return [];
        }

        $upload_dir = FCPATH . trim($relative_dir, '/');
        if (!is_dir($upload_dir)) {
            @mkdir($upload_dir, 0755, true);
        }

        $uploaded = [];
        $names = $_FILES[$field_name]['name'];
        $tmpNames = $_FILES[$field_name]['tmp_name'];
        $types = $_FILES[$field_name]['type'];
        $sizes = $_FILES[$field_name]['size'];
        $errors = $_FILES[$field_name]['error'];

        foreach ($names as $i => $name) {
            $name = trim((string) $name);
            if ($name === '') {
                continue;
            }

            $_FILES['__multi_upload'] = [
                'name' => $name,
                'type' => isset($types[$i]) ? $types[$i] : '',
                'tmp_name' => isset($tmpNames[$i]) ? $tmpNames[$i] : '',
                'error' => isset($errors[$i]) ? $errors[$i] : 4,
                'size' => isset($sizes[$i]) ? $sizes[$i] : 0,
            ];

            $config = [
                'upload_path' => $upload_dir,
                'allowed_types' => 'gif|jpg|jpeg|png|webp',
                'max_size' => 5120,
                'file_name' => strtolower('happening_' . time() . '_' . $i . '_' . random_string('alnum', 8)),
                'overwrite' => false,
                'encrypt_name' => false,
            ];

            $this->upload->initialize($config);

            if (!$this->upload->do_upload('__multi_upload')) {
                $this->session->set_flashdata('error', strip_tags($this->upload->display_errors()));
                unset($_FILES['__multi_upload']);
                return null;
            }

            $data = $this->upload->data();
            if (!empty($data['file_name'])) {
                $uploaded[] = $data['file_name'];
            }
        }

        unset($_FILES['__multi_upload']);
        return $uploaded;
    }

    private function ensure_upload_directories()
    {
        $directories = [
            'uploads/org',
            'uploads/org/officers',
            'uploads/org/advisers',
            'uploads/org/announcements',
            'uploads/org/happenings',
        ];

        foreach ($directories as $dir) {
            $full_path = FCPATH . trim($dir, '/');
            if (!is_dir($full_path)) {
                @mkdir($full_path, 0755, true);
            }
        }
    }
}

