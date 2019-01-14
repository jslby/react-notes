import React, {Component} from 'react';
import CryptoJS from 'crypto-js';
import renderHTML from 'react-render-html';
import parse from 'html-react-parser';

export default class ShowNote extends Component {
  constructor(props){
    super(props)
    this.dbCon = this.props.db.database().ref(this.props.match.params.id);
    this.handleDecrypt = this.handleDecrypt.bind(this);
    this.handleTogglePassword = this.handleTogglePassword .bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);

    this.state = {
      isDecrypt: false,
      isLoad: false,
      noteEncrypted: '',
      noteDecrypted: '',
      isPasswordType: true,
    };
  }

  componentWillMount(){
    this.dbCon.on('value', snapshot => {
      this.setState({
        isLoad: true,
        noteEncrypted: snapshot.val().text
      });
    });
  }
  
  handleTogglePassword(){
    this.setState({
      isPasswordType: !this.state.isPasswordType
    });
  }

  handlePressEnter(e){
    console.log(1);
    if(e.key === 'Enter'){
      this.handleDecrypt(e);
    }
  }

  handleDecrypt(e){
    e.preventDefault();

    let noteEncrypted = CryptoJS
        .AES
        .decrypt(this.state.noteEncrypted, this.pass.value)
        .toString(CryptoJS.enc.Utf8);

    if(noteEncrypted != ''){
      this.setState({
        noteDecrypted: noteEncrypted,
        isDecrypt: true,
      });
    }
    
  }

  render(){
    if(this.state.isDecrypt){
      return(
        <div className='show-note'>
          {parse(this.state.noteDecrypted)}
        </div>
      )
    }else{
      return(
        <div className='show-pass'>
          <div className='password-outer'>
            <input 
              className='add-password'
              onKeyPress={this.handlePressEnter}
              type={this.state.isPasswordType ? 'password' : 'text'}
              ref={i => this.pass = i} 
              placeholder='enter password for decrypt'/>
            <span onClick={this.handleTogglePassword}>
              {this.state.isPasswordType ? 'show' : 'hide'}
            </span>
          </div>
          
          <button 
            className={!this.state.isLoad ? 'loading' : ''}
            disabled={!this.state.isLoad} 
            onClick={this.handleDecrypt}>
              {this.state.isLoad ? 'Decrypt' : 'Loading...'}
          </button>
        </div>
      )
    }
  }
}
