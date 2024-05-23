import React, { useState } from "react";
import { GITHUB_OAUTH_URL } from "../config.ts";
// add GITHUB_CLIENT_ID in config.ts

export const GithubOAuth = () => {
  const [userName, setUserName] = useState(null);

  const handleLogin = async (code: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data && data.user_data && data.user_data.login) {
        setUserName(data.user_data.login);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGitHubCallback = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    if (code) {
      handleLogin(code);
    }
  };

  React.useEffect(() => {
    handleGitHubCallback();
  });

  return (
    <div>
      {userName ? (
        <div>
          <h1>Welcome {userName}</h1>
        </div>
      ) : (
        <a href={GITHUB_OAUTH_URL}>Sign in with GitHub</a>
      )}
    </div>
  );
};
