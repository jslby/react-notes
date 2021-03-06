import React from 'react';
import Firebase from './firebase';
import {render} from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';

import AddNote from './addnote';
import ShowNote from './shownote';
import {Header, Footer} from './ui';

import WebFont from 'webfontloader';
import './style.scss';

WebFont.load({
   google: {
     families: ['Roboto:100,200,300,400,700', 'sans-serif']
   }
});

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
