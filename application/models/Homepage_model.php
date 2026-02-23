<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Homepage_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	/**
	 * Kuhaa ang labing kabag-o nga datos sa homepage
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
	 * Kuhaa ang tanan nga mga rekord sa homepage alang sa carousel
	 * @return tagaytay
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
	 * I-save o i-update ang datos sa homepage
	 * @param array $data sa
	 * @balik bool
	 */
	public function save_homepage($data)
	{
		// Kanunay nga isulud ang bag-ong rekord (kini usa ka porma sa pag-upload, dili pag-edit)
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
	 * Get homepage pinaagi sa ID
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
	 * I-delete ang rekord sa homepage
	 * @param int $id
	 * @balik bool
	 */
	public function delete_homepage($id)
	{
		return $this->db
			->where('id', $id)
			->delete('homepage');
	}

	/**
	 * I-delete ang file sa imahe sa banner gikan sa server
	 * @param string $image_pathway
	 * @balik bool
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
