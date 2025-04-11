import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  const body = await req.json();
  const imageData = body.image;

  // Decode base64 and write to a temporary file
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
  const imagePath = path.join(process.cwd(), 'temp.jpg');
  fs.writeFileSync(imagePath, base64Data, 'base64');

  const pythonPath = '/usr/local/mirasys/venv/bin/python';
  const scriptPath = path.join(process.cwd(), 'scan_qr.py');

  return new Promise((resolve) => {
    const pythonProcess = spawn(pythonPath, [scriptPath, imagePath]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString().trim();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      fs.unlinkSync(imagePath); // clean up
      if (code === 0 && result) {
        resolve(NextResponse.json({ result }));
      } else {
        resolve(NextResponse.json({ error: error || 'No QR code detected' }));
      }
    });
  });
}
