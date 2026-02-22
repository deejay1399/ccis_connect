<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Deans_list_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->dbforge();
		$this->ensure_schema();
	}

	private function ensure_schema()
	{
		$this->db->query("CREATE TABLE IF NOT EXISTS deans_list (
			id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			academic_year VARCHAR(50) NOT NULL,
			semester VARCHAR(50) NULL,
			pdf_file VARCHAR(255) NULL,
			full_name VARCHAR(150) NULL,
			program VARCHAR(30) NULL,
			year_level VARCHAR(30) NULL,
			honors VARCHAR(80) NULL,
			gwa DECIMAL(4,2) NULL,
			achievements TEXT NULL,
			image VARCHAR(255) NULL,
			uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			KEY idx_deans_year (academic_year),
			KEY idx_deans_uploaded (uploaded_at)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

		$columns_to_add = [
			'full_name' => [
				'type' => 'VARCHAR',
				'constraint' => 150,
				'null' => true,
				'after' => 'pdf_file',
			],
			'program' => [
				'type' => 'VARCHAR',
				'constraint' => 30,
				'null' => true,
				'after' => 'full_name',
			],
			'year_level' => [
				'type' => 'VARCHAR',
				'constraint' => 30,
				'null' => true,
				'after' => 'program',
			],
			'honors' => [
				'type' => 'VARCHAR',
				'constraint' => 80,
				'null' => true,
				'after' => 'year_level',
			],
			'gwa' => [
				'type' => 'DECIMAL',
				'constraint' => '4,2',
				'null' => true,
				'after' => 'honors',
			],
			'achievements' => [
				'type' => 'TEXT',
				'null' => true,
				'after' => 'gwa',
			],
			'image' => [
				'type' => 'VARCHAR',
				'constraint' => 255,
				'null' => true,
				'after' => 'achievements',
			],
		];

		foreach ($columns_to_add as $column => $definition) {
			if (!$this->db->field_exists($column, 'deans_list')) {
				$this->dbforge->add_column('deans_list', [$column => $definition]);
			}
		}
	}

	public function get_all()
	{
		$query = $this->db
			->select('id, academic_year, full_name, program, year_level, honors, gwa, achievements, image, uploaded_at')
			->from('deans_list')
			->where("COALESCE(full_name, '') !=", '')
			->order_by('uploaded_at', 'DESC')
			->order_by('id', 'DESC')
			->get();

		return $query->result_array();
	}

	public function insert_deans_list($data)
	{
		$insert_data = [
			'academic_year' => $data['academic_year'],
			'semester' => '',
			'pdf_file' => '',
			'full_name' => $data['full_name'],
			'program' => $data['program'],
			'year_level' => $data['year_level'],
			'honors' => $data['honors'],
			'gwa' => $data['gwa'],
			'achievements' => isset($data['achievements']) ? $data['achievements'] : null,
			'image' => isset($data['image']) ? $data['image'] : null,
		];

		$result = $this->db->insert('deans_list', $insert_data);
		return $result ? $this->db->insert_id() : false;
	}

	public function delete_deans_list($id)
	{
		return $this->db
			->where('id', $id)
			->delete('deans_list');
	}
}
