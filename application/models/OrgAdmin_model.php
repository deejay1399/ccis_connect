<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class OrgAdmin_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->dbforge();
        $this->ensure_schema();
    }

    private function ensure_schema()
    {
        $this->db->query("CREATE TABLE IF NOT EXISTS org_admin_profiles (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            organization_slug VARCHAR(100) NOT NULL,
            organization_name VARCHAR(150) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uq_org_admin_user (user_id),
            KEY idx_org_slug (organization_slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $this->db->query("CREATE TABLE IF NOT EXISTS org_officers (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            organization_slug VARCHAR(100) NOT NULL,
            full_name VARCHAR(150) NOT NULL,
            position VARCHAR(120) NOT NULL,
            photo VARCHAR(255) NULL,
            created_by INT UNSIGNED NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_officers_org (organization_slug),
            KEY idx_officers_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $this->db->query("CREATE TABLE IF NOT EXISTS org_advisers (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            organization_slug VARCHAR(100) NOT NULL,
            full_name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NULL,
            position VARCHAR(120) NOT NULL,
            photo VARCHAR(255) NULL,
            created_by INT UNSIGNED NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_advisers_org (organization_slug),
            KEY idx_advisers_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $this->db->query("CREATE TABLE IF NOT EXISTS org_announcements (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            organization_slug VARCHAR(100) NOT NULL,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            event_date DATE NULL,
            image VARCHAR(255) NULL,
            created_by INT UNSIGNED NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_announcements_org (organization_slug),
            KEY idx_announcements_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $this->db->query("CREATE TABLE IF NOT EXISTS org_happenings (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            organization_slug VARCHAR(100) NOT NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            event_date DATE NULL,
            image VARCHAR(255) NULL,
            created_by INT UNSIGNED NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_happenings_org (organization_slug),
            KEY idx_happenings_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $this->db->query("CREATE TABLE IF NOT EXISTS org_happening_images (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            happening_id INT UNSIGNED NOT NULL,
            organization_slug VARCHAR(100) NOT NULL,
            image VARCHAR(255) NOT NULL,
            sort_order INT UNSIGNED NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_happening_images_happening (happening_id),
            KEY idx_happening_images_org (organization_slug),
            KEY idx_happening_images_sort (sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        if (!$this->db->field_exists('image', 'org_announcements')) {
            $this->dbforge->add_column('org_announcements', [
                'image' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'after' => 'event_date',
                ],
            ]);
        }
    }

    public function get_user_organization($user_id)
    {
        $row = $this->db->where('user_id', (int) $user_id)->get('org_admin_profiles')->row_array();
        if ($row) {
            return $row;
        }

        return [
            'organization_slug' => 'unassigned',
            'organization_name' => 'Unassigned Organization',
        ];
    }

    public function set_user_organization($user_id, $organization_value, $organization_custom = '')
    {
        $org = $this->normalize_organization($organization_value, $organization_custom);

        $payload = [
            'user_id' => (int) $user_id,
            'organization_slug' => $org['slug'],
            'organization_name' => $org['name'],
        ];

        $existing = $this->db->where('user_id', (int) $user_id)->get('org_admin_profiles')->row();
        if ($existing) {
            return $this->db->where('user_id', (int) $user_id)->update('org_admin_profiles', $payload);
        }

        return $this->db->insert('org_admin_profiles', $payload);
    }

    public function normalize_organization($organization_value, $organization_custom = '')
    {
        $value = trim((string) $organization_value);
        $custom = trim((string) $organization_custom);

        if ($value === 'the_legion') {
            return ['slug' => 'the_legion', 'name' => 'The Legion'];
        }

        if ($value === 'csguild') {
            return ['slug' => 'csguild', 'name' => 'CS Guild'];
        }

        if ($value === 'other' && $custom !== '') {
            $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '_', $custom), '_'));
            if ($slug === '') {
                $slug = 'organization';
            }

            return ['slug' => $slug, 'name' => $custom];
        }

        if ($value !== '') {
            $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '_', $value), '_'));
            $name = ucwords(str_replace('_', ' ', $value));
            return ['slug' => $slug, 'name' => $name];
        }

        return ['slug' => 'unassigned', 'name' => 'Unassigned Organization'];
    }

    public function get_dashboard_stats($organization_slug)
    {
        $slug = (string) $organization_slug;

        return [
            'officers' => (int) $this->db->where('organization_slug', $slug)->count_all_results('org_officers'),
            'advisers' => (int) $this->db->where('organization_slug', $slug)->count_all_results('org_advisers'),
            'announcements' => (int) $this->db->where('organization_slug', $slug)->count_all_results('org_announcements'),
            'happenings' => (int) $this->db->where('organization_slug', $slug)->count_all_results('org_happenings'),
        ];
    }

    public function get_officers($organization_slug)
    {
        return $this->db->where('organization_slug', $organization_slug)
            ->order_by('created_at', 'DESC')
            ->get('org_officers')
            ->result_array();
    }

    public function add_officer($organization_slug, $data)
    {
        $payload = [
            'organization_slug' => $organization_slug,
            'full_name' => trim((string) $data['full_name']),
            'position' => trim((string) $data['position']),
            'photo' => isset($data['photo']) ? $data['photo'] : null,
            'created_by' => isset($data['created_by']) ? (int) $data['created_by'] : null,
        ];

        return $this->db->insert('org_officers', $payload);
    }

    public function update_officer($id, $organization_slug, $data)
    {
        $payload = [
            'full_name' => trim((string) $data['full_name']),
            'position' => trim((string) $data['position']),
        ];

        if (array_key_exists('photo', $data) && $data['photo'] !== null) {
            $payload['photo'] = $data['photo'];
        }

        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->update('org_officers', $payload);
    }

    public function delete_officer($id, $organization_slug)
    {
        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->delete('org_officers');
    }

    public function get_advisers($organization_slug)
    {
        return $this->db->where('organization_slug', $organization_slug)
            ->order_by('created_at', 'DESC')
            ->get('org_advisers')
            ->result_array();
    }

    public function add_adviser($organization_slug, $data)
    {
        $payload = [
            'organization_slug' => $organization_slug,
            'full_name' => trim((string) $data['full_name']),
            'email' => trim((string) $data['email']),
            'position' => trim((string) $data['position']),
            'photo' => isset($data['photo']) ? $data['photo'] : null,
            'created_by' => isset($data['created_by']) ? (int) $data['created_by'] : null,
        ];

        return $this->db->insert('org_advisers', $payload);
    }

    public function update_adviser($id, $organization_slug, $data)
    {
        $payload = [
            'full_name' => trim((string) $data['full_name']),
            'email' => trim((string) $data['email']),
            'position' => trim((string) $data['position']),
        ];

        if (array_key_exists('photo', $data) && $data['photo'] !== null) {
            $payload['photo'] = $data['photo'];
        }

        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->update('org_advisers', $payload);
    }

    public function delete_adviser($id, $organization_slug)
    {
        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->delete('org_advisers');
    }

    public function get_announcements($organization_slug)
    {
        return $this->db->where('organization_slug', $organization_slug)
            ->order_by('created_at', 'DESC')
            ->get('org_announcements')
            ->result_array();
    }

    public function add_announcement($organization_slug, $data)
    {
        $payload = [
            'organization_slug' => $organization_slug,
            'title' => trim((string) $data['title']),
            'content' => trim((string) $data['content']),
            'event_date' => !empty($data['event_date']) ? $data['event_date'] : null,
            'image' => isset($data['image']) ? $data['image'] : null,
            'created_by' => isset($data['created_by']) ? (int) $data['created_by'] : null,
        ];

        return $this->db->insert('org_announcements', $payload);
    }

    public function update_announcement($id, $organization_slug, $data)
    {
        $payload = [
            'title' => trim((string) $data['title']),
            'content' => trim((string) $data['content']),
            'event_date' => !empty($data['event_date']) ? $data['event_date'] : null,
        ];

        if (array_key_exists('image', $data) && $data['image'] !== null) {
            $payload['image'] = $data['image'];
        }

        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->update('org_announcements', $payload);
    }

    public function delete_announcement($id, $organization_slug)
    {
        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->delete('org_announcements');
    }

    public function get_happenings($organization_slug)
    {
        $rows = $this->db->where('organization_slug', $organization_slug)
            ->order_by('created_at', 'DESC')
            ->get('org_happenings')
            ->result_array();

        return $this->attach_happening_images($rows);
    }

    public function add_happening($organization_slug, $data)
    {
        $payload = [
            'organization_slug' => $organization_slug,
            'title' => trim((string) $data['title']),
            'description' => trim((string) $data['description']),
            'event_date' => !empty($data['event_date']) ? $data['event_date'] : null,
            'image' => isset($data['image']) ? $data['image'] : null,
            'created_by' => isset($data['created_by']) ? (int) $data['created_by'] : null,
        ];

        $ok = $this->db->insert('org_happenings', $payload);
        if (!$ok) {
            return false;
        }

        return (int) $this->db->insert_id();
    }

    public function update_happening($id, $organization_slug, $data)
    {
        $payload = [
            'title' => trim((string) $data['title']),
            'description' => trim((string) $data['description']),
            'event_date' => !empty($data['event_date']) ? $data['event_date'] : null,
        ];

        if (array_key_exists('image', $data) && $data['image'] !== null) {
            $payload['image'] = $data['image'];
        }

        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->update('org_happenings', $payload);
    }

    public function delete_happening($id, $organization_slug)
    {
        $this->db
            ->where('happening_id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->delete('org_happening_images');

        return $this->db
            ->where('id', (int) $id)
            ->where('organization_slug', (string) $organization_slug)
            ->delete('org_happenings');
    }

    public function set_happening_images($happening_id, $organization_slug, $images)
    {
        $happening_id = (int) $happening_id;
        $organization_slug = (string) $organization_slug;
        $images = is_array($images) ? $images : [];

        $this->db
            ->where('happening_id', $happening_id)
            ->where('organization_slug', $organization_slug)
            ->delete('org_happening_images');

        $sort = 0;
        foreach ($images as $img) {
            $img = trim((string) $img);
            if ($img === '') {
                continue;
            }

            $this->db->insert('org_happening_images', [
                'happening_id' => $happening_id,
                'organization_slug' => $organization_slug,
                'image' => $img,
                'sort_order' => $sort++,
            ]);
        }

        return true;
    }

    private function attach_happening_images($rows)
    {
        if (!is_array($rows) || empty($rows)) {
            return [];
        }

        $ids = [];
        foreach ($rows as $row) {
            $id = (int) ($row['id'] ?? 0);
            if ($id > 0) {
                $ids[] = $id;
            }
        }

        $imageMap = [];
        if (!empty($ids)) {
            $images = $this->db
                ->where_in('happening_id', $ids)
                ->order_by('sort_order', 'ASC')
                ->order_by('id', 'ASC')
                ->get('org_happening_images')
                ->result_array();

            foreach ($images as $imgRow) {
                $hid = (int) ($imgRow['happening_id'] ?? 0);
                $filename = trim((string) ($imgRow['image'] ?? ''));
                if ($hid <= 0 || $filename === '') {
                    continue;
                }
                if (!isset($imageMap[$hid])) {
                    $imageMap[$hid] = [];
                }
                $imageMap[$hid][] = $filename;
            }
        }

        foreach ($rows as &$row) {
            $id = (int) ($row['id'] ?? 0);
            $legacyImage = trim((string) ($row['image'] ?? ''));
            $images = isset($imageMap[$id]) ? $imageMap[$id] : [];

            if (empty($images) && $legacyImage !== '') {
                $images = [$legacyImage];
            }

            $row['images'] = $images;
            if (!empty($images)) {
                $row['image'] = $images[0];
            }
        }
        unset($row);

        return $rows;
    }
}

