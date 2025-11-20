import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  // Get all model names from Prisma Client
  const dmmf = (prisma as any)._baseDmmf;
  const modelNames = dmmf.datamodel.models.map((model: any) => model.name);
  
  console.log('Available Prisma models:');
  modelNames.forEach((name: string) => console.log(`- ${name}`));
  
  await prisma.$disconnect();
}

main().catch(console.error);
