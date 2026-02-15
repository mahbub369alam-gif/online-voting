const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create admin users
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@evoting.gov" },
    update: {},
    create: {
      email: "admin@evoting.gov",
      name: "System Administrator",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", adminUser);

  // Create super admin
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@evoting.gov" },
    update: {},
    create: {
      email: "superadmin@evoting.gov",
      name: "Super Admin",
      password: superAdminPassword,
      role: "super-admin",
    },
  });

  console.log("Super admin created:", superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
