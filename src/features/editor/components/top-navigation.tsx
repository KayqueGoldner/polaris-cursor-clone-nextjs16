import { FileIcon } from "@react-symbols/icons/utils";
import { XIcon } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFile } from "@/features/projects/hooks/use-files";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";

interface TopNavigationProps {
  projectId: Id<"projects">;
}

export const TopNavigation = ({ projectId }: TopNavigationProps) => {
  const { openTabs } = useEditor(projectId);

  return (
    <ScrollArea className="flex-1">
      <nav className="flex h-8.75 items-center border-b bg-sidebar">
        {openTabs.map((fileId, index) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isFirst={index === 0}
            projectId={projectId}
          />
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const Tab = ({
  fileId,
  isFirst,
  projectId,
}: {
  fileId: Id<"files">;
  isFirst: boolean;
  projectId: Id<"projects">;
}) => {
  const file = useFile(fileId);
  const { activeTabId, previewTabId, setActiveTab, openFile, closeTab } =
    useEditor(projectId);

  const isActive = fileId === activeTabId;
  const isPreview = fileId === previewTabId;
  const fileName = file?.name ?? "Loading...";

  return (
    <div
      className={cn(
        "group flex h-8.75 cursor-pointer items-center gap-2 border-x border-y border-transparent pr-1.5 pl-2 text-muted-foreground hover:bg-accent/30",
        isActive &&
          "-mb-px border-x-border border-b-background bg-background text-foreground drop-shadow",
        isFirst && "border-l-transparent!",
      )}
      onClick={() => setActiveTab(fileId)}
      onDoubleClick={() => openFile(fileId, { pinned: true })}
    >
      {file === undefined ? (
        <Spinner className="text-ring" />
      ) : (
        <FileIcon className="size-4" fileName={fileName} autoAssign={true} />
      )}

      <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
        {fileName}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeTab(fileId);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            closeTab(fileId);
          }
        }}
        className={cn(
          "rounded-sm p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10",
          isActive && "opacity-100",
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
};
