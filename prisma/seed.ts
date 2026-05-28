import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD ?? "calme2024!";
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { username: "claudio" },
    update: {},
    create: {
      name: "Cláudio Fernandes",
      role: "Arquiteto de Soluções",
      email: "claudio@aetheric.com",
      username: "claudio",
      hashedPassword: hashed,
      welcomeMessage:
        "Agende uma reunião com a nossa equipe. Atendimento corporativo, sem fricção.",
      primaryColor: "#0a0a09",
      primaryContainer: "#f4f4f3",
      eventTypes: {
        create: [
          {
            title: "Consulta de 30 min",
            description:
              "Uma conversa rápida para discutir seu projeto e alinhar expectativas iniciais.",
            duration: 30,
            slug: "consulta-30min",
          },
          {
            title: "Demo de Produto",
            description:
              "Demonstração completa da solução com walkthrough das funcionalidades.",
            duration: 60,
            slug: "demo-produto",
          },
          {
            title: "Kickoff de Projeto",
            description:
              "Reunião de alinhamento inicial para definir escopo, cronograma e responsáveis.",
            duration: 45,
            slug: "kickoff",
          },
        ],
      },
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
          { dayOfWeek: 1, startTime: "14:00", endTime: "18:00" },
          { dayOfWeek: 2, startTime: "09:00", endTime: "12:00" },
          { dayOfWeek: 2, startTime: "14:00", endTime: "18:00" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" },
          { dayOfWeek: 3, startTime: "14:00", endTime: "18:00" },
          { dayOfWeek: 4, startTime: "09:00", endTime: "12:00" },
          { dayOfWeek: 4, startTime: "14:00", endTime: "18:00" },
          { dayOfWeek: 5, startTime: "09:00", endTime: "12:00" },
          { dayOfWeek: 5, startTime: "14:00", endTime: "17:00" },
        ],
      },
    },
  });

  console.log(`✓ Seed concluído. Usuário: ${user.username}`);
  console.log(`  Login: ${user.email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
