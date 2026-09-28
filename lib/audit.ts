import { prisma } from "./prisma";

interface LogParams {
  clientId?: string | null;
  userId?: string | null;
  action: string;
  details?: string;
  entityType?: string;
  entityId?: string;
}

export async function logActivity(params: LogParams) {
  try {
    return await prisma.activityLog.create({
      data: {
        clientId: params.clientId || null,
        userId: params.userId || null,
        action: params.action,
        details: params.details || null,
        entityType: params.entityType || null,
        entityId: params.entityId || null,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'activité:", error);
  }
}
