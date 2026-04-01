"use client";

import { useEffect, useState, use } from "react";
import { getProjectBySlug } from "../../services/projectService";
import Loading from "../../components/Loading";

function buildFullHTML(raw) {
  const clean = raw.trim().replace(/^```[\w]*\n?/, "").replace(/```$/, "").trim();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>tailwind.config={theme:{extend:{backgroundImage:{'gradient-radial':'radial-gradient(var(--tw-gradient-stops))'}}}}<\/script>
  <style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}</style>
</head>
<body>
${clean}
</body>
</html>`;
}

export default function Page({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug).then(setProject).catch(console.error);
  }, [slug]);

  if (!project) return <Loading />;

  return (
    <iframe
      srcDoc={buildFullHTML(project.html_design)}
      title={project?.title || "UI Preview"}
      className="w-full border-0 block"
      style={{ height: "100vh" }}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}