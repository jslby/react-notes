import React, {Component} from 'react';
import CryptoJS from 'crypto-js';
import renderHTML from 'react-render-html';

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
          {renderHTML(this.state.noteDecrypted)}
        </div>
      )
    }else{
      return(
        <div className='show-pass'>
          <input 
            type='text' 
            ref={i => this.pass = i} 
            placeholder='password for decrypt'/>
          <button 
            disabled={!this.state.isLoad} 
            onClick={this.handleDecrypt}>
              {this.state.isLoad ? 'Decrypt note' : 'Loading note'}
          </button>
        </div>
      )
    }
  }
}
