// app/people-counting/page.tsx
'use client';

import { useState, ChangeEvent, useRef } from 'react';
import { UserRound, Calendar, Clock, Upload, FileText } from 'lucide-react';

interface TableRow {
  videoName: string;
  totalCount: number;
  timestamp: string;
}

export default function PeopleCountingPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tableData, setTableData] = useState<TableRow[]>([
    {
      videoName: 'classroom_lecture_1.mp4',
      totalCount: 23,
      timestamp: '2025-04-07 10:30:00',
    },
    {
      videoName: 'lab_session_a2.mp4',
      totalCount: 18,
      timestamp: '2025-04-06 16:45:00',
    },
    {
      videoName: 'morning_class_b5.mp4',
      totalCount: 32,
      timestamp: '2025-04-05 09:15:00',
    },
    {
      videoName: 'afternoon_tutorial.mp4',
      totalCount: 15,
      timestamp: '2025-04-04 14:30:00',
    }
  ]);

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideo(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (video) {
      const newEntry: TableRow = {
        videoName: video.name,
        totalCount: Math.floor(Math.random() * 30) + 10, // Random count between 10-40
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setTableData([newEntry, ...tableData]);
      setVideo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Calculate total people count from all videos
  const totalPeopleCount = tableData.reduce((sum, row) => sum + row.totalCount, 0);

  // Get current date for display
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
              className={`border-2 border-dashed ${dragActive ? 'border-cyan-400' : 'border-cyan-600'} rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition-colors`}
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
              <p className="text-center font-medium">
                Drag and drop your<br />video file here
              </p>
              <p className="text-cyan-500 mt-4 text-center">or</p>
              <button
                className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileSelector();
                }}
              >
                Choose File
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!video}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
            >
              Process Video
            </button>
            
            {video && (
              <p className="mt-4 text-sm text-cyan-400 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Selected: {video.name}
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
                    <tr 
                      key={index} 
                      className="border-t border-gray-700 hover:bg-gray-750"
                    >
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