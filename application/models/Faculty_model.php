<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Faculty_model extends CI_Model {

    private $table = 'faculty';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Create faculty record
     */
    public function create($data)
    {
        return $this->db->insert($this->table, $data);
    }

    /**
     * Get faculty by user ID
     */
    public function get_by_user_id($user_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->get($this->table)
                        ->row();
    }

    /**
     * Update faculty
     */
    public function update($user_id, $data)
    {
        return $this->db->where('user_id', $user_id)
                        ->update($this->table, $data);
    }
}
?>
