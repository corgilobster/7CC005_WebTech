<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory_Model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function get_item($iName)
    {
        $query = "select * from Item where name = '" . #
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
>