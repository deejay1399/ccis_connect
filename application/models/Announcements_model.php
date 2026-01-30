<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Announcements_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function get_all()
	{
		$query = $this->db
			->select('announcement_id, title, content, announcement_date, image, created_at')
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
			'image' => isset($data['image']) ? $data['image'] : null,
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
		];

		if (array_key_exists('image', $data)) {
			$update_data['image'] = $data['image'];
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
