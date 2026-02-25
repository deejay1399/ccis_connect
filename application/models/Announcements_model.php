<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Announcements_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->dbforge();
		$this->ensure_schema();
	}

	private function ensure_schema()
	{
		$this->db->query("CREATE TABLE IF NOT EXISTS announcements (
			announcement_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			announcement_date DATE NOT NULL,
			announcement_time VARCHAR(120) NULL,
			announcement_venue VARCHAR(255) NULL,
			pdf_file VARCHAR(255) NULL,
			image VARCHAR(255) NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

		$columns_to_add = [
			'announcement_time' => [
				'type' => 'VARCHAR',
				'constraint' => 120,
				'null' => true,
				'after' => 'announcement_date'
			],
			'announcement_venue' => [
				'type' => 'VARCHAR',
				'constraint' => 255,
				'null' => true,
				'after' => 'announcement_time'
			],
			'pdf_file' => [
				'type' => 'VARCHAR',
				'constraint' => 255,
				'null' => true,
				'after' => 'announcement_venue'
			],
			'images_json' => [
				'type' => 'TEXT',
				'null' => true,
				'after' => 'image'
			]
		];

		foreach ($columns_to_add as $column => $definition) {
			if (!$this->db->field_exists($column, 'announcements')) {
				$this->dbforge->add_column('announcements', [$column => $definition]);
			}
		}
	}

	public function get_all()
	{
		$query = $this->db
			->select('announcement_id, title, content, announcement_date, announcement_time, announcement_venue, pdf_file, image, images_json, created_at')
			->from('announcements')
			->order_by('announcement_date', 'DESC')
			->order_by('announcement_id', 'DESC')
			->get();

		return $query->result_array();
	}

	public function insert_announcement($data)
	{
		$insert_data = [
			'title' => $data['title'],
			'content' => $data['content'],
			'announcement_date' => $data['announcement_date'],
			'announcement_time' => isset($data['announcement_time']) ? $data['announcement_time'] : null,
			'announcement_venue' => isset($data['announcement_venue']) ? $data['announcement_venue'] : null,
			'pdf_file' => isset($data['pdf_file']) ? $data['pdf_file'] : null,
			'image' => isset($data['image']) ? $data['image'] : null,
			'images_json' => isset($data['images_json']) ? $data['images_json'] : null,
		];

		$result = $this->db->insert('announcements', $insert_data);
		return $result ? $this->db->insert_id() : false;
	}

	public function update_announcement($announcement_id, $data)
	{
		$update_data = [
			'title' => $data['title'],
			'content' => $data['content'],
			'announcement_date' => $data['announcement_date'],
			'announcement_time' => isset($data['announcement_time']) ? $data['announcement_time'] : null,
			'announcement_venue' => isset($data['announcement_venue']) ? $data['announcement_venue'] : null,
		];

		if (array_key_exists('image', $data)) {
			$update_data['image'] = $data['image'];
		}
		if (array_key_exists('images_json', $data)) {
			$update_data['images_json'] = $data['images_json'];
		}
		if (array_key_exists('pdf_file', $data)) {
			$update_data['pdf_file'] = $data['pdf_file'];
		}

		return $this->db
			->where('announcement_id', $announcement_id)
			->update('announcements', $update_data);
	}

	public function delete_announcement($announcement_id)
	{
		return $this->db
			->where('announcement_id', $announcement_id)
			->delete('announcements');
	}
}
