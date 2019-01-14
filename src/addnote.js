import ReactDOM from 'react-dom';

import React, {Component} from 'react';
import CryptoJS from 'crypto-js';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class AddNote extends Component{
  constructor(props){
    super(props);

    this.dbCon = this.props.db.database().ref();
    this.domain = `${window.location.protocol}//${window.location.hostname}`;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleTogglePassword = this.handleTogglePassword .bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);

    this.state = {
      editorState: EditorState.createEmpty(),

      isPasswordType: true,
      isDone: false,
      isCopied: false,
      buttonDisable: true,

      urlNote: '',
    };
  }

  copyToClipboard(e){
    e.preventDefault();

    this.setState({
      isCopied: true,
    });
    this._url.focus();
    document.execCommand('selectAll');
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
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
      this.setState({
        isDone: true,
        urlNote: res.key,
      })
    })
  }

  handlePressEnter(e){
    if(e.key === 'Enter'){
      this.handleSubmit(e);
    }
  }

  render(){
    if(this.state.isDone){
      return (
        <div className='url-note'>
          <h2>Copy this link and share with friends</h2>
          <p>Only those who have a password can open the content</p>
          <div className='url-outer'>
            <input 
              type='text' 
              readOnly={true}
              ref={(i) => this._url = i}
              value={`${this.domain}/#/n/${this.state.urlNote}`}/>
             <button 
              disabled={this.state.isCopied}
              className={this.state.isCopied ? 'copied' : ''}
              onClick={this.copyToClipboard}>
              {!this.state.isCopied ? 'Copy to clipboard' : 'Copied'}
            </button> 
          </div>
        </div>
      )
    }else{
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
          <button 
            className='add-button'
            onClick={this.handleSubmit}>
            Encrypt
          </button>
        </div>
      )
    }
  }
}
