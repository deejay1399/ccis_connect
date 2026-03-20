<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Alumni_model extends CI_Model {

    private $mentor_table = 'alumni_mentor_requests';
    private $chatbot_table = 'alumni_chatbot_inquiries';
    private $connection_table = 'alumni_connection_requests';
    private $updates_table = 'alumni_updates';
    private $giveback_table = 'alumni_giveback';
    private $featured_table = 'alumni_featured';
    private $featured_media_table = 'alumni_featured_media';
    private $directory_table = 'alumni_directory';
    private $stories_table = 'alumni_success_stories';
    private $events_table = 'alumni_events';

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->dbforge();
        $this->ensure_notification_read_columns();
        $this->ensure_directory_schema();
        $this->ensure_featured_media_table();
    }

    private function ensure_notification_read_columns() {
        $tables = [
            $this->mentor_table,
            $this->chatbot_table,
            $this->connection_table,
            $this->giveback_table
        ];

        foreach ($tables as $table) {
            if ($this->db->table_exists($table) && !$this->db->field_exists('notification_read', $table)) {
                $this->dbforge->add_column($table, [
                    'notification_read' => [
                        'type' => 'TINYINT',
                        'constraint' => 1,
                        'default' => 0,
                        'null' => false
                    ]
                ]);
            }
        }
    }

    private function ensure_directory_schema() {
        if (!$this->db->table_exists($this->directory_table)) {
            return;
        }

        if (!$this->db->field_exists('images_json', $this->directory_table)) {
            $this->dbforge->add_column($this->directory_table, [
                'images_json' => [
                    'type' => 'TEXT',
                    'null' => true,
                    'after' => 'photo'
                ]
            ]);
        }
    }

    private function ensure_featured_media_table() {
        if ($this->db->table_exists($this->featured_media_table)) {
            return;
        }

        $this->dbforge->add_field([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'featured_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => false
            ],
            'media_type' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false
            ],
            'media_path' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('featured_id');
        $this->dbforge->create_table($this->featured_media_table, true);
    }

    private function normalize_featured_row($row, $media_row = null) {
        if (!is_array($row)) {
            return [];
        }

        $row['photo'] = !empty($row['photo']) ? trim((string) $row['photo']) : null;
        $row['video'] = !empty($row['video']) ? trim((string) $row['video']) : null;

        if (is_array($media_row)) {
            $media_type = trim((string) ($media_row['media_type'] ?? ''));
            $media_path = trim((string) ($media_row['media_path'] ?? ''));

            if ($media_type === 'photo') {
                $row['photo'] = $media_path !== '' ? $media_path : $row['photo'];
                $row['video'] = null;
                $row['media_type'] = 'photo';
            } elseif ($media_type === 'video') {
                $row['video'] = $media_path !== '' ? $media_path : $row['video'];
                $row['media_type'] = 'video';
            }
        }

        $mediaType = trim((string) ($row['media_type'] ?? ''));
        if ($mediaType === '') {
            if (!empty($row['video'])) {
                $mediaType = 'video';
            } elseif (!empty($row['photo'])) {
                $mediaType = 'photo';
            } else {
                $mediaType = 'none';
            }
        }

        $row['media_type'] = $mediaType;

        return $row;
    }

    private function get_featured_media_map($featured_ids) {
        $featured_ids = array_values(array_filter(array_map('intval', (array) $featured_ids)));
        if (empty($featured_ids) || !$this->db->table_exists($this->featured_media_table)) {
            return [];
        }

        $rows = $this->db
            ->where_in('featured_id', $featured_ids)
            ->order_by('id', 'DESC')
            ->get($this->featured_media_table)
            ->result_array();

        $map = [];
        foreach ($rows as $row) {
            $featured_id = (int) ($row['featured_id'] ?? 0);
            if ($featured_id > 0 && !isset($map[$featured_id])) {
                $map[$featured_id] = $row;
            }
        }

        return $map;
    }

    private function save_featured_media($featured_id, $media_type, $media_path) {
        $featured_id = (int) $featured_id;
        $media_type = trim((string) $media_type);
        $media_path = trim((string) $media_path);

        if ($featured_id <= 0 || $media_type === '' || $media_path === '' || !$this->db->table_exists($this->featured_media_table)) {
            return false;
        }

        $this->db->where('featured_id', $featured_id)->delete($this->featured_media_table);

        return $this->db->insert($this->featured_media_table, [
            'featured_id' => $featured_id,
            'media_type' => $media_type,
            'media_path' => $media_path,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    public function delete_featured_media($featured_id) {
        $featured_id = (int) $featured_id;
        if ($featured_id <= 0 || !$this->db->table_exists($this->featured_media_table)) {
            return true;
        }

        return $this->db->where('featured_id', $featured_id)->delete($this->featured_media_table);
    }

    private function normalize_directory_row($row) {
        if (!is_array($row)) {
            return [];
        }

        $images = [];
        if (!empty($row['images_json'])) {
            $decoded = json_decode((string) $row['images_json'], true);
            if (is_array($decoded)) {
                foreach ($decoded as $path) {
                    $path = trim((string) $path);
                    if ($path !== '') {
                        $images[] = $path;
                    }
                }
            }
        }

        if (empty($images) && !empty($row['photo'])) {
            $images[] = (string) $row['photo'];
        }

        if (empty($row['photo']) && !empty($images)) {
            $row['photo'] = $images[0];
        }

        $row['images'] = array_values(array_unique($images));
        $row['images_json'] = !empty($row['images']) ? json_encode($row['images']) : null;

        return $row;
    }

    public function get_all_mentor_requests() {
        $mentorRows = $this->db
            ->select("id, name, email, expertise, status, created_at, NULL AS batch, 'mentor_requests' AS source, COALESCE(notification_read, 0) AS notification_read", false)
            ->get($this->mentor_table)
            ->result_array();

        $givebackMentorRows = $this->db
            ->select("id, author AS name, email, description AS expertise, status, COALESCE(created_at, submission_date) AS created_at, batch, 'giveback' AS source, COALESCE(notification_read, 0) AS notification_read", false)
            ->where("LOWER(title) = 'mentor'", null, false)
            ->get($this->giveback_table)
            ->result_array();

        $merged = array_merge($mentorRows, $givebackMentorRows);

        usort($merged, function ($a, $b) {
            $aTime = isset($a['created_at']) ? strtotime($a['created_at']) : 0;
            $bTime = isset($b['created_at']) ? strtotime($b['created_at']) : 0;
            return $bTime <=> $aTime;
        });

        return $merged;
    }

    public function update_mentor_status($id, $status, $source = 'mentor_requests') {
        if (strtolower((string) $status) === 'read') {
            if ($source === 'giveback') {
                return $this->db
                    ->where('id', $id)
                    ->where("LOWER(title) = 'mentor'", null, false)
                    ->update($this->giveback_table, ['notification_read' => 1]);
            }

            return $this->db
                ->where('id', $id)
                ->update($this->mentor_table, ['notification_read' => 1]);
        }

        if ($source === 'giveback') {
            return $this->db
                ->where('id', $id)
                ->where("LOWER(title) = 'mentor'", null, false)
                ->update($this->giveback_table, ['status' => $status]);
        }

        return $this->db
            ->where('id', $id)
            ->update($this->mentor_table, ['status' => $status]);
    }

    public function insert_mentor_request($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->mentor_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function get_all_chatbot_inquiries() {
        return $this->db->order_by('created_at', 'DESC')->get($this->chatbot_table)->result_array();
    }

    public function update_chatbot_status($id, $status) {
        if (strtolower((string) $status) === 'read') {
            if ($this->db->field_exists('notification_read', $this->chatbot_table)) {
                return $this->db->where('id', $id)->update($this->chatbot_table, ['notification_read' => 1]);
            }
            return false;
        }

        if (!$this->db->field_exists('status', $this->chatbot_table)) {
            return false;
        }
        return $this->db->where('id', $id)->update($this->chatbot_table, ['status' => $status]);
    }

    public function insert_chatbot_inquiry($data) {
        if (!$this->db->table_exists($this->chatbot_table)) {
            return false;
        }

        $payload = array();

        // Pagsuporta sa mga nabag-o nga laraw pinaagi sa pagsulud ra sa mga kolum nga adunay.
        $columns = $this->db->list_fields($this->chatbot_table);

        if (in_array('name', $columns)) {
            $payload['name'] = isset($data['name']) ? $data['name'] : 'Website Visitor';
        }
        if (in_array('question', $columns)) {
            $payload['question'] = isset($data['question']) ? $data['question'] : '';
        }
        if (in_array('category', $columns)) {
            $payload['category'] = isset($data['category']) ? $data['category'] : 'general';
        }
        if (in_array('status', $columns)) {
            $payload['status'] = isset($data['status']) ? $data['status'] : 'pending';
        }
        if (in_array('inquiry_date', $columns)) {
            $payload['inquiry_date'] = date('Y-m-d');
        }
        if (in_array('created_at', $columns)) {
            $payload['created_at'] = date('Y-m-d H:i:s');
        }
        if (in_array('updated_at', $columns)) {
            $payload['updated_at'] = date('Y-m-d H:i:s');
        }

        if (empty($payload)) {
            return false;
        }

        if ($this->db->insert($this->chatbot_table, $payload)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function get_all_connection_requests() {
        return $this->db->order_by('created_at', 'DESC')->get($this->connection_table)->result_array();
    }

    public function update_connection_status($id, $status) {
        if (strtolower((string) $status) === 'read') {
            return $this->db->where('id', $id)->update($this->connection_table, ['notification_read' => 1]);
        }
        return $this->db->where('id', $id)->update($this->connection_table, ['status' => $status]);
    }

    public function insert_connection_request($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->connection_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function get_all_updates() {
        return $this->db->order_by('created_at', 'DESC')->get($this->updates_table)->result_array();
    }

    public function update_update_status($id, $status) {
        return $this->db->where('id', $id)->update($this->updates_table, ['status' => $status]);
    }

    public function insert_update($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->updates_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function get_all_giveback() {
        return $this->db
            ->select('*, COALESCE(notification_read, 0) AS notification_read', false)
            ->where("LOWER(title) <> 'mentor'", null, false)
            ->order_by('created_at', 'DESC')
            ->get($this->giveback_table)
            ->result_array();
    }

    public function update_giveback_status($id, $status) {
        if (strtolower((string) $status) === 'read') {
            return $this->db->where('id', $id)->update($this->giveback_table, ['notification_read' => 1]);
        }
        return $this->db->where('id', $id)->update($this->giveback_table, ['status' => $status]);
    }

    public function insert_giveback($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->giveback_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function get_all_featured() {
        $rows = $this->db->order_by('created_at', 'DESC')->get($this->featured_table)->result_array();
        $media_map = $this->get_featured_media_map(array_column($rows, 'id'));

        return array_map(function($row) use ($media_map) {
            $featured_id = (int) ($row['id'] ?? 0);
            $media_row = isset($media_map[$featured_id]) ? $media_map[$featured_id] : null;
            return $this->normalize_featured_row($row, $media_row);
        }, $rows);
    }

    public function get_featured_by_id($id) {
        $row = $this->db->where('id', (int) $id)->get($this->featured_table)->row_array();
        if (!$row) {
            return null;
        }

        $media_map = $this->get_featured_media_map([(int) $id]);
        $media_row = isset($media_map[(int) $id]) ? $media_map[(int) $id] : null;
        return $this->normalize_featured_row($row, $media_row);
    }

    public function insert_featured($data) {
        $media_type = trim((string) ($data['media_type'] ?? ''));
        $photo = trim((string) ($data['photo'] ?? ''));
        $video = trim((string) ($data['video'] ?? ''));
        $media_path = '';

        if ($media_type === 'video' && $video !== '') {
            $media_path = $video;
        } elseif (($media_type === 'photo' || ($media_type === '' && $photo !== '')) && $photo !== '') {
            $media_type = 'photo';
            $media_path = $photo;
        }

        unset($data['photo'], $data['video'], $data['media_type']);
        $data['created_at'] = date('Y-m-d H:i:s');

        $this->db->trans_begin();

        if ($this->db->insert($this->featured_table, $data)) {
            $featured_id = $this->db->insert_id();

            if ($media_path !== '') {
                $saved = $this->save_featured_media($featured_id, $media_type, $media_path);
                if (!$saved) {
                    $this->db->trans_rollback();
                    return false;
                }
            }

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                return false;
            }

            $this->db->trans_commit();
            return $featured_id;
        }

        $this->db->trans_rollback();
        return false;
    }

    public function delete_featured($id) {
        $id = (int) $id;
        $this->db->trans_begin();
        $this->delete_featured_media($id);
        $this->db->where('id', $id)->delete($this->featured_table);

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            return false;
        }

        $this->db->trans_commit();
        return true;
    }

    public function get_all_directory() {
        $rows = $this->db->order_by('created_at', 'DESC')->get($this->directory_table)->result_array();
        return array_map([$this, 'normalize_directory_row'], $rows);
    }

    public function get_directory_by_id($id) {
        $row = $this->db->where('id', (int) $id)->get($this->directory_table)->row_array();
        return $row ? $this->normalize_directory_row($row) : null;
    }

    public function insert_directory($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if (empty($data['photo']) && !empty($data['images_json'])) {
            $decoded = json_decode((string) $data['images_json'], true);
            if (is_array($decoded) && !empty($decoded[0])) {
                $data['photo'] = (string) $decoded[0];
            }
        }
        if ($this->db->insert($this->directory_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function delete_directory($id) {
        return $this->db->where('id', $id)->delete($this->directory_table);
    }

    public function get_all_stories() {
        return $this->db->order_by('created_at', 'DESC')->get($this->stories_table)->result_array();
    }

    public function insert_story($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->stories_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function delete_story($id) {
        return $this->db->where('id', $id)->delete($this->stories_table);
    }

    public function get_all_events() {
        return $this->db->order_by('created_at', 'DESC')->get($this->events_table)->result_array();
    }

    public function insert_event($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->events_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function delete_event($id) {
        return $this->db->where('id', $id)->delete($this->events_table);
    }
}
?>
