import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function getAdminSession() {
  const session = await getSession();
  if (!session) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return null;
  if (!adminEmails.includes(session.email.toLowerCase())) return null;

  return session;
}

export async function ensureAdminUserExists(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!u) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(u.email.toLowerCase());
}
