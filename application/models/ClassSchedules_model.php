<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ClassSchedules_model extends CI_Model {
    
    private $table = 'class_schedules';
    private $column_map = null;
    
    public function __construct() {
        parent::__construct();
    }

    private function get_column_map()
    {
        if ($this->column_map !== null) {
            return $this->column_map;
        }

        $fields = $this->db->list_fields($this->table);
        $this->column_map = [
            'id' => in_array('schedule_id', $fields, true) ? 'schedule_id' : 'id',
            'file' => in_array('pdf_file', $fields, true) ? 'pdf_file' : 'file_url',
            'created' => in_array('uploaded_at', $fields, true) ? 'uploaded_at' : 'created_at',
        ];

        return $this->column_map;
    }
    
    // Kuhaa ang tanan nga mga iskedyul sa klase
    public function get_all() {
        $map = $this->get_column_map();
        $query = $this->db->select($map['id'] . ' as id, academic_year, semester, ' . $map['file'] . ' as file_url, ' . $map['created'] . ' as created_at')
                          ->order_by($map['created'], 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Get eskedyul pinaagi sa ID
    public function get_by_id($id) {
        $map = $this->get_column_map();
        $query = $this->db->select($map['id'] . ' as id, academic_year, semester, ' . $map['file'] . ' as file_url, ' . $map['created'] . ' as created_at')
                          ->where($map['id'], $id)
                          ->get($this->table);
        return $query->row_array();
    }
    
    // Pagkuha mga iskedyul pinaagi sa tuig sa akademiko
    public function get_by_year($academic_year) {
        $map = $this->get_column_map();
        $query = $this->db->select($map['id'] . ' as id, academic_year, semester, ' . $map['file'] . ' as file_url, ' . $map['created'] . ' as created_at')
                          ->where('academic_year', $academic_year)
                          ->order_by($map['created'], 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Pagkuha mga iskedyul sa semestre
    public function get_by_semester($semester) {
        $map = $this->get_column_map();
        $query = $this->db->select($map['id'] . ' as id, academic_year, semester, ' . $map['file'] . ' as file_url, ' . $map['created'] . ' as created_at')
                          ->where('semester', $semester)
                          ->order_by($map['created'], 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Pagkuha mga iskedyul pinaagi sa tuig ug semestre
    public function get_by_year_semester($academic_year, $semester) {
        $map = $this->get_column_map();
        $query = $this->db->select($map['id'] . ' as id, academic_year, semester, ' . $map['file'] . ' as file_url, ' . $map['created'] . ' as created_at')
                          ->where('academic_year', $academic_year)
                          ->where('semester', $semester)
                          ->order_by($map['created'], 'DESC')
                          ->get($this->table);
        return $query->result_array();
    }
    
    // Isulud ang bag-ong rekord sa iskedyul
    public function insert_schedule($data) {
        $map = $this->get_column_map();
        // Mapa ang among datos sa tinuud nga mga ngalan sa kolum sa database
        $db_data = [
            'academic_year' => $data['academic_year'],
            'semester' => $data['semester'],
            $map['file'] => $data['file_url']
        ];
        return $this->db->insert($this->table, $db_data);
    }
    
    // I-update ang iskedyul nga rekord
    public function update_schedule($id, $data) {
        $map = $this->get_column_map();
        $db_data = [];
        if (isset($data['academic_year'])) $db_data['academic_year'] = $data['academic_year'];
        if (isset($data['semester'])) $db_data['semester'] = $data['semester'];
        if (isset($data['file_url'])) $db_data[$map['file']] = $data['file_url'];
        
        return $this->db->where($map['id'], $id)->update($this->table, $db_data);
    }
    
    // I-delete ang rekord sa iskedyul
    public function delete_schedule($id) {
        $map = $this->get_column_map();
        return $this->db->where($map['id'], $id)->delete($this->table);
    }
    
    // Mga rekord sa iskedyul sa pag-ihap
    public function count_schedules() {
        return $this->db->count_all($this->table);
    }
}
?>

