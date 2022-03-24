import React from 'react';
import './App.css';
import Login from './pages/Login';
import Dispatch from './pages/Dispatch';
import Error from './pages/UrlError';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

class App extends React.Component<any, any>{

  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route path="/index*" component={Dispatch}></Route>
            <Route exact path="/error" component={Error}></Route>
            <Route exact path="/"><Redirect from="" to="/index" /></Route>
            <Route path="/*"><Redirect from="" to="/error" /></Route>
          </Switch>
        </Router>
      </>
    )
  }
}

export default App;
