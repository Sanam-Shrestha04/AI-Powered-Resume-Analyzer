import React from 'react';

const ATS = ({ score = 0, suggestions = [] }) => {
  const gradientClass = score > 69 ? 'from-green-100' : score > 49 ? 'from-yellow-100' : 'from-red-100';
  const iconSrc = score > 69 ? '/icons/ats-good.svg' : score > 49 ? '/icons/ats-warning.svg' : '/icons/ats-bad.svg';
  const subtitle = score > 69 ? 'Great Job!' : score > 49 ? 'Good Start' : 'Needs Improvement';

  // Convert strings to objects if needed
  const tips = suggestions.map(s => 
    typeof s === 'string' ? { type: 'warning', tip: s } : s
  );

  return (
    <div className={`bg-linear-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        <h2 className="text-2xl font-bold">ResumeIQ Score - {score}/100</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems.
        </p>

        {tips.length > 0 && (
          <div className="space-y-3">
            {tips.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <img
                  src={item.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
                  alt={item.type}
                  className="w-5 h-5 mt-1"
                />
                <p className={item.type === 'good' ? 'text-green-700' : 'text-amber-700'}>
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS filters.
      </p>
    </div>
  );
};

export default ATS;