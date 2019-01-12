import React from 'react'
import {render} from 'react-dom'
import {HashRouter as Router, Route} from 'react-router-dom'
import AddNote from './addnote'
import ShowNote from './shownote'
import Firebase from './firebase'
import './style.scss'

render(
  <Router>
    <div>
      <Route exact path='/' render={props => <AddNote {...props} db={Firebase}/>}/>
      <Route exact path='/n/:id' render={props => <ShowNote {...props} db={Firebase}/>}/>
    </div>
  </Router>,
  document.getElementById('root')
)
