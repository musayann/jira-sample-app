import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import JIRA from "@atlassian/jira";

function Home() {
  const [accessToken, setAccessToken] = useState(undefined);
  const [projects, setProjects] = useState([]);
  const [cloudId, setCloudId] = useState(null);
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
      const cId = sites[1].id;
      setCloudId(cId);

      const jira = new JIRA({
        baseUrl: `https://api.atlassian.com/ex/jira/${cId}/rest/`,
        headers: {},
        options: {
          timeout: 10,
        },
      });

      jira.authenticate({
        type: "token",
        token: access_token,
      });

      const result = await jira.project.getAllProjects({
        expand: 'lead',
      });
      console.log(result.data);
      setProjects(result.data);
    })();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <div className="w-4/5 py-16 mx-auto">
        <h1 className="uppercase mb-4 text-3xl">Projects</h1>
        <ul className="text-center w-full">
          <li className="w-full flex items-center px-5 py-2 bg-gray-900 rounded-md my-3 text-left uppercase">
            <div className="w-16" />
            <div className="w-2/5">Name</div>
            <div className="w-1/4">Key</div>
            <div>Lead</div>
          </li>
          {projects.map((project) => (
            <li
              key={project.id}
              className="w-full  px-5 py-3 bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-md my-3 text-left"
            >
              <Link to={`/project/${cloudId}/${project.id}`} className="flex items-center w-full">
              <div className="w-16">
                <img
                  alt={project.name}
                  src={project.avatarUrls["48x48"]}
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div className="w-2/5">{project.name}</div>
              <div className="w-1/4">{project.key}</div>
              <div className="flex items-center">
                <div className="w-10"><img src={project.lead.avatarUrls["48x48"]} className="h-8 w-8 rounded-full" alt={project.lead.displayName}/></div>
                <div>{project.lead.displayName}</div>
              </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
