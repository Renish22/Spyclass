'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AddStudentPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [enrollment, setEnrollment] = useState('');

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    if (!videoRef.current) return;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setImage(dataUrl);
    stopCamera();
  };

  const handleSubmit = async () => {
    if (!image || !name || !address || !enrollment) {
      alert('Please fill all fields and capture an image.');
      return;
    }

    const res = await fetch('/api/add-student', {
      method: 'POST',
      body: JSON.stringify({
        name,
        address,
        enrollment,
        image,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log(data)
    if (data.success) {
      alert(data.message);
      router.push('/dashboard/users');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Add New Student</h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded bg-gray-700 text-white"
            type="text"
            placeholder="Enrollment Number"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white"
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex flex-col items-center space-y-2">
            <video ref={videoRef} autoPlay className="w-full max-w-md rounded" />
            <div className="flex gap-4">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-white"
                onClick={startCamera}
              >
                Start Camera
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
                onClick={captureImage}
              >
                Capture Face
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                onClick={stopCamera}
              >
                Stop Camera
              </button>
            </div>
          </div>

          {image && (
            <img src={image} alt="Captured face" className="mt-4 rounded border border-white" />
          )}

          <button
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white mt-4"
            onClick={handleSubmit}
          >
            Save Student
          </button>
        </div>
      </div>
    </div>
  );
}
