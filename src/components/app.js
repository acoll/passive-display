import { h, Component } from "preact";
import { Router } from "preact-router";

import Home from "../routes/home";
import Dashboard from "../routes/dashboard";
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

if (module.hot) {
  require("preact/debug");
}

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Dashboard path="/dash/:id" />
        </Router>
      </div>
    );
  }
}
