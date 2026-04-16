export interface UserProfileProfile {
  skills: string[];
  interests: string[]; // (Optional, mapped to domains or general descriptions)
  experienceYears: number;
}

export interface CareerSkill {
  skill_name: string;
  is_required: boolean;
}

export interface Career {
  id: string;
  title: string;
  domain: string;
  description: string;
  skills: CareerSkill[];
  levels: { level_name: string; required_experience_years: number }[];
}

export interface MatchResult {
  careerId: string;
  careerTitle: string;
  score: number;
  level: string;
  explanation: string;
}

const SCORE_WEIGHTS = {
  REQUIRED_SKILL_MATCH: 5,
  OPTIONAL_SKILL_MATCH: 2,
};

/**
 * Heuristic scoring engine for matching User Profile against Careers
 */
export function generateRecommendations(
  userProfile: UserProfileProfile,
  allCareers: Career[]
): MatchResult[] {
  const results: MatchResult[] = [];

  const userSkills = userProfile.skills.map((s) => s.toLowerCase());

  for (const career of allCareers) {
    let score = 0;
    const matchedRequiredSkills: string[] = [];
    const matchedOptionalSkills: string[] = [];
    const missingRequiredSkills: string[] = [];

    // Evaluate Skills
    for (const skill of career.skills) {
      const skillNameLower = skill.skill_name.toLowerCase();
      const hasSkill = userSkills.includes(skillNameLower);

      if (hasSkill) {
        if (skill.is_required) {
          score += SCORE_WEIGHTS.REQUIRED_SKILL_MATCH;
          matchedRequiredSkills.push(skill.skill_name);
        } else {
          score += SCORE_WEIGHTS.OPTIONAL_SKILL_MATCH;
          matchedOptionalSkills.push(skill.skill_name);
        }
      } else {
        if (skill.is_required) {
          missingRequiredSkills.push(skill.skill_name);
        }
      }
    }

    // Determine Job Level based on experience
    // Sort levels by required experience descending to find highest matched level
    const sortedLevels = [...career.levels].sort((a, b) => b.required_experience_years - a.required_experience_years);
    let matchedLevel = "Entry/Intern";
    for (const level of sortedLevels) {
      if (userProfile.experienceYears >= level.required_experience_years) {
        matchedLevel = level.level_name;
        break;
      }
    }

    // Penalize score slightly if essential skills are missing (optional design choice, helps ordering)
    score -= missingRequiredSkills.length * 2;

    // Generate Natural Language Explanation
    const explanation = generateExplanation(
      career.title,
      matchedRequiredSkills,
      matchedOptionalSkills,
      missingRequiredSkills,
      matchedLevel
    );

    // Only consider careers with a positive relation (>0 score)
    if (score > 0 || matchedRequiredSkills.length > 0) {
      results.push({
        careerId: career.id,
        careerTitle: career.title,
        score,
        level: matchedLevel,
        explanation
      });
    }
  }

  // Rank by score descending
  return results.sort((a, b) => b.score - a.score).slice(0, 5); // Return top 5
}

/**
 * Template-Based Natural Language Explanation Generator
 */
function generateExplanation(
  careerTitle: string,
  matchedRequired: string[],
  matchedOptional: string[],
  missingRequired: string[],
  level: string
): string {
  let explanation = `We recommend the ${level} ${careerTitle} path for you. `;

  if (matchedRequired.length > 0) {
    explanation += `Your profile is a strong fit because you possess key required skills: ${matchedRequired.join(', ')}. `;
  } else {
    explanation += `While you are missing some core skills, `;
  }

  if (matchedOptional.length > 0) {
    explanation += `You also bring valuable bonus skills to the table, such as ${matchedOptional.join(', ')}. `;
  }

  if (missingRequired.length > 0 && missingRequired.length <= 3) {
    explanation += `To improve your chances in this path, consider developing the following skills: ${missingRequired.join(', ')}.`;
  }

  return explanation.trim();
}
