import 'dotenv/config'
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const careersData = [
  {
    title: "Software Engineer",
    domain: "Information Technology",
    description: "Design, develop, and maintain software applications and systems.",
    skills: [
      { name: "JavaScript", is_required: true },
      { name: "React", is_required: false },
      { name: "Node.js", is_required: false },
      { name: "SQL", is_required: true },
      { name: "Problem Solving", is_required: true }
    ],
    levels: [
      { level: "Intern", years: 0 },
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Data Analyst",
    domain: "Data & Analytics",
    description: "Interpret data and turn it into information which can offer ways to improve a business.",
    skills: [
      { name: "SQL", is_required: true },
      { name: "Python", is_required: true },
      { name: "Excel", is_required: true },
      { name: "Data Visualization", is_required: true },
      { name: "Statistics", is_required: false }
    ],
    levels: [
      { level: "Intern", years: 0 },
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "UI/UX Designer",
    domain: "Design",
    description: "Gather and evaluate user requirements, design graphic elements and build navigation components.",
    skills: [
      { name: "Figma", is_required: true },
      { name: "Prototyping", is_required: true },
      { name: "Wireframing", is_required: true },
      { name: "User Research", is_required: false },
      { name: "CSS", is_required: false }
    ],
    levels: [
      { level: "Intern", years: 0 },
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Product Manager",
    domain: "Product",
    description: "Identify the customer need and the larger business objectives that a product or feature will fulfill.",
    skills: [
      { name: "Agile", is_required: true },
      { name: "Communication", is_required: true },
      { name: "Leadership", is_required: true },
      { name: "Market Research", is_required: false },
      { name: "Data Analysis", is_required: false }
    ],
    levels: [
      { level: "Associate", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Marketing Specialist",
    domain: "Marketing",
    description: "Create and manage marketing campaigns to promote products and services.",
    skills: [
      { name: "SEO", is_required: false },
      { name: "Content Creation", is_required: true },
      { name: "Social Media", is_required: true },
      { name: "Copywriting", is_required: true }
    ],
    levels: [
      { level: "Intern", years: 0 },
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 }
    ]
  },
  {
    title: "Cybersecurity Analyst",
    domain: "Information Technology",
    description: "Protect company hardware, software, and networks from cybercriminals.",
    skills: [
      { name: "Network Security", is_required: true },
      { name: "Risk Management", is_required: true },
      { name: "Linux", is_required: false },
      { name: "Python", is_required: false }
    ],
    levels: [
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Sales Representative",
    domain: "Sales",
    description: "Sell products and services to customers, and represent the brand.",
    skills: [
      { name: "Communication", is_required: true },
      { name: "Negotiation", is_required: true },
      { name: "CRM", is_required: false },
      { name: "Networking", is_required: true }
    ],
    levels: [
      { level: "Entry", years: 0 },
      { level: "Mid-Level", years: 2 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Human Resources Specialist",
    domain: "HR",
    description: "Recruit, screen, interview, and place workers.",
    skills: [
      { name: "Communication", is_required: true },
      { name: "Recruitment", is_required: true },
      { name: "Employee Relations", is_required: true },
      { name: "Conflict Resolution", is_required: false }
    ],
    levels: [
      { level: "Assistant", years: 0 },
      { level: "Specialist", years: 2 },
      { level: "Manager", years: 5 }
    ]
  },
  {
    title: "Financial Analyst",
    domain: "Finance",
    description: "Guide businesses and individuals making investment decisions.",
    skills: [
      { name: "Financial Modeling", is_required: true },
      { name: "Excel", is_required: true },
      { name: "Accounting", is_required: true },
      { name: "Forecasting", is_required: false }
    ],
    levels: [
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  },
  {
    title: "Customer Success Manager",
    domain: "Customer Service",
    description: "Ensure customers are satisfied with a company's products and services.",
    skills: [
      { name: "Communication", is_required: true },
      { name: "Empathy", is_required: true },
      { name: "Problem Solving", is_required: true },
      { name: "CRM", is_required: false }
    ],
    levels: [
      { level: "Junior", years: 1 },
      { level: "Mid-Level", years: 3 },
      { level: "Senior", years: 5 }
    ]
  }
];

async function main() {
  console.log("Start seeding careers...")

  for (const career of careersData) {
    const createdCareer = await prisma.career.create({
      data: {
        title: career.title,
        domain: career.domain,
        description: career.description,
        skills: {
          create: career.skills.map(skill => ({
            skill_name: skill.name,
            is_required: skill.is_required
          }))
        },
        levels: {
          create: career.levels.map(level => ({
            level_name: level.level,
            required_experience_years: level.years
          }))
        }
      }
    })
    console.log(`Created career: ${createdCareer.title}`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error("--- SEEDING ERROR ---");
    console.error(e);
    if (e.message) console.error("Message:", e.message);
    if (e.code) console.error("Code:", e.code);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
