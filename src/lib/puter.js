// import { create } from "zustand";

// const getPuter = () =>
//   typeof window !== "undefined" && window.puter ? window.puter : null;

// export const usePuterStore = create((set, get) => {
//   const setError = (msg) => {
//     set({
//       error: msg,
//       isLoading: false,
//       auth: {
//         user: null,
//         isAuthenticated: false,
//         signIn: get().auth.signIn,
//         signOut: get().auth.signOut,
//         refreshUser: get().auth.refreshUser,
//         checkAuthStatus: get().auth.checkAuthStatus,
//         getUser: get().auth.getUser,
//       },
//     });
//   };

//   const checkAuthStatus = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return false;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const isSignedIn = await puter.auth.isSignedIn();
//       if (isSignedIn) {
//         const user = await puter.auth.getUser();
//         set({
//           auth: {
//             user,
//             isAuthenticated: true,
//             signIn: get().auth.signIn,
//             signOut: get().auth.signOut,
//             refreshUser: get().auth.refreshUser,
//             checkAuthStatus: get().auth.checkAuthStatus,
//             getUser: () => user,
//           },
//           isLoading: false,
//         });
//         return true;
//       } else {
//         set({
//           auth: {
//             user: null,
//             isAuthenticated: false,
//             signIn: get().auth.signIn,
//             signOut: get().auth.signOut,
//             refreshUser: get().auth.refreshUser,
//             checkAuthStatus: get().auth.checkAuthStatus,
//             getUser: () => null,
//           },
//           isLoading: false,
//         });
//         return false;
//       }
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Failed to check auth status";
//       setError(msg);
//       return false;
//     }
//   };

//   const signIn = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//         await puter.auth.signIn();
//         const user = await puter.auth.getUser();
//       await checkAuthStatus();
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Sign in failed";
//       setError(msg);
//     }
//   };

//   const signOut = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       await puter.auth.signOut();
//       set({
//         auth: {
//           user: null,
//           isAuthenticated: false,
//           signIn: get().auth.signIn,
//           signOut: get().auth.signOut,
//           refreshUser: get().auth.refreshUser,
//           checkAuthStatus: get().auth.checkAuthStatus,
//           getUser: () => null,
//         },
//         isLoading: false,
//       });
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Sign out failed";
//       setError(msg);
//     }
//   };

//   const refreshUser = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const user = await puter.auth.getUser();
//       set({
//         auth: {
//           user,
//           isAuthenticated: true,
//           signIn: get().auth.signIn,
//           signOut: get().auth.signOut,
//           refreshUser: get().auth.refreshUser,
//           checkAuthStatus: get().auth.checkAuthStatus,
//           getUser: () => user,
//         },
//         isLoading: false,
//       });
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Failed to refresh user";
//       setError(msg);
//     }
//   };

//   const write = async (path, data) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.write(path, data);
//   };

//   const readFile = async (path) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.read(path);
//   };

//   const readDir = async (path) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.readdir(path);
//   };

//   const upload = async (files) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.upload(files);
//   };

//   const deleteFile = async (path) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.delete(path);
//   };

//   const chat = async (prompt, imageURL, testMode, options) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.ai.chat(prompt, imageURL, testMode, options);
//   };

//   const feedback = async (path, message) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     return puter.ai.chat(
//       [
//         {
//           role: "user",
//           content: [
//             { type: "file", puter_path: path },
//             { type: "text", text: message },
//           ],
//         },
//       ],
//       { model: "claude-sonnet-4" }
//     );
//   };

//   const img2txt = async (image, testMode) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.ai.img2txt(image, testMode);
//   };

//   const getKV = async (key) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.get(key);
//   };

//   const setKV = async (key, value) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.set(key, value);
//   };

//   const deleteKV = async (key) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.delete(key);
//   };

//   const listKV = async (pattern, returnValues = false) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.list(pattern, returnValues);
//   };

//   const flushKV = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.flush();
//   };

//   const init = () => {
//     const puter = getPuter();
//     if (puter) {
//       set({ puterReady: true });
//       checkAuthStatus();
//       return;
//     }

//     const interval = setInterval(() => {
//       if (getPuter()) {
//         clearInterval(interval);
//         set({ puterReady: true });
//         checkAuthStatus();
//       }
//     }, 100);

//     setTimeout(() => {
//       clearInterval(interval);
//       if (!getPuter()) {
//         setError("Puter.js failed to load within 10 seconds");
//       }
//     }, 10000);
//   };

