import React, {Component} from 'react';
import CryptoJS from 'crypto-js';

export default class AddNote extends Component{
  constructor(props){
    super(props);

    this.dbCon = this.props.db.database().ref();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let text = this._text.value;
    let pass = this._pass.value;
    let noteId = this.dbCon.push({
      text: CryptoJS.AES.encrypt(text, pass).toString(),
    }).then(res => {
      this.props.history.push(`/n/${res.key}`)
    })
  }

  render(){
    return(
      <div className='add-note'>
        <textarea ref={(i) => this._text = i} placeholder='type text note'></textarea>
        <input ref={(i) => this._pass = i} type='text' placeholder='type password'/>
        <button onClick={this.handleSubmit}>Add note</button>
      </div>
    )
  }
}
