import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const MAX_SERVICE_TYPES = 5;
const ALLOWED_DURATIONS = new Set([15, 30, 45, 60, 90]);
const MAX_WELCOME = 240;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      username: true,
      avatarUrl: true,
      bannerUrl: true,
      welcomeMessage: true,
      primaryColor: true,
      primaryContainer: true,
      eventTypes: {
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true, duration: true, slug: true, isActive: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  return NextResponse.json(user);
}

interface ServiceTypeInput {
  id?: string;
  title: string;
  duration: number;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "evento";
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name.trim().slice(0, 80);
  if (typeof body.role === "string") data.role = body.role.trim().slice(0, 80) || null;
  if (typeof body.email === "string") {
    const e = body.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 422 });
    }
    data.email = e;
  }
  if (typeof body.welcomeMessage === "string") {
    data.welcomeMessage = body.welcomeMessage.slice(0, MAX_WELCOME) || null;
  }
  if (typeof body.primaryColor === "string" && /^#[0-9a-fA-F]{6}$/.test(body.primaryColor)) {
    data.primaryColor = body.primaryColor;
  }
  if (typeof body.primaryContainer === "string" && /^#[0-9a-fA-F]{6}$/.test(body.primaryContainer)) {
    data.primaryContainer = body.primaryContainer;
  }
  if (typeof body.avatarUrl === "string") data.avatarUrl = body.avatarUrl || null;
  if (typeof body.bannerUrl === "string") data.bannerUrl = body.bannerUrl || null;

  const services: ServiceTypeInput[] | undefined = Array.isArray(body.serviceTypes)
    ? body.serviceTypes
    : undefined;

  if (services && services.length > MAX_SERVICE_TYPES) {
    return NextResponse.json(
      { error: `Máximo de ${MAX_SERVICE_TYPES} tipos de serviço` },
      { status: 422 }
    );
  }

  try {
    if (data.email && data.email !== session.email) {
      const exists = await prisma.user.findUnique({ where: { email: data.email as string } });
      if (exists && exists.id !== session.userId) {
        return NextResponse.json({ error: "E-mail já em uso" }, { status: 409 });
      }
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.user.update({ where: { id: session.userId }, data });
      }

      if (services) {
        const cleaned = services
          .map((s) => ({
            id: typeof s.id === "string" && s.id.startsWith("c") ? s.id : undefined,
            title: String(s.title ?? "").trim().slice(0, 60),
            duration: ALLOWED_DURATIONS.has(Number(s.duration)) ? Number(s.duration) : 30,
          }))
          .filter((s) => s.title.length > 0);

        const keepIds = cleaned.filter((s) => s.id).map((s) => s.id!);

        await tx.eventType.deleteMany({
          where: { userId: session.userId, id: { notIn: keepIds.length ? keepIds : ["__none__"] } },
        });

        const existing = await tx.eventType.findMany({
          where: { userId: session.userId },
          select: { slug: true },
        });
        const usedSlugs = new Set(existing.map((e) => e.slug));

        for (const s of cleaned) {
          let slug = slugify(s.title);
          let suffix = 1;
          const baseSlug = slug;
          while (usedSlugs.has(slug)) {
            suffix += 1;
            slug = `${baseSlug}-${suffix}`;
          }
          usedSlugs.add(slug);

          if (s.id) {
            await tx.eventType.update({
              where: { id: s.id },
              data: { title: s.title, duration: s.duration, isActive: true },
            });
          } else {
            await tx.eventType.create({
              data: {
                userId: session.userId,
                title: s.title,
                duration: s.duration,
                slug,
                isActive: true,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/users/me error", err);
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}
