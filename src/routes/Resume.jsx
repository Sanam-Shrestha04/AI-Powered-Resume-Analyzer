import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePuterStore } from '../lib/puter';
import Summary from '../component/Summary';
import ATS from '../component/ATS';
import Details from '../component/Details';

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      if (!id || !auth.isAuthenticated) return;

      try {
        setLoadingResume(true);
        const resumeData = await kv.get(`resume:${id}`);
        
        if (!resumeData) {
          setError("Resume not found. It may have been deleted or the link is incorrect.");
          setLoadingResume(false);
          return;
        }

        const data = JSON.parse(resumeData);

        // Load PDF
        if (data.resumePath) {
          const resumeBlob = await fs.read(data.resumePath);
          if (resumeBlob) {
            const pdfUrl = URL.createObjectURL(new Blob([resumeBlob], { type: 'application/pdf' }));
            setResumeUrl(pdfUrl);
          }
        }

        // Load image
        if (data.imagePath) {
          try {
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
              const imgUrl = URL.createObjectURL(new Blob([imageBlob], { type: 'image/png' }));
              setImageUrl(imgUrl);
            }
          } catch (err) {
            console.warn("Image load failed:", err);
          }
        }

        setFeedback(data.feedback);
        setLoadingResume(false);
      } catch (err) {
        console.error("Load error:", err);
        setError(`Failed to load resume: ${err.message}`);
        setLoadingResume(false);
      }
    };

    loadResume();
  }, [id, auth.isAuthenticated, fs, kv]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [resumeUrl, imageUrl]);

  // Show error state
  if (error) {
    return (
      <main className='pt-0'>
        <nav className='resume-nav'>
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="back" className='w-2.5 h-2.5' />
            <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
          </Link>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
            <Link to="/" className="text-blue-600 hover:underline">
              Go back to homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='pt-0'>
      <nav className='resume-nav'>
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className='w-2.5 h-2.5' />
          <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
        </Link>
      </nav>
      
      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className='feedback-section bg-[url("/images/bg-small.svg")] bg-cover h-screen sticky top-0 items-center justify-center'>
          {loadingResume ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resume...</p>
              </div>
            </div>
          ) : (imageUrl || resumeUrl) ? (
            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit'>
              {resumeUrl && (
                <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Resume preview"
                      className='w-full h-full object-contain rounded-2xl'
                      title='Click to view full resume'
                    />
                  ) : (
                    <div className="flex items-center justify-center p-8 bg-white rounded-2xl">
                      <div className="text-center">
                        <img src="/icons/pdf.svg" alt="PDF" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-gray-600">Click to view resume</p>
                      </div>
                    </div>
                  )}
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No preview available</p>
            </div>
          )}
        </section>

        <section className='feedback-section'>
          <h2 className='text-4xl text-black font-bold'>Resume Review</h2>
          
          {loadingResume ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img src="/images/resume-scan-2.gif" alt="Analyzing" className='w-64 mb-4' />
              <p className="text-gray-600 text-lg">Analyzing your resume...</p>
            </div>
          ) : feedback ? (
            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
              <Summary feedback={feedback} />
              <ATS 
                score={feedback.ATS?.score || 0} 
                suggestions={feedback.ATS?.tips || []} 
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-600 text-lg">No feedback available for this resume.</p>
              <Link to="/" className="mt-4 text-blue-600 hover:underline">
                Upload a new resume
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;