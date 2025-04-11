import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // console.log('Received data:', data); // Debug log

  const { name, address, enrollment } = data;

  const tempImagePath = path.join(process.cwd(), 'public', 'students', `${enrollment}.jpg`);
  const pythonScriptPath = path.join(process.cwd(), 'scripts', 'generate_face_vector.py');
  const pythonPath = '/usr/local/mirasys/venv/bin/python';

  // Save student image temporarily for embedding
  try {
    const imageBuffer = Buffer.from(data.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFileSync(tempImagePath, imageBuffer);
  } catch (err) {
    console.error('Error saving image:', err);
    return NextResponse.json({ error: 'Image saving failed' }, { status: 500 });
  }

  return new Promise((resolve) => {
    const pythonProcess = spawn(pythonPath, [pythonScriptPath, tempImagePath, enrollment, name, address]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ success: true, message: 'Student added successfully' }));
      } else {
        console.error('Python error:', error);
        resolve(NextResponse.json({ error: 'Failed to generate embedding or save to Qdrant' }, { status: 500 }));
      }
    });
  });
}
