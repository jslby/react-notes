import React from 'react'
import Firebase from './firebase'
import {render} from 'react-dom'
import {HashRouter as Router, Route} from 'react-router-dom'

import AddNote from './addnote'
import ShowNote from './shownote'
import {Header, Footer} from './ui.js';

import './style.scss'

render(
  <Router>
    <div>
      <Header/>
      <Route exact path='/' render={props => <AddNote {...props} db={Firebase}/>}/>
      <Route exact path='/n/:id' render={props => <ShowNote {...props} db={Firebase}/>}/>
      <Footer/>
    </div>
  </Router>,
  document.getElementById('root')
)
