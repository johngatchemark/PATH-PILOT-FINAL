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
    const { id, email, full_name, birthday, address, avatar_url, education, current_level, skills, experiences } = req.body;
    
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: { 
        full_name, 
        birthday: birthday ? new Date(birthday) : undefined, 
        address, 
        avatar_url, 
        education, 
        current_level 
      },
      create: { 
        id, 
        email, 
        full_name, 
        birthday: birthday ? new Date(birthday) : undefined, 
        address, 
        avatar_url, 
        education, 
        current_level 
      }
    });

    // We can also upsert skills and experiences here...
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { skills: true, experiences: true }
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
// 2. Recommendations API
// ========================

app.post('/api/recommendations/match', async (req, res) => {
  try {
    const { userId, skills, experienceYears } = req.body;
    
    // Fallback: If no direct skills passed, try grabbing from user DB
    let userProfileSkills = skills || [];
    let userTargetExp = experienceYears || 0;
    
    if (userId && userProfileSkills.length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { skills: true, experiences: true }
      });
      if (user) {
        userProfileSkills = user.skills.map(s => s.skill_name);
        userTargetExp = user.experiences.reduce((sum, exp) => sum + Math.max(1, exp.duration / 12), 0); // Convert months to years roughly
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
      { skills: userProfileSkills, interests: [], experienceYears: userTargetExp }, 
      allCareers as any
    );
    
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
