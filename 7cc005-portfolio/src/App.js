import './App.css';
import Login from './Login';
import Game from './Game';
import { Component } from 'react';

class App extends Component{
  constructor(props) {
    super(props);

    this._handleLogin = this._onLogin.bind(this);

    this.state = {};
  }

  render() {
    const { player } = this.state;
    let appContents;
    if (player) {
      appContents = <Game player={ player } />;
    } else {
      appContents = <Login handleLogin={ this._handleLogin } />;
    }

    return (
        <div className="App container-fluid">
         {appContents}
        </div>
    );
  }

  _onLogin(name, password) {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    console.log(name + " " + password);
    const requestOptions = /*{
      name: "Marcus",
      password: "qwe"
  }*/
    
    {
      method: 'POST',
      body: formData,
      //redirect: 'follow'
    }

    fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/login', requestOptions)
    .then(res => res.json())
      
      /*try {
        res.json()
       //console.log('response data?', res);


      } 
      catch(error) {
       console.log('Error happened here!');
       console.error(error);
      }
    }).catch(console.log)*/
    .then(data => {
      console.log("here!");
      console.log(data[1]);
    
      this.setState({player: data[0]});
      
    })
    /*.then( () => {
      this.setState({
        player: {
          name: "Marcus",
          password: "qwe",
          max_health: 100,
          current_health: 100,
          weapon: "Iron Sword",
          armor: "Iron Armor",
          offhand: "Iron Shield",
          online: 1
        }
      })
    })*/
  }
}




export default App;
