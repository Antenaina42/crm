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

  const [contract, invoice, proforma, companySettings] = await Promise.all([
    prisma.contract.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        project: true,
      },
    }),
    prisma.invoice.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    }),
    prisma.proforma.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    }),
    prisma.companySettings.findFirst(),
  ]);

  if (contract) {
    return (
      <PublicSignView
        documentType="CONTRACT"
        data={contract}
        token={token}
        companySettings={companySettings}
      />
    );
  }

  if (invoice) {
    return (
      <PublicSignView
        documentType="INVOICE"
        data={invoice}
        token={token}
        companySettings={companySettings}
      />
    );
  }

  if (proforma) {
    return (
      <PublicSignView
        documentType="PROFORMA"
        data={proforma}
        token={token}
        companySettings={companySettings}
      />
    );
  }

  notFound();
}
