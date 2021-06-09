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

    public function get_password($name)
    {
        $query = "select password from player where name = '" . $name . "'";
        $result = $this->db->query($query);
        return json_encode($result->result());
    }

    public function get_player($name)
    {
        $query = $this->db->get_where($this->player, array("name" => $name));
        if($query)
        {
	            return $query->result();
        }
        return NULL;
    }

    public function get_player_weapon($name)
    {
        $query = "select weapon from player where name = '" . $name . "'";
        return $this->db->query($query)->row()->weapon;
    }

    public function get_player_armor($name)
    {
        $query = "select armor from player where name = '" . $name . "'";
        return $this->db->query($query)->row()->armor;
    }

    public function get_player_offhand($name)
    {
        $query = "select offhand from player where name = '" . $name . "'";
        return $this->db->query($query)->row()->offhand;
    }

    public function login_player($name, $password)
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

    public function add_player($name, $password)
    {
        if($this->check_player($name) == 1) return false;

        $data = array('name' => $name, 'password' => $password);
        $this->db->insert($this->player, $data);
        return true;
    }

    public function update_current_health($name, $health)
    {
        $this->db->set('current_health', $health);
        $this->db->where('name', $name);
        $this->db->update('player');
    }

    public function update_to_offline($name)
    {
        $this->db->set('online', 0);
        $this->db->where('name', $name);
        $this->db->update('player');   
    }

    public function get_item($iName)
    {
        $query = "select * from items where item_name = '" . $iName . "'";
        $res = $this->db->query($query);
        return json_encode($res->result());
    }

    public function retrieve_inventory($name)
    {
        $query = "select * from inventory where name = '" . $name . "'";
        return json_encode($this->db->query($query)->result());
    }

    public function get_specific_item($pName, $iName)
    {
        $query = "select * from inventory where name = '" . $pName . "' and item = '" . $iName . "'";
        return json_encode($this->db->query($query)->result());
    }

    public function get_specific_item_num($pName, $iName)
    {
        if(strcmp($this->get_specific_item($pName, $iName), "[]") == 0) return 0;
        
        $query = "select quantity from inventory where name = '" . $pName . "' and item = '" . $iName . "'";
        
        $res = $this->db->query($query)->row()->quantity;
        
        
        return $res; 
    }

    public function add_item_to_inventory($pName, $iName)
    {
        if(strcmp($this->get_item($iName), "[]" ) == 0) return NULL;
        
        else if(strcmp($this->get_specific_item($pName, $iName), "[]") == 0) // if the item doesn't exist in player's inventory, add it to the table
        {
            $data = array('name' => $pName, 'item' => $iName, 'quantity' => 1);
            $this->db->insert('inventory', $data);
            return 1;
        }
        else // if the item exists add one to counter
        {
            // https://stackoverflow.com/questions/14891743/extract-a-substring-between-two-characters-in-a-string-php/14891816
            $iQuantity = $this->get_specific_item_num($pName, $iName);
            $iQuantity++;
            $this->db->set('quantity', $iQuantity);
            $this->db->where('name', $pName);
            $this->db->where('item', $iName);
            $this->db->update('inventory');
            return 1;
        }
    }

    public function remove_item_from_inventory($pName, $iName)
    {
        if(strcmp($this->get_specific_item($pName, $iName), "[]" ) == 0) return NULL;

        $iQuantity = $this->get_specific_item_num($pName, $iName);
        if($iQuantity > 1) // check if item quantity is greater than 1
        {
            $iQuantity--;
            $this->db->set('quantity', $iQuantity);
            $this->db->where('name', $pName);
            $this->db->where('item', $iName);
            $this->db->update('inventory');
            return 1;
        }
        else
        {
            $this->db->where('name', $pName);
            $this->db->where('item', $iName);
            $this->db->delete('inventory');
        }
    }

    public function consume_potion($name)
    {
        $pQuantity = $this->get_specific_item_num($name, 'Health Potion');
        $query = "select current_health from player where name = '" . $name . "'";
        $health = $this->db->query($query)->row()->current_health;

        if($pQuantity == null) return 0; // check if player has no potions
        else if($health >= 100 && $pQuantity > 0) // for idiots who drink potions at full health
        {
            $this->remove_item_from_inventory($name, 'Health Potion');
            return 1;
        }
        else if($pQuantity > 1 && $health > 75) // check if item quantity is greater than 1 and health is greater than 75
        {
            /*$pQuantity--;
            $this->db->set('quantity', $pQuantity);
            $this->db->where('name', $name);
            $this->db->where('item', 'potion');
            $this->db->update('inventory');*/
            $this->remove_item_from_inventory($name, 'Health Potion');

            $this->update_current_health($name, 100);
            return 1;
        }
        else // check if potion quantity is greater than 1 knowing health is less than 75
        {
            $this->remove_item_from_inventory($name, 'Health Potion');

            $this->update_current_health($name, $health + 25);
            return 1;
        }

    }

    public function add_multiple_potions($name, $quantity)
    {
        if(strcmp($this->get_specific_item($name, "Health Potion"), "[]") == 0) // if the item doesn't exist in player's inventory, add it to the table
        {
            $data = array('name' => $name, 'item' => "Health Potion", 'quantity' => $quantity);
            $this->db->insert('inventory', $data);
            return 1;
        }
        else // if the item exists add one to counter
        {
            $newQuantity = $this->get_specific_item_num($name, "Health Potion") + $quantity;
            $this->db->set('quantity', $newQuantity);
            $this->db->where('name', $name);
            $this->db->where('item', "Health Potion");
            $this->db->update('inventory');
            return 1;
        }
    }

    public function equip_item($name, $item)
    {
        if(strcmp($this->get_specific_item($name, $item), "[]" ) == 0) return "NULL";

        $this->remove_item_from_inventory($name, $item);
        
        $query = "select type from items where item_name = '" . $item . "'";
        $type = $this->db->query($query)->row()->type;

        switch($type){
            case 'armor':
                $oldEquip = $this->get_player_armor($name);
                if($oldEquip != null){
                    $this->add_item_to_inventory($name, $oldEquip);
                }

                $this->db->set('armor', $item);
                $this->db->where('name', $name);
                $this->db->update('player');
                return 1;

                break;
            case 'weapon':
                $oldEquip = $this->get_player_weapon($name);
                if($oldEquip != null){
                    $this->add_item_to_inventory($name, $oldEquip);
                }

                $this->db->set('weapon', $item);
                $this->db->where('name', $name);
                $this->db->update('player');
                return 1;
                break;
            case 'offhand':
                $oldEquip = $this->get_player_offhand($name);
                if($oldEquip != null){
                    $this->add_item_to_inventory($name, $oldEquip);
                }

                $this->db->set('offhand', $item);
                $this->db->where('name', $name);
                $this->db->update('player');
                return 1;
                break;
            case 'consumable': // can't equip consumables! 
                return null;
                break;
        }
         

        

    }

    public function delete_all_from_inventory($name)
    {
        $query = "delete from inventory where name = '" . $name . "'";
        $this->db->query($query);
        return 1;
    }
}