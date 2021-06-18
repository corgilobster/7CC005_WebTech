<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Game_Model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    private $player = 'player';

    // checks to see if the name passed matches with a result in the database
    public function check_player($name)
    {
        $query = "select * from player where name = '" . $name . "'";
        $result = $this->db->query($query);
        $result = json_encode($result->result());
        // check to see if database select returns an empty json response
        // if empty, return false (null). if not, return true (1)
        if(strcmp($result, '[]') == 0) return false; else return true;
    }

    public function get_password($name)
    {
        $query = "select password from player where name = '" . $name . "'";
        $result = $this->db->query($query);
        return json_encode($result->result());
    }

    // DELETE THIS - NEVER USED
    public function get_player($name)
    {
        $query = $this->db->get_where($this->player, array("name" => $name));
        if($query)
        {
	            return $query->result();
        }
        return NULL;
    }
    // returns a string value of what is stored in the 'weapon' column of the player table
    public function get_player_weapon($name)
    {
        $query = "select weapon from player where name = '" . $name . "'";
        $res = $this->db->query($query);
        // used to check if player exists
        if(strcmp(json_encode($res->result()), "[]") == 0) return null; // return null if player does not exist
        else return $this->db->query($query)->row()->weapon;
    }

    // returns a string value of what is stored in the 'armor' column of the player table
    public function get_player_armor($name)
    {
        $query = "select armor from player where name = '" . $name . "'";
        $res = $this->db->query($query);
        // used to check if player exists
        if(strcmp(json_encode($res->result()), "[]") == 0) return null; // return null if player does not exist
        else return $this->db->query($query)->row()->armor;
    }

    // returns a string value of what is stored in the 'offhand' column of the player table
    public function get_player_offhand($name)
    {
        $query = "select offhand from player where name = '" . $name . "'";
        $res = $this->db->query($query);
        // used to check if player exists
        if(strcmp(json_encode($res->result()), "[]") == 0) return null; // return null if player does not exist
        else return $this->db->query($query)->row()->offhand;
    }

    // returns json object containing player information if name and password 
    //match a database record in the player table
    public function login_player($name, $password)
    {   
        // checks to see if the player exists in the table
        if($this->check_player($name) == NULL) 
        {
            print("player doesn't exist");
            return null;
        }
        // if player exists check if the password column matches the value passed in
        else if( strcmp("[{\"password\":\"" . $password ."\"}]", $this->get_password($name)) == 0)
        {
            // future content to be added for preventing simultaneus logins
            //$this->db->set('online', 1);
            //$this->db->where('name', $name);
            //$this->db->update('player');
            // execute the select statement to return player row contents
            $query = $this->db->query('select * from player where name = \'' . $name . '\'');
            //print(json_encode($query->result()));
            return json_encode($query->result());
        } else { // return null if password or name don't match
            return null;
        }
        
    }

    // adds a row to the player table in the database
    public function add_player($name, $password)
    {
        // checks to see if player name is taken
        if($this->check_player($name) == 1) return false; // player name is taken
        // creates an array to pass in data to create a row in player table
        $data = array('name' => $name, 'password' => $password);
        $this->db->insert($this->player, $data);
        return true; // successful registration
    }

    // updates health column in single row within player table
    public function update_current_health($name, $health)
    {
        $this->db->set('current_health', $health);
        $this->db->where('name', $name);
        $this->db->update('player');
    }

    // feature not yet implemented
    // used to track whether a player has logged off to allow logging in
    public function update_to_offline($name)
    {
        $this->db->set('online', 0);
        $this->db->where('name', $name);
        $this->db->update('player');   
    }

    // retrieves an item from the 'item' table in the database
    public function get_item($iName)
    {
        $query = "select * from items where item_name = '" . $iName . "'";
        $res = $this->db->query($query);
        return json_encode($res->result());
    }

    // returns all items related to a player in the inventory table
    public function retrieve_inventory($name)
    {
        $query = "select * from inventory where name = '" . $name . "'";
        return json_encode($this->db->query($query)->result());
    }

    // returns a specific item related to a player in the inventory table
    public function get_specific_item($pName, $iName)
    {
        $query = "select * from inventory where name = '" . $pName . "' and item = '" . $iName . "'";
        return json_encode($this->db->query($query)->result());
    }

    // returns the value stored in the quantity column for a specific item within the inventory table
    // related to a player
    public function get_specific_item_num($pName, $iName)
    {
        // checks if item does not exist and returns 0 stating that no items with that name exist
        if(strcmp($this->get_specific_item($pName, $iName), "[]") == 0) return 0;
        
        $query = "select quantity from inventory where name = '" . $pName . "' and item = '" . $iName . "'";
        $res = $this->db->query($query)->row()->quantity;
        return $res; 
    }

    // adds a single item to the player's inventory
    public function add_item_to_inventory($pName, $iName)
    {
        // checks if player exists; return null if player does not exist
        if($this->check_player($pName) == NULL) return NULL;

        // checks if item exists in item table; return null if non-existent
        if(strcmp($this->get_item($iName), "[]" ) == 0) return NULL;
        
        // checks if item exists in player's inventory; if not then add item to inventory table under player's name
        else if(strcmp($this->get_specific_item($pName, $iName), "[]") == 0) 
        {
            $data = array('name' => $pName, 'item' => $iName, 'quantity' => 1);
            $this->db->insert('inventory', $data);
            return 1; // return 1 for successful insert
        }
        else // if the item exists add one to quantity column
        {
            // retrieve and store quantity column for item and add 1 to number
            $iQuantity = $this->get_specific_item_num($pName, $iName);
            $iQuantity++;
            // update row in inventory table
            $this->db->set('quantity', $iQuantity);
            $this->db->where('name', $pName);
            $this->db->where('item', $iName);
            $this->db->update('inventory');
            return 1; // return 1 for successful addition
        }
    }

    // similar to add_item_to_inventory(), it deducts a number from the column or removes the item 
    // from the table if quantity < 2
    public function remove_item_from_inventory($pName, $iName)
    {
        // checks if player exists; return null if player does not exist
        if($this->check_player($pName) == NULL) return NULL;

        // checks if item exists in inventory table. Returns null if it does not exist
        if(strcmp($this->get_specific_item($pName, $iName), "[]" ) == 0) return NULL;

        // stores the quantity of the item in the inventory table
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
        else // if item quantity is 1 then remove from table
        {
            $this->db->where('name', $pName);
            $this->db->where('item', $iName);
            $this->db->delete('inventory');
            return 1;
        }
    }

    public function consume_potion($name)
    {
        // checks if the character exists before executing any other code
        if($this->check_player($name) == NULL){
            print("Player does not exist.");
            return NULL;
        } 
        // find quantity of potions player owns
        $pQuantity = $this->get_specific_item_num($name, 'Health Potion');
        // get the current health of the player
        $query = "select current_health from player where name = '" . $name . "'";
        $health = $this->db->query($query)->row()->current_health;

        if($pQuantity == null) return 0; // check if player has no potions
        else if($health >= 100 && $pQuantity > 0) // for idiots who drink potions at full health
        {
            // remove a potion from inventory
            $this->remove_item_from_inventory($name, 'Health Potion');
            return 1;
        }
        else if($pQuantity > 1 && $health > 75) // check if item quantity is greater than 1 and health is greater than 75
        {
            // remove the potion from inventory table
            $this->remove_item_from_inventory($name, 'Health Potion');
            // update health to 100 based on overflow
            $this->update_current_health($name, 100);
            return 1;
        }
        else // check if potion quantity is greater than 1 knowing health is less than 75
        {
            // remove potion from inventory
            $this->remove_item_from_inventory($name, 'Health Potion');
            // Add 25 to current_health of player
            $this->update_current_health($name, $health + 25);
            return 1;
        }

    }

    // adds more than one potion at a time
    public function add_multiple_potions($name, $quantity)
    {
         // checks if the character exists before executing any other code
         if($this->check_player($name) == NULL){
            print("Player does not exist.");
            return NULL;
        } 
        else if($quantity < 0){
            print("Quantity must be a positive number.");
            return NULL;
        }
        
        // if the item doesn't exist in player's inventory, add it to the table
        else if(strcmp($this->get_specific_item($name, "Health Potion"), "[]") == 0) 
        {
            $data = array('name' => $name, 'item' => "Health Potion", 'quantity' => $quantity);
            $this->db->insert('inventory', $data);
            return 1;
        }
        else // if the item exists add current quantity with specified quantity to add and update
        {
            $newQuantity = $this->get_specific_item_num($name, "Health Potion") + $quantity;
            $this->db->set('quantity', $newQuantity);
            $this->db->where('name', $name);
            $this->db->where('item', "Health Potion");
            $this->db->update('inventory');
            return 1;
        }
    }

    // used to add or switch out items within player's equipment slots
    public function equip_item($name, $item)
    {
         // checks if the character exists before executing any other code
         if($this->check_player($name) == NULL){
            print("Player does not exist.");
            return NULL;
        } 
        // checks to see if the item exists in player's inventory
        else if(strcmp($this->get_specific_item($name, $item), "[]" ) == 0) {
            print("Item does not exist.");
            return NULL;
        }

        // remove the item to equip from inventory
        $this->remove_item_from_inventory($name, $item);
        
        // get the type of the item to equip from the items table to equip into right slot
        $query = "select type from items where item_name = '" . $item . "'";
        $type = $this->db->query($query)->row()->type;

        // depending on the type, equip to the corresponding section
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

    // removes all items from a player's inventory
    public function delete_all_from_inventory($name)
    {
        $query = "delete from inventory where name = '" . $name . "'";
        $this->db->query($query);
        return 1;
    }
}