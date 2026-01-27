<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Homepage_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	/**
	 * Get the latest homepage data
	 * @return array|null
	 */
	public function get_latest()
	{
		$query = $this->db
			->select('id, title, content, banner_image, created_at, updated_at')
			->from('homepage')
			->order_by('id', 'DESC')
			->limit(1)
			->get();

		if ($query->num_rows() > 0) {
			return $query->row_array();
		}

		return null;
	}

	/**
	 * Get all homepage records for carousel
	 * @return array
	 */
	public function get_all()
	{
		$query = $this->db
			->select('id, title, content, banner_image, created_at, updated_at')
			->from('homepage')
			->order_by('id', 'DESC')
			->get();

		if ($query->num_rows() > 0) {
			return $query->result_array();
		}

		return array();
	}

	/**
	 * Save or update homepage data
	 * @param array $data
	 * @return bool
	 */
	public function save_homepage($data)
	{
		// Always insert new record (this is an upload form, not edit)
		$insert_data = [
			'title' => $data['title'],
			'content' => $data['content'],
			'banner_image' => isset($data['banner_image']) ? $data['banner_image'] : null,
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s')
		];

		log_message('info', 'Inserting new homepage record');
		log_message('info', 'Insert data: ' . json_encode($insert_data));

		$result = $this->db->insert('homepage', $insert_data);
		
		if ($result) {
			log_message('info', 'Insert successful - New ID: ' . $this->db->insert_id());
			return true;
		} else {
			log_message('error', 'Insert failed - DB Error: ' . json_encode($this->db->error()));
			return false;
		}
	}

	/**
	 * Get homepage by ID
	 * @param int $id
	 * @return array|null
	 */
	public function get_by_id($id)
	{
		$query = $this->db
			->select('id, title, content, banner_image, created_at, updated_at')
			->from('homepage')
			->where('id', $id)
			->get();

		if ($query->num_rows() > 0) {
			return $query->row_array();
		}

		return null;
	}

	/**
	 * Delete homepage record
	 * @param int $id
	 * @return bool
	 */
	public function delete_homepage($id)
	{
		return $this->db
			->where('id', $id)
			->delete('homepage');
	}

	/**
	 * Delete banner image file from server
	 * @param string $image_path
	 * @return bool
	 */
	public function delete_banner_file($image_path)
	{
		if (empty($image_path)) {
			return false;
		}

		$file_path = FCPATH . $image_path;

		if (file_exists($file_path)) {
			return unlink($file_path);
		}

		return false;
	}
}
?>
