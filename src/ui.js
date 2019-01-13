import React, {Component} from 'react';
import Modal from "react-responsive-modal";


export class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      openModal: false
    }
  }
  onOpenModal = (e) => {
    e.preventDefault();
    this.setState({ openModal: true });
  }

  onCloseModal = () => {
    this.setState({ openModal: false });
  }
  render(){
    return(
      <header>
        <h1><a href='/'>qoop.cc</a></h1>
        <a className='open-modal' href='#' onClick={this.onOpenModal}>#about</a>
        <Modal open={this.state.openModal} onClose={this.onCloseModal} center>
          <About/>
        </Modal>
      </header>
    )
  }
}

export const Footer = () => 
  <footer>
    <div className='donate'>
      <p>If you like the service, you can donate the project:</p>
      <p>ETH: 0xB4A7CB80A2Af46E79c34eeCeD127d290A67a0257</p>
    </div>
  </footer>

export const About = () => 
  <div className='about-modal'>
    <h2>About project</h2>
    <p>The project was created to create secure encrypted notes.</p>
    <p><b>Benefits:</b></p>
    <ul>
      <li>The service is absolutely free forever</li>
      <li>You can create an unlimited number of notes</li>
      <li>The service does not store or collect notes in the decrypted form. They are sent to the server using AES256 encrypted algorithm</li>
      <li>The service does not store or collect passwords. Only encrypted text of the note is sent to the server</li>
      <li>Encryption and decryption of text occurs in your browser, so we do not need a password or its hash on the server</li>
      <li>As an encryption key, you can use whole sentences, for example from the book</li>
    </ul>

    <p>Use only strong passwords for important information, because receipt of encrypted notes by third parties does not guarantee protection against brute force.</p>
    <p>In case of loss of the password to the Important information, it is not possible to decrypt it in practice.</p>
  </div>
