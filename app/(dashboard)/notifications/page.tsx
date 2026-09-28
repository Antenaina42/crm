import { prisma } from "@/lib/prisma";
import { NotificationsView } from "@/components/notifications/NotificationsView";

export const revalidate = 0;

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NotificationsView initialNotifications={notifications} />;
}
