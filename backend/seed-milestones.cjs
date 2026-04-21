const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedMilestones() {
  const careers = await prisma.career.findMany();
  
  for (const career of careers) {
    const existing = await prisma.milestone.findFirst({ where: { careerId: career.id } });
    if (existing) continue;

    console.log(`Seeding milestones for ${career.title}...`);

    const milestones = [
      {
        title: "Foundation Phase",
        description: `Master the core principles of ${career.domain}. Focus on fundamental concepts and tools relevant to ${career.title}.`,
        order: 1,
        careerId: career.id
      },
      {
        title: "Specialization",
        description: "Deep dive into advanced topics, frameworks, and specialized methodologies used by industry professionals.",
        order: 2,
        careerId: career.id
      },
      {
        title: "Portfolio Development",
        description: "Build 2-3 high-impact projects that demonstrate your ability to solve real-world problems in this field.",
        order: 3,
        careerId: career.id
      },
      {
        title: "Industry Integration",
        description: "Network with professionals, prepare for technical interviews, and apply for roles within the field.",
        order: 4,
        careerId: career.id
      }
    ];

    await prisma.milestone.createMany({ data: milestones });
  }

  console.log("Milestones seeded successfully!");
}

seedMilestones()
  .catch(e => console.error(e))
  .finally(() => {
    prisma.$disconnect();
    pool.end();
  });
