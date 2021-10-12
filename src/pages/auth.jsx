import { useLocation, useHistory } from "react-router-dom";
import React, { useEffect } from "react";

function Auth() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        return history.push("/");
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch("https://auth.atlassian.com/oauth/token", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        }),
        redirect: "follow",
      });

      const { access_token } = await response.json();

      await localStorage.setItem("access_token", access_token);

      history.push('/dashboard');
      console.log(state);
    })();
  });

  return <div className="App"></div>;
}

export default Auth;
