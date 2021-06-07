import './App.css';
import Login from './Login';
import Game from './Game';
import { Component } from 'react';

class App extends Component{
  constructor(props) {
    super(props);

    this._handleLogin = this._onLogin.bind(this);
    this._handleRegistration = this._onRegistration.bind(this);

    this.state = {
      
    };
  }

  render() {
    const { player } = this.state;
    let appContents;
    if (player) {
      appContents = <Game player={ player } />;
    } else {
      appContents = <Login handleLogin={ this._handleLogin } handleRegistration={ this._handleRegistration } />;
    }

    return (
        <div className="App container-fluid">
         {appContents}
        </div>
    );
  }

  _onLogin(name, password) {
    if(name === "" || password === "") console.log("Please fill all fields");
    else {
      var formData = new FormData();
      formData.append("name", name);
      formData.append("password", password);
      const requestOptions = 
      {
        method: 'POST',
        body: formData,
      }
        
        fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/login', requestOptions)
        .then(res => res.json())
        .then(data => {
          //console.log("here!");
          //console.log(data[1]);
      
          this.setState({player: data[0]});
        })/*.catch(() => {
          console.log("wrong username or password");
        })*/
    }
    
    
  }

  _onRegistration(name, password) {
    if(name === "" || password === "") {
      this.render(
        <alert variant='warning'>
            No values entered. Please input values into the fields.
        </alert>
    )
      console.log("Please fill all fields");
    }
    else {    
      var formData = new FormData();
      formData.append("name", name);
      formData.append("password", password);
      //console.log(name + " " + password);
      const requestOptions = 
      {
        method: 'POST',
        body: formData,
      }

      fetch('https://mi-linux.wlv.ac.uk/~2006100/ci3/index.php/Game/createPlayer', requestOptions)
      .then(res => res.text())
      .then(result => {
        if(result === "") console.log("fail");
        else
        console.log("success");
      })
    } 
  }
}




export default App;
