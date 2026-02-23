<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

    private $table = 'users';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Pangitaa ang tiggamit pinaagi sa email
     */
    public function get_by_email($email)
    {
        return $this->db->where('email', $email)
                        ->where('is_active', 1)
                        ->get($this->table)
                        ->row();
    }

    /**
     * Get user pinaagi sa ID
     */
    public function get_by_id($user_id)
    {
        return $this->db->where('id', $user_id)
                        ->where('is_active', 1)
                        ->get($this->table)
                        ->row();
    }

    /**
     * I-verify ang password
     */
    public function verify_password($password, $hash)
    {
        return password_verify($password, $hash);
    }

    /**
     * Paghimo sa tiggamit
     */
    public function create_user($data)
    {
        $insert_data = [
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'is_active' => 1,
            'email_verified' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $this->db->insert($this->table, $insert_data);
        return $this->db->insert_id();
    }

    /**
     * I-update ang katapusang pag-login
     */
    public function update_last_activity($user_id)
    {
        return $this->db->where('id', $user_id)
                        ->update($this->table, ['updated_at' => date('Y-m-d H:i:s')]);
    }

    /**
     * Kuhaa ang tanan nga mga tiggamit
     */
    public function get_all()
    {
        return $this->db->get($this->table)->result();
    }

    /**
     * I-update ang tiggamit
     */
    public function update_user($user_id, $data)
    {
        return $this->db->where('id', $user_id)
                        ->update($this->table, $data);
    }

    /**
     * Hapus User
     */
    public function delete_user($user_id)
    {
        return $this->db->where('id', $user_id)
                        ->delete($this->table);
    }
}
?>
