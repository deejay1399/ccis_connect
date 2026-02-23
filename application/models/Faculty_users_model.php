<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Faculty_users_model extends CI_Model {

    private $table = 'faculty_users';

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->dbforge();
        $this->ensure_schema();
    }

    /**
     * Kuhaa ang tanan nga mga miyembro sa faculty
     */
    public function get_all_faculty() {
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    /**
     * Kuhaa ang miyembro sa faculty pinaagi sa ID
     */
    public function get_faculty_by_id($id) {
        $query = $this->db->where('id', $id)->get($this->table);
        return $query->row_array();
    }

    /**
     * Pagsulud bag-ong myembro sa faculty
     */
    public function insert_faculty($data) {
        // Idugang ang timestamp
        $data['created_at'] = date('Y-m-d H:i:s');
        
        if ($this->db->insert($this->table, $data)) {
            return $this->db->insert_id();
        }
        return false;
    }

    /**
     * I-update ang miyembro sa faculty
     */
    public function update_faculty($id, $data) {
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    /**
     * I-delete ang miyembro sa faculty
     */
    public function delete_faculty($id) {
        return $this->db->where('id', $id)->delete($this->table);
    }

    /**
     * Get fakultas count
     */
    public function count_faculty() {
        return $this->db->count_all($this->table);
    }

    /**
     * Pangitaa ang mga miyembro sa faculty
     */
    public function search_faculty($searchTerm) {
        $this->db->like('firstname', $searchTerm);
        $this->db->or_like('lastname', $searchTerm);
        $this->db->or_like('position', $searchTerm);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    public function count_by_position($position, $excludeId = null)
    {
        $this->db->from($this->table)
            ->where('LOWER(TRIM(position)) =', strtolower(trim((string) $position)));
        if ($excludeId !== null) {
            $this->db->where('id !=', (int) $excludeId);
        }
        return (int) $this->db->count_all_results();
    }

    public function count_by_position_and_vp_type($position, $vpType, $excludeId = null)
    {
        $this->db->from($this->table)
            ->where('LOWER(TRIM(position)) =', strtolower(trim((string) $position)))
            ->where('LOWER(TRIM(vp_type)) =', strtolower(trim((string) $vpType)));
        if ($excludeId !== null) {
            $this->db->where('id !=', (int) $excludeId);
        }
        return (int) $this->db->count_all_results();
    }

    public function count_by_position_and_course($position, $course, $excludeId = null)
    {
        $this->db->from($this->table)
            ->where('LOWER(TRIM(position)) =', strtolower(trim((string) $position)))
            ->where('LOWER(TRIM(course)) =', strtolower(trim((string) $course)));
        if ($excludeId !== null) {
            $this->db->where('id !=', (int) $excludeId);
        }
        return (int) $this->db->count_all_results();
    }

    private function ensure_schema()
    {
        if (!$this->db->table_exists($this->table)) {
            return;
        }

        $fields = $this->db->list_fields($this->table);
        if (!in_array('vp_type', $fields, true)) {
            $this->dbforge->add_column($this->table, [
                'vp_type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'default' => null,
                    'after' => 'position'
                ]
            ]);
        }
        if (!in_array('course', $fields, true)) {
            $this->dbforge->add_column($this->table, [
                'course' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'default' => null,
                    'after' => 'vp_type'
                ]
            ]);
        }
    }
}
?>
