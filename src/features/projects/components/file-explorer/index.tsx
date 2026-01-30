import { useState } from "react";
import {
  ChevronRightIcon,
  CopyMinusIcon,
  FilePlusCornerIcon,
  FolderPlusIcon,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Id } from "../../../../../convex/_generated/dataModel";
import { useProject } from "../../hooks/use-projects";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
} from "../../hooks/use-files";
import { CreateInput } from "./create-input";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";

interface FileExplorerProps {
  projectId: Id<"projects">;
}

export const FileExplorer = ({ projectId }: FileExplorerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen,
  });
  const project = useProject(projectId);

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();

  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: undefined,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: undefined,
      });
    }
  };

  return (
    <div className="h-full bg-sidebar">
      <ScrollArea>
        <div
          role="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group/project flex h-5.5 w-full cursor-pointer items-center gap-0.5 bg-accent text-left font-bold"
        >
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              isOpen && "rotate-90",
            )}
          />
          <p className="line-clamp-1 text-xs uppercase">
            {project?.name ?? "Loading..."}
          </p>

          <div className="ml-auto flex items-center gap-0.5 opacity-0 transition-none duration-0 group-hover/project:opacity-100">
            <Button
              size="icon-xs"
              variant="highlight"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setIsOpen(true);
                setCreating("file");
              }}
            >
              <FilePlusCornerIcon className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="highlight"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setIsOpen(true);
                setCreating("folder");
              }}
            >
              <FolderPlusIcon className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="highlight"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setCollapseKey((prev) => prev + 1);
              }}
            >
              <CopyMinusIcon className="size-3.5" />
            </Button>
          </div>
        </div>

        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}

            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}

            {rootFiles?.map((file) => (
              <Tree
                key={`${file._id}-${collapseKey}`}
                item={file}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
