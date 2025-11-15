import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import FileUploader from "../component/FileUploader";
import { usePuterStore } from "../lib/puter";
import { useNavigate } from "react-router-dom";
import { convertPdfToImage } from "../lib/pdfToImage";
import { generateUUID } from "../lib/utils";
import { prepareInstructions } from "../constants/resumeData";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv, puterReady } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    if (puterReady && !auth.isAuthenticated) {
      console.warn("User not authenticated");
    }
  }, [puterReady, auth.isAuthenticated]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    console.log("File selected:", selectedFile);
  };

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription }) => {
    if (!(file instanceof File)) {
      console.error("Invalid file:", file);
      setIsProcessing(false);
      return setStatusText("Error: No valid file selected.");
    }

    // Check authentication
    if (!auth.isAuthenticated) {
      setIsProcessing(false);
      return setStatusText("Error: Please sign in to upload files.");
    }

    try {
      console.log("Starting upload process...");
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      setStatusText("Uploading the resume...");
      
      // Upload using the fs.upload method
      const resumeUploadResult = await fs.upload([file]);
      console.log("Resume upload result:", resumeUploadResult);

      // Validate upload result
      if (!resumeUploadResult) {
        throw new Error("Upload failed: No response from server. Make sure you're logged into Puter.");
      }

      // Handle the upload result - Puter may return different formats
      let uploadedFile;
      if (Array.isArray(resumeUploadResult)) {
        uploadedFile = resumeUploadResult[0];
      } else if (resumeUploadResult && typeof resumeUploadResult === 'object') {
        uploadedFile = resumeUploadResult;
      } else {
        throw new Error(`Unexpected upload result format: ${typeof resumeUploadResult}`);
      }

      if (!uploadedFile) {
        throw new Error("Upload failed: No file data returned");
      }

      // Get the file path - try different properties
      const resumePath = uploadedFile.path || uploadedFile.uid || uploadedFile.id || uploadedFile.name;
      
      if (!resumePath) {
        console.error("Upload result structure:", uploadedFile);
        throw new Error("Upload failed: Could not determine file path. Result: " + JSON.stringify(uploadedFile));
      }

      console.log("Resume uploaded successfully to:", resumePath);

      // Try to convert PDF to image, but continue even if it fails
      let imagePath = null;
      setStatusText("Converting PDF to image (optional)...");
      try {
        const imageFile = await convertPdfToImage(file);
        if (imageFile && imageFile.file) {
          console.log("PDF converted to image successfully");
          
          setStatusText("Uploading the image...");
          const imageUploadResult = await fs.upload([imageFile.file]);
          
          if (imageUploadResult) {
            let uploadedImage;
            if (Array.isArray(imageUploadResult)) {
              uploadedImage = imageUploadResult[0];
            } else if (imageUploadResult && typeof imageUploadResult === 'object') {
              uploadedImage = imageUploadResult;
            }

            if (uploadedImage) {
              imagePath = uploadedImage.path || uploadedImage.uid || uploadedImage.id || uploadedImage.name;
              console.log("Image uploaded successfully to:", imagePath);
            }
          }
        }
      } catch (conversionErr) {
        console.warn("PDF conversion failed, continuing without image:", conversionErr);
        // Continue without image - the AI can still read the PDF
      }

      setStatusText("Preparing data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: resumePath,
        imagePath: imagePath || resumePath, // Use resume path if no image
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      console.log("Saving to KV store...");
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing resume with AI...");
      console.log("Calling AI feedback with path:", resumePath);
      
      const instructions = prepareInstructions({ jobTitle, jobDescription });
      console.log("AI Instructions:", instructions);
      
      const feedback = await ai.feedback(resumePath, instructions);

      console.log("=== FULL AI RESPONSE ===");
      console.log(JSON.stringify(feedback, null, 2));
      console.log("=== END RESPONSE ===");

      if (!feedback || !feedback.message) {
        throw new Error("Failed to analyze the resume: No feedback received");
      }

      // Extract the text content
      let feedbackText = "";
      const content = feedback.message.content;
      
      console.log("Content type:", typeof content);
      console.log("Is array:", Array.isArray(content));
      console.log("Content:", content);

      if (typeof content === "string") {
        feedbackText = content;
      } else if (Array.isArray(content)) {
        // Find text content in array
        for (const item of content) {
          if (item.type === "text" && item.text) {
            feedbackText += item.text;
          }
        }
      } else if (content?.text) {
        feedbackText = content.text;
      }

      console.log("=== RAW FEEDBACK TEXT ===");
      console.log(feedbackText);
      console.log("=== END RAW TEXT ===");

      if (!feedbackText) {
        throw new Error("No text content found in AI response");
      }

      // Clean up the response - remove markdown code blocks if present
      let cleanedFeedback = feedbackText.trim();
      cleanedFeedback = cleanedFeedback.replace(/```json\n?/g, "");
      cleanedFeedback = cleanedFeedback.replace(/```\n?/g, "");
      cleanedFeedback = cleanedFeedback.trim();

      // Remove any text before the first { or after the last }
      const firstBrace = cleanedFeedback.indexOf('{');
      const lastBrace = cleanedFeedback.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedFeedback = cleanedFeedback.substring(firstBrace, lastBrace + 1);
      }

      console.log("=== CLEANED FEEDBACK ===");
      console.log(cleanedFeedback);
      console.log("=== END CLEANED ===");

      try {
        const parsedFeedback = JSON.parse(cleanedFeedback);
        console.log("=== PARSED FEEDBACK ===");
        console.log(JSON.stringify(parsedFeedback, null, 2));
        console.log("=== END PARSED ===");
        
        // Transform the feedback to ensure correct format
        const transformedFeedback = {
          overallScore: parsedFeedback.overallScore 
            || parsedFeedback.overall_score 
            || (parsedFeedback.overall_rating ? parsedFeedback.overall_rating * 10 : 0)
            || 0,
          ATS: {
            score: parsedFeedback.ATS?.score 
              || parsedFeedback.ats?.score 
              || parsedFeedback.ATS?.rating * 10
              || 0,
            tips: parsedFeedback.ATS?.tips 
              || parsedFeedback.ats?.tips 
              || parsedFeedback.ATS?.suggestions
              || parsedFeedback.ats?.suggestions
              || []
          },
          toneAndStyle: {
            score: parsedFeedback.toneAndStyle?.score 
              || parsedFeedback.tone_and_style?.score 
              || parsedFeedback.tone?.score
              || 0,
            tips: parsedFeedback.toneAndStyle?.tips 
              || parsedFeedback.tone_and_style?.tips 
              || parsedFeedback.tone?.tips
              || []
          },
          content: {
            score: parsedFeedback.content?.score || 0,
            tips: parsedFeedback.content?.tips || []
          },
          structure: {
            score: parsedFeedback.structure?.score || 0,
            tips: parsedFeedback.structure?.tips || []
          },
          skills: {
            score: parsedFeedback.skills?.score || 0,
            tips: parsedFeedback.skills?.tips || []
          }
        };
        
        console.log("=== TRANSFORMED FEEDBACK ===");
        console.log(JSON.stringify(transformedFeedback, null, 2));
        console.log("=== END TRANSFORMED ===");
        
        data.feedback = transformedFeedback;
        
        // Verify the structure
        if (!transformedFeedback.overallScore) {
          console.warn("WARNING: No overallScore in feedback");
        }
        if (!transformedFeedback.toneAndStyle?.score) {
          console.warn("WARNING: No toneAndStyle.score in feedback");
        }
      } catch (parseErr) {
        console.error("=== PARSE ERROR ===");
        console.error(parseErr);
        console.error("Attempted to parse:", cleanedFeedback);
        console.error("=== END PARSE ERROR ===");
        throw new Error(`Failed to parse AI response: ${parseErr.message}`);
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete! Redirecting...");
      console.log("Final resume data:", data);
      
      setTimeout(() => {
        navigate(`/resume/${uuid}`);
      }, 500);
    } catch (err) {
      console.error("Error during analysis:", err);
      console.error("Error stack:", err.stack);
      setStatusText(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatusText("Error: Please select a resume file first.");
      return;
    }

    if (!auth.isAuthenticated) {
      setStatusText("Error: Please sign in first to upload files.");
      return;
    }

    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    console.log("Form submitted:", { companyName, jobTitle, jobDescription, file });
    setIsProcessing(true);
    setStatusText("Starting analysis...");
    handleAnalyze({ companyName, jobTitle, jobDescription });
  };

  if (!puterReady) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
          <div className="page-heading">
            <h1>Loading Puter SDK...</h1>
            <p>Please wait while we initialize the application.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="Analyzing resume" />
            </>
          ) : (
            <>
              <h2>Drop your resume for an ResumeIQ score and improvement tips</h2>
              {!auth.isAuthenticated && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800">Please sign in to upload and analyze your resume.</p>
                </div>
              )}
            </>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button 
                className="primary-button" 
                type="submit"
                disabled={!auth.isAuthenticated || !file}
              >
                {!auth.isAuthenticated ? "Sign in to Analyze" : "Analyze Resume"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;