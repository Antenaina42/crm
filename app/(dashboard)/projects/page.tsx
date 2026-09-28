import { prisma } from "@/lib/prisma";
import { ProjectsView } from "@/components/projects/ProjectsView";

export const revalidate = 0;

export default async function ProjectsPage() {
  const [projects, clients, team] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        manager: true,
        tasks: true,
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProjectsView
      initialProjects={projects}
      clients={clients}
      team={team}
    />
  );
}
