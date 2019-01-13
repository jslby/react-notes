import React, {Component} from 'react';
import CryptoJS from 'crypto-js';
import renderHTML from 'react-render-html';
import parse from 'html-react-parser';

export default class ShowNote extends Component {
  constructor(props){
    super(props)
    this.dbCon = this.props.db.database().ref(this.props.match.params.id);
    this.handleDecrypt = this.handleDecrypt.bind(this);

    this.state = {
      isDecrypt: false,
      isLoad: false,
      noteEncrypted: '',
      noteDecrypted: '',
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
          <input 
            className='add-password'
            type='text' 
            ref={i => this.pass = i} 
            placeholder='enter password for decrypt'/>
          <button 
            className={!this.state.isLoad ? 'loading' : ''}
            disabled={!this.state.isLoad} 
            onClick={this.handleDecrypt}>
              {this.state.isLoad ? 'Decrypt qoop' : 'Loading qoop'}
          </button>
        </div>
      )
    }
  }
}
