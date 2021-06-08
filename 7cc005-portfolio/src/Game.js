import { Component } from "react";
import './Game.css';
import CharacterDetails from './CharacterDetails';
import Messages from './Messages';
//import { useBeforeunload } from 'react-beforeunload';

class Game extends Component{
    constructor(props){
        super(props);
        this.state = {
            room: 'start',
            messages: [],
            player: this.props.player
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
        this._logOff = this._onLogOff.bind(this);
        this._welcomeMessage(); 
    }

    _addMessage(message) {
        const messages = this.state.messages;
        messages.unshift({
            timestamp: new Date(),
            message: message
        });
        console.log("this is the message: " + message);
        this.setState({
            messages
        });
        
    }
    
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevState.player != this.state.player)
        {

        }
    }

    // function for logging off player
    _onLogOut(){
        const requestOptions = {
            name: this.state.player.name,
            
        }
       // console.log("'" + login[0] + "'");
        //console.log("'" + login[1] + "'");
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/updateToOffline', requestOptions)
        this.props._handleLogoff();
        
    }

    _search(){
        var roll = (Math.random() * 99) + 1;
        if(roll > 95){
            roll = Math.random()*2;
            switch(roll){
                case 0: 
                    // add dragon sword
                    break;
                case 1: 
                    // add dragon armor
                    break;
                case 2: 
                    // add dragon shield
                    break;
            }
            

        }
    }
    _onLogOff(e) {
        
    }

    _onCommand(e) {
        e.preventDefault();
        console.log("_onCommand triggered");
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
        else if (command.startsWith("/search")) {
            this._search();
        }
        else if (command.startsWith("/help")) {
            this._helpMessage();
        }

        else {
            this._addMessage(`You say "${command}"`);
        }
    }

    _welcomeMessage() {
        this._addMessage("Welcome to mi-dungeon!");
        console.log(this.state.player.name);
    }

    _helpMessage() {
        this._addMessage("\nCOMMANDS:\n/attack [enemy] - attacks the specified enemy\n/heal - consumes one potion if available\n/equip [item] - equips the specified item\n/logoff - logs off the character");
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
                        Player List Here
                    </div>
                </div>
                {/*<Beforeunload onBeforeunload={(event) => this._logOff} />*/}
            </div>
            
        );
    }
}

export default Game;