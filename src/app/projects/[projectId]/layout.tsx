import ProjectIdLayout from "@/features/projects/components/project-id-layout";

import { Id } from "../../../../convex/_generated/dataModel";

interface ProjectIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

const Layout = async ({ children, params }: ProjectIdLayoutProps) => {
  const { projectId } = await params;
  const convexProjectId = projectId as Id<"projects">;

  return (
    <ProjectIdLayout projectId={convexProjectId}>{children}</ProjectIdLayout>
  );
};

export default Layout;
