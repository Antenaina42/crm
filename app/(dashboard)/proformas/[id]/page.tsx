import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProformaPrintView } from "@/components/documents/ProformaPrintView";

export const revalidate = 0;

export default async function ProformaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [proforma, companySettings] = await Promise.all([
    prisma.proforma.findUnique({
      where: { id },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    }),
    prisma.companySettings.findFirst(),
  ]);

  if (!proforma) {
    notFound();
  }

  return <ProformaPrintView proforma={proforma} companySettings={companySettings} />;
}
