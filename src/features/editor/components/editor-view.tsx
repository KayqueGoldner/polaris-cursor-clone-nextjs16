import Image from "next/image";
import { useEffect, useRef } from "react";
import { AlertTriangleIcon } from "lucide-react";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";

import { Id } from "../../../../convex/_generated/dataModel";
import { TopNavigation } from "./top-navigation";
import { useEditor } from "../hooks/use-editor";
import { FileBreadcrumb } from "./file-breadcrumb";
import { CodeEditor } from "./code-editor";

interface EditorViewProps {
  projectId: Id<"projects">;
}

const DEBOUNCE_MS = 1500;

export const EditorView = ({ projectId }: EditorViewProps) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [activeTabId]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>

      {activeTabId && <FileBreadcrumb projectId={projectId} />}

      <div className="min-h-0 flex-1 bg-background">
        {!activeFile && (
          <div className="flex size-full items-center justify-center">
            <Image
              src="/logo-alt.svg"
              alt="Polaris"
              width={50}
              height={50}
              className="opacity-25"
              unoptimized
            />
          </div>
        )}

        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            initialValue={activeFile.content}
            onChange={(value) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              timeoutRef.current = setTimeout(() => {
                updateFile({
                  id: activeFile._id,
                  content: value,
                });
              }, DEBOUNCE_MS);
            }}
          />
        )}

        {isActiveFileBinary && (
          <div className="flex size-full items-center justify-center">
            <div className="flex max-w-md flex-col items-center gap-2.5 text-center">
              <AlertTriangleIcon className="size-10 text-yellow-500" />
              <p className="text-sm">
                The file is not displayed in the text editor because it is
                either binary or uses an unsupported text encoding.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
