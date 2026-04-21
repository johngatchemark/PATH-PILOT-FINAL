import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const matchedSkills = await prisma.careerSkill.findMany({
      where: { skill_name: { in: ["React", "TypeScript", "Node.js"] } }
    });
    console.log("Matched:", matchedSkills);
    
    // test insert dummy user
    const dummyUserId = "11111111-2222-3333-4444-555555555555";
    
    await prisma.userSkill.createMany({
      data: matchedSkills.map(s => ({
        userId: dummyUserId,
        careerSkillId: s.id
      }))
    });
    console.log("Created successfully");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
