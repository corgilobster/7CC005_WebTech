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
        $result = $this->db->query($query);
        $result = json_encode($result->result());
        if(strcmp($result, '[]') == 0) return false; else return true;
    }

    function get_password($name)
    {
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
            //print("player doesn't exist");

            print("failed");
            return null;
        }
        
        else if( strcmp("[{\"password\":\"" . $password ."\"}]", $this->get_password($name)) == 0)
        {
            $this->db->set('online', 1);
            $this->db->where('name', $name);
            $this->db->update('player');
            $query = $this->db->query('select * from player where name = \'' . $name . '\'');
            //print(json_encode($query->result()));
            return json_encode($query->result());
        } else {
            return null;
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
        $query = "select * from Item where name = '" . $iName . "'";
        return json_encode($this->db->query($query));
    }

    public function retrieve_inventory($pName)
    {
        $query = "select * from inventory where charID = '" . $pName . "'";
        return json_encode($this->db->query($query));
    }

    public function get_specific_item($pName, $iName)
    {
        $query = "select * from inventory where charID = '" . $pName . "' and itemID = '" . "'";
        return json_encode($this->db->query($query));
    }

    public function get_specific_item_num($pName, $iName)
    {
        $query = "select quantity from inventory where charID = '" . $pName . "' and itemID = '" . "'";
    }

    public function add_item_to_inventory($pName, $iName)
    {
        if(strcmp(get_item($iName), "[]" ) == 1) return NULL;
        
        else if(strcmp(get_specific_item($pName, $iName), "[]") == 1) // if the item doesn't exist add it to the table
        {
            $data = array('charID' => $pName, 'itemID' => $iName);
            $this->db->insert($this->inventory, $data);
            return 1;
        }
        else // if the item exists add one to counter
        {
            // https://stackoverflow.com/questions/14891743/extract-a-substring-between-two-characters-in-a-string-php/14891816
            $iQuantity = (int)DB::table('items')->where('charID', '=', $pName)->where('itemID', '=', $iName)->pluck('quantity');
            $iQuantity++;
            $this->db->set('quantity', $iQuantity);
            $this->db->where('charID', $pName);
            $this->db->where('itemID', $iName);
            $this->db->update('items');
            return 1;
        }
    }

    public function remove_item_from_inventory($pName, $iName)
    {
        $iQuantity = (int)DB::table('items')->where('charID', '=', $pName)->where('itemID', '=', $iName)->pluck('quantity');
        if($iQuantity > 1) // check if item quantity is greater than 1
        {
            $iQuantity--;
            $this->db->set('quantity', $iQuantity);
            $this->db->where('charID', $pName);
            $this->db->where('itemID', $iName);
            $this->db->update('items');
            return 1;
        }
        else
        {
            $this->db->where('charID', $pName);
            $this->db->where('itemID', $iName);
            $this->db->delete('inventory');
        }
    }

    public function consume_potion($name)
    {
        $pQuantity = (int)DB::table('items')->where('charID', '=', $pName)->where('itemID', '=', 'potion')->pluck('quantity');
        $health = (int)DB::table('player')->where('name', '=', $name)->pluck('health');

        if($pQuantity > 1 && $health > 75) // check if item quantity is greater than 1 and health is greater than 75
        {
            $pQuantity--;
            $this->db->set('quantity', $pQuantity);
            $this->db->where('charID', $pName);
            $this->db->where('itemID', 'potion');
            $this->db->update('items');

            update_current_health($name, 100);
            return 1;
        }
        else if($pQuantity > 1)
        {
            $pQuantity--;
            $this->db->set('quantity', $pQuantity);
            $this->db->where('charID', $pName);
            $this->db->where('itemID', 'potion');
            $this->db->update('items');

            update_current_health($name, $health + 25);
            return 1;
        }
        else // remove from table if quantity = 1
        {
            $this->db->where('charID', $pName);
            $this->db->where('itemID', 'potion');
            $this->db->delete('inventory');
        }

    }
}