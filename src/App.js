import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Auth from './pages/auth';
import Dashboard from './pages/dashboard'
import Project from './pages/project'
import Home from './pages/index'
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/project/:cloudId/:id">
            <Project />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
};