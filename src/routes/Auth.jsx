import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Auth = () => {
  const { isLoading, auth, puterReady, error, clearError } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const next = new URLSearchParams(location.search).get("next") || "/";

  useEffect(() => {
    // Clear any previous errors when component mounts
    if (error) {
      clearError();
    }
  }, []);

  useEffect(() => {
    // Redirect if already authenticated
    if (puterReady && auth.isAuthenticated && !isRedirecting) {
      console.log("User authenticated, redirecting to:", next);
      setIsRedirecting(true);
      // Small delay to ensure state is fully updated
      setTimeout(() => {
        navigate(next, { replace: true });
      }, 100);
    }
  }, [auth.isAuthenticated, puterReady, next, navigate, isRedirecting]);

  const handleSignIn = async () => {
    try {
      clearError();
      console.log("Initiating sign in...");
      await auth.signIn();
      console.log("Sign in completed");
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      clearError();
      console.log("Signing out...");
      await auth.signOut();
      console.log("Signed out successfully");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Show loading state while Puter SDK initializes
  if (!puterReady) {
    return (
      <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
          <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1>Loading...</h1>
              <h2>Initializing Puter SDK</h2>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>
              {auth.isAuthenticated
                ? `Welcome back, ${auth.user?.username || "User"}!`
                : "Log In to Continue Your Job Journey"}
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={clearError}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          )}

          <div>
            {isLoading || isRedirecting ? (
              <button className="auth-button animate-pulse" disabled>
                <p>
                  {isRedirecting
                    ? "Redirecting..."
                    : auth.isAuthenticated
                    ? "Signing you out..."
                    : "Signing you in..."}
                </p>
              </button>
            ) : auth.isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <button
                  className="auth-button bg-green-500 hover:bg-green-600"
                  onClick={() => navigate(next)}
                >
                  <p>Continue to App</p>
                </button>
                <button
                  className="auth-button bg-gray-500 hover:bg-gray-600"
                  onClick={handleSignOut}
                >
                  <p>Log Out</p>
                </button>
              </div>
            ) : (
              <button className="auth-button" onClick={handleSignIn}>
                <p>Log In with Puter</p>
              </button>
            )}
          </div>

          {auth.isAuthenticated && auth.user && (
            <div className="text-center text-sm text-gray-600">
              <p>Logged in as: {auth.user.username || auth.user.email}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Auth;