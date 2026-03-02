<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Alumni_donation_settings_model extends CI_Model
{
    private $table = 'alumni_donation_settings';
    private $row_id = 1;

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->create_table_if_missing();
        $this->ensure_default_row();
    }

    private function create_table_if_missing()
    {
        $this->db->query("
            CREATE TABLE IF NOT EXISTS {$this->table} (
                id INT PRIMARY KEY,
                bank_name VARCHAR(150) NULL,
                bank_account_name VARCHAR(150) NULL,
                bank_account_number VARCHAR(80) NULL,
                bank_branch VARCHAR(150) NULL,
                gcash_number VARCHAR(80) NULL,
                maya_number VARCHAR(80) NULL,
                digital_account_name VARCHAR(150) NULL,
                contact_email VARCHAR(150) NULL,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ");
    }

    private function ensure_default_row()
    {
        $exists = $this->db->where('id', $this->row_id)->get($this->table)->row_array();
        if ($exists) {
            return;
        }

        $this->db->insert($this->table, [
            'id' => $this->row_id,
            'bank_name' => 'Bank of the Philippine Islands (BPI)',
            'bank_account_name' => 'BISU-CCIS Alumni Fund',
            'bank_account_number' => '1234-5678-90',
            'bank_branch' => 'Tagbilaran City, Bohol',
            'gcash_number' => '0917-123-4567',
            'maya_number' => '0918-765-4321',
            'digital_account_name' => 'BISU CCIS Alumni',
            'contact_email' => 'ccis.donations@bisu.edu.ph'
        ]);
    }

    public function get_settings()
    {
        $row = $this->db->where('id', $this->row_id)->get($this->table)->row_array();
        if (!$row) {
            $this->ensure_default_row();
            $row = $this->db->where('id', $this->row_id)->get($this->table)->row_array();
        }

        return [
            'bank_name' => (string) ($row['bank_name'] ?? ''),
            'bank_account_name' => (string) ($row['bank_account_name'] ?? ''),
            'bank_account_number' => (string) ($row['bank_account_number'] ?? ''),
            'bank_branch' => (string) ($row['bank_branch'] ?? ''),
            'gcash_number' => (string) ($row['gcash_number'] ?? ''),
            'maya_number' => (string) ($row['maya_number'] ?? ''),
            'digital_account_name' => (string) ($row['digital_account_name'] ?? ''),
            'contact_email' => (string) ($row['contact_email'] ?? '')
        ];
    }

    public function save_settings(array $payload)
    {
        return $this->db->where('id', $this->row_id)->update($this->table, [
            'bank_name' => (string) ($payload['bank_name'] ?? ''),
            'bank_account_name' => (string) ($payload['bank_account_name'] ?? ''),
            'bank_account_number' => (string) ($payload['bank_account_number'] ?? ''),
            'bank_branch' => (string) ($payload['bank_branch'] ?? ''),
            'gcash_number' => (string) ($payload['gcash_number'] ?? ''),
            'maya_number' => (string) ($payload['maya_number'] ?? ''),
            'digital_account_name' => (string) ($payload['digital_account_name'] ?? ''),
            'contact_email' => (string) ($payload['contact_email'] ?? ''),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
}
