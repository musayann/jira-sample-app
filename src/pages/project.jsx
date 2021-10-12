import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import JIRA from "@atlassian/jira";

function Home() {
  const [accessToken, setAccessToken] = useState(undefined);
  const [project, setProject] = useState(undefined);
  const [columns, setColumns] = useState({});
  const history = useHistory();
  const { cloudId, id } = useParams();

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
        projectIdOrKey: id || "",
        expand: "lead,issueTypes",
      });
      const proj = result.data;
      setProject(proj);
      const response = await jira.statuscategory.getAllStatusCategories();
      const cols = {};
      response.data
        .filter((col) => col.key !== "undefined")
        .forEach((col) => {
          cols[col.key] = {
            ...col,
            issues: [],
          };
        });
        const { data } = await jira.search.searchForIssuesUsingJqlPost({
          body: {
            jql: `project = '${proj.key}' ORDER BY created DESC`,
          },
        });
      data.issues.forEach((issue)=> {
          cols[issue.fields.status.statusCategory.key].issues.push(issue);
      });
      setColumns(cols);

      // const workflows = await jira.workflow.getAllWorkflows();
      // console.log(workflows);
    })();
  }, [cloudId, id]);

  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <div className="w-4/5 py-16 mx-auto">
        <h1 className="text-3xl">{project?.name}</h1>
        <span className="text-xs opacity-50">{project?.key}</span>
        <div className="w-full flex space-x-5 mt-4">
          {Object.keys(columns).map((key, i) => {
            const column = columns[key];
            return (
              <div className="w-1/3 flex flex-col space-y-5">
                <div className="text-right text-sm">{column.name}</div>
                {column.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="px-5 py-6 bg-gray-700 rounded-xl shadow-md"
                  >
                    <div className="text-base">{issue.fields.summary}</div>
                    <div className="text-xs bg-red-500 mt-3 inline-block rounded px-2">
                      {issue.fields.issuetype.name}
                    </div>
                    <div className="flex justify-between pt-4 items-center">
                      <div className="flex items-center text-sm">
                        {issue.fields.assignee && (
                          <>
                            <div className="pr-2">
                              <img
                                src={issue.fields.assignee.avatarUrls["48x48"]}
                                className="h-6 w-6 rounded-full"
                                alt={issue.fields.assignee.displayName}
                              />
                            </div>
                            <div>{issue.fields.assignee.displayName}</div>
                          </>
                        )}
                      </div>
                      <div className="text-right text-xs opacity-50">
                        {issue.key}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
