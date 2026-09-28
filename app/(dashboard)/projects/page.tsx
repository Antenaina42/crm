import { prisma } from "@/lib/prisma";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

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
