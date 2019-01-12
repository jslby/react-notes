import React, {Component} from 'react';
import CryptoJS from 'crypto-js';

export default class ShowNote extends Component {
  constructor(props){
    super(props)
    this.dbCon = this.props.db.database().ref(this.props.match.params.id);
    this.handleDecrypt = this.handleDecrypt.bind(this);

    this.state = {
      isDecrypt: false,
      noteEncrypted: '',
      noteDecrypted: '',
    };

    this.dbCon.on('value', snapshot => {
      this.setState({
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
      console.log(noteEncrypted);
      this.setState({
        noteDecrypted: noteEncrypted,
        isDecrypt: true,
      });
    }
    
  }

  render(){
    if(this.state.isDecrypt){
      return <div className='show-note'>{this.state.noteDecrypted}</div>
    }else{
      return(
        <div className='show-pass'>
          <input type='text' ref={i => this.pass = i} placeholder='password for decrypt'/>
          <button onClick={this.handleDecrypt}>Decrypt note</button>
        </div>
      )
    }
  }
}
