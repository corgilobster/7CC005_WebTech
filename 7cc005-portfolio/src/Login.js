import React, { Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            button: 1
        };

        this._handleSubmit = this._onSubmit.bind(this);
        this._handleNameChange = this._onNameChange.bind(this);
        this._handlePasswordChange = this._onPasswordChange.bind(this);
    }    
            
        render(){
            const name = this.state.name;
            const password = this.state.password;
            
            return(
                
                
                <div className="row justify-content-center mt-6">
                    
                    <div className="col-sm-1 col-md-2 w-50 flex-shrink-0">
                        
                        
                        <div className="card bg-dark mt-5 flex-shrink-0">
                            <div className="card-body flex-shrink-0">
                                    <h4 className="card-title">Login</h4>
                                    <form onSubmit={ this._handleSubmit }>
                                        <div className="form-group">
                                            <label className= "mx-4" htmlFor="characterName">Name</label>
                                            <div className=""></div>
                                            <input type="text" classname="form-control" id="characterName" placeholder="Enter Name" value={ name } onChange={ this._handleNameChange } maxLength="15"/>
                                        </div>
                                        <div className="form-group">
                                            <label className= "mx-4" htmlFor="passwordInput">Password</label>
                                            <input type="text" classname="form-control" id="passwordInput" placeholder="Enter Password" value={ password } onChange={ this._handlePasswordChange } maxLength="20"/> 
                                        </div>
                                        <div className="form-group">
                                            <input  onClick={() => this.setState({button: 0})} type="submit" className="btn btn-primary" value="Login" />
                                            <div className="px-1"> or </div>
                                            <input onClick={() => this.setState({button: 1})} type ="submit" className="btn btn-primary" value="Register"/>
                                        </div>
                                    </form>
                            </div>
                        </div>
                            
                    </div>
                </div>
            );
        }
    
   

    _onSubmit(e) {
        const { name, password} = this.state;
        e.preventDefault();
        if(this.state.button === 0)
        this.props.handleLogin(name, password);
        else 
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