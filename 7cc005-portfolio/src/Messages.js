import { Component } from "react";



class Messages extends Component {
    render(){
        // creates the list item and maps them to an array
        const messageRows = this.props.messages 
            .map((message) => <li className="text-left">{message.timestamp} - {message.message}</li>);
        return(
            // renders the messages
            <ul className="list-group mx">
                {messageRows}
            </ul>
        );    
    }


}

export default Messages;