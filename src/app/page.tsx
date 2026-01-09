"use client";

import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);

  return (
    <div className="flex flex-col gap-2 p-4">
      <Button onClick={() => createProject({ name: "New Project" })}>
        Add new
      </Button>
      {projects?.map((project) => (
        <div key={project._id} className="flex gap-2 rounded bg-muted p-2">
          <p>{project.name}</p>
          <p>Owner ID: {project.ownerId}</p>
        </div>
      ))}
    </div>
  );
}
