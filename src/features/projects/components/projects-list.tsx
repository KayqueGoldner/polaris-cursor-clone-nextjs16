import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  GlobeIcon,
  Loader2Icon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FaGithub } from "react-icons/fa";

import { Spinner } from "@/components/ui/spinner";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

import { useProjectsPartial } from "../hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
    );
  }

  return <GlobeIcon className="size-3.5 text-muted-foreground" />;
};

interface ProjectItemProps {
  data: Doc<"projects">;
}

const ProjectItem = ({ data }: ProjectItemProps) => {
  return (
    <Link
      href={`/projects/${data._id}`}
      className="group flex w-full items-center justify-between py-1 text-sm font-medium text-foreground/60 hover:text-foreground"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/60">
        {formatTimestamp(data.updatedAt)}
      </span>
    </Link>
  );
};

const ContinueCard = ({ data }: ProjectItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last updated</span>
      <Button
        variant="outline"
        className="flex h-auto flex-col items-start justify-start gap-2 rounded-none border bg-background p-4"
        asChild
      >
        <Link href={`/projects/${data._id}`} className="group">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="truncate font-medium">{data.name}</span>
            </div>
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};

interface ProjectsListProps {
  onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring" />;
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent && <ContinueCard data={mostRecent} />}

      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            <button
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={onViewAll}
            >
              View all
              <Kbd className="border bg-accent">Ctrl + K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
