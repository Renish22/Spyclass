// app/people-counting/page.tsx
'use client';

import { useState, ChangeEvent } from 'react';

interface TableRow {
  picture: string;
  studentName: string;
  Enterytime	: string;
  Percentage: string;
}

export default function PeopleCountingPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([
    { 
      picture: '130.png',
      studentName: 'Renish',
      Enterytime	: '10:01' ,
      Percentage: '85',
    },
    { 
      picture: '165.png',
      studentName: 'Ridham',
      Enterytime	: '09:55' ,
      Percentage: '76',
    },
    { 
      picture: '10.png',
      studentName: 'Smeet',
      Enterytime	: '10:07' ,
      Percentage: '44',
    },
    { 
      picture: '52.png',
      studentName: 'Rutu',
      Enterytime	: '09:30' ,
      Percentage: '91',
    },
  ]);

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleSubmit = () => {
    if (video) {
      const newEntry: TableRow = {
        picture:video.name,
        studentName: video.name,
        Enterytime: video.name,
        Percentage: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setTableData([...tableData, newEntry]);
      setVideo(null);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="p-6 bg-cyan-500 shadow-md rounded-lg">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Upload Video</h1>
          <div className="space-y-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleSubmit}
              disabled={!video}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-green-600 disabled:cursor-not-allowed"
            >
              Process Video
            </button>
            {video && (
              <p className="text-sm text-gray-600">
                Selected file: {video.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg">
        <div className="overflow-x-auto pt-6 px-6 pb-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Record</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="border px-4 py-2">Picture</th>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Entery time </th>
                <th className="border px-4 py-2">Percentage</th>
                
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{row.picture}</td>
                  <td className="px-4 py-2">{row.studentName}</td>
                  <td className="px-4 py-2">{row.Enterytime}</td>
                  <td className="px-4 py-2">{row.Percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}