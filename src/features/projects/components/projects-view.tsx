"use client";

import { Poppins } from "next/font/google";
import { SparkleIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCreateProject } from "@/features/projects/hooks/use-projects";

import { ProjectsList } from "./projects-list";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
  const createProject = useCreateProject();

  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setCommandDialogOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />

      <div className="flex min-h-screen flex-col items-center justify-center bg-sidebar p-6 md:p-16">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="group/logo flex w-full items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Polaris"
                className="size-[32px] md:size-[46px]"
                width={46}
                height={46}
                unoptimized
              />
              <h1
                className={cn(
                  "text-4xl font-semibold md:text-5xl",
                  font.className,
                )}
              >
                Polaris
              </h1>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex h-full flex-col items-start justify-start gap-6 rounded-none border bg-background p-4"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, animals],
                    separator: "-",
                    length: 3,
                  });

                  createProject({
                    name: projectName,
                  });
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <SparkleIcon className="size-4" />
                  <Kbd className="border bg-accent">Ctrl + J</Kbd>
                </div>
                <div>
                  <span className="text-sm">New</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex h-full flex-col items-start justify-start gap-6 rounded-none border bg-background p-4"
                onClick={() => {}}
              >
                <div className="flex w-full items-center justify-between">
                  <FaGithub className="size-4" />
                  <Kbd className="border bg-accent">Ctrl + I</Kbd>
                </div>
                <div>
                  <span className="text-sm">Import</span>
                </div>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
};
