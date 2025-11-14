export const resumes = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "4",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "5",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  {
    id: "6",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
];

export const AIResponseFormat = `{
  "overallScore": number (0-100),
  "ATS": {
    "score": number (0-100),
    "tips": [
      "string tip 1",
      "string tip 2"
    ]
  },
  "toneAndStyle": {
    "score": number (0-100),
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "brief tip text",
        "explanation": "detailed explanation"
      }
    ]
  },
  "content": {
    "score": number (0-100),
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "brief tip text",
        "explanation": "detailed explanation"
      }
    ]
  },
  "structure": {
    "score": number (0-100),
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "brief tip text",
        "explanation": "detailed explanation"
      }
    ]
  },
  "skills": {
    "score": number (0-100),
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "brief tip text",
        "explanation": "detailed explanation"
      }
    ]
  }
}`;

export const prepareInstructions = ({ jobTitle, jobDescription }) => {
  const instruction = `You are an expert resume reviewer and ATS (Applicant Tracking System) analyst.

TASK: Analyze the provided resume and provide detailed, actionable feedback.

JOB CONTEXT:
- Job Title: ${jobTitle || "Not specified"}
- Job Description: ${jobDescription || "Not specified"}

ANALYSIS REQUIREMENTS:
1. Review the resume thoroughly and critically
2. Be honest with scoring - don't inflate scores
3. Consider ATS compatibility
4. Evaluate content relevance to the job description
5. Assess professional tone and formatting
6. Check for completeness and impact

SCORING GUIDE:
- 90-100: Exceptional, very few improvements needed
- 70-89: Good, some improvements recommended
- 50-69: Average, several improvements needed
- 30-49: Below average, significant improvements required
- 0-29: Poor, major overhaul needed

RESPONSE FORMAT:
You MUST respond with ONLY valid JSON in exactly this format (no markdown, no backticks, no additional text):

${AIResponseFormat}

IMPORTANT RULES:
1. Return ONLY the JSON object, nothing else
2. No markdown formatting (no \`\`\`json)
3. All scores must be numbers between 0-100
4. Each category should have 2-5 tips
5. Mix of "good" and "improve" type tips where appropriate
6. Be specific and actionable in tips and explanations
7. If job description is provided, tailor feedback to match requirements

Begin your analysis now and return only the JSON response:`;

  return instruction;
};