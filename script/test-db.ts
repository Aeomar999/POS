import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log("Users:", users.map(u => ({ username: u.username, role: u.role, isActive: u.isActive })));
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
