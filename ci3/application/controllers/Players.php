<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Players extends CI_Controller 
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('Players/Player_model', 'pm');
    }

    public function __createPlayer($username, $password)
    {
        
    }

    public function getPassword()
    {
        $name = $this->input->post('name');
        $result = $this->pm->get_password($name);
        print($result);
    }

    public function checkPlayer()
    {
        $name = $this->input->post('name');
        $result = $this->pm->check_player($name);
        print($result);
    }

    public function login() 
    {
        $username = $this->input->post('name');
        $password = $this->input->post('password');
        print( $this->pm->login_player($username, $password));
        //print($username . " " . $password);
        
    }
}