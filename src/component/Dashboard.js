import React, { Component } from "react";
import Button from "./Button";
// import todosStore from '@/store/todos';
import todosStore from '../store/todos';
import userStore from '../store/user';
import taggingStore from '../store/tagging';

import { cleanObject, isEmptyObject } from "../helper";

 class BaseComponent extends Component {
    rerender = () => {
      this.setState({
        lastUpdate: new Date(),
      });
    }
  }
  
  class Dashboard extends BaseComponent {
    state = {
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      tags:'',
      editId: false,
      editTitle: null,
      editTags: null,
      editDueDate: null,
      taggingList: []
    }

    itemList = (todoData = {}) => {
        const {
            title,
            createdAt = '',
            dueDate = '-',
            tags 
        } = todoData;
        return (
            <div className="item-list">
                <div className="flex-row">
                    <div className="left">
                        <Button title={`Due Date: ${dueDate}`}/>
                    </div>
                    <div className="right">
                        <Button title={`Created Date: ${createdAt ? new Date(createdAt).toISOString().split('T')[0]: ''}`}/>
                    </div>
                </div>
                <span>{title}</span>
                
                <span className="label">{`Tags: ${tags}`}</span>

            </div>
        )
    }

    itemListEdit = (todoData = {}) => {
      const {
          title,
          dueDate = '-',
          tags 
      } = todoData;
      return (
          <div className="item-list-edit">
              <div className="flex-row">
                  <div className="left">
                    <button type={"submit"} className={"green-label"}>
                      <span> 
                        Due Date: 
                        <input type="date" value={this.state.editDueDate || dueDate} name="editDueDate" onChange={this.HandleInputItem}/>
                      </span>
                    </button>
                  </div>
              </div>
              {/* <span>{title}</span> */}
              <input className="classInputEdit" value={this.state.editTitle || title} type="text" name="editTitle" onChange={this.HandleInputItem}/>
              
              <span>
                Tags:
                <input  className="classInputEdit" type="text" value={this.state.editTags || tags} name="editTags" onChange={this.HandleInputItem}/>
              </span>

          </div>
      )
  }
  
    render() {
      return (
        <div className="flex-row">
          <div className="container">
            <div className="heading flex-row">
                <div className="left">
                  <Button title={`Hula ${userStore.data.username} !`} classStyle={'info'}/>
                </div>
                <div className="right">
                  {todosStore.countUnuploadeds() > 0 && <Button title={`SYNC (${todosStore.countUnuploadeds()})`} func={() => this.updateToRemoteDB(true)}/>}
                  <Button title={'SIGN OUT'} func={this.logout}/>
                </div>
            </div>
            <div className="heading">
                <h1>To-Do List</h1>
            </div>
            <div className="form">
                <form onSubmit={this.addTodo}>
                  <input onChange={this.HandleInputItem} type="text" name="title" value={this.state.title} placeholder="your memo here" />
                  <input onChange={this.HandleInputItem} type="date" name="dueDate" value={this.state.dueDate} />
                  <input onChange={this.HandleInputItem} type="text" name="tags" value={this.state.tags} placeholder="use seperate comma for tagging ex: food, drink" />
                  <div className="flex-row"><Button title={'Add'} classStyle="right"/></div>
                </form>
            </div>
            <div className="overflow-text gray">
                <ul>
                {todosStore.data.map((item, index) => (
                    this.state.editId === item._id ?
                    <li key={item._id}>
                        {this.itemListEdit(item)}
                        <div>
                            <Button title={'Edit'} func={() => this.editTodo(item._id)}/>
                            <Button title={'X'}  func={() => this.deleteTodo(item._id)} color={'red'}/>
                            <Button title={'V'}  func={() =>  this.submitUpdateTodo(item._id)} color={'green'}/>
                        </div>
                    </li>
                    :
                    <li key={item._id}>
                        {/* {item.title} */}
                        {this.itemList(item)}
                        <div>
                            <Button title={'Edit'} func={() =>  this.editTodo(item._id)}/>
                            <Button title={'X'} color={'red'} func={() => this.deleteTodo(item._id)}/>
                        </div>
                    </li>
                ))}
                </ul>
            </div>
          </div>
          <div className="container-mini">
                  Your Label:
                  {
                   taggingStore.tagListByUsername.map((tag, id) => {
                      return (
                        <span key={id} >- {tag}</span>
                      )
                    })
                  }
          </div>
        </div>
      );
    }
  
    async componentDidMount() {
      this.unsubTodos = todosStore.subscribe(this.rerender);
      this.unsubTaging = taggingStore.subscribe(this.rerender);
      taggingStore.setTagListByUsername(taggingStore.data)
    }

    componentDidUpdate() {
      taggingStore.setTagListByUsername(taggingStore.data)
    }
  
    componentWillUnmount() {
      this.unsubTodos();
      this.unsubTaging();

    }

    HandleInputItem = (event) => {
      const {name, value} = event.target;
      this.setState({
        [name]: value,
      });
    }
  
    logout = async () => {
      await todosStore.deinitialize();
      await userStore.deleteSingle();
      await taggingStore.deinitialize();
    }
  
    addTodo = async (event) => {
      event.preventDefault();
      const {tags, title, dueDate} = this.state;
      const listTags = tags && tags.split(',')
      
      await todosStore.addItem({
        title: title,
        dueDate: dueDate,
        tags: listTags || []
      }, userStore.data);

      if(listTags) {
        await taggingStore.updateTagsByUsername(userStore.data.username, listTags, userStore.data);
      }
      this.setState({ title: '' }, () =>  this.updateToRemoteDB());
    }
  
    deleteTodo = async (id) => {
      if (id === this.state.editId) {
          this.setState({editId: false})
      } else {
        todosStore.deleteItem(id, userStore.data);
        this.updateToRemoteDB();
      }
    }

    editTodo = async (id) => {
        this.setState({
            editId: id
        })
      }
  
      submitUpdateTodo = async () => {
        const {editTitle, editDueDate, editTags} = this.state;
        const listTags = editTags && editTags.split(',')
        const updatedData = {
          title: editTitle, 
          dueDate: editDueDate, 
          tags: listTags
        }

        cleanObject(updatedData);
        
        if (!isEmptyObject(updatedData)) {
            const updatedPayload = {
                ...todosStore.ListDataToObject('_id')[this.state.editId],
                ...updatedData
            }
            
            await todosStore.editItem(this.state.editId, updatedPayload, userStore.data);
            if (listTags) {
              await taggingStore.updateTagsByUsername(userStore.data.username, listTags, userStore.data);
            }
            
            this.updateToRemoteDB()
        }

        this.setState({
            editId: false,
            editTitle: '',
            editDueDate: '',
            editTags: ''
        })
      }

    updateToRemoteDB = async (isSync = false) => {
      console.log('upload to db');
      try {
        await todosStore.upload();
        await taggingStore.upload();
        if (isSync) {
            alert('Sync Successfully')
        }
        console.log('upload done');
      } catch (err) {
        if (isSync) {
            alert('Woops, something wrong please try again :)')
        }
        console.log('error update', err)
        console.log('upload failed');
      }
    }
  }

export default Dashboard;

