import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, sessionCookieOptions } from "@/lib/session";

const RESERVED = new Set([
  "api", "login", "signup", "logout", "dashboard", "settings",
  "availability", "integrations", "admin", "app", "auth",
  "www", "blog", "help", "docs", "about", "pricing",
  "terms", "privacy", "support",
]);

function slugifyUsername(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const usernameRaw = String(body.username ?? "").trim().toLowerCase();

  if (!name || !email || !password || !usernameRaw) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 422 });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 422 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Senha precisa ter ao menos 8 caracteres." }, { status: 422 });
  }

  const username = slugifyUsername(usernameRaw);
  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username precisa ter ao menos 3 caracteres (letras/números)." },
      { status: 422 }
    );
  }

  if (RESERVED.has(username)) {
    return NextResponse.json({ error: "Este username é reservado." }, { status: 422 });
  }

  const [emailExists, usernameExists] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    prisma.user.findUnique({ where: { username }, select: { id: true } }),
  ]);

  if (emailExists) {
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
  }
  if (usernameExists) {
    return NextResponse.json({ error: "Username já em uso." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        hashedPassword,
        welcomeMessage: "Reserve um horário comigo.",
        eventTypes: {
          create: [
            { title: "Reunião 30min", duration: 30, slug: "30min" },
            { title: "Reunião 60min", duration: 60, slug: "60min" },
          ],
        },
        availability: {
          create: [1, 2, 3, 4, 5].map((day) => ({
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "18:00",
            isActive: true,
          })),
        },
      },
    });

    const token = await createSession({ userId: user.id, email: user.email, name: user.name });
    const res = NextResponse.json({ ok: true, username: user.username });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (err) {
    console.error("POST /api/signup error", err);
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
