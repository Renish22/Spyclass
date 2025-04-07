// app/people-counting/page.tsx
'use client';

import { useState, ChangeEvent } from 'react';

interface TableRow {
  videoName: string;
  totalCount: number;
  timestamp: string;
}

export default function PeopleCountingPage() {
  const [video, setVideo] = useState<File | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([
    {
      videoName: 'sample_video_1.mp4',
      totalCount: 23,
      timestamp: '2025-04-07 10:30:00',
    },
    {
      videoName: 'sample_video_2.mp4',
      totalCount: 18,
      timestamp: '2025-04-06 16:45:00',
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
        videoName: video.name,
        totalCount: 0,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
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
          <h2 className="text-xl font-semibold mb-4">People Counting Results</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="border px-4 py-2">Video Name</th>
                <th className="border px-4 py-2">Total Count</th>
                <th className="border px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{row.videoName}</td>
                  <td className="px-4 py-2">{row.totalCount}</td>
                  <td className="px-4 py-2">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}