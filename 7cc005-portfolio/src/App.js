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
    /*if (player) {
      appContents = <Game player={ player } />;
    } else {
      appContents = <Login handleLogin={ this._handleLogin } />;
    }*/

    return (
        <div className="App container-fluid">
         <Game/>
        </div>
    );
  }

  _onLogin(name, password) {}
}




export default App;
