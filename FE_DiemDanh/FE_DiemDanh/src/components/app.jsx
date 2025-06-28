import React from "react";
import {
  App,
  ZMPRouter,
  AnimationRoutes,
  SnackbarProvider,
  Route,
} from "zmp-ui";

import Router from "../pages/Router";

const MyApp = () => {
  return (
    <App>
      <SnackbarProvider>
        <Router />
         
      </SnackbarProvider>
    </App>
  );
};
export default MyApp;
