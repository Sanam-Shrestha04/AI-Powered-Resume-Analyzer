import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "../lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    const files = await fs.readDir("./");
    setFiles(files || []);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      Authenticated as: {auth.user?.username}
      <div>Existing files:</div>
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4">
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={handleDelete}
        >
          Wipe App Data
        </button>
        <nav className='resume-nav'>
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="back" className='w-2.5 h-2.5' />
            <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
          </Link> </nav>
      </div>
    </div>
  );
};

export default WipeApp;