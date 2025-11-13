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

      setStatusText("Converting PDF to image...");
      let imageFile;
      try {
        imageFile = await convertPdfToImage(file);
        if (!imageFile || !imageFile.file) {
          throw new Error("Failed to convert PDF to image - no file returned.");
        }
        console.log("PDF converted to image successfully");
      } catch (conversionErr) {
        console.error("PDF conversion error:", conversionErr);
        throw new Error(`PDF conversion failed: ${conversionErr.message}`);
      }

      setStatusText("Uploading the image...");
      const imageUploadResult = await fs.upload([imageFile.file]);
      console.log("Image upload result:", imageUploadResult);

      if (!imageUploadResult) {
        throw new Error("Image upload failed: No response from server");
      }

      let uploadedImage;
      if (Array.isArray(imageUploadResult)) {
        uploadedImage = imageUploadResult[0];
      } else if (imageUploadResult && typeof imageUploadResult === 'object') {
        uploadedImage = imageUploadResult;
      }

      if (!uploadedImage) {
        throw new Error("Image upload failed: No image data returned");
      }

      const imagePath = uploadedImage.path || uploadedImage.uid || uploadedImage.id || uploadedImage.name;
      
      if (!imagePath) {
        console.error("Image upload result structure:", uploadedImage);
        throw new Error("Image upload failed: Could not determine file path");
      }

      console.log("Image uploaded successfully to:", imagePath);

      setStatusText("Preparing data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: resumePath,
        imagePath: imagePath,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      console.log("Saving to KV store...");
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing resume with AI...");
      console.log("Calling AI feedback with path:", resumePath);
      
      const feedback = await ai.feedback(
        resumePath,
        prepareInstructions({ jobTitle, jobDescription })
      );

      console.log("AI feedback received:", feedback);

      if (!feedback || !feedback.message) {
        throw new Error("Failed to analyze the resume: No feedback received");
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0]?.text || JSON.stringify(feedback.message.content);

      console.log("Parsing feedback text...");
      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete! Redirecting...");
      console.log("Final resume data:", data);
      
      setTimeout(() => {
        navigate(`/resume/${uuid}`);
      }, 5000);
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
              <h2>Drop your resume for an ATS score and improvement tips</h2>
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