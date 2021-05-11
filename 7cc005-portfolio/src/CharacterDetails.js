import React, {Component } from 'react';

class CharacterDetails extends Component {
    render() {
        const {player } = this.props;
        const health = 100;
        const weapon = "sword";
        const armor = "leather vest";
        const offhand = "buckler";

        return (
            <div>
                <div className="col-4">
                    <b>Character Details</b>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Name:</b>
                    </div>
                    <div className="col-3">
                        Goose
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Health:</b>
                    </div>
                    <div className="col-3">
                        { health }
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Weapon:</b>
                    </div>
                    <div className="col-3">
                        { weapon }
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Armor:</b>
                    </div>
                    <div className="col-3">
                        { armor }
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <b>Off Hand: </b>
                    </div>
                    <div className="col-3">
                        { offhand }
                    </div>
                </div>
            </div>
        );
    }
}

export default CharacterDetails;