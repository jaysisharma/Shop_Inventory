import { useState, useEffect } from 'react';

const Snackbar = ({ message, color, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - 2, 0));
    }, 100); // Decreases progress every 100ms

    const timeout = setTimeout(() => {
      onClose(); // Close snackbar after 5 seconds
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-md shadow-md`}
      style={{
        width: '300px',
        position: 'relative',
        backgroundColor: color || 'green',
      }}
    >
      <p>{message}</p>
      <div
        className="absolute bottom-0 left-0 h-1 bg-gray-200"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
      />
    </div>
  );
};

export default Snackbar;
