<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Session_model extends CI_Model {

    private $table = 'sessions';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Create session
     */
    public function create_session($user_id, $token)
    {
        $data = [
            'user_id' => $user_id,
            'token' => $token,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+7 days')),
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->db->insert($this->table, $data);
    }

    /**
     * Get session by token
     */
    public function get_by_token($token)
    {
        return $this->db->where('token', $token)
                        ->where('expires_at >', date('Y-m-d H:i:s'))
                        ->get($this->table)
                        ->row();
    }

    /**
     * Validate session
     */
    public function validate_session($user_id, $token)
    {
        return $this->db->where('user_id', $user_id)
                        ->where('token', $token)
                        ->where('expires_at >', date('Y-m-d H:i:s'))
                        ->count_all_results($this->table) > 0;
    }

    /**
     * Delete session
     */
    public function delete_session($token)
    {
        return $this->db->where('token', $token)
                        ->delete($this->table);
    }

    /**
     * Delete all user sessions
     */
    public function delete_user_sessions($user_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->delete($this->table);
    }
}
?>
