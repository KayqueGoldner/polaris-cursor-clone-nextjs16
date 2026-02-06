"use client";

import { Allotment } from "allotment";

import Navbar from "@/features/projects/components/navbar";
import ConversationSidebar from "@/features/conversations/components/conversation-sidebar";

import { Id } from "../../../../convex/_generated/dataModel";

interface ProjectIdLayoutProps {
  children: React.ReactNode;
  projectId: Id<"projects">;
}

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

const ProjectIdLayout = ({ children, projectId }: ProjectIdLayoutProps) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar projectId={projectId} />
      <div className="flex flex-1 overflow-hidden">
        <Allotment
          className="flex-1"
          defaultSizes={[DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
        >
          <Allotment.Pane
            snap={true}
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <ConversationSidebar projectId={projectId} />
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};

export default ProjectIdLayout;