//   return {
//     isLoading: true,
//     error: null,
//     puterReady: false,
//     auth: {
//       user: null,
//       isAuthenticated: false,
//       signIn,
//       signOut,
//       refreshUser,
//       checkAuthStatus,
//       getUser: () => get().auth.user,
//     },
//     fs: {
//       write,
//       read: readFile,
//       readDir,
//       upload,
//       delete: deleteFile,
//     },
//     ai: {
//       chat,
//       feedback,
//       img2txt,
//     },
//     kv: {
//       get: getKV,
//       set: setKV,
//       delete: deleteKV,
//       list: listKV,
//       flush: flushKV,
//     },
//     init,
//     clearError: () => set({ error: null }),
//   };
// });

import { create } from "zustand";

const getPuter = () =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create((set, get) => {
  const setError = (msg) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const isSignedIn = await puter.auth.isSignedIn();
      console.log("Auth status check - isSignedIn:", isSignedIn);
      
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        console.log("User data:", user);
        
        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
        });
        return true;
      } else {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      console.error("Auth status check error:", err);
      const msg = err instanceof Error ? err.message : "Failed to check auth status";
      setError(msg);
      return false;
    }
  };

  const signIn = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("Starting Puter sign in...");
      await puter.auth.signIn();
      console.log("Puter sign in completed, checking auth status...");
      
      // Wait a bit for the auth to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check auth status after sign in
      await checkAuthStatus();
    } catch (err) {
      console.error("Sign in error:", err);
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    }
  };

  const signOut = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("Signing out...");
      await puter.auth.signOut();
      console.log("Sign out completed");
      
      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      console.error("Sign out error:", err);
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setError(msg);
    }
  };

  const refreshUser = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = await puter.auth.getUser();
      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });
    } catch (err) {
      console.error("Refresh user error:", err);
      const msg = err instanceof Error ? err.message : "Failed to refresh user";
      setError(msg);
    }
  };

  const write = async (path, data) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("Writing file:", path);
    return puter.fs.write(path, data);
  };

  const readFile = async (path) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("Reading file:", path);
    return puter.fs.read(path);
  };

  const readDir = async (path) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("Reading directory:", path);
    return puter.fs.readdir(path);
  };

  const upload = async (files) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    
    console.log("Uploading files:", files);
    console.log("Is authenticated:", get().auth.isAuthenticated);
    
    if (!get().auth.isAuthenticated) {
      throw new Error("Not authenticated. Please sign in to upload files.");
    }
    
    try {
      const result = await puter.fs.upload(files);
      console.log("Upload result from Puter:", result);
      
      if (!result) {
        throw new Error("Upload returned no result");
      }
      
      return result;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const deleteFile = async (path) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("Deleting file:", path);
    return puter.fs.delete(path);
  };

  const chat = async (prompt, imageURL, testMode, options) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("AI chat request:", { prompt, imageURL, testMode, options });
    return puter.ai.chat(prompt, imageURL, testMode, options);
  };

  const feedback = async (path, message) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }

    console.log("AI feedback request:", { path, message });
    
    if (!get().auth.isAuthenticated) {
      throw new Error("Not authenticated. Please sign in to use AI features.");
    }

    return puter.ai.chat(
      [
        {
          role: "user",
          content: [
            { type: "file", puter_path: path },
            { type: "text", text: message },
          ],
        },
      ],
      { model: "claude-sonnet-4" }
    );
  };

  const img2txt = async (image, testMode) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("AI img2txt request");
    return puter.ai.img2txt(image, testMode);
  };

  const getKV = async (key) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("KV get:", key);
    return puter.kv.get(key);
  };

  const setKV = async (key, value) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("KV set:", key);
    return puter.kv.set(key, value);
  };

  const deleteKV = async (key) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("KV delete:", key);
    return puter.kv.delete(key);
  };

  const listKV = async (pattern, returnValues = false) => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("KV list:", pattern);
    return puter.kv.list(pattern, returnValues);
  };

  const flushKV = async () => {
    const puter = getPuter();
    if (!puter) {
      throw new Error("Puter.js not available");
    }
    console.log("KV flush");
    return puter.kv.flush();
  };

  const init = () => {
    console.log("Initializing Puter store...");
    const puter = getPuter();
    
    if (puter) {
      console.log("Puter SDK already loaded");
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    console.log("Waiting for Puter SDK to load...");
    const interval = setInterval(() => {
      if (getPuter()) {
        console.log("Puter SDK loaded successfully");
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) {
        console.error("Puter SDK failed to load");
        setError("Puter.js failed to load within 10 seconds");
      }
    }, 10000);
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write,
      read: readFile,
      readDir,
      upload,
      delete: deleteFile,
    },
    ai: {
      chat,
      feedback,
      img2txt,
    },
    kv: {
      get: getKV,
      set: setKV,
      delete: deleteKV,
      list: listKV,
      flush: flushKV,
    },
    init,
    clearError: () => set({ error: null }),
  };
});