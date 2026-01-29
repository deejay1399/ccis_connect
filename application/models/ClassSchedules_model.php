<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ClassSchedules_model extends CI_Model {
    
    private $table = 'class_schedules';
    
    public function __construct() {
        parent::__construct();
    }
    
    // Get all class schedules
    public function get_all() {
        $query = $this->db->select('schedule_id as id, academic_year, semester, pdf_file as file_url, uploaded_at as created_at')
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Get schedule by ID
    public function get_by_id($id) {
        $query = $this->db->select('schedule_id as id, academic_year, semester, pdf_file as file_url, uploaded_at as created_at')
                          ->where('schedule_id', $id)
                          ->get($this->table);
        return $query->row_array();
    }
    
    // Get schedules by academic year
    public function get_by_year($academic_year) {
        $query = $this->db->select('schedule_id as id, academic_year, semester, pdf_file as file_url, uploaded_at as created_at')
                          ->where('academic_year', $academic_year)
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Get schedules by semester
    public function get_by_semester($semester) {
        $query = $this->db->select('schedule_id as id, academic_year, semester, pdf_file as file_url, uploaded_at as created_at')
                          ->where('semester', $semester)
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Get schedules by year and semester
    public function get_by_year_semester($academic_year, $semester) {
        $query = $this->db->select('schedule_id as id, academic_year, semester, pdf_file as file_url, uploaded_at as created_at')
                          ->where('academic_year', $academic_year)
                          ->where('semester', $semester)
                          ->order_by('uploaded_at', 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Insert new schedule record
    public function insert_schedule($data) {
        // Map our data to actual database column names
        $db_data = [
            'academic_year' => $data['academic_year'],
            'semester' => $data['semester'],
            'pdf_file' => $data['file_url']
        ];
        return $this->db->insert($this->table, $db_data);
    }
    
    // Update schedule record
    public function update_schedule($id, $data) {
        $db_data = [];
        if (isset($data['academic_year'])) $db_data['academic_year'] = $data['academic_year'];
        if (isset($data['semester'])) $db_data['semester'] = $data['semester'];
        if (isset($data['file_url'])) $db_data['pdf_file'] = $data['file_url'];
        
        return $this->db->where('schedule_id', $id)->update($this->table, $db_data);
    }
    
    // Delete schedule record
    public function delete_schedule($id) {
        return $this->db->where('schedule_id', $id)->delete($this->table);
    }
    
    // Count schedule records
    public function count_schedules() {
        return $this->db->count_all($this->table);
    }
}
?>

