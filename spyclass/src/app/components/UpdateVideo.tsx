'use client';

import { useState } from 'react';

export default function UpdateVideo() {
  const [videoPath, setVideoPath] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/update-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoPath }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error('Failed to update video path', err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Update Video Path</h2>
      <input
        type="text"
        placeholder="Enter RTSP Video Path"
        className="border border-gray-300 rounded px-3 py-2 w-full"
        value={videoPath}
        onChange={(e) => setVideoPath(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
