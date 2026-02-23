<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AcademicCalendars_model extends CI_Model {
    
    private $table = 'academic_calendars';
    
    public function __construct() {
        parent::__construct();
    }
    
    // Kuhaa ang tanan nga mga iskedyul sa akademiko
    public function get_all() {
        $query = $this->db->select('calendar_id as id, academic_year, pdf_file as file_url, uploaded_at as created_at')
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Kuhaa ang kalendaryo pinaagi sa ID
    public function get_by_id($id) {
        $query = $this->db->select('calendar_id as id, academic_year, pdf_file as file_url, uploaded_at as created_at')
                          ->where('calendar_id', $id)
                          ->get($this->table);
        return $query->row_array();
    }
    
    // Pagkuha og mga kalendaryo pinaagi sa tuig sa akademiko
    public function get_by_year($academic_year) {
        $query = $this->db->select('calendar_id as id, academic_year, pdf_file as file_url, uploaded_at as created_at')
                          ->where('academic_year', $academic_year)
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Pagsulud bag-ong rekord sa kalendaryo
    public function insert_calendar($data) {
        // Mapa ang among datos sa tinuud nga mga ngalan sa kolum sa database
        $db_data = [
            'academic_year' => $data['academic_year'],
            'pdf_file' => $data['file_url']
        ];
        return $this->db->insert($this->table, $db_data);
    }
    
    // I-update ang rekord sa kalendaryo
    public function update_calendar($id, $data) {
        $db_data = [];
        if (isset($data['academic_year'])) $db_data['academic_year'] = $data['academic_year'];
        if (isset($data['file_url'])) $db_data['pdf_file'] = $data['file_url'];
        
        return $this->db->where('calendar_id', $id)->update($this->table, $db_data);
    }
    
    // I-delete ang rekord sa kalendaryo
    public function delete_calendar($id) {
        return $this->db->where('calendar_id', $id)->delete($this->table);
    }
    
    // Pag-ihap sa mga rekord sa kalendaryo
    public function count_calendars() {
        return $this->db->count_all($this->table);
    }
}
?>
