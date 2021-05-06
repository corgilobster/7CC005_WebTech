import { Component } from "react";
import './Game.css';

class Game extends Component{
    render() {
        return(
            <div className="row">
                <div className="col-8">
                    <div className="game-roomDescription">
                        Room Description Here
                    </div>
                    {/* Message Log */}
                    <div className="game-messageLog">
                        Message Log Here
                    </div>
                    <div>
                        {/* Input Text Box */}
                        <input type="text" className="form-control" placeholder="Enter command" />
                    </div>
                </div>
                <div className="col-4">
                    <div className="game-characterDetails">
                        Character Details Here
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