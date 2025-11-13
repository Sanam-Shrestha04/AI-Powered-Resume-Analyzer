// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./routes/Auth";
import Home from "./pages/Home";
import { usePuterStore } from "./lib/puter";
import Upload from "./routes/Upload";
import Resume from "./routes/resume";

function App() {
  const { init } = usePuterStore();

  useEffect(() => {
    init(); 
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/resume/:id" element={<Resume />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
