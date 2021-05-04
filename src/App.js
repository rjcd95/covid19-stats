import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"
import { clearMessage } from "./actions/message";
import { history } from "./helpers/history";
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <PrivateRoute exact path={["/", "/stats"]} component={Dashboard} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
