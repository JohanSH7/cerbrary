import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function createAdmin() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  try {
    const admin = await db.user.upsert({
      where: { email: "admin@biblioteca.com" },
      update: {},
      create: {
        name: "Administrador",
        email: "admin@biblioteca.com",
        password: adminPassword,
        role: "ADMIN",
        status: "APPROVED",
      },
    });

    console.log("✅ Administrador creado:");
    console.log("📧 Email: admin@biblioteca.com");
    console.log("🔐 Password: admin123");
    console.log("👤 Role: ADMIN");
    console.log("✅ Status: APPROVED");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
