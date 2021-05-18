<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Player_model extends CI_Model
{
    private $player = 'player';

    function check_player($name)
    {
        $query = $this->db->get_where($this->player, array("name" => $name));
        if($query) return true; else return false;
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
        if(!check_player($name)) return NULL;
        else if( $password === get_password($player))
        {
            $query = $this->db->get_where($this->player, array("name" => $name));
            return $query->result();
        }
        return NULL;
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