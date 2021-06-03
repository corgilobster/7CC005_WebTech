import React, {Component } from 'react';

class CharacterDetails extends Component {
    render() {
        const {player} = this.props;
        const health = 100;
        const weapon = "sword";
        const armor = "leather vest";
        const offhand = "buckler";

        return (
            <div>
                <div className="col-4">
                    <b>Character Details</b>
                </div>
                <div className="row" xs="auto">
                    <div className="col-2" xs="auto">
                        <b>     Name:  </b>
                    </div>
                    <div className="col-3" xs="auto">
                        {this.props.player.name}
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Health:</b>
                    </div>
                    <div className="col-3">
                        {this.props.player.current_health} / {this.props.player.max_health}
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Weapon:</b>
                    </div>
                    <div className="col-3">
                        {this.props.player.weapon}
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Armor:</b>
                    </div>
                    <div className="col-3">
                        {this.props.player.armor}
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Off Hand: </b>
                    </div>
                    <div className="col-3">
                        {this.props.player.offhand}
                    </div>
                </div>
            </div>
        );
    }
}

export default CharacterDetails;