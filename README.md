# AI-Powered Resume Analyzer

An intelligent resume analysis platform that provides comprehensive ResumeIQ scoring and actionable feedback to help job seekers optimize their resumes for their dream jobs.

## Features

- ** AI-Powered Analysis**: Leverages Claude AI to provide deep resume insights
- ** ResumeIQ Score**: Get your ResumeIQ compatibility score
- ** Job-Specific Feedback**: Tailored suggestions based on job title and description
- ** Category Scoring**: Detailed breakdown across:
  - Tone & Style
  - Content Quality
  - Structure & Formatting
  - Skills Assessment
- ** Persistent Storage**: Save and retrieve past resume analyses
- ** Secure Authentication**: User authentication powered by Puter
- ** Responsive Design**: Works seamlessly on desktop and mobile devices
- ** Modern UI**: Beautiful interface built with Tailwind CSS

##  Live Demo

 **[View Live Application](#)** https://ai-powered-applicant-tracking-system-3n1c-itmcbi4h5.vercel.app/auth?next=/

##  Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling

### Backend & Services
- **Puter SDK** - All-in-one backend platform
  - Authentication & User Management
  - File Storage (fs)
  - Key-Value Database (kv)
  - AI Integration (Claude Sonnet 4)
- **PDF.js** - PDF rendering and conversion
- **Zustand** - State management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A modern web browser

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sanam-Shrestha04/AI-Powered-Resume-Analyzer
cd ai-resume-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Puter SDK

The Puter SDK is loaded via CDN in `index.html`. Make sure the script tag is present:

```html
<script src="https://js.puter.com/v2/"></script>
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`


##  How to Use

1. **Sign In**: Click "Log In" to authenticate with Puter
2. **Upload Resume**: 
   - Enter the company name
   - Specify the job title
   - Paste the job description
   - Upload your resume (PDF format)
3. **Get Analysis**: Click "Analyze Resume" and wait for AI processing
4. **Review Feedback**: 
   - View your overall score
   - Check category-specific ratings
   - Read detailed improvement suggestions
5. **Save & Return**: Your analyses are saved and accessible anytime

##  Configuration

### AI Model Settings

The application uses Claude Sonnet 4 for analysis. You can modify the model in `src/lib/puter.js`:

```javascript
const feedback = await puter.ai.chat(
  [...],
  { model: "claude-sonnet-4" }
);
```

### Scoring Thresholds

Adjust scoring colors and thresholds in components like `ScoreBadge.jsx`:

```javascript
score > 69 ? "bg-badge-green"    // Excellent
: score > 39 ? "bg-badge-yellow" // Good
: "bg-badge-red"                 // Needs Improvement
```


## 📝 Environment Variables

This project uses Puter SDK which handles authentication automatically. No environment variables are required for basic setup.


## 📧 Contact

**Sanam Shrestha** - sthasanam067.com

Project Link: [https://github.com/yourusername/ai-resume-analyzer](https://github.com/yourusername/ai-resume-analyzer)

