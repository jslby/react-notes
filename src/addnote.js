import ReactDOM from 'react-dom';

import React, {Component} from 'react';
import CryptoJS from 'crypto-js';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import fontawesome from '@fortawesome/fontawesome-free';
import solid from '@fortawesome/fontawesome-free-solid';


export default class AddNote extends Component{
  constructor(props){
    super(props);

    this.dbCon = this.props.db.database().ref();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleTogglePassword = this.handleTogglePassword .bind(this);

    

    this.state = {
      editorState: EditorState.createEmpty(),
      isPasswordType: true,
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleTogglePassword(){
    this.setState({
      isPasswordType: !this.state.isPasswordType
    });
  }

  handleSubmit(e){
    e.preventDefault();
    let text = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
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
        <Editor
          placeholder='just enter your text...'
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          toolbar={{
            options: [
              'inline', 
              'blockType', 
              'list', 
              'textAlign', 
              'link', 
              'image'
            ],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
            },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered'],
            },
            textAlign: {
              inDropdown: false,
              options: ['left', 'center'],
            },
          }}
        />  
        <div className='password-outer'>
          <input 
            className='add-password'
            onKeyPress={this.handlePressEnter} 
            ref={(i) => this._pass = i} 
            type={this.state.isPasswordType ? 'password' : 'text'}
            placeholder='...and enter password'/>
          <span onClick={this.handleTogglePassword}>
            {this.state.isPasswordType ? 'show' : 'hide'}
          </span>
        </div>
        <button className='add-button' onClick={this.handleSubmit}>Encrypt</button>
      </div>
    )
  }
}
