let pdfjsLib = null;
let isLoading = false;
let loadPromise = null;

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  
  loadPromise = import("pdfjs-dist").then(async (lib) => {
    // Import the worker as a module
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
    
    // Don't set workerSrc, let it use the imported worker
    console.log("PDF.js loaded successfully");
    
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  }).catch(err => {
    console.error("Failed to load PDF.js:", err);
    isLoading = false;
    throw err;
  });

  return loadPromise;
}

export async function convertPdfToImage(file) {
  try {
    console.log("Starting PDF to image conversion for:", file.name);
    
    if (!file || file.type !== "application/pdf") {
      throw new Error("Invalid file type. Expected PDF.");
    }

    const lib = await loadPdfJs();
    console.log("PDF.js library loaded");

    const arrayBuffer = await file.arrayBuffer();
    console.log("PDF file read, size:", arrayBuffer.byteLength, "bytes");
    
    const loadingTask = lib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    console.log("PDF loaded, pages:", pdf.numPages);
    
    const page = await pdf.getPage(1);
    console.log("First page loaded");

    // Use scale 2 for better balance between quality and size
    const viewport = page.getViewport({ scale: 2 });
    console.log("Viewport dimensions:", viewport.width, "x", viewport.height);
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log("Rendering PDF page to canvas...");
    await page.render({ canvasContext: context, viewport }).promise;
    console.log("PDF rendered to canvas successfully");

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Image blob created, size:", blob.size, "bytes");
            
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            console.log("Image file created:", imageFile.name);

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            const error = "Failed to create image blob from canvas";
            console.error(error);
            reject(new Error(error));
          }
        },
        "image/png",
        0.95
      );
    });
  } catch (err) {
    console.error("PDF to image conversion error:", err);
    throw new Error(`Failed to convert PDF: ${err.message}`);
  }
}