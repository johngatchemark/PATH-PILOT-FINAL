const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting massive data expansion...");

  // Clean up
  await prisma.career.deleteMany({});
  
  const careers = [
    // --- Technology & IT ---
    {
      title: "Software Engineer", domain: "Computer Science", category: "Technology & IT",
      description: "Build scalable software solutions.",
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Docker", "AWS", "Python", "CI/CD", "Unit Testing", "System Design"],
      interests: ["Open Source", "Software Architecture", "Automation", "Coding", "Cloud Computing"]
    },
    {
      title: "Data Scientist", domain: "Data Science", category: "Technology & IT",
      description: "Extract insights from big data.",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization", "Pandas", "Scikit-learn", "Deep Learning", "Spark"],
      interests: ["Artificial Intelligence", "Big Data", "Predictive Modeling", "Mathematics", "Research"]
    },
    {
      title: "Cybersecurity Analyst", domain: "Security", category: "Technology & IT",
      description: "Protect systems from threats.",
      skills: ["Network Security", "Ethical Hacking", "Linux", "Penetration Testing", "Security Auditing", "SIEM", "Firewalls", "Cryptography"],
      interests: ["Privacy", "Digital Forensics", "Network Architecture", "Information Security"]
    },
    {
      title: "DevOps Engineer", domain: "Infrastructure", category: "Technology & IT",
      description: "Bridge development and operations.",
      skills: ["Terraform", "Kubernetes", "Docker", "Jenkins", "AWS/Azure", "Bash Scripting", "Monitoring", "Infrastructure as Code"],
      interests: ["Automation", "Scalability", "System Administration", "Reliability Engineering"]
    },
    {
      title: "AI Engineer", domain: "Artificial Intelligence", category: "Technology & IT",
      description: "Develop AI models and systems.",
      skills: ["PyTorch", "TensorFlow", "NLP", "Computer Vision", "Reinforcement Learning", "Model Deployment", "Neural Networks"],
      interests: ["Machine Learning", "Robotics", "Future Tech", "Ethics in AI"]
    },
    {
      title: "QA Engineer", domain: "Testing", category: "Technology & IT",
      description: "Ensure software quality through testing.",
      skills: ["Selenium", "Cypress", "Automated Testing", "Bug Tracking", "API Testing", "Load Testing", "Test Planning"],
      interests: ["Quality Assurance", "Problem Solving", "Efficiency", "Detail Orientation"]
    },

    // --- Business & Management ---
    {
      title: "Product Manager", domain: "Management", category: "Business & Management",
      description: "Lead product development strategy.",
      skills: ["Agile", "Scrum", "Product Roadmap", "Market Research", "User Stories", "Stakeholder Management", "Data Analytics"],
      interests: ["Product Strategy", "User Experience", "Entrepreneurship", "Business Growth"]
    },
    {
      title: "Financial Analyst", domain: "Finance", category: "Business & Management",
      description: "Analyze financial performance.",
      skills: ["Excel", "Financial Modeling", "Corporate Finance", "Accounting", "Investment Analysis", "Risk Assessment", "ERP Systems"],
      interests: ["Stock Market", "Economics", "Venture Capital", "Wealth Management"]
    },
    {
      title: "HR Manager", domain: "Human Resources", category: "Business & Management",
      description: "Manage human capital.",
      skills: ["Recruitment", "Employee Relations", "Performance Management", "Conflict Resolution", "HRIS", "Compensation & Benefits"],
      interests: ["Psychology", "Diversity & Inclusion", "Corporate Culture", "Leadership"]
    },
    {
      title: "Operations Manager", domain: "Operations", category: "Business & Management",
      description: "Streamline business processes.",
      skills: ["Process Improvement", "Supply Chain", "Budgeting", "Team Management", "Vendor Relations", "Strategic Planning"],
      interests: ["Efficiency", "Logistics", "Business Optimization", "Project Execution"]
    },
    {
      title: "Business Analyst", domain: "Business", category: "Business & Management",
      description: "Bridge business needs and technical solutions.",
      skills: ["Requirement Gathering", "SQL", "Process Mapping", "Data Visualization", "User Acceptance Testing", "GAP Analysis"],
      interests: ["Problem Solving", "Business Intelligence", "Systems Analysis", "Efficiency"]
    },

    // --- Healthcare & Medicine ---
    {
      title: "Registered Nurse", domain: "Healthcare", category: "Healthcare & Medicine",
      description: "Provide patient care.",
      skills: ["Patient Care", "Medication Administration", "Emergency Response", "Critical Thinking", "Empathy", "Wound Care", "Vital Signs"],
      interests: ["Clinical Practice", "Public Health", "Holistic Wellness", "Medical Research"]
    },
    {
      title: "Medical Doctor", domain: "Medicine", category: "Healthcare & Medicine",
      description: "Diagnose and treat illnesses.",
      skills: ["Clinical Diagnosis", "Surgery", "Pharmacology", "Internal Medicine", "Patient Communication", "Medical Ethics"],
      interests: ["Medical Science", "Healthcare Innovation", "Public Policy", "Biology"]
    },
    {
      title: "Physiotherapist", domain: "Healthcare", category: "Healthcare & Medicine",
      description: "Help patients regain mobility.",
      skills: ["Rehabilitation", "Manual Therapy", "Exercise Prescription", "Kinesiology", "Pain Management", "Patient Education"],
      interests: ["Sports Medicine", "Human Anatomy", "Fitness", "Well-being"]
    },
    {
      title: "Pharmacist", domain: "Healthcare", category: "Healthcare & Medicine",
      description: "Dispense medication safely.",
      skills: ["Pharmacology", "Drug Interactions", "Counseling", "Inventory Management", "Clinical Pharmacy", "Regulatory Compliance"],
      interests: ["Pharmaceutical Science", "Patient Safety", "Chemistry", "Community Health"]
    },
    {
      title: "Laboratory Technician", domain: "Healthcare", category: "Healthcare & Medicine",
      description: "Analyze medical samples.",
      skills: ["Clinical Testing", "Microbiology", "Hematology", "Lab Safety", "Microscopy", "Data Entry", "Chemical Analysis"],
      interests: ["Scientific Research", "Biology", "Diagnostic Medicine", "Technology"]
    },

    // --- Creative Arts & Design ---
    {
      title: "UI/UX Designer", domain: "Design", category: "Creative Arts & Design",
      description: "Design digital experiences.",
      skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Visual Design", "Design Systems", "Interaction Design"],
      interests: ["Digital Art", "Accessibility", "Human-Computer Interaction", "Typography"]
    },
    {
      title: "Graphic Designer", domain: "Design", category: "Creative Arts & Design",
      description: "Create visual branding.",
      skills: ["Photoshop", "Illustrator", "InDesign", "Branding", "Layout Design", "Digital Illustration", "Color Theory"],
      interests: ["Advertising", "Fine Arts", "Modern Aesthetics", "Creative Direction"]
    },
    {
      title: "Video Editor", domain: "Media", category: "Creative Arts & Design",
      description: "Produce high-quality video content.",
      skills: ["Premiere Pro", "After Effects", "Color Grading", "Sound Editing", "Motion Graphics", "Storytelling", "DaVinci Resolve"],
      interests: ["Film Production", "Cinematography", "Storyboarding", "Content Creation"]
    },
    {
      title: "Content Writer", domain: "Media", category: "Creative Arts & Design",
      description: "Create written content for web.",
      skills: ["SEO Writing", "Copywriting", "Creative Writing", "Editing", "Content Strategy", "Blogging", "Ghostwriting"],
      interests: ["Literature", "Digital Marketing", "Journalism", "Storytelling"]
    },

    // --- Skilled Trades & Logistics ---
    {
      title: "Electrician", domain: "Trades", category: "Skilled Trades & Logistics",
      description: "Install electrical systems.",
      skills: ["Wiring", "Blueprint Reading", "Circuit Troubleshooting", "Safety Codes", "Maintenance", "Power Systems", "PLC"],
      interests: ["Engineering", "Infrastructure", "Technical Work", "Renewable Energy"]
    },
    {
      title: "Plumber", domain: "Trades", category: "Skilled Trades & Logistics",
      description: "Maintain water and gas systems.",
      skills: ["Pipefitting", "Welding", "Drainage", "Installation", "Plumbing Codes", "Fixture Repair", "Gas Fitting"],
      interests: ["Home Construction", "Technical Troubleshooting", "Water Conservation"]
    },
    {
      title: "HVAC Technician", domain: "Trades", category: "Skilled Trades & Logistics",
      description: "Manage climate control systems.",
      skills: ["Refrigeration", "Heating Systems", "Air Conditioning", "Electrical Troubleshooting", "Ventilation", "Maintenance"],
      interests: ["Mechanical Systems", "Energy Efficiency", "Building Technology"]
    },
    {
      title: "Logistics Manager", domain: "Supply Chain", category: "Skilled Trades & Logistics",
      description: "Oversee distribution networks.",
      skills: ["Inventory Management", "Supply Chain Planning", "Warehouse Operations", "Procurement", "Freight Management", "ERP"],
      interests: ["Global Trade", "Process Efficiency", "E-commerce", "Transportation"]
    },

    // --- Education & Legal ---
    {
      title: "Elementary Teacher", domain: "Education", category: "Education & Legal",
      description: "Educate young children.",
      skills: ["Classroom Management", "Lesson Planning", "Curriculum Development", "Student Assessment", "Child Development", "Patience"],
      interests: ["Childhood Education", "Mentoring", "Literacy", "Community Service"]
    },
    {
      title: "Lawyer", domain: "Law", category: "Education & Legal",
      description: "Provide legal representation.",
      skills: ["Legal Research", "Litigation", "Contract Law", "Public Speaking", "Negotiation", "Client Advising", "Critical Thinking"],
      interests: ["Justice", "Policy Making", "Ethics", "Corporate Law"]
    },
    {
      title: "Corporate Counsel", domain: "Law", category: "Education & Legal",
      description: "Handle legal matters for corporations.",
      skills: ["Corporate Law", "Mergers & Acquisitions", "Compliance", "Contract Negotiation", "Intellectual Property", "Risk Management"],
      interests: ["Business Strategy", "Governance", "Economics", "Finance"]
    },

    // --- Hospitality & Tourism ---
    {
      title: "Chef", domain: "Hospitality", category: "Hospitality & Tourism",
      description: "Oversee kitchen operations and food prep.",
      skills: ["Culinary Skills", "Menu Planning", "Kitchen Management", "Food Safety", "Cost Control", "Pastry Arts", "Team Leadership"],
      interests: ["Gastronomy", "Cooking", "Hospitality Management", "Sustainable Food"]
    },
    {
      title: "Hotel Manager", domain: "Hospitality", category: "Hospitality & Tourism",
      description: "Oversee hotel operations.",
      skills: ["Guest Services", "Hospitality Management", "Revenue Management", "Front Office Operations", "Event Planning", "Marketing"],
      interests: ["Customer Experience", "Travel", "Multiculturalism", "Service Excellence"]
    },

    // --- Sales & Customer Success ---
    {
      title: "Sales Representative", domain: "Sales", category: "Sales & Customer Success",
      description: "Drive revenue through product sales.",
      skills: ["Cold Calling", "Negotiation", "CRM (Salesforce)", "Public Speaking", "B2B Sales", "Lead Generation", "Closing Deals"],
      interests: ["Business Networking", "Psychology of Selling", "Entrepreneurship", "Communication"]
    },
    {
      title: "Customer Success Manager", domain: "Customer Success", category: "Sales & Customer Success",
      description: "Ensure customer satisfaction and retention.",
      skills: ["Relationship Management", "Product Onboarding", "Customer Feedback", "Retention Strategy", "Strategic Account Management"],
      interests: ["Client Satisfaction", "Education", "Consultative Selling", "Problem Solving"]
    },

    // --- Science & Engineering ---
    {
      title: "Civil Engineer", domain: "Engineering", category: "Science & Engineering",
      description: "Design infrastructure projects.",
      skills: ["AutoCAD", "Structural Analysis", "Project Management", "Construction Management", "Environmental Engineering", "Surveying"],
      interests: ["Urban Planning", "Sustainable Infrastructure", "Architecture", "Mathematics"]
    },
    {
      title: "Biotechnologist", domain: "Science", category: "Science & Engineering",
      description: "Apply biology for industrial use.",
      skills: ["Molecular Biology", "Genetics", "Lab Research", "Data Analysis", "Biochemistry", "Microbiology", "Regulatory Affairs"],
      interests: ["Scientific Discovery", "Healthcare Innovation", "Genomics", "Sustainability"]
    },
    {
      title: "Mechanical Engineer", domain: "Engineering", category: "Science & Engineering",
      description: "Design mechanical systems.",
      skills: ["SolidWorks", "Thermodynamics", "Product Design", "Manufacturing Processes", "CAD/CAM", "Robotics", "Material Science"],
      interests: ["Mechanics", "Automotive", "Aerospace", "Industrial Design"]
    },
  ];

  // Helper to generate levels for each career
  const generateLevels = () => [
    { level_name: "Entry", required_experience_years: 0 },
    { level_name: "Junior", required_experience_years: 1 },
    { level_name: "Mid", required_experience_years: 3 },
    { level_name: "Senior", required_experience_years: 5 },
    { level_name: "Lead/Director", required_experience_years: 8 },
  ];

  for (const c of careers) {
    const career = await prisma.career.create({
      data: {
        title: c.title,
        domain: c.domain,
        category: c.category,
        description: c.description,
        levels: {
          create: generateLevels()
        },
        skills: {
          create: c.skills.map(s => ({
            skill_name: s,
            is_required: true,
            category: c.category
          }))
        },
        interests: {
          create: c.interests.map(i => ({
            interest_name: i,
            category: c.category
          }))
        },
        milestones: {
          create: [
            { title: "Skill Acquisition", description: `Acquire the foundational skills required for a ${c.title} career.`, order: 1 },
            { title: "Early Career Experience", description: `Land your first role and gain practical experience in ${c.domain}.`, order: 2 },
            { title: "Specialization", description: `Identify and master a niche area within the ${c.title} field.`, order: 3 },
            { title: "Leadership & Impact", description: `Lead projects or teams and drive significant results in your organization.`, order: 4 },
          ]
        }
      }
    });
    console.log(`Created: ${career.title}`);
  }

  // Also add some extra "General" skills and interests that might not be tied to specific careers in this list but are useful
  console.log("Seeding complete!");
}

main()
  .catch(e => console.error(e))
  .finally(() => {
    prisma.$disconnect();
    pool.end();
  });
