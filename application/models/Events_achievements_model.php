<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Events_achievements_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->dbforge();
		$this->ensure_schema();
	}

	private function ensure_schema()
	{
		$this->db->query("CREATE TABLE IF NOT EXISTS events_achievements (
			id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT NOT NULL,
			type VARCHAR(50) NOT NULL DEFAULT 'Event',
			event_date DATE NOT NULL,
			event_time VARCHAR(120) NULL,
			event_location VARCHAR(255) NULL,
			event_team VARCHAR(255) NULL,
			image VARCHAR(255) NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

		$columns_to_add = [
			'event_time' => [
				'type' => 'VARCHAR',
				'constraint' => 120,
				'null' => true,
				'after' => 'event_date'
			],
			'event_location' => [
				'type' => 'VARCHAR',
				'constraint' => 255,
				'null' => true,
				'after' => 'event_time'
			],
			'event_team' => [
				'type' => 'VARCHAR',
				'constraint' => 255,
				'null' => true,
				'after' => 'event_location'
			],
			'images_json' => [
				'type' => 'TEXT',
				'null' => true,
				'after' => 'image'
			]
		];

		foreach ($columns_to_add as $column => $definition) {
			if (!$this->db->field_exists($column, 'events_achievements')) {
				$this->dbforge->add_column('events_achievements', [$column => $definition]);
			}
		}
	}

	public function get_all()
	{
		$query = $this->db
			->select('id, title, description, type, event_date, event_time, event_location, event_team, image, images_json, created_at')
			->from('events_achievements')
			->order_by('event_date', 'DESC')
			->order_by('id', 'DESC')
			->get();

		return $query->result_array();
	}

	public function insert_event_achievement($data)
	{
		$insert_data = [
			'title' => $data['title'],
			'description' => $data['description'],
			'type' => $data['type'],
			'event_date' => $data['event_date'],
			'event_time' => isset($data['event_time']) ? $data['event_time'] : null,
			'event_location' => isset($data['event_location']) ? $data['event_location'] : null,
			'event_team' => isset($data['event_team']) ? $data['event_team'] : null,
			'image' => isset($data['image']) ? $data['image'] : null,
			'images_json' => isset($data['images_json']) ? $data['images_json'] : null,
		];

		$result = $this->db->insert('events_achievements', $insert_data);
		return $result ? $this->db->insert_id() : false;
	}

	public function update_event_achievement($id, $data)
	{
		$update_data = [
			'title' => $data['title'],
			'description' => $data['description'],
			'type' => $data['type'],
			'event_date' => $data['event_date'],
			'event_time' => isset($data['event_time']) ? $data['event_time'] : null,
			'event_location' => isset($data['event_location']) ? $data['event_location'] : null,
			'event_team' => isset($data['event_team']) ? $data['event_team'] : null,
		];

		if (array_key_exists('image', $data)) {
			$update_data['image'] = $data['image'];
		}
		if (array_key_exists('images_json', $data)) {
			$update_data['images_json'] = $data['images_json'];
		}

		return $this->db
			->where('id', $id)
			->update('events_achievements', $update_data);
	}

	public function delete_event_achievement($id)
	{
		return $this->db
			->where('id', $id)
			->delete('events_achievements');
	}
}
