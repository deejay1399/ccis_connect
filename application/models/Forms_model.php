<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Forms_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	/**
	 * Get all forms
	 */
	public function get_all_forms()
	{
		$this->db->order_by('created_at', 'DESC');
		return $this->db->get('forms')->result_array();
	}

	/**
	 * Get form by ID
	 */
	public function get_form_by_id($id)
	{
		$this->db->where('id', $id);
		return $this->db->get('forms')->row_array();
	}

	/**
	 * Insert new form
	 */
	public function insert_form($data)
	{
		$insert_data = array(
			'title' => $data['title'],
			'file_url' => $data['file_url'],
			'original_filename' => $data['original_filename'],
			'file_size' => isset($data['file_size']) ? $data['file_size'] : null,
			'is_active' => 1,
			'created_at' => date('Y-m-d H:i:s')
		);

		if ($this->db->insert('forms', $insert_data)) {
			return $this->db->insert_id();
		}
		
		// Log database error
		$error = $this->db->error();
		log_message('error', 'Forms insert error: ' . json_encode($error));
		return false;
	}

	/**
	 * Update form
	 */
	public function update_form($id, $data)
	{
		$update_data = array(
			'title' => $data['title'],
			'updated_at' => date('Y-m-d H:i:s')
		);

		// If a new file is provided, update file info
		if (isset($data['file_url'])) {
			$update_data['file_url'] = $data['file_url'];
			$update_data['original_filename'] = $data['original_filename'];
			$update_data['file_size'] = $data['file_size'] ?? null;
		}

		$this->db->where('id', $id);
		return $this->db->update('forms', $update_data);
	}

	/**
	 * Delete form (soft delete)
	 */
	public function delete_form($id)
	{
		$this->db->where('id', $id);
		return $this->db->update('forms', array('is_active' => 0));
	}

	/**
	 * Get form count
	 */
	public function get_form_count()
	{
		$this->db->where('is_active', 1);
		return $this->db->count_all_results('forms');
	}

	/**
	 * Search forms by title
	 */
	public function search_forms($search_term)
	{
		$this->db->where('is_active', 1);
		$this->db->like('title', $search_term);
		$this->db->order_by('created_at', 'DESC');
		return $this->db->get('forms')->result_array();
	}
}
?>
