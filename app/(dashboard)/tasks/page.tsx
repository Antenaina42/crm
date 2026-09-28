import { prisma } from "@/lib/prisma";
import { TasksKanbanView } from "@/components/tasks/TasksKanbanView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [tasks, projects, team] = await Promise.all([
    prisma.task.findMany({
      orderBy: { order: "asc" },
      include: {
        project: { include: { client: true } },
        assignee: true,
      },
    }),
    prisma.project.findMany({ orderBy: { title: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <TasksKanbanView
      initialTasks={tasks}
      projects={projects}
      team={team}
    />
  );
}
