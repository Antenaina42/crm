import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicSignView } from "@/components/signature/PublicSignView";

export const revalidate = 0;

export default async function PublicSignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const contract = await prisma.contract.findUnique({
    where: { signToken: token },
    include: {
      client: true,
      project: true,
    },
  });

  if (!contract) {
    notFound();
  }

  return <PublicSignView contract={contract} />;
}
