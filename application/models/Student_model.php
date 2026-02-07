<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Student_model extends CI_Model {

    private $table = 'students';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->dbforge();
        $this->ensure_schema();
    }

    private function ensure_schema()
    {
        if (!$this->db->table_exists($this->table)) {
            $this->dbforge->add_field([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'user_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'student_number' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
                'course' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
                'year_level' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
                'section' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
                'organization_slug' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'organization_name' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            ]);
            $this->dbforge->add_key('id', true);
            $this->dbforge->add_key('user_id');
            $this->dbforge->create_table($this->table, true);
        }

        if (!$this->db->field_exists('organization_slug', $this->table)) {
            $this->dbforge->add_column($this->table, [
                'organization_slug' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'section']
            ]);
        }
        if (!$this->db->field_exists('organization_name', $this->table)) {
            $this->dbforge->add_column($this->table, [
                'organization_name' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true, 'after' => 'organization_slug']
            ]);
        }
    }

    /**
     * Create student record
     */
    public function create($data)
    {
        return $this->db->insert($this->table, $data);
    }

    /**
     * Get student by user ID
     */
    public function get_by_user_id($user_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->get($this->table)
                        ->row();
    }

    /**
     * Update student
     */
    public function update($user_id, $data)
    {
        return $this->db->where('user_id', $user_id)
                        ->update($this->table, $data);
    }
}
?>
