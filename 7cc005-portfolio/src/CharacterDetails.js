import React, {Component } from 'react';

class CharacterDetails extends Component {
    render() {

        return (
            <div className="card m-3">
                <div className="card-body bg-dark">
                    <div className="text-center">
                        <b>Character Details</b>
                    </div>
                    <div className="row align-self-start justify-content-around">
                        <div className="col-4" xs="auto">
                            <b>     Name:  </b>
                        </div>
                        <div className="col-3" xs="auto">
                            {this.props.player.name}
                        </div>
                    </div>
                    <div className="row align-self-start justify-content-around">
                        <div className="col-4">
                            <b>Health:</b>
                        </div>
                        <div className="col-3">
                            {this.props.player.current_health} / {this.props.player.max_health}
                        </div>
                    </div>
                    <div className="row align-self-start justify-content-around">
                        <div className="col-4">
                            <b>Weapon:</b>
                        </div>
                        <div className="col-3">
                            {this.props.player.weapon}
                        </div>
                    </div>
                    <div className="row align-self-start justify-content-around">
                        <div className="col-4">
                            <b>Armor:</b>
                        </div>
                        <div className="col-3">
                            {this.props.player.armor}
                        </div>
                    </div>
                    <div className="row align-self-start justify-content-around">
                        <div className="col-4">
                            <b>Off Hand: </b>
                        </div>
                        <div className="col-3">
                            {this.props.player.offhand}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CharacterDetails;