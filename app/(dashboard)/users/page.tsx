import { UsersManagementView } from "@/components/users/UsersManagementView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UsersPage() {
  const user = await getCurrentUser();

  // Si le rôle est commercial, interdire l'accès et rediriger vers le dashboard
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  return <UsersManagementView />;
}
