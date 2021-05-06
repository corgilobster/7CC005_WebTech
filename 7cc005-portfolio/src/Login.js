import React, { Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: ''
        };

        this._handleLogin = this._onLogin.bind(this);
    }    
            
        render(){
            const {name, password} = this.state;
            
            return(
                
                <div className="row justify-content-center">
                    <div className="col-sm-6 col-md-4">
                        <div className="card-body">
                            <h4 className="card-title">Join Game</h4>
                            <form onSubmit={ this._handleLogin }>
                                <div className="form-group">
                                    <label htmlFor="characterName">Name</label>
                                    <input type="text" classname="form-control" id="characterName" placeholder="Enter Name" value={ name } />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passwordInput">Password</label>
                                    <input type="text" classname="form-control" id="passwordInput" placeholder="Enter Password" value={ password } /> 
                                </div>
                                <div className="form-group">
                                    <input type="submit" className="btn btn-primary" value="Join Game" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    
    _onLogin(e) {
        const { name, password} = this.state;
        e.preventDefault();

        this.props.handleLogin(name, password);
    }


}

export default Login;