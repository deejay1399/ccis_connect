<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Alumni_model extends CI_Model {

    private $mentor_table = 'alumni_mentor_requests';
    private $chatbot_table = 'alumni_chatbot_inquiries';
    private $connection_table = 'alumni_connection_requests';
    private $updates_table = 'alumni_updates';
    private $giveback_table = 'alumni_giveback';
    private $featured_table = 'alumni_featured';
    private $directory_table = 'alumni_directory';
    private $stories_table = 'alumni_success_stories';
    private $events_table = 'alumni_events';

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->ensure_notification_read_columns();
    }

    private function ensure_notification_read_columns() {
        $tables = [
            $this->mentor_table,
            $this->chatbot_table,
            $this->connection_table,
            $this->giveback_table
        ];

        $this->load->dbforge();

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

        // Support flexible schemas by only inserting columns that exist.
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
        return $this->db->order_by('created_at', 'DESC')->get($this->featured_table)->result_array();
    }

    public function insert_featured($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        if ($this->db->insert($this->featured_table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    public function delete_featured($id) {
        return $this->db->where('id', $id)->delete($this->featured_table);
    }

    public function get_all_directory() {
        return $this->db->order_by('created_at', 'DESC')->get($this->directory_table)->result_array();
    }

    public function insert_directory($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
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
