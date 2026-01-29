<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Faculty_users_model extends CI_Model {

    private $table = 'faculty_users';

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Get all faculty members
     */
    public function get_all_faculty() {
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    /**
     * Get faculty member by ID
     */
    public function get_faculty_by_id($id) {
        $query = $this->db->where('id', $id)->get($this->table);
        return $query->row_array();
    }

    /**
     * Insert new faculty member
     */
    public function insert_faculty($data) {
        // Add timestamp
        $data['created_at'] = date('Y-m-d H:i:s');
        
        if ($this->db->insert($this->table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    /**
     * Update faculty member
     */
    public function update_faculty($id, $data) {
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    /**
     * Delete faculty member
     */
    public function delete_faculty($id) {
        return $this->db->where('id', $id)->delete($this->table);
    }

    /**
     * Get faculty count
     */
    public function count_faculty() {
        return $this->db->count_all($this->table);
    }

    /**
     * Search faculty members
     */
    public function search_faculty($searchTerm) {
        $this->db->like('firstname', $searchTerm);
        $this->db->or_like('lastname', $searchTerm);
        $this->db->or_like('position', $searchTerm);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }
}
?>
