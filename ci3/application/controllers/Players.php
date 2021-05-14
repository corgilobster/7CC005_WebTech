<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Players extends CI_Controller {

    public function _construct() {
        parent::_construct();
        $this->load->model('PlayersModel');
    }

    public function _createPlayer($username, $password){
        
    }

    public function _getPlayer($username) {
        $this->load->view('players/')
    }
}