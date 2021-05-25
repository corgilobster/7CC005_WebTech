<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Player_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    private $player = 'player';

    public function check_player($name)
    {
        $query = "select * from player where name = '" . $name . "'";
        //print($query);
        $result = $this->db->query($query);
        $result = json_encode($result->result());
        //$query = $this->db->get_where('player', array("name" => $name));
        if(strcmp($result, '[]') == 0) return false; else return true;
    }

    function get_password($name)
    {
        $this->db->select('password');
        $query = $this->db->get_where('player', array('name' => $name));
        return $query->result();
    }

    function get_player($name)
    {
        $query = $this->db->get_where($this->player, array("name" => $name));
        if($query)
        {
	            return $query->result();
        }
        return NULL;
    }

    function login_player($name, $password)
    {
        print($name . " " . $password);
        print(" ".$this->check_player($name));

        if($this->check_player($name) === NULL) 
        {
            print("wrong username");
            return "";
        }
        
        else if( $password === $this->get_password($name))
        {
            $query = $this->db->get_where('player', array("name" => $name));
            return json_encode($query->result());
        } else {
            print("neither passed");
            return "";
        }
        
    }

    function add_player($name, $password)
    {
        if(check_player($name)) return false;

        $data = array('name' => $name, 'password' => $password);
        $this->db->insert($this->player, $data);
        return true;
    }

    function update_current_health($name, $health)
    {
        $this->db->set('current_health', $health);
        $this->db->where('name', $name);
        $this->db->update('player');
    }

    function update_to_offline($name)
    {
        $this->db->set('online', 0);
        $this->db->where('name', $name);
        $this->db->update('player');   
    }
}