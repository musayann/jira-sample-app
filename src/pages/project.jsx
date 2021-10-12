import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import JIRA from "@atlassian/jira";

function Home() {
  const [accessToken, setAccessToken] = useState(undefined);
  const [project, setProject] = useState(undefined);
  const history = useHistory();
  const {cloudId, id} = useParams();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);

    if (!access_token) return history.push("/");
    console.log(access_token);

    (async () => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

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

      const result = await jira.project.getProject({
        projectIdOrKey: id || '',
        expand: 'lead,issueTypes'
      })
    // const result = await jira.project.
      console.log(result.data);
    //   setProject(result.data);
    })();
  }, [cloudId, id]);

  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <div className="w-4/5 py-16 mx-auto">
        <h1 className="uppercase mb-4 text-3xl">Projects</h1>
        <ul className="text-center w-full">
          <li className="w-full flex items-center px-5 py-2 bg-gray-900 rounded-md my-3 text-left uppercase">
            <div className="w-16" />
            <div className="w-2/4">Name</div>
            <div>Key</div>
          </li>
          
        </ul>
      </div>
    </div>
  );
}

export default Home;
