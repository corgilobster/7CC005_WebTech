import { Component } from "react";
import './Game.css';
import CharacterDetails from './CharacterDetails';
import Messages from './Messages';

class Game extends Component{
    constructor(props){
        super(props);
        this.state = {
            room: 'start',
            messages: []
        };
    }

    _addMessage(message) {
        const messages = this.state.messages;
        messages.unshift({
            timestamp: new Date(),
            message: message
        });
        this.setState({
            messages
        });
        this._handleCommand = this._onCommand.bind(this);
    }

    _onCommand(e) {
        e.preventDefault();
        const command = this.commandInput.value;
        this.commandInput.value = "";
        if(command.startsWith("/shout ")) {
            const shout = command.substring(7);
            this._addMessage(`You shout "${shout}"`);
        } else {
            this._addMessage(`You say "${command}"`);
        }
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
                                    ref={(input) => { this.commandInput = input; }}/>
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
            </div>
            
        );
    }
}

export default Game;