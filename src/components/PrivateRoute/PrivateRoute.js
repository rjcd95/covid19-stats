import React from "react";
import { Route } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function PrivateRoute({ children, ...rest }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Route {...rest} render={() => {
      return children
    }} />
  )
}