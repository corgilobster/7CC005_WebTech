<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory extends CI_Controller
{
    function __construct{
        parent::__construct();
        $this->load->model('Inventory/Inventory_Model', 'im');
    }

    public function getItem()
    {
        
    }
}



>