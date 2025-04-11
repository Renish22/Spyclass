'use client';

import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { UserRound, Calendar, Clock, Upload, FileText, Loader } from 'lucide-react';

interface TableRow {
  videoName: string;
  totalCount: number;
  timestamp: string;
}

const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/webm',
  'video/avi',
  'video/mpeg',
  'video/x-ms-wmv'
];

export default function PeopleCountingPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tableData, setTableData] = useState<TableRow[]>([
    {
      videoName: 'classroom_lecture_1.mp4',
      totalCount: 23,
      timestamp: '7-4-2025 10:30:00',
    },
    {
      videoName: 'lab_session_a2.mp4',
      totalCount: 18,
      timestamp: '6-4-2025 16:45:00',
    },
    {
      videoName: 'morning_class_b5.mov',
      totalCount: 32,
      timestamp: '5-4-2025 09:15:00',
    },
    {
      videoName: 'afternoon_tutorial.mp4',
      totalCount: 15,
      timestamp: '4-4-2025 14:30:00',
    }
  ]);

  // 🧠 WebSocket Effect for Real-time Updates
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8082');
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      setTableData((prevData) => {
        const updated = prevData.map((row) => {
          if (row.videoName === data.junction_name) {
            return { ...row, totalCount: data.count };
          }
          return row;
        });
  
        // If not found, optionally add it as a new entry
        const exists = updated.some((row) => row.videoName === data.junction_name);
        if (!exists) {
          updated.unshift({
            videoName: data.junction_name,
            totalCount: data.count,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          });
        }
  
        return updated;
      });
    };
  
    socket.onerror = (err) => console.error('WebSocket Error:', err);
    socket.onclose = () => console.log('WebSocket connection closed');
  
    return () => socket.close();
  }, []);
  
  const validateVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please upload a valid video file.');
      return false;
    }

    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Video file is too large. Max size is 500MB.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateVideoFile(file)) {
      setVideo(file);
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateVideoFile(file)) {
      setVideo(file);
    }
  };

  const handleSubmit = async () => {
    if (video) {
      setLoading(true);
      try {
        const videoPath = `/home/renish/Videos/demo_video/${video.name}`;

        const res = await fetch('/api/update-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoPath }),
        });

        const result = await res.json();
        console.log('Server Response:', result);

        const newEntry: TableRow = {
          videoName: video.name,
          totalCount: Math.floor(Math.random() * 30) + 10,
          // timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          timestamp: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: false
          }).replace(',', '').replace(/\//g, '-'),

          
        };

        setTableData([newEntry, ...tableData]);
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Failed to update video path.');
      } finally {
        setLoading(false);
        setVideo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const totalPeopleCount = tableData.reduce((sum, row) => sum + row.totalCount, 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full">
            <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

            <div
              className={`border-2 border-dashed ${dragActive ? 'border-cyan-400' : 'border-cyan-600'} rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileSelector}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
              />
              <Upload className="text-cyan-400 w-12 h-12 mb-4" />
              <p className="text-center font-medium">Drag & drop your video file here</p>
              <p className="text-cyan-500 mt-4 text-center">or</p>
              <button
                className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileSelector();
                }}
              >
                Choose File
              </button>
              <p className="text-gray-400 text-sm mt-2">
                Supports: MP4, MOV, MKV, WEBM, AVI, etc.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!video || loading}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-800 text-white font-medium rounded-md flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Process Video'
              )}
            </button>

            {video && (
              <p className="mt-4 text-sm text-cyan-400 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Selected: {video.name}
                <span className="ml-2 text-xs text-gray-400">
                  ({(video.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-lg h-full">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-2xl font-bold">People Counting Results</h2>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center">
                    <UserRound className="text-cyan-400 mr-2" />
                    <span className="text-gray-400 mr-2">Total:</span>
                    <span className="text-xl font-bold">{totalPeopleCount}</span>
                  </div>

                  <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center">
                    <Calendar className="text-cyan-400 mr-2" />
                    <span className="text-lg">{currentDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-gray-300">
                    <th className="py-4 px-6 text-left">Video Name</th>
                    <th className="py-4 px-6 text-center">Total Count</th>
                    <th className="py-4 px-6 text-left">Timestamp</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="py-4 px-6 font-medium">{row.videoName}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center">
                          <UserRound className="text-cyan-400 mr-2 h-5 w-5" />
                          <span>{row.totalCount}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Clock className="text-cyan-400 mr-2 h-4 w-4" />
                          <span>{row.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-cyan-400 hover:text-cyan-300 font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
