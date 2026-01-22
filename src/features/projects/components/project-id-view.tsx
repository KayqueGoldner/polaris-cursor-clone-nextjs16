"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";

import { cn } from "@/lib/utils";

import { Id } from "../../../../convex/_generated/dataModel";

interface ProjectIdViewProps {
  projectId: Id<"projects">;
}

export const ProjectIdView = ({ projectId }: ProjectIdViewProps) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div className="flex h-full flex-col">
      <nav className="flex h-8.75 items-center border-b bg-sidebar">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />
        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />
        <div className="flex h-full flex-1 items-center justify-end">
          <div className="flex h-full cursor-pointer items-center gap-1.5 border-l px-3 text-muted-foreground hover:bg-accent/30">
            <FaGithub className="size-3.5" />
            <span>Export</span>
          </div>
        </div>
      </nav>
      <div className="relative flex-1">
        <div
          className={cn(
            "absolute inset-0",
            activeView === "editor" ? "visible" : "invisible",
          )}
        >
          <div>editor</div>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView === "preview" ? "visible" : "invisible",
          )}
        >
          <div>preview</div>
        </div>
      </div>
    </div>
  );
};

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <div
      className={cn(
        "flex h-full cursor-pointer items-center gap-2 border-r px-3 text-muted-foreground hover:bg-accent/30",
        isActive && "bg-background text-foreground",
      )}
      onClick={onClick}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};
