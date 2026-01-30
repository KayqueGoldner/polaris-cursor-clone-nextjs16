import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useEditor } from "@/features/editor/hooks/use-editor";

import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
  useRenameFile,
  useDeleteFile,
} from "../../hooks/use-files";
import { getItemPadding } from "./constants";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { TreeItemWrapper } from "./tree-item-wrapper";
import { RenameInput } from "./rename-input";

interface TreeProps {
  item: Doc<"files">;
  level?: number;
  projectId: Id<"projects">;
}

export const Tree = ({ item, level = 0, projectId }: TreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreating, setIsCreating] = useState<"file" | "folder" | null>(null);

  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const createFile = useCreateFile();
  const createFolder = useCreateFolder();

  const { openFile, closeTab, activeTabId } = useEditor(projectId);

  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: item.type === "folder" && isOpen,
  });

  const handleRename = (newName: string) => {
    setIsRenaming(false);

    if (newName === item.name) return;

    renameFile({
      id: item._id,
      newName,
    });
  };

  const handleCreate = (name: string) => {
    setIsCreating(null);

    if (isCreating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: item._id,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: item._id,
      });
    }
  };

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setIsCreating(type);
  };

  if (item.type === "file") {
    const fileName = item.name;
    const isActive = activeTabId === item._id;

    if (isRenaming) {
      return (
        <RenameInput
          type="file"
          defaultValue={fileName}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }

    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={isActive}
        onClick={() => openFile(item._id, { pinned: false })}
        onDoubleClick={() => openFile(item._id, { pinned: true })}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          closeTab(item._id);
          deleteFile({ id: item._id });
        }}
      >
        <FileIcon fileName={fileName} autoAssign={true} className="size-4" />
        <span className="truncate text-sm">{item.name}</span>
      </TreeItemWrapper>
    );
  }

  const folderName = item.name;

  const folderRender = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            isOpen && "rotate-90",
          )}
        />
        <FolderIcon folderName={folderName} className="size-4" />
      </div>
      <span className="truncate text-sm">{item.name}</span>
    </>
  );

  if (isCreating) {
    return (
      <>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex h-5.5 w-full items-center gap-1 hover:bg-accent/30"
          style={{
            paddingLeft: getItemPadding(level, false),
          }}
        >
          {folderRender}
        </button>
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}

            <CreateInput
              type={isCreating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(null)}
            />

            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  if (isRenaming) {
    return (
      <>
        <RenameInput
          type="folder"
          defaultValue={folderName}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
          isOpen={isOpen}
        />
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}

            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => setIsOpen((prev) => !prev)}
        onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          deleteFile({ id: item._id });
        }}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
      >
        {folderRender}
      </TreeItemWrapper>
      {isOpen && (
        <>
          {folderContents === undefined && <LoadingRow level={level + 1} />}

          {folderContents?.map((subItem) => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};
