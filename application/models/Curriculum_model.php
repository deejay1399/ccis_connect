<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Curriculum_model extends CI_Model {
    
    private $table = 'curriculum';
    
    public function __construct() {
        parent::__construct();
    }
    
    // Kuhaa ang tanan nga mga rekord sa kurikulum
    public function get_all() {
        $query = $this->db->order_by('created_at', 'DESC')->get($this->table);
        return $query->result_array();
    }
    
    // Kuhaa ang kurikulum pinaagi sa ID
    public function get_by_id($id) {
        $query = $this->db->where('id', $id)->get($this->table);
        return $query->row_array();
    }
    
    // Kuhaa ang kurikulum pinaagi sa programa
    public function get_by_program($program) {
        $query = $this->db->where('program', $program)->order_by('created_at', 'DESC')->get($this->table);
        return $query->result_array();
    }
    
    // Pagsulud bag-ong rekord sa kurikulum
    public function insert_curriculum($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        return $this->db->insert($this->table, $data);
    }
    
    // I-update ang rekord sa kurikulum
    public function update_curriculum($id, $data) {
        return $this->db->where('id', $id)->update($this->table, $data);
    }
    
    // I-delete ang rekord sa kurikulum
    public function delete_curriculum($id) {
        return $this->db->where('id', $id)->delete($this->table);
    }
    
    // Pag-ihap sa mga rekord sa kurikulum
    public function count_curriculum() {
        return $this->db->count_all($this->table);
    }
}
?>
