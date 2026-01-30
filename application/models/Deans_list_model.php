<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Deans_list_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function get_all()
	{
		$query = $this->db
			->select('id, academic_year, semester, pdf_file, uploaded_at')
			->from('deans_list')
			->order_by('uploaded_at', 'DESC')
			->order_by('id', 'DESC')
			->get();

		return $query->result_array();
	}

	public function insert_deans_list($data)
	{
		$insert_data = [
			'academic_year' => $data['academic_year'],
			'semester' => $data['semester'],
			'pdf_file' => $data['pdf_file'],
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
