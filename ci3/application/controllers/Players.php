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

    public function checkPlayer()
    {
        $name = $this->input->post('name');
        $result = $this->pm->check_player($name);
<<<<<<< HEAD
        print($result);
=======
        print($name);
>>>>>>> 4db57b88179c40339e0c3f122665970e9e48a98e
    }

    public function login() 
    {
        $username = $this->input->post('name');
        $password = $this->input->post('password');
<<<<<<< HEAD
        return $this->pm->login_player($username, $password);
=======
        print( $this->pm->login_player($username, $password));
>>>>>>> 4db57b88179c40339e0c3f122665970e9e48a98e
        //print($username . " " . $password);
        
    }
}