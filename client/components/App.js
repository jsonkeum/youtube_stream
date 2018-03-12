//client/components/App.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Lobby from './Lobby';
import Login from './Login';
import Header from './Header';
import VideoPage from './VideoPage';
import '../styles/App.css';

//Define client side route paths using react router. authed is a server side variable
const App = () => {
  if(!authed){
    return (
        <Switch>
          <Route path='/' component={Login} />
        </Switch>
      );
  } else {
    return (
      <div>
        <Header/>
        <Switch>
          <Route path='/video/:videoId' component={VideoPage} />
          <Route path='/lobby' component={Lobby} />
          <Route path='/' component={Lobby} />
        </Switch>
      </div>
    );
  }
}

export default App;
