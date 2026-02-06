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
    }

    public function get_all_mentor_requests() {
        return $this->db->order_by('created_at', 'DESC')->get($this->mentor_table)->result_array();
    }

    public function update_mentor_status($id, $status) {
        return $this->db->where('id', $id)->update($this->mentor_table, ['status' => $status]);
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

    public function get_all_connection_requests() {
        return $this->db->order_by('created_at', 'DESC')->get($this->connection_table)->result_array();
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
        return $this->db->order_by('created_at', 'DESC')->get($this->giveback_table)->result_array();
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
