<?php
defined('BASEPATH') OR exit('No direct script access allowed');

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

    public function login() 
    {
        $username = $this->input->post('name');
        $password = $this->input->post('password');
        //return $this->pm->login_player($username, $password);
        print($username, $password);
        
    }
}