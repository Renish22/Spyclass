'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';
import { UserRound, Clock, Percent, Users, Camera, CameraOff } from 'lucide-react';

interface TableRow {
  picture: string;
  studentName: string;
  Enterytime: string;
  Percentage: string;
  photoPath: string;
}

export default function PeopleCountingPage() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [scanning, setScanning] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const router = useRouter();


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (err) {
      console.error('Error starting camera:', err);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const captureAndSendFrame = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageData = canvasRef.current.toDataURL('image/jpeg');

    const res = await fetch('/api/scan-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await res.json();
    // console.log(data);
    if (data.result) {
      const fixedJson = data.result.replace(/'/g, '"');
      const jsonData = JSON.parse(fixedJson);

      // console.log('Name:', jsonData.name);
      // console.log('Photo Path:', jsonData.photoPath);
      const newEntry: TableRow = {
        picture: '/home/renish/projects/React_learning/spyclass/public/students/undefined.jpg',
        photoPath: jsonData.photoPath,
        studentName: jsonData.name,
        Enterytime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        Percentage: (Math.floor(Math.random() * 50) + 50).toString(),
      };
      setTableData([newEntry, ...tableData]);
      setScanning(false);
    } else {
      // Keep scanning
      setTimeout(() => captureAndSendFrame(), 1000);
    }
  };

  const handleScanQR = () => {
    if (!cameraOn) {
      alert('Start the camera first!');
      return;
    }
    setScanning(true);
    captureAndSendFrame();
  };

  const averagePercentage =
    tableData.length > 0
      ? Math.round(tableData.reduce((sum, row) => sum + parseInt(row.Percentage), 0) / tableData.length)
      : 0;

  useEffect(() => {
    return () => {
      stopCamera(); // Stop camera on unmount
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Scan QR Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

            <video ref={videoRef} width="640" height="480" autoPlay muted className="rounded-md mb-4" />
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />

            <div className="flex gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                onClick={startCamera}
                disabled={cameraOn}
              >
                <Camera className="inline-block mr-2 w-5 h-5" />
                Start Camera
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                onClick={stopCamera}
                disabled={!cameraOn}
              >
                <CameraOff className="inline-block mr-2 w-5 h-5" />
                Stop Camera
              </button>
            </div>

            <button
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              onClick={handleScanQR}
              disabled={scanning || !cameraOn}
            >
              {scanning ? 'Scanning...' : 'Scan QR'}
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-lg h-full">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Attendance Record</h2>
              <div className="flex gap-4">
              <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              onClick={() => router.push('/dashboard/add-student')}
            >
              Add New Student
            </button>
                <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center">
                  <Users className="text-cyan-400 mr-2" />
                  <span className="text-lg">{tableData.length} Students</span>
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
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="py-4 px-6">
                        {/* <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                          <UserRound className="text-cyan-400 h-6 w-6" />
                        </div> */}
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-600">
                          <img
                            src={row.photoPath}
                            alt={row.studentName}
                            className="h-full w-full object-cover"
                          />
                        </div>

                      </td>
                      <td className="py-4 px-6 font-medium">{row.studentName}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Clock className="text-cyan-400 mr-2 h-4 w-4" />
                          <span>{row.Enterytime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">{row.Percentage}%</td>
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
