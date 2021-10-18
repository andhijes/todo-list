import React, { Component } from "react";
import Dashboard from "./component/Dashboard";
import Login from "./component/Login";
// import todosStore from '@/store/todos';
import todosStore from './store/todos';
import userStore from './store/user';
import taggingStore from './store/tagging';

 window.todosStore = todosStore;
 window.userStore = userStore;
 window.taggingStore = taggingStore;

 class BaseComponent extends Component {
    rerender = () => {
      this.setState({
        lastUpdate: new Date(),
      });
    }
  }
  
  class App extends BaseComponent {
    state = {
      isInitialized: false,
    }
    
    async componentDidMount() {
      await userStore.initialize();
      this.setState({
        isInitialized: true,
      });
  
      this.unsubUser = userStore.subscribe(this.rerender);
      this.unsubTaging = taggingStore.subscribe(this.rerender);

    }
  
    async componentDidUpdate() {
      if (userStore.data.username && !todosStore.isInitialized) {
        console.log('popup initialize all offline data...');
        todosStore.setName(userStore.data.id);
        await todosStore.initialize();
        await taggingStore.initialize();
        taggingStore.setTagListByUsername(taggingStore.data)
        console.log('popup done');
        
        if (todosStore.countUnuploadeds()) {
            console.log('yehhhhh yehhh')
        }
      }
    }
  
    componentWillUnmount() {
      this.unsubUser();
      this.unsubTaging();
    }

    render() {
        if (!this.state.isInitialized) {
          return null;
        }
    
        return (
          userStore.data.username ? (
            <Dashboard />
          ) : (
            <Login />
          )
        );
    }
  }
  
export default App;

