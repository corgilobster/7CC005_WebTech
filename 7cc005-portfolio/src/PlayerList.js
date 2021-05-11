import { Component } from "react";



class CharacterList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        if (this.props.room) {
            this._bindToChannel();
        }
    }

    _bindToChannel() {
        // add a way to figure out which room player is in
        // and update list based on characters and players in room
    }

    // use this method for _bindToChannel()
    _updateMembers(channel) {
        this.setState({
            players: Object.keys(channel.members.members).map(id => channel.members.members[id])
        });
    }
}