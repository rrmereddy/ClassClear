import { useEffect, useState } from 'react';

const FileProcessing = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          onComplete(); // Call onComplete when progress reaches 100
          return oldProgress;
        }
        return Math.min(oldProgress + 20, 100); // Increase progress by 20% every second
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center">
      {progress < 100 ? (
        <>
          <p className="text-lg text-white">Sending file to GPT...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
            <div
              className="bg-secondary_color h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-300">{progress}%</p>
        </>
      ) : (
        <p className="text-lg text-secondary_color">Finished!</p>
      )}
    </div>
  );
};

export default FileProcessing;
