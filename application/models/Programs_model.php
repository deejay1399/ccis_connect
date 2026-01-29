<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Programs_model extends CI_Model {

    private $table = 'programs';

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Get all programs
     */
    public function get_all_programs() {
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    /**
     * Get program by ID
     */
    public function get_program_by_id($id) {
        $query = $this->db->where('program_id', $id)->get($this->table);
        return $query->row_array();
    }

    /**
     * Insert new program
     */
    public function insert_program($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        
        if ($this->db->insert($this->table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    /**
     * Update program
     */
    public function update_program($id, $data) {
        return $this->db->where('program_id', $id)->update($this->table, $data);
    }

    /**
     * Delete program
     */
    public function delete_program($id) {
        return $this->db->where('program_id', $id)->delete($this->table);
    }

    /**
     * Get program count
     */
    public function count_programs() {
        return $this->db->count_all($this->table);
    }

    /**
     * Search programs
     */
    public function search_programs($searchTerm) {
        $this->db->like('program_name', $searchTerm);
        $this->db->or_like('description', $searchTerm);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }
}
?>
