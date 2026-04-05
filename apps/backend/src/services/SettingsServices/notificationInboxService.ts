import { prisma } from "@workspace/db";

export async function listNotifications(
  userId: string,
  archived: boolean = false,
) {
  const notifications = await (prisma as any).notification.findMany({
    where: { userId, isArchived: archived },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return notifications;
}

export async function getUnreadCount(userId: string) {
  const count = await (prisma as any).notification.count({
    where: { userId, isRead: false, isArchived: false },
  });
  return count;
}

export async function markAsRead(userId: string, notificationId: string) {
  await (prisma as any).notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  await (prisma as any).notification.updateMany({
    where: { userId, isRead: false, isArchived: false },
    data: { isRead: true },
  });
}

export async function archiveAll(userId: string) {
  await (prisma as any).notification.updateMany({
    where: { userId, isArchived: false },
    data: { isArchived: true, isRead: true },
  });
}
