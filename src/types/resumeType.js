const job = {
  title: "Frontend Developer",
  description: "Build UI components...",
  location: "Kathmandu",
  requiredSkills: ["React", "Tailwind", "REST APIs"],
};

const resume = {
  id: "1",
  companyName: "Google",
  jobTitle: "Frontend Developer",
  imagePath: "/images/resume-1.png",
  resumePath: "/resumes/resume-1.pdf",
  feedback: {
    overallScore: 85,
    ATS: {
      score: 90,
      tips: [{ type: "good", tip: "Strong keyword match" }],
    },
    toneAndStyle: {
      score: 88,
      tips: [
        {
          type: "improve",
          tip: "Tone consistency",
          explanation: "Some sections shift between formal and casual tone.",
        },
      ],
    },
    content: {
      score: 80,
      tips: [
        {
          type: "good",
          tip: "Relevant experience",
          explanation: "Projects align well with job requirements.",
        },
      ],
    },
    structure: {
      score: 85,
      tips: [
        {
          type: "improve",
          tip: "Section spacing",
          explanation: "Add more whitespace between sections for readability.",
        },
      ],
    },
    skills: {
      score: 90,
      tips: [
        {
          type: "good",
          tip: "Technical depth",
          explanation: "Strong coverage of React, API integration, and testing.",
        },
      ],
    },
  },
};