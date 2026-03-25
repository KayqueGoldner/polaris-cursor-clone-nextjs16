"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useProject,
  useRenameProject,
} from "@/features/projects/hooks/use-projects";

import { Id } from "../../../../convex/_generated/dataModel";

interface NavbarProps {
  projectId: Id<"projects">;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Navbar = ({ projectId }: NavbarProps) => {
  const project = useProject(projectId);
  const renameProject = useRenameProject();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(project?.name ?? "");

  const handleStartRename = () => {
    if (!project) return;

    setIsRenaming(true);
    setName(project.name);
  };

  const handleSubmit = () => {
    if (!project) return;

    setIsRenaming(false);

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === project.name) return;

    renameProject({ id: projectId, name: trimmedName });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
    }
  };

  return (
    <nav className="flex items-center justify-between gap-x-2 border-b bg-sidebar p-2">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-1.5" asChild>
                <Button variant="ghost" className="h-7! w-fit! p-1.5!" asChild>
                  <Link href="/">
                    <Image
                      src="/logo.svg"
                      alt="Polaris"
                      width={20}
                      height={20}
                      unoptimized
                    />
                    <span className={cn("text-sm font-medium", font.className)}>
                      Polaris
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="mr-1 ml-0" />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="max-w-40 truncate bg-transparent text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-ring focus:ring-inset"
                />
              ) : (
                <BreadcrumbPage
                  className="max-w-40 cursor-pointer truncate text-sm font-medium hover:text-primary"
                  onClick={handleStartRename}
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Importing...</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <CloudCheckIcon className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              Saved{" "}
              {project?.updatedAt
                ? formatDistanceToNow(project.updatedAt, { addSuffix: true })
                : ""}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
