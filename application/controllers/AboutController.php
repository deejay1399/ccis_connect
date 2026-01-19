<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AboutController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
	}

	public function about()
	{
		$this->load->view('layouts/header');
        $this->load->view('layouts/navigation');
        $this->load->view('pages/about');
        $this->load->view('layouts/footer');
	}

	public function history()
	{
		$this->load->view('layouts/header');
        $this->load->view('layouts/navigation');
        $this->load->view('pages/history');
        $this->load->view('layouts/footer');
	}

	public function vmgo()
	{
		$this->load->view('layouts/header');
        $this->load->view('layouts/navigation');
        $this->load->view('pages/vmgo');
        $this->load->view('layouts/footer');
	}

	public function hymn()
	{
		$this->load->view('layouts/header');
        $this->load->view('layouts/navigation');
        $this->load->view('pages/hymn');
        $this->load->view('layouts/footer');
	}
}
