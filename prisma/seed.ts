import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("user1234", 10);

  await db.user.upsert({
    where: { email: "usuario@biblioteca.com" },
    update: {},
    create: {
      name: "Juan Usuario",
      email: "usuario@biblioteca.com",
      password,
      role: "USER",
      status: "APPROVED",
      image: "https://ui-avatars.com/api/?name=Juan+Usuario",
    },
  });

  console.log("✅ Usuario creado: usuario@biblioteca.com / user1234");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
