import React from "react";
import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const Category = ({ title, score }) => {
  // Ensure score is a number
  const numScore = typeof score === 'number' ? score : 0;
  
  const textColor =
    numScore > 70 ? "text-green-600" : numScore > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={numScore} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{numScore}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }) => {
  // Debug: Log the feedback structure
  console.log("Summary feedback:", feedback);

  // Handle both camelCase and snake_case formats
  const overallScore = feedback?.overallScore 
    || feedback?.overall_score 
    || feedback?.overall_rating 
    || 0;
    
  const toneScore = feedback?.toneAndStyle?.score 
    || feedback?.tone_and_style?.score 
    || 0;
    
  const contentScore = feedback?.content?.score || 0;
  
  const structureScore = feedback?.structure?.score || 0;
  
  const skillsScore = feedback?.skills?.score || 0;

  // If feedback is missing, show a message
  if (!feedback || typeof feedback !== 'object') {
    return (
      <div className="bg-white rounded-2xl shadow-md w-full p-8">
        <div className="text-center text-gray-500">
          <p>No feedback data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={toneScore} />
      <Category title="Content" score={contentScore} />
      <Category title="Structure" score={structureScore} />
      <Category title="Skills" score={skillsScore} />
    </div>
  );
};

export default Summary;