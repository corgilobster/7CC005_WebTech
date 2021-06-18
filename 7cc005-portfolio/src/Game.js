/*
References: 
Race condition stalling 
url: https://medium.com/hackernoon/avoiding-race-conditions-when-fetching-data-with-react-hooks-220d6fd0f663
reason: Fetching data too often can cause a race condition to occur where the UI will not update properly. 
This article sheds some light on how to fix the issue by displaying the data once it has caught up to the right content.

Using a condition guard to prevent race conditions
url: https://wanago.io/2020/03/02/race-conditions-in-react-and-beyond-a-race-condition-guard-with-typescript/

Sebastian Lorber race condition guard
url: https://sebastienlorber.com/handling-api-request-race-conditions-in-react#how-to-avoid-this-problem
reason: The above link builds off of this

Dan Abramov explanation on race conditions
url: https://overreacted.io/a-complete-guide-to-useeffect/#speaking-of-race-conditions
reason: good explanation on race conditions





*/
import { Component } from "react";
import './Game.css';
import CharacterDetails from './CharacterDetails';
import InventoryList from './InventoryList';
import Messages from './Messages';
//import { useBeforeunload } from 'react-beforeunload';

//let lastPromise: Promise<any>;

class Game extends Component{
    

    constructor(props){
        super(props);
        this.state = {
            room: 'start',
            messages: [],
            inventory: [],
            player: this.props.player,
            enemy: null,
            armorClass: 0
            /*{
                name: "null",
                password: "null",
                max_health: 100,
                current_health: 0,
                weapon: "null",
                armor: "null",
                offhand: "null",
                online: 0
            }*/
        };
        this._handleCommand = this._onCommand.bind(this);
        this._equipItem = this._equipItem.bind(this);
        this._handleItem = this._handleItem.bind(this);
        this._drinkPotion = this._drinkPotion.bind(this);
        this._updateInventory = this._updateInventory.bind(this);
        this._receiveDamage = this._receiveDamage.bind(this);
        this._handleEncounter = this._handleEncounter.bind(this);
        this._updatePlayer = this._updatePlayer.bind(this);
        this._calculatePlayerDamage = this._calculatePlayerDamage.bind(this);
        this._search = this._search.bind(this);
        this._calculatePlayerArmor = this._calculatePlayerArmor.bind(this);
        this._attack = this._attack.bind(this);
        this._addItem = this._addItem.bind(this);
        this._victory = this._victory.bind(this);
        this._defeat = this._defeat.bind(this);
        this._addPotions = this._addPotions.bind(this);
        this._calculatePlayerOffhand = this._calculatePlayerOffhand.bind(this);

        
        this._welcomeMessage(); 
    }

    // adds a message to the message log
    _addMessage(message) {
        const messages = this.state.messages; // copies message from state
        messages.unshift({  // adds a new message to the beginning of the array
            timestamp: (new Date().getHours().toString()) + ":" + (new Date().getMinutes().toString()) + ":" + (new Date().getSeconds().toString()) ,
            message: message
        });
        console.log("this is the message: " + message);
        // update messages array in state
        this.setState({
            messages
        });
        
    }
    
    // used to update player stats for CharacterDetails.js
    _updatePlayer(){
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        formData.append("password", this.state.player.password);
        const requestOptions = 
        {
            method: 'POST',
            body: formData,
        }
        
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/login', requestOptions)
        .then(res => res.json())
        .then(data => {
          this.setState({player: data[0]});
          //this.render();
        })
    }
    /*
        UPDATE INVENTORY METHOD
        Used to update the inventory when items are added or removed
        Times when called: 
            - when _addItem() is called
            - when _equipItem() is called
            - when _drinkPotion() is called

    */
    _updateInventory(){
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        console.log(this.state.player.name);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // fetch all items related to player from inventory table
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/retrieveInventory', requestOptions)
        .then(res => res.json())
        .then(data => {
            // Updates inventory array in state
            this.setState({inventory: data});
        })
        .catch(console.log);
    }

