import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { generateRecommendations } from './services/recommendationService.js';

dotenv.config();

const app = express();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ========================
// 1. Auth & Users API
// ========================

// Note: Actual authentication is handled by Supabase Auth on the frontend.
// These endpoints are for managing user profiles and skills.
app.get('/api/users/check/:email', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email }
    });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const { id, email, full_name, birthday, address, avatar_url, education, current_level, skills, interests, experienceYears, experiences } = req.body;
    
    // Validate required fields
    if (!id || !email || !full_name || !birthday || !address || !education) {
      return res.status(400).json({ error: 'Missing required onboarding fields. Please complete all steps.' });
    }

    // Atomic transaction: Create User, Skills, and Experience in one go.
    // If any step fails, the whole operation rolls back.
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { 
          id, 
          email, 
          full_name, 
          birthday: new Date(birthday), 
          address, 
          avatar_url, 
          education, 
          current_level: current_level || 'Beginner'
        }
      });

      if (skills && Array.isArray(skills) && skills.length > 0) {
        const matchedSkills = await tx.careerSkill.findMany({
          where: { skill_name: { in: skills } }
        });
        
        const uniqueSkillIds: string[] = [];
        const seenNames = new Set();
        for (const s of matchedSkills) {
          if (!seenNames.has(s.skill_name)) {
            seenNames.add(s.skill_name);
            uniqueSkillIds.push(s.id);
          }
        }

        if (uniqueSkillIds.length > 0) {
          await tx.userSkill.createMany({
            data: uniqueSkillIds.map((careerSkillId) => ({
              userId: id,
              careerSkillId
            }))
          });
        }
      }

      if (interests && Array.isArray(interests) && interests.length > 0) {
        const matchedInterests = await tx.careerInterest.findMany({
          where: { interest_name: { in: interests } }
        });
        
        const uniqueInterestIds: string[] = [];
        const seenNames = new Set();
        for (const i of matchedInterests) {
          if (!seenNames.has(i.interest_name)) {
            seenNames.add(i.interest_name);
            uniqueInterestIds.push(i.id);
          }
        }

        if (uniqueInterestIds.length > 0) {
          await tx.userInterest.createMany({
            data: uniqueInterestIds.map((careerInterestId) => ({
              userId: id,
              careerInterestId
            }))
          });
        }
      }

      if (experiences && Array.isArray(experiences) && experiences.length > 0) {
        await tx.userExperience.createMany({
          data: experiences.map((exp: any) => ({
            title: exp.title,
            duration: Math.round(exp.durationYears * 12),
            userId: id
          }))
        });
      } else if (experienceYears > 0) {
        await tx.userExperience.create({
          data: {
            title: 'Professional Experience',
            duration: Math.round(experienceYears * 12),
            userId: id
          }
        });
      }

      return newUser;
    });
    
    res.json({ message: 'Profile created successfully', user });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: 'Failed to create user profile. Please try again.' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { full_name, education, avatar_url, skills, interests, experiences, experienceYears } = req.body;
    
    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: req.params.id },
        data: {
          ...(full_name && { full_name }),
          ...(education && { education }),
          ...(avatar_url && { avatar_url }),
        }
      });

      if (skills && Array.isArray(skills)) {
        await tx.userSkill.deleteMany({ where: { userId: req.params.id } });
        if (skills.length > 0) {
          const matchedSkills = await tx.careerSkill.findMany({ where: { skill_name: { in: skills } } });
          const uniqueSkillIds: string[] = [];
          const seenNames = new Set();
          for (const s of matchedSkills) {
            if (!seenNames.has(s.skill_name)) {
              seenNames.add(s.skill_name);
              uniqueSkillIds.push(s.id);
            }
          }
          if (uniqueSkillIds.length > 0) {
            await tx.userSkill.createMany({
              data: uniqueSkillIds.map(careerSkillId => ({ userId: req.params.id, careerSkillId }))
            });
          }
        }
      }

      if (interests && Array.isArray(interests)) {
        await tx.userInterest.deleteMany({ where: { userId: req.params.id } });
        if (interests.length > 0) {
          const matchedInterests = await tx.careerInterest.findMany({ where: { interest_name: { in: interests } } });
          const uniqueInterestIds: string[] = [];
          const seenNames = new Set();
          for (const i of matchedInterests) {
            if (!seenNames.has(i.interest_name)) {
              seenNames.add(i.interest_name);
              uniqueInterestIds.push(i.id);
            }
          }
          if (uniqueInterestIds.length > 0) {
            await tx.userInterest.createMany({
              data: uniqueInterestIds.map(careerInterestId => ({ userId: req.params.id, careerInterestId }))
            });
          }
        }
      }

      if (experiences && Array.isArray(experiences)) {
        await tx.userExperience.deleteMany({ where: { userId: req.params.id } });
        if (experiences.length > 0) {
          await tx.userExperience.createMany({
            data: experiences.map((exp: any) => ({
              title: exp.title,
              duration: Math.round(exp.durationYears * 12),
              userId: req.params.id
            }))
          });
        }
      } else if (typeof experienceYears === 'number') {
        await tx.userExperience.deleteMany({ where: { userId: req.params.id } });
        if (experienceYears > 0) {
          await tx.userExperience.create({
            data: {
              title: 'Professional Experience',
              duration: Math.round(experienceYears * 12),
              userId: req.params.id
            }
          });
        }
      }

      return updatedUser;
    });
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { 
        skills: { include: { careerSkill: true } }, 
        interests: { include: { careerInterest: true } },
        experiences: true,
        trajectories: true 
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ========================
// 2. Metadata API
// ========================

app.get('/api/metadata', async (req, res) => {
  try {
    const skills = await prisma.careerSkill.findMany({
      select: { skill_name: true },
      distinct: ['skill_name']
    });
    
    const interests = await prisma.careerInterest.findMany({
      select: { interest_name: true },
      distinct: ['interest_name']
    });

    const careers = await prisma.career.findMany({
      select: { title: true }
    });

    res.json({
      skills: skills.map(s => s.skill_name),
      interests: interests.map(i => i.interest_name),
      careers: careers.map(c => c.title)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========================
// 3. Recommendations API
// ========================

app.post('/api/recommendations/match', async (req, res) => {
  try {
    const { userId, skills, experienceYears, interests, experiences } = req.body;
    
    // Fallback: If no direct skills passed, try grabbing from user DB
    let userProfileSkills = skills || [];
    let userProfileInterests = interests || [];
    let userProfileExperiences = experiences || [];
    let userTargetExp = experienceYears || 0;
    
    if (userId && userProfileSkills.length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { 
          skills: { include: { careerSkill: true } }, 
          interests: { include: { careerInterest: true } },
          experiences: true 
        }
      });
      if (user) {
        userProfileSkills = user.skills.map((s: any) => s.careerSkill?.skill_name || s.skill_name);
        userProfileInterests = user.interests.map((i: any) => i.careerInterest?.interest_name || i.interest_name);
        userProfileExperiences = user.experiences.map((exp: any) => ({ title: exp.title, duration: exp.duration }));
        userTargetExp = user.experiences.reduce((sum: number, exp: any) => sum + (exp.duration / 12), 0);
      }
    }
    
    // Fetch all careers
    const allCareers = await prisma.career.findMany({
      include: {
        skills: true,
        levels: true
      }
    });
    
    // Generate matches
    const results = generateRecommendations(
      { 
        skills: userProfileSkills, 
        interests: userProfileInterests, 
        experienceYears: userTargetExp,
        experiences: userProfileExperiences
      }, 
      allCareers as any
    );
    
    // Store matches in Trajectory table if userId is present
    if (userId) {
      await prisma.$transaction(async (tx) => {
        await tx.trajectory.deleteMany({ where: { userId } });
        if (results.length > 0) {
          await tx.trajectory.createMany({
            data: results.map(r => ({
              userId,
              careerId: r.careerId,
              careerTitle: r.careerTitle,
              score: r.score,
              level: r.level,
              explanation: r.explanation
            }))
          });
        }
      });
    }

    res.json({ matches: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/recommendations/feedback', async (req, res) => {
  try {
    const { userId, careerId, isRelevant } = req.body;
    
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        careerId,
        isRelevant
      }
    });

    res.json({ message: 'Feedback stored', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`PathPilot API is running on http://localhost:${PORT}`);
});
