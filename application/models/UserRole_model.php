<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserRole_model extends CI_Model {

    private $table = 'user_roles';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Get user's role
     */
    public function get_user_role($user_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->get($this->table)
                        ->row();
    }

    /**
     * Get user's primary role ID
     */
    public function get_role_id($user_id)
    {
        $role = $this->db->select('role_id')
                         ->where('user_id', $user_id)
                         ->get($this->table)
                         ->row();
        
        return $role ? $role->role_id : null;
    }

    /**
     * Assign role to user
     */
    public function assign_role($user_id, $role_id)
    {
        $data = [
            'user_id' => $user_id,
            'role_id' => $role_id
        ];
        
        return $this->db->insert($this->table, $data);
    }

    /**
     * Check if user has specific role
     */
    public function has_role($user_id, $role_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->where('role_id', $role_id)
                        ->count_all_results($this->table) > 0;
    }

    /**
     * Get all roles for a user
     */
    public function get_roles_by_user($user_id)
    {
        return $this->db->select('r.id, r.name as role_name')
                        ->from('user_roles ur')
                        ->join('roles r', 'ur.role_id = r.id')
                        ->where('ur.user_id', $user_id)
                        ->get()
                        ->result();
    }
}
?>