    // for calculating player armor on creation
    componentDidMount() {
        this._updateInventory();
        this._calculatePlayerArmor();
        //console.log("component mounted!!!");
        
    }

    // used to add an item to the player's inventory
    _addItem(itemName)
    {
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        formData.append("item", itemName)
        const requestOptions = 
        {
            method: 'POST',
            body: formData,
        }
        // fetch for adding an item to the player's inventory
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/addItemToInventory', requestOptions)
        .then(() => {
            // update inventory after fetch to inform player
            this._updateInventory();
        })
    }

    // used to equip items onto the player
    _equipItem(item){
        
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        formData.append("item", item.item_name);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // fetch to equip item in inventory. Logic done in API.
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/equipItem', requestOptions)
        .then(() => {
            // update affected UI elements and player armor
            this._updatePlayer();
            this._updateInventory();
            this._calculatePlayerArmor();
        });

        // used to inform player the item has been equiped
        this._addMessage("You equiped your " + item.item_name + ".");
        
        
    }

    // allows the player to heal by drinking a potion
    _drinkPotion(){
        
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }

        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/consumePotion', requestOptions)
        .then(() => {
            // uppdate affected UI elements
            this._updatePlayer();
            this._updateInventory();
        });

        this._addMessage("You drank a potion and gained some health!");
    }

    // used to subtract health from player's current health
    _receiveDamage(dam){
        var formData = new FormData();
        if(dam == null){ // if player uses /dam command
            formData.append("name", this.state.player.name);
            formData.append("health", this.state.player.current_health - 20);
            this._addMessage("You hurt yourself for 20 damage!");
        }
        else{ // if player gets damaged by enemy
            formData.append("name", this.state.player.name);
            formData.append("health", this.state.player.current_health - dam);
            this._addMessage("The " + this.state.enemy.name + " hit you for " + dam + " damage!");
        }
        
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }

        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/updateHealth', requestOptions)
        .then(() => {
            // update affected UI elements
            this._updatePlayer();
        })
        .catch(console.log);
    }

    // summons an enemy for the player to fight
    _handleEncounter(){
        
        // set enemy in state to anything other than null
        const slime = {name: "slime", health: 30, attack: 5, defense: 8};
        this.setState({enemy: slime});

        this._addMessage("A slime appears! Prepare for a fight!");
    }
    
    // handles item distribution to player
    _handleItem(item)
    {
        var formData = new FormData();
        formData.append("item", item);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // fetch item from database item table
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/getItem', requestOptions)
        .then(res => res.json())
        .then(data => {
            
            const item = data[0];
            
            // check to see if item is a potion or equipment
            if(item.type === 'consumable') this._drinkPotion();
            else this._equipItem(item);
            
        })
        .catch(console.log);

       
    }
    
    // sloppy code incomming 
    // used to calculate player damage
    _calculatePlayerDamage()
    {
        var weaponDamage;
        var roll = Math.floor((Math.random()*20)+1);

        // check to see if no weapon is equiped and successful attack roll
        if(this.state.player.weapon == null && roll > this.state.enemy.defense) { 
            // inform player and return unarmed damage
            this._addMessage("You rolled an attack of " + roll + " and dealt 5 damage!");
            return 5;
        }
        // check to see if player achieves a successful attack roll
        else if(roll > this.state.enemy.defense)
        {
            
            var formData = new FormData();
            formData.append("item", this.state.player.weapon);
            const requestOptions = 
            {
            method: 'POST',
            body: formData,
            }
            // fetch weapon statistics
            fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/getItem', requestOptions)
            .then(res => res.json())
            .then(data => {
                
                const item = data[0];
                
                // get weapon damage
                weaponDamage = item.i_atk;

                // get enemy from state
                var enemy = this.state.enemy;
                //console.log(slime.health);
                enemy.health = enemy.health - weaponDamage;
                //console.log(slime.health);
                this.setState({enemy: enemy});
                
                this._addMessage("You rolled an attack of " + roll + " and dealt " + weaponDamage + " damage!");
                
                // check to see if enemy is dead
                if(this.state.enemy.health < 1) this._victory();
                
            })
            .catch(console.log);
            
        }
        else { // for failure to roll high enough
            this._addMessage("You rolled an attack of " + roll + " and missed!");
        }
        
        console.log(weaponDamage);
        return weaponDamage;
    }

    // call this when player's armor has changed or on init
    _calculatePlayerArmor()
    {
        var armorClass = 0;
        var formData = new FormData();
        formData.append("item", this.state.player.armor);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // fetch armor
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/getItem', requestOptions)
        .then(res => res.json())
        .then(data => {
            // check to see if player has any item equiped in slot
            if(data !== undefined){
                const item = data[0];
                armorClass = Number(item.i_def);
                this._calculatePlayerOffhand(armorClass);
            }
        })
        .catch(console.log);
    }
    // calculates player offhand armor (is called after _calculatePlayerArmor())
    _calculatePlayerOffhand(armorClass)
    {
        var completeAC = 0;
        var formData = new FormData();
        formData.append("item", this.state.player.offhand);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // fetch offhand
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/getItem', requestOptions)
        .then(res => res.json())
        .then(data => {
            // check to see if player has any item equiped in slot
            if(data !== undefined){
                const item = data[0];
                var offhandAC = Number(item.i_def);
                completeAC = armorClass + offhandAC;
                this.setState({armorClass: completeAC});
            }
            else this.setState({armorClass: armorClass});
            
        })
        .catch(console.log);

    }

    // used to add potions to player inventory
    _addPotions(){
        // calculate random number of potions from 1 to 5
        var roll = Math.floor((Math.random()*4) + 1);
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        formData.append("quantity", roll);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // update database with new potion ammount
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/addMultiplePotions', requestOptions)
        .then(() => {
            // update affected UI element
            this._updateInventory();
        })
        .catch(console.log);

        this._addMessage("You found " + roll + " potions!");
        
        //this.render();
    }

    // posts victory message and distributes reward potions and gets rid of the enemy
    _victory(){
        this._addMessage("You finished the " +  this.state.enemy.name + " with one final blow!");
        this._addPotions();
        this.setState({enemy: null});
    }

    // called when player health is less than 1
    _defeat(){
        this._addMessage("With the last hit you took you've realized you reached your limit.");
        this._addMessage("Your vision begins to go dark...");
        var formData = new FormData();
        formData.append("name", this.state.player.name);
        const requestOptions = 
        {
          method: 'POST',
          body: formData,
        }
        // deletes all items in player's inventory
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/deleteAllFromInventory', requestOptions)
        .then(() => {
            // update affected UI element
            this._updateInventory();
        })
        .catch(console.log);

        formData = new FormData();
        formData.append("name", this.state.player.name);
        formData.append("health", 100);
        const requestOptions2 = 
        {
          method: 'POST',
          body: formData,
        }
        // Reset health to 100
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/updateHealth', requestOptions2)
        .then(() => {
            this._updatePlayer();
        })
        .catch(console.log);
        
        // gets rid of the enemy
        this.setState({enemy: null});
        
        this._addMessage("You wake up feeling refreshed! As you come to, you realize that all of your items are missing!");
    }

    // used to calculate player attack
    _attack(){
        
        // check if enemy in state is null
        if(this.state.enemy == null)
        {
            this._addMessage("You attack the air. Nothing happens.");
        }
        
        // else calculate damage
        else{
            // calculate player damage
            this._calculatePlayerDamage();
            
            //this.setState({enemy: slime })
            // check if enemy health is below 0
            
            if(this.state.enemy.health <= 0) 
            {
                this._victory();
            }
            // calculate enemy damage
            else
            {
                var roll = Math.floor((Math.random() * 20) + 1);
                // update to db
                console.log(this.state.armorClass);
                if(roll > this.state.armorClass){
                    var formData = new FormData();
                    formData.append("name", this.state.player.name);
                    formData.append("health", this.state.player.current_health - this.state.enemy.attack);
                    const requestOptions = 
                    {
                    method: 'POST',
                    body: formData,
                    }
                    // remove health if enemy hits
                    fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/updateHealth', requestOptions)
                    .then(() => {
                        if(this.state.player.current_health < 1)
                    {
                        this._addMessage("The " + this.state.enemy.name + " rolls an attack of " + roll + " and hits you for " + this.state.enemy.attack + " damage!");
                        this._defeat();
                    }
                    else{
                        // update clientside 
                        this._updatePlayer();
                        this._addMessage("The " + this.state.enemy.name + " rolls an attack of " + roll + " and hits you for " + this.state.enemy.attack + " damage!");
                    }
                    })
                }
                else this._addMessage("The " + this.state.enemy.name + " missed! You take 0 damage!");
                
            }
        }
    }

    // allows the player to escape the battle if they roll high enough
    _escape(){
        // checks if there is no enemy
        if(this.state.enemy == null) this._addMessage("Escape from what? You're not fighting anything!");
        else{
            //roll die (d100)
            var roll = (Math.random() * 99) + 1;
            //if less than or equal to 25 fail
            if(roll <= 25) {
                this._addMessage("You failed to escape!");

                var formData = new FormData();
                formData.append("name", this.state.player.name);
                formData.append("health", this.state.player.current_health - this.state.enemy.attack);
                const requestOptions = 
                {
                method: 'POST',
                body: formData,
                }
                // deal damage to player from attack of opportunity
                fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/updateHealth', requestOptions)

                this._addMessage("The " + this.state.enemy.name + " takes an attack of opportunity and hits you for " + this.state.enemy.attack + " damage!");
                // update clientside 
                this._updatePlayer();
            }
                // else run away (set enemy to null)
            else 
            {
                this._addMessage("You managed to get away!");
                this.setState({enemy: null});
            }

        }
        
    }

    // used to find enemies or items
    _search(){

        this._addMessage("You search the room for anything interesting!");
        // roll a die to see if an item or an enemy is encountered
        var roll = (Math.random() * 99) + 1;
        console.log(roll);
        
        if(this.state.enemy != null) this._addMessage("This slime is too aggressive! Focus on the enemy for now!");

        // dragon items
        else if(roll > 95){
            this._addMessage("Something glistens in the distance... It's a guilded chest! You open it to see what's inside...");
            roll = Math.floor(Math.random()*3);
            switch(roll){
                case 0: 
                    // add dragon sword
                    this._addItem("Dragon Sword");
                    this._addMessage("Wait... Is that... a DRAGON SWORD?! You stash it in your inventory.");
                    break;
                case 1: 
                    // add dragon armor
                    this._addItem("Dragon Armor");
                    this._addMessage("No way! It's the legendary DRAGON ARMOR! You don't hesitate to claim your reward.");
                    break;
                case 2: 
                    // add dragon shield
                    this._addItem("Dragon Shield");
                    this._addMessage("This can't be! You just found the DRAGON SHIELD. You stuff it in your bag for safe keeping.");
                    break;
                default:
                    break;
            }
            

        }
        // steel items
        else if (roll <= 95 && roll > 80){
            this._addMessage("You find a sturdy chest! You open it and look inside...");
            roll = Math.floor(Math.random()*3);

            switch(roll){
                case 0: 
                    // add steel sword
                    this._addItem("Steel Sword");
                    this._addMessage("Wow lucky you! You found a steel sword! You place it in your bag.");
                    break;
                case 1: 
                    // add steel armor
                    this._addItem("Steel Armor");
                    this._addMessage("What a find! You found steel armor! You pick it up.");
                    break;
                case 2: 
                    // add steel shield
                    this._addItem("Steel Shield");
                    this._addMessage("Hey what's that? You found a steel shield! You take the item.")
                    break;
                default:
                    break;
            }
        }
        // iron items
        else if (roll <= 80 && roll > 50){
            this._addMessage("You find an old chest. You kick it open...");
            roll = Math.floor(Math.random()*3);
            switch(roll){
                case 0: 
                    // add iron sword
                    this._addItem("Iron Sword");
                    this._addMessage("You find a regular iron sword. You take it.");
                    break;
                case 1: 
                    // add iron armor
                    this._addItem("Iron Armor");
                    this._addMessage("You find a common piece of iron armor. You put it in your bag.");
                    break;
                case 2: 
                    // add iron shield
                    this._addItem("Iron Shield");
                    this._addMessage("You find a worn iron shield. You place it in your inventory.");
                    break;
                default:
                    break;
            }
        }
        else{
            // initiate encounter
            this._handleEncounter();
        }
    }

    // used to check if a player enters a command
    _onCommand(e) {
        e.preventDefault();
        const command = this.commandInput.value;
        this.commandInput.value = "";
        // begin shout command
        if(command.startsWith("/shout ")) { 
            const shout = command.substring(7);
            this._addMessage(`You shout "${shout}"`);
        } // end shout command

        // begin shout command
        else if(command.startsWith("/whisper ")) { 
            const shout = command.substring(9);
            this._addMessage(`You whisper "${shout}"`);
        } // end shout command 

        // begin logoff command 
        else if (command.startsWith("/logoff")) {  
            this._onLogOut();  
        } // end logoff command

        // begin search command
        else if (command.startsWith("/search")) {
            this._search();
        } // end search command 

        // begin attack command
        else if (command.startsWith("/attack")) {
            this._attack();
        } // end attack command

        // begin help command
        else if (command.startsWith("/help")) {
            this._helpMessage();
        } // end help command

        // begin escape command
        else if (command.startsWith("/escape"))
        {
            this._escape();
        } // end escape command

        // begin dam command
        else if(command.startsWith("/dam")) {
            console.log(this._calculatePlayerDamage());
        } // end dam command

        // basic speech
        else {
            this._addMessage(`You say "${command}"`);
        }
    }

    _welcomeMessage() {
        this._addMessage("Welcome to mi-dungeon! Type /help for instructions and tips.");
        //console.log(this.state.player.name);
    }


    _helpMessage() {
        this._addMessage("Don't wait until the last bit of health to run from a battle! The enemy could still hit you from behind!");
        this._addMessage("Try to find some equipment before you fight a monster! Remember you can click your inventory items to the right to use them.");
        this._addMessage("TIPS:");
        this._addMessage("/shout [message] - lets you scream at the top of your lungs");
        this._addMessage("/escape - attempt to escape the battle");
        this._addMessage("/search - search the room for loot or monsters");
        this._addMessage("/attack - attacks the current enemy if you are in a fight");
        this._addMessage("COMMANDS:");
    }

    render() {
        return(
            <div className="row">
                <div className="col-8">
                    <div className="game-roomDescription">
                        Room Description Here
                   
                   <div>
                        {/* Input Text Box */}
                        <form onSubmit={this._handleCommand}>    
                            <input type="text" className="form-control" placeholder="Enter command" 
                                    ref={(input) => { this.commandInput = input; }} />
                        </form>
                    </div>
                    </div>
                    {/* Message Log */}
                    <div className="game-messageLog">
                        <Messages messages={this.state.messages} />
                    </div>
                    
                </div>
                <div className="col-4">
                    <div className="game-characterDetails">
                        <CharacterDetails player={ this.state.player } />
                        {/*Character Details Here*/}
                    </div>
                    <div className="game-playerList">
                        Inventory List Here
                        <InventoryList inventory={ this.state.inventory } handleItem={ this._handleItem }/>
                    </div>
                </div>
                {/*<Beforeunload onBeforeunload={(event) => this._logOff} />*/}
            </div>
            
        );
    }
}

export default Game;