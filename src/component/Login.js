import React, { Component } from "react";
import Button from "./Button";
// import todosStore from '@/store/todos';
import userStore from '../store/user';

 class BaseComponent extends Component {
    rerender = () => {
      this.setState({
        lastUpdate: new Date(),
      });
    }
  }

  
  class Login extends BaseComponent {
    state = {
      username: '',
    }
  
    render() {
      return (
        <div className="container login">
            <div className="heading">
            <h1 className="login">Your Username</h1>
            </div>
            <div className="form">
            <form onSubmit={this.HandleSubmit}>
                <input onChange={this.HandleInputItem} type="text" value={this.state.username} />
                <Button title={'Sign In'} />
            </form>
            </div>
        </div>
      );
    }
  
    HandleInputItem = (event) => {
      this.setState({
        username: (event.target.value || '').trim(),
      });
    }
  
    HandleSubmit = async (event) => {
        event.preventDefault();

      const { username } = this.state;
      if (!username) {
        alert('please fill username');
        return;
      }
  
      await userStore.editSingle({
        id: username,
        username: username,
      });
    }
  }
  

export default Login;

