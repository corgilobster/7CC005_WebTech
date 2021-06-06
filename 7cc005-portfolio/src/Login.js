import React, { Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: ''
        };

        this._handleLogin = this._onLogin.bind(this);
        this._handleNameChange = this._onNameChange.bind(this);
        this._handlePasswordChange = this._onPasswordChange.bind(this);
        this._handleRegistration = this._onRegistration.bind(this);
    }    
            
        render(){
            const {name, password} = this.state;
            
            return(
                ////////// login form /////////
                <div className="row justify-content-center">
                    <div className="col-sm-6 col-md-4">
                        <div className="card">
                        <div className="card-body">
                                <h4 className="card-title">Login</h4>
                                <form onSubmit={ this._handleLogin }>
                                    <div className="form-group">
                                        <label htmlFor="characterName">Name</label>
                                        <input type="text" classname="form-control" id="characterName" placeholder="Enter Name" value={ name } onChange={ this._handleNameChange }/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordInput">Password</label>
                                        <input type="text" classname="form-control" id="passwordInput" placeholder="Enter Password" value={ password } onChange={ this._handlePasswordChange }/> 
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary" value="Login" />
                                    </div>
                                </form>
                            </div>
                        </div>
                            
                    </div>

                    {/*////////// registration form //////////*/}
                    <div className="col-sm-6 col-md-4">
                        <div className="card">
                        <div className="card-body">
                                <h4 className="card-title">register</h4>
                                <form onSubmit={ this._handleRegistration }>
                                    <div className="form-group">
                                        <label htmlFor="characterName">Name</label>
                                        <input type="text" classname="form-control" id="characterName" placeholder="Enter Name" value={ name } onChange={ this._handleNameChange }/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordInput">Password</label>
                                        <input type="text" classname="form-control" id="passwordInput" placeholder="Enter Password" value={ password } onChange={ this._handlePasswordChange }/> 
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary" value="Register" />
                                    </div>
                                </form>
                            </div>
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

    _onRegistration(e) {
        const {name, password} = this.state;
        e.preventDefault();

        this.props.handleRegistration(name, password);
    }

    _onNameChange(e) {
        this.setState({name: e.target.value});
    }

    _onPasswordChange(e) {
        this.setState({password: e.target.value});
    }


}

export default Login;