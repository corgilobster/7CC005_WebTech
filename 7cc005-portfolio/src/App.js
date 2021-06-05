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

    const requestOptions = /*{
      name: "Marcus",
      password: "qwe"
  }*/
    
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: { 'name': name, 'password': password }
    }

    fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/login', requestOptions)
    .then(res => {
      try {
       console.log('response data?', res);
      } 
      catch(error) {
       console.log('Error happened here!');
       console.error(error);
      }
    }).catch(console.log)
    .then(data => {
      console.log(data);
    })
  }
}




export default App;
