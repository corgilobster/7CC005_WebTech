import { Component } from "react";
import './Game.css';
import CharacterDetails from './CharacterDetails';
import Messages from './Messages';
import { useBeforeunload } from 'react-beforeunload';

class Game extends Component{
    constructor(props){
        super(props);
        this.state = {
            room: 'start',
            messages: [],
            player: []
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
        fetch('http://mi-linux.wlv.ac.uk/2006100/ci3/index.php/players')
            .then(response => {
                return response.json();
            }).then(result => {
                console.log(result);
                this.setState({
                    players:result
                });
            });
    }

    _onLogOff(e) {
        
    }

    // used to for the player to log in and retrieve data to be displayed
    _onLogIn(s){
        const login = s.split(" ", 2);
        const requestOptions = {
            name: login[0],
            password: login[1]
        }
        fetch('http://mi-linux.wlv.ac.uk/2006100/ci3/index.php/players/login', requestOptions)
        
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
        // begin login command 
        else if (command.startsWith("/login ")) {  
            const login = command.substring(7);
            this._onLogIn(login);  
        } // end login command
        else if (command.startsWith("/help ")) {
            this._helpMessage();
        }

        else {
            this._addMessage(`You say "${command}"`);
        }
    }

    _welcomeMessage() {
       this._addMessage("Welcome to mi-dungeon! Type '/login [username] [password]' using your username and password to log in. Alternatively, type '/register [username] [password]' to create a character.");
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
                    </div>
                    {/* Message Log */}
                    <div className="game-messageLog">
                        <Messages messages={this.state.messages} />
                    </div>
                    <div>
                        {/* Input Text Box */}
                        <form onSubmit={this._handleCommand}>    
                            <input type="text" className="form-control" placeholder="Enter command" 
                                    ref={(input) => { this.commandInput = input; }} />
                        </form>
                    </div>
                </div>
                <div className="col-4">
                    <div className="game-characterDetails">
                        <CharacterDetails player={ this.props.player } />
                        {/*Character Details Here*/}
                    </div>
                    <div className="game-playerList">
                        Player List Here
                    </div>
                </div>
                <Beforeunload onBeforeunload={(event) => this._logOff} />
            </div>
            
        );
    }
}

export default Game;