import ProjectIdLayout from "@/features/projects/components/project-id-layout";

import { Id } from "../../../../convex/_generated/dataModel";

interface ProjectIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: Id<"projects"> }>;
}

const Layout = async ({ children, params }: ProjectIdLayoutProps) => {
  const { projectId } = await params;

  return <ProjectIdLayout projectId={projectId}>{children}</ProjectIdLayout>;
};

export default Layout;
