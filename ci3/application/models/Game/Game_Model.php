<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Game_Model extends CI_Model
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
        $query = "select password from player where name = '" . $name . "'";
        $result = $this->db->query($query);
        return json_encode($result->result());
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
        if($this->check_player($name) == NULL) 
        {
            print("player doesn't exist");
            return "";
        }
        
        else if( strcmp("[{\"password\":\"" . $password ."\"}]", $this->get_password($name) == 1))
        {
            $this->db->set('online', 1);
            $this->db->where('name', $name);
            $this->db->update('player');
            $query = $this->db->query('select * from player where name = \'' . $name . '\'');
            //print(json_encode($query->result()));
            return json_encode($query->result());
        } else {
            print("wrong password");
            return "";
        }
        
    }

    function add_player($name, $password)
    {
        if($this->check_player($name) == 1) return false;

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

    public function get_item($iName)
    {
        //$query = "select * from Item where name = '" . #
    }

    public function add_item_to_inventory($name, $iName)
    {

    }

    public function remove_item_from_inventory($name, $iName)
    {

    }

    public function consume_potion($name)
    {

    }
}