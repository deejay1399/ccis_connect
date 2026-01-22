<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Student_model extends CI_Model {

    private $table = 'students';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
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
