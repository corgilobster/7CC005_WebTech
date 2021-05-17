<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header('Access-Control-Allow-Origin: *');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

require APPPATH.'libraries/REST_Controller.php';
require APPpATH.'libraries/Format.php';

class Players extends REST_Controller 
{

    use REST_Controller 
    {
        REST_Controller::__construct as private __resTraitConstruct;
    }
    
    function __construct()
    {
        parent::__construct();
        $this->__resTraitConstruct();
        $this->load->model('player_model', 'pm');
    }

    public function __createPlayer($username, $password)
    {
        
    }

    public function login($username, $password) 
    {
        return $this->pm->login_player($username, $password);

        
    }
}