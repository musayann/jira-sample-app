import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../App.css";
import JIRA from "@atlassian/jira";

function Home() {
  const [accessToken, setAccessToken] = useState(undefined);
  const [projects, setProjects] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);

    if (!access_token) return history.push("/");
    console.log(access_token);

    (async () => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const res = await fetch(
        "https://api.atlassian.com/oauth/token/accessible-resources",
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      const sites = await res.json();

      const cloudId = sites[0].id;


      const jira = new JIRA({
        baseUrl: `https://api.atlassian.com/ex/jira/${cloudId}/rest/`,
        headers: {},
        options: {
          timeout: 10,
        },
      });

      jira.authenticate({
        type: "token",
        token: access_token,
      });

      const result = await jira.project.getAllProjects();
      setProjects(result.data);
    })();
  }, []);

  return (
    <div className="App">
      <h1>Home</h1>
      <div>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
