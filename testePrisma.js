const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dicas = await prisma.dica.findMany();
  console.log(dicas);
}

main().catch(e => console.error(e));
