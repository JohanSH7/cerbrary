import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function checkAndUpdateUser() {
  try {
    // Verificar tu usuario actual
    const user = await db.user.findUnique({
      where: { email: "admin@biblioteca.com" },
    });

    if (user) {
      console.log("👤 Usuario encontrado:", {
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      });

      // Actualizarlo a ADMIN si no lo es
      if (user.role !== 'ADMIN') {
        await db.user.update({
          where: { email: "admin@biblioteca.com" },
          data: { 
            role: 'ADMIN',
            status: 'APPROVED'
          }
        });
        console.log("✅ Usuario actualizado a ADMIN");
      } else {
        console.log("✅ Usuario ya es ADMIN");
      }
    } else {
      console.log("❌ Usuario no encontrado");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await db.$disconnect();
  }
}

checkAndUpdateUser();
