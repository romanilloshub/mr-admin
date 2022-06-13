import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { useLocationWithQuery } from "react-router-query-hooks";

const RestrictedRoute = ({ component: Component, location, ...rest }) => {
  const { query } = useLocationWithQuery();

  const { authUser, checkingAuth } = useSelector(({ auth }) => auth);

  return (
    <>
      {!checkingAuth && (
        <Route
          {...rest}
          render={(props) =>
            authUser ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/signin",
                  state: { from: location, fromQuery: query },
                }}
              />
            )
          }
        />
      )}
    </>
  );
};

export default RestrictedRoute;
