import { Component } from "react";



class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.inventory
        };
    }

    /*componentDidMount() {
        
        console.log("First Item: ");
        console.log( this.state.items[0]);
        
        /*const itemList= [];
        for (var i = 0; i < 10; i++) {
            itemList.push(i);
        }
        this.setState({items: itemList});*/

        
    //}

    componentWillReceiveProps(nextProps) {
        this.setState({ items: nextProps.inventory });  
      }

    /*componentDidUpdate(prevProps, prevState)
    {
        console.log("inventory list did update");
        console.log(this.state.items);
        if(prevProps.inventory !== this.state.items)
        {
            this.setState({ items: this.props.inventory});
            this.render();
        }
    }*/

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

    _getItem(item)
    {

    }

    render() {


        return (
            
            
                this.state.items.map((item) => (
                    <div className="col pt-2">
                    <input onClick={() => {this.props.handleItem(item.item)}} type ="submit" className="btn btn-primary" value={item.item + " " + item.quantity}/>
                    {/*<button onButton>{item.item}</button>*/}
                    </div>
                ))
            
        );

    }
}

export default InventoryList;