<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Events_achievements_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function get_all()
	{
		$query = $this->db
			->select('id, title, description, type, event_date, image, created_at')
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
			'image' => isset($data['image']) ? $data['image'] : null,
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
		];

		if (array_key_exists('image', $data)) {
			$update_data['image'] = $data['image'];
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
