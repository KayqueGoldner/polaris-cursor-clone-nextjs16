import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import { getItemPadding } from "./constants";
import { Doc } from "../../../../../convex/_generated/dataModel";

interface TreeItemWrapperProps {
  item: Doc<"files">;
  level: number;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}

export const TreeItemWrapper = ({
  item,
  level = 0,
  children,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: TreeItemWrapperProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onRename?.();
            }
          }}
          className={cn(
            "group flex h-5.5 w-full items-center gap-1 outline-none hover:bg-accent/30 focus:ring-1 focus:ring-ring focus:ring-inset",
            isActive && "bg-accent/30",
          )}
          style={{
            paddingLeft: getItemPadding(level, item.type === "file"),
          }}
        >
          {children}
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-64"
      >
        {item.type === "folder" && (
          <>
            <ContextMenuItem onClick={onCreateFile} className="text-sm">
              New File...
            </ContextMenuItem>
            <ContextMenuItem onClick={onCreateFolder} className="text-sm">
              New Folder...
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem onClick={onRename} className="text-sm">
          Rename...
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-sm">
          Delete Permanently
          <ContextMenuShortcut>Ctrl + Backspace</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
