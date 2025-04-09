// app/people-counting/page.tsx
'use client';

import { useState, ChangeEvent, useRef } from 'react';
import { UserRound, Clock, Upload, FileText, Percent, Users } from 'lucide-react';

interface TableRow {
  picture: string;
  studentName: string;
  Enterytime: string;
  Percentage: string;
}

export default function PeopleCountingPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tableData, setTableData] = useState<TableRow[]>([
    { 
      picture: '130.png',
      studentName: 'Renish',
      Enterytime: '10:01',
      Percentage: '85',
    },
    { 
      picture: '165.png',
      studentName: 'Ridham',
      Enterytime: '09:55',
      Percentage: '76',
    },
    { 
      picture: '10.png',
      studentName: 'Smeet',
      Enterytime: '10:07',
      Percentage: '44',
    },
    { 
      picture: '52.png',
      studentName: 'Rutu',
      Enterytime: '09:30',
      Percentage: '91',
    },
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
      // In a real app, you would process the video and extract student data
      // Here we'll just add a mock entry
      const newEntry: TableRow = {
        picture: 'new_student.png',
        studentName: 'New Student',
        Enterytime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        Percentage: (Math.floor(Math.random() * 50) + 50).toString(), // Random percentage between 50-100
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

  // Calculate average attendance percentage
  const averagePercentage = Math.round(
    tableData.reduce((sum, row) => sum + parseInt(row.Percentage), 0) / tableData.length
  );

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
                <h2 className="text-2xl font-bold">Attendance Record</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center">
                    <Percent className="text-cyan-400 mr-2" />
                    <span className="text-gray-400 mr-2">Average:</span>
                    <span className="text-xl font-bold">{averagePercentage}%</span>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center">
                    <Users className="text-cyan-400 mr-2" />
                    <span className="text-lg">{tableData.length} Students</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-gray-300">
                    <th className="py-4 px-6 text-left">Picture</th>
                    <th className="py-4 px-6 text-left">Student Name</th>
                    <th className="py-4 px-6 text-left">Entry Time</th>
                    <th className="py-4 px-6 text-center">Attendance %</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr 
                      key={index} 
                      className="border-t border-gray-700 hover:bg-gray-750"
                    >
                      <td className="py-4 px-6">
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                          <UserRound className="text-cyan-400 h-6 w-6" />
                          {/* In a real app, you would show the actual image */}
                          {/* <img src={`/images/${row.picture}`} alt={row.studentName} className="h-full w-full object-cover" /> */}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">{row.studentName}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Clock className="text-cyan-400 mr-2 h-4 w-4" />
                          <span>{row.Enterytime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                parseInt(row.Percentage) > 75 
                                  ? 'bg-green-500' 
                                  : parseInt(row.Percentage) > 60 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                              }`} 
                              style={{ width: `${row.Percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{row.Percentage}%</span>
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