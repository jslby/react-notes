import ReactDOM from 'react-dom';

import React, {Component} from 'react';
import CryptoJS from 'crypto-js';

import ReactMde from 'react-mde';
import * as Showdown from "showdown";
import 'react-mde/lib/styles/scss/react-mde-all.scss';
import fontawesome from '@fortawesome/fontawesome-free';
import solid from '@fortawesome/fontawesome-free-solid';


export default class AddNote extends Component{
  constructor(props){
    super(props);

    this.dbCon = this.props.db.database().ref();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleTogglePassword = this.handleTogglePassword .bind(this);

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });

    this.state = {
      noteText: '',
      isPasswordType: true,
    };
  }

  handleTogglePassword(){
    this.setState({
      isPasswordType: !this.state.isPasswordType
    });
  }

  handleTextChange = (noteText) => {
    this.setState({noteText});
  }

  handleSubmit(e){
    e.preventDefault();
    let text = this.converter.makeHtml(this.state.noteText);
    let pass = this._pass.value;
    let noteId = this.dbCon.push({
      text: CryptoJS.AES.encrypt(text, pass).toString(),
    }).then(res => {
      this.props.history.push(`/n/${res.key}`)
    })
  }

  handlePressEnter(e){
    if(e.key === 'Enter'){
      this.handleSubmit(e);
    }
  }

  render(){
    return(
      <div className='add-note'>
        <ReactMde
          onChange={this.handleTextChange}
          value={this.state.noteText}
          generateMarkdownPreview={markdown =>
            Promise.resolve(this.converter.makeHtml(markdown))
          }
        />
        <div className='password-outer'>
          <input 
            className='add-password'
            onKeyPress={this.handlePressEnter} 
            ref={(i) => this._pass = i} 
            type={this.state.isPasswordType ? 'password' : 'text'}
            placeholder='type password'/>
          <span onClick={this.handleTogglePassword}>
            {this.state.isPasswordType ? 'show' : 'hide'}
          </span>
        </div>
        <button className='add-button' onClick={this.handleSubmit}>Add note</button>
      </div>
    )
  }
}
