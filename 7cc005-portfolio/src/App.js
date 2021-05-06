import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { Component } from 'react';

class App extends Component{
  constructor(props) {
    super(props);

    this._handleLogin = this._onLogin.bind(this);
  }

  render() {
    return (
        <div className="App container-fluid">
         <Login handleLogin={ this._handleLogin } />
        </div>
    );
  }

  _onLogin(name, password) {}
}




export default App;
