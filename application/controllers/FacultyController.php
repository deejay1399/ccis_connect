<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacultyController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function faculty()
	{
		$data['page_type'] = 'faculty';
		$this->load->view('layouts/header', $data);
        $this->load->view('layouts/navigation');
        $this->load->view('pages/faculty');
        $this->load->view('layouts/footer');
	}

}
